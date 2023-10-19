import { CONFIG, COOKIE_NAME, LOCALE } from "@/constants/index";
import { AppDispatch, RootState } from "@/redux/store";
import { APIMethods } from "@/types/apiTypes";
import { DeviceTypes } from "@/types/baseTypes";
import {
  fireBaseFunctions,
  headerFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { createAPIInstance } from "helpers/apiHelper";
import { headerArr } from "helpers/defaultHeaders";
import { GetServerSideProps } from "next";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NextHead from "next/head";
import MobileCartHeader from "containers/Cart/MobileCartHeader";
import { getOrderData } from "@/redux/slices/myorder";
import { fetchUserDetails } from "@/redux/slices/userInfo";

import { useRouter } from "next/router";

import { resetPaymentState } from "@/redux/slices/paymentInfo";
import {
  DesktopWrapper,
  MobileWrapper,
} from "pageStyles/BookAppointmentStyles";
import SprinklrBot from "@/components/Support/SprinklrBot.component";
import Base from "containers/Base/Base.component";

const Support = ({ data }: any) => {
  const { userData, headerData, configData, localeData } = data || {};
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  let queryParams = { ...router.query };
  const sessionId = (userData && userData?.customerInfo?.id) || "";

  const isLoggedIn = (userData && userData?.customerInfo?.isLoggedIn) || "";

  //* reducer data
  const { deviceType } = useSelector((state: RootState) => state.pageInfo);

  let { userInfo } = useSelector((state: RootState) => state);

  let { countryCode } = useSelector((state: RootState) => state.pageInfo);

  //* component states
  const [email, setEmail] = useState<string | string[]>("");
  const [mobile, setMobile] = useState<string | string[]>("");
  const [order, setOrder] = useState<string>("");

  //* locale and configs

  const { SAFE_SECURE } = localeData || {};

  //* useEffect's
  useEffect(() => {
    const { e = "", m = "", o = "" } = queryParams || {};
    if (
      typeof e === "string" &&
      typeof m === "string" &&
      typeof o === "string"
    ) {
      setEmail(atob(e));
      setMobile(atob(m));
      setOrder(o);
    }
  }, []);

  useEffect(() => {
    if (userData && isLoggedIn) {
      dispatch(fetchUserDetails({ sessionId: sessionId }));
    }
  }, [dispatch, userData]);

  const mobileView = (
    <>
      <NextHead>
        <title>Support</title>
      </NextHead>
      <Base
        sessionId={userData?.id}
        headerData={headerData}
        configData={configData}
        isExchangeFlow={false}
        localeData={localeData}
        trendingMenus={configData?.TRENDING_MENUS}
        sprinkularBotConfig={
          configData?.SPRINKLR_BOT_CONFIG &&
          JSON.parse(configData.SPRINKLR_BOT_CONFIG)
        }
        languageSwitchData={configData?.LANGUAGE_SWITCH_DATA}
      >
        <MobileWrapper>
          <SprinklrBot
            localeData={localeData}
            email={email}
            mobile={mobile}
            order={order}
            configData={configData}
            userInfo={userInfo}
            sessionId={sessionId}
            countryCode={countryCode}
            deviceType={deviceType || "mobilesite"}
          />
        </MobileWrapper>
      </Base>
    </>
  );

  const desktopView = (
    <>
      <NextHead>
        <title>Support</title>
      </NextHead>
      <DesktopWrapper>
        <CartHeader
          appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
          safeText={SAFE_SECURE}
        />
        <SprinklrBot
          localeData={localeData}
          email={email}
          mobile={mobile}
          order={order}
          configData={configData}
          userInfo={userInfo}
          sessionId={sessionId}
          countryCode={countryCode}
          deviceType={deviceType || "mobilesite"}
        />
      </DesktopWrapper>
    </>
  );

  // * returning JSX based on device type.
  return deviceType === DeviceTypes.MOBILE ? mobileView : desktopView;
};

export default Support;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;
  const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
    headerArr
  );
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
    api.setHeaders(headerArr);
  } else {
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(`clientV1_${country}`, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }

  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);
  const configApi = createAPIInstance({
    url: process.env.NEXT_PUBLIC_CONFIG_URL,
  });
  const { data: localeData, error: configError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: redisConfigError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi);
  console.log(localeData, userData, configData, headerData);
  console.log(
    configError,
    redisConfigError,
    headerDataError,
    "-----------------=====>"
  );
  if (
    configError.isError ||
    redisConfigError.isError ||
    headerDataError.isError
  ) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });
  return {
    props: {
      data: {
        userData,
        localeData,
        configData,
        headerData,
      },
      error: userError,
    },
  };
};
