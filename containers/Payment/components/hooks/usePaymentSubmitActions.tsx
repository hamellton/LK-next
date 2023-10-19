import { fetchCarts, updateCartData } from "@/redux/slices/cartInfo";
import { getOrderPayment, verifyVpa } from "@/redux/slices/paymentInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { APIMethods } from "@/types/apiTypes";
import { DataType } from "@/types/coreTypes";
import { paymentFunctions } from "@lk/core-utils";
import { APIService, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentPayload } from "../helpers";
import { addPaymentInfoGA4 } from "helpers/gaFour";

const usePaymentSubmitActions = (
  sessionId: string,
  savedCards: any,
  orderId?: number | string,
  emailId?: string,
  consent?: any
) => {
  const dispatch = useDispatch<AppDispatch>();
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const makeOrderPaymentCall = useCallback(
    (data: any, sessionId: string) => {
      /**
       *
       * Important: make paymentOffer api first
       *            It needs to be added
       *
       */
      const reqObj = {
        sessionId: sessionId,
        payDetailObj: { ...data, email: emailId },
        // payDetailObj: data,
      };
      dispatch(getOrderPayment(reqObj));
    },
    [dispatch]
  );

  const makeVerifyVpaCall = useCallback(
    (upiId: string, sessionId: string, data: any) => {
      const reqObj = {
        sessionId: sessionId,
        upiId: upiId,
        data,
      };
      dispatch(verifyVpa(reqObj));
    },
    [dispatch]
  );

  const cardSubmitHandler = (
    cardNumber: string,
    nameOnCard: string,
    expiryMonth: string,
    expiryYear: string,
    cvv: string,
    storeCard: boolean
  ) => {
    const data = paymentPayload.getCardPayload(
      cvv,
      expiryMonth,
      expiryYear,
      nameOnCard,
      cardNumber,
      storeCard,
      orderId
    );
    addPaymentInfoGA4(
      cartData,
      data.paymentInfo.paymentMethod,
      userInfo?.isLogin,
      pageInfo
    );
    makeOrderPaymentCall(data, sessionId);
  };
  const savedCardsHandler = (cvv: string, cardToken: string) => {
    const currCardData = savedCards?.find(
      (sc: DataType) => sc.cardToken === cardToken
    );
    const data = paymentPayload.getSavedCardPayload(
      currCardData?.paymentCardName,
      currCardData?.paymentCardNum,
      currCardData?.storeCard,
      currCardData?.value,
      currCardData?.cardToken,
      currCardData?.cardType,
      cvv,
      currCardData?.cardBrand,
      currCardData?.cardMode,
      currCardData?.expired,
      currCardData?.paymentCardExpiry,
      orderId
    );
    addPaymentInfoGA4(
      cartData,
      data.paymentInfo.paymentMethod,
      userInfo?.isLogin,
      pageInfo
    );
    makeOrderPaymentCall(data, sessionId);
  };
  const normalPaymentHandler = useCallback(
    (
      paymentMethod: string,
      gatewayId?: string,
      bankCode?: string,
      upiFlowType?: string,
      upiId?: string,
      orderId?: number,
      primerClientSessionToken?: string,
      saveCard?: boolean,
      consent?: any
    ) => {
      const data = paymentPayload.getNormalPaymentPayload(
        paymentMethod,
        gatewayId,
        bankCode,
        upiFlowType,
        pageInfo?.deviceType,
        orderId,
        primerClientSessionToken,
        saveCard,
        consent
      );
      if (upiFlowType === "COLLECT")
        makeVerifyVpaCall(upiId || "", sessionId, data);
      else {
        addPaymentInfoGA4(
          cartData,
          data.paymentInfo.paymentMethod,
          userInfo?.isLogin,
          pageInfo
        );
        makeOrderPaymentCall(data, sessionId);
      }
    },
    [sessionId, makeOrderPaymentCall, pageInfo?.deviceType]
  );

  const gvCheckoutHandler = useCallback(
    (paymentMethod: string) => {
      // console.log("Gift voucher handler called ==========================================================>", paymentMethod)
      normalPaymentHandler(paymentMethod || "gv");
    },
    [normalPaymentHandler]
  );
  const fullScCheckout = useCallback(() => {
    const data = paymentPayload.getFullScCheckoutPayload();
    addPaymentInfoGA4(
      cartData,
      data.paymentInfo.paymentMethod,
      userInfo?.isLogin,
      pageInfo
    );
    makeOrderPaymentCall(data, sessionId);
  }, [sessionId, makeOrderPaymentCall]);
  const upiPaymentHandler = (
    paymentMethod: string,
    gatewayId: string,
    upiFlowType?: string,
    upiId?: string
  ) => {
    normalPaymentHandler(
      paymentMethod,
      gatewayId,
      undefined,
      upiFlowType,
      upiId,
      orderId
    );
  };
  const primerPaymentHandler = (
    paymentMethod: string,
    gatewayId: string,
    primerClientSessionToken?: string,
    saveCard?: boolean,
    consent?: any
  ) => {
    // console.log("==>primerPaymentHandler<==");
    normalPaymentHandler(
      paymentMethod,
      gatewayId,
      undefined,
      undefined,
      undefined,
      orderId,
      primerClientSessionToken,
      saveCard,
      consent
    );
  };
  const netbankingHandler = (paymentMethod: string, bankCode: string) =>
    normalPaymentHandler(
      paymentMethod,
      "PU",
      bankCode,
      undefined,
      undefined,
      orderId
    );

  const storeSubmitHandler = async (
    code: string,
    amount: number,
    isCheckout?: boolean
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setMethod(
      APIMethods.POST
    );
    api.sessionToken = sessionId;
    api.setHeaders(headerArr);
    if (!isCheckout) {
      const body = new RequestBody<null>(null);
      // console.log(sessionId, "session");
      const { data, error } = await paymentFunctions.getStoreCredit(
        api,
        code,
        amount,
        body,
        pageInfo.subdirectoryPath
      );
      if (error.isError) {
        console.log(error);
        return {
          message: error.message,
          isError: true,
          btnDisabled: true,
          btnText: "Apply",
          additionalText: "",
          isCheckoutBtn: false,
        };
      } else {
        dispatch(
          updateCartData({
            cartItems: data.cartItems,
            cartTotal: data.cartTotal,
            applicableGvs: data.applicableGvs,
            cartQty: data.cartQty,
            cartCount: data.cartCount,
            offerDetails: data.offerDetails,
            appliedSc: data.appliedSc,
            currencyCode: data?.currencyCode,
          })
        );
        const isZeroBalanceInCart =
          data?.cartTotal?.[data.cartTotal.length - 1]?.amount === 0;
        return {
          message: `${amount} Store credit code applied`,
          isError: false,
          btnDisabled: !isZeroBalanceInCart,
          btnText: isZeroBalanceInCart ? "Checkout" : "Apply",
          additionalText: isZeroBalanceInCart
            ? ""
            : "Use other payment method for remaining amount",
          isCheckoutBtn: isZeroBalanceInCart,
        };
      }
    } else {
      console.log("This is checkout action");
    }
  };

  const applyWalletHandler = useCallback(
    (applyWallet?: boolean) => {
      if (applyWallet)
        dispatch(
          fetchCarts({
            sessionId,
            params: "?applyWallet=true",
          })
        );
      else
        dispatch(
          fetchCarts({
            sessionId,
            params: "?applyWallet=false",
          })
        );
    },
    [dispatch, sessionId]
  );

  const removeStoreCredit = useCallback(
    async (code: string) => {
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setMethod(APIMethods.DELETE);
      api.sessionToken = sessionId;
      api.setHeaders(headerArr);
      // const body = new RequestBody<null>(null);
      const { data, error } = await paymentFunctions.removeStoreCredit(
        api,
        code,
        pageInfo.subdirectoryPath
      );
      if (error.isError) {
        console.log(error);
        return {
          message: error.message,
          isError: true,
          btnDisabled: true,
          btnText: "Apply",
          additionalText: "",
          isCheckoutBtn: false,
        };
        // setStoreCardData(s => ([{...s[0], isError: true, message: error.message}]));
      } else {
        // console.log(data);
        dispatch(
          updateCartData({
            cartItems: data.cartItems,
            cartTotal: data.cartTotal,
            applicableGvs: data.applicableGvs,
            cartQty: data.cartQty,
            cartCount: data.cartCount,
            offerDetails: data.offerDetails,
            appliedSc: data.appliedSc,
            currencyCode: data?.currencyCode,
          })
        );
        //   setStoreCreditApplied("");
        // console.log(data);
        // const isZeroBalanceInCart = data?.cartTotal?.[data.cartTotal.length - 1].amount === 0;
        return {
          message: "",
          isError: false,
          btnDisabled: false,
          btnText: "Apply",
          additionalText: "",
          isCheckoutBtn: false,
        };
      }
    },
    [dispatch, sessionId]
  );

  function getSubmitFunction(key: string) {
    if (key === "cc")
      return (
        cardNumber: string,
        nameOnCard: string,
        expiryMonth: string,
        expiryYear: string,
        cvv: string,
        storeCard: boolean
      ) =>
        cardSubmitHandler(
          cardNumber,
          nameOnCard,
          expiryMonth,
          expiryYear,
          cvv,
          storeCard
        );
    if (key === "qrcode_payu" || key === "jus")
      return (paymentMethod: string, paymentGateway: string) =>
        normalPaymentHandler(
          paymentMethod,
          paymentGateway,
          undefined,
          undefined,
          undefined,
          orderId
        );
    if (key === "cod" || key === "paylater")
      // in case of paylater only paymentMethod will be sent & paylater won't render in retry condition so orderId won't backfire
      return (paymentMethod: string) =>
        normalPaymentHandler(
          paymentMethod,
          undefined,
          undefined,
          undefined,
          undefined,
          orderId
        );
    if (key === "nb")
      return (paymentMethod: string, bankCode: string) =>
        netbankingHandler(paymentMethod, bankCode);
    if (key === "sc")
      return (code: string, amount: number) => storeSubmitHandler(code, amount);
    if (key === "PRIMER")
      return (
        paymentMethod: string,
        gatewayId: string,
        primerClientSessionToken: string,
        saveCard?: boolean,
        consent?: any
      ) =>
        primerPaymentHandler(
          paymentMethod,
          gatewayId,
          primerClientSessionToken,
          saveCard,
          consent
        );
    return (
      paymentMethod: string,
      gatewayId: string,
      upiFlowType?: string,
      upiId?: string
    ) => upiPaymentHandler(paymentMethod, gatewayId, upiFlowType, upiId);
  }

  return {
    getSubmitFunction,
    savedCardsHandler,
    gvCheckoutHandler,
    fullScCheckout,
    applyWalletHandler,
    removeStoreCredit,
  };
};

export default usePaymentSubmitActions;
