import { useEffect, useState } from "react";
import BaseSidebar from "../../../containers/MyAccount/baseSideBar";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getDittoProfiles,
  getDittoProfilesAuth,
  setDittoAuth,
  deleteDitto,
  saveDefaultDittoId,
  saveDittoName,
} from "@/redux/slices/ditto";
import { GetServerSideProps } from "next";
import { APIService } from "@lk/utils";
import { APIMethods } from "@/types/apiTypes";
import {
  fireBaseFunctions,
  headerFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { headerArr } from "helpers/defaultHeaders";
import { createAPIInstance } from "helpers/apiHelper";
import { CONFIG, COOKIE_NAME, LOCALE } from "../../../constants";
import { ModalHeader, MyDittoWarpper } from "../../../pageStyles/styles";
import { MyDitto, Modal } from "@lk/ui-library";
import { Div } from "@/components/Orders/styles";
import { ThemeENUM, TypographyENUM } from "@/types/baseTypes";
import { PrimaryButton } from "@lk/ui-library";
import { ButtonWrapper } from "pageStyles/CartStyles";
import Router from "next/router";
import useCustomerState from "hooks/useCustomerState";
import { DataType } from "@/types/coreTypes";
export interface DittoProfileType {
  userData: any;
  localeData: any;
  headerData: any;
  configData: DataType;
}

const DittoProfile = ({
  localeData,
  userData,
  headerData,
  configData,
}: DittoProfileType) => {
  const dispatch = useDispatch<AppDispatch>();
  const [dittoDeletePopup, setDittoDeletePopUp] = useState(false);
  const [deleteDittoID, setDeleteDittoId] = useState("");
  const [dittoCount, setDittoCount] = useState(0);
  const [defaultDittoId, setDefaultDittoId] = useState(
    (getCookie("isDittoID") || "").toString()
  );
  const {
    getetDittoProfilesAuthData,
    dittoProfiles: { dittoProfileData },
  } = useSelector((state: RootState) => state.dittoInfo);
  useEffect(() => {
    if (dittoProfileData) {
      dispatch(
        getDittoProfilesAuth({
          dittoIdList: dittoProfileData.dittoId,
          sessionId: userData.id,
        })
      );
    }
  }, [dittoProfileData]);
  useEffect(() => {
    if (getCookie("isDittoID") && getCookie("isDittoID") !== "lenskart") {
      const dittoID = (getCookie("isDittoID") || "").toString();
      dispatch(
        setDittoAuth({
          sessionId: userData.id,
          dittoId: dittoID,
          set: true,
        })
      );
      dispatch(getDittoProfiles({ sessionId: userData.id }));
    }
  }, []);

  const deleteDittoPopUp = (id: string, dittoCount: number) => {
    setDittoDeletePopUp(true);
    setDittoCount(dittoCount);
    setDeleteDittoId(id);
  };
  const closeDeleteDittoPopup = () => {
    setDittoDeletePopUp((dittoDeletePopup) => !dittoDeletePopup);
    setDeleteDittoId("");
  };
  const handleDeleteDitto = () => {
    setDittoDeletePopUp((dittoDeletePopup) => !dittoDeletePopup);
    dispatch(deleteDitto({ dittoId: deleteDittoID, sessionId: userData.id }));
  };
  const setDefaultDitto = (id: string) => {
    //console.log(id);
    setDefaultDittoId(id);
    setCookie("isDittoID", id);
    dispatch(saveDefaultDittoId({ id: id, sessionId: userData.id }));
  };
  const createNewDitto = () => {
    Router.push("/compare-looks");
  };
  const onSaveDittoName = (id: string, name: string) => {
    dispatch(
      saveDittoName({ dittoId: id, nickName: name, sessionId: userData.id })
    );
  };
  const { mounted } = useCustomerState({
    useMounted: true,
    userData: userData,
  });
  return (
    <>
      <BaseSidebar
        localeData={localeData}
        userData={userData}
        headerData={headerData}
      >
        <MyDittoWarpper>
          {getetDittoProfilesAuthData &&
            getetDittoProfilesAuthData.length > 0 && (
              <MyDitto
                dataLocale={localeData}
                dittoPrfileData={getetDittoProfilesAuthData}
                deleteDitto={deleteDittoPopUp}
                defaultDittoId={defaultDittoId}
                setDefaultDitto={setDefaultDitto}
                createNewDitto={createNewDitto}
                onSaveDittoName={onSaveDittoName}
              />
            )}
        </MyDittoWarpper>
      </BaseSidebar>
      <Modal
        show={dittoDeletePopup}
        onHide={closeDeleteDittoPopup}
        bsSize={"lg"}
        keyboard
        dialogCss={`width: 30vw;`}
      >
        <Modal.Header closeButton={true} onHide={closeDeleteDittoPopup}>
          <ModalHeader>{localeData.alert}</ModalHeader>
        </Modal.Header>
        <Modal.Body className={"fullheight"}>
          <Div>{localeData.ARE_YOU_SURE_YOU_WANT_TO_DELETE_YOUR_DITTO}</Div>
          <ButtonWrapper>
            <PrimaryButton
              disabled={false}
              primaryText="Close"
              onBtnClick={closeDeleteDittoPopup}
              id={"primary-button"}
              width={"20%"}
              height="46px"
              theme={ThemeENUM.secondary}
              font={TypographyENUM.defaultBook}
            ></PrimaryButton>
            <PrimaryButton
              disabled={false}
              primaryText="Delete"
              onBtnClick={handleDeleteDitto}
              id={"primary-button"}
              width={"20%"}
              height="46px"
              theme={ThemeENUM.secondary}
              font={TypographyENUM.defaultBook}
            ></PrimaryButton>
          </ButtonWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DittoProfile;

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
