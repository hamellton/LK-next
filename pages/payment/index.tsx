import { logger } from "@/components/Logger/Logger";
import { CONFIG, COOKIE_NAME, LOCALE } from "@/constants/index";
import { APIMethods } from "@/types/apiTypes";
import { DataType } from "@/types/coreTypes";
import {
  sessionFunctions,
  fireBaseFunctions,
  paymentFunctions,
} from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import useCustomerState from "hooks/useCustomerState";
import { GetServerSideProps } from "next";
import React, { useCallback, useEffect, useState } from "react";
import NextHead from "next/head";
import PaymentComponent from "../../containers/Payment/Payment.component";
import { useDispatch, useSelector } from "react-redux";
import { updateIsRTL } from "@/redux/slices/pageInfo";
import { getOrderData, getV2OrderData } from "@/redux/slices/myorder";
import { AppDispatch, RootState } from "@/redux/store";
import usePrimer from "hooks/UsePrimer";
import {
  getClientToken,
  getPrimerPaymentMethods,
  getPrimerPaymentStatus,
  updateIsPrimerActive,
  updateIsScriptAdded,
  updatePrimerLoading,
  // getPrimerPaymentStatus,
} from "@/redux/slices/primer";
import { MethodsToShow } from "@/types/hooks/usePrimer.types";
import usePaymentSubmitActions from "containers/Payment/components/hooks/usePaymentSubmitActions";
import { useRouter } from "next/router";
import { hasContactLensItems } from "helpers/utils";
import {
  getPayMethods,
  getSavedCards,
  resetPaymentState,
} from "@/redux/slices/paymentInfo";
import { addPaymentInfoGA4 } from "helpers/gaFour";
import { userProperties } from "helpers/userproperties";
import { triggerFBQEvent } from "helpers/FbqHelper";
import { CommonLoader } from "@lk/ui-library";
import { FullScreenWrapper } from "pageStyles/paymentStyles";
import usePrevious from "hooks/usePrevious";
import { hideSprinklrBot } from "containers/Base/helper";
import { fetchCarts } from "@/redux/slices/cartInfo";
import { DeviceTypes } from "@/types/baseTypes";
import { createAPIInstance } from "../../helpers/apiHelper";

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
  sessionIdServer,
  availableOffers,
  configData,
  oid,
  eid,
}: {
  localeData: DataType;
  sessionIdServer: string;
  availableOffers: DataType[];
  configData: DataType;
  oid?: string;
  eid?: string;
}) => {
  const sessionId = getCookie(COOKIE_NAME) === "" ? sessionIdServer : getCookie(COOKIE_NAME) ;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [headlessState, setHeadlessState] = useState<any>();
  const { orderData } = useSelector((state: RootState) => state.myOrderInfo);
  const paymentInfo = useSelector((state: RootState) => state.paymentInfo);
  const { addPrimerScript, initPrimer, showPaymentMethodsUI } = usePrimer();
  const primerInfo = useSelector((state: RootState) => state.primerInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [primerLoading, setPrimerLoading] = useState(false);
  const { cartItems = [] } = cartData || {};
  const [redirect, setRedirect] = useState(false);
  const [consent, setConsent] = useState({});
  const savedCards =
    useSelector((state: RootState) => state.paymentInfo.savedCards) || [];
  const { getSubmitFunction } = usePaymentSubmitActions(
    sessionId,
    savedCards,
    Boolean(oid) ? atob(oid as string) : "",
    Boolean(eid) ? atob(eid as string) : ""
  );
  const queryParams = { ...router.query };
  const isRetry = Object.keys(queryParams).length !== 0;
  const paymentMethods = useSelector(
    (state: RootState) => state.paymentInfo.paymentMethods
  );
  const [allPaymentMethods, setAllPaymentMethods] = useState(paymentMethods);
  const prevCartTotal = usePrevious(cartData.cartTotal);
  const prevOrderId = usePrevious(orderData?.id);
  useEffect(() => {
    // * Fetch payment methods on mount and applying/removing store credit
    //* will trigger dispatch on mount & if storecredit list's length is changed or applied gv's amount is changed in state
    dispatch(
      getPayMethods({
        sessionId: `${sessionId}`,
        orderId: isRetry ? oid?.toString() || orderData?.id : "",
        isExchange: false,
      })
    );

    dispatch(
      getSavedCards({
        sessionId: sessionId,
        orderId: isRetry ? oid?.toString() || orderData?.id : "",
      })
    );
  }, [
    cartData?.appliedSc?.length,
    cartData?.appliedGv.amount,
    oid,
    orderData?.id,
    cartData?.cartTotal?.length,
  ]);
  // cartData?.cartTotal?.length
  // cartData?.lkCash?.moneySaved
  useEffect(() => {
    let pageName = "payment-view";
    // addPaymentInfoGA4(cartData?.result, paymentType, login);
    if (!userInfo?.userLoading)
      userProperties(userInfo, pageName, pageInfo, localeData);
    triggerFBQEvent(cartData, "AddPaymentInfo");
  }, [userInfo?.userLoading]);

  const primerOrderPayment = getSubmitFunction("PRIMER");

  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );

  useEffect(() => {
    dispatch(
      updateIsRTL(process.env.NEXT_PUBLIC_DIRECTION === "RTL" ? true : false)
    );

    //* hide sprinklr bot for mobilesite
    hideSprinklrBot(deviceType);

    if (!isRetry && deviceType === DeviceTypes.MOBILE) {
      // * Fetch carts (not on retry)
      const cartObj = {
        sessionId: sessionId,
        params: `?applyWallet=false`,
      };
      dispatch(fetchCarts(cartObj));
    }
  }, []);

  useEffect(() => {
    if (paymentMethods) setAllPaymentMethods(paymentMethods);
    if (primerInfo.paymentMethods)
      setAllPaymentMethods(primerInfo.paymentMethods);
  }, [paymentMethods, primerInfo.paymentMethods]);

  useEffect(() => {
    if (
      sessionId &&
      addPrimerScript &&
      !primerInfo.isScriptAdded &&
      configData &&
      configData?.IS_PRIMER_ON
    ) {
      addPrimerScript(
        configData?.PRIMER_VERSION || "2.28.1",
        false,
        null,
        () => {
          dispatch(updateIsScriptAdded(true));
          if (oid)
            dispatch(
              getClientToken({ sessionId, orderId: atob(oid as string) })
            );
          else dispatch(getClientToken({ sessionId }));
        }
      );
    } else if (oid && sessionId && configData && configData.IS_PRIMER_ON) {
      dispatch(getClientToken({ sessionId, orderId: atob(oid as string) }));
    }
  }, [primerInfo.isScriptAdded, configData, oid]);

  useEffect(() => {
    dispatch(updateIsPrimerActive(configData.IS_PRIMER_ON as boolean));
  }, [dispatch, configData]);

  useEffect(() => {
    if (oid)
      dispatch(
        getV2OrderData({
          sessionId: sessionId,
          orderID: oid
            ? window.atob(oid as string)
            : getCookie("orderId")?.toString() || "",
          email: eid ? atob(eid as string) : "",
        })
      );
  }, [oid, dispatch, sessionId]);

  // Below is a mock to test the primer payment status api
  // useEffect(() => {
  //   if (primerInfo.token) {
  //     dispatch(
  //       getPrimerPaymentStatus({
  //         sessionId,
  //         paymentRefId: "lEFqlo4s",
  //         paymentId: "1930513210_70449700",
  //       })
  //     );
  //   }
  // }, [dispatch, primerInfo.token]);

  useEffect(() => {
    if (primerInfo.token) {
      dispatch(updatePrimerLoading(true));
      const initPrimerSdk = async () => {
        const headless = await initPrimer({
          token: primerInfo.token,
          onBeforePaymentCreate: (data, handler) => {
            // dispatch(updatePrimerLoading(true));
            setPrimerLoading(true);
          },
          onAvailablePaymentMethodsLoad: (paymentMethods) => {
            if (paymentMethods)
              dispatch(
                getPrimerPaymentMethods({
                  paymentMethods,
                  orderId: atob(oid as string),
                  configData,
                  sessionId,
                })
              );
          },
          onCheckoutComplete: (params) => {
            const { id } = params?.payment || {};
            dispatch(
              getPrimerPaymentStatus({
                sessionId,
                paymentRefId: id,
                paymentId: paymentInfo.payment?.paymentId,
              })
            );
          },
          onCheckoutFail: (params) => {
            setRedirect(true);
          },
        });
        headless.start();
        setHeadlessState(headless);
      };
      initPrimerSdk();
      dispatch(updatePrimerLoading(false));
    }
  }, [dispatch, primerInfo.token, oid, sessionId, configData]);

  useEffect(() => {
    // For handling redirection when primer payment fails.
    if (paymentInfo.paymentDetails?.order?.id && redirect) {
      setRedirect(false);
      dispatch(resetPaymentState());
      router.replace(
        `/checkout/retry?oid=${btoa(
          paymentInfo.paymentDetails.order?.id
        )}&eid=${btoa(paymentInfo.paymentDetails.order?.customerEmail)}`
      );
    }
  }, [paymentInfo?.paymentDetails?.order, redirect]);

  const isContactLensConsentEnabled = !!(
    hasContactLensItems(cartItems) && configData?.CL_DISCLAIMER
  );

  useEffect(() => {
    if (isContactLensConsentEnabled) {
      // timestamp format for consent yyyy-mm-dd hh:mm:ss
      const date = new Date();
      const timestamp = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}-${("0" + date.getDate()).slice(
        -2
      )} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      setConsent({
        type: "contact-lens",
        timestamp,
      });
    }
  }, [isContactLensConsentEnabled]);

  const renderPrimerUI = useCallback(
    (methodToShow: MethodsToShow) => {
      showPaymentMethodsUI({
        methodToShow,
        headless: headlessState,
        primerToken: primerInfo.token,
        orderPayment: () =>
          primerOrderPayment(
            "primer",
            "PRIMER",
            primerInfo.token,
            false,
            consent
          ),
        device: process.env.NEXT_PUBLIC_APP_CLIENT,
        orderId: atob(oid as string),
        consent,
      });
    },
    [
      consent,
      headlessState,
      oid,
      primerInfo.token,
      primerOrderPayment,
      showPaymentMethodsUI,
    ]
  );

  return (
    <>
      <FullScreenWrapper show={primerLoading}>
        <CommonLoader show />
      </FullScreenWrapper>
      <NextHead>
        <title>Payment</title>
      </NextHead>
      <PaymentComponent
        localeData={localeData}
        paymentMethods={allPaymentMethods}
        sessionId={sessionId}
        savedCards={savedCards}
        availableOffers={availableOffers}
        configData={configData}
        orderData={orderData}
        isRetry={Boolean(oid)}
        setRedirect={setRedirect}
        oid={oid ? Buffer.from(oid as string, "base64").toString("ascii") : ""}
        eid={eid}
        renderPrimerUI={renderPrimerUI}
      />
    </>
  );
};

export default Payment;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const { oid, eid } = context.query;
  const isSessionAvailable = hasCookie(COOKIE_NAME, { req, res }) && getCookie(COOKIE_NAME, {req,res}) !== "";
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  let sessionId;
  let isNewSession = false;
  if (isSessionAvailable) {
    sessionId = getCookie(COOKIE_NAME, { req, res });
  } else {
    isNewSession = true;
    const sessionAPi = createAPIInstance({
      method: APIMethods.POST,
    });
    const { data: sessionIdRes, error } =
      await sessionFunctions.createNewSession(sessionAPi);
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(COOKIE_NAME, sessionIdRes.sessionId, { req, res });
    sessionId = sessionIdRes.sessionId;
  }
  const api = createAPIInstance({
    sessionToken: sessionId,
  });
  const configApi = createAPIInstance({
    url: `${process.env.NEXT_PUBLIC_CONFIG_URL}`,
  });

  console.log('api.sessionToken ==============>',api.sessionToken)
  const promises = [
    fireBaseFunctions.getConfig(LOCALE, configApi),
    fireBaseFunctions.getConfig(CONFIG, configApi),
    sessionFunctions.validateSession(api),
  ];

  const [
    { data: localeData, error: localeDataError },
    { data: configData, error: configError },
    { data: userData, error: userError },
  ] = await Promise.all(promises);

  if (localeDataError.isError || configError.isError || userError.isError) {
    return {
      notFound: true,
    };
  }

  const returnObj: DataType = {
    sessionIdServer: sessionId,
    userData: userData,
    localeData: localeData,
    configData: configData && !configError?.isError ? configData : null,
    oid: oid ? oid : "",
    eid: eid ? eid : "",
  };

  if (!isNewSession) {
    const { data: availableOffers, error: offersError } = await paymentFunctions.getAvailableOffers(api);
    if (offersError.isError) {
      returnObj['availableOffers'] = [];
    } else {
      returnObj['availableOffers'] = availableOffers || [];
    }
  }
  isNewSession = false;

  return {
    props: returnObj,
  };
};
