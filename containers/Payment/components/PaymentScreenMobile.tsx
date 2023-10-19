import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DataType } from "@/types/coreTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import PromotionalDiscounts from "./PromotionalDiscounts";
import {
  CallBackType,
  getCardEligibility,
  // getGroupEligibility,
} from "./helpers";
import usePaymentSubmitActions from "./hooks/usePaymentSubmitActions";
import {
  // MainHeading,
  PaymentGroupHeading,
  Spacer,
  HiddenForm,
} from "./styles";
// import PaymentCardMapper from "./PaymentCardMapper";
import useProcessOrder from "./hooks/useProcessOrder";
import useCaptcha from "./hooks/useCaptcha";
import {
  CheckoutMobile,
  BottomSheet,
  Button,
  FloatingLabelInput,
} from "@lk/ui-library";
// import PaymentCardMapperMobile from "./PaymentCardMapperMobile";
import { NewPayment } from "@lk/ui-library";
import PromotionalDiscountsMobile from "./PromotionalDiscountsMobile";
import Link from "next/link";
import { addToCartNoPower } from "@/redux/slices/cartInfo";
import router from "next/router";
import {
  getUpiTransactionStatus,
  resetVpaStatus,
} from "@/redux/slices/paymentInfo";
import { getCookie } from "@/helpers/defaultHeaders";
import Jus from "../JusPay/Jus";
import Accordion, {
  Captcha,
  CaptchaSection,
  CODBottomSheet,
  ErrorMessage,
  Margin,
} from "./MsiteAccordianPaymentAE";
import { kindENUM, ThemeENUM, TypographyENUM } from "@/types/baseTypes";
import { abandonedLeads } from "@/redux/slices/userInfo";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import PromotionalDiscountsMobileNew from "./PromotionalDiscountsMobileNew";
// import { useRouter } from 'next/router';
// import { APIService, RequestBody } from '@lk/utils';
// import { APIMethods } from '@/types/apiTypes';
// import { headerArr } from 'helpers/defaultHeaders';
// import { paymentFunctions } from '@lk/core-utils';

const PaymentScreenMobile = ({
  paymentMethods,
  sessionId,
  localeData,
  savedCards,
  availableOffers,
  cartData,
  showProceedBtnHandler,
  configData,
  dataLocale,
  orderData,
  isRetry,
  orderId,
  renderPrimerUI,
  isContactLensConsentEnabled,
  payLaterAllowed,
  setRedirect,
  eid,
}: any) => {
  const dispatch: typeof store.dispatch = useDispatch();
  const paymentData = useSelector((state: RootState) => state.paymentInfo);
  const processPaymentForm: React.MutableRefObject<any> = useRef(null);
  const cartTotal = useSelector((state: RootState) => state.cartInfo.cartTotal);
  const isCartEmpty =
    cartTotal &&
    Array.isArray(cartTotal) &&
    cartTotal?.find((ct) => ct.type === "total")?.amount === 0;
  const cartTotalAmount =
    cartTotal &&
    Array.isArray(cartTotal) &&
    cartTotal?.find((ct) => ct.type === "total")?.amount;
  const appliedSc = useSelector((state: RootState) => state.cartInfo.appliedSc);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const primerInfo = useSelector((state: RootState) => state.primerInfo);
  const { isRTL, country } = pageInfo;
  // const { ullScCheckout } = usePaymentSubmitActions(sessionId, savedCards);
  const [triggerOnBottomsheet, setTriggerOnBottomsheet] = useState(false);
  const {
    qrCode,
    qrAmount,
    disableAllExceptQr,
    orderCreatedSuccess,
    setSectedPrimerCreditCard,
    sectedPrimerCreditCard,
  } = useProcessOrder(
    paymentData,
    sessionId,
    processPaymentForm,
    country,
    paymentData.jusPayData,
    orderId,
    configData.IS_JUSPAY_PAYMENT,
    primerInfo.isPrimerActive,
    triggerOnBottomsheet
  );

  const payLaterBottomsheetHandler = () => {
    if (orderCreatedSuccess) {
      document
        .getElementById(`submit-button-${selectedPaymentMethod}`)
        ?.click();
    }
  };
  const abandonedLeadsFunction = (paymentMethod: string) => {
    const number = (
      sessionStorageHelper.getItem("mobileNumber") || ""
    ).toString();
    if (number || userInfo?.mobileNumber) {
      dispatch(
        abandonedLeads({
          cartId: cartData.cartId,
          sessionId: sessionId,
          device: pageInfo.deviceType,
          paymentMethod: paymentMethod,
          mobileNumber: number || userInfo?.mobileNumber?.toString(),
          phoneCode: pageInfo.countryCode,
          step: 3,
        })
      );
    }
  };

  const fallbackPaymentMtdAPIData = {
    groupId: "cod",
    groupLabel: "Cash On Delivery",
    groupEnabled: true,
    methods: [
      {
        code: "cod",
        label: "Cash On Delivery",
        enabled: true,
        showCaptcha: true,
        banks: [],
        logoImageUrl:
          "https://static5.lenskart.com/media/uploads/Size=lg,_Payment_method=COD.png",
        key: "cod",
        offers: [],
      },
    ],
  };

  const upiTransactionStatus = useCallback(() => {
    const orderId = getCookie("orderId");
    const sessionId = `${getCookie(`clientV1_${country}`)}`;
    if (orderId) {
      dispatch(
        getUpiTransactionStatus({
          orderId: typeof orderId === "string" ? orderId : "",
          sessionId: typeof sessionId === "string" ? sessionId : "",
        })
      );
    }
  }, [dispatch]);

  const [isContactLensCheckboxChecked, setIsContactLensCheckboxChecked] =
    useState(false);
  // const router = useRouter();
  // const [qrCode, setQrCode] = useState<string>("");
  // const [qrAmount, setQrAmount] = useState<number | null>(null);
  // const [disableAllExceptQr, setDisableAllExceptQr] = useState(false);
  // useEffect(() => {
  //     if(qrCode && qrAmount) setDisableAllExceptQr(true)
  //   }, [qrCode, qrAmount])
  // useEffect(() => {
  //     let processOrder = paymentData?.paymentDetails?.order;
  //     let processPayment = paymentData?.paymentDetails?.payment?.actionInfo;
  //     if (processOrder?.id && sessionId && router && processPaymentForm.current) {
  //       if (processPayment && processPayment?.action) {
  //         if (processPayment.action === "DONE") {
  //           console.log("DONE");
  //           router.push("/checkout/success");
  //           // history.push(pathname);
  //         } else if (processPayment.action === "GENERATE_QR_CODE") {
  //           console.log("Generate QR Code");
  //           //dispath fetch the new qr code
  //           const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
  //             .setMethod(APIMethods.POST);
  //           api.sessionToken = sessionId;
  //           api.setHeaders(headerArr);
  //           (async() => {
  //             const body = new RequestBody<null>(null);
  //             const { data: qrData, error } = await paymentFunctions.getQrCode(api, processOrder.id, body);
  //             // .then(({ data: qrData, error }) => {
  //               // console.log(qrData, error, "Log ho rha");
  //               setQrCode(qrData.code);
  //               setQrAmount(qrData?.amount || 0);
  //             // });
  //           })()
  //           // router.push(`/checkout/payment/qr/${btoa(processOrder.id)}`);
  //         } else {
  //           processPaymentForm.current?.submit();
  //         }
  //       } else {
  //         processPaymentForm.current?.submit();
  //       }
  //     }
  //   }, [paymentData, router, sessionId, processPaymentForm]);
  const {
    getSubmitFunction,
    savedCardsHandler,
    gvCheckoutHandler,
    applyWalletHandler,
    fullScCheckout,
    removeStoreCredit,
  } = usePaymentSubmitActions(
    sessionId,
    savedCards,
    Boolean(orderId) ? orderId : "",
    Boolean(eid) ? atob(eid as string) : ""
  );
  useEffect(() => {
    if (
      isCartEmpty &&
      (cartData.isGvApplied || cartData.lkCash.moneySaved > 0) &&
      appliedSc.length &&
      !isRetry
    ) {
      showProceedBtnHandler(true, CallBackType.gv);
      //   console.log("full Gv applied");
      setHideAllExceptGv(true);
      setHideAllExceptSc(true);
    } else if (
      isCartEmpty &&
      (cartData.isGvApplied ||
        cartData.lkCash.moneySaved > 0 ||
        cartData.cartTotal.find((cv: any) => cv.type === "total")?.amount ===
          0) &&
      !appliedSc.length
    ) {
      showProceedBtnHandler(true, CallBackType.gv);
      // console.log("full Gv applied");
      setHideAllExceptGv(true);
    } else if (isCartEmpty && appliedSc.length) {
      showProceedBtnHandler(true, CallBackType.fullSc);
      setHideAllExceptSc(true);
    } else if (!isCartEmpty) {
      setHideAllExceptGv(false);
      setHideAllExceptSc(false);
      showProceedBtnHandler(false, CallBackType.null);
    }
  }, [
    cartData.isGvApplied,
    cartData.lkCash.moneySaved,
    isCartEmpty,
    gvCheckoutHandler,
    showProceedBtnHandler,
    fullScCheckout,
    appliedSc.length,
  ]);
  // const codSubmitHandler = getSubmitFunction("cod");
  // const submitHandler = (e: any) => {
  //   if (isCaptchaEnabled && userCaptcha === captchaValue) {
  //     console.log("true");
  //     setError(false);
  //     // codSubmitHandler("cod");
  //     getSubmitFunction("cod")("cod", , null, null, null, null);
  //   } else setError(true);
  // };
  const juspaySubmitHandler = getSubmitFunction("jus");
  const primerSubmitHandler = (() => null)();
  // const primerSubmitHandler = getSubmitFunction("PRIMER");
  const [storeCreditOpen, setStoreCreditOpen] = useState(
    Boolean(appliedSc.length)
  );
  // const paymentData = useSelector((state: RootState) => state.paymentInfo);

  const { captchaValue, captchaImageUrl, loadCaptcha } = useCaptcha(sessionId);
  const [selectedSavedCard, setSelectedSavedCard] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | number>("");
  const [selectedKey, setSelectedKey] = useState<string | number>("");
  const [hideAllExceptSc, setHideAllExceptSc] = useState(false);
  const [hideAllExceptGv, setHideAllExceptGv] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [payLaterSelected, setPayLaterSelected] = useState(false);
  const [showCOD, setShowCOD] = useState(false);
  const [showPrimerCardBottomSheet, setShowPrimerCardBottomSheet] =
    useState(true);

  useEffect(() => {
    if (sectedPrimerCreditCard && primerInfo.isLoading)
      setShowPrimerCardBottomSheet(false);
  }, [primerInfo.isLoading]);

  const openPaymentHandler = (
    groupId: string | number,
    key: string | number
  ) => {
    setSelectedGroupId(groupId);
    setSelectedKey(key);
    setSelectedSavedCard("");
  };

  useEffect(() => {
    setTriggerOnBottomsheet(payLaterSelected);
  }, [payLaterSelected]);
  const filterPaymentMethods = (productMethods?: DataType[]) => {
    let methods: DataType[] = [];
    productMethods?.forEach((pm) => {
      if (pm.groupEnabled) {
        let currMethod = pm && JSON.parse(JSON.stringify(pm));
        if (pm.groupId !== "primer atome")
          currMethod.methods =
            currMethod.methods.filter(
              (mtd: DataType) => getCardEligibility(mtd.code) && mtd.enabled
            ) || [];
        if (
          pageInfo?.deviceType === "mobilesite" &&
          configData?.IS_PHONEPE_DISABLED
        ) {
          currMethod.methods = currMethod.methods.filter(
            (mtd: DataType) => mtd.key !== "phonepeswitch_payu"
          );
        }
        methods.push(currMethod);
      }
    });
    return methods;
  };

  const containsPaymentMethod = (
    paymentMethods: DataType[],
    paymentMethodId: string
  ) => {
    return paymentMethods.some((m) => m.key === paymentMethodId);
  };
  //   console.log({selectedGroupId, selectedKey});

  const paymentOffer = paymentMethods?.offers?.paymentOffer;

  const showBankOffers = !!(
    configData?.APPLY_COUPON_ON ||
    (cartData.applicableGvs && cartData.applicableGvs.length)
  );

  const currency = (code: string) => {
    if (code === "USD") return "$";
    else if (code === "SAR") return "SAR";
    else if (code === "SGD") return "$";
    else return code;
  };

  return (
    <Fragment>
      {/* <MainHeading>Select payment method</MainHeading> */}
      <img
        alt={paymentOffer?.title}
        src={paymentOffer?.image}
        style={{ borderRadius: "8px", width: "100%" }}
      />
      {/* <Spacer /> */}

      {showBankOffers && availableOffers?.offers && (
        <CheckoutMobile.BankOffers
          offers={availableOffers.offers}
          dataLocale={dataLocale}
        />
      )}
      {/* <Spacer/> */}

      {!hideAllExceptGv &&
        (!configData.IS_JUSPAY_PAYMENT || primerInfo.isPrimerActive) &&
        filterPaymentMethods(paymentMethods?.paymentMethods)?.map(
          (pm: DataType) =>
            !(hideAllExceptSc && pm.groupId !== "sc") &&
            !(orderData?.id && pm.groupId === "sc") &&
            !(
              disableAllExceptQr &&
              !containsPaymentMethod(pm.methods, "qrcode_payu")
            ) &&
            !!pm.methods.length &&
            (pm.groupId !== "lenskartwallet" || pm.groupId !== "gv") &&
            !(
              pm.groupId === "Recommended" &&
              pm.methods.length === 1 &&
              pm.methods[0].key === "phonepeswitch_payu"
            ) &&
            !(pm.groupId === "sc") && (
              <Fragment key={pm.groupId}>
                <PaymentGroupHeading>{pm.groupLabel}</PaymentGroupHeading>
                <NewPayment.PaymentGroupComponent
                  setPayLaterSelected={setPayLaterSelected}
                  payLaterBottomsheetHandler={payLaterBottomsheetHandler}
                  orderCreatedSuccess={orderCreatedSuccess}
                  setRedirect={setRedirect}
                  groupData={pm}
                  sessionId={sessionId}
                  savedCards={savedCards}
                  localeData={localeData}
                  qrCode={qrCode}
                  qrAmount={qrAmount}
                  disableAllExceptQr={disableAllExceptQr}
                  openPaymentHandler={openPaymentHandler}
                  selectedKey={selectedKey}
                  selectedGroupId={selectedGroupId}
                  selectedSavedCard={selectedSavedCard}
                  setSelectedSavedCard={setSelectedSavedCard}
                  getSubmitFunction={getSubmitFunction}
                  savedCardsHandler={savedCardsHandler}
                  removeStoreCredit={removeStoreCredit}
                  captchaValue={captchaValue}
                  captchaImageUrl={captchaImageUrl}
                  loadCaptcha={loadCaptcha}
                  appliedSc={appliedSc}
                  fullScCheckout={fullScCheckout}
                  storeCreditOpen={storeCreditOpen}
                  setStoreCreditOpen={setStoreCreditOpen}
                  hideAllExceptSc={hideAllExceptSc}
                  hideAllExceptGv={hideAllExceptGv}
                  paymentData={paymentData}
                  resetVpaStatus={() => dispatch(resetVpaStatus())}
                  localeInfo={{
                    domain: ["preprod"].includes(
                      process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase() as string
                    )
                      ? "https://preprod.lenskart.com"
                      : "https://www.lenskart.com",
                  }}
                  router={router}
                  configData={configData}
                  getUpiTransactionStatus={upiTransactionStatus}
                  upiTransactionStatus={paymentData.upiTransactionStatus}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  selectedPaymentMethod={selectedPaymentMethod}
                  renderPrimerUI={renderPrimerUI}
                  primerToken={primerInfo.token}
                  // isContactLensConsentEnabled={false}
                  payLaterAllowed={payLaterAllowed}
                  isPrimerActive={primerInfo.isPrimerActive}
                  isContactLensCheckboxChecked={isContactLensCheckboxChecked}
                  setIsContactLensCheckboxChecked={
                    setIsContactLensCheckboxChecked
                  }
                  currencyCode={
                    isRetry
                      ? currency(orderData?.amount?.currencyCode)
                      : currency(cartData?.currencyCode)
                  }
                  totalAmount={
                    isRetry ? orderData?.amount?.total : cartTotalAmount
                  }
                  setSectedPrimerCreditCard={setSectedPrimerCreditCard}
                  showPrimerCardBottomSheet={showPrimerCardBottomSheet}
                  userInfo={userInfo}
                  abandonedLeadsFunction={abandonedLeadsFunction}
                />
              </Fragment>
            )
        )}

      {configData.IS_JUSPAY_PAYMENT &&
      !hideAllExceptGv &&
      !configData?.RENDER_JUSPAY_COMPONENT ? (
        <Jus
          localeData={localeData}
          juspaySubmitHandler={juspaySubmitHandler}
          primerSubmitHandler={
            primerInfo.isPrimerActive &&
            !primerInfo.isLoading &&
            primerSubmitHandler
          }
          isRetry={isRetry}
          jusPayInitiatePayload={paymentData.jusPayData}
          cartItems={cartData.cartItems}
          configData={configData}
          currencyCode={
            isRetry
              ? currency(orderData?.amount?.currencyCode)
              : currency(cartData?.currencyCode)
          }
          totalAmount={isRetry ? orderData?.amount?.total : cartTotalAmount}
          selectedPaymentMethod={selectedPaymentMethod}
          payLaterAllowed={payLaterAllowed}
          getSubmitFunction={getSubmitFunction}
          isContactLensCheckboxChecked={isContactLensCheckboxChecked}
          setIsContactLensCheckboxChecked={setIsContactLensCheckboxChecked}
        />
      ) : (
        <div />
      )}
      {(!configData?.IS_JUSPAY_PAYMENT || configData?.SHOW_COD_OPTION) &&
      !paymentMethods?.paymentMethods &&
      !isCartEmpty &&
      !configData?.RENDER_JUSPAY_COMPONENT &&
      (!configData?.SUPPORT_MULTIPLE_COUNTRIES ||
        paymentData?.shippingAddress?.customer?.address?.country.toUpperCase() ===
          "AE" ||
        (cartData?.cartPopupError && !userInfo?.userDetails) ||
        orderData?.shippingAddress?.country.toUpperCase() === "AE") ? (
        <Fragment key={fallbackPaymentMtdAPIData.groupId}>
          <NewPayment.PaymentGroupComponent
            setPayLaterSelected={setPayLaterSelected}
            orderCreatedSuccess={orderCreatedSuccess}
            setRedirect={setRedirect}
            payLaterBottomsheetHandler={payLaterBottomsheetHandler}
            groupData={fallbackPaymentMtdAPIData}
            sessionId={sessionId}
            savedCards={savedCards}
            localeData={localeData}
            qrCode={qrCode}
            qrAmount={qrAmount}
            disableAllExceptQr={disableAllExceptQr}
            openPaymentHandler={openPaymentHandler}
            selectedKey={selectedKey}
            selectedGroupId={selectedGroupId}
            selectedSavedCard={selectedSavedCard}
            setSelectedSavedCard={setSelectedSavedCard}
            getSubmitFunction={getSubmitFunction}
            savedCardsHandler={savedCardsHandler}
            removeStoreCredit={removeStoreCredit}
            captchaValue={captchaValue}
            captchaImageUrl={captchaImageUrl}
            loadCaptcha={loadCaptcha}
            appliedSc={appliedSc}
            fullScCheckout={fullScCheckout}
            storeCreditOpen={storeCreditOpen}
            setStoreCreditOpen={setStoreCreditOpen}
            hideAllExceptSc={hideAllExceptSc}
            hideAllExceptGv={hideAllExceptGv}
            paymentData={paymentData}
            resetVpaStatus={() => dispatch(resetVpaStatus())}
            localeInfo={{
              domain: ["preprod"].includes(
                process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase() as string
              )
                ? "https://preprod.lenskart.com"
                : "https://www.lenskart.com",
            }}
            router={router}
            configData={configData}
            getUpiTransactionStatus={upiTransactionStatus}
            upiTransactionStatus={paymentData.upiTransactionStatus}
            currencyCode={
              isRetry
                ? currency(orderData?.amount?.currencyCode)
                : currency(cartData?.currencyCode)
            }
            totalAmount={isRetry ? orderData?.amount?.total : cartTotalAmount}
            setSectedPrimerCreditCard={setSectedPrimerCreditCard}
            showPrimerCardBottomSheet={showPrimerCardBottomSheet}
            userInfo={userInfo}
            abandonedLeadsFunction={abandonedLeadsFunction}
          />
          {/* <Spacer />
          <Spacer /> */}
        </Fragment>
      ) : null}
      <>
        {configData?.RENDER_JUSPAY_COMPONENT && (
          <Accordion
            firstHeading={
              "Pay with Card /Buy Now Pay Later" ||
              localeData?.PAY_WITH_CARD_PAY_LATER
            }
            firstSubHeading={
              "will be redirecting to JUSPAY" ||
              localeData?.WILL_BE_REDIRECTED_TOJUSPAY
            }
            firstImgURL="https://static5.lenskart.com/media/uploads/Size=lg,_Payment_method=COD.png"
            firstButtonText={
              localeData?.PLACE_ORDER_AND_PAY || "Place order & pay"
            }
            secondHeading="Cash on Delivery"
            secondSubHeading={localeData?.PAY_WITH_CASH || "Pay with cash"}
            secondImgURL="https://static5.lenskart.com/media/uploads/Size=lg,_Payment_method=COD.png"
            secondButtonText={
              localeData?.PLACE_ORDER_AND_PAY || "Place order & pay"
            }
            // getSubmitFunction={openCODHandler}
            getSubmitFunction={getSubmitFunction}
            captchaValue={captchaValue}
            juspaySubmitHandler={juspaySubmitHandler}
            totalAmount={
              isRetry
                ? orderData?.amount?.currencyCode &&
                  ` ${currency(orderData.amount?.currencyCode)} ${
                    orderData.amount?.total
                  }`
                : `${currency(cartData?.currencyCode)} ${cartTotalAmount}`
            }
            hideAllExceptGv={hideAllExceptGv}
            configData={configData}
            isCartEmpty={isCartEmpty}
            paymentData={paymentData}
            loadCaptcha={loadCaptcha}
            localeData={localeData}
            captchaImageUrl={captchaImageUrl}
            cartData={cartData}
            orderData={orderData}
            isRetry={isRetry}
            userInfo={userInfo}
          />
        )}
      </>

      {!(hideAllExceptGv && !hideAllExceptSc) &&
        (!configData.IS_JUSPAY_PAYMENT || primerInfo.isPrimerActive) &&
        filterPaymentMethods(paymentMethods?.paymentMethods)?.map(
          (pm: DataType) =>
            !(hideAllExceptSc && pm.groupId !== "sc") &&
            !(isRetry && pm.groupId === "sc") &&
            !(
              disableAllExceptQr &&
              !containsPaymentMethod(pm.methods, "qrcode_payu")
            ) &&
            pm.groupId === "sc" && (
              <Fragment key={pm.groupId}>
                <NewPayment.PaymentGroupComponent
                  groupData={pm}
                  sessionId={sessionId}
                  savedCards={savedCards}
                  localeData={localeData}
                  qrCode={qrCode}
                  qrAmount={qrAmount}
                  disableAllExceptQr={disableAllExceptQr}
                  openPaymentHandler={openPaymentHandler}
                  selectedKey={selectedKey}
                  selectedGroupId={selectedGroupId}
                  selectedSavedCard={selectedSavedCard}
                  setSelectedSavedCard={setSelectedSavedCard}
                  getSubmitFunction={getSubmitFunction}
                  savedCardsHandler={savedCardsHandler}
                  removeStoreCredit={removeStoreCredit}
                  captchaValue={captchaValue}
                  captchaImageUrl={captchaImageUrl}
                  loadCaptcha={loadCaptcha}
                  appliedSc={appliedSc}
                  fullScCheckout={fullScCheckout}
                  storeCreditOpen={storeCreditOpen}
                  setStoreCreditOpen={setStoreCreditOpen}
                  hideAllExceptSc={hideAllExceptSc}
                  hideAllExceptGv={hideAllExceptGv}
                  paymentData={paymentData}
                  resetVpaStatus={() => dispatch(resetVpaStatus())}
                  localeInfo={{
                    domain: ["preprod"].includes(
                      process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase() as string
                    )
                      ? "https://preprod.lenskart.com"
                      : "https://www.lenskart.com",
                  }}
                  router={router}
                  configData={configData}
                  getUpiTransactionStatus={upiTransactionStatus}
                  upiTransactionStatus={paymentData.upiTransactionStatus}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  setPayLaterSelected={setPayLaterSelected}
                  payLaterBottomsheetHandler={payLaterBottomsheetHandler}
                  orderCreatedSuccess={orderCreatedSuccess}
                  setRedirect={setRedirect}
                  selectedPaymentMethod={selectedPaymentMethod}
                  renderPrimerUI={renderPrimerUI}
                  primerToken={primerInfo.token}
                  // isContactLensConsentEnabled={false}
                  payLaterAllowed={payLaterAllowed}
                  isPrimerActive={primerInfo.isPrimerActive}
                  isContactLensCheckboxChecked={isContactLensCheckboxChecked}
                  setIsContactLensCheckboxChecked={
                    setIsContactLensCheckboxChecked
                  }
                  currencyCode={
                    isRetry
                      ? currency(orderData?.amount?.currencyCode)
                      : currency(cartData?.currencyCode)
                  }
                  totalAmount={
                    isRetry ? orderData?.amount?.total : cartTotalAmount
                  }
                  setSectedPrimerCreditCard={setSectedPrimerCreditCard}
                  showPrimerCardBottomSheet={showPrimerCardBottomSheet}
                  userInfo={userInfo}
                  abandonedLeadsFunction={abandonedLeadsFunction}
                />
                {/* <Spacer />
                <Spacer /> */}
              </Fragment>
            )
        )}

      {
        (hideAllExceptSc && !hideAllExceptGv) || disableAllExceptQr
          ? null
          : !isRetry && (
              <>
                <PromotionalDiscountsMobileNew
                  localeData={localeData}
                  sessionId={sessionId}
                  applyWalletHandler={applyWalletHandler}
                  showProceedBtnHandler={showProceedBtnHandler}
                  gvCheckoutHandler={gvCheckoutHandler}
                  configData={configData}
                  orderData={orderData}
                  isRetry={isRetry}
                />
              </>
            )
        // <>
        // <PromotionalDiscountsMobile
        //   cartData={cartData}
        //   localeData={localeData}
        //   sessionId={sessionId}
        //   applyWalletHandler={applyWalletHandler}
        //   showProceedBtnHandler={showProceedBtnHandler}
        //   gvCheckoutHandler={gvCheckoutHandler}
        //   configData={configData}
        //   orderData={orderData}
        //   isRetry={isRetry}
        // />
        // </>
      }

      {paymentData?.paymentDetails?.payment?.actionInfo && (
        <HiddenForm>
          <form
            ref={processPaymentForm}
            action={
              paymentData?.paymentDetails?.payment?.actionInfo?.redirectUrl
            }
            method="post"
          >
            {paymentData?.paymentDetails?.payment?.actionInfo?.requestParams &&
              Object.keys(
                paymentData?.paymentDetails?.payment?.actionInfo?.requestParams
              ).map((data) => {
                return (
                  <p key={"p_" + data}>
                    {data}
                    :
                    <input
                      key={data}
                      readOnly
                      name={data}
                      type="text"
                      value={
                        paymentData?.paymentDetails?.payment?.actionInfo
                          ?.requestParams?.[data]
                      }
                    />
                  </p>
                );
              })}
          </form>
        </HiddenForm>
      )}
    </Fragment>
  );
};

export default PaymentScreenMobile;
