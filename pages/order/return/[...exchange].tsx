import OrderPage from "@/components/Orders/OrderPage";
import { CONFIG, COOKIE_NAME, LOCALE } from "../../../constants";
import { APIMethods } from "@/types/apiTypes";
import { TypographyENUM } from "@/types/baseTypes";
import { headerFunctions } from "@lk/core-utils";
import { fireBaseFunctions, sessionFunctions } from "@lk/core-utils";
import { Header } from "@lk/ui-library";
import { APIService } from "@lk/utils";
import Base from "containers/Base/Base.component";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { createAPIInstance } from "helpers/apiHelper";
import { headerArr } from "helpers/defaultHeaders";
import useCustomerState from "hooks/useCustomerState";
import { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";

const FontCommon = styled.div`
  font-family: ${TypographyENUM.defaultBook};
  font-synthesis: none;
  color: #333;
`;

const Exchange = ({ data }: any) => {
  useCustomerState({
    useMounted: false,
    userData: data.userData.customerInfo,
  });
  return (
    <Base
      sessionId={data.userData.customerInfo.id}
      headerData={data.headerData}
      isExchangeFlow={false}
      trendingMenus={data?.configData?.TRENDING_MENUS}
      localeData={data.localeData}
      configData={data.configData}
      languageSwitchData={data.configData?.LANGUAGE_SWITCH_DATA}
    >
      <FontCommon>
        <OrderPage
          userdata={data.userData}
          configData={data.configData}
          localeData={data.localeData}
        />
      </FontCommon>
    </Base>
  );
};

export default Exchange;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;

  const { exchange } = query;

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
  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const { data: localeData, error: configError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: redisConfigError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi, deviceType);
  // console.log(localeData, userData, configData, headerData);
  // console.log(
  //   configError,
  //   redisConfigError,
  //   headerDataError,
  //   "-----------------=====>"
  // );
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
