import Base from "containers/Base/Base.component";
import NextHead from "next/head";

import { createAPIInstance } from "helpers/apiHelper";
import { fireBaseFunctions, headerFunctions } from "@lk/core-utils";
import { CONFIG, LOCALE } from "../constants";
import { getCookie } from "@/helpers/defaultHeaders";
import {
  ConfigErrorType,
  ConfigType,
  LocalErrorType,
  LocalType,
} from "@/types/coreTypes";
import PageError from "containers/PageError/PageError.component";
import { fallBackConfig, fallBackLocale } from "@/constants/fallBackData";
import { DeviceTypes } from "@/types/baseTypes";

interface PageErrorType
  extends ConfigType,
    ConfigErrorType,
    LocalType,
    LocalErrorType {
  headerData: {
    imageLink: [{ altText: string; url: string; imgLink: string }];
    menu: [{ url: string; label: string; id: string; data: any; type: string }];
  };
  headerDataError: any;
  sessionId: string;
  deviceType: DeviceTypes;
}

export async function getServerSideProps() {
  const configApi = createAPIInstance({
    url:
      process.env.NEXT_PUBLIC_CONFIG_URL ||
      "https://stage.lenskart.io/api/v1/static/",
  });

  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const { data: localeData, error: localeError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: configError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi, deviceType);
  return {
    props: {
      localeData: localeData,
      localeError: localeError,
      configData: configData,
      configError: configError,
      headerDataError: headerDataError,
      headerData: headerData,
      sessionId: `${getCookie(`clientV1_${country}`)}`,
      deviceType: deviceType,
    },
  };
}

export default function NotFoundPage({
  configData,
  configError,
  localeData,
  localeError,
  headerDataError,
  headerData,
  sessionId,
  deviceType,
}: PageErrorType) {
  const configDataPass = configError.isError ? fallBackConfig : configData;
  const localeDataPass = localeError.isError ? fallBackLocale : localeData;

  return (
    <Base
      sessionId={sessionId}
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
      <NextHead>
        <title>Error Page</title>
      </NextHead>
      <PageError
        configData={configDataPass}
        localeData={localeDataPass}
        deviceType={deviceType}
      />
    </Base>
  );
}
