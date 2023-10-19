import { AppDispatch, RootState } from "@/redux/store";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { Icons } from "@lk/ui-library";
import { CommonLoader } from "@lk/ui-library";
import { Button } from "@lk/ui-library";
import { NewPriceBreakup, Spinner } from "@lk/ui-library";
import { useRouter } from "next/router";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import {
  ButtonContent,
  Flex,
  HeadingText,
  RightWrapper,
  StickyDiv,
} from "pageStyles/CartStyles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentScreen from "./components/PaymentScreen";
import {
  BillFinal,
  BillLabel,
  BillPrice,
  BillPriceGreen,
  FragmentMarginTop,
  JustifySpaceBetween,
  PaymentWrapper,
  PaymentWrapperMobile,
  PowerCheckout,
  RetryBillContainer,
} from "./styles";
import usePaymentSubmitActions from "./components/hooks/usePaymentSubmitActions";
import { CallBackType } from "./components/helpers";
import {
  AddressBody,
  IconContainer,
  PageContainer,
} from "containers/Checkout/address/styles";
import CheckoutBase from "containers/Checkout/Checkout.component";
import { userProperties } from "helpers/userproperties";
import PaymentScreenMobile from "./components/PaymentScreenMobile";
import { CheckoutMobile } from "@lk/ui-library";
import {
  NeedHelpCta,
  ContactLensConsentCheckbox,
  ToastMessage,
  Toast,
} from "@lk/ui-library";
import {
  deleteCookie,
  getCookie,
  hasCookie,
  setCookie,
} from "@/helpers/defaultHeaders";
import { getCurrency, hasContactLensItems } from "helpers/utils";
import Header from "../Cart/MobileCartHeader";
import { MethodsToShow } from "@/types/hooks/usePrimer.types";
import { getOrderData, getV2OrderData } from "@/redux/slices/myorder";
import { TotalSubtitle } from "./components/styles";
import {
  LogOutButton,
  LoginInfo,
  LoginUser,
} from "containers/Checkout/address";
import { Alert } from "@lk/ui-library";
import { AlertColorsENUM, ComponentSizeENUM } from "@/types/baseTypes";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { logoutSprinklrBot } from "helpers/chatbot";
interface CardData {
  cardBrand: string;
  cardMode: string;
  cardToken: string;
  cardType: string;
  expired: boolean;
  expiryMonth: string;
  expiryYear: string;
  nameOnCard: string;
  number: string;
  storeCard: boolean;
}

const Payment = ({
  localeData,
  paymentMethods,
  sessionId,
  savedCards,
  availableOffers,
  configData,
  orderData,
  isRetry,
  oid,
  renderPrimerUI,
  setRedirect,
}: {
  localeData: DataType;
  paymentMethods: DataType;
  sessionId: string;
  savedCards: CardData[] | [];
  availableOffers: DataType[];
  configData: DataType;
  orderData: DataType;
  isRetry: Boolean;
  oid?: string;
  setRedirect?: (val: boolean) => void;
  renderPrimerUI: (methodToShow: MethodsToShow) => void;
}) => {
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const primerInfo = useSelector((state: RootState) => state.primerInfo);
  const { BILL_DETAILS } = localeData;
  const { countryCode, isRTL, country, subdirectoryPath } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const { shippingAddress, errorMessage, isError, isLoading } = useSelector(
    (state: RootState) => state.paymentInfo
  );
  const { orderData: orderDataRedux } = useSelector(
    (state: RootState) => state.myOrderInfo
  );
  // console.log(orderData, oid, sessionId, "orderData");
  const dispatch = useDispatch<AppDispatch>();

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!orderData || Object.keys(orderData)?.length === 0) {
      dispatch(
        getV2OrderData({
          sessionId: sessionId,
          orderID: getCookie("orderId")?.toString() || "",
        })
      );
    }
  }, []);

  const authInfo = useSelector((state: RootState) => state.authInfo);

  const { cartItems = [] } = cartData || {};

  const pIds = cartItems ? cartItems.map((item) => item.itemId) : [];
  const whatsAppChatMsg =
    localeData.BUY_ON_CHAT_HELP_CTA_CART ||
    (localeData.BUYONCHAT_HELP_CTA_CART &&
      (
        localeData.BUY_ON_CHAT_HELP_CTA_CART ||
        localeData.BUYONCHAT_HELP_CTA_CART
      )
        .replace("<pageName>", "Select Address Page")
        .replace("<pid-no>", pIds.join(",")));

  const buyOnChatConfig =
    configData?.BUY_ON_CALL_WIDGET &&
    JSON.parse(configData?.BUY_ON_CALL_WIDGET);
  const { signInStatus } = authInfo;
  const router = useRouter();
  let queryParams = { ...router.query };
  const { eid = "" } = queryParams;
  useEffect(() => {
    // if(userInfo.isLogin || userInfo.isGuestFlow) router.push("/checkout/address");
    if (
      !(cartData.cartItems && cartData.cartItems.length > 0) &&
      !hasCookie("orderId") &&
      oid === ""
    ) {
      router.replace("/checkout/address");
    } else if (hasCookie("orderId") && !oid) {
      router.push(
        `/checkout/retry/?oid=${btoa(`${getCookie("orderId")}`)}&eid=${btoa(
          userInfo.email
        )}`
      );
    } else if (cartData.cartIsError && !isRetry) {
      router.push("/cart");
    }
  }, [userInfo, router, cartData.cartItems, cartData.cartIsError]);
  const changeAddressHandler = () => {
    router.replace("/checkout/address");
  };
  const shippingAddressData = shippingAddress?.customer?.address || null;
  const [showProceedBtn, setShowProceedBtn] = useState(false);
  const [proceedBtn, setProceedBtn] = useState<CallBackType | null>(null);
  const [isContactLensCheckboxChecked, setIsContactLensCheckboxChecked] =
    useState(false);
  let pageName = "payment-view";
  let platform = "desktop";
  // useEffect(() => {
  //   if (!userInfo.userLoading)
  //     userProperties(userInfo, pageName, pageInfo, configData);
  // }, [
  //   // configData,
  //   // pageInfo, pageName, userInfo,
  //   userInfo.userLoading,
  // ]);
  const showProceedBtnHandler = (display: boolean, cb: CallBackType) => {
    setShowProceedBtn(display);
    setProceedBtn(cb);
  };
  const { gvCheckoutHandler, fullScCheckout } = usePaymentSubmitActions(
    sessionId,
    savedCards,
    Boolean(oid) ? oid : "",
    Boolean(eid) ? atob(eid as string) : ""
  );
  // console.log(proceedBtn, "proceedBtn", gvCheckoutHandler);
  const proceedClickHandler = (proceedBtn: CallBackType | null) => {
    if (proceedBtn === CallBackType.fullSc) return () => fullScCheckout();
    if (proceedBtn === CallBackType.gv) return () => gvCheckoutHandler("gv");
    return () => null;
  };
  const cartTotalAmount =
    cartData.cartTotal &&
    Array.isArray(cartData.cartTotal) &&
    cartData.cartTotal?.find((ct) => ct.type === "total")?.amount;
  const currencyCode = isRetry
    ? orderData?.amount?.currencyCode
    : cartData?.currencyCode;
  const totalAmount = isRetry ? orderData?.amount?.total : cartTotalAmount;
  const checkoutBreadcrumb =
    configData?.CHECKOUT_BREADCRUMB_TEXT &&
    JSON.parse(configData.CHECKOUT_BREADCRUMB_TEXT);
  const breadcrumbData = [
    {
      text: checkoutBreadcrumb?.LOGIN_SIGNUP,
      onClick: () => null,
      disabled: true,
      id: "account_verification",
    },
    {
      text: "Shipping Address",
      onClick: changeAddressHandler,
      disabled: false,
      id: "shipping_address",
    },
    {
      text: "Payment",
      onClick: () => null,
      disabled: false,
      id: "payment",
    },
    {
      text: "Summary",
      onClick: () => null,
      disabled: true,
      id: "summary",
    },
  ];

  // const isContactLensConsentEnabled = !!(
  //   hasContactLensItems(cartItems) && configData?.CL_DISCLAIMER
  // );

  const isContactLensConsentEnabled = false;

  const _currencyCode = (code: string) => {
    if (code === "USD") return "$";
    if (code === "SGD") return "$";
    else if (code === "INR") return "₹";
    else return code;
  };

  const currency = (code: string) => {
    if (code === "USD") return "$";
    else if (code === "SAR") return "SAR";
    else if (code === "SGD") return "$";
    else if (code === "INR") return "₹";
    else return code;
  };

  const toggleChecked = () => {
    setIsContactLensCheckboxChecked(!isContactLensCheckboxChecked);
  };

  const logoutHandler = () => {
    sessionStorageHelper.removeItem("isContactLensCheckboxChecked");
    deleteCookie(`clientV1_${pageInfo.country}`);
    setCookie("isLogined", 0);
    setCookie("log_in_status", false);
    setCookie("isPresale", false);
    deleteCookie("presalesUN");
    deleteCookie("presalesUP");
    window.location.href =
      !pageInfo.subdirectoryPath || pageInfo.subdirectoryPath === "NA"
        ? "/"
        : pageInfo.subdirectoryPath;

    //* logout sprinklr
    logoutSprinklrBot();
  };

  useEffect(() => {
    if (isError && errorMessage) {
      setShowToast(true);
    }
  }, [errorMessage]);

  const hasFrameProduct = !!cartData.cartItems?.some(
    (eyeFrame: { itemClassification: string; itemPowerRequired: string }) =>
      (eyeFrame.itemClassification === "eyeframe" ||
        eyeFrame.itemClassification === "sunglasses") &&
      eyeFrame.itemPowerRequired === "POWER_REQUIRED"
  );

  const desktopContainer = (
    <PageContainer>
      <CartHeader
        appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
        safeText={localeData.SAFE_SECURE}
      />
      {/* <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", 
      backgroundColor: "#FBF9F7", margin: "auto", maxWidth: "1500px", width: "88vw"}}> */}

      {showToast && errorMessage && (
        <ToastMessage
          message={errorMessage}
          color="orange"
          duration={4000}
          show={showToast}
          hideFn={() => {
            setShowToast(false);
          }}
          showIcon={false}
        />
      )}
      <AddressBody>
        <PaymentWrapper>
          {authInfo?.dualLoginStatus?.isLoggedIn && (
            <LoginInfo>
              <Alert
                color={AlertColorsENUM.blue}
                componentSize={ComponentSizeENUM.medium}
                font={TypographyENUM.lkSansRegular}
                id="Alert"
              >
                <Flex>
                  <span>
                    {"Logged in as"}{" "}
                    <LoginUser>
                      {authInfo?.dualLoginStatus?.data?.userName}
                    </LoginUser>
                  </span>
                  <LogOutButton onClick={logoutHandler}>Logout</LogOutButton>
                </Flex>
              </Alert>
            </LoginInfo>
          )}
          <CheckoutBase
            activeBreadcrumbId="payment"
            breadcrumbData={isRetry ? [] : breadcrumbData}
            isRTL={pageInfo.isRTL}
          >
            <PaymentScreen
              paymentMethods={paymentMethods}
              localeData={localeData}
              sessionId={sessionId}
              savedCards={savedCards}
              availableOffers={availableOffers}
              cartData={cartData}
              configData={configData}
              showProceedBtnHandler={showProceedBtnHandler}
              orderData={
                orderData && Object.keys(orderData).length > 0
                  ? orderData
                  : orderDataRedux
              }
              isRetry={isRetry}
              orderId={oid}
              renderPrimerUI={renderPrimerUI}
              // isContactLensConsentEnabled={false}
              payLaterAllowed={cartData.payLaterAllowed}
              setRedirect={setRedirect}
              eid={eid}
            />
          </CheckoutBase>
        </PaymentWrapper>
        {(cartData.cartItems && cartData.cartItems.length > 0) ||
        (isRetry && orderData?.id) ||
        Boolean(oid) ? (
          ((primerInfo?.isPrimerActive &&
            paymentMethods?.paymentMethods?.length > 1) ||
            !primerInfo?.isPrimerActive) ? (
            <RightWrapper padding="60px 0px">
              <StickyDiv>
                <HeadingText styledFont={TypographyENUM.serif}>
                  {BILL_DETAILS}
                </HeadingText>
                {/* {shippingAddressData && (
                <NewPayment.PaymentAddress
                  isRTL={isRTL}
                  onBtnClick={changeAddressHandler}
                  headInfo="Deliver to: "
                  headText={`${shippingAddressData.firstName || ""} ${
                    shippingAddressData.lastName || ""
                  }`}
                  btnText="Change"
                  mainText={`${shippingAddressData.addressline1 || ""} ${
                    shippingAddressData.addressline2 || ""
                  }`}
                  fullWidth={true}
                />
              )} */}
                {isRetry && orderData?.id ? (
                  <RetryBillContainer>
                    <JustifySpaceBetween>
                      <BillLabel
                        fontSize="14px"
                        lineHeight="24px"
                        color="#000042"
                      >
                        {localeData?.ITEM_TOTAL}
                      </BillLabel>{" "}
                      <BillPrice
                        fontSize="14px"
                        lineHeight="24px"
                        color="#000042"
                      >
                        {localeData?.CURRENCY_SYMBOL}
                        {Math.max(0, orderData.amount.subTotal)}
                      </BillPrice>
                    </JustifySpaceBetween>
                    {orderData.amount.totalDiscount ? (
                      <JustifySpaceBetween>
                        <BillLabel
                          fontSize="14px"
                          lineHeight="24px"
                          color="#000042"
                        >
                          {localeData?.CART_DISCOUNT}
                        </BillLabel>{" "}
                        <BillPriceGreen fontSize="16px" lineHeight="24px">
                          -{localeData?.CURRENCY_SYMBOL}
                          {orderData.amount.totalDiscount}
                        </BillPriceGreen>
                      </JustifySpaceBetween>
                    ) : (
                      <></>
                    )}
                    <div>
                      {orderData.amount.totalDiscount &&
                      orderData.amount.subTotal ? (
                        <JustifySpaceBetween>
                          <BillFinal
                            fontSize="14px"
                            lineHeight="24px"
                            color="#000042"
                          >
                            {localeData?.TOTAL_BEFORE_TAX}
                          </BillFinal>{" "}
                          <BillPrice
                            fontSize="14px"
                            lineHeight="24px"
                            color="#000042"
                          >
                            {localeData?.CURRENCY_SYMBOL}
                            {(
                              Math.max(0, orderData.amount.subTotal) -
                              Math.max(0, orderData.amount.totalDiscount)
                            ).toFixed(2)}
                          </BillPrice>
                        </JustifySpaceBetween>
                      ) : (
                        <></>
                      )}
                      {configData?.SHOW_TOTAL_TAX &&
                      orderData.amount.totalTax ? (
                        <JustifySpaceBetween>
                          <BillLabel
                            fontSize="14px"
                            lineHeight="24px"
                            color="#000042"
                          >
                            {localeData?.TAXES}
                          </BillLabel>{" "}
                          <BillPrice
                            fontSize="14px"
                            lineHeight="24px"
                            color="#000042"
                          >
                            +{localeData?.CURRENCY_SYMBOL}
                            {orderData.amount.totalTax}
                          </BillPrice>
                        </JustifySpaceBetween>
                      ) : (
                        <></>
                      )}
                      {configData?.SHOW_CONVENIENCE_FEES && (
                        <JustifySpaceBetween>
                          <BillLabel
                            fontSize="14px"
                            lineHeight="24px"
                            color="#000042"
                          >
                            {localeData?.CONVENIENCE_FEES}
                          </BillLabel>
                          <BillPriceGreen fontSize="16px" lineHeight="24px">
                            {orderData.amount.shipping
                              ? `+${localeData?.CURRENCY_SYMBOL}${orderData.amount.shipping}`
                              : localeData?.FREE}
                          </BillPriceGreen>
                        </JustifySpaceBetween>
                      )}
                    </div>
                    <JustifySpaceBetween>
                      <BillFinal
                        fontSize="16px"
                        lineHeight="24px"
                        color="#000042"
                      >
                        {localeData?.TOTAL_PAYABLE}
                      </BillFinal>{" "}
                      <BillFinal
                        fontSize="16px"
                        lineHeight="24px"
                        color="#000042"
                      >
                        {localeData?.CURRENCY_SYMBOL}
                        {orderData.amount.total}
                      </BillFinal>
                    </JustifySpaceBetween>
                  </RetryBillContainer>
                ) : (
                  <NewPriceBreakup
                    id="1"
                    width="100"
                    dataLocale={localeData}
                    isRTL={isRTL}
                    priceData={cartData.cartTotal}
                    onShowCartBtnClick={() => {
                      router.push("/cart");
                    }}
                    showPolicy={false}
                    showCart={false}
                    currencyCode={getCurrency(country)}
                    enableTax={configData?.ENABLE_TAX}
                  />
                )}

                {showProceedBtn ? (
                  <>
                    {/* {isContactLensConsentEnabled && (
                    <ContactLensConsentCheckbox
                      deviceType={pageInfo?.deviceType}
                      toggleChecked={toggleChecked}
                      checked={isContactLensCheckboxChecked}
                      dataLocale={localeData}
                    />
                  )} */}
                    <Button
                      id="button"
                      showChildren={true}
                      width="100%"
                      font={TypographyENUM.lkSansBold}
                      onClick={proceedClickHandler(proceedBtn)}
                      // disabled={
                      //   isContactLensConsentEnabled &&
                      //   !isContactLensCheckboxChecked
                      // }
                    >
                      <ButtonContent
                        isRTL={pageInfo.isRTL}
                        styledFont={TypographyENUM.lkSansBold}
                      >
                        {localeData.PLACE_ORDER} <Icons.IconRight />
                      </ButtonContent>
                    </Button>
                  </>
                ) : null}
              </StickyDiv>
            </RightWrapper>
          ) : null
        ) : (
          <div style={{ padding: "90px 50px" }}>
            <CommonLoader show />
          </div>
        )}
      </AddressBody>
      <CommonLoader
        show={
          primerInfo.isLoading ||
          (!primerInfo.error.isError &&
            !primerInfo.paymentMethods &&
            primerInfo.isPrimerActive)
        }
      />
    </PageContainer>
  );

  const mobileContainer = (
    <PageContainer>
      <Header
        logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
        showBackBtn={true}
        onClickBack={() => history.back()}
        dontShowlogo={false}
        isClickable={true}
        configData={configData}
        hasOnlyCLProduct={
          !cartData?.cartItems?.some(
            (item) =>
              (item.itemClassification === "eyeframe" ||
                item.itemClassification === "sunglasses") &&
              (item.itemPowerRequired === "POWER_REQUIRED" ||
                item.itemPowerRequired === "POWER_SUBMITTED")
          )
        }
        isRTL={isRTL}
        pageNumber={3}
      />
      {/* <CartHeader
        appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
        safeText={localeData.SAFE_SECURE}
      /> */}
      {/* <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", 
      backgroundColor: "#FBF9F7", margin: "auto", maxWidth: "1500px", width: "88vw"}}> */}

      {showToast && errorMessage && (
        <Toast
          timeOut={4000}
          text={errorMessage}
          hideFn={() => {
            setShowToast(false);
          }}
          width={"90%"}
        />
      )}
      <CheckoutMobile.TopSection
        heading={localeData.SELECT_PAYMENT_METHOD}
        showChildren={true}
        className="paymentHead"
        isRTL={isRTL}
      >
        <div>
          <NeedHelpCta
            isRendered={buyOnChatConfig?.cta?.isShown}
            isBuyOnChat={buyOnChatConfig?.buyonchat}
            localeData={localeData}
            whatsappChatMsg={whatsAppChatMsg}
            phoneNumber={buyOnChatConfig.eyeglasses.tel}
            // onClick={() => {}}
            sessionId={sessionId}
            savedCards={savedCards}
            availableOffers={availableOffers}
            cartData={cartData}
            showProceedBtnHandler={showProceedBtnHandler}
            configData={configData}
            dataLocale={localeData}
          />
        </div>
        <TotalSubtitle>
          {isRetry
            ? orderData?.amount?.currencyCode &&
              `${localeData.TOTAL}: ${currency(
                orderData.amount?.currencyCode
              )}${orderData.amount?.total}`
            : `${localeData.TOTAL}: ${currency(
                cartData?.currencyCode
              )}${cartTotalAmount}`}
        </TotalSubtitle>
      </CheckoutMobile.TopSection>
      <PaymentWrapperMobile isPrimerActive={primerInfo.isPrimerActive}>
        {hasFrameProduct &&
          configData?.ENABLE_POWER_WILL_BE_TAKEN_AFTER_CHECKOUT_IN_ADDRESS_TABS && (
            <PowerCheckout margin="10px">
              {" "}
              <Icons.InfoCircle />
              {localeData?.POWER_WILL_BE_TAKEN_AFTER_CHECKOUT}
            </PowerCheckout>
          )}
        <PaymentScreenMobile
          paymentMethods={paymentMethods}
          localeData={localeData}
          sessionId={sessionId}
          savedCards={savedCards}
          availableOffers={availableOffers}
          cartData={cartData}
          showProceedBtnHandler={showProceedBtnHandler}
          configData={configData}
          orderData={
            orderData && Object.keys(orderData).length > 0
              ? orderData
              : orderDataRedux
          }
          isRetry={isRetry}
          orderId={oid}
          renderPrimerUI={renderPrimerUI}
          // isContactLensConsentEnabled={false}
          payLaterAllowed={cartData.payLaterAllowed}
          setRedirect={setRedirect}
          eid={eid}
        />

        {((cartData.cartItems && cartData.cartItems.length > 0) ||
          (isRetry && orderData?.id)) &&
          (
          <>
            <FragmentMarginTop>
              <HeadingText
                fontSize={"16"}
                styledFont={TypographyENUM.lkSansRegular}
              >
                {BILL_DETAILS}
              </HeadingText>

              {isRetry && orderData?.id ? (
                <RetryBillContainer>
                  <JustifySpaceBetween>
                    <BillLabel>{localeData?.ITEM_TOTAL}</BillLabel>{" "}
                    <BillPrice>
                      {localeData?.CURRENCY_SYMBOL}
                      {Math.max(0, orderData.amount.subTotal)}
                    </BillPrice>
                  </JustifySpaceBetween>
                  <JustifySpaceBetween>
                    <BillLabel>{localeData?.CART_DISCOUNT}</BillLabel>{" "}
                    <BillPriceGreen>
                      -{localeData?.CURRENCY_SYMBOL}
                      {orderData.amount.totalDiscount}
                    </BillPriceGreen>
                  </JustifySpaceBetween>
                  <div>
                    <JustifySpaceBetween>
                      <BillLabel>{localeData?.TOTAL_BEFORE_TAX}</BillLabel>{" "}
                      <BillPrice>
                        {localeData?.CURRENCY_SYMBOL}
                        {(
                          Math.max(0, orderData.amount.subTotal) -
                          Math.max(0, orderData.amount.totalDiscount)
                        ).toFixed(2)}
                      </BillPrice>
                    </JustifySpaceBetween>
                    <JustifySpaceBetween>
                      <BillLabel>{localeData?.TAXES}</BillLabel>{" "}
                      <BillPrice>
                        +{localeData?.CURRENCY_SYMBOL}
                        {orderData.amount.totalTax}
                      </BillPrice>
                    </JustifySpaceBetween>
                    {configData?.SHOW_CONVENIENCE_FEES && (
                      <JustifySpaceBetween>
                        <BillLabel>{localeData?.CONVENIENCE_FEES}</BillLabel>
                        <BillPriceGreen>
                          {orderData.amount.shipping
                            ? `+${localeData?.CURRENCY_SYMBOL}${orderData.amount.shipping}`
                            : localeData?.FREE}
                        </BillPriceGreen>
                      </JustifySpaceBetween>
                    )}
                  </div>
                  <JustifySpaceBetween>
                    <BillFinal>{localeData?.TOTAL_PAYABLE}</BillFinal>{" "}
                    <BillFinal>
                      {localeData?.CURRENCY_SYMBOL}
                      {orderData.amount.total}
                    </BillFinal>
                  </JustifySpaceBetween>
                </RetryBillContainer>
              ) : (
                <NewPriceBreakup
                  id="1"
                  width="100"
                  dataLocale={localeData}
                  isRTL={isRTL}
                  priceData={cartData.cartTotal}
                  onShowCartBtnClick={() => {
                    router.push("/cart");
                  }}
                  showPolicy={false}
                  showCart={false}
                  currencyCode={getCurrency(country)}
                  enableTax={configData?.ENABLE_TAX}
                />
              )}

              {showProceedBtn ? (
                <CheckoutMobile.CheckoutFloatingSheet>
                  {/* {isContactLensConsentEnabled && (
                    <ContactLensConsentCheckbox
                      deviceType={pageInfo?.deviceType}
                      toggleChecked={toggleChecked}
                      checked={isContactLensCheckboxChecked}
                      dataLocale={localeData}
                    />
                  )} */}
                  <Button
                    id="floating-sheet-button"
                    style={{
                      paddingTop: "7px",
                      paddingBottom: "7px",
                      height: 46,
                    }}
                    font={TypographyENUM.lkSansBold}
                    width="100"
                    showChildren={true}
                    // text={"Place Order"}
                    onClick={proceedClickHandler(proceedBtn)}
                    // disabled={
                    //   isContactLensConsentEnabled &&
                    //   !isContactLensCheckboxChecked
                    // }
                  >
                    <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                      {_currencyCode(currencyCode)}
                      {totalAmount}
                      {" • "}
                      {localeData?.PLACE_ORDER}
                      <IconContainer isRTL={pageInfo.isRTL}>
                        <Icons.IconRight />
                      </IconContainer>
                    </ButtonContent>
                  </Button>
                </CheckoutMobile.CheckoutFloatingSheet>
              ) : null}
            </FragmentMarginTop>
          </>
        )}
      </PaymentWrapperMobile>
      <CommonLoader
        show={
          primerInfo.isLoading ||
          (!primerInfo.error.isError &&
            !primerInfo.paymentMethods &&
            primerInfo.isPrimerActive)
        }
      />
    </PageContainer>
  );

  return (
    <>
      {pageInfo?.deviceType === "desktop" && desktopContainer}
      {pageInfo?.deviceType === "mobilesite" && mobileContainer}
      {isLoading && <Spinner show fullPage />}
    </>
  );
};

export default Payment;
