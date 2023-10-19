//> Default
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//> Packages
import { getCookie, setCookie } from "@/helpers/defaultHeaders";

//> Types
import { LocalType } from "@/types/coreTypes";

//> Redux
import { AppDispatch, RootState } from "@/redux/store";
import {
  dittoProfilePost,
  getCygnusImage,
  resetCygnusIdLoad,
  resetCygnusImages,
  setDittoAuth,
  updateCustomerCygnusData,
} from "@/redux/slices/ditto";

//> Styles
import {
  Button,
  DittoCam,
  DittoContainer,
  DittoWrapper,
  HeaderText3D,
  ImageSection,
  Span,
  SubText1,
  SubText2,
  SubTextWrapper,
  View3DTryOn,
  FaceArea,
  FaceBorder,
  CameraContent,
  CameraContainer,
  PopUpMessage,
  CrossButton,
  PopUpTitle,
  PopUpBody,
  BtnRoot,
  PopUpImage,
  CameraTitle,
  ImageStyle,
  MobileCameraContainer,
  MobileHeaderContent,
  MobileHeaderAction,
  Img,
  MobileHeaderTitle,
  MobileCameraContent,
  MobileFaceArea,
  MobileFaceBorder,
  MobileContentText,
  ErrorContainer,
  SuccessContainer,
  ItemIndex,
  DittoWrapperContainer,
  PopUpMessageMobile,
  CameraContentMobile,
  PopUpBodyMobile,
} from "./Ditto.styles";

//>Constants
import { dittoObj } from "@/constants/ditto";
import Camera from "./Camera";
import { Icons } from "@lk/ui-library";
import Router from "next/router";
import { Footer } from "@lk/ui-library";
import { dataLocale, footerData } from "containers/Base/footerData";
import Image from "next/image";
import { DeviceTypes } from "@/types/baseTypes";
import { BottomSheet } from "@lk/ui-library";
import { ctaClickEvent } from "helpers/gaFour";

//>Global
declare global {
  interface Window {
    dittoCreation: any;
    Ditto: any;
  }
}

const Ditto = ({ localeData }: LocalType) => {
  //> Redux State
  const dispatch = useDispatch<AppDispatch>();
  const { sessionId, isLogin, mobileNumber } = useSelector(
    (state: RootState) => state.userInfo
  );
  const { isDittoAuthSet, cygnus } = useSelector(
    (state: RootState) => state.dittoInfo
  );

  const { deviceType, country, countryCode } = useSelector(
    (state: RootState) => state.pageInfo
  );

  const subdirectoryPath = useSelector(
    (state: RootState) => state.pageInfo.subdirectoryPath
  );
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  //> Local State
  const [showDitto, setShowDitto] = useState(false);
  const [background, setBackground] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [cookieSet, setCookieSet] = useState(false);

  useEffect(() => {
    dispatch(
      setDittoAuth({
        sessionId:
          sessionId || getCookie(`clientV1_${country}`)?.toString() || "",
        dittoId: "lenskart",
        set: sessionId ? false : true,
      })
    );
  }, [dispatch, sessionId]);

  //> Create a new Ditto handler
  const createDitto = () => {
    window.dittoCreation = new window.Ditto.Scan(
      {
        partnerId: "lenskart",
        tryOnServer: dittoObj.serverUrl,
        faServerNetloc: dittoObj.faServerUrl,
        accessKey: getCookie("dittoAccessID"),
        partnerSignature: window.sessionStorage.getItem("createDittoSignature"),
        modelDittoId: dittoObj.modelDittoId,
        modelDittoSignature: dittoObj.modelDittoSignature,
        disableScale: dittoObj.disableScale,
        enableFaceInsights: true,
        domSelector: "#creation",
      },
      {
        success: dittoSuccess,
        close: dittoClose,
      }
    );
  };

  //> Post ditto creation success handler
  const dittoSuccess = (callbackObject: any) => {
    const dittoId = callbackObject.scanId;
    setCookie("guestDitto", dittoId);
    // localStorage.setItem("DittoOn", "true");
    setShowLoader(true);
    if (isLogin) {
      dispatch(dittoProfilePost({ sessionId: sessionId, dittoId }));
    }
    // debugger;
    dispatch(setDittoAuth({ sessionId: sessionId, dittoId, set: true }));
  };

  //> Create Initial Ditto Signature
  const initDitto = () => {
    const dittoAccessID = getCookie("dittoAccessID");
    const createDittoSignature = window.sessionStorage.getItem(
      "createDittoSignature"
    );
    if (!dittoAccessID && !createDittoSignature) {
      console.log("no Id");
    } else {
      if (typeof window !== undefined) {
        createDitto();
      }
    }
  };

  //> Check to create a new ditto
  useEffect(() => {
    if (showDitto) {
      createDitto();
    }
  }, [showDitto]);

  useEffect(() => {
    if (isDittoAuthSet && showLoader) {
      const value = localStorage.getItem("dittoCompare");
      window.location.href = value
        ? value
        : `${subdirectoryPath || ""}/eyeglasses.html`;
    }
  }, [isDittoAuthSet, showLoader, subdirectoryPath]);

  useEffect(() => {
    if (cookieSet && showDitto) {
      initDitto();
    }
  }, [cookieSet, showDitto]);

  //> Open Ditto
  const openDitto = () => {
    // setShowDitto(true);
    setBackground(false);
    setShowCamera(true);
  };

  //> Close Ditto Section
  const dittoClose = () => {
    setShowDitto(false);
  };

  const [retakeCB, setretakeCB] = useState<any>(null);
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [cameraBlockedError, setCameraBlockedError] = useState(false);
  const [crossButtonClicked, setCrossButtonClicked] = useState(false);
  const [updateCustomerCygnusError, setUpdateCustomerCygnusError] =
    useState(false);
  const [uploadedCygnusData, setUploadedCygnusData] = useState(false);
  // const updateCustomerCygnusError = true;
  useEffect(() => {
    if (typeof window?.fbq !== "undefined" && uploadedCygnusData) {
      window?.fbq("track", "3DTryOnSuccess", {
        dittoId: cygnus.cygnusId,
      });
    }
  }, [uploadedCygnusData]);

  useEffect(() => {
    if (cameraBlockedError) {
      setShowPopupMessage(true);
    } else if (!cygnus.isLoading && cygnus.isError) {
      setShowPopupMessage(true);
      setUpdateCustomerCygnusError(true);
      setUploadedCygnusData(false);
    } else if (
      !cygnus.isLoading &&
      cygnus?.cygnusId &&
      cygnus.cygnusIdLoaded &&
      !cygnus.isError
    ) {
      setShowPopupMessage(true);
      setUploadedCygnusData(true);
      setCookie("cygnus", true);
      setCookie("dittoGuestId", cygnus.cygnusId);
    } else if (!cygnus.isLoading && !cygnus.isError && !cygnus.cygnusId) {
      setShowPopupMessage(false);
      setUpdateCustomerCygnusError(false);
      setUploadedCygnusData(false);
    }
  }, [cygnus, cameraBlockedError]);

  // const cameraBlockedError = true;
  const client = deviceType;

  const uploadToCygnus = (image: any) => {
    // const { dittoActions } = this.props;
    // dittoActions.uploadPhotoToCygnus(
    //   image,
    //   this.props?.userInfo?.telephone,
    //   this.props?.userInfo?.phoneCode,
    //   client
    // );
    dispatch(
      getCygnusImage({
        sessionId: sessionId,
        image: image,
        phNumber: isLogin && mobileNumber ? mobileNumber.toString() : "",
        countryCode: countryCode,
      })
    );
  };
  const redirectPage = () => {
    if (cygnus.cygnusId && isLogin) {
      dispatch(
        updateCustomerCygnusData({
          sessionId: sessionId,
          cygnusId: cygnus.cygnusId,
        })
      );
      if (isLogin) {
        dispatch(
          dittoProfilePost({ sessionId: sessionId, dittoId: cygnus.cygnusId })
        );
      }
    }
    dispatch(resetCygnusIdLoad());
    dispatch(resetCygnusImages());
    if (localStorage.getItem("dittoCompare") === null) {
      if (document.referrer?.indexOf("sunglasses") !== -1) {
        Router.push("/ditto/sunglasses.html");
      } else {
        Router.push("/ditto/eyeglasses.html");
      }
    } else {
      const link = localStorage.getItem("dittoCompare") || "";
      const trimmedLink = link.replace(window?.location?.href, "") || "/";
      Router.push(link);
    }
    setCookie("isDitto", true);
  };

  useEffect(() => {
    openDitto();
  }, []);

  return (
    <>
      {deviceType === DeviceTypes.DESKTOP ? (
        <DittoWrapperContainer>
          <DittoWrapper isDitto={background}>
            {/* {!showCamera && (
              <DittoContainer>
                <ImageSection>
                  <ImageStyle
                    src={
                      "https://static5.lenskart.com/images/cust_mailer/vs/nov-18-20/katrina_ditto.gif"
                    }
                    alt=""
                  />
                </ImageSection>
                <View3DTryOn>
                  <HeaderText3D>{localeData._3D_TRY_ON}</HeaderText3D>
                  <SubTextWrapper>
                    <SubText1>
                      <ItemIndex>1</ItemIndex>
                      <Span>
                        {
                          localeData.MAKE_VIDEO_TRY_GLASSES_ON_YOURSELF_FROM_ALL_ANGLES
                        }
                      </Span>
                    </SubText1>
                    <SubText2>
                      <ItemIndex>2</ItemIndex>
                      <Span>
                        {
                          localeData.TRY_1000S_fRAME_ON_YOUR_FACE_AND_COMPARE_LOOKS
                        }
                      </Span>
                    </SubText2>
                  </SubTextWrapper>
                  <Button onClick={openDitto}>{localeData.GET_STARTED}</Button>
                </View3DTryOn>
              </DittoContainer>
            )} */}
            {/* {showDitto && !showLoader && (
          <div key="ditto_creation">
            <DittoCam id="creation"></DittoCam>
          </div>
        )} */}
            {showCamera && (
              <CameraContainer>
                <CameraTitle>{localeData.DITTO_INSTRUCTIONS}</CameraTitle>
                <Camera
                  // {...this.props}
                  localeData={localeData}
                  cameraContent={
                    <CameraContent>
                      {!cameraBlockedError && <FaceArea></FaceArea>}
                      {!cameraBlockedError && <FaceBorder></FaceBorder>}
                      {cameraBlockedError && (
                        <PopUpMessage>
                          <Image
                            alt="error"
                            height={40}
                            width={40}
                            src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/WarningRedTriangle.svg"
                          />
                          <PopUpTitle>{localeData.CAMERA_BLOCKED}</PopUpTitle>
                          <PopUpBody>
                            <p>{localeData.CAMERA_USAGE_BLOCKED}</p>
                            <p>{localeData.GRANT_ACCESS_TO_CREATE}</p>
                          </PopUpBody>
                          {/* <button className="btn-action" onClick={this.grantCameraAcess}>
                        {GRANT_CAMERA_ACCESS}
                      </button> */}
                        </PopUpMessage>
                      )}
                    </CameraContent>
                  }
                  client={client}
                  getImage={uploadToCygnus}
                  getRetakeCallback={(retakeCB: any) => {
                    setretakeCB(retakeCB);
                  }}
                  imageFormat="image/jpeg"
                  loading={cygnus.isLoading}
                  crossButtonClicked={crossButtonClicked}
                  updateCustomerCygnusError={updateCustomerCygnusError}
                  setCrossButtonClicked={setCrossButtonClicked}
                  uploadedCygnusData={uploadedCygnusData}
                  photoContent={
                    <div>
                      <FaceArea></FaceArea>
                      <FaceBorder></FaceBorder>
                      {/* {(uploadedDittoData || dittoErrorAPI?.errorCode === 400) && */}
                      {showPopupMessage && (
                        <PopUpMessage>
                          {/* <div> */}
                          {updateCustomerCygnusError && (
                            <>
                              <CrossButton
                                onClick={() => setCrossButtonClicked(true)}
                              >
                                {/* <img alt="close" src={IconClose} /> */}
                                <Icons.Cross />
                              </CrossButton>
                              <Image
                                alt="error"
                                width={40}
                                height={40}
                                src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/WarningRedTriangle.svg"
                              />
                              <PopUpTitle>
                                {localeData.UNABLE_TO_TRACK_FACE}
                              </PopUpTitle>
                              <PopUpBody>
                                <p>
                                  {localeData.FACE_EVENLY_LIT}
                                  {localeData.SYMBOL_COMMA}
                                </p>
                                <p>{localeData.EARS_VISIBLE}</p>
                              </PopUpBody>
                              <BtnRoot
                                onClick={() => setCrossButtonClicked(true)}
                              >
                                {localeData.RETAKE_PHOTO}
                              </BtnRoot>
                            </>
                          )}
                          {uploadedCygnusData && (
                            <>
                              <CrossButton
                                onClick={() => setCrossButtonClicked(true)}
                              >
                                {/* <img alt="close" src={IconClose} /> */}
                                <Icons.Cross />
                              </CrossButton>
                              <PopUpImage
                                alt="uploaded ditto"
                                src={cygnus.imageUrl}
                              />
                              <PopUpBody>
                                <p>{localeData.YOUR_3D_SUCCESSFULLY_CREATED}</p>
                              </PopUpBody>
                              <BtnRoot
                                style={{ width: "100%" }}
                                onClick={() => {
                                  redirectPage();
                                  const eventName = "cta_click";
                                  const cta_name = "view-frames-in-3d";
                                  const cta_flow_and_page = "compare-looks";
                                  ctaClickEvent(
                                    eventName,
                                    cta_name,
                                    cta_flow_and_page,
                                    userInfo,
                                    pageInfo
                                  );
                                }}
                              >
                                {localeData.VIEW_FRAMES_IN_3D}
                              </BtnRoot>
                            </>
                          )}
                          {/* </div> */}
                        </PopUpMessage>
                      )}
                    </div>
                  }
                  setCameraBlockedError={setCameraBlockedError}
                  cameraBlockedError={cameraBlockedError}
                  fitMySize={false}
                />
              </CameraContainer>
            )}
          </DittoWrapper>
          <Footer
            footerData={footerData}
            // footerTopData = {footerTopData}
            dataLocale={dataLocale}
            country={pageInfo.country}
          />
        </DittoWrapperContainer>
      ) : (
        <>
          <div>
            <MobileCameraContainer>
              <MobileHeaderContent>
                <MobileHeaderAction
                  onClick={() => {
                    Router.back();
                    setCookie("isDitto", false);
                  }}
                >
                  <Img
                    alt="arrow-left"
                    src={
                      pageInfo.isRTL
                        ? "https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/ArrowRight.svg"
                        : "https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/ArrowLeft.svg"
                    }
                  />
                </MobileHeaderAction>
                <MobileHeaderTitle>
                  {localeData.FACE_ANALYSIS}
                </MobileHeaderTitle>
              </MobileHeaderContent>
              <Camera
                // {...this.props}
                localeData={localeData}
                cameraContent={
                  <MobileCameraContent>
                    {!cameraBlockedError && <MobileFaceArea></MobileFaceArea>}
                    {!cameraBlockedError && (
                      <MobileFaceBorder></MobileFaceBorder>
                    )}
                    {!cameraBlockedError && (
                      <MobileContentText>
                        <p>{localeData.REMOVE_YOUR_GLASSES}</p>
                        <p>{localeData.TAP_TO_CAPTURE}</p>
                      </MobileContentText>
                    )}
                  </MobileCameraContent>
                }
                client={client}
                getImage={uploadToCygnus}
                getRetakeCallback={(retakeCB: any) => {
                  setretakeCB(retakeCB);
                }}
                imageFormat="image/jpeg"
                loading={cygnus.isLoading}
                crossButtonClicked={crossButtonClicked}
                updateCustomerCygnusError={updateCustomerCygnusError}
                setCrossButtonClicked={setCrossButtonClicked}
                uploadedCygnusData={uploadedCygnusData}
                photoContent={
                  <div>
                    <MobileFaceArea></MobileFaceArea>
                    <MobileFaceBorder></MobileFaceBorder>
                  </div>
                }
                setCameraBlockedError={setCameraBlockedError}
                cameraBlockedError={cameraBlockedError}
                fitMySize={false}
              />
              <BottomSheet
                show={showPopupMessage}
                closebottomSheet={() => {
                  !cameraBlockedError
                    ? (setCrossButtonClicked(true),
                      setCameraBlockedError(false))
                    : Router.push(`/eyeglasses/brands.html`);
                }}
                borderRadius={"12px 12px 0 0"}
              >
                {cameraBlockedError && (
                  <>
                    <CameraContentMobile>
                      <Image
                        className="popup-img-mobile"
                        height={40}
                        width={40}
                        alt="error"
                        src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/WarningRedTriangle.svg"
                      />
                      <PopUpMessageMobile>
                        {localeData.CAMERA_BLOCKED}
                      </PopUpMessageMobile>
                      <PopUpBodyMobile>
                        <p>{localeData.CAMERA_USAGE_BLOCKED}</p>
                        <p>{localeData.GRANT_ACCESS_TO_CREATE}</p>
                      </PopUpBodyMobile>
                      {/* <button className="btn-action" onClick={this.grantCameraAcess}>
                        {GRANT_CAMERA_ACCESS}
                      </button> */}
                    </CameraContentMobile>
                  </>
                )}
                {updateCustomerCygnusError && (
                  <ErrorContainer>
                    {/* <button
                      className="btn-close-popup"
                      onClick={() => {
                        retakeCB();
                        // this.closePopupMessage();
                      }}
                    >
                      <img alt="close" src={"IconClose"} />
                    </button> */}
                    <Image
                      width={40}
                      height={40}
                      alt="error"
                      src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/WarningRedTriangle.svg"
                    />
                    <PopUpTitle>{localeData.UNABLE_TO_TRACK_FACE}</PopUpTitle>
                    <PopUpBody>
                      <p>
                        {localeData.FACE_EVENLY_LIT}
                        {localeData.SYMBOL_COMMA}
                      </p>
                      <p>{localeData.EARS_VISIBLE}</p>
                    </PopUpBody>
                    <BtnRoot
                      style={{ width: "100%" }}
                      onClick={() => {
                        setCrossButtonClicked(true);
                      }}
                    >
                      {localeData.RETAKE_PHOTO}
                    </BtnRoot>
                  </ErrorContainer>
                )}
                {uploadedCygnusData && (
                  <SuccessContainer>
                    {/* <img alt="close" src={IconClose} /> */}
                    {/* </button> */}

                    <PopUpImage alt="uploaded ditto" src={cygnus.imageUrl} />
                    <PopUpBody>
                      <p>{localeData.YOUR_3D_SUCCESSFULLY_CREATED}</p>
                    </PopUpBody>
                    <BtnRoot
                      style={{ width: "100%" }}
                      onClick={() => {
                        redirectPage();
                        const eventName = "cta_click";
                        const cta_name = "view-frames-in-3d";
                        const cta_flow_and_page = "compare-looks";
                        ctaClickEvent(
                          eventName,
                          cta_name,
                          cta_flow_and_page,
                          userInfo,
                          pageInfo
                        );
                      }}
                    >
                      {localeData.VIEW_FRAMES_IN_3D}
                    </BtnRoot>
                  </SuccessContainer>
                )}
              </BottomSheet>
            </MobileCameraContainer>
          </div>
        </>
      )}
    </>
  );
};

export default Ditto;
