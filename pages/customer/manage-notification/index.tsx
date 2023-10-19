import { CONFIG, COOKIE_NAME, LOCALE } from "../../../constants";
import { APIMethods } from "@/types/apiTypes";
import { NotificationType } from "@/types/Notification";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { GetServerSideProps } from "next";
import {
  fireBaseFunctions,
  headerFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getMarketingSubscription,
  marketingSubscriptionData,
} from "@/redux/slices/marketingsubscription";
import BaseSidebar from "../../../containers/MyAccount/baseSideBar";
import Base from "containers/Base/Base.component";
import { NotificationWrapper } from "../../../pageStyles/styles";
import { ManageNotification, ToastMessage } from "@lk/ui-library";
import useCustomerState from "hooks/useCustomerState";
import { DeviceTypes } from "@/types/baseTypes";
import { trackingDetail } from "helpers/userproperties";
import { pushDataLayer } from "helpers/utils";

const Notification = ({
  localeData,
  userData,
  headerData,
  configData,
}: NotificationType) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector(
    (state: RootState) => state.marketingSubscriptionInfo
  );
  const [showToast, setShowToast] = useState(false);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const router = useRouter();
  const [notification, setNotification] = useState<{
    whatsapp: boolean;
    sms: boolean;
    pushNotification: boolean;
    email: boolean;
  }>({
    whatsapp: data.whatsapp,
    sms: data.sms,
    pushNotification: data.pushNotification,
    email: data.email,
  });
  useEffect(() => {
    if (userData?.id)
      dispatch(marketingSubscriptionData({ sessionId: userData.id }));
  }, [userData?.id]);

  useEffect(() => {
    if (!isLoading)
      setNotification({
        whatsapp: data.whatsapp,
        sms: data.sms,
        pushNotification: data.pushNotification,
        email: data.email,
      });
  }, [data, isLoading]);
  useEffect(() => {
    if (!userInfo.userLoading)
      trackingDetail(localeData.MANAGE_COMMUNICATION_PREFERENCES, userInfo);
  }, [userInfo.userLoading]);
  const onSaveNotification = (params: {
    whatsapp: boolean;
    sms: boolean;
    pushNotification: boolean;
    email: boolean;
  }) => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
    setNotification({
      whatsapp: params.whatsapp,
      sms: params.sms,
      pushNotification: params.pushNotification,
      email: params.email,
    });
    gaTrackingOnSaveClick(
      params.whatsapp,
      params.email,
      params.sms,
      params.pushNotification
    );
    dispatch(getMarketingSubscription({ ...params, sessionId: userData.id }));
  };
  useCustomerState({
    useMounted: false,
    userData: userData,
  });

  const gaTrackingOnSaveClick = (
    whatsappSubscription: boolean,
    emailSubscription: boolean,
    smsSubscription: boolean,
    pushNotificationSubscription: boolean
  ) => {
    const dlUpdate = {
      event: localeData.MARKETING_CHANNEL_PERMISSIONS,
      emailPermission: emailSubscription ? "Active" : "Inactive",
      smsPermission: smsSubscription ? "Active" : "Inactive",
      pushNotificationPermission: pushNotificationSubscription
        ? "Active"
        : "Inactive",
      whatsappPermission: whatsappSubscription ? "Active" : "Inactive",
    };
    pushDataLayer(dlUpdate);
  };

  const mobileView = pageInfo.deviceType === DeviceTypes.MOBILE;
  const Desktop = (
    <BaseSidebar
      localeData={localeData}
      userData={userData}
      headerData={headerData}
      configData={configData}
    >
      <NotificationWrapper>
        <ToastMessage
          message={localeData.YOUR_CHANGES_HAS_BEEN_SAVED_SUCCESSFULLY}
          color="green"
          duration={2000}
          show={showToast}
          hideFn={() => {
            setShowToast(false);
          }}
          showIcon={false}
          position="static"
        />
        {localeData && (
          <ManageNotification
            dataLocale={localeData}
            notificationData={notification}
            onSaveNotification={onSaveNotification}
            isRTL={pageInfo.isRTL}
          />
        )}
      </NotificationWrapper>
    </BaseSidebar>
  );
  if (mobileView) {
    return (
      <Base
        languageSwitchData={{ link: "", text: "" }}
        sprinkularBotConfig={() => null}
        configData={{}}
        headerData={headerData}
        sessionId={userData.id}
        isExchangeFlow={false}
        localeData={localeData}
        trendingMenus={[]}
        hideFooter
      >
        {localeData && (
          <ManageNotification
            dataLocale={localeData}
            notificationData={notification}
            onSaveNotification={onSaveNotification}
            mobileView={mobileView}
            redirectToHome={() => router.push("/")}
            isRTL={pageInfo.isRTL}
          />
        )}
      </Base>
    );
  } else {
    return Desktop;
  }
};

export default Notification;

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
  const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`)
    .setHeaders(headerArr)
    .setMethod(APIMethods.GET);
  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi, deviceType);
  const { data: localeData, error: loacleError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: configError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });
  if (loacleError.isError || userError.isError || headerDataError.isError) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      localeData: { ...localeData },
      userData: userData.customerInfo,
      headerData: headerData,
      configData: configData,
    },
  };
};
