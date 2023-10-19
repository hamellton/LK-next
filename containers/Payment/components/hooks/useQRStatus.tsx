import { RootState } from "@/redux/store";
import { APIMethods } from "@/types/apiTypes";
import { paymentFunctions } from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const useQRStatus = (paymentData: any, sessionId: string, orderId?: string) => {
  const timer1 = useRef<ReturnType<typeof setInterval> | null>(null);
  const timer2 = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();
  const [qrTimer, setQrTimer] = useState(300);
  const [qrExpired, setQrExpired] = useState(false);
  const [qrSuccess, setQrSuccess] = useState(false);
  const triggerQrStatus = () => {
    const processOrderId = paymentData?.paymentDetails?.order?.id || orderId;
    timer2.current = setInterval(() => {
      if (qrTimer > 0) {
        const api = new APIService(
          `${process.env.NEXT_PUBLIC_API_URL}`
        ).setMethod(APIMethods.GET);
        api.sessionToken = sessionId;
        api.setHeaders(headerArr);
        paymentFunctions
          .getQrStatus(api, processOrderId)
          .then(
            (res: {
              data: { running: Boolean; success: Boolean };
              error: any;
            }) => {
              const { data: qrData, error } = res;
              if (qrTimer <= 0 || !qrData.running) {
                timeExpiryCallback();
                if (qrData.success) {
                  // router.push("/checkout/success");
                  setQrSuccess(true);
                } else {
                  setQrSuccess(false);
                }
              }
            }
          )
          .catch((err: any) => {
            if (qrTimer <= 0) {
              timeExpiryCallback();
            }
          });
      } else {
        timeExpiryCallback();
      }
    }, 5000);
  };
  const timeExpiryCallback = () => {
    setQrExpired(true);
    setQrTimer(0);
    if (timer1.current) clearInterval(timer1.current);
    if (timer2.current) clearInterval(timer2.current);
  };
  const triggerQrTimer = () => {
    triggerQrStatus();
    timer1.current = setInterval(() => {
      if (qrTimer <= 0) {
        timeExpiryCallback();
      } else {
        setQrTimer((qrtime) => qrtime - 1);
      }
    }, 1000);
  };
  return {
    qrTimer,
    qrExpired,
    qrSuccess,
    triggerQrTimer,
    timeExpiryCallback,
    triggerQrStatus,
  };
};

export default useQRStatus;
