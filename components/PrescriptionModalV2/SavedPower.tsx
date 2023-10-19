import { getOrderData, updateOrderListingData } from "@/redux/slices/myorder";
import {
  getCLSubscriptions,
  getSubscriptionDiscount,
  setPrescriptionPageStatus,
  updateCLPrescription,
  updatePrescriptionData,
  updatePrescriptionPage,
  validateCLPrescription,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes, ThemeENUM } from "@/types/baseTypes";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { Button, PrescriptionModal, ToastMessage, Toast } from "@lk/ui-library";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BottomSheet from "./BottomSheet";
import { getDate, Pages, POWER_NAME_CONFIG } from "./helper";
import { Body, Contain, RootHeader } from "./SubmitPrescriptionRoot";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
`;

export const Helper = styled.div`
  margin: 36px 40px;
  display: flex;
  justify-content: space-between;
`;

const PowerType = styled.div`
  padding: 6px 12px;
  background: #f5f5ff;
  border: 1px solid #333368;
  border-radius: 99px;
  margin-bottom: 20px;
  color: #000042;
  display: inline-block;
  font-family: "LenskartSans-Regular";
  font-weight: 700;
  font-size: 12px;
  line-height: 20px;
`;

const Contains = styled.div`
  display: flex;
  justify-content: center;
`;

const PowerTyperoot = styled.div`
  width: 100%;
`;

export const OrderTitle = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;

  color: #66668e;
`;

interface UserSavedPower {
  id: string;
  left: DataType;
  right: DataType;
  powerType: string;
  userName: string;
  showPd: boolean;
  recordedAt: number;
}

const localeData = {
  BIFOCAL_PROGRESSIVE: "Bifocal • Progressive",
  SAVED_POWERS: "Saved Powers",
  SINGLE_VISION: "Single Vision",
};

export default function SavedPower({
  closeSlider,
  orderId,
  deviceType,
  item,
  postNeedHelpWhatsappFun,
  localeData,
  configData,
  preCheckout = false,
  powerType,
  productData,
  isRTL,
  skipPowerOptions,
  powerOptions,
}: {
  closeSlider: (props: boolean) => void;
  orderId: number;
  item: any;
  deviceType: string;
  postNeedHelpWhatsappFun: () => void;
  localeData: DataType;
  configData: DataType;
  isRTL: boolean;
  skipPowerOptions: string[];
  preCheckout?: boolean;
  powerType?: string;
  productData?: any;
  powerOptions: string[];
}) {
  const [selected, setSelected] = useState("");
  const [selectedPrescription, setSelectedPrescription] =
    useState<UserSavedPower | null>(null);
  const [jitFlow, setJitFlow] = useState(false);

  const { data, updatePrescriptionDataInfo } = useSelector(
    (state: RootState) => state.prescriptionInfo
  );
  const { orderListingData } = useSelector(
    (state: RootState) => state.myOrderInfo
  );
  //   const { orderData } = useSelector((state: RootState) => state.myOrderInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const clPrescriptionData = useSelector(
    (state: RootState) => state.prescriptionInfo.clPrescriptionData
  );

  const dispatch = useDispatch<AppDispatch>();

  const onTabClick = (info: UserSavedPower) => {
    setSelected(info.id);
    setSelectedPrescription(info);
  };

  const submitPower = () => {
    if (!preCheckout) {
      dispatch(
        updatePrescriptionData({
          sessionId: userInfo.sessionId,
          orderID: orderId || "",
          itemID: item?.id || productData.id,
          prescription: selectedPrescription,
          emailID: userInfo.email || "",
        })
      );
    }

    if (preCheckout) {
      if (!productData?.jit) {
        dispatch(
          validateCLPrescription({
            sessionId: userInfo?.sessionId,
            prescription: selectedPrescription,
            productId: productData?.id.toString(),
            quantity: 2,
            userName: "test",
          })
        );
      } else {
        setJitFlow(true);
      }
    }

    // window.location.reload();
  };
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (clPrescriptionData?.validateCLError.error) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }

    // dispatch on success validate

    if (clPrescriptionData.clValidateSuccessful || jitFlow) {
      dispatch(updateCLPrescription(selectedPrescription));
      dispatch(
        getCLSubscriptions({
          sessionId: userInfo.sessionId,
          productId: productData?.id.toString(),
          isBothEye: clPrescriptionData.eye === "both",
        })
      );

      dispatch(
        getSubscriptionDiscount({
          sessionId: userInfo.sessionId,
          productId: productData?.id.toString(),
          subscriptionsType: "LENS",
        })
      );
      // dispatch(updatePrevPrescriptionPage(prescriptionPage));
      dispatch(updatePrescriptionPage(Pages.CL_BUYING_OPTION));
    }
  }, [clPrescriptionData, jitFlow]);

  useEffect(() => {
    if (
      !preCheckout &&
      !updatePrescriptionDataInfo.isError &&
      !updatePrescriptionDataInfo.isLoading &&
      updatePrescriptionDataInfo.prescriptionSavedManual !== null
    ) {
      if (
        configData?.SHOW_PD &&
        item.prescription.powerType === "BIFOCAL" &&
        !selectedPrescription?.left.pd
      ) {
        dispatch(updatePrescriptionPage(Pages.ENTER_PD));
      } else {
        closeSlider(true);
      }
    } else if (
      updatePrescriptionDataInfo.isError &&
      !updatePrescriptionDataInfo.isLoading
    ) {
      setShowToast(true);
    }
  }, [updatePrescriptionDataInfo]);

  useEffect(() => {
    if (
      !updatePrescriptionDataInfo.isLoading &&
      updatePrescriptionDataInfo.prescriptionSavedManual &&
      Object.keys(updatePrescriptionDataInfo.prescriptionSavedManual).length > 0
    ) {
      const getItem =
        updatePrescriptionDataInfo.prescriptionSavedManual.items.filter(
          (items: { id: string | number }) => items.id === item.id
        );
      let orderIndex = orderListingData.findIndex(
        (order: { id: string }) =>
          order.id === updatePrescriptionDataInfo.prescriptionSavedManual.id
      );
      let orders = [...orderListingData];
      orders[orderIndex] = {
        ...updatePrescriptionDataInfo.prescriptionSavedManual,
      };
      if (orderListingData.length > 0) {
        if (
          powerOptions.includes(Pages.ENTER_PD) &&
          getItem[0].prescriptionView.showPd
        ) {
          dispatch(updatePrescriptionPage(Pages.ENTER_PD));
        } else {
          dispatch(setPrescriptionPageStatus(false));
        }
      }
    }
  }, [updatePrescriptionDataInfo.isLoading]);

  return (
    <>
      {DeviceTypes.MOBILE !== deviceType && (
        <RootHeader isMobile={false} isRTL={isRTL}>
          {localeData.SAVED_POWERS}
        </RootHeader>
      )}
      <Body isMobile={DeviceTypes.MOBILE === deviceType}>
        <>
          {DeviceTypes.MOBILE === deviceType && (
            <Contain>
              <RootHeader isMobile={true}>{localeData.SAVED_POWERS}</RootHeader>
            </Contain>
          )}

          {DeviceTypes.MOBILE !== deviceType && (
            <Helper>
              <OrderTitle>
                {localeData.ORDER_NO} : {orderId}
              </OrderTitle>
              <PrescriptionModal.NeedHelp
                postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
                configData={configData}
                localeData={localeData}
                pId={item.productId}
                isRTL={isRTL}
              />
            </Helper>
          )}
          <Contains>
            <Container>
              {!preCheckout && (
                <PowerTyperoot>
                  {item?.prescription?.powerType !== "SUNGLASSES" && (
                    <PowerType>
                      {item?.prescription?.powerType === "SINGLE_VISION"
                        ? localeData.SINGLE_VISION
                        : localeData.BIFOCAL_PROGRESSIVE}
                    </PowerType>
                  )}
                </PowerTyperoot>
              )}
              {data?.map((info: { id: React.Key | null | undefined }) => {
                return (
                  <PrescriptionModal.SPPanel
                    isMobile={DeviceTypes.MOBILE === deviceType}
                    key={info.id}
                    info={info}
                    selected={selected}
                    onTabClick={onTabClick}
                    prescription={item?.prescription}
                    getDate={getDate}
                    POWER_NAME_CONFIG={POWER_NAME_CONFIG}
                    localeData={localeData}
                    isRTL={isRTL}
                    powerType={powerType}
                    precheckout={preCheckout}
                    productData={productData}
                  />
                );
              })}
            </Container>
          </Contains>
        </>
      </Body>
      {showToast &&
        (DeviceTypes.MOBILE !== deviceType ? (
          <ToastMessage
            message={
              updatePrescriptionDataInfo.errorMessage ||
              clPrescriptionData?.validateCLError?.errMessage
            }
            color="orange"
            duration={2000}
            show={showToast}
            hideFn={() => {
              setShowToast(false);
            }}
            showIcon={false}
          />
        ) : (
          <Toast
            text={
              (updatePrescriptionDataInfo.errorMessage ||
                clPrescriptionData?.validateCLError?.errMessage) ??
              "Invalid Power"
            }
            hideFn={() => {
              setShowToast(false);
            }}
            width={"90%"}
          />
        ))}
      <BottomSheet isMobile={deviceType === DeviceTypes.MOBILE}>
        <Button
          onClick={submitPower}
          text={localeData.USE_THIS_POWER}
          width={deviceType === DeviceTypes.MOBILE ? 100 : 50}
          disabled={!selected}
          theme={ThemeENUM.newSecondary}
        />
      </BottomSheet>
    </>
  );
}
