import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { ProductReview, FeedbackPopUp } from "@lk/ui-library";
import { exchangeHeaders, headerArr } from "helpers/defaultHeaders";
import { APIService } from "@lk/utils";
import { APIMethods } from "@/types/apiTypes";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import {
  fireBaseFunctions,
  headerFunctions,
  pdpFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { CONFIG, COOKIE_NAME, LOCALE } from "../constants";
import { DataType } from "@lk/ui-library/lib/Types/general";
import Base from "containers/Base/Base.component";
import { HeaderType } from "@/types/state/headerDataType";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { dataLocale } from "containers/Base/footerData";
import { fetchUserDetails } from "@/redux/slices/userInfo";
import {
  dispatchPostReview,
  resetReviewData,
} from "@/redux/slices/productDetailInfo";
import { ProductDetailType } from "@/types/productDetails";
import usePrevious from "hooks/usePrevious";

export interface feedbackType {
  sessionId: string;
  localeData: DataType;
  userData: DataType;
  configData: DataType;
  headerData: HeaderType;
  productDetail: ProductDetailType;
}

const CustomerFeedback = ({
  localeData,
  configData,
  userData,
  sessionId,
  headerData,
  productDetail,
}: feedbackType) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showPopUp, setShowPopUp] = useState(false);
  const { subdirectoryPath, country } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const userDetails = useSelector((state: RootState) => state.userInfo);
  const productDetailInfo = useSelector(
    (state: RootState) => state.productDetailInfo
  );
  const prevReviewMessage = usePrevious(productDetailInfo.reviewMessage);
  const router = useRouter();
  const { pId } = router.query;
  const pid = Number(pId);

  // console.log("userDetails: ", userDetails);

  useEffect(() => {
    dispatch(fetchUserDetails({ sessionId: sessionId }));
  }, [sessionId, dispatch]);

  function submitHandler(reviewData: object, email: string) {
    // console.log(reviewData, email);
    dispatch(
      dispatchPostReview({
        pid: pid,
        email: email,
        review: reviewData,
        sessionId,
      })
    );
  }

  useEffect(() => {
    if (
      productDetailInfo.reviewMessage !== prevReviewMessage &&
      productDetailInfo.reviewMessage
    )
      setShowPopUp(true);
    return () => {
      dispatch(resetReviewData());
    };
  }, [dispatch, productDetailInfo?.reviewMessage, prevReviewMessage]);

  return (
    <Base
      localeData={localeData}
      sessionId={sessionId}
      isExchangeFlow={false}
      configData={configData}
      headerData={headerData}
      sprinkularBotConfig={
        configData?.SPRINKLR_BOT_CONFIG &&
        JSON.parse(configData.SPRINKLR_BOT_CONFIG)
      }
      languageSwitchData={configData?.LANGUAGE_SWITCH_DATA}
      hideFooter={true}
      trendingMenus={configData?.TRENDING_MENUS}
    >
      {productDetail && userDetails?.userDetails?.firstName && (
        <ProductReview
          productImage={productDetail?.imageUrlDetail?.[0]?.imageUrl}
          productTitle={productDetail?.brandName}
          productDec={productDetail?.productName}
          dataLocale={localeData}
          fullName={
            userDetails?.userDetails?.firstName +
            (userDetails?.userDetails?.lastName
              ? " " + userDetails?.userDetails?.lastName
              : "")
          }
          email={userDetails.email}
          submitFunction={submitHandler}
        />
      )}
      {showPopUp && (
        <FeedbackPopUp
          dataLocale={dataLocale}
          onClick={() => router.replace("/")}
        />
      )}
      {productDetailInfo.reviewLoading}
    </Base>
  );
};

export default CustomerFeedback;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
    .setHeaders(headerArr)
    .setMethod(APIMethods.GET);

  const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`)
    .setHeaders(headerArr)
    .setMethod(APIMethods.GET);
  const { req, res } = context;
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });
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
  } else {
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(`clientV1_${country}`, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }
  const sessionId = `${getCookie(`clientV1_${country}`, { req, res })}`;
  api.sessionToken = sessionId;
  const { data: localeData } = await fireBaseFunctions.getConfig(
    LOCALE,
    configApi
  );
  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const { data: configData } = await fireBaseFunctions.getConfig(
    CONFIG,
    configApi
  );
  const subdirectoryPath =
    process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
      ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
      : "";
  const productApi = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
    .setHeaders([...headerArr, ...exchangeHeaders])
    .setMethod(APIMethods.GET);
  productApi.sessionToken = `${getCookie(`clientV1_${country}`)}`;
  const { data: prodDetail, error: err } = await pdpFunctions.getProductDetails(
    context.query.pId,
    productApi,
    subdirectoryPath
  );
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi, deviceType);
  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);

  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });
  return {
    props: {
      sessionId: `${getCookie(`clientV1_${country}`, { req, res })}`,
      localeData: localeData,
      configData: configData,
      userData: userData.customerInfo,
      headerData: headerData,
      productDetail: prodDetail.detailData,
    },
  };
};
