import {
  fetchPowers,
  getPrescriptionDataWithPowerType,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes, TypographyENUM } from "@/types/baseTypes";
import { DataType } from "@/types/coreTypes";
import { PrescriptionModal } from "@lk/ui-library";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { orderPlacedOption } from "./helper";

export const RootHeader = styled.div<{ isMobile: boolean; isRTL?: boolean }>`
  ${(props) => !props.isMobile && "margin-left: 30px;"}
  font-family: ${TypographyENUM.lkSerifBook};
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;
  /* identical to box height, or 150% */

  /* Text/Dark/Main */

  margin-right: ${(props) => (props.isRTL ? "30px" : "")};

  color: #000042;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const Divider = styled.div`
  height: 0px;

  /* Line/Quarternary */
  margin: 40px 0;
  border: 1px dashed #e2e2ee;
`;

export const Body = styled.div<{ isMobile: boolean }>`
  margin: ${(props) => (props.isMobile ? "20px 16px" : "40px")};
  ${(props) => props.isMobile && "padding-top: 88px; margin-top: 0;"}
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Img = styled.img`
  width: 236px;
  height: 128px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Root = styled.div`
  display: flex;
  gap: 30px;
`;

const Text = styled.span`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  /* Text/Dark/Main */

  color: #000042;
`;

const OrderInfo = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  padding-top: 5px;
  /* identical to box height, or 167% */

  letter-spacing: -0.02em;

  /* Text/Dark/Tertiary */

  color: #66668e;
`;

export const Contain = styled.div`
  padding-bottom: 20px;
`;

export default function SubmitPrescriptionRoot({
  ChangePage,
  item,
  orderId,
  deviceType,
  skipPowerOptions,
  powerType,
  productData,
  preCheckout,
  showSavedPower,
  helpFunction,
  localeData,
  powerOptions,
}: {
  ChangePage: (props: string) => void;
  item: any;
  orderId: number;
  deviceType: string;
  skipPowerOptions: any;
  powerType?: string | undefined;
  productData?: DataType;
  preCheckout?: boolean;
  showSavedPower?: boolean;
  helpFunction: () => void;
  localeData: DataType;
  powerOptions: any;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const { sessionId } = useSelector((state: RootState) => state.userInfo);
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const isLogin = useSelector((state: RootState) => state.userInfo.isLogin);

  const [selected, setSelected] = useState<string | null>("1");
  const toggle = (i: string) => {
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
  };

  useEffect(() => {
    if (sessionId) {
      if (isLogin) {
        dispatch(
          getPrescriptionDataWithPowerType({
            sessionId: sessionId,
            powerType: !preCheckout
              ? item?.prescriptionView?.powerType
              : powerType,
          })
        );
      }

      dispatch(
        fetchPowers({
          sessionId: sessionId,
          pid: !preCheckout ? item?.productId : productData?.id,
          powerType: !preCheckout
            ? `power_type=${item?.prescriptionView?.powerType}`
            : powerType,
          consumer: true,
        })
      );
    }
  }, [sessionId, isLogin]);

  // const localeData = {
  //   ORDER_NO: "Order No",
  //   SUBMIT_PRESCRIPTION: "Submit prescription",
  //   KNOW_POWER: "I know my power",
  //   DONT_KNOW_POWER: "I don’t know my power",
  // };

  const getPowerOptions = (id: number) => {
    switch (id) {
      case 1:
        if (!isLogin) {
          return orderPlacedOption
            .slice(0, 3)
            .filter((item) => item.name !== "SAVED_POWER");
        }
        return orderPlacedOption.slice(0, 3);
      case 2:
        return !preCheckout
          ? orderPlacedOption.slice(3)
          : orderPlacedOption
              .slice(3)
              .filter((item) => item.name !== "STORE_VISIT");
      default:
        return orderPlacedOption;
    }
  };

  return (
    <>
      {DeviceTypes.MOBILE !== deviceType && (
        <RootHeader isMobile={false} isRTL={isRTL}>
          {localeData.SUBMIT_PRESCRIPTION}
        </RootHeader>
      )}
      <Body isMobile={DeviceTypes.MOBILE === deviceType}>
        {DeviceTypes.MOBILE === deviceType && (
          <Contain>
            <RootHeader isMobile={true}>
              {localeData.SUBMIT_PRESCRIPTION}
            </RootHeader>
            {!preCheckout && (
              <OrderInfo>
                {localeData.ORDER_NO}: {orderId}
              </OrderInfo>
            )}
          </Contain>
        )}
        {DeviceTypes.MOBILE !== deviceType && (
          <>
            <Root>
              <Img src={item.image} alt="image" />
              <InfoContainer>
                <span>
                  {localeData.ORDER_NO}: {orderId}
                </span>
                <Text>
                  {item.brandName} {item.frameColour} ({item.frameSize})
                </Text>
                <Text>{item.name}</Text>
              </InfoContainer>
            </Root>

            <Divider />
          </>
        )}
        <DropdownContainer>
          <PrescriptionModal.DropDown
            id="1"
            localeData={localeData}
            title={localeData.KNOW_POWER}
            imgSrc="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/GreenCheck.svg"
            selected={selected}
            toggle={toggle}
            // orderPlacedOption={orderPlacedOption.slice(0, 3)}
            orderPlacedOption={getPowerOptions(1)}
            ChangePage={ChangePage}
            deviceType={deviceType}
            skipPowerOptions={skipPowerOptions}
            showSavedPower={showSavedPower}
            isRTL={isRTL}
            powerOptions={powerOptions?.KNOW_POWER || [""]}
          />
          <PrescriptionModal.DropDown
            id="2"
            localeData={localeData}
            title={localeData.DONT_KNOW_POWER}
            imgSrc="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/DontKnowMyPower.svg"
            selected={selected}
            toggle={toggle}
            orderPlacedOption={getPowerOptions(2)}
            ChangePage={ChangePage}
            deviceType={deviceType}
            skipPowerOptions={skipPowerOptions}
            showSavedPower={showSavedPower}
            helpFunction={helpFunction}
            isRTL={isRTL}
            powerOptions={powerOptions?.DONT_KNOW_POWER || [""]}
          />
        </DropdownContainer>
      </Body>
    </>
  );
}
