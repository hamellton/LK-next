import { postNeedHelpWhatsapp } from "@/redux/slices/auth";
import { getOrderData } from "@/redux/slices/myorder";
import {
  getPrescriptionDataWithPowerType,
  fetchPowers,
  updatePrescriptionPage,
  updatePrevPrescriptionPage,
  resetUpdatePrescriptionDataInfo,
  resetUpdatePrescriptionDataAdded,
  validateCLError,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes } from "@/types/baseTypes";
import { DataType } from "@/types/coreTypes";
import { Icons, PrescriptionModal } from "@lk/ui-library";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CLAddOns from "./ContactLens/CLAddOns";
import CLBuyingOption from "./ContactLens/CLBuyingOption";
import EnterPd from "./EnterPd";
import EnterPowerManually from "./EnterPowerManually";
import GetCallBack from "./GetCallBack";
import { getPowerOptions, Pages } from "./helper";
import SavedPower from "./SavedPower";
import StoreEyeTest from "./StoreEyeTest";
import SubmitPrescriptionRoot from "./SubmitPrescriptionRoot";
import UploadPrescription from "./UploadPrescription";

const Root = styled.div<{
  show: boolean;
  isMobile: boolean;
  backgroundColor?: string;
}>`
  display: ${(props) => (props.show ? "" : "none")};
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 750px;
  z-index: 1000;
  /* background: #fbf9f7; */
  background: ${(props) => props.backgroundColor};
  overflow: scroll;
  /* padding-bottom: 100px; */
  padding-bottom: ${(props) => (!props.isMobile ? "100px" : "")};
  ${(props) =>
    props.isMobile &&
    "left: 0; width: 100vw; height: auto; bottom: 0;z-index: 99999;"}
`;

const Box = styled.div<{ show?: boolean }>`
  ${(props) =>
    props.show && "position: fixed; inset: 0; background: rgba(0,0,0,0.3);"}
`;

export const Backdrop = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background: rgba(0, 0, 66, 0.5);
`;

const Container = styled.div<{ isMobile: boolean }>`
  position: relative;
  height: ${(props) => (props.isMobile ? "100%" : "")};
  ${(props) => !props.isMobile && "padding: 40px;"};
`;

const Cross = styled.div`
  position: absolute;
  right: 40px;
  cursor: pointer;
  top: 36px;
`;

const Arrow = styled.div<{ isMobile: boolean }>`
  position: absolute;
  left: 40px;
  cursor: pointer;
  top: 53px;
  ${(props) =>
    props.isMobile &&
    `background: #ffffff;
    border-radius: 100px;
    padding: 4px 12px;
    display: flex;
    left: 18px;
    top: 36px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    color: black;`}
  width:44px;
  svg {
    width: 16px;
    path {
      stroke: #000;
    }
  }
`;

const HelpContainer = styled.div`
  position: absolute;
  right: 18px;
  top: 42px;
`;

interface SliderTypes {
  show: boolean;
  closeSlider: (props: boolean) => void;
  orderId?: number;
  item?: any;
  localeData: DataType;
  configData: DataType;
  preCheckout?: boolean;
  powerType?: string;
  productData?: DataType;
  handleShowPrescription: (props: boolean) => void;
}

// const skipPowerOptions: any = [];

export default function Slider({
  show,
  closeSlider,
  orderId,
  item,
  localeData,
  configData,
  preCheckout = false,
  powerType,
  productData,
  handleShowPrescription,
}: SliderTypes) {
  const dispatch = useDispatch<AppDispatch>();

  const skipPowerOptions = JSON.parse(configData?.skipPowerOptions || "[]");
  const powerOptions = JSON.parse(configData?.POWER_OPTIONS);
  const whatsAppChatMsg =
    (localeData.WHATSAPP_CHAT_URL && localeData.BUY_ON_CHAT_HELP_CTA_CART) ||
    (localeData.BUYONCHAT_HELP_CTA_CART &&
      `${localeData.WHATSAPP_CHAT_URL}${
        localeData.BUY_ON_CHAT_HELP_CTA_CART ||
        localeData.BUYONCHAT_HELP_CTA_CART
      }`
        .replace("<pageName>", "Prescription")
        .replace("<pid-no>", item?.productId));

  const helpFunction = () => {
    postNeedHelpWhatsappFun();
    window.location.href = whatsAppChatMsg;
  };
  const type = item?.productType || productData?.type;

  const powerOptionsTemp = getPowerOptions(type || "");

  const { sessionId, email, mobileNumber, userDetails, isLogin } = useSelector(
    (state: RootState) => state.userInfo
  );
  const { deviceType, isRTL } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const { orderData } = useSelector((state: RootState) => state.myOrderInfo);

  const {
    prescriptionPage,
    prevPrescriptionPage,
    data,
    prescriptionPageStatus,
  } = useSelector((state: RootState) => state.prescriptionInfo);
  const [selectedPage, setSelectedPage] = useState("1");
  const [showSavedPower, setShowSavedPower] = useState(false);
  //   const [page, setPage] = useState<string>(Pages.ENTER_PD);

  useEffect(() => {
    if (isLogin && data && data.length > 0) {
      setShowSavedPower(true);
    } else {
      setShowSavedPower(false);
    }
  }, [isLogin, data]);

  // useEffect(() => {
  //   if(preCheckout){
  //     dispatch(
  //       getPrescriptionDataWithPowerType({
  //         sessionId: sessionId,
  //         powerType: powerType,
  //       })
  //     );
  //     dispatch(
  //       fetchPowers({
  //         sessionId: sessionId,
  //         pid: productData.id,
  //         powerType: powerType,
  //         consumer: true,
  //       })
  //     );
  //   }
  // }, [productData])

  useEffect(() => {
    dispatch(validateCLError({
      error: false,
      errorMessage: ""
    }))
  }, [prescriptionPage])

  useEffect(() => {
    if (sessionId && item && !preCheckout && prescriptionPageStatus) {
      if (Object.keys(orderData).length === 0 || orderData?.id !== orderId) {
        dispatch(
          getOrderData({
            sessionId: sessionId,
            orderID: orderId || 0,
          })
        );
      }
      dispatch(
        getPrescriptionDataWithPowerType({
          sessionId: sessionId,
          powerType: item.prescriptionView.powerType,
        })
      );

      dispatch(
        fetchPowers({
          sessionId: sessionId,
          pid: item?.productId,
          powerType: `power_type=${item.prescriptionView.powerType}`,
          consumer: true,
        })
      );
    }
  }, [sessionId, item, prescriptionPageStatus]);

  useEffect(() => {
    if (
      prescriptionPage !== Pages.SUBMIT_PRESCRIPTION &&
      prevPrescriptionPage !== Pages.ENTER_PD
    ) {
      dispatch(updatePrevPrescriptionPage(Pages.SUBMIT_PRESCRIPTION));
    } else if (prescriptionPage === Pages.STORE_VISIT) {
      setSelectedPage("1");
      dispatch(updatePrevPrescriptionPage(""));
    }
  }, [prescriptionPage]);

  const ChangePage = (selectedPage: string) => {
    // setPage(selectedPage);
    dispatch(updatePrescriptionPage(selectedPage));
  };

  useEffect(() => {
    dispatch(resetUpdatePrescriptionDataInfo());
    dispatch(resetUpdatePrescriptionDataAdded());
    return () => setSelectedPage("1");
  }, []);

  const PrescriptionPages = () => {
    return (
      <>
        {prescriptionPage === Pages.SUBMIT_PRESCRIPTION &&
          (item || productData) && (
            <SubmitPrescriptionRoot
              ChangePage={ChangePage}
              item={item}
              orderId={orderId || 0}
              deviceType={deviceType || ""}
              skipPowerOptions={skipPowerOptions}
              helpFunction={helpFunction}
              localeData={localeData}
              powerType={powerType}
              productData={productData}
              preCheckout={preCheckout}
              showSavedPower={showSavedPower}
              configData={configData}
              powerOptions={powerOptions[powerOptionsTemp]}
            />
          )}
        {prescriptionPage === Pages.ENTER_MANUAL && (
          <EnterPowerManually
            orderId={orderId}
            closeSlider={closeSlider}
            item={item}
            deviceType={deviceType || ""}
            postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
            configData={configData}
            localeData={localeData}
            powerType={powerType}
            productData={productData}
            preCheckout={preCheckout}
            skipPowerOptions={skipPowerOptions}
            powerOptions={powerOptions[powerOptionsTemp]?.KNOW_POWER}
          />
        )}
        {prescriptionPage === Pages.ENTER_PD && (
          <EnterPd
            ChangePage={ChangePage}
            closeSlider={closeSlider}
            orderId={orderId || 0}
            item={item}
            postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
            localeData={localeData}
            configData={configData}
            powerType={powerType}
            productData={productData}
            preCheckout={preCheckout}
            isRTL={isRTL}
          />
        )}
        {prescriptionPage === Pages.SAVED_POWER && (
          <SavedPower
            closeSlider={closeSlider}
            orderId={orderId || 0}
            deviceType={deviceType || ""}
            item={item}
            postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
            localeData={localeData}
            configData={configData}
            powerType={powerType}
            productData={productData}
            preCheckout={preCheckout}
            isRTL={isRTL}
            skipPowerOptions={skipPowerOptions}
            powerOptions={powerOptions[powerOptionsTemp]?.KNOW_POWER}
          />
        )}
        {prescriptionPage === Pages.UPLOAD_PHOTO && (
          <UploadPrescription
            orderId={orderId || 0}
            closeSlider={closeSlider}
            item={item}
            sessionId={sessionId}
            email={email}
            postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
            localeData={localeData}
            configData={configData}
            powerType={powerType}
            productData={productData}
            preCheckout={preCheckout}
          />
        )}
        {prescriptionPage === Pages.GET_A_CALLBACK && (
          <GetCallBack
            orderId={orderId}
            deviceType={deviceType}
            item={item}
            sessionId={sessionId}
            email={email}
            userName={`${userDetails?.firstName} ${userDetails?.lastName}`}
            closeSlider={closeSlider}
            localeData={localeData}
            configData={configData}
            postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
            powerType={powerType}
            productData={productData}
            preCheckout={preCheckout}
          />
        )}
        {prescriptionPage === Pages.STORE_VISIT && (
          <StoreEyeTest
            orderId={orderId || 0}
            itemId={item.id}
            deviceType={deviceType}
            sessionId={sessionId}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            powerType={powerType}
            productData={productData}
            preCheckout={preCheckout}
          />
        )}
        {prescriptionPage === Pages.CL_BUYING_OPTION && (
          <CLBuyingOption
            handleOnBackClick={handleOnBackClick}
            configData={configData}
            sessionId={sessionId}
            productId={productData?.id || ""}
            productData={productData}
          />
        )}
        {prescriptionPage === Pages.CL_ADDONS && (
          <CLAddOns
            handleOnBackClick={handleOnBackClick}
            configData={configData}
            sessionId={sessionId}
            productId={productData?.id || ""}
            localeData={localeData}
            closeSlider={closeSlider}
            handleShowPrescription={handleShowPrescription}
          />
        )}
      </>
    );
  };

  const postNeedHelpWhatsappFun = () => {
    dispatch(
      postNeedHelpWhatsapp({ phone: mobileNumber, sessionId: sessionId })
    );
  };

  const handleOnBackClick = () => {
    // console.log("inside handle on back click");
    // DeviceTypes.MOBILE === deviceType
    //           ? Pages.ENTER_PD === prescriptionPage
    //             ? closeSlider(true)
    //             : closeSlider(false)
    //           : ChangePage(
    //               prevPrescriptionPage === Pages.ENTER_PD
    //                 ? Pages.ENTER_PD
    //                 : Pages.SUBMIT_PRESCRIPTION
    //             )
    if (deviceType === DeviceTypes.MOBILE) {
      if (Pages.ENTER_PD === prescriptionPage) {
        closeSlider(true);
      } else if (Pages.CL_BUYING_OPTION === prescriptionPage) {
        ChangePage(Pages.ENTER_MANUAL);
      } else if (Pages.CL_ADDONS === prescriptionPage) {
        ChangePage(Pages.CL_BUYING_OPTION);
      } else {
        closeSlider(false);
      }
    } else {
      if (Pages.SUBMIT_PRESCRIPTION === prescriptionPage) {
        closeSlider(true);
      } else {
        ChangePage(
          prevPrescriptionPage === Pages.ENTER_PD
            ? Pages.ENTER_PD
            : Pages.SUBMIT_PRESCRIPTION
        );
      }
      dispatch(resetUpdatePrescriptionDataInfo());
    }
  };

  const getBackgroundColor = () => {
    if (prescriptionPage === Pages.CL_BUYING_OPTION || Pages.CL_ADDONS) {
      return "#fbf9f7";
    } else {
      return "#fbf9f7";
    }
  };

  return (
    <>
      <Box show={show}></Box>
      <Root
        show={show}
        isMobile={DeviceTypes.MOBILE === deviceType}
        backgroundColor={getBackgroundColor()}
      >
        <Container isMobile={DeviceTypes.MOBILE === deviceType}>
          {DeviceTypes.MOBILE !== deviceType ? (
            <Cross
              onClick={() => {
                closeSlider(true);
                // window.location.reload();
              }}
            >
              <Icons.Cross />
            </Cross>
          ) : // ) : prescriptionPage !== Pages.CL_BUYING_OPTION ? (
          ![Pages.CL_ADDONS, Pages.CL_BUYING_OPTION].includes(
              prescriptionPage
            ) ? (
            <HelpContainer>
              <PrescriptionModal.NeedHelp
                postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
                configData={configData}
                localeData={localeData}
                pId={item?.productId}
                isRTL={isRTL}
              />
            </HelpContainer>
          ) : null}
          {/* {(prescriptionPage !== Pages.CL_BUYING_OPTION )   && ( */}
          {![Pages.CL_ADDONS, Pages.CL_BUYING_OPTION].includes(
            prescriptionPage
          ) && (
            <Arrow
              isMobile={DeviceTypes.MOBILE === deviceType}
              onClick={() => handleOnBackClick()}
            >
              <Icons.LeftArrow />
            </Arrow>
          )}
          {/* <Arrow
          isMobile={DeviceTypes.MOBILE === deviceType}
          onClick={() =>
            DeviceTypes.MOBILE === deviceType
              ? Pages.ENTER_PD === prescriptionPage
                ? closeSlider(true)
                : closeSlider(false)
              : Pages.SUBMIT_PRESCRIPTION
              ? closeSlider(false)
              : ChangePage(
                  prevPrescriptionPage === Pages.ENTER_PD
                    ? Pages.ENTER_PD
                    : Pages.SUBMIT_PRESCRIPTION
                )
          }
        >
          <Icons.LeftArrow />
        </Arrow> */}
          {PrescriptionPages()}
        </Container>
      </Root>
    </>
  );
}
