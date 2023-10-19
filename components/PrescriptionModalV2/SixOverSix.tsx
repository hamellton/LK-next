import { dataURItoBlob } from "@/redux/slices/ditto";
import { appendScriptToDOM } from "containers/Base/helper";
import { pushDataLayer } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { loadScriptWithCallback, resetOrientation, sixOversix } from "./helper";
import { destroyInterceptor, initiateInterceptor } from "./Interceptor";

export default function SixOverSix({
  setPdSixOverSix,
  setClicked,
  deviceType,
  clickedSetSixOverSixError,
}: {
  setClicked: (props: boolean) => void;
  setPdSixOverSix: (props: number) => void;
  deviceType: string;
  clickedSetSixOverSixError: () => void;
}) {
  let lensWidth = "",
    lensPd = "";

  const [step, setStep] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    initiateInterceptor();
    setPdSixOverSix(0);
    if (true) {
      appendScriptToDOM(
        "https://web.cdn.glasseson.com/glasseson-2.7.6.js",
        "",
        false,
        //   () => setscriptLoaded(true)
        initSixOverSix
      );
      return () => {
        destroyInterceptor();
        setClicked(false);
      };
    }
    // initSixOverSix();
  }, []);

  //   useEffect(() => {
  //     return
  //   }, []);

  const initSixOverSix = () => {
    if (window && window?.glasseson) {
      window.glasseson.setResultCallback(resultCallback);
      window.glasseson.setAnalyticsCallback(analyticsCallback);
      window.glasseson.setCloseCallback(closeCallback);
      const serverUrl = "https://api.glasseson.com/prod/";
      if (!window.glasseson?.initCompleted) {
        window.glasseson
          .init(sixOversix.clientId, serverUrl, sixOversix.options)
          .then(
            () => {
              // console.log("success");
              handleSuccess();
            },
            (error: any) => {
              handleError(error);
            }
          );
      } else {
        window.openToClose = true;
        glasseson?.close();
        glasseson?.open();
        window.openToClose = false;
      }
    }
  };

  const gaTrackingDetail = (value: any) => {
    if (true) value += " android";
    const dlUpdate = {
      event: "six_over_six",
      six_over_six_flow_impression: value,
      six_over_six_session_id: glasseson.getSessionId(),
      six_over_six_user_id: glasseson.getUserId(),
    };
    pushDataLayer(dlUpdate);
  };

  const dtmSDKInitialized = (step: any) => {
    let stepVal = "";
    if (step === "step1") {
      stepVal = "find your frame size";
    } else if (step === "step2") {
      stepVal = "voice instruction";
    } else {
      stepVal = "get ready";
    }
    setStep(step);
  };

  const dtmScanStarted = () => {
    setStep("recording");
  };

  const analyticsCallback = (event: any) => {
    switch (event.title) {
      case "SDK Initializing started": {
        gaTrackingDetail("SDK Initializing started");
        break;
      }
      case "SDK Initializing completed":
        dtmSDKInitialized("step1");
        break;
      case "'Setting up for scan' was displayed":
        dtmSDKInitialized("step2");
        break;
      case "Video tutorial":
        dtmSDKInitialized("step3");
        break;
      case "Scan started": {
        dtmScanStarted();
        gaTrackingDetail("Scan Started");
        break;
      }
      case "Scan completed successfully":
        // this.dtmScanCompleted();
        break;
      case "Eyes not detected": {
        gaTrackingDetail("Eyes not detected");
        dtmSixOverSixError("eyes not detected");
        break;
      }
      case "Try a different card": {
        gaTrackingDetail("Try a different card");
        dtmSixOverSixError("Try a different card");
        break;
      }
      case "Camera issue": {
        gaTrackingDetail("Camera issue");
        dtmSixOverSixError("Camera issue");
        break;
      }
      case "SDK closed": {
        gaTrackingDetail("SDK closed");
        window.openToClose = false;
        break;
      }
      default:
        break;
    }
  };

  const dtmSixOverSixError = (error: any) => {
    // console.log(error);
    clickedSetSixOverSixError();
  };

  const handleSuccess = () => {
    glasseson.open("pd", "pre");
  };

  const resultCallback = (result: any) => {
    if (result.data) {
      lensWidth = result.data.frame_width;
      lensPd = result.data.pd;
      setPdSixOverSix(Math.round(lensPd / 2));
      // console.log(lensWidth, lensPd);

      if (true) {
        storeFrameSize();
      }
      glasseson.close();
    }
  };

  const storeFrameSize = () => {
    try {
      const fR = new FileReader();
      fR.readAsDataURL(window.imageData);
      fR.onload = () => {
        resetOrientation(fR.result || "", 5, storeSuccessImage);
      };
    } catch (e) {
      console.log(e);
    }
  };

  const storeSuccessImage = (dataUri: any) => {
    let authToken;
    // const { userInfo, storeFrameSize, dataLocale } = this.props;
    // const { FRAME_SIZE_KEY_MSITE, FRAME_SIZE_KEY_DESKTOP } = dataLocale;
    const binaryImage = dataURItoBlob(dataUri);
    const formData = new FormData();
    const phNumber = "9999999999";
    //   (userInfo && userInfo.telephone) ||
    //   sessionStorageHelper.getItem("userPh") ||
    //   "guestUser";
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const frameAndPDSize = `frameWidth-${lensWidth}_pD-${lensPd}`;
    formData.append(
      `${randomNumber}_${phNumber}_${frameAndPDSize}`,
      binaryImage
    );
    // country wise token
    // ('#if CLIENT_TYPE === "mobile"'); // eslint-disable-line
    // authToken = "FRAME_SIZE_KEY_MSITE";
    // ("#endif"); // eslint-disable-line
    // ('#if CLIENT_TYPE === "desktop"'); // eslint-disable-line
    // authToken = "FRAME_SIZE_KEY_DESKTOP";
    // ("#endif"); // eslint-disable-line
    // storeFrameSize(formData, authToken);
  };

  const handleError = (err: any) => {
    if (true) {
      window.open("lenskart://www.lenskart.com/6over6/pd/failure");
    } else alert(err);
  };

  const closeCallback = (result: any) => {
    if (window.openToClose) return;
    if (result) {
      console.log("result", result);
    } else {
      setClicked(false);
      console.log("error");
    }
  };

  return (
    <>
      <div className="glasses">
        <div className="glasseson-loader"></div>
        <div id="glasseson"></div>
      </div>
    </>
  );
}
