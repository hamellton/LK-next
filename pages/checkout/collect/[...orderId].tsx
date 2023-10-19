/* eslint-disable react/display-name */
import { CONFIG, LOCALE } from "@/constants/index";
import { RootState } from "@/redux/store";
import { APIMethods } from "@/types/apiTypes";
import { DataType } from "@/types/coreTypes";
import { CommonLoader } from "@lk/ui-library";
import { APIService } from "@lk/utils";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkoutFunctions, fireBaseFunctions } from "@lk/core-utils";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import JuspayHeader from "pageStyles/JusPayHeader/JuspayHeader";
import { DeviceTypes } from "@/types/baseTypes";
import { resetPaymentState } from "@/redux/slices/paymentInfo";

const JusPayment = React.memo(
  (props: {
    sessionId: string;
    orderId: string | null;
    configData: DataType;
    localeData: DataType;
  }) => {
    const { configData, localeData } = props;
    const dispatch = useDispatch();
    const paymentData = useSelector((state: RootState) => state.paymentInfo);
    const pageInfo = useSelector((state: RootState) => state.pageInfo);
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const router = useRouter();
    const juspayBackPressEnable = !!configData?.JUSPAY_BACK_PRESS_ENABLE;
    const [loadingJusScript, setLoadingJusScript] = useState(true);
    const getPayment = () => {
      if (paymentData?.paymentDetails?.payment?.actionInfo?.requestParams) {
        const { payload, requestId, service } =
          paymentData?.paymentDetails?.payment?.actionInfo?.requestParams;
        const parsePayload = JSON.parse(payload || "");
        const {
          language,
          orderId,
          clientId,
          merchantKeyId,
          orderDetails,
          signature,
          amount,
          customerId,
          customerEmail,
          customerMobile,
          environment,
          merchantId,
          action,
        } = parsePayload;
        const processPayload = {
          requestId,
          service,
          payload: {
            action,
            merchantId,
            clientId,
            orderId,
            amount,
            customerId,
            customerEmail,
            customerMobile,
            orderDetails,
            signature,
            merchantKeyId,
            language,
            environment,
          },
        };
        //@ts-ignore
        window.hyperServicesObject.process(processPayload);
        setLoadingJusScript(false);
      } else if (props.orderId || hasCookie("orderId")) {
        const orderId = getCookie("orderId");
        router.push(
          `/checkout/retry?oid=${
            window.btoa(
              props.orderId
                ? props.orderId
                : typeof orderId === "string"
                ? orderId
                : ""
            ) || ""
          }&eid=${window.btoa(userInfo.email || userInfo.guestEmail) || ""}`
          // oid=${window.btoa(paymentData?.order?.id.toString())}&eid=${window.btoa(
          // 	paymentData?.paymentDetails?.order?.customerEmail
          // )}
        );
      } else {
        router.push("/");
      }
    };

    useEffect(() => {
      getPayment();
    }, []);

    useEffect(() => {
      let timer: ReturnType<typeof setInterval>;
      if (!loadingJusScript && juspayBackPressEnable) {
        timer = setInterval(() => {
          //@ts-ignore
          if (window.hyperServicesObject.consumeBackpress) {
            clearInterval(timer);
            timer = setInterval(() => {
              //@ts-ignore
              if (!window.hyperServicesObject.consumeBackpress) {
                clearInterval(timer);
                dispatch(resetPaymentState());
                const orderIdCookie = getCookie("orderId");
                router.replace(
                  `/checkout/retry?oid=${
                    window.btoa(
                      (typeof orderIdCookie === "string"
                        ? orderIdCookie
                        : ""
                      )?.toString()
                    ) || ""
                  }`
                );
              }
            }, 400);
          }
        }, 400);
      }
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }, [loadingJusScript, juspayBackPressEnable, router]);

    const desktopContainer = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {loadingJusScript && <CommonLoader fullpage />}
        <CartHeader
          appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
          safeText={localeData.SAFE_SECURE}
        />
        <div style={{ width: "100%", position: "relative" }}>
          <div
            id="jusFrame"
            style={{
              height: "600px",
              width: "50%",
              left: "25%",
              position: "absolute",
            }}
          ></div>
        </div>
      </div>
    );

    const mobileContainer = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {loadingJusScript && <CommonLoader fullpage />}
        <div></div>
        <JuspayHeader appLogo="https://static.lenskart.com/media/desktop/img/checkout_Logo.png" />
        <div style={{ width: "100%", position: "relative" }}>
          <div
            id="jusFrame"
            style={{
              height: "100vh",
              width: "100%",
              position: "absolute",
            }}
          ></div>
        </div>
      </div>
    );

    return pageInfo?.deviceType === DeviceTypes.DESKTOP
      ? desktopContainer
      : mobileContainer;
  }
);

export default JusPayment;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const { orderId } = context.query;
  if (!orderId?.length || orderId.length <= 0 || orderId.length > 1)
    return {
      notFound: true,
    };
  setCookie("juspayOrderId", orderId[0], { req, res });
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });
  const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
  const sessionId = `${getCookie(`clientV1_${country}`, { req, res })}`;
  api.sessionToken = sessionId;
  api.setHeaders(headerArr);
  if (!isSessionAvailable) {
    return {
      notFound: true,
    };
  } else {
    const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`)
      .setHeaders(headerArr)
      .setMethod(APIMethods.GET);
    const { data: configData, error: configError } =
      await fireBaseFunctions.getConfig(CONFIG, configApi);
    const { data: localeData, error: localeError } =
      await fireBaseFunctions.getConfig(LOCALE, configApi);
    console.log(
      "Error ----------------------------->",
      configError,
      localeError
    );
    return {
      props: {
        sessionId: sessionId || null,
        localeData: localeData || null,
        orderId: orderId[0] || null,
        configData: configData,
      },
    };
  }
};
