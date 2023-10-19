//> Default
import { GetServerSideProps } from "next";
import Router from "next/router";
import { useSelector } from "react-redux";
import NextHead from "next/head";

//> Packages
import { Header } from "@lk/ui-library";
import { fireBaseFunctions } from "@lk/core-utils";

//> Types
import { APIMethods, ResponseData } from "@/types/apiTypes";

//> Component
import Ditto from "containers/Ditto/Ditto.component";

//> Helper
import { createAPIInstance } from "helpers/apiHelper";

//> Redux
import { RootState } from "@/redux/store";

//> Constants
import { LOCALE, CONFIG, COOKIE_NAME } from "../constants";
import { DeviceTypes } from "@/types/baseTypes";
import { headerFunctions } from "@lk/core-utils";
import Base from "containers/Base/Base.component";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { sessionFunctions } from "@lk/core-utils";
import { APIService, extractUtmParams } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import useCustomerState from "hooks/useCustomerState";
import { DataType } from "@/types/coreTypes";
import { useEffect } from "react";
import { userProperties } from "helpers/userproperties";
import { triggerVirtualPageView } from "helpers/virtualPageView";

const CompareLooks = ({
  data,
  localeData,
  configData,
  headerData,
  sessionId,
}: ResponseData) => {
  useCustomerState({
    useMounted: false,
    userData: data.customerInfo,
  });

  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase();
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

  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  useEffect(() => {
    window.fbq("trackCustom", "3DTryOn", {});
  }, []);
  useEffect(() => {
    const pageName = "cygnus-initiated";
    if (!userInfo.userLoading) {
      userProperties(userInfo, pageName, pageInfo, configData);
      const utmParameters =
        typeof window !== "undefined" &&
        window &&
        extractUtmParams(window.location.search);
      triggerVirtualPageView(
        userInfo,
        utmParameters,
        pageInfo,
        "Try AR frames"
      );
    }
  }, [userInfo.userLoading]);

  const dataSeoAlternateFirebase =
    configData?.SEO_ALTERNATE_STATIC_PAGES &&
    JSON.parse(configData?.SEO_ALTERNATE_STATIC_PAGES);
  return (
    <>
      {deviceType === DeviceTypes.DESKTOP ? (
        <>
          <Base
            sessionId={sessionId}
            headerData={headerData}
            // topLinks={configData?.TOP_LINKS}
            configData={configData}
            isExchangeFlow={false}
            localeData={localeData}
            trendingMenus={configData?.TRENDING_MENUS}
            sprinkularBotConfig={
              configData?.SPRINKLR_BOT_CONFIG &&
              JSON.parse(configData.SPRINKLR_BOT_CONFIG)
            }
            //footerDataMobile={configData?.FOOTER_DATA_MOBILE}
            languageSwitchData={configData?.LANGUAGE_SWITCH_DATA}
          >
            <NextHead>
              {getSeoLinks(dataSeoAlternateFirebase?.compareLooks?.alternate)}
              <link
                rel="canonical"
                href={dataSeoAlternateFirebase?.compareLooks?.canonical}
              />
              <link
                rel="alternate"
                href={dataSeoAlternateFirebase?.compareLooks?.canonical}
                hrefLang="x-default"
              />
              <style
                dangerouslySetInnerHTML={{
                  __html: `#spr-live-chat-app{display: none;}`,
                }}
              ></style>
            </NextHead>
            <Ditto localeData={localeData} />
          </Base>
        </>
      ) : (
        <>
          <NextHead>
            <style
              dangerouslySetInnerHTML={{
                __html: `#spr-live-chat-app{display: none;}`,
              }}
            ></style>
          </NextHead>
          <Ditto localeData={localeData} />
        </>
      )}
    </>
  );
};

export default CompareLooks;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

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

  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const configApi = createAPIInstance({
    url:
      process.env.NEXT_PUBLIC_CONFIG_URL ||
      "https://stage.lenskart.io/api/v1/static/",
  });
  const { data: localeData, error: localeError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: configError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi, deviceType);
  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);
  if (
    configError.isError ||
    headerDataError.isError ||
    localeError.isError ||
    userError.isError
  ) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });

  // console.log(headerData, country);

  return {
    props: {
      data: userData,
      localeData,
      configData,
      headerData,
      sessionId: `${getCookie(COOKIE_NAME, { req, res })}`,
    },
  };
};
