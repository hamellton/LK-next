import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CheckoutMobile, BottomSheet, Auth } from "@lk/ui-library";
import { useDispatch, useSelector } from "react-redux";

import {
  applyRemoveGv,
  deleteCartItems,
  fetchCarts,
  updateCartItems,
} from "@/redux/slices/cartInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { getCurrency } from "helpers/utils";
import { APIService, RequestBody } from "@lk/utils";
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
import pageInfo from "@/redux/slices/pageInfo";
import { SignInType } from "@/types/state/authInfoType";
import { TypographyENUM } from "@/types/coreTypes";
import { getCookie, headerArr, setCookie } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { siteKey } from "pageStyles/constants";
import { useRouter } from "next/router";
import { DeviceTypes } from "@/types/baseTypes";
import { userFunctions } from "@lk/core-utils";
import { setWhatsappChecked } from "@/redux/slices/userInfo";

const LKCashAndGVWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-radius: var(--border-radius-xs);
`;

const LKCashAndCouponDivider = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
`;
export const Divider = styled.hr`
  width: 100%;
  margin: 0;
  border-bottom: 1px dashed var(--light-purple-10);
  border-top: none;
  border-right: none;
  border-left: none;
  overflow: hidden;
  height: 5px;
`;

const PromotionalDiscountsMobileNew = ({
  sessionId,
  localeData,
  applyWalletHandler,
  showProceedBtnHandler,
  gvCheckoutHandler,
  configData,
  orderData,
  isRetry,
}: any) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [xPosition, setXPosition] = useState(500);
  const [coupon, setCoupon] = useState("");
  const [errMsg, setErrorMsg] = useState("");
  const [bottomSheet, setBottomSheet] = useState(false);

  const [bestOffers, setBestOffers] = useState([]);
  const [bankOffers, setBankOffers] = useState([]);
  enum AuthTabENUM {
    SIGN_IN = "sign_in",
    SIGN_UP = "sign_up",
  }

  const dispatch = useDispatch<AppDispatch>();
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const { isRTL, country } = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [signUpBottomSheet, setSignUpBottomSheet] = useState(false);
  const signupCookies = getCookie("signupRedirectData");
  const [authTab, setAuthTab] = useState(AuthTabENUM.SIGN_IN);

  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );
  const [getWhatsAppUpdate, setGetWhatsAppUpdate] = useState(false);
  const [scriptLoaded, setscriptLoaded] = useState(false);
  const [recaptchaInDom, setRecaptchaInDom] = useState(false);
  const { deviceType } = useSelector((state: RootState) => state.pageInfo);

  const shouldRenderWhole =
    cartData.lkCash.totalWalletAmount ||
    cartData?.applicableGvs?.length > 0 ||
    configData?.APPLY_COUPON_ON;

  const shouldRenderLKCash = cartData.lkCash?.isApplicable;
  const authInfo = useSelector((state: RootState) => state.authInfo);

  const newCartOfferDesign = configData?.NEW_CART_OFFER_DESIGN || false;
  const { signInStatus, isSignIn } = authInfo;
  const router = useRouter();

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

  const applyGv = (code: string, flag: string) => {
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

  const handleApplyLKCash = () => {
    const cartObj = {
      sessionId: sessionId,
      params: "?applyWallet=true",
    };
    if (sessionId) dispatch(fetchCarts(cartObj));
  };

  const handleRemoveLKCash = () => {
    const cartObj = {
      sessionId: sessionId,
      params: "?applyWallet=false",
    };
    if (sessionId) dispatch(fetchCarts(cartObj));
  };

  const closebottomSheet = () => {
    // setshowAuthModal(false);
    setBottomSheet(false);
  };

  const resetSignInStatus = () => {
    console.log("REsetting sign in");
    // const [unmountSignInBottomSheet, setunmountSignInBottomSheet] = useState(false)
    dispatch(resetAuth());
  };

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

  const verifyCaptchaCallback = (response: string) => {
    // console.log("Captcha $$$$$$$$$$$$$$$$$$", "verify", "\n")
    if (response.length !== 0) {
      dispatch(updateIsCaptchaVerified(true));
      dispatch(updateCaptchaResponse(response));
    }
  };
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserNumber, setCurrentUserNumber] = useState("");

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

  const onCloseAuthModal = () => {
    setSignUpBottomSheet(false);
    setBottomSheet(false);
    dispatch(resetAuth());
  };

  const moveToSignUp = () => {
    dispatch(resetAuth());
    setAuthTab(AuthTabENUM.SIGN_UP);
  };

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

  if (shouldRenderWhole) {
    return (
      <>
        {shouldRenderLKCash ? (
          <LKCashAndGVWrapper>
            <CheckoutMobile.LKCashComponent
              primaryText={
                cartData?.cartTotal?.find(
                  (item: any) => item.id === "lkCashPlus"
                )
                  ? `LK Cash used`
                  : `LK Cash`
              }
              primaryOfferText={
                cartData?.cartTotal?.find(
                  (item: any) => item.id === "lkCashPlus"
                )
                  ? `Saving ${getCurrency(country)}${
                      cartData?.cartTotal?.find(
                        (item: any) => item.id === "lkCashPlus"
                      )?.amount
                    } on bill`
                  : `Save ${getCurrency(country)} ${
                      cartData?.lkCash?.applicableAmount
                    } on bill.`
              }
              lkCashApplied={cartData?.cartTotal?.find(
                (item: any) => item.id === "lkCashPlus"
              )}
              onApplyClick={handleApplyLKCash}
              onRemoveClick={handleRemoveLKCash}
            />
            <LKCashAndCouponDivider>
              <Divider />
              <div>OR</div>
              <Divider />
            </LKCashAndCouponDivider>
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
              mergedWithLKCash={true}
            />
          </LKCashAndGVWrapper>
        ) : (
          // * below component is apply coupon
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
        )}
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
                dispatch(
                  updateSignInStatusError({ status: false, message: "" })
                )
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
              moveToSignUp={moveToSignUp}
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
      </>
    );
  } else {
    return null;
  }
};

export default PromotionalDiscountsMobileNew;
