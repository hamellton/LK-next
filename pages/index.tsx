//> Default
import type { GetServerSideProps } from "next";

//> Packages
import {
  fireBaseFunctions,
  headerFunctions,
  homeFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import NextHead from "next/head";
//> Redux
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

//> Types
import { APIMethods } from "@/types/apiTypes";
import { DataType } from "@/types/coreTypes";

//> Components
import Base from "containers/Base/Base.component";
import HomePage from "../containers/Home/Home.component";

//> Helpers
import { getCookie, setCookie, hasCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { createAPIInstance } from "helpers/apiHelper";

//> Hooks
import useCustomerState from "hooks/useCustomerState";

//> Constants
import { COOKIE_NAME, HOME, LOCALE, CONFIG, HOME_MSITE } from "../constants";
import { DeviceTypes } from "@/types/baseTypes";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";
import { getAppSchema, getHomeSchema } from "helpers/schemaHelper";
import Head from "next/head";
export interface HomePageDataType {
  data: DataType;
}

const Home = ({ data }: HomePageDataType) => {
  const {
    userData,
    headerData,
    homePageData,
    localeData,
    homePageMobileData,
    configData,
  } = data;
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  const { mounted } = useCustomerState({
    useMounted: true,
    userData: userData,
  });
  const getSeoLinks = (alternateInfo: DataType) => {
    //GETTING ERROR COMMENTING FOR NOW
    const keys =
      typeof alternateInfo === "object" ? Object.keys(alternateInfo) : [];
    return keys.length ? (
      keys?.map((item: string, index: number) => {
        let url = alternateInfo[item];
        return (
          <link
            rel="alternate"
            key={index}
            href={url}
            hrefLang={item.toLowerCase()}
          />
        );
      })
    ) : (
      <></>
    );
  };

  const SCHEMA_APP =
    data?.configData?.SCHEMA_APP && JSON.parse(data?.configData?.SCHEMA_APP);

  const schema = {
    ...getHomeSchema(data?.configData?.DOMAIN),
  };

  const appSchema = { ...getAppSchema(data?.configData?.DOMAIN, SCHEMA_APP) };

  return (
    <>
      {/* <div>Working</div> */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
      </Head>
      <ErrorBoundary>
        <Base
          headerData={headerData}
          sessionId={userData.id}
          isExchangeFlow={false}
          configData={data.configData}
          localeData={localeData}
          trendingMenus={data.configData?.TRENDING_MENUS}
          languageSwitchData={data.configData?.LANGUAGE_SWITCH_DATA}
        >
          <NextHead>
            <title>
              {deviceType === DeviceTypes.DESKTOP
                ? homePageData?.homePageData?.homeData?.seo?.title
                : homePageMobileData?.metaData?.title}
            </title>
            <meta
              name="description"
              content={
                deviceType === DeviceTypes.DESKTOP
                  ? homePageData?.homePageData?.homeData?.seo?.description
                  : homePageMobileData?.metaData?.description
              }
            />
            {getSeoLinks(
              deviceType === DeviceTypes.DESKTOP
                ? homePageData?.homePageData?.homeData?.seo?.alternate
                : homePageMobileData?.metaData?.alternate
            )}
            <link
              rel="canonical"
              href={
                deviceType === DeviceTypes.DESKTOP
                  ? homePageData?.homePageData?.homeData?.seo?.canonical
                  : homePageMobileData?.metaData?.canonical
              }
            />
            <link
              rel="alternate"
              href={
                deviceType === DeviceTypes.DESKTOP
                  ? homePageData?.homePageData?.homeData?.seo?.xDefault
                  : homePageMobileData?.metaData?.xDefault
              }
              hrefLang="x-default"
            />
          </NextHead>
          <HomePage
            homePageData={
              deviceType === DeviceTypes.DESKTOP
                ? homePageData
                : homePageMobileData
            }
            configData={configData}
            localeData={localeData}
            userInfo={userInfo}
            pageInfo={pageInfo}
          />
        </Base>
      </ErrorBoundary>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const api = createAPIInstance({});
  // console.log(COOKIE_NAME, "COOKIE_NAME");

  const isSessionAvailable = hasCookie(COOKIE_NAME, { req, res });
  console.log("isSessionAvailable", isSessionAvailable);
  if (!isSessionAvailable) {
    api.setMethod(APIMethods.POST);
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      api
    );
    if (error.isError) {
      console.log("error", { error, isSessionAvailable, api });
      return {
        notFound: true,
      };
    }
    setCookie(COOKIE_NAME, sessionId.sessionId, { req, res });
    api.resetHeaders();
    api.sessionToken = sessionId.sessionId;
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  } else {
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(COOKIE_NAME, { req, res })}`;
      // api.sessionToken = `${getCookie(COOKIE_NAME, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }

  const configApi = createAPIInstance({
    url:
      process.env.NEXT_PUBLIC_CONFIG_URL ||
      "https://stage.lenskart.io/api/v1/static/",
  });

  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;

  const promises = [
    headerFunctions.getHeaderData(configApi, deviceType),
    fireBaseFunctions.getConfig(LOCALE, configApi),
    fireBaseFunctions.getConfig(CONFIG, configApi),
    sessionFunctions.validateSession(api),
    homeFunctions.getHomePageData(HOME, configApi, api),
    homeFunctions.getHomePageData(HOME_MSITE, configApi, api),
  ];

  const [
    { data: headerData, error: headerDataError },
    { data: localeData, error: localeDataError },
    { data: configData, error: configError },
    { data: userData, error: userError },
    { data: homePageData, error: homePageError },
    { data: homePageMobileData, error: homePageMobileError },
  ] = await Promise.all(promises);

  // const { data: headerData, error: headerDataError } =
  //   await headerFunctions.getHeaderData(configApi, deviceType);
  // const { data: localeData, error: localeDataError } =
  //   await fireBaseFunctions.getConfig(LOCALE, configApi);
  // const { data: configData, error: configError } =
  //   await fireBaseFunctions.getConfig(CONFIG, configApi);
  // const { data: userData, error: userError } = await sessionFunctions.validateSession(api);
  // const { data: homePageData, error: homePageError } =
  //   await homeFunctions.getHomePageData(HOME, configApi, api);
  // const { data: homePageMobileData, error: homePageMobileError } =
  //   await homeFunctions.getHomePageData(HOME_MSITE, configApi, api);
  console.log("headerDataError", headerDataError);
  console.log("homePageError", homePageError);
  console.log("localeDataError", localeDataError);
  console.log("userError", userData);
  console.log("homePageMobileError", homePageMobileError);
  console.log("headers check", api.headers);
  // let updatedUserData = userData;
  // if(userError.isError) {
  //   console.log('headers check', api.headers);
  //   api.resetHeaders();
  //   api.setMethod(APIMethods.POST);
  //   const { data: sessionId, error } = await sessionFunctions.createNewSession(
  //     api
  //   );
  //   setCookie(COOKIE_NAME, sessionId.sessionId, { req, res });
  //   api.resetHeaders();
  //   api.sessionToken = sessionId.sessionId;
  //   api.setHeaders(headerArr).setMethod(APIMethods.GET);
  //   const { data: sessionData, error: userError } = await sessionFunctions.validateSession(api);
  //   updatedUserData = sessionData;
  // }

  if (
    headerDataError.isError ||
    homePageError.isError ||
    localeDataError.isError ||
    homePageMobileError.isError ||
    userError.isError
  ) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });
  return {
    props: {
      data: {
        userData: userData?.customerInfo || null,
        headerData,
        homePageData,
        localeData,
        homePageMobileData:
          homePageMobileData.categoryCarouselsData ||
          homePageMobileData.homePageData ||
          null,
        configData,
      },
    },
  };
};
export default Home;
