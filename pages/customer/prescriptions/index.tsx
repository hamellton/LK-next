import { CONFIG, COOKIE_NAME, LOCALE } from "../../../constants";
import { APIMethods } from "@/types/apiTypes";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { GetServerSideProps } from "next";
import {
  fireBaseFunctions,
  headerFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { PrescriptionTypes } from "@/types/prescriptionTypes";
import BaseSidebar from "../../../containers/MyAccount/baseSideBar";
import { MyPrescription } from "@lk/ui-library";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getSavedPrescriptionData } from "@/redux/slices/prescription";
import { PrescriptionWrapper } from "../../../pageStyles/styles";
import useCustomerState from "hooks/useCustomerState";

const Prescription = ({
  userData,
  localeData,
  headerData,
  configData,
}: PrescriptionTypes) => {
  const dispatch = useDispatch<AppDispatch>();
  const prescriptionList = useSelector(
    (state: RootState) => state.prescriptionInfo.data
  );
  useEffect(() => {
    dispatch(getSavedPrescriptionData({ sessionId: userData.id }));
  }, []);
  useCustomerState({
    useMounted: false,
    userData: userData,
  });
  return (
    <BaseSidebar
      localeData={localeData}
      userData={userData}
      headerData={headerData}
      configData={configData}
    >
      <PrescriptionWrapper>
        <MyPrescription
          showpowerType={true}
          showDate={true}
          showSelectedButton={false}
          dataLocale={localeData}
          prescriptionList={prescriptionList}
        />
      </PrescriptionWrapper>
    </BaseSidebar>
  );
};

export default Prescription;

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
  if (loacleError.isError || userError.isError || headerDataError.isError) {
    return {
      notFound: true,
    };
  }

  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });

  return {
    props: {
      localeData: { ...localeData },
      userData: userData.customerInfo,
      headerData: headerData,
      configData: configData,
    },
  };
};
