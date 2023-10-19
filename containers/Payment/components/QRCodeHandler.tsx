import { AppDispatch, RootState } from "@/redux/store";
import { NewPayment } from "@lk/ui-library";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useQRStatus from "./hooks/useQRStatus";
import { DataType } from "@/types/coreTypes";
import {
  resetPaymentState,
  updateDisableAllExceptQr,
} from "@/redux/slices/paymentInfo";
import { getCookie } from "@/helpers/defaultHeaders";

const QRCodeHandler = ({
  sessionId,
  isOpen,
  onSubmit,
  qrCode,
  qrAmount,
  data,
  cardType,
  configData,
  localeData,
}: {
  sessionId: string;
  isOpen: boolean;
  onSubmit: (...args: any) => void;
  qrCode: string;
  qrAmount: number | null;
  data: any;
  cardType: any;
  configData: DataType;
  localeData: DataType;
}) => {
  //     const [isQrActive, setIsQrActive] = useState(false);
  //   const clickHandler = () => {
  //     setIsQrActive(true);
  //   }
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const paymentData = useSelector((state: RootState) => state.paymentInfo);
  const { qrTimer, qrExpired, qrSuccess, triggerQrStatus, timeExpiryCallback } =
    useQRStatus(paymentData, sessionId);
  useEffect(() => {
    if (qrExpired) {
      if (qrSuccess) {
        router.push("/checkout/success");
      } else {
        router.replace(
          `/checkout/retry/?oid=${btoa(`${getCookie("orderId")}`)}&eid=${btoa(
            userInfo.email
          )}`
        );
        dispatch(resetPaymentState());
      }
    }
  }, [qrExpired, router, qrSuccess]);
  // console.log("qr in qrhandler", {qrCode, qrAmount, cardType});
  const handleOnCancelClick = () => {
    dispatch(updateDisableAllExceptQr(false));
    router.push(
      `/checkout/retry/?oid=${btoa(`${getCookie("orderId")}`)}&eid=${btoa(
        userInfo.email
      )}`
    );
  };
  return (
    <div>
      {/* {qrCode && qrAmount ? <NewPayment.QrView currencySymbol="₹" qrCode={qrCode} qrAmount={typeof qrAmount === "string" ? qrAmount : (qrAmount || "").toString()} /> :  */}
      <NewPayment.PaymentCardNew
        isRTL={isRTL}
        isOpen={isOpen}
        configData={configData}
        onSubmit={() => onSubmit(data.paymentMethod, data.gatewayId)}
        data={{
          ...data,
          children:
            qrCode && qrAmount ? (
              <NewPayment.QrView
                currencySymbol="₹"
                qrCode={qrCode}
                qrAmount={
                  typeof qrAmount === "string"
                    ? qrAmount
                    : (qrAmount || "").toString()
                }
                triggerQrStatus={triggerQrStatus}
                timeExpiryCallback={timeExpiryCallback}
                qrTimer={qrTimer}
                qrExpired={qrExpired}
                handleOnCancelClick={handleOnCancelClick}
                localeData={localeData}
              />
            ) : (
              <NewPayment.QRCodeForm
                isOpen={data.isChildrenVisible}
                paymentMethod={data.paymentMethod}
                gatewayId={data.gatewayId}
                onSubmit={data.onSubmit}
              />
            ),
        }}
        cardType={cardType}
      />
      {/* } */}
    </div>
  );
};

export default QRCodeHandler;
