import {
  getCLSubscriptions,
  getSubscriptionDiscount,
  updateCLPrescription,
  updatePrescriptionData,
  updatePrescriptionPage,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes, ThemeENUM, TypographyENUM } from "@/types/baseTypes";
import { Icons } from "@lk/ui-library";
import { Button, PrescriptionModal } from "@lk/ui-library";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BottomSheet from "./BottomSheet";
import { Pages } from "./helper";
import { Helper, OrderTitle } from "./SavedPower";
import { RootHeader } from "./SubmitPrescriptionRoot";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
`;

const Header = styled.span`
  font-family: ${TypographyENUM.lkSerifBook};
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  margin: 18px;

  color: #000042;
`;

const Text = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  display: contents;

  color: #333368;
`;

const Icon = styled.div<{ isMobile: boolean }>`
  font-size: ${(props) => (props.isMobile ? "50px" : "24px")};
  color: #333368;
`;

const MobileRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 85vh;
  justify-content: center;
`;

export default function GetCallBack({
  orderId,
  deviceType,
  item,
  sessionId,
  email,
  closeSlider,
  postNeedHelpWhatsappFun,
  localeData,
  configData,
  userName,
  powerType,
  productData,
  preCheckout,
}: any) {
  const [selected, setSelected] = useState("1");
  const dispatch = useDispatch<AppDispatch>();

  const { eye } = useSelector(
    (state: RootState) => state.prescriptionInfo.clPrescriptionData
  );

  const callSupport = () => {
    setSelected("2");
    if (selected === "1") {
      const prescription = {
        left: { sph: "Call Me/Email Me for Power" },
        right: { sph: "Call Me/Email Me for Power" },
        powerType: !preCheckout ? item.prescription.powerType : "CONTACT_LENS",
        userName: userName || "",
      };

      if (preCheckout) {
        dispatch(updateCLPrescription(prescription));
        dispatch(
          getCLSubscriptions({
            sessionId: sessionId,
            productId: productData?.id.toString(),
            isBothEye: eye === "both",
          })
        );

        dispatch(
          getSubscriptionDiscount({
            sessionId: sessionId,
            productId: productData?.id.toString(),
            subscriptionsType: "LENS",
          })
        );
        // dispatch(updatePrevPrescriptionPage(prescriptionPage));
        dispatch(updatePrescriptionPage(Pages.CL_BUYING_OPTION));
      }

      if (!preCheckout) {
        dispatch(
          updatePrescriptionData({
            sessionId: sessionId,
            orderID: orderId,
            itemID: item.id,
            prescription: prescription,
            emailID: email,
          })
        );
      }
      // window.location.reload();
      if (!preCheckout && deviceType === DeviceTypes.DESKTOP) {
        closeSlider(true);
      }
    } else {
      closeSlider(true);
    }
  };

  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);

  return (
    <div>
      {DeviceTypes.MOBILE !== deviceType ? (
        <>
          <RootHeader isMobile={false} isRTL={isRTL}>
            {localeData.GET_A_CALLBACK}
          </RootHeader>
          <Helper>
            <OrderTitle>
              {localeData.ORDER_NO_NEW} {orderId}
            </OrderTitle>
            <PrescriptionModal.NeedHelp
              postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
              configData={configData}
              localeData={localeData}
              pId={item.productId}
              isRTL={isRTL}
            />
          </Helper>
        </>
      ) : (
        <>
          {selected === "1" ? (
            <MobileRoot>
              <Icon isMobile>
                <Icons.Telephone />
              </Icon>
              <Header>{localeData.GET_A_CALLBACK}</Header>
              <Text>
                <span>{localeData.CUSTOMER_SUPPORT_MESSAGE}</span>
                <span>{localeData.ASSISTING_FOR_EYE_POWER}</span>
              </Text>
            </MobileRoot>
          ) : (
            <MobileRoot>
              <Icon isMobile>
                <Icons.MobileSteppericon />
              </Icon>
              <Header>{localeData.THANK_YOU}</Header>
              <Text>
                <span>{localeData.EXPECT_CUSTOMER_SUPPORT_CALL}</span>
                <span>{localeData.WITHIN_24_HOURS}</span>
              </Text>
            </MobileRoot>
          )}
        </>
      )}
      {DeviceTypes.MOBILE !== deviceType && (
        <Root>
          <Icon isMobile={false}>
            <Icons.Steppericon />
          </Icon>
          <Header>{localeData.THANK_YOU}</Header>
          <Text>
            <span>{localeData.OUR_EXECUTIVE_WILL_CALL_YOU}</span>
            <span>{localeData.WITHIN_24_HOURS}</span>
          </Text>
        </Root>
      )}
      <BottomSheet isMobile={deviceType === DeviceTypes.MOBILE}>
        <Button
          onClick={callSupport}
          theme={ThemeENUM.secondary}
          text={
            selected === "1"
              ? localeData.CONTINUE_CAPITALIZE
              : localeData.BACK_TO_ORDERS
          }
          width={deviceType === DeviceTypes.MOBILE ? 100 : 50}
        />
      </BottomSheet>
    </div>
  );
}
