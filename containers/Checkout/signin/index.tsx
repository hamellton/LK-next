import { useEffect, useRef, useState } from "react";
import { APIMethods } from "@/types/apiTypes";
// import { Icons } from "@lk/ui-library";
import {
  TypographyENUM,
  ComponentSizeENUM,
  AlertColorsENUM,
  kindENUM,
  DeviceTypes,
} from "@/types/baseTypes";
import { APIService, RequestBody } from "@lk/utils";
import { deleteCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { CommonLoader, Alert } from "@lk/ui-library";
import NextHead from "next/head";
import { CheckoutWrapper } from "../../../pageStyles/Checkout.styles";
import { CheckoutType } from "../../../pageStyles/Checkout.types";
import {
  Flex,
  HeadingText,
  RightWrapper,
  StickyDiv,
} from "pageStyles/CartStyles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { NewPriceBreakup } from "@lk/ui-library";
import { fireBaseFunctions } from "@lk/core-utils";
import { LOCALE } from "@/constants/index";
import { fetchCarts } from "@/redux/slices/cartInfo";
import Router, { useRouter } from "next/router";
import { userProperties } from "helpers/userproperties";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import CheckoutBase from "containers/Checkout/Checkout.component";
import { Auth } from "@lk/ui-library";
import { SignInType } from "@/types/state/authInfoType";
import {
  getAccountInfo,
  resetAuth,
  resetSignupRedirectLogic,
  validateLoginPassword,
  validateOtpData,
  updateIsCaptchaVerified,
  updateCaptchaResponse,
  updateSignInStatusError,
} from "@/redux/slices/auth";
import { updateGuestFlowLogin } from "@/redux/slices/userInfo";
import { whatsAppUpdate } from "@/redux/slices/userInfo";
import { appendScriptToDOM } from "../../Base/helper";
import { createAPIInstance } from "helpers/apiHelper";
import { userFunctions } from "@lk/core-utils";
import { getCurrency } from "helpers/utils";
import { AddressBody } from "../address/styles";
import { LogOutButton, LoginInfo, LoginUser } from "../address";
import { logoutSprinklrBot } from "helpers/chatbot";
import sessionStorageHelper from "helpers/sessionStorageHelper";

const siteKey = "6LcssXobAAAAABuHKTm_Fk6nevRwZUTGtHij1wS2";

const CheckoutSignin = ({
  // addressData,
  // countryStateData,
  sessionId,
  phoneCode,
  localeData,
  configData,
}: CheckoutType) => {
  const [getWhatsAppUpdate, setGetWhatsAppUpdate] = useState(false);
  const [scriptLoaded, setscriptLoaded] = useState(false);
  const [recaptchaInDom, setRecaptchaInDom] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserNumber, setCurrentUserNumber] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const submitRef = useRef<HTMLFormElement>(null);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const { BILL_DETAILS } = localeData;
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );
  const authInfo = useSelector((state: RootState) => state.authInfo);
  const { signInStatus } = authInfo;
  const { deviceType } = useSelector((state: RootState) => state.pageInfo);
  // const [recaptchaInDom, setRecaptchaInDom] = useState(false);

  const [captchaRendered, setCaptchaRendered] = useState(false);
  // const [recaptchaInDom, setRecaptchaInDom] = useState(false);

  const pageInfos = useSelector((state: RootState) => state.pageInfo);

  // let pageName = "shipping-page";
  useEffect(() => {
    if (signInStatus.isError) {
      // dispatch(resetAuth());
    }
  }, [dispatch, signInStatus.isError]);
  // useEffect(() => {
  //   if (!userInfo.userLoading)
  //     userProperties(userInfo, pageName, pageInfo, localeData);
  // }, [userInfo.userLoading, pageInfo, localeData, pageName, userInfo]);

  useEffect(() => {
    if (userInfo.isLogin) {
      if (!!cartData.cartItems?.length) router.replace("/checkout/address");
      else router.replace("/cart");
    }
  }, [userInfo, router, pageInfo.subdirectoryPath, cartData]);

  useEffect(() => {
    if (signInStatus.isRedirectToSignup) {
      const date = new Date();
      date.setTime(date.getTime() + 5 * 60 * 1000); // here cookie duration = 5 mins
      setCookie(
        "signupRedirectData",
        { email: currentUserEmail, number: currentUserNumber },
        { expires: date }
      );
      router.replace(`/checkout/signup`);
    }
  }, [
    signInStatus.isRedirectToSignup,
    router,
    currentUserEmail,
    currentUserNumber,
    pageInfo.subdirectoryPath,
  ]);

  useEffect(() => {
    const cartObj: { sessionId: string } = {
      sessionId: sessionId,
    };
    if (sessionId) dispatch(fetchCarts(cartObj));
  }, [sessionId, dispatch]);

  const verifyCaptchaCallback = (response: string) => {
    // console.log("Captcha $$$$$$$$$$$$$$$$$$", "verify", "\n")
    if (response.length !== 0) {
      dispatch(updateIsCaptchaVerified(true));
      dispatch(updateCaptchaResponse(response));
    }
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
    window.grecaptcha.render("recaptcha", {
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
        whatsAppUpdate({ sessionId: userInfo.sessionId, optingValue: true })
      );
    }
    if (!userInfo.isLogin) {
      loadThirdPartyScript();
    }
  }, [userInfo.isLogin, dispatch, getWhatsAppUpdate, userInfo.sessionId]);

  const checkoutBreadcrumb =
    configData?.CHECKOUT_BREADCRUMB_TEXT &&
    JSON.parse(configData.CHECKOUT_BREADCRUMB_TEXT);

  const breadcrumbData = [
    {
      text: checkoutBreadcrumb?.LOGIN_SIGNUP,
      onClick: () => null,
      disabled: true,
      id: "account_verification",
    },
    {
      text: checkoutBreadcrumb?.SHIPPING_ADDRESS,
      onClick: () => router.push("/checkout/address"),
      disabled: !(
        (userInfo.isGuestFlow &&
          (userInfo.guestNumber || userInfo.guestEmail) &&
          !userInfo.isLogin) ||
        false
      ),
      id: "shipping_address",
    },
    {
      text: checkoutBreadcrumb?.PAYMENT,
      onClick: () => null,
      disabled: true,
      id: "payment",
    },
    {
      text: checkoutBreadcrumb?.SUMMARY,
      onClick: () => null,
      disabled: true,
      id: "summary",
    },
  ];
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
          sessionId: sessionId,
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
            sessionId: sessionId,
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
            sessionId: sessionId,
            userInfo,
            pageInfo,
          })
        );
      }
    }
  };
  const resetSignInStatus = () => {
    dispatch(resetAuth());
  };
  const forgotPasswordHandler = async (email: string) => {
    // const api = createAPIInstance({
    //   sessionToken: sessionId,
    //   method: APIMethods.POST
    // });
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

  const logoutHandler = () => {
    sessionStorageHelper.removeItem("isContactLensCheckboxChecked");
    deleteCookie(`clientV1_${pageInfo.country}`);
    setCookie("isLogined", 0);
    setCookie("log_in_status", false);
    deleteCookie("presalesUN");
    deleteCookie("presalesUP");
    setCookie("isPresale", false);
    window.location.href =
      !pageInfo.subdirectoryPath || pageInfo.subdirectoryPath === "NA"
        ? "/"
        : pageInfo.subdirectoryPath;

    //* logout sprinklr
    logoutSprinklrBot();
  };

  const desktopContainer = (
    <div style={{ minHeight: "100vh", backgroundColor: "#FBF9F7" }}>
      <NextHead>
        <title>Checkout signin</title>
      </NextHead>
      <CartHeader
        appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
        safeText={localeData.SAFE_SECURE}
      />
      <AddressBody>
        <CheckoutWrapper>
          {authInfo?.dualLoginStatus?.isLoggedIn && (
            <LoginInfo>
              <Alert
                color={AlertColorsENUM.blue}
                componentSize={ComponentSizeENUM.medium}
                font={TypographyENUM.lkSansRegular}
                id="Alert"
              >
                <Flex>
                  <span>
                    {"Logged in as"}{" "}
                    <LoginUser>
                      {authInfo?.dualLoginStatus?.data?.userName}
                    </LoginUser>
                  </span>
                  <LogOutButton onClick={logoutHandler}>Logout</LogOutButton>
                </Flex>
              </Alert>
            </LoginInfo>
          )}
          <CheckoutBase
            activeBreadcrumbId="account_verification"
            breadcrumbData={breadcrumbData}
            isRTL={pageInfo.isRTL}
          >
            {/* <Auth.CheckoutSignIn /> */}
            <Auth.CheckoutSignIn
              signInStatus={signInStatus}
              dataLocale={localeData}
              onProceed={(
                fieldType: SignInType,
                value: string,
                password?: string
              ) => verifySignInType(fieldType, value, password)}
              resetSignInStatus={resetSignInStatus}
              setCaptcha={(val: any) => dispatch(updateCaptchaResponse(val))}
              otpSent={signInStatus.otpSent}
              onSignIn={() => null}
              resetServerError={() =>
                dispatch(
                  updateSignInStatusError({ status: false, message: "" })
                )
              }
              font={TypographyENUM.defaultBook}
              id="sign-in-form"
              isRTL={pageInfo.isRTL}
              onClose={() => null}
              OtpTime={
                deviceType === DeviceTypes.MOBILE
                  ? configData?.SIGN_IN_OTP_TIME?.msite
                  : configData?.SIGN_IN_OTP_TIME?.desktop
              }
              guestCheckout={({
                email,
                number,
              }: {
                email: string;
                number: string | null;
              }) => {
                dispatch(updateGuestFlowLogin({ email, number }));
                console.log("121212");
                router.push("/checkout/address");
              }}
              moveToSignUp={() => null}
              countryCode={phoneCode || countryCode}
              signInImgLink={localeData.SIGNIN_IMG_LINK}
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
              showGuestFlow={configData?.SHOW_GUEST_CHECKOUT}
              showWhatsAppOption={!configData.HIDE_WHATSAPP}
              phoneCodeConfigData={
                configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
                JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
              }
              supportMultipleCountries={configData?.SUPPORT_MULTIPLE_COUNTRIES}
              incCountryCodeFont
              deviceType={deviceType}
            />
            {/* <Captcha> */}
            {/* <div id="recaptcha"></div> */}
            {/* </Captcha> */}
          </CheckoutBase>
        </CheckoutWrapper>
        {cartData.cartItems && cartData.cartItems.length > 0 ? (
          <RightWrapper padding="60px 0px">
            <StickyDiv>
              <HeadingText styledFont={TypographyENUM.serif}>
                {BILL_DETAILS}
              </HeadingText>
              <NewPriceBreakup
                id="1"
                width="100"
                dataLocale={localeData}
                priceData={cartData.cartTotal}
                onShowCartBtnClick={() => {
                  router.push("/cart");
                }}
                subdirectoryPath={pageInfo.subdirectoryPath}
                showPolicy={pageInfo.country !== "sa"}
                showCart={false}
                isRTL={pageInfo.isRTL}
                currencyCode={getCurrency(pageInfo.country)}
                policyLinks={
                  configData.POLICY_LINKS
                    ? JSON.parse(configData.POLICY_LINKS)
                    : null
                }
                enableTax={configData?.ENABLE_TAX}
              />
              {/* <Button
                  id="button"
                  showChildren={true}
                  width="100%"
                  font={TypographyENUM.lkSansBold}
                  onClick={(e: any)=> submitRef?.current && submitRef?.current.click()}
                >
                    <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                      Save & Proceed <Icons.IconRight />
                    </ButtonContent>
                </Button> */}
            </StickyDiv>
          </RightWrapper>
        ) : (
          <div style={{ padding: "90px 50px" }}>
            <CommonLoader />
          </div>
        )}
      </AddressBody>
    </div>
  );

  const mobileContainer = (
    <>
      <Auth.CheckoutSignInMobile
        signInStatus={signInStatus}
        dataLocale={localeData}
        onProceed={(fieldType: SignInType, value: string, password?: string) =>
          verifySignInType(fieldType, value, password)
        }
        resetSignInStatus={resetSignInStatus}
        setCaptcha={(val: any) => dispatch(updateCaptchaResponse(val))}
        otpSent={signInStatus.otpSent}
        onSignIn={() => null}
        font={TypographyENUM.defaultBook}
        id="sign-in-form"
        isRTL={pageInfo.isRTL}
        resetServerError={() =>
          dispatch(updateSignInStatusError({ status: false, message: "" }))
        }
        guestCheckout={({
          email,
          number,
        }: {
          email: string;
          number: string | null;
        }) => {
          dispatch(updateGuestFlowLogin({ email, number }));
          console.log("131313");
          router.push("/checkout/address");
        }}
        moveToSignUp={() => router.replace("/checkout/signup")}
        countryCode={phoneCode || "+91"}
        signInImgLink={localeData.SIGNIN_IMG_MSITE_LINK}
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
        resetCaptchaVerified={() => dispatch(updateIsCaptchaVerified(false))}
        isMobileView={true}
        showHome={true}
        onClose={() => {
          router.push("/cart");
          resetSignInStatus();
        }}
        // isHome={false}
        showWhatsAppOption={!configData.HIDE_WHATSAPP}
        phoneCodeConfigData={
          configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
          JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
        }
        supportMultipleCountries={configData?.SUPPORT_MULTIPLE_COUNTRIES}
        incCountryCodeFont
      />
    </>
  );
  return pageInfos?.deviceType === DeviceTypes.DESKTOP
    ? desktopContainer
    : mobileContainer;
};

export default CheckoutSignin;

// export const getServerSideProps: GetServerSideProps = async context => {
//   const { req, res } = context;
//   const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });
//   const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
//   const sessionId = `${getCookie(`clientV1_${country}`, { req, res })}`;
//   api.sessionToken = sessionId;
//   api.setHeaders(headerArr);
//   if (!isSessionAvailable) {
//     return {
//       notFound: true,
//     };
//   } else {
//     // const { data: countryStateData } =
//     //   await checkoutFunctions.fetchCountryState(api);
//     // const { data: addressData } = await checkoutFunctions.fetchAddress(api);
//     const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`).setHeaders(headerArr).setMethod(APIMethods.GET);
//     const { data: localeData } = await fireBaseFunctions.getConfig(LOCALE, configApi)
//     return {
//       props: {
//         // addressData: addressData,
//         // countryStateData: countryStateData,
//         sessionId: sessionId,
//         localeData: localeData
//       },
//     };
//   }
// };
