import {
  ConfirmBtnRow,
  ConfirmationHeader,
  ConfirmationText,
  CygnusButton,
  CygnusCard,
  CygnusContainer,
  CygnusDelete,
  CygnusImage,
  CygnusWarningHead,
  DeletePopupContainer,
  PopupCancelBtn,
  PopupDeleteBtn,
  Profile3DRoot,
} from "../../../pageStyles/styles";
import { Checkout as CheckoutComponent } from "@lk/ui-library";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { GetServerSideProps } from "next";
import { APIService } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import {
  fireBaseFunctions,
  headerFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { CONFIG, COOKIE_NAME, LOCALE } from "../../../constants";
import { SaveCardType } from "@/types/savedCardTypes";
import { deleteSavedCardData, savedCardData } from "@/redux/slices/savedCard";
import { useEffect, useState } from "react";
import BaseSidebar from "../../../containers/MyAccount/baseSideBar";
import { fetchUserDetails } from "@/redux/slices/userInfo";
import useCustomerState from "hooks/useCustomerState";
import {
  deleteCustomerCygnusData,
  getCygnusImageData,
} from "@/redux/slices/ditto";
import { reDirection } from "containers/Base/helper";

const Profile3d = ({
  userData,
  localeData,
  headerData,
  configData,
}: SaveCardType) => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  const cygnusImageInfo = useSelector(
    (state: RootState) => state.dittoInfo.cygnusImageInfo
  );

  useCustomerState({
    useMounted: false,
    userData: userData,
  });

  useEffect(() => {
    if (
      userInfo?.userDetails?.cygnus?.cygnusId &&
      !cygnusImageInfo.isLoading &&
      !cygnusImageInfo.imageInfo.length &&
      userInfo.mobileNumber
    ) {
      dispatch(
        getCygnusImageData({
          sessionId: userInfo.sessionId,
          phoneNumber: userInfo.mobileNumber.toString(),
          phoneCode: pageInfo.countryCode,
        })
      );
    }
  }, [userInfo]);

  const deleteCustomerCygnus = () => {
    dispatch(deleteCustomerCygnusData({ sessionId: userInfo.sessionId }));
    setShowDeletePopUp(false);
  };

  return (
    <BaseSidebar
      localeData={localeData}
      userData={userData}
      headerData={headerData}
      configData={configData}
    >
      <Profile3DRoot>
        {cygnusImageInfo.imageInfo.length > 0 ? (
          cygnusImageInfo.imageInfo.map((data) => (
            <CygnusCard key={data.id}>
              <CygnusImage alt="cygnus" src={data.image_url} />
              <CygnusDelete onClick={() => setShowDeletePopUp(true)}>
                {localeData.DELETE}
              </CygnusDelete>
            </CygnusCard>
          ))
        ) : (
          <CygnusContainer>
            <CygnusWarningHead>No saved 3D Model found!</CygnusWarningHead>
            <CygnusButton
              onClick={() => {
                reDirection(pageInfo.subdirectoryPath, true);
                setCookie("isDitto", true);
              }}
            >
              START 3D TRY ON
            </CygnusButton>
          </CygnusContainer>
        )}
      </Profile3DRoot>
      {showDeletePopUp && (
        <CheckoutComponent.Popup>
          <DeletePopupContainer>
            <ConfirmationHeader>
              {localeData?.DELETE_ADDRESS_QUESTION_MARK}
            </ConfirmationHeader>
            <ConfirmationText>
              {localeData?.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ADDRESS}
            </ConfirmationText>
            <ConfirmBtnRow>
              <PopupCancelBtn onClick={() => setShowDeletePopUp(false)}>
                {localeData?.CANCEL}
              </PopupCancelBtn>
              <PopupDeleteBtn onClick={() => deleteCustomerCygnus()}>
                {localeData?.DELETE}
              </PopupDeleteBtn>
            </ConfirmBtnRow>
          </DeletePopupContainer>
        </CheckoutComponent.Popup>
      )}
    </BaseSidebar>
  );
};

export default Profile3d;

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

  const promises = [
    headerFunctions.getHeaderData(configApi, deviceType),
    fireBaseFunctions.getConfig(LOCALE, configApi),
    fireBaseFunctions.getConfig(CONFIG, configApi),
    sessionFunctions.validateSession(api),
  ];

  const [
    { data: headerData, error: headerDataError },
    { data: localeData, error: localeDataError },
    { data: configData, error: configError },
    { data: userData, error: userError },
  ] = await Promise.all(promises);

  if (
    localeDataError.isError ||
    configError.isError ||
    userError.isError ||
    headerDataError.isError
  ) {
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
