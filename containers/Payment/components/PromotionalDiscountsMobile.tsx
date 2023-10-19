import { TypographyENUM } from "@/types/coreTypes";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { NewPayment } from "@lk/ui-library";
import { CollapsibleSidebar } from "@lk/ui-library";
import {
  ApplyButton,
  ApplyCouponInput,
  ManualApplyCoupon,
} from "pageStyles/CartStyles";
import { Coupon, Auth } from "@lk/ui-library";
import { userFunctions } from "@lk/core-utils";
import { Alert } from "@lk/ui-library";
import {
  AlertColorsENUM,
  ComponentSizeENUM,
  DeviceTypes,
} from "@/types/baseTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  applyRemoveGv,
  deleteCartItems,
  updateCartItems,
  updateCouponError,
} from "@/redux/slices/cartInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { CheckoutMobile, BottomSheet } from "@lk/ui-library";
import pageInfo from "@/redux/slices/pageInfo";
// import BottomSheet from "@/components/PrescriptionModalV2/BottomSheet";
import {
  getAccountInfo,
  registerUser,
  resetAuth,
  updateCaptchaResponse,
  updateIsCaptchaVerified,
  updateSignInStatusError,
  validateLoginPassword,
  validateOtpData,
} from "@/redux/slices/auth";
import { saveToWishlist } from "@/redux/slices/wishListInfo";
import { SignInType } from "@/types/state/authInfoType";
import {
  fetchUserDetails,
  setWhatsappChecked,
  updateGuestFlowLogin,
  whatsAppUpdate,
} from "@/redux/slices/userInfo";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import { appendScriptToDOM } from "containers/Base/helper";
import { APIService, RequestBody } from "@lk/utils";
import { APIMethods } from "@/types/apiTypes";
import { headerArr } from "helpers/defaultHeaders";
import { siteKey } from "pageStyles/constants";
import { useRouter } from "next/router";

const CardContainer = styled.div<{
  bankoffer?: boolean;
  dottedBtmBorder?: boolean;
  dottedTopBorder?: boolean;
  isOpen?: boolean;
}>`
  display: flex;
  align-items: ${(props) =>
    props.bankoffer || props.isOpen ? "flex-start" : "center"};
  justify-content: space-between;
  padding: 16px;
  flex-direction: ${(props) =>
    props.bankoffer || props.isOpen ? "column" : "row"};
  gap: 16px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  ${(props) =>
    props.dottedTopBorder
      ? `
      border-top: 1px dashed #d3d3d3;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `
      : ``}
  ${(props) =>
    props.dottedBtmBorder
      ? `
      border-bottom: 1px dashed #d3d3d3;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    `
      : ``}
    background: ${(props) => (props.isOpen ? "#F5F5FF" : "var(--white)")};
`;
const Flex = styled.div<{ justify?: boolean }>`
  display: flex;
  align-items: center;
  ${(props) =>
    props.justify &&
    `
    justify-content: space-between; 
    width: 100%;`}
`;
const RemoveButton = styled.button`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  text-decoration-line: underline;
  text-transform: capitalize;
  color: #000042;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;
const ORText = styled.div`
  position: absolute;
  left: 50%;
  transform: translateY(-50%);
  font-family: ${TypographyENUM.lkSansBold};
  opacity: 1;
  background: #fff;
  /* z-index: 1000; */
  padding: 0 10px;
  /* font-weight: 700; */
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #333368;
`;
const DiscountsContainer = styled.div`
  position: relative;
  margin-bottom: 3vh;
`;
// const LeftSection = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     justify-content: space-between;
// `;
const CardHeading = styled.h3<{ isMain?: boolean }>`
  font-family: ${(props) =>
    props.isMain ? TypographyENUM.lkSansBold : TypographyENUM.lkSansRegular};
  font-style: normal;
  font-size: 14px;
  display: block;
  letter-spacing: -0.02em;
  color: var(--text);
  flex: none;
  ${(props) =>
    props.isMain
      ? `
      line-height: 38px;
    `
      : `
    line-height: 20px;
    `}
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const CardInfoText = styled.p<{ isWallet?: boolean }>`
  font-family: ${(props) =>
    props.isWallet ? TypographyENUM.lkSansBold : TypographyENUM.lkSansRegular};
  font-style: normal;
  /* font-weight: ${(props) => (props.isWallet ? 700 : 400)}; */
  font-size: 12px;
  line-height: ${(props) => (props.isWallet ? "20px" : "18px")};
  letter-spacing: -0.02em;
  color: ${(props) => (props.isWallet ? "#489B1C" : "#66668E")};
`;
// const RightSection = styled.div`
//   display: flex;
// `;
// const RightSectionText = styled.span`
//   margin-right: 10px;
//   font-family: ${TypographyENUM.lkSansRegular};
//   font-style: normal;
//   font-size: 12px;
//   line-height: 18px;
//   letter-spacing: -0.02em;
//   color: #333368;
// `;
const UL = styled.ul`
  margin-left: 1em;
  margin-top: 4px;
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: #66668e;
  min-height: 32px;
`;
const Underline = styled.span`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  text-decoration-line: underline;
  color: #000042;
`;
const HeadContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  margin-left: 16px;
`;
const ErrorMessage = styled.div`
  color: red;
  margin: 0 3px;
  font-size: 0.8em;
  padding: 22px 0 8px 0;
`;
const PromotionalDiscounts = ({
  sessionId,
  localeData,
  applyWalletHandler,
  showProceedBtnHandler,
  gvCheckoutHandler,
  configData,
  orderData,
  isRetry,
}: any) => {
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  useEffect(() => {
    if (applyWalletHandler && typeof applyWalletHandler === "function")
      applyWalletHandler();
  }, [applyWalletHandler]);

  const dispatch = useDispatch<AppDispatch>();
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const [isLKCashApplied, setIsLKCashApplied] = useState(false);
  useEffect(() => {
    if (cartData.lkCash.moneySaved > 0) setIsLKCashApplied(true);
    else setIsLKCashApplied(false);
  }, [cartData?.lkCash?.moneySaved]);
  // const walletAmount = cartData.wallets
  //     ? cartData.wallets.reduce(
  //         (accumulator: any, currentValue: any) => accumulator + currentValue.applicableAmount,
  //         0
  //     )
  //     : 0;

  // const cartState = useSelector((state: RootState) => state.cartInfo.cartTotal);
  // console.log({ cartState });

  // useEffect(() => {
  //   cartState &&
  //     cartState.length !== 0 &&
  //     setIsCartEmpty(cartState.find((ct) => ct.type === "total")?.amount === 0);
  // }, [cartState]);

  // const isCartEmpty =
  //   useSelector((state: RootState) => state.cartInfo.cartTotal)?.find(
  //     (ct) => ct.type === "total"
  //   )?.amount === 0;

  const shouldRenderWhole =
    cartData.lkCash.totalWalletAmount ||
    cartData?.applicableGvs?.length > 0 ||
    configData?.APPLY_COUPON_ON;
  // || redisCommonData.APPLY_COUPON_ON);

  const shouldRenderLKCash = cartData.lkCash?.isApplicable;
  // walletAmount && cartData.wallets && cartData.wallets.length;

  const showOrLine =
    cartData.lkCash?.isApplicable &&
    cartData.lkCash?.totalWalletAmount &&
    cartData.lkCash?.applicableAmount !== 0 &&
    cartData.applicableGvs?.length !== 0;
  // cartData.wallets?.length &&
  //     cartData.wallets[0].type === 'lenskart' &&
  //     cartData.wallets[0].applicableAmount !== 0 &&
  //     cartData.applicableGvs?.length === 0;
  const showApplyCoupon =
    !isRetry &&
    !!(
      configData?.APPLY_COUPON_ON ||
      (cartData.applicableGvs && cartData.applicableGvs.length)
    );
  const { deviceType } = useSelector((state: RootState) => state.pageInfo);
  // console.log(showApplyCoupon, "showApplyCoupon")
  //  || redisCommonData.APPLY_COUPON_ON;

  /**
   * 1. onLKCashClick => call cart api with ?applyWallet=true
   * 2. onApplyCouponClick => show sidebar for applyCoupon
   */
  // const isLKCashApplied = false;
  const isCouponApplied = false;
  const disabledCoupon = false;
  const disabledLKCash = false;
  const onLKCashClick = () => {
    // console.log("LK cash selected");
    // if(isLKCashApplied) applyWalletHandler(false);
    // else applyWalletHandler(true);
    if (!isLKCashApplied) applyWalletHandler(true);
    // setIsLKCashApplied(true);
  };
  const onApplyCouponClick = () => {
    // console.log("Apply coupon selected");
  };
  const [showSidebar, setShowSidebar] = useState(false);
  const [xPosition, setXPosition] = useState(500);
  const [errMsg, setErrorMsg] = useState("");
  const [coupon, setCoupon] = useState("");
  const handleChange = (e: any) => {
    const event = e.target;
    setCoupon(event.value);
    setErrorMsg("");
    const re = /\}/g;
    if (re.test(event.value)) {
      setErrorMsg("Please enter a valid Coupon");
    }
  };
  const applyGv = (code: string, flag: string) => {
    // console.log(code, flag);

    if (flag === "apply") {
      toggleSideBar();
    }
    const reqObj: {
      code: string;
      sessionId: string;
      flag: string;
    } = {
      code: code,
      sessionId: sessionId,
      flag: flag,
    };
    dispatch(applyRemoveGv(reqObj));
  };
  const toggleSideBar = () => {
    setShowSidebar((showSidebar) => !showSidebar);
    if (xPosition === 500) {
      setXPosition(0);
      setCoupon("");
    } else {
      setXPosition(500);
      setCoupon("");
    }
    setErrorMsg("");
  };
  const {
    YOUR_SHOPPING_CART_IS_EMPTY,
    SORRY_NO_COUPON,
    CART,
    WISHLIST_TO_USE_LATER,
    MOVE_WISHLIST,
    LOGIN_TO_SEE_EXISTING,
    BILL_DETAILS,
    REMOVE_ITEM_FROM_CART,
    SAFE_SECURE,
    REMOVE,
    DUPLICATE,
  } = localeData;
  // useEffect(() => {
  //   if(isCartEmpty && (cartData.isGvApplied || isLKCashApplied)) {
  //     showProceedBtnHandler(true, gvCheckoutHandler);
  //   } else if(!isCartEmpty) {
  //     showProceedBtnHandler(false);
  //   }
  // }, [cartData.isGvApplied, isLKCashApplied, isCartEmpty, gvCheckoutHandler, showProceedBtnHandler]);
  useEffect(() => {
    if (cartData.couponError) {
      toggleSideBar();
      setErrorMsg("You have entered an invalid coupon code !");
      dispatch(updateCouponError({ error: false }));
    }
  }, [cartData.couponError]);

  useEffect(() => {
    if (cartData.couponError) {
      toggleSideBar();
      setErrorMsg("You have entered an invalid coupon code !");
      dispatch(updateCouponError({ error: false }));
    }
  }, [cartData.couponError]);

  const router = useRouter();
  const [getWhatsAppUpdate, setGetWhatsAppUpdate] = useState(false);
  const [scriptLoaded, setscriptLoaded] = useState(false);
  const [recaptchaInDom, setRecaptchaInDom] = useState(false);
  const [isOverlay, setIsOverlay] = useState(-1);
  // const [coupon, setCoupon] = useState("");
  const [bottomSheet, setBottomSheet] = useState(false);
  const [signUpBottomSheet, setSignUpBottomSheet] = useState(false);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  // console.log(pageInfo.isRTL, "pageInfo.isRTL");
  const authInfo = useSelector((state: RootState) => state.authInfo);
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );
  const { signInStatus, isSignIn } = authInfo;

  const signupCookies = getCookie("signupRedirectData");

  // useEffect(() => {
  //   if (userInfo?.sessionId) {
  //     dispatch(fetchUserDetails({ sessionId: userInfo.sessionId }));
  //   }
  // }, [dispatch, userInfo]);
  const verifyCaptchaCallback = (response: string) => {
    // console.log("Captcha $$$$$$$$$$$$$$$$$$", "verify", "\n")
    if (response.length !== 0) {
      dispatch(updateIsCaptchaVerified(true));
      dispatch(updateCaptchaResponse(response));
    }
  };
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserNumber, setCurrentUserNumber] = useState("");

  const newCartOfferDesign = configData?.NEW_CART_OFFER_DESIGN || false;
  const [bestOffers, setBestOffers] = useState([]);
  const [bankOffers, setBankOffers] = useState([]);

  useEffect(() => {
    if (!newCartOfferDesign || cartData?.applicableGvs?.length === 0) return;

    const [bestOffers, bankOffers] = cartData?.applicableGvs.reduce(
      ([a, b], currentGv) => {
        if (!currentGv.paymentOffer) a.push(currentGv);
        else b.push(currentGv);
        return [a, b];
      },
      [[], []]
    );
    setBestOffers(bestOffers);
    setBankOffers(bankOffers);
  }, [cartData]);

  const resetCaptcha = () => {
    // console.log("Captcha $$$$$$$$$$$$$$$$$$", "reset", "\n")
    if (recaptchaInDom) {
      window.grecaptcha?.reset();
      dispatch(updateIsCaptchaVerified(false));
      dispatch(updateCaptchaResponse(null));
    }
  };

  const renderCaptcha = () => {
    window?.grecaptcha?.render("recaptcha", {
      sitekey: siteKey,
      theme: "light",
      callback: verifyCaptchaCallback,
      "expired-callback": resetCaptcha,
    });
    console.clear();
    // console.log("Captcha $$$$$$$$$$$$$$$$$$", "rendered", "\n");
    dispatch(updateIsCaptchaVerified(false));
  };
  const loadThirdPartyScript = () => {
    appendScriptToDOM(
      "https://www.google.com/recaptcha/api.js?render=explicit",
      "",
      false,
      () => setscriptLoaded(true)
    );
    // console.log("Captcha $$$$$$$$$$$$$$$$$$", "script load", "\n")
  };
  useEffect(() => {
    if (getWhatsAppUpdate && userInfo.isLogin) {
      dispatch(
        whatsAppUpdate({
          sessionId: userInfo.sessionId || sessionId,
          optingValue: true,
        })
      );
    }
    if (!userInfo.isLogin) {
      loadThirdPartyScript();
    }
  }, [userInfo.isLogin, dispatch, getWhatsAppUpdate, userInfo.sessionId]);

  const resetSignInStatus = () => {
    console.log("REsetting sign in");
    // const [unmountSignInBottomSheet, setunmountSignInBottomSheet] = useState(false)
    dispatch(resetAuth());
  };
  const forgotPasswordHandler = async (email: string) => {
    // const api = createAPIInstance({
    //   sessionToken: sessionId,
    //   method: APIMethods.POST
    // });
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = userInfo.sessionId || sessionId;
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

  useEffect(() => {
    if (cartData?.couponError) {
      if (pageInfo.deviceType === DeviceTypes.DESKTOP) toggleSideBar();
      setErrorMsg("You have entered an invalid coupon code !");
      dispatch(updateCouponError({ error: false }));
    }
  }, [cartData?.couponError, toggleSideBar, pageInfo.deviceType, dispatch]);

  useEffect(() => {
    if (signInStatus.isRedirectToSignup) {
      const date = new Date();
      date.setTime(date.getTime() + 5 * 60 * 1000); // here cookie duration = 5 mins
      setCookie(
        "signupRedirectData",
        { email: currentUserEmail, number: currentUserNumber },
        { expires: date }
      );
      setSignUpBottomSheet(true);
    }
  }, [
    signInStatus.isRedirectToSignup,
    router,
    currentUserEmail,
    currentUserNumber,
    pageInfo.subdirectoryPath,
  ]);

  // const handleChange = (e: any) => {
  //   const event = e.target;
  //   setCoupon(event.value);
  //   setErrorMsg("");
  //   const re = /\}/g;
  //   if (re.test(event.value)) {
  //     setErrorMsg("Please enter a valid Coupon");
  //   }
  // };

  const verifySignInType = (
    type: SignInType,
    value: string,
    password?: string
  ) => {
    if (!password) {
      if (type === SignInType.PHONE) {
        setCurrentUserNumber(value);
        setCurrentUserEmail("");
      } else {
        setCurrentUserEmail(value);
        setCurrentUserNumber("");
      }
      dispatch(
        getAccountInfo({
          type: type,
          value: value,
          countryCode: countryCode,
          sessionId: userInfo.sessionId,
          captcha: authInfo.signInStatus.isCaptchaRequired
            ? authInfo.signInStatus.captchaResponse
            : null,
          localeData: localeData,
        })
      );
    } else {
      if (type === SignInType.PHONE) {
        setCurrentUserNumber(value);
        setCurrentUserEmail("");
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
        setCurrentUserEmail(value);
        setCurrentUserNumber("");
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

  const ErrorMessage = styled.div`
    color: red;
    margin: 0 3px;
    font-size: 0.8em;
    padding: 22px 0 8px 0;
  `;
  const buyWithCallConfig =
    configData &&
    configData?.BUY_ON_CALL_WIDGET &&
    JSON.parse(configData?.BUY_ON_CALL_WIDGET);
  const {
    eyeglasses: { tel },
    cta: { isShown /* whatsappIconGreen, iconGreen, text */ },
  } = buyWithCallConfig;

  const closebottomSheet = () => {
    // setshowAuthModal(false);
    setBottomSheet(false);
  };

  const closeSignUpbottomSheet = () => {
    setSignUpBottomSheet(false);
  };

  const pIds = cartData?.cartItems
    ? cartData?.cartItems?.map((item: { itemId: string }) => item?.itemId)
    : [];
  const whatsAppChatMsg =
    localeData.WHATSAPP_CHAT_URL &&
    (localeData.BUY_ON_CHAT_HELP_CTA_CART ||
      localeData.BUYONCHAT_HELP_CTA_CART) &&
    `${localeData.WHATSAPP_CHAT_URL}${
      localeData.BUY_ON_CHAT_HELP_CTA_CART || localeData.BUYONCHAT_HELP_CTA_CART
    }`
      .replace("<pageName>", "cart")
      .replace("<pid-no>", pIds.join(","));

  const ctaConfig =
    (typeof configData.CONFIG_CTA_MSITE === "string"
      ? JSON.parse(configData.CONFIG_CTA_MSITE).CHECKOUT
      : configData.CONFIG_CTA_MSITE?.CHECKOUT) || {};
  const { mainText } = ctaConfig;

  let mainTextFormat = mainText.toLowerCase().split(" ");
  for (let i = 0; i < mainTextFormat.length; i++) {
    mainTextFormat[i] =
      mainTextFormat[i][0].toUpperCase() + mainTextFormat[i].substr(1);
  }

  mainTextFormat = mainTextFormat.join(" ");

  const onCloseAuthModal = () => {
    setSignUpBottomSheet(false);
    setBottomSheet(false);
    dispatch(resetAuth());
  };
  console.log(
    "cartDat a    ifdjifos",
    !userInfo.isLogin && userInfo.isGuestFlow
  );

  return shouldRenderWhole ? (
    <>
      <BottomSheet
        show={bottomSheet}
        closebottomSheet={() => {
          closebottomSheet();
          resetSignInStatus();
        }}
        isRTL={pageInfo.isRTL}
      >
        {bottomSheet ? (
          <Auth.CheckoutSignIn
            signInStatus={signInStatus}
            dataLocale={localeData}
            isMobileCart
            onProceed={(
              fieldType: SignInType,
              value: string,
              password?: string
            ) => verifySignInType(fieldType, value, password)}
            onSignIn={() => closebottomSheet()}
            font={TypographyENUM.defaultBook}
            id="sign-in-form"
            isRTL={pageInfo.isRTL}
            onClose={() => resetSignInStatus()}
            resetServerError={() =>
              dispatch(updateSignInStatusError({ status: false, message: "" }))
            }
            // guestCheckout={({
            //   email,
            //   number,
            // }: {
            //   email: string;
            //   number: string | null;
            // }) => {
            //   dispatch(updateGuestFlowLogin({ email, number }));
            //   router.push("/checkout/address");
            // }}
            // moveToSignUp={() => router.push("/checkout/signup")}
            countryCode={countryCode}
            signInImgLink={localeData.SIGNIN_IMG_MSITE_LINK}
            resetSignInStatus={resetSignInStatus}
            setCaptcha={(val: any) => dispatch(updateCaptchaResponse(val))}
            otpSent={signInStatus.otpSent}
            loaderImageLink={localeData.LOADER_IMAGE_LINK}
            setGetWhatsAppUpdate={setGetWhatsAppUpdate}
            renderCaptcha={renderCaptcha}
            resetCaptcha={resetCaptcha}
            isCaptchaRequired={authInfo.signInStatus.isCaptchaRequired}
            isCaptchaVerified={authInfo.signInStatus.isCaptchaVerified}
            scriptLoaded={scriptLoaded}
            recaptchaInDom={recaptchaInDom}
            setRecaptchaInDom={setRecaptchaInDom}
            forgotPassCallback={forgotPasswordHandler}
            redirectToHome={() => {
              resetSignInStatus();
              router.push("/");
            }}
            resetCaptchaVerified={() =>
              dispatch(updateIsCaptchaVerified(false))
            }
            isMobile={true}
            // showHome={true}
            showWhatsAppOption={!configData.HIDE_WHATSAPP}
            showGuestFlow={false}
            isSignIn={isSignIn}
            msiteForgotPassword
            homeGuestFlow={false}
            negativeMargin
            phoneCodeConfigData={
              configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
              JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
            }
            supportMultipleCountries={configData?.SUPPORT_MULTIPLE_COUNTRIES}
            deviceType={deviceType}
            OtpTime={
              deviceType === DeviceTypes.MOBILE
                ? configData?.SIGN_IN_OTP_TIME?.msite
                : configData?.SIGN_IN_OTP_TIME?.desktop
            }
          />
        ) : null}
      </BottomSheet>
      <BottomSheet
        show={signUpBottomSheet}
        // closebottomSheet={() => {
        //   console.log("close button");
        //   closeSignUpbottomSheet();
        //   resetSignInStatus();
        // }}
        showCrossIcon={false}
        isRTL={pageInfo.isRTL}
      >
        {signUpBottomSheet ? (
          <Auth.CheckoutSignupMobile
            id="sign-up-form"
            dataLocale={localeData}
            onClickCms={() => router.push("/terms-conditions")}
            isRTL={pageInfo.isRTL}
            onClose={() => onCloseAuthModal()}
            moveToSignIn={() => {
              setBottomSheet(true);
              setSignUpBottomSheet(false);
            }}
            userEmail={
              typeof signupCookies === "string"
                ? JSON.parse(signupCookies)?.email
                : ""
            }
            userNumber={
              typeof signupCookies === "string"
                ? JSON.parse(signupCookies)?.number
                : ""
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
              dispatch(setWhatsappChecked(!userInfo.whatsAppChecked))
            }
            noMargin
            showWhatsAppOption={!configData.HIDE_WHATSAPP}
            isMobileView
            cartSignUp
            configData={configData}
            homeGuestFlow={false}
            phoneCodeConfigData={
              configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
              JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
            }
            incCountryCodeFont
          />
        ) : null}
      </BottomSheet>
      {(showApplyCoupon || shouldRenderLKCash || showApplyCoupon) && (
        <DiscountsContainer>
          {/* {shouldRenderLKCash && <div>LKCash</div>}
        {showOrLine && <div>------OR--------</div>}
        {showApplyCoupon && <div>Apply Coupon</div>} */}
          {/* {shouldRenderLKCash ? (
            <CheckoutMobile.LkCash
              isGuestUser={!!userInfo.isGuestFlow}
              showSignin={() => setBottomSheet(true)}
            />
          ) : 
          <CardContainer
            dottedBtmBorder={Boolean(showOrLine)}
            dottedTopBorder={false}
            isOpen={false}
          >
            <Flex justify>
              <Flex>
                <NewPayment.Radio
                  isSelected={isLKCashApplied}
                  onClick={disabledLKCash ? () => null : onLKCashClick}
                  disabled={disabledLKCash}
                />
                <NewPayment.CardImage src={data.img} alt="" isSelected={data.isChildrenVisible} />
                {false ? (
                  <CardHeading isMain>
                    LK Cash {isLKCashApplied ? "Applied" : ""}
                  </CardHeading>
                ) : (
                  <HeadContainer>
                    <CardHeading>
                      LK Cash {isLKCashApplied ? "Applied" : ""}
                    </CardHeading>
                    <CardInfoText isWallet={isLKCashApplied}>
                      {isLKCashApplied
                        ? `✓ Saving '₹${cartData.lkCash.moneySaved}' on bill`
                        : `Save ₹${cartData.lkCash.applicableAmount} on bill`}
                    </CardInfoText>
                  </HeadContainer>
                )}
              </Flex>
              {isLKCashApplied && (
                <RemoveButton onClick={() => applyWalletHandler(false)}>
                  Remove
                </RemoveButton>
              )}
            </Flex>
            {data.isChildrenVisible ? data.children : null}
          </CardContainer>
          null}
          {shouldRenderLKCash && showApplyCoupon ? <ORText>OR</ORText> : null} */}
          {showApplyCoupon ? (
            <CheckoutMobile.LkCash
              cartData={cartData}
              applyGv={applyGv}
              localeData={localeData}
              isRTL={isRTL}
              isGuestUser={!!userInfo.isGuestFlow}
              showSignin={() => setBottomSheet(true)}
              newCartOfferDesign={newCartOfferDesign}
              bestOffers={bestOffers}
              bankOffers={bankOffers}
            />
          ) : null}
        </DiscountsContainer>
      )}
    </>
  ) : null;
};

export default PromotionalDiscounts;
