import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Html5Types } from "./Html5QrCode.types";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { pidFromQrData, pidFromQrInfoSlice } from "@/redux/slices/pidQrInfo";
import Router from "next/router";
import { Toast, BottomSheet } from "@lk/ui-library";
import {
  CameraContentMobile,
  PopUpMessageMobile,
  PopUpBodyMobile,
} from "containers/Ditto/Ditto.styles";
import Image from "next/image";

const HtmlQrCode = ({
  sessionId,
  history,
  showSearch,
  localeData,
  onClose,
}: Html5Types) => {
  const qrcodeRegionId = "html5qr-code-full-region";
  let html5QrCode: any;
  const dispatch = useDispatch<AppDispatch>();
  const qrCodeData = useSelector((state: RootState) => state.pidFromQrData);
  const [showToast, setToast] = useState(true);
  const [cameraDisabled, setCameraDisabled] = useState(false);

  useEffect(() => {
    setToast(!!qrCodeData?.errorMessage);
  }, [qrCodeData]);
  useEffect(() => {
    openQrCode();

    return () => {
      if (html5QrCode)
        try {
          html5QrCode.stop();
        } catch (error) {
          console.log(error);
        }
    };
  }, []);

  const openQrCode = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const reverseAspectRatio = height / width;

    const mobileAspectRatio =
      reverseAspectRatio > 1.5
        ? reverseAspectRatio + (reverseAspectRatio * 7) / 100
        : reverseAspectRatio;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          html5QrCode = new Html5Qrcode(qrcodeRegionId);
          html5QrCode
            .start(
              { facingMode: "environment" },
              {
                fps: 10,
                qrbox: { width: 288, height: 288 },
                aspectRatio: width < 600 ? mobileAspectRatio : aspectRatio,
              },
              (decodedText: any, decodedResult: any) => {
                console.log("decodedText", decodedText, sessionId);

                dispatch(
                  pidFromQrData({ sessionId: sessionId, query: decodedText })
                );
                setToast(qrCodeData?.errorMessage != "");
                // console.log(
                //   "qrCodeData",
                //   `/product/${qrCodeData.data.productId?.toString()}`
                // );

                // /product/${pidFromBarcodeData?.productId}`
              },
              (errorMessage: string) => {
                // parse error, ignore it.
              }
            )
            .catch((err: any) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setCameraDisabled(true);
      });
  };
  useEffect(() => {
    if (qrCodeData && qrCodeData.data && qrCodeData.data.productId) {
      // console.log("redirecting", qrCodeData);
      window.location.href = `/product/${qrCodeData.data.productId?.toString()}`;
      return;
    }
  }, [qrCodeData]);
  return (
    <>
      <div id={qrcodeRegionId} />
      <BottomSheet
        show={cameraDisabled}
        closebottomSheet={() => {
          setCameraDisabled(false);
          onClose();
        }}
        borderRadius={"12px 12px 0 0"}
      >
        <CameraContentMobile>
          <Image
            className="popup-img-mobile"
            height={40}
            width={40}
            alt="error"
            src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/WarningRedTriangle.svg"
          />
          <PopUpMessageMobile>{localeData.CAMERA_BLOCKED}</PopUpMessageMobile>
          <PopUpBodyMobile>
            <p>{localeData.CAMERA_USAGE_BLOCKED}</p>
          </PopUpBodyMobile>
        </CameraContentMobile>
      </BottomSheet>
      {showToast && (
        <Toast text={qrCodeData?.errorMessage ?? "Invalid QR code"} />
      )}
    </>
  );
};

export default HtmlQrCode;
