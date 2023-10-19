import { RootState } from "@/redux/store";
import { ComponentSizeENUM, kindENUM, ThemeENUM } from "@/types/baseTypes";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { Icons, ContactLensConsentCheckbox } from "@lk/ui-library";
import { Button } from "@lk/ui-library";
import { CommonLoader } from "@lk/ui-library";
import { IconContainer } from "containers/Checkout/address/styles";
import { ButtonContent } from "pageStyles/CartStyles";
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BarLoader from "./BarLoader";
import {
  ButtonContainer,
  DesktopButtonContainer,
  JusCheckout,
  PaymentContent,
  W100,
} from "./styles";
import { CheckoutMobile } from "@lk/ui-library";
import { hasContactLensItems } from "helpers/utils";
import { NewPayment } from "@lk/ui-library";

function debounce(callback: (...a: any) => any, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
function Jus({
  localeData,
  juspaySubmitHandler,
  jusPayInitiatePayload,
  cartItems = [],
  configData,
  currencyCode,
  totalAmount,
  primerSubmitHandler,
  selectedPaymentMethod,
  payLaterAllowed,
  getSubmitFunction,
  isContactLensCheckboxChecked,
  setIsContactLensCheckboxChecked,
  isRetry,
}: any) {
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const primerInfo = useSelector((state: RootState) => state.primerInfo);

  const {
    YOU_WILL_REDIRECTED_TO_PAYMENT,
    PLACE_ORDER,
    PAY_NOW,
    PAY_LATER,
    PAY_AND_BOOK_APPOINTMENT,
    PROCEED_TO_PAY,
    MSITE_PAY_LATER,
  } = localeData || {};
  const [firePreFetch, setFirePreFetch] = useState(false);
  // const [checked, setChecked] = useState(false);
  // const isContactLensConsentEnabled = !!(
  //   hasContactLensItems(cartItems) && configData?.CL_DISCLAIMER
  // );
  // console.log(isContactLensConsentEnabled, "isContactLensConsentEnabled");
  const paylaterPaymentMethod = getSubmitFunction("paylater");
  const [showPayLaterModal, setShowPayLaterModal] = useState(false);

  const closePayLaterModal = () => {
    setShowPayLaterModal(false);
  };

  useEffect(() => {
    if (jusPayInitiatePayload) {
      const payload = {
        requestId: jusPayInitiatePayload.requestId,
        service: jusPayInitiatePayload.service,
        payload: {
          clientId: jusPayInitiatePayload.payload.clientId,
        },
      };
      if (firePreFetch) {
        setTimeout(() => {
          // @ts-ignore
          window.HyperServices.preFetch(payload);
          setFirePreFetch(false);
        }, 2000);
      }
    }
  }, [jusPayInitiatePayload, firePreFetch]);

  const handlePayment = () => {
    // if (isContactLensConsentEnabled) {
    //   if (!isContactLensCheckboxChecked) return;
    // }
    if (!primerInfo.isPrimerActive && !primerInfo.isLoading)
      juspaySubmitHandler("juspay", "JUSPAY");
  };

  const handlePaymentWithDebounce = debounce(handlePayment, 1000);

  const toggleChecked = () => {
    setIsContactLensCheckboxChecked(!isContactLensCheckboxChecked);
  };

  // const getButtonBackgroundColor = () => {
  //   if (isContactLensConsentEnabled) return checked ? "#00BBC6" : "#E4E4E4";
  //   return "#00BBC6";
  // };

  const handlePayLater = () => {
    paylaterPaymentMethod("paylater", null);
  };

  const _currencyCode = (code: string) => {
    if (code === "USD") return "$";
    else return code;
  };

  const handlePayLaterModalPayNow = () => {
    if (primerInfo.isPrimerActive) {
      closePayLaterModal();
      return;
    }
    handlePaymentWithDebounce();
  };

  const desktopContainer = (
    <>
      {pageInfo?.country.toLowerCase() !== "ae" && (
        <JusCheckout>
          <PaymentContent>
            <p>{YOU_WILL_REDIRECTED_TO_PAYMENT}</p>
          </PaymentContent>
          <W100>
            {firePreFetch ? (
              // <BarLoader />
              <CommonLoader show />
            ) : (
              <>
                {/* {isContactLensConsentEnabled && (
                <ContactLensConsentCheckbox
                  deviceType={pageInfo?.deviceType}
                  toggleChecked={toggleChecked}
                  checked={isContactLensCheckboxChecked}
                  dataLocale={localeData}
                />
              )} */}
                <DesktopButtonContainer>
                  {payLaterAllowed && (
                    <NewPayment.PayLater
                      dataLocale={localeData}
                      handlePayLater={handlePayLater}
                      isPrimerOff={true}
                      handlePayNow={handlePayLaterModalPayNow}
                      // isContactLensConsentEnabled={isContactLensConsentEnabled}
                      // isContactLensCheckboxChecked={isContactLensCheckboxChecked}
                    />
                  )}
                  <Button
                    id="juspay-button"
                    showChildren={true}
                    width="100"
                    font={TypographyENUM.lkSansBold}
                    onClick={handlePaymentWithDebounce}
                    componentSize={ComponentSizeENUM.medium}
                    style={{
                      maxWidth: payLaterAllowed ? "" : "200px",
                    }}
                    // disabled={
                    //   isContactLensConsentEnabled && !isContactLensCheckboxChecked
                    // }
                  >
                    <ButtonContent
                      styledFont={TypographyENUM.lkSansBold}
                      fontSize="16px"
                    >
                      {PLACE_ORDER}
                      <IconContainer isRTL={pageInfo.isRTL}>
                        <Icons.IconRight />
                      </IconContainer>
                    </ButtonContent>
                  </Button>
                </DesktopButtonContainer>
              </>
            )}
          </W100>
        </JusCheckout>
      )}
    </>
  );

  const mobileContainer = (
    <>
      <JusCheckout isPrimerActive={primerInfo.isPrimerActive} isRetry={isRetry}>
        <div>
          {firePreFetch ? (
            // <BarLoader />
            <CommonLoader show />
          ) : (
            <>
              <CheckoutMobile.CheckoutFloatingSheet>
                {/* {(selectedPaymentMethod?.toLowerCase() === "atome" ||
                  "shopback") &&
                  isContactLensConsentEnabled && (
                    <ContactLensConsentCheckbox
                      deviceType={pageInfo?.deviceType}
                      toggleChecked={toggleChecked}
                      checked={isContactLensCheckboxChecked}
                      dataLocale={localeData}
                    />
                  )} */}
                <ButtonContainer>
                  {payLaterAllowed && (
                    <>
                      <Button
                        showChildren={true}
                        style={{
                          paddingTop: "7px",
                          paddingBottom: "7px",
                          height: 46,
                        }}
                        font={TypographyENUM.lkSansBold}
                        width="100"
                        onClick={() => setShowPayLaterModal(true)}
                        theme={ThemeENUM.secondary}
                        kind={kindENUM.border}
                      >
                        <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                          {MSITE_PAY_LATER}
                        </ButtonContent>
                      </Button>
                      <Button
                        id={`validate-button-primer-${selectedPaymentMethod}`}
                        showChildren={true}
                        style={{
                          paddingTop: "7px",
                          paddingBottom: "7px",
                          height: 46,
                        }}
                        font={TypographyENUM.lkSansBold}
                        width="100"
                        onClick={handlePaymentWithDebounce}
                        disabled={
                          // (isContactLensConsentEnabled &&
                          //   !isContactLensCheckboxChecked) ||
                          primerInfo.isPrimerActive && !selectedPaymentMethod
                        }
                      >
                        <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                          {_currencyCode(currencyCode)}
                          {totalAmount}
                          {" • "}
                          {PAY_AND_BOOK_APPOINTMENT}
                        </ButtonContent>
                      </Button>
                    </>
                  )}

                  {!payLaterAllowed && (
                    <Button
                      id={`validate-button-primer-${selectedPaymentMethod}`}
                      showChildren={true}
                      style={{
                        paddingTop: "7px",
                        paddingBottom: "7px",
                        height: 46,
                      }}
                      font={TypographyENUM.lkSansBold}
                      width="100"
                      onClick={handlePaymentWithDebounce}
                      disabled={
                        // (isContactLensConsentEnabled &&
                        //   !isContactLensCheckboxChecked) ||
                        primerInfo.isPrimerActive && !selectedPaymentMethod
                      }
                    >
                      <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                        {_currencyCode(currencyCode)}
                        {totalAmount}
                        {" • "}
                        {configData?.SHOW_CTA_TEXT_PROCEED_TO_PAY
                          ? PROCEED_TO_PAY
                          : PLACE_ORDER}
                        <IconContainer isRTL={pageInfo.isRTL}>
                          <Icons.IconRight />
                        </IconContainer>
                      </ButtonContent>
                    </Button>
                  )}
                </ButtonContainer>
              </CheckoutMobile.CheckoutFloatingSheet>
              {showPayLaterModal && (
                <CheckoutMobile.PayLaterBottomsheet
                  closeBottomSheet={closePayLaterModal}
                  showBottomSheet={closePayLaterModal}
                  handlePayNow={handlePayLaterModalPayNow}
                  handlePayLater={handlePayLater}
                />
              )}
            </>
          )}
        </div>
      </JusCheckout>
    </>
  );

  return pageInfo?.deviceType === "desktop"
    ? desktopContainer
    : mobileContainer;
}

export default memo(Jus);
