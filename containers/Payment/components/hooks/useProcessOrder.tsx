import {
  initiateJusPaySdk,
  updateDisableAllExceptQr,
} from "@/redux/slices/paymentInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { APIMethods } from "@/types/apiTypes";
import { DataType } from "@/types/coreTypes";
import { paymentFunctions } from "@lk/core-utils";
import { APIService, RequestBody } from "@lk/utils";
import { appendScriptToDOM, getUserEventData } from "containers/Base/helper";
import { setCookie, getCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import usePrevious from "hooks/usePrevious";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { passUtmData } from "@/redux/slices/userInfo";

const useProcessOrder = (
  paymentData: any,
  sessionId: string,
  processPaymentForm: React.MutableRefObject<any>,
  countryCode: string,
  jusPayInitiatePayload?: DataType | null,
  orderId?: string,
  isJusPayEnable?: boolean,
  isPrimerEnable?: boolean,
  triggerOnBottomsheet?: boolean
) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [qrCode, setQrCode] = useState<string>("");
  const [qrAmount, setQrAmount] = useState<number | null>(null);
  // const [disableAllExceptQr, setDisableAllExceptQr] = useState(false);
  const primerInfo = useSelector((state: RootState) => state.primerInfo);
  const { disableAllExceptQr } = useSelector(
    (state: RootState) => state.paymentInfo
  );
  const prevPaymentData = usePrevious(paymentData);

  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState(false);
  const [orderCreatedSuccessDesktop, setOrderCreatedSuccessDesktop] =
    useState(false);
  const [sectedPrimerCreditCard, setSectedPrimerCreditCard] = useState(false);

  useEffect(() => {
    if (qrCode && qrAmount) dispatch(updateDisableAllExceptQr(true));
  }, [qrCode, qrAmount]);
  useEffect(() => {
    if (isJusPayEnable) {
      appendScriptToDOM(
        "https://public.releases.juspay.in/hyper-sdk-web/HyperServices.js",
        "juspay",
        true,
        () => {
          // @ts-ignore
          window.hyperServicesObject = new window.HyperServices();
          dispatch(
            initiateJusPaySdk({
              sessionId: sessionId,
              isExchange: false,
              orderId: orderId,
            })
          );
        }
      );
    }
  }, [dispatch, sessionId, isJusPayEnable]);
  const stringifiedPaymentData = JSON.stringify(paymentData);
  useEffect(() => {
    let processOrder = paymentData?.paymentDetails?.order;
    let processPayment = paymentData?.paymentDetails?.payment?.actionInfo;
    let paymentStatus = primerInfo.status.status;
    // if (
    //   this.state.payZero === true ||
    //   paymentType === 'cod' ||
    //   paymentType === 'sc' ||
    //   paymentType === 'po'
    // ) {
    //   history.push(pathname);
    // }
    // console.log(processOrder?.id, sessionId, router, processPaymentForm.current, "useProcessOrder ------------------->");
    if (paymentStatus === "SUCCESS") {
      router.replace(`/checkout/success`);
      return;
    }
    if (
      paymentData !== prevPaymentData &&
      processOrder &&
      processOrder?.payments &&
      processOrder?.payments?.paymentList &&
      // processOrder?.payments?.paymentList?.some(
      //   (item: { method: string }) => item.method === "paylater"
      // ) &&
      processPayment?.action &&
      sessionId &&
      isPrimerEnable
    ) {
      setCookie("orderId", processOrder.id);

      //* trigger utm api
      const userEventDataObj = getUserEventData("ORDER_CHARGED");

      dispatch(
        passUtmData({
          sessionId: getCookie(`clientV1_${countryCode}`)?.toString(),
          eventObj: userEventDataObj,
        })
      );

      setOrderCreatedSuccessDesktop(true);
      console.log("setOrderCreatedSuccessDesktop true");
      if (sectedPrimerCreditCard) {
        document.getElementById("submit-button")?.click();
      }
      if (!triggerOnBottomsheet) {
        // document.getElementById("submit-button")?.click();
      } else {
        setOrderCreatedSuccess(true);
      }
    }
    if (processOrder?.id && sessionId && router && processPaymentForm.current) {
      //* trigger utm api
      const userEventDataObj = getUserEventData("ORDER_CHARGED");

      dispatch(
        passUtmData({
          sessionId: getCookie(`clientV1_${countryCode}`)?.toString(),
          eventObj: userEventDataObj,
        })
      );

      setCookie("orderId", processOrder.id);
      if (processPayment && processPayment?.action) {
        if (processPayment.action === "DONE") {
          router.replace("/checkout/success");
          // history.push(pathname);
        } else if (processPayment.action === "GENERATE_QR_CODE") {
          // ! below api call not required here, as moved to seperate url
          // dispath fetch the new qr code
          // const api = new APIService(
          //   `${process.env.NEXT_PUBLIC_API_URL}`
          // ).setMethod(APIMethods.POST);
          // api.sessionToken = sessionId;
          // api.setHeaders(headerArr);
          // (async () => {
          //   const body = new RequestBody<null>(null);
          //   const { data: qrData, error } = await paymentFunctions.getQrCode(
          //     api,
          //     processOrder.id,
          //     body
          //   );
          //   setQrCode(qrData.code);
          //   setQrAmount(qrData?.amount || 0);
          // })();
          router.push(`/checkout/payment/qr?orderId=${btoa(processOrder.id)}`);
        } else if (
          isJusPayEnable &&
          !isPrimerEnable &&
          processPayment.action &&
          !["DONE", "DEEPLINK"].includes(processPayment.action)
        ) {
          const initiatePayload = Object.assign(
            {},
            jusPayInitiatePayload?.payload,
            {
              integrationType: "iframe",
              hyperSDKDiv: "jusFrame",
            }
          );
          const sdkPayload = {
            service: jusPayInitiatePayload?.service,
            requestId: jusPayInitiatePayload?.requestId,
            payload: initiatePayload,
          };
          // @ts-ignore
          window.hyperServicesObject.initiate(sdkPayload, (eventData: any) => {
            try {
              if (eventData) {
                const eventJSON = JSON.parse(eventData || "");
                const event = eventJSON.event;
                // Check for event key
                if (event === "initiate_result") {
                  // Handle initiate result here
                } else if (event === "process_result") {
                  // Handle process result here
                } else if (event === "user_event") {
                  // Handle Payment Page events
                } else {
                  console.log(
                    "Unhandled event",
                    event,
                    "Event data",
                    eventData
                  );
                }
              } else {
                console.log("No data received in event", eventData);
              }
            } catch (error) {
              console.log("Error in hyperSDK response", error);
            }
          });
          router.replace(`/checkout/collect/${processOrder.id}`);
        } else if (
          isPrimerEnable &&
          processPayment.action &&
          processPayment.action === "PROCESS_SDK"
        ) {
          // document.getElementById("submit-button")?.click();
        } else {
          if (
            !["INTENT", "COLLECT"].includes(
              paymentData?.paymentDetails?.payment?.upiFlowType
            )
          )
            processPaymentForm.current?.submit();
        }
      } else {
        if (
          !["INTENT", "COLLECT"].includes(
            paymentData?.paymentDetails?.payment?.upiFlowType
          )
        )
          processPaymentForm.current?.submit();
        // console.log("Second else ----------------------->");
      }
    } else console.log("Else ----------------------->", paymentData);
  }, [
    paymentData,
    stringifiedPaymentData,
    router,
    sessionId,
    processPaymentForm,
    jusPayInitiatePayload?.requestId,
    jusPayInitiatePayload?.service,
    jusPayInitiatePayload?.payload,
    countryCode,
    primerInfo?.status,
  ]);
  return {
    qrCode,
    qrAmount,
    disableAllExceptQr,
    orderCreatedSuccess,
    orderCreatedSuccessDesktop,
    setSectedPrimerCreditCard,
    sectedPrimerCreditCard,
  };
};

export default useProcessOrder;
