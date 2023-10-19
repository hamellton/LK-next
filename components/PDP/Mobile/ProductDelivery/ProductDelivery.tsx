import {
  dispatchPinCodeData,
  getLocation,
} from "@/redux/slices/productDetailInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { DeliveryOptionsMobile } from "@lk/ui-library";
import { BottomSheet } from "@lk/ui-library";
import { PDP } from "@lk/ui-library";
import { BottomSheetNew } from "@lk/ui-library";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LenskartPromise from "./LenskartPromise";
import {
  DeliveryDetails,
  DeliveryDetailsContent,
  DeliveryDetailsWrapper,
  Text,
} from "./ProductDelivery.styles";
import { ProductDeliveryMobileType } from "./ProductDeliveryMobile.type";

const ProductDeliveryMobile = ({
  localeData,
  configData,
  type,
  pid,
}: ProductDeliveryMobileType) => {
  const dispatchPinCode = useDispatch<AppDispatch>();
  const [pincode, setPincode] = useState("");
  const [showDeliveryBottomSheet, setShowDeliveryBottomSheet] = useState(false);
  const [deliveryPinCode, setDeliveryPincode] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<number>();

  const {
    DELIVERY_DETAIL,
    DELIVERED_IN,
    FOUR_FIVE_DAYS,
    CHECK_PINCODE,
    ESTIMATED_DELIVERY_AT,
  } = localeData;

  const getDeliveryDetails = (pin: string | boolean) => {
    dispatchPinCode(
      dispatchPinCodeData({
        pid: pid,
        pinCode: Number(pin),
        countryCode: "in",
        sessionId,
      })
    );
  };
  useEffect(() => {
    const pin = localStorage.getItem("userPincode");
    if (pin) {
      setDeliveryPincode(pin);
      getDeliveryDetails(pin);
    }
  }, []);

  const sessionId = useSelector((state: RootState) => state.userInfo.sessionId);

  const {
    pinCodeData,
    pinCodeLoading,
    pinCodeError,
    pinCodeErrorMessage,
    productDetailData,
    locationLoading,
  } = useSelector((state: RootState) => state.productDetailInfo);

  const handleOnPincodeChange = (value: string) => {
    setPincode(value);
    if (value.length > 5) {
      dispatchPinCode(
        dispatchPinCodeData({
          pid: pid,
          pinCode: Number(value),
          countryCode: "in",
          sessionId,
        })
      );
    }
  };

  useEffect(() => {
    console.log({ pinCodeData });
    if (pinCodeData && pinCodeData.detailData) {
      setDeliveryPincode(
        pinCodeData?.pinCode || localStorage.getItem("userPincode")
      );
      setEstimatedDeliveryDate(pinCodeData.detailData.deliveryDate);
    }
  }, [pinCodeData]);

  useEffect(() => {
    if (deliveryPinCode !== "") {
      localStorage.setItem("userPincode", deliveryPinCode);
    }
  }, [deliveryPinCode]);

  const getFormattedDate = (date: number) => {
    return new Date(date)
      .toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .split(",")
      .join("");
  };

  return (
    <>
      <BottomSheet
        show={showDeliveryBottomSheet}
        closebottomSheet={() => setShowDeliveryBottomSheet(false)}
        onBackdropClick={() => setShowDeliveryBottomSheet(false)}
        backgroundColor="#eaeff4"
        borderRadius="0"
      >
        <DeliveryOptionsMobile
          onChangeHandler={(value: string) => handleOnPincodeChange(value)}
          pinCode={pinCodeData?.pinCode}
          deliveryDate={pinCodeData?.detailData?.deliveryDate}
          pinCodeError={pinCodeError}
          pinCodeErrorMessage={pinCodeErrorMessage}
          dataLocale={localeData}
          getLocation={() => dispatchPinCode(getLocation({ pid, sessionId }))}
          configData={configData}
          isLocationLoading={locationLoading}
          deliveryPinCode={deliveryPinCode}
        />
      </BottomSheet>
      <DeliveryDetailsWrapper>
        {DELIVERY_DETAIL && (
          <Text type="bold" className="deliveryDetails">
            {DELIVERY_DETAIL}
          </Text>
        )}
        <DeliveryDetailsContent>
          {deliveryPinCode ? (
            <DeliveryDetails>
              <Text size={"var(--fs-12)"} type="regular">
                {ESTIMATED_DELIVERY_AT} {deliveryPinCode} in{" "}
                <strong>
                  {getFormattedDate(estimatedDeliveryDate as number)}
                </strong>
              </Text>
            </DeliveryDetails>
          ) : (
            <DeliveryDetails>
              <Text type="regular">{DELIVERED_IN} </Text>
              <Text>{FOUR_FIVE_DAYS}*</Text>
            </DeliveryDetails>
          )}
          <DeliveryDetails onClick={() => setShowDeliveryBottomSheet(true)}>
            <Text type="regular" link={true}>
              {CHECK_PINCODE}
            </Text>
          </DeliveryDetails>
        </DeliveryDetailsContent>
        <LenskartPromise
          localeData={localeData}
          configData={configData}
          type={type}
        />
      </DeliveryDetailsWrapper>
    </>
  );
};

export default ProductDeliveryMobile;
