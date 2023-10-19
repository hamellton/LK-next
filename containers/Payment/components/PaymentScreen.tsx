import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { DataType } from "@/types/coreTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import PromotionalDiscounts from "./PromotionalDiscounts";
import usePaymentSubmitActions from "./hooks/usePaymentSubmitActions";
import { Icons } from "@lk/ui-library";
import { Button } from "@lk/ui-library";
import {
  CallBackType,
  getCardEligibility,
  getGroupEligibility,
} from "./helpers";
import {
  ButtonContent,
  HeadingText,
  RightWrapper,
  StickyDiv,
} from "pageStyles/CartStyles";
import { MainHeading, PaymentGroupHeading, Spacer, HiddenForm } from "./styles";
import PaymentCardMapper from "./PaymentCardMapper";
import useProcessOrder from "./hooks/useProcessOrder";
import useCaptcha from "./hooks/useCaptcha";
import Jus from "../JusPay/Jus";
import RadioModal from "./PaymentComponentAE";
import { TypographyENUM } from "@/types/baseTypes";
import { abandonedLeads } from "@/redux/slices/userInfo";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { PowerCheckout } from "containers/Checkout/address/styles";
// import { initiateJusPaySdk } from '@/redux/slices/paymentInfo';
// import { useRouter } from 'next/router';
// import { APIService, RequestBody } from '@lk/utils';
// import { APIMethods } from '@/types/apiTypes';
// import { headerArr } from 'helpers/defaultHeaders';
// import { paymentFunctions } from '@lk/core-utils';

const PaymentScreen = ({
  paymentMethods,
  sessionId,
  localeData,
  savedCards,
  configData,
  availableOffers,
  cartData,
  showProceedBtnHandler,
  orderData,
  isRetry,
  orderId,
  renderPrimerUI,
  isContactLensConsentEnabled,
  payLaterAllowed,
  setRedirect,
  proceedClickHandler,
  proceedBtn,
  totalAmount,
  eid,
}: any) => {
  // const countryCode = "sa";
  const paymentData = useSelector((state: RootState) => state.paymentInfo);
  const processPaymentForm: React.MutableRefObject<any> = useRef(null);
  const cartTotal = useSelector((state: RootState) => state.cartInfo.cartTotal);
  const [selectedMethod, setSelectedMethod] = useState("");
  const isCartEmpty =
    cartTotal &&
    Array.isArray(cartTotal) &&
    cartTotal?.find((ct) => ct.type === "total")?.amount === 0;
  const appliedSc = useSelector((state: RootState) => state.cartInfo.appliedSc);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const studioFlowInfo = useSelector(
    (state: RootState) => state.studioFlowInfo
  );

  const primerInfo = useSelector((state: RootState) => state.primerInfo);
  const { isRTL, country } = pageInfo;
  // const { ullScCheckout } = usePaymentSubmitActions(sessionId, savedCards);

  const fallbackPaymentMtdAPIData = useMemo(
    () => ({
      groupId: "cod",
      groupLabel: configData.CASH_ON_DELIVERY,
      groupEnabled: true,
      methods: [
        {
          code: "cod",
          label: configData.CASH_ON_DELIVERY,
          enabled: true,
          showCaptcha: true,
          banks: [],
          logoImageUrl:
            "https://static5.lenskart.com/media/uploads/Size=lg,_Payment_method=COD.png",
          key: "cod",
          offers: [],
        },
      ],
    }),
    [configData]
  );

  const fallbackPaymentMtdAPIDataAE = useMemo(
    () => ({
      groups: [
        {
          groupId: "cod",
          groupLabel: configData.CASH_ON_DELIVERY,
          groupEnabled: configData.SHOW_COD_PAYMENT_OPTION,
          methods: [
            {
              code: "cod",
              label: configData.CASH_ON_DELIVERY,
              enabled: true,
              showCaptcha: true,
              banks: [],
              logoImageUrl:
                "https://static5.lenskart.com/media/uploads/Size=lg,_Payment_method=COD.png",
              key: "cod",
              offers: [],
            },
          ],
        },
        {
          groupId: "paynow",
          groupLabel: configData.PAY_WITH_CARD_PAY_LATER,
          groupEnabled: true,
          methods: [
            {
              code: "paynow",
              label: configData.PAY_WITH_CARD_PAY_LATER,
              enabled: true,
              showCaptcha: false,
              banks: [],
              logoImageUrl:
                "https://static5.lenskart.com/media/uploads/Size=lg,_Payment_method=COD.png",
              key: "paynow",
              offers: [],
            },
          ],
        },
      ],
    }),
    [configData]
  );

  const {
    qrCode,
    qrAmount,
    disableAllExceptQr,
    orderCreatedSuccessDesktop,
    setSectedPrimerCreditCard,
  } = useProcessOrder(
    paymentData,
    sessionId,
    processPaymentForm,
    country,
    paymentData.jusPayData,
    orderId,
    configData.IS_JUSPAY_PAYMENT,
    primerInfo.isPrimerActive
  );
  const [isContactLensCheckboxChecked, setIsContactLensCheckboxChecked] =
    useState(false);

  const dispatch = useDispatch<AppDispatch>();

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

  function openPaymentHandlerAE(id: string) {
    setSelectedMethod(id);
  }
  const juspaySubmitHandler: any = getSubmitFunction("jus");

  const handlePayment = () => {
    // if (isContactLensConsentEnabled) {
    //   if (!isContactLensCheckboxChecked) return;
    // }
    if (!primerInfo.isPrimerActive && !primerInfo.isLoading)
      juspaySubmitHandler("juspay", "JUSPAY");
  };

  function debounce(callback: (...a: any) => any, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  const handlePaymentWithDebounce = debounce(handlePayment, 1000);
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
      !appliedSc.length &&
      !isRetry
    ) {
      showProceedBtnHandler(true, CallBackType.gv);
      //   console.log("full Gv applied");
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
    cartData.cartTotal,
    cartData.isGvApplied,
    cartData.lkCash.moneySaved,
    isCartEmpty,
    gvCheckoutHandler,
    showProceedBtnHandler,
    fullScCheckout,
    appliedSc.length,
  ]);

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
  const openPaymentHandler = (
    groupId: string | number,
    key: string | number,
    willRenderPrimerUI?: boolean
  ) => {
    if (selectedGroupId !== groupId || key !== selectedKey) {
      setSelectedGroupId(groupId);
      setSelectedKey(key);
      setSelectedSavedCard("");
    }
    if (primerInfo.isPrimerActive && willRenderPrimerUI) renderPrimerUI(key);
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
        if (currMethod.methods.length) methods.push(currMethod);
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

  const hasFrameProduct = !!cartData.cartItems?.some(
    (eyeFrame: { itemClassification: string; itemPowerRequired: string }) =>
      (eyeFrame.itemClassification === "eyeframe" ||
        eyeFrame.itemClassification === "sunglasses") &&
      eyeFrame.itemPowerRequired === "POWER_REQUIRED"
  );

  return (
    <Fragment>
      {((primerInfo?.isPrimerActive &&
        paymentMethods?.paymentMethods?.length > 1) ||
        !primerInfo?.isPrimerActive) && (
        <MainHeading>{localeData.SELECT_PAYMENT_METHOD}</MainHeading>
      )}
      {hasFrameProduct &&
        !studioFlowInfo.isLoading &&
        !studioFlowInfo.stores.length &&
        configData?.ENABLE_POWER_WILL_BE_TAKEN_AFTER_CHECKOUT_IN_ADDRESS_TABS && (
          <PowerCheckout margin="10px">
            {" "}
            <Icons.InfoCircle />
            {localeData?.POWER_WILL_BE_TAKEN_AFTER_CHECKOUT}
          </PowerCheckout>
        )}
      {(hideAllExceptSc && !hideAllExceptGv) ||
      disableAllExceptQr ? null : (primerInfo?.isPrimerActive &&
          paymentMethods?.paymentMethods?.length > 1) ||
        !primerInfo?.isPrimerActive ? (
        <>
          <Spacer />
          <PromotionalDiscounts
            // cartData={cartData}
            localeData={localeData}
            sessionId={sessionId}
            applyWalletHandler={applyWalletHandler}
            showProceedBtnHandler={showProceedBtnHandler}
            gvCheckoutHandler={gvCheckoutHandler}
            configData={configData}
            // orderData={orderData}
            isRetry={isRetry}
          />
        </>
      ) : null}
      <>
        {!hideAllExceptGv &&
          configData?.RENDER_JUSPAY_COMPONENT &&
          configData.IS_JUSPAY_PAYMENT &&
          !primerInfo.isPrimerActive &&
          fallbackPaymentMtdAPIDataAE.groups.map((m: DataType, i: number) => (
            <>
              {m.groupEnabled && (
                <PaymentGroupHeading>{m.groupLabel}</PaymentGroupHeading>
              )}
              {m.groupId === "paynow" && (
                <>
                  <RadioModal
                    data={{
                      head:
                        localeData?.PAY_WITH_CARD_PAY_LATER ||
                        "Pay with Card / Buy now Pay Later",
                      text:
                        localeData?.WILL_BE_REDIRECTED_TOJUSPAY ||
                        "Will be redirecting to JUSPAY",
                      onSelect: () => {
                        openPaymentHandlerAE(m.groupId);
                        setSelectedGroupId(m.groupId);
                      },

                      isChildrenVisible: selectedGroupId === m.groupId,
                      children: (
                        <Button
                          id="button"
                          showChildren={true}
                          width="100%"
                          font={TypographyENUM.lkSansBold}
                          onClick={handlePaymentWithDebounce}
                          style={{
                            width: "100%",
                            float: "right",
                          }}
                          // disabled={
                          //   isContactLensConsentEnabled &&
                          //   !isContactLensCheckboxChecked
                          // }
                        >
                          <ButtonContent
                            isRTL={pageInfo.isRTL}
                            styledFont={TypographyENUM.lkSansBold}
                          >
                            {localeData.PLACE_ORDER}
                            {totalAmount &&
                              `& Pay ${localeData?.CURRENCY_SYMBOL} ${totalAmount}`}
                            <Icons.IconRight />
                          </ButtonContent>
                        </Button>
                      ),
                      // onSubmit: getSubmitFunction(methodData.key),
                      // paymentMethod: methodData.code,
                    }}
                    disabled={false}
                    logoImageUrl={m.methods[0].logoImageUrl}
                  ></RadioModal>
                </>
              )}
              {m.groupId === "cod" && m.groupEnabled && (
                <Fragment>
                  {m.methods.map((methodData: DataType, i: number) => (
                    <PaymentCardMapper
                      key={i}
                      index={i}
                      methodData={methodData}
                      groupData={m}
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
                      // isContactLensConsentEnabled={false}
                      payLaterAllowed={payLaterAllowed}
                      isContactLensCheckboxChecked={
                        isContactLensCheckboxChecked
                      }
                      setIsContactLensCheckboxChecked={
                        setIsContactLensCheckboxChecked
                      }
                      setRedirect={setRedirect}
                      setSectedPrimerCreditCard={setSectedPrimerCreditCard}
                      configData={configData}
                      abandonedLeadsFunction={abandonedLeadsFunction}
                    />
                  ))}
                </Fragment>
              )}
            </>
          ))}
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
            pm.methods.length ? (
              <Fragment key={pm.groupId}>
                <PaymentGroupHeading>{pm.groupLabel}</PaymentGroupHeading>
                {pm.methods.map((m: DataType, i: number) => (
                  <PaymentCardMapper
                    isRTL={isRTL}
                    key={i}
                    index={i}
                    methodData={m}
                    groupData={pm}
                    sessionId={sessionId}
                    localeData={localeData}
                    qrCode={qrCode}
                    qrAmount={qrAmount}
                    savedCards={savedCards}
                    disableAllExceptQr={disableAllExceptQr}
                    openPaymentHandler={(
                      groupId: string | number,
                      key: string | number,
                      willRenderPrimerUI?: boolean
                    ) => openPaymentHandler(groupId, key, willRenderPrimerUI)}
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
                    // isContactLensConsentEnabled={false}
                    payLaterAllowed={payLaterAllowed}
                    isContactLensCheckboxChecked={isContactLensCheckboxChecked}
                    setIsContactLensCheckboxChecked={
                      setIsContactLensCheckboxChecked
                    }
                    setRedirect={setRedirect}
                    orderCreatedSuccess={orderCreatedSuccessDesktop}
                    setSectedPrimerCreditCard={setSectedPrimerCreditCard}
                    configData={configData}
                    abandonedLeadsFunction={abandonedLeadsFunction}
                  />
                ))}
              </Fragment>
            ) : null
        )}
      {filterPaymentMethods(paymentMethods?.paymentMethods).length === 0 &&
      (!configData.IS_JUSPAY_PAYMENT || configData?.SHOW_COD_OPTION) &&
      !isCartEmpty &&
      (!configData?.SUPPORT_MULTIPLE_COUNTRIES ||
        paymentData?.shippingAddress?.customer?.address?.country?.toUpperCase() ===
          "AE" ||
        (cartData?.cartPopupError && !userInfo?.userDetails) ||
        orderData?.shippingAddress?.country.toUpperCase() === "AE") ? (
        <Fragment>
          <PaymentGroupHeading>
            {fallbackPaymentMtdAPIData.groupLabel}
          </PaymentGroupHeading>
          {fallbackPaymentMtdAPIData.methods.map((m: DataType, i: number) => (
            <PaymentCardMapper
              key={i}
              index={i}
              methodData={m}
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
              // isContactLensConsentEnabled={false}
              payLaterAllowed={payLaterAllowed}
              isContactLensCheckboxChecked={isContactLensCheckboxChecked}
              setIsContactLensCheckboxChecked={setIsContactLensCheckboxChecked}
              setRedirect={setRedirect}
              setSectedPrimerCreditCard={setSectedPrimerCreditCard}
              configData={configData}
              abandonedLeadsFunction={abandonedLeadsFunction}
            />
          ))}
        </Fragment>
      ) : null}
      {configData.IS_JUSPAY_PAYMENT &&
      !primerInfo.isPrimerActive &&
      !hideAllExceptGv ? (
        <Jus
          localeData={localeData}
          juspaySubmitHandler={juspaySubmitHandler}
          jusPayInitiatePayload={paymentData.jusPayData}
          cartItems={cartData.cartItems}
          configData={configData}
          getSubmitFunction={getSubmitFunction}
          payLaterAllowed={payLaterAllowed}
          // isContactLensConsentEnabled={false}
          isContactLensCheckboxChecked={isContactLensCheckboxChecked}
          setIsContactLensCheckboxChecked={setIsContactLensCheckboxChecked}
        />
      ) : (
        <div />
      )}
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

export default PaymentScreen;
