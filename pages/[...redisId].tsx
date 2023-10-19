import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { hasCookie, setCookie, getCookie } from "@/helpers/defaultHeaders";

//> Packages
import { APIService } from "@lk/utils";
import {
  pageFunctions,
  sessionFunctions,
  fireBaseFunctions,
  headerFunctions,
  getJsonDataFunctions,
} from "@lk/core-utils";

//> Components
import Base from "containers/Base/Base.component";
import ProductDetail from "containers/ProductDetail/ProductDetail.component";
import Category from "../containers/Category/Category.component";
import CMS from "containers/CMS/CMS.component";
import NextHead from "next/head";
import { langCodeAllowed } from "../helpers/seoLocales";

//> Helpers
import { exchangeHeaders, headerArr } from "helpers/defaultHeaders";
import { createAPIInstance } from "helpers/apiHelper";

//>Type
import { CategoryParams, defaultCategoryParams } from "@/types/categoryTypes";
import { APIMethods, ResponseData } from "@/types/apiTypes";
import { DeviceTypes, PageTypes } from "@/types/baseTypes";

//> Constants
import { CONFIG, COOKIE_NAME, LOCALE, cmsURL } from "../constants";

//> Hooks
import useUpdateInitialState from "hooks/useUpdateInitialState";
import useCustomerState from "hooks/useCustomerState";
import Col from "containers/Col/Col.component";
import { DataType } from "@/types/coreTypes";
import HomePage from "containers/Home/Home.component";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { userFunctions } from "@lk/core-utils";
import { getDefaultParams, getParams } from "@/helpers/serverHelpers";

const RedisPage = ({
  data,
  error,
  pageType,
  configData,
  localeData,
  headerData,
  homePageJson,
  exchangeFlow,
  userData: SsrUserData,
}: ResponseData) => {
  const router = useRouter();
  useEffect(() => {
    if (router?.asPath?.includes?.(".com#")) {
      window.location.href = router.asPath.replace(".com#", ".com?");
    } else if (router?.asPath?.includes?.(".html#")) {
      window.location.href = router.asPath.replace(".html#", ".html?");
    }
  }, []);

  const SEOInfo = data?.pageData;
  const {
    id,
    userData,
    pageCount,
    pageSize,
    categoryData,
    productListData,
    productDetailData,
    cmsData,
    colData,
  } = data;

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
    useMounted: true,
    userData: userData,
    SsrUserData,
  });
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const getSeoLinks = (alternateInfo: DataType) => {
    if (!alternateInfo || typeof alternateInfo !== "object") return null;
    const keys = Object.keys(alternateInfo);
    return keys.map((item: string, index: number) => {
      let url = alternateInfo[item];
      return (
        <link
          rel="alternate"
          key={index}
          href={url}
          hrefLang={item.toLowerCase()}
        />
      );
    });
  };

  const getDefaultLinks = (alternateInfo: any) => {
    return alternateInfo.map((item: any, index: number) => {
      return (
        <link
          rel="alternate"
          key={index}
          href={item.url}
          hrefLang={`${item.defaultLanguage}-${item.countryCode}`}
        />
      );
    });
  };

  const getDescription = (pageType: PageTypes) => {
    if (pageType === PageTypes.PLP) {
      if (categoryData?.seo?.description) {
        return categoryData?.seo?.description;
      }
    } else if (pageType === PageTypes.PDP) {
      if (productDetailData?.seo?.description) {
        return productDetailData?.seo?.description;
      }
    } else if (pageType === PageTypes.CMS) {
      return "";
    }

    return `${localeData?.SHOP || ""} ${categoryData?.categoryName || ""} ${
      localeData?.ONLINE_FROM_LENSKART || ""
    } ${process.env.NEXT_PUBLIC_APP_COUNTRY || ""} ${
      localeData?.AT_BEST_PRICES || ""
    }`;
  };

  const getTitle = (pageType: PageTypes) => {
    if (pageType === PageTypes.PLP) {
      if (categoryData?.seo?.title) {
        return categoryData?.seo?.title;
      }
    } else if (pageType === PageTypes.PDP) {
      if (productDetailData?.seo?.title) {
        return productDetailData?.seo?.title;
      }
    } else if (pageType === PageTypes.CMS) {
      return "";
    }
    return `${localeData?.BUY || ""} ${categoryData?.categoryName || ""} ${
      localeData?.ONLINE_DASH_LENSKART || ""
    } ${process.env.NEXT_PUBLIC_APP_COUNTRY || ""}`;
  };

  const getXDefault = () => {
    if (SEOInfo?.alternate) {
      const countryKey = Object.keys(SEOInfo.alternate);
      return countryKey.includes("en-IN") ? SEOInfo.alternate["en-IN"] : null;
    } else {
      return null;
    }
  };

  const dataSeoAlternateFirebase =
    configData?.SEO_ALTERNATE_STATIC_PAGES &&
    JSON.parse(configData?.SEO_ALTERNATE_STATIC_PAGES);
  const keysArray: any = Object.keys(langCodeAllowed);
  let linkArray: any = [];
  keysArray.map((keys: any) =>
    linkArray.push({
      rel: "alternate",
      url: `${langCodeAllowed?.[keys]?.domain}${router.asPath}`,
      defaultLanguage: langCodeAllowed?.[keys]?.defaultLanguage,
      countryCode: langCodeAllowed?.[keys]?.countryCode,
    })
  );

  let hideFooter: boolean = false;

  if (typeof document !== "undefined") {
    hideFooter =
      document.getElementById("next") === null ||
      router.asPath.includes("/recaptcha");
  }

  return (
    <Base
      sessionId={`${getCookie(
        `clientV1_${process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase()}`
      )}`}
      headerData={headerData}
      configData={configData}
      isExchangeFlow={exchangeFlow.isExchangeFlow}
      localeData={localeData}
      trendingMenus={configData?.TRENDING_MENUS}
      sprinkularBotConfig={
        configData?.SPRINKLR_BOT_CONFIG &&
        JSON.parse(configData.SPRINKLR_BOT_CONFIG)
      }
      languageSwitchData={configData?.LANGUAGE_SWITCH_DATA}
      pageType={pageType}
      hideFooter={hideFooter}
    >
      <NextHead>
        {pageType !== PageTypes.SPECIAL_CATEGORY && (
          <>
            {SEOInfo?.alternate
              ? getSeoLinks(SEOInfo.alternate)
              : getSeoLinks(
                  homePageJson.homePageData?.homeData?.seo.alternate ||
                    SEOInfo?.alternate
                )}
            {SEOInfo?.canonical ||
              (homePageJson.homePageData?.homeData?.seo.canonical && (
                <link
                  rel="canonical"
                  href={
                    SEOInfo?.canonical ||
                    homePageJson.homePageData?.homeData?.seo.canonical
                  }
                />
              ))}
            {getXDefault() && (
              <link rel="alternate" href={getXDefault()} hrefLang="x-default" />
            )}
            <title>{getTitle(pageType) || ""}</title>
            <meta name="description" content={getDescription(pageType) || ""} />
          </>
        )}

        {pageType === PageTypes.CMS && (
          <>
            {dataSeoAlternateFirebase &&
            Object.keys(dataSeoAlternateFirebase) &&
            Object.keys(dataSeoAlternateFirebase).includes(router.asPath)
              ? getSeoLinks(dataSeoAlternateFirebase.alternate)
              : getDefaultLinks(linkArray)}
          </>
        )}

        {pageType === PageTypes.SPECIAL_CATEGORY && (
          <>
            <title>
              {deviceType === DeviceTypes.DESKTOP
                ? homePageJson?.homePageData?.homeData?.seo?.title
                : homePageJson?.homePageData?.metaData?.title}
            </title>
            <meta
              name="description"
              content={
                deviceType === DeviceTypes.DESKTOP
                  ? homePageJson?.homePageData?.homeData?.seo?.description
                  : homePageJson?.homePageData?.metaData?.description
              }
            />
            {getSeoLinks(
              deviceType === DeviceTypes.DESKTOP
                ? homePageJson?.homePageData?.homeData.seo?.alternate
                : homePageJson?.homePageData?.metaData?.alternate
            )}
            <link
              rel="canonical"
              href={
                deviceType === DeviceTypes.DESKTOP
                  ? homePageJson?.homePageData?.homeData?.seo?.canonical
                  : homePageJson?.homePageData?.metaData?.canonical
              }
            />
            <link
              rel="alternate"
              href={
                deviceType === DeviceTypes.DESKTOP
                  ? homePageJson?.homePageData?.homeData?.seo?.xDefault
                  : homePageJson?.homePageData?.metaData?.xDefault
              }
              hrefLang="x-default"
            />
            {getDefaultLinks(linkArray)}
          </>
        )}
      </NextHead>
      <>
        {pageType === PageTypes.SPECIAL_CATEGORY && (
          <HomePage
            homePageData={
              deviceType === DeviceTypes.DESKTOP
                ? homePageJson
                : homePageJson.homePageData
            }
            configData={configData}
            localeData={localeData}
            userInfo={userInfo}
            pageInfo={pageInfo}
            className={"categoryLanding"}
          />
        )}
        {pageType === PageTypes.PLP && (
          <Category
            categoryData={categoryData}
            productData={productListData}
            configData={configData}
            localeData={localeData}
            pageSize={pageSize}
            pageCount={pageCount}
            exchangeFlow={exchangeFlow}
            windowHeight={880}
            userData={userData}
          />
        )}
        {pageType === PageTypes.PDP && (
          <ProductDetail
            categoryData={categoryData}
            productDetailData={productDetailData}
            id={id}
            sessionId={`${getCookie(
              `clientV1_${process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase()}`
            )}`}
            wishListData={userData.wishlist}
            configData={configData}
            localeData={localeData}
            exchangeFlow={exchangeFlow}
          />
        )}
        {pageType === PageTypes.CMS && (
          <CMS fetchData={false} cmsData={cmsData} />
        )}
        {pageType === PageTypes.COL && (
          <Col
            jsonData={colData}
            configData={configData}
            localeData={localeData}
          />
        )}
      </>
    </Base>
  );
};

export default RedisPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;
  const { redisId, pageCount } = context.query;
  let currentSessionId;

  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const subdirectoryPath =
    process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
      ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
      : "";
  //NOTE: Check if session is available and value is also not empty.
  const isSessionAvailable =
    hasCookie(COOKIE_NAME, { req, res }) &&
    getCookie(COOKIE_NAME, { req, res }) !== "";

  //NOTE: If session is not available, create a new session and set in cookie.
  if (!isSessionAvailable) {
    const sessionAPI = createAPIInstance({ method: APIMethods.POST });
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      sessionAPI
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(COOKIE_NAME, sessionId.sessionId, { req, res });
    currentSessionId = sessionId.sessionId;
  } else {
    currentSessionId = `${getCookie(COOKIE_NAME, { req, res })}`;
  }

  if (redisId && redisId.length > 0) {
    //NOTE: If Session is available, set the session to API instance.
    //DONE: use helper functions to create api instance.
    const api = createAPIInstance({ sessionToken: currentSessionId });
    const configApi = createAPIInstance({
      url: process.env.NEXT_PUBLIC_CONFIG_URL,
    });

    //NOTE: Use Promises.all over asysc/await as it will take less time to Fetch Configs
    const promises = [
      headerFunctions.getHeaderData(configApi, deviceType),
      fireBaseFunctions.getConfig(LOCALE, configApi),
      fireBaseFunctions.getConfig(CONFIG, configApi),
    ];
    const [
      { data: headerData, error: headerDataError },
      { data: localeData, error: localeError },
      { data: configData, error: configError },
    ] = await Promise.all(promises);

    if (configError.isError || headerDataError.isError || localeError.isError) {
      //NOTE: If any error, return 404 page.
      return {
        notFound: true,
      };
    }

    //DONE: Refactored DEFAULT PARAMS & PARAMS Logic to reusable function.
    const defaultParams: defaultCategoryParams = getDefaultParams(pageCount);
    const params: CategoryParams[] = getParams(query);

    let specialCategoryJson = {};
    let specialCategoryJsonError = {};
    let pageTypeObj;
    //NOTE: Check if page is driven through JSON from firebase.
    //REFACTOR: Need to change SPECIAL_CATEGORY_ARRAY, no need to stringify it in firebase.
    if (
      configData.SPECIAL_CATEGORY_ARRAY &&
      JSON.parse(configData.SPECIAL_CATEGORY_ARRAY).includes(req.url)
    ) {
      /**
       * REFACTOR: Need to re-visit this function as we are passing api and config api.
       */
      const {
        data: scData,
        error: scDataError,
        pageType: pageType,
      } = await getJsonDataFunctions.getJsonData(
        JSON.parse(configData.SPECIAL_CATEGORY_ARRAY),
        req.url,
        configApi,
        api,
        process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase() === DeviceTypes.MOBILE
          ? true
          : false
      );

      if (scDataError.isError) {
        return {
          notFound: true,
        };
      }
      specialCategoryJson = { ...scData };
      specialCategoryJsonError = { ...scDataError };
      pageTypeObj = pageType;
    }

    /*
    REFACTOR: Need to refactor return & exchange logic.
    REFACTOR: Not touching this as its not currently used in prod.
    */
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

    //DONE: Use Helper Function for API Instance
    const cmsApi = createAPIInstance({
      url: cmsURL,
      sessionToken: currentSessionId,
    });
    let dataObj, pageError, pageDataObj;
    if (!Object.keys(specialCategoryJson).length) {
      //NOTE: Get Corresponding data for PDP or PLP or CMS.
      /* 
      REFACTOR: Need to refactor this function as we are creating CMS
      REFACTOR: Instance everything and passing it to function.
      */
      const { data, error, pageType, pageData } =
        await pageFunctions.getPageData(
          redisId as string[],
          api,
          `${subdirectoryPath}`,
          defaultParams,
          params,
          postcheckParams,
          cmsApi,
          process.env.NEXT_PUBLIC_APP_CLIENT
        );
      dataObj = { ...data };
      pageError = { ...error };
      pageTypeObj = pageType;
      pageDataObj = { ...pageData };
      setCookie(COOKIE_NAME, dataObj?.userData?.id, { req, res });
    }

    //DONE: Use Helper Function for API Instance
    const userAPIInstance = createAPIInstance({
      sessionToken: currentSessionId,
    });
    const { data: userData, error: userError } =
      await userFunctions.getUserInfo(userAPIInstance);
    if (!userError.isError) {
      setCookie("hasPlacedOrder", userData.hasPlacedOrder);
    }
    if (pageError?.isError) {
      return {
        notFound: true,
      };
    }
    //REFACTOR: Need to re-visit this object as this object as we are sending duplicate data in response.
    return {
      props: {
        data: {
          ...dataObj,
          ...defaultParams,
          pageData: { ...pageDataObj },
        },
        error: { ...pageError },
        pageType: pageTypeObj,
        configData,
        localeData,
        headerData,
        userData: userError?.isError ? userError : userData,
        homePageJson: { ...specialCategoryJson },
        exchangeFlow: {
          isExchangeFlow,
          returnOrderId: returnOrderId || 0,
          returnItemId: returnItemId || 0,
        },
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
