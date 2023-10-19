import { AppDispatch, RootState } from "@/redux/store";
import { APIMethods, ResponseData } from "@/types/apiTypes";
import { CategoryParams, defaultCategoryParams } from "@/types/categoryTypes";
import {
  fireBaseFunctions,
  headerFunctions,
  pageFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { NoResultPage } from "@lk/ui-library";
import Base from "containers/Base/Base.component";
import Category from "containers/Category/Category.component";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { createAPIInstance } from "helpers/apiHelper";
import { exchangeHeaders, headerArr } from "helpers/defaultHeaders";
import useCustomerState from "hooks/useCustomerState";
import useUpdateInitialState from "hooks/useUpdateInitialState";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import NextHead from "next/head";
import {
  CONFIG,
  DEFAULT_PAGE_COUNT,
  DEFAULT_PAGE_SIZE,
  LOCALE,
  QUERY_SUGGESTION_CLICK_FROM,
  SEARCH_CONFIG,
} from "../../constants";

// import NoResultPage from "@/components/AlgoliaSearch/NoResult/NoResultPage.component";
import { updateSearchState } from "@/redux/slices/algoliaSearch";
import { useDispatch, useSelector } from "react-redux";
import { searchNoResult, searchPageLoad } from "helpers/userproperties";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { DeviceTypes } from "@/types/baseTypes";
import { useRouter } from "next/router";

const Index = ({
  data,
  error,
  pageType,
  configData,
  localeData,
  headerData,
  exchangeFlow,
  noResultData,
}: ResponseData) => {
  const {
    id,
    userData,
    pageCount,
    pageSize,
    categoryData,
    productListData,
    productDetailData,
  } = data.data;
  const searchData = useSelector((state: RootState) => state.algoliaSearch);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const enableAlgolia =
    configData?.ENABLE_ALGOLIA_CONFIG &&
    pageInfo.deviceType == DeviceTypes.MOBILE;
  const dispatch = useDispatch<AppDispatch>();
  useUpdateInitialState({
    pageCount,
    pageSize,
    id,
    categoryData,
    productListData,
    productDetailData,
    pageType,
  });
  useCustomerState({
    useMounted: false,
    userData: userData,
  });
  const router = useRouter();

  useEffect(() => {
    const query: any = sessionStorageHelper.getItem("query")!;
    dispatch(updateSearchState({ showResult: false, isSelected: false }));
    const searchType = localStorage.getItem(QUERY_SUGGESTION_CLICK_FROM) ?? "";
    if (productListData.length == 0) {
      searchNoResult(userData, searchType, query, "unsuccessful");
      searchPageLoad(userData, searchType, query, "unsuccessful");
    }
  }, []);
  return (
    <Base
      sessionId={userData.id}
      headerData={headerData}
      configData={configData}
      isExchangeFlow={exchangeFlow.isExchangeFlow}
      localeData={localeData}
      trendingMenus={configData?.TRENDING_MENUS}
      languageSwitchData={configData?.LANGUAGE_SWITCH_DATA}
      hideFooter={enableAlgolia && productListData.length == 0}
    >
      <NextHead>
        <title>Category Search</title>
      </NextHead>
      {enableAlgolia ? (
        productListData.length > 0 ? (
          <Category
            categoryData={categoryData}
            productData={productListData}
            configData={configData}
            localeData={localeData}
            pageSize={pageSize}
            pageCount={pageCount}
            exchangeFlow={exchangeFlow}
            search={true}
            windowHeight={880}
            userData={userData}
          />
        ) : (
          <NoResultPage
            noResultData={noResultData}
            query={router?.query?.q}
            isError={searchData.isError}
          />
        )
      ) : (
        <Category
          categoryData={categoryData}
          productData={productListData}
          configData={configData}
          localeData={localeData}
          pageSize={pageSize}
          pageCount={pageCount}
          exchangeFlow={exchangeFlow}
          search={true}
          windowHeight={880}
          userData={userData}
        />
      )}
    </Base>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;

  const { pageSize, pageCount } = context.query;
  const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
    headerArr
  );
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });

  //> If session is not available, create a new session and set in cookie.
  if (!isSessionAvailable) {
    api.setMethod(APIMethods.POST);
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      api
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(`clientV1_${country}`, sessionId.sessionId, { req, res });
    api.resetHeaders();
    api.sessionToken = sessionId.sessionId;
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }

  if (query && Object.keys(query).length) {
    //> If Session is available, set the session to API instance.
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(`clientV1_${country}`, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);

    //> New API Instance for fetching configs.
    //* Reason -> BASE URL is different and need to make API call for both.
    const configApi = createAPIInstance({
      url:
        process.env.NEXT_PUBLIC_CONFIG_URL ||
        "https://stage.lenskart.io/api/v1/static/",
    });
    const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;

    //> Fetch Configs
    const { data: localeData, error: localeError } =
      await fireBaseFunctions.getConfig(LOCALE, configApi);
    const { data: configData, error: configError } =
      await fireBaseFunctions.getConfig(CONFIG, configApi);
    const { data: headerData, error: headerDataError } =
      await headerFunctions.getHeaderData(configApi, deviceType);
    const { data: noResultData, error: noResultDataError } =
      await fireBaseFunctions.getConfig(SEARCH_CONFIG, configApi);

    if (configError.isError || headerDataError.isError || localeError.isError) {
      return {
        notFound: true,
      };
    }

    //> Get Default Params
    const defaultParams: defaultCategoryParams = {
      pageCount: pageCount ? parseInt(pageCount as string) : DEFAULT_PAGE_COUNT,
      pageSize: pageSize ? parseInt(pageSize as string) : DEFAULT_PAGE_SIZE,
    };

    //> Get Filter Params
    const params: CategoryParams[] = [];
    Object.keys(query).map((key) => {
      if (
        key !== "redisId" &&
        key !== "pageCount" &&
        key !== "pageSize" &&
        key !== "q" &&
        key !== "dir" &&
        key !== "gan_data" &&
        key !== "sort" &&
        key !== "search" &&
        key != "similarProductId"
      ) {
        if (query[key]) {
          params.push({
            key:
              !(configData?.ENABLE_ALGOLIA_CONFIG &&
              deviceType == DeviceTypes.MOBILE)
                ? "filter_" + key
                : key,
            value:
              typeof query[key] === "string"
                ? (query[key] as string)?.split(",")
                : Array.isArray(query[key])
                ? ((query[key]?.toString() || "") as string)?.split(",")
                : [],
          });
        }
      }
    });
    if (query["sort"]) {
      params.push(
        { key: "sort", value: [query["sort"].toString()] },
        { key: "dir", value: ["desc"] },
        { key: "gan_data", value: ["true"] }
      );
    }

    const isExchangeFlow =
      getCookie("postcheckExchangeNP", { req, res }) || false;
    if (isExchangeFlow) {
      api.resetHeaders();
      api.setHeaders([...headerArr, ...exchangeHeaders]);
    }
    const returnOrderId = getCookie("postcheckOrderId", { req, res }) || null;
    const returnItemId = getCookie("postcheckItemId", { req, res }) || null;
    const postcheckParams = [];
    if (returnOrderId) {
      postcheckParams.push({
        key: "orderId",
        value: [typeof returnOrderId === "string" ? returnOrderId : ""],
      });
    }
    if (returnItemId) {
      postcheckParams.push({
        key: "itemId",
        value: [typeof returnItemId === "string" ? returnItemId : ""],
      });
    }
    // &orderId=1930483284&itemId=559445
    // 150546 2600 1998, 150385 999 397
    //> Get page data, can be a PLP or a PDP.
    const subdirectoryPath =
      process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
        ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
        : "";
    const { data, error, pageType } = await pageFunctions.getSearchData(
      query.q,
      api,
      defaultParams,
      `${subdirectoryPath}`,
      params,
      postcheckParams,
      configData?.ENABLE_ALGOLIA_CONFIG && deviceType == DeviceTypes.MOBILE,
      query?.similarProductId
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: { ...data, ...defaultParams },
        error,
        pageType,
        configData,
        localeData,
        headerData,
        exchangeFlow: {
          isExchangeFlow,
          returnOrderId: returnOrderId || 0,
          returnItemId: returnItemId || 0,
        },
        noResultData,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
