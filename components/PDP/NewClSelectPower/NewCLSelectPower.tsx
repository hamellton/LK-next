import {
  fetchPowers,
  getPrescriptionDataWithPowerType,
  getSavedPrescriptionData,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountInfo,
  registerUser,
  resetAuth,
  updateCaptchaResponse,
  updateIsCaptchaVerified,
  updateOpenSignInModal,
  updateShowOtp,
  updateSignInStatusError,
  // validateCaptchaResponse,
  validateLoginPassword,
  validateOtpData,
} from "@/redux/slices/auth";
import { setWhatsappChecked, whatsAppUpdate } from "@/redux/slices/userInfo";
import {
  ContactLensSignIn,
  ContactLensSignInButton,
  ContactLensSignInText,
  CustomGrid,
  Divider,
  EnterPowerManuallyWrapper,
  ErrorField,
  ContactLensInfo,
  StyledButton,
  MainText,
  PowerTab,
  PowerTabBody,
  PowerTabHeader,
  PowerTabHeaderInput,
  PowerTabLabel,
  PowerTabsWrapper,
  QuickLink,
  QuickLinks,
  QuickLinksContainer,
  SavedPrescTab,
  SelectPowerText,
  ErrorWrapper,
  RotateArrow,
} from "./NewClSelectPower.styles";
import { NewCLSelectPowerType } from "./NewClSelectPower.types";
import { Auth } from "@lk/ui-library";
import { headerArr } from "helpers/defaultHeaders";
import NewCLSavedPrescription from "./NewCLSavedPrescription";
import {
  Icons,
  OverlayTrigger,
  Tooltip,
  Dropdown,
  PlaceholderDropdown,
  PrimaryButton,
} from "@lk/ui-library";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { ComponentSizeENUM, ThemeENUM } from "@/types/baseTypes";
import {
  addToCartCLItems,
  addToCartNoPower,
  reqSaveToCLObjType,
  saveToCartCL,
} from "@/redux/slices/cartInfo";
import Router, { useRouter } from "next/router";
import { APIService, RequestBody } from "@lk/utils";
import { APIMethods } from "@/types/apiTypes";
import { userFunctions } from "@lk/core-utils";
import { SignInType } from "@/types/state/authInfoType";
import { appendScriptToDOM } from "containers/Base/helper";
import { PowerTypeList } from "containers/ProductDetail/ProductDetail.types";

const NewCLSelectPower = ({
  font,
  productId,
  powerTypeList,
  isJitProduct,
  isPlano,
  sessionId,
  localeData,
  productData,
  configData,
}: NewCLSelectPowerType) => {
  const {
    SELECT_POWER,
    CL_POWER_CAN_BE_DIFFERENT,
    HOW_TO_READ_YOUR_PRESCRIPTION,
    CONVERT_EYEGLASSES_POWER,
    SIGN_IN_TO_VIEW_SAVE_POWERS,
    SIGN_IN,
    LEFT_EYE,
    RIGHT_EYE,
  } = localeData;

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { data } = useSelector((state: RootState) => state.prescriptionInfo);
  const { cartIsError, cartIsLoading, cartErrorMessage } = useSelector(
    (state: RootState) => state.cartInfo
  );
  const { subdirectoryPath } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const [expandedTab, setExpandedTab] = useState(
    userInfo?.isLogin && data && data?.result?.length > 0
      ? "USE_SAVED_PRESCRIPTION"
      : "ENTER_PRESCRIPTION_MANUALLY"
  );
  const [callMeLaterChecked, setCallMeLaterChecked] = useState(false);
  const [cartActive, setcartActive] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSubError, setShowSubError] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [selectedSavedPrescription, setSelectedSavedPrescription] = useState(
    {}
  );
  useEffect(() => {
    if (userInfo?.sessionId) {
      dispatch(
        getPrescriptionDataWithPowerType({
          sessionId: userInfo.sessionId,
          powerType: "CONTACT_LENS",
        })
      );
    }
  }, [userInfo?.isLogin]);

  // > login related states

  enum AuthTabENUM {
    SIGN_IN = "sign_in",
    SIGN_UP = "sign_up",
  }
  const siteKey = "6LcssXobAAAAABuHKTm_Fk6nevRwZUTGtHij1wS2";

  const [authTab, setAuthTab] = React.useState(AuthTabENUM.SIGN_IN);
  const authInfo = useSelector((state: RootState) => state.authInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const [recaptchaInDom, setRecaptchaInDom] = useState(false);
  const [scriptLoaded, setscriptLoaded] = useState(false);
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );

  const router = useRouter();

  const { signInStatus } = authInfo;

  //> Show Login Modal Handler
  const onSignInClick = () => {
    setAuthTab(AuthTabENUM.SIGN_IN);
    setShowLogin(true);
  };

  const onSignUpClick = () => {
    setAuthTab(AuthTabENUM.SIGN_UP);
    setShowLogin(true);
  };

  const forgotPasswordHandler = async (email: string) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody({
      emailAddress: email,
    });
    try {
      const { data, error } = await userFunctions.forgotPassword(api, body);
      if (error.isError) console.log(error);
      return { data: "Recovery mail has been sent to your Email", error };
    } catch (err: any) {
      console.log(err);
      return {
        data: "",
        error: { isError: true, message: err?.message || "Error" },
      };
    }
  };

  const resetSignInStatus = () => {
    dispatch(resetAuth());
  };

  //> SignIn or SignUp handler
  const verifySignInType = (
    type: SignInType,
    value: string,
    password?: string
  ) => {
    if (!password) {
      dispatch(
        getAccountInfo({
          captcha: authInfo.signInStatus.isCaptchaRequired
            ? authInfo.signInStatus.captchaResponse
            : null,
          type: type,
          value: value,
          countryCode: countryCode,
          sessionId: userInfo.sessionId,
          localeData: localeData,
        })
      );
    } else {
      if (type === SignInType.PHONE) {
        dispatch(
          validateOtpData({
            value: password,
            phoneCode: countryCode,
            phoneNumber: value,
            sessionId: userInfo.sessionId,
            userInfo,
            pageInfo,
          })
        );
      } else {
        dispatch(
          validateLoginPassword({
            password: password,
            username: value,
            sessionId: userInfo.sessionId,
            userInfo,
            pageInfo,
          })
        );
      }
    }
  };

  const moveToSignUp = () => {
    setShowLogin(true);
    dispatch(resetAuth());
    setAuthTab(AuthTabENUM.SIGN_UP);
  };

  const notShowOtp = () => {
    dispatch(updateShowOtp(false));
  };
  const verifyCaptchaCallback = (response: string) => {
    if (response.length !== 0) {
      dispatch(updateIsCaptchaVerified(true));
      dispatch(updateCaptchaResponse(response));
      // dispatch(validateCaptchaResponse({
      //   captcha: response,
      //   value: ,
      //   countryCode: countryCode,
      //   sessionId: sessionId
      // }));
      // dispatch()
    }
  };

  const renderCaptcha = () => {
    // setCaptchaRendered(true);
    window?.grecaptcha?.render("recaptcha", {
      sitekey: siteKey,
      theme: "light",
      callback: verifyCaptchaCallback,
      "expired-callback": resetCaptcha,
    });
    dispatch(updateIsCaptchaVerified(false));
  };

  const loadThirdPartyScript = () => {
    appendScriptToDOM(
      "https://www.google.com/recaptcha/api.js?render=explicit",
      "",
      false,
      () => setscriptLoaded(true)
    );
  };

  const resetCaptcha = () => {
    if (recaptchaInDom) {
      window?.grecaptcha?.reset();
      dispatch(updateIsCaptchaVerified(false));
      dispatch(updateCaptchaResponse(null));
    }
  };

  // > login related ends

  const [customError, setCustomError] = useState("");
  const [leftBox, setLeftBox] = useState<DataType>({
    boxes: "1",
    sph: "",
    cyl: "",
    axis: "",
  });
  const [rightBox, setRightBox] = useState<DataType>({
    boxes: "1",
    sph: "",
    cyl: "",
    axis: "",
  });
  const [validationError, setValidationError] = useState({
    sph: { left: false, right: false },
    cyl: { left: false, right: false },
    axis: { left: false, right: false },
    errorMessage: "",
  });
  const resetCLBoxes = () => {
    setLeftBox({
      boxes: "1",
      sph: "",
      cyl: "",
      axis: "",
    });
    setRightBox({
      boxes: "1",
      sph: "",
      cyl: "",
      axis: "",
    });
  };

  useEffect(() => {
    setCustomError("");
  }, [expandedTab]);

  useEffect(() => {
    if (!cartIsLoading) {
      setCustomError(cartErrorMessage);
    }
  }, [cartErrorMessage, cartIsLoading]);
  useEffect(() => {
    // setting default to saved prescription if logged in and saved power available
    // console.log("SAVED POWER >>> ", data);
    if (userInfo.isLogin && data && data.length > 0) {
      setExpandedTab("USE_SAVED_PRESCRIPTION");
    }
    // setExpandedTab(userInfo?.isLogin && data && data?.result?.length > 0
    // 	? 'USE_SAVED_PRESCRIPTION'
    // 	: 'ENTER_PRESCRIPTION_MANUALLY')
  }, [data, userInfo.isLogin]);

  const selectSavedPrescription = (data: any) => {
    setSelectedSavedPrescription(data);
  };

  const updateShowSubError = (value: boolean) => {
    setShowSubError(value);
  };

  useEffect(() => {
    if (cartActive && !cartIsLoading && !cartIsError) {
      setcartActive(false);
      // Router.push(`/cart`);
    }
  }, [cartIsLoading, cartIsError, cartActive, subdirectoryPath]);

  const powerDataList = [
    {
      title: "CALL_ME_LATER_FOR_EYEPOWER",
      showSection: true, // redis configurable
    },
    {
      title: "USE_SAVED_PRESCRIPTION",
      showSection: true,
    },
    {
      title: "ENTER_PRESCRIPTION_MANUALLY",
      showSection: true,
    },
  ];

  const changeExpandedTab = (
    e: React.ChangeEvent<HTMLInputElement>,
    tabName: string
  ) => {
    setExpandedTab(tabName);
    // if (
    //   (tabName === 'CALL_ME_LATER_FOR_EYEPOWER' && !callMeLaterChecked) ||
    //   (tabName !== 'CALL_ME_LATER_FOR_EYEPOWER' && callMeLaterChecked)
    // ) {
    //   checkboxToggle(e, contactLensId);
    //   setCallMeLaterChecked(!callMeLaterChecked);
    // }
    // if (tabName !== 'USE_SAVED_PRESCRIPTION') {
    //   selectSavedPrescription(null);
    // }
    // setSelectPowerType(tabName);
  };

  const updateData = (type: string, value: string, isLeftBox: boolean) => {
    setValidationError((prevState) => ({
      sph: {
        left: !prevState.sph.left
          ? prevState.sph.left
          : !(type === "sph" && isLeftBox),
        right: !prevState.sph.right
          ? prevState.sph.right
          : !(type === "sph" && !isLeftBox),
      },
      cyl: {
        left: !prevState.cyl.left
          ? prevState.cyl.left
          : !(type === "cyl" && isLeftBox),
        right: !prevState.cyl.right
          ? prevState.cyl.right
          : !(type === "cyl" && !isLeftBox),
      },
      axis: {
        left: !prevState.axis.left
          ? prevState.axis.left
          : !(type === "axis" && isLeftBox),
        right: !prevState.axis.right
          ? prevState.axis.right
          : !(type === "axis" && !isLeftBox),
      },
      errorMessage: "",
    }));
    if (isLeftBox) {
      setLeftBox((l: any) => ({ ...l, [type]: value }));
    } else {
      setRightBox((r: any) => ({ ...r, [type]: value }));
    }
  };

  //> Reset CL Box Dropdown's
  useEffect(() => {
    if (!cartIsError) {
      resetCLBoxes();
    }
  }, [cartIsError]);

  //> Add to Cart CL with Zero Power
  const addToCartZeroCl = () => {
    // console.log("inside add to cart zero cl...");
    const reqObj: reqSaveToCLObjType = {
      sessionId: userInfo.sessionId,
      pid: isJitProduct ? productId : null,
      cartData: {
        productId: productId,
        quantity: "1",
        prescription: {
          dob: "",
          gender: "",
          notes: "",
          userName: "lenskart user",
          powerType: "CONTACT_LENS",
          left: {
            boxes: "1",
            sph: "0.00",
          },
        },
      },
      validationData: { powerOptionList: [] },
    };
    const existingPowerTypes = powerTypeList.map((pt) => pt.type);
    existingPowerTypes.forEach((key) =>
      reqObj.validationData.powerOptionList.push({
        type: `Right ${key.toString().toUpperCase()}`,
        value: rightBox[key],
        price: 0,
      })
    );
    existingPowerTypes.forEach((key) =>
      reqObj.validationData.powerOptionList.push({
        type: `Left ${key.toString().toUpperCase()}`,
        value: leftBox[key],
        price: 0,
      })
    );
    // jit => powerData -> verify + cartData -> add + pid
    // non jit => cartData -> verify + cartData -> add
    dispatch(saveToCartCL(reqObj));
    setcartActive(true);
    // Router.push("/cart");
    // closePackageScreenHandler();
  };
  //   console.log(window.location)

  //> Add to Cart CL with power
  const addToCart = () => {
    // console.log("inside add to cart ...");
    const ptList = (powerTypeList as PowerTypeList[]).reduce(
      (arr: string[], pt) => {
        arr.push(pt.type);
        return arr;
      },
      []
    );
    let validationFlag: boolean = false;
    if (
      !["CALL_ME_LATER_FOR_EYEPOWER", "USE_SAVED_PRESCRIPTION"].includes(
        expandedTab
      )
    ) {
      if (leftBox.boxes === "0" && rightBox.boxes === "0") {
        setValidationError({
          sph: { left: false, right: false },
          cyl: { left: false, right: false },
          axis: { left: false, right: false },
          errorMessage: localeData.NUMBER_OF_BOXES_CANNOT_BE_ZERO,
        });
        validationFlag = true;
      } else {
        if (leftBox.boxes !== "0") {
          if (ptList.includes("sph") && leftBox.sph === "") {
            setValidationError((prevState) => ({
              sph: { left: true, right: prevState.sph.right },
              cyl: { left: prevState.cyl.left, right: prevState.cyl.right },
              axis: { left: prevState.axis.left, right: prevState.axis.right },
              errorMessage: localeData.ALL_POWER_FIELDS_ARE_MANDATORY,
            }));
            validationFlag = true;
          }
          if (ptList.includes("cyl") && leftBox.cyl === "") {
            setValidationError((prevState) => ({
              sph: { left: prevState.sph.left, right: prevState.sph.right },
              cyl: { left: true, right: prevState.cyl.right },
              axis: { left: prevState.axis.left, right: prevState.axis.right },
              errorMessage: localeData.ALL_POWER_FIELDS_ARE_MANDATORY,
            }));
            validationFlag = true;
          }
          if (ptList.includes("axis") && leftBox.cyl === "") {
            setValidationError((prevState) => ({
              sph: { left: prevState.sph.left, right: prevState.sph.right },
              cyl: { left: prevState.cyl.left, right: prevState.cyl.right },
              axis: { left: true, right: prevState.axis.right },
              errorMessage: localeData.ALL_POWER_FIELDS_ARE_MANDATORY,
            }));
            validationFlag = true;
          }
        }
        if (rightBox.boxes !== "0") {
          if (ptList.includes("sph") && rightBox.sph === "") {
            setValidationError((prevState) => ({
              sph: { left: prevState.sph.left, right: true },
              cyl: { left: prevState.cyl.left, right: prevState.cyl.right },
              axis: { left: prevState.axis.left, right: prevState.axis.right },
              errorMessage: localeData.ALL_POWER_FIELDS_ARE_MANDATORY,
            }));
            validationFlag = true;
          }
          if (ptList.includes("cyl") && rightBox.cyl === "") {
            setValidationError((prevState) => ({
              sph: { left: prevState.sph.left, right: prevState.sph.right },
              cyl: { left: prevState.cyl.left, right: true },
              axis: { left: prevState.axis.left, right: prevState.axis.right },
              errorMessage: localeData.ALL_POWER_FIELDS_ARE_MANDATORY,
            }));
            validationFlag = true;
          }
          if (ptList.includes("axis") && rightBox.cyl === "") {
            setValidationError((prevState) => ({
              sph: { left: prevState.sph.left, right: prevState.sph.right },
              cyl: { left: prevState.cyl.left, right: prevState.cyl.right },
              axis: { left: prevState.axis.left, right: true },
              errorMessage: localeData.ALL_POWER_FIELDS_ARE_MANDATORY,
            }));
            validationFlag = true;
          }
          // else {
          //   console.log("triggered: ", "ptList: ", ptList, "rightBox: ", rightBox);
          //   setValidationError((prevState) => ({
          //     sph: { left: false, right: false },
          //     cyl: { left: false, right: false },
          //     axis: { left: false, right: false },
          //     errorMessage: localeData.ALL_POWER_FIELDS_ARE_MANDATORY,
          //   }));
          // }
        }
      }
    }

    if (
      validationFlag &&
      !["CALL_ME_LATER_FOR_EYEPOWER", "USE_SAVED_PRESCRIPTION"].includes(
        expandedTab
      )
    )
      return;

    const reqObj: reqSaveToCLObjType = {
      sessionId: userInfo.sessionId,
      pid: isJitProduct ? productId : null,
      cartData: {
        productId: productId?.toString(),
        quantity: "0",
        prescription: {
          dob: "",
          gender: "",
          notes: "",
          userName: "lenskart user",
          powerType: "CONTACT_LENS",
        },
      },
      validationData: { powerOptionList: [] },
    };
    const existingPowerTypes = powerTypeList.map((pt) => pt.type);
    if (rightBox.boxes && rightBox.boxes !== "0") {
      reqObj.cartData.quantity = (
        parseInt(rightBox.boxes) + parseInt(reqObj.cartData.quantity)
      ).toString();
      existingPowerTypes.forEach((key) => {
        if (reqObj.cartData.prescription.right)
          reqObj.cartData.prescription.right = {
            ...reqObj.cartData.prescription.right,
            [key]: rightBox[key],
          };
        else reqObj.cartData.prescription.right = { [key]: rightBox[key] };
      });
    }
    if (leftBox.boxes && leftBox.boxes !== "0") {
      reqObj.cartData.quantity = (
        parseInt(leftBox.boxes) + parseInt(reqObj.cartData.quantity)
      ).toString();
      existingPowerTypes.forEach((key) => {
        if (reqObj.cartData.prescription.left)
          reqObj.cartData.prescription.left = {
            ...reqObj.cartData.prescription.left,
            [key]: leftBox[key],
          };
        else reqObj.cartData.prescription.left = { [key]: leftBox[key] };
      });
    }
    existingPowerTypes.forEach((key) =>
      reqObj.validationData.powerOptionList.push({
        type: `Right ${key.toString().toUpperCase()}`,
        value: rightBox[key],
        price: 0,
      })
    );
    existingPowerTypes.forEach((key) =>
      reqObj.validationData.powerOptionList.push({
        type: `Left ${key.toString().toUpperCase()}`,
        value: leftBox[key],
        price: 0,
      })
    );
    if (expandedTab === "USE_SAVED_PRESCRIPTION") {
      reqObj.cartData.prescription = { ...selectedSavedPrescription };
      // console.log(expandedTab, reqObj);
      dispatch(saveToCartCL(reqObj));
      // Router.push("/cart");
      return;
    }
    if (expandedTab === "CALL_ME_LATER_FOR_EYEPOWER") {
      const tempNoPowerObj = {
        prescription: {
          left: {
            boxes: "1",
            sph: "Call Me/Email Me for Power",
          },
          right: {
            boxes: "1",
            sph: "Call Me/Email Me for Power",
          },
          powerType: "CONTACT_LENS",
        },
        sessionId: userInfo.sessionId,
        productId: productId?.toString(),
        quantity: "2",
      };
      reqObj.cartData.prescription = {
        left: {
          boxes: "1",
          sph: "Call Me/Email Me for Power",
        },
        right: {
          boxes: "1",
          sph: "Call Me/Email Me for Power",
        },
        powerType: "CONTACT_LENS",
      };
      // console.log(expandedTab, reqObj);
      //   dispatch(addToCartNoPower(tempNoPowerObj))
      dispatch(addToCartCLItems(tempNoPowerObj));
      //   dispatch(saveToCartCL(tempNoPowerObj));
      // Router.push("/cart");
      return;
    }
    dispatch(saveToCartCL(reqObj));
    setcartActive(true);
    // Router.push("/cart");
    // }
  };

  const onSignInClickFunction = () => {
    dispatch(updateOpenSignInModal(true));
  };

  useEffect(() => {
    if (showLogin) {
      onSignInClickFunction();
    }
    if (!authInfo.openSignInModal) {
      setShowLogin(false);
    }
  }, [showLogin, authInfo.openSignInModal]);

  //   window !== undefined && window?.origin ||
  const domainUrl = "www.lenskart.com";
  if (!productData?.productQuantity) return null;

  function linkHandler(
    link: string
  ): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return () => {
      window.open(
        `${window?.location?.origin}/${link}/`,
        "_blank",
        "noopener noreferrer"
      );
    };
  }

  return (
    <div>
      {!isPlano && (
        <>
          <SelectPowerText>{SELECT_POWER}</SelectPowerText>
          <PowerTabsWrapper>
            {configData?.POWER_DATA_LIST?.map(
              (
                powerData: {
                  title: string;
                  value: string;
                  showSection: boolean;
                },
                index: number
              ) =>
                (!!data?.length &&
                  powerData.title === "USE_SAVED_PRESCRIPTION") ||
                (powerData.showSection &&
                  powerData.title !== "USE_SAVED_PRESCRIPTION") ? (
                  <PowerTab key={index}>
                    <PowerTabHeader>
                      <PowerTabHeaderInput
                        checked={expandedTab === powerData.title}
                        id={`cl-power-${index}`}
                        name="cl-power"
                        type="radio"
                        onChange={(e) => {
                          changeExpandedTab(e, powerData.title);
                          setShowError(false);
                          setShowSubError(false);
                        }}
                      />
                      <PowerTabLabel htmlFor={`cl-power-${index}`}>
                        {powerData?.value}
                      </PowerTabLabel>
                    </PowerTabHeader>

                    {expandedTab === powerData.title &&
                      powerData.title !== "CALL_ME_LATER_FOR_EYEPOWER" && (
                        <PowerTabBody>
                          {/* // > enter prescription manually */}
                          {powerData.title ===
                            "ENTER_PRESCRIPTION_MANUALLY" && (
                            <EnterPowerManuallyWrapper>
                              <QuickLinksContainer>
                                <p>{CL_POWER_CAN_BE_DIFFERENT}</p>
                                {/* Only for countries,where quick links are required (for sg CL_QUICKLINKS it will come empty)  */}
                                {configData?.CL_QUICKLINKS &&
                                  configData?.CL_QUICKLINKS?.map(
                                    (items: {
                                      key: string;
                                      redirectionUrl: any;
                                      value: string;
                                    }) => {
                                      if (items.key === "divider") {
                                        return <Divider key={items.key} />;
                                      }
                                      return (
                                        <QuickLink
                                          key={items.key}
                                          className="cl-quicklinks"
                                          href={`//${domainUrl}/${items.redirectionUrl}`}
                                          rel="noopener noreferrer"
                                          target="_blank"
                                        >
                                          {items.value}
                                          <RotateArrow>
                                            <Icons.ArrowLeft
                                              stroke="rgba(0, 0, 0, 0.1)"
                                              height={20}
                                              width={20}
                                            />
                                          </RotateArrow>
                                        </QuickLink>
                                      );
                                    }
                                  )}
                              </QuickLinksContainer>
                              <CustomGrid
                                columns={3}
                                font={font}
                                variableSize={true}
                              >
                                <MainText />
                                <MainText font={font}>
                                  {"OS"} ({LEFT_EYE})
                                </MainText>
                                <MainText font={font}>
                                  {"OD"} ({RIGHT_EYE})
                                </MainText>
                                {powerTypeList?.map((pl, i) => (
                                  <Fragment key={i}>
                                    <MainText font={font}>
                                      {pl.type}
                                      {["boxes", "sph", "cyl", "axis"].includes(
                                        pl.type
                                      ) && (
                                        <OverlayTrigger
                                          delayHide={1000}
                                          overlay={
                                            <Tooltip
                                              id={pl.type}
                                              title={pl.type}
                                            >
                                              {pl.type === "boxes" && (
                                                <div>
                                                  {
                                                    localeData.SIX_LENS_PER_BOX_FOR_1_EYE
                                                  }
                                                  . {localeData.TO_LEARN_MORE},{" "}
                                                  <StyledButton
                                                    onClick={linkHandler(
                                                      "understanding_lens"
                                                    )}
                                                  >
                                                    {localeData.CLICK_HERE}.
                                                  </StyledButton>
                                                </div>
                                              )}
                                              {pl.type === "sph" && (
                                                <div>
                                                  {
                                                    localeData.THIS_IS_YOUR_MAIN_POWER
                                                  }
                                                  . {localeData.TO_LEARN_MORE}{" "}
                                                  <StyledButton
                                                    onClick={linkHandler(
                                                      "understand-your-prescription.html"
                                                    )}
                                                  >
                                                    {localeData.CLICK_HERE}.
                                                  </StyledButton>
                                                </div>
                                              )}
                                              {pl.type === "cyl" && (
                                                <div>
                                                  {
                                                    localeData.NOT_ALL_POWERS_HAVE_CYLINDER
                                                  }
                                                  . {localeData.TO_LEARN_MORE}{" "}
                                                  <StyledButton
                                                    onClick={linkHandler(
                                                      "understand-your-prescription.html"
                                                    )}
                                                  >
                                                    {localeData.CLICK_HERE}.
                                                  </StyledButton>
                                                </div>
                                              )}
                                              {pl.type === "axis" && (
                                                <div>
                                                  {
                                                    localeData.ONLY_IF_YOU_HAVE_CYL
                                                  }
                                                  . {localeData.TO_LEARN_MORE}{" "}
                                                  <StyledButton
                                                    onClick={linkHandler(
                                                      "understand-your-prescription.html"
                                                    )}
                                                  >
                                                    {localeData.CLICK_HERE}.
                                                  </StyledButton>
                                                </div>
                                              )}
                                            </Tooltip>
                                          }
                                          placement="top"
                                          trigger={["hover", "focus"]}
                                        >
                                          <ContactLensInfo>?</ContactLensInfo>
                                        </OverlayTrigger>
                                      )}
                                    </MainText>
                                    {pl.type === "boxes"
                                      ? [...Array(2)].map((und, i) => (
                                          <Fragment key={i}>
                                            <PlaceholderDropdown
                                              options={pl.powerDataList
                                                ?.reduce(
                                                  (acc, mydata) => [
                                                    ...acc,
                                                    ...mydata.value.map(
                                                      (val) => ({
                                                        key: `${val} Box`,
                                                        value: val,
                                                      })
                                                    ),
                                                  ],
                                                  [{ key: "", value: "" }]
                                                )
                                                .filter((dat) => dat.key)}
                                              componentSize={
                                                ComponentSizeENUM.medium
                                              }
                                              font={TypographyENUM.serif}
                                              handleChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                              ) =>
                                                updateData(
                                                  pl.type,
                                                  e.target.value,
                                                  i === 0
                                                )
                                              }
                                              value={
                                                i === 0
                                                  ? leftBox[pl.type]
                                                  : rightBox[pl.type]
                                              }
                                            />
                                          </Fragment>
                                        ))
                                      : [...Array(2)].map((und, i) => (
                                          <Fragment key={i}>
                                            <PlaceholderDropdown
                                              options={pl.powerDataList
                                                .reduce(
                                                  (acc, mydata) => [
                                                    ...acc,
                                                    ...mydata.value.map(
                                                      (val) => ({
                                                        key: val,
                                                        value: val,
                                                      })
                                                    ),
                                                  ],
                                                  [{ key: "", value: "" }]
                                                )
                                                .filter((dat) => dat.key)}
                                              componentSize={
                                                ComponentSizeENUM.medium
                                              }
                                              font={TypographyENUM.serif}
                                              placeholder={
                                                localeData.PLEASE_SELECT
                                              }
                                              handleChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                              ) =>
                                                updateData(
                                                  pl.type,
                                                  e.target.value,
                                                  i === 0
                                                )
                                              }
                                              disabled={
                                                (i === 0 &&
                                                  leftBox["boxes"] === "0") ||
                                                (i === 1 &&
                                                  rightBox["boxes"] === "0")
                                                  ? true
                                                  : false
                                              }
                                              value={
                                                i === 0
                                                  ? leftBox[pl.type]
                                                  : rightBox[pl.type]
                                              }
                                              // NOTE: Below condition means if powertype is equal to error type
                                              // and if error is in left box and this placeholder dropdown
                                              // is also a left box or vice versa then the error being passed
                                              // here is also true.
                                              hasError={
                                                (validationError[pl.type]
                                                  ?.left &&
                                                  i === 0) ||
                                                (validationError[pl.type]
                                                  ?.right &&
                                                  i === 1)
                                              }
                                            />
                                          </Fragment>
                                        ))}
                                  </Fragment>
                                ))}
                              </CustomGrid>
                              <ErrorWrapper>
                                {validationError.errorMessage}
                              </ErrorWrapper>
                            </EnterPowerManuallyWrapper>
                          )}

                          {/* // > saved prescriptions .... */}

                          {powerData.title === "USE_SAVED_PRESCRIPTION" && (
                            <SavedPrescTab>
                              {!userInfo.isLogin && (
                                <>
                                  {/* {showLogin && (
                                  <Auth.AuthModal isSignUp>
                                    {authTab === AuthTabENUM.SIGN_IN && (
                                      <Auth.SignInComponent
                                        signInStatus={signInStatus}
                                        redirectToHome={() => {
                                          router.push("/");
                                          resetSignInStatus();
                                        }}
                                        resetServerError={() =>
                                          dispatch(
                                            updateSignInStatusError({
                                              status: false,
                                              message: "",
                                            })
                                          )
                                        }
                                        forgotPassCallback={forgotPasswordHandler}
                                        dataLocale={localeData}
                                        resetSignInStatus={resetSignInStatus}
                                        onProceed={(
                                          fieldType: SignInType,
                                          value: string,
                                          password?: string
                                        ) =>
                                          verifySignInType(
                                            fieldType,
                                            value,
                                            password
                                          )
                                        }
                                        onSignIn={() => null}
                                        font={TypographyENUM.defaultBook}
                                        otpSent={signInStatus.otpSent}
                                        setCaptcha={(val: string | null) =>
                                          dispatch(updateCaptchaResponse(val))
                                        }
                                        id="sign-in-form"
                                        // isRTL={false}
                                        isRTL={pageInfo.isRTL}
                                        onClose={() => setShowLogin(false)}
                                        setRecaptchaInDom={setRecaptchaInDom}
                                        recaptchaInDom={recaptchaInDom}
                                        // guestCheckout={({
                                        //   email,
                                        //   number,
                                        // }: {
                                        //   email: string;
                                        //   number: string | null;
                                        // }) => console.log("not allowed")}
                                        moveToSignUp={moveToSignUp}
                                        countryCode={countryCode}
                                        signInImgLink={localeData.SIGNIN_IMG_LINK}
                                        loaderImageLink={
                                          localeData.LOADER_IMAGE_LINK
                                        }
                                        notShowOtp={notShowOtp}
                                        setGetWhatsAppUpdate={() =>
                                          dispatch(
                                            setWhatsappChecked(
                                              !userInfo.whatsAppChecked
                                            )
                                          )
                                        }
                                        renderCaptcha={renderCaptcha}
                                        isHome={
                                          window.location.pathname ===
                                          pageInfo.subdirectoryPath + "/"
                                            ? true
                                            : false
                                        }
                                        resetCaptcha={resetCaptcha}
                                        isCaptchaRequired={
                                          authInfo.signInStatus.isCaptchaRequired
                                        }
                                        isCaptchaVerified={
                                          authInfo.signInStatus.isCaptchaVerified
                                        }
                                        scriptLoaded={scriptLoaded}
                                        showHome={true}
                                        showWhatsAppOption={
                                          !configData.HIDE_WHATSAPP
                                        }
                                        phoneCodeConfigData={
                                          typeof configData?.AVAILABLE_NEIGHBOUR_COUNTRIES ===
                                          "string"
                                            ? JSON.parse(
                                                configData?.AVAILABLE_NEIGHBOUR_COUNTRIES
                                              )
                                            : configData?.AVAILABLE_NEIGHBOUR_COUNTRIES
                                        }
                                        supportMultipleCountries={
                                          configData?.SUPPORT_MULTIPLE_COUNTRIES
                                        }
                                        incCountryCodeFont
                                      />
                                    )}
                                    {authTab === AuthTabENUM.SIGN_UP && (
                                      <Auth.SignUpComponent
                                        id="sign-up-form"
                                        dataLocale={localeData}
                                        onClickCms={() =>
                                          router.push("/terms-conditions")
                                        }
                                        isRTL={pageInfo.isRTL}
                                        onClose={() => setShowLogin(false)}
                                        moveToSignIn={() =>
                                          setAuthTab(AuthTabENUM.SIGN_IN)
                                        }
                                        onSignUp={(
                                          email: string,
                                          firstName: string,
                                          lastName: string,
                                          mobile: string,
                                          password: string,
                                          phoneCode: string,
                                          referalCode?: string
                                        ) =>
                                          dispatch(
                                            registerUser({
                                              email,
                                              firstName,
                                              lastName,
                                              mobile,
                                              password,
                                              phoneCode,
                                              sessionId: sessionId,
                                              referalCode,
                                            })
                                          )
                                        }
                                        font={TypographyENUM.defaultBook}
                                        countryCode={countryCode}
                                        signUpStatus={signInStatus}
                                        setGetWhatsAppUpdate={() =>
                                          dispatch(
                                            setWhatsappChecked(
                                              !userInfo.whatsAppChecked
                                            )
                                          )
                                        }
                                        showWhatsAppOption={
                                          !configData.HIDE_WHATSAPP
                                        }
                                        phoneCodeConfigData={
                                          typeof configData?.AVAILABLE_NEIGHBOUR_COUNTRIES ===
                                          "string"
                                            ? JSON.parse(
                                                configData?.AVAILABLE_NEIGHBOUR_COUNTRIES
                                              )
                                            : configData?.AVAILABLE_NEIGHBOUR_COUNTRIES
                                        }
                                        configData={configData}
                                        incCountryCodeFont
                                      />
                                    )}
                                  </Auth.AuthModal>
                                )} */}
                                  <ContactLensSignIn>
                                    <ContactLensSignInText>
                                      {SIGN_IN_TO_VIEW_SAVE_POWERS}
                                    </ContactLensSignInText>
                                  </ContactLensSignIn>
                                  <ContactLensSignInButton
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowLogin(true);
                                      // onSignInClick()
                                    }}
                                  >
                                    {SIGN_IN}
                                  </ContactLensSignInButton>
                                </>
                              )}

                              {userInfo.isLogin && (
                                <NewCLSavedPrescription
                                  //   contactPrescription={contactPrescription}
                                  localeData={localeData}
                                  isJitProduct={isJitProduct}
                                  selectSavedPrescription={
                                    selectSavedPrescription
                                  }
                                  selectedSavedPrescription={
                                    selectedSavedPrescription
                                  }
                                  showSubError={showSubError}
                                  updateShowSubError={updateShowSubError}
                                />
                              )}
                            </SavedPrescTab>
                          )}
                        </PowerTabBody>
                      )}
                  </PowerTab>
                ) : null
            )}
          </PowerTabsWrapper>
          {customError && <ErrorField>{customError}</ErrorField>}
          {showError && !cartIsError && (
            <ErrorField>{localeData.POWER_FIELDS_MANDATORY}</ErrorField>
          )}
        </>
      )}
      {(powerTypeList?.length || isPlano) && (
        <PrimaryButton
          primaryText={localeData.BUY_NOW}
          font={TypographyENUM.serif}
          componentSize={ComponentSizeENUM.medium}
          onBtnClick={() => (isPlano ? addToCartZeroCl() : addToCart())}
          id="btn-primary-cl"
          width={"100%"}
          //   disabled={!parseInt(leftBox.boxes) && !parseInt(rightBox.boxes)}
          height="55px"
          theme={ThemeENUM.primary}
        />
      )}
    </div>
  );
};

export default NewCLSelectPower;
