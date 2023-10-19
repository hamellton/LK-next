import { useEffect, useMemo, useRef, useState } from "react";
import { TypographyENUM } from "@/types/baseTypes";
import { getCmsLinks } from "@lk/ui-library";
import { getCookie } from "@/helpers/defaultHeaders";
import { CommonLoader } from "@lk/ui-library";
import NextHead from "next/head";
import { CheckoutWrapper } from "../../../pageStyles/Checkout.styles";
import { CheckoutType } from "../../../pageStyles/Checkout.types";
import { HeadingText, RightWrapper, StickyDiv } from "pageStyles/CartStyles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { NewPriceBreakup } from "@lk/ui-library";
import { useRouter } from "next/router";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import CheckoutBase from "containers/Checkout/Checkout.component";
import { Auth } from "@lk/ui-library";
import {
  registerUser,
  resetAuth,
  resetErrorMessage,
} from "@/redux/slices/auth";
import CMS from "containers/CMS/CMS.component";
import { Modal } from "@lk/ui-library";
import {
  ButtonContainer,
  Header,
} from "@/components/PDP/TechnicalInfo/TechnicalInfo.styles";
import { getCurrency } from "helpers/utils";
import {
  CloseButton,
  CMSWrapper,
} from "containers/ProductDetail/ProductDetail.styles";
import { AddressBody } from "../address/styles";

const CheckoutSignup = ({
  sessionId,
  localeData,
  configData,
}: // phoneCode
CheckoutType) => {
  const dispatch = useDispatch<AppDispatch>();
  const submitRef = useRef<HTMLFormElement>(null);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { BILL_DETAILS } = localeData;
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  const country = useSelector((state: RootState) => state.pageInfo.country);
  const authInfo = useSelector((state: RootState) => state.authInfo);
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const subdirectoryPath = useSelector(
    (state: RootState) => state.pageInfo.subdirectoryPath
  );
  const { signInStatus } = authInfo;
  const router = useRouter();
  const signupCookies = getCookie("signupRedirectData");

  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (userInfo.isLogin || userInfo.isGuestFlow)
      router.replace("/checkout/address");
    else if (signInStatus.isRedirectToSignup) {
      // dispatch(resetSignupRedirectLogic());
      //read from cookies and set in state
      timeout = setTimeout(() => {
        //delete cookies
        dispatch(resetAuth());
      }, 700);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [userInfo, router, signInStatus.isRedirectToSignup, dispatch]);

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
      text: "Shipping Address",
      onClick: () => null,
      disabled: !(
        (userInfo.isGuestFlow &&
          (userInfo.guestNumber || userInfo.guestEmail) &&
          !userInfo.isLogin) ||
        false
      ),
      id: "shipping_address",
    },
    {
      text: "Payment",
      onClick: () => null,
      disabled: true,
      id: "payment",
    },
    {
      text: "Summary",
      onClick: () => null,
      disabled: true,
      id: "summary",
    },
  ];
  const [fetchCMS, setfetchCMS] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const onClickCms = () => {
  //   setShowModal(true);
  //   setfetchCMS("https://www.lenskart.com/privacy-policy");
  // };

  const desktopContainer = useMemo(
    () => (
      <div style={{ minHeight: "100vh", backgroundColor: "#FBF9F7" }}>
        <NextHead>
          <title>Checkout signup</title>
        </NextHead>
        <CartHeader
          appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
          safeText={localeData.SAFE_SECURE}
        />
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          keyboard
          dialogClassName="tech-dialog"
          dialogCss={`
          width: 1000px;
          margin: auto;
          top: 50%;
          transform: translate(0%, -50%) !important;
        `}
        >
          <Modal.Body className="modal-body-height">
            <Header>
              <ButtonContainer>
                <CloseButton
                  onClick={() => {
                    setShowModal(false);
                    setfetchCMS("");
                  }}
                >
                  <div className="left"></div>
                  <div className="right"></div>
                </CloseButton>
              </ButtonContainer>
            </Header>
            {fetchCMS && (
              <CMSWrapper>
                <CMS cmsURL={fetchCMS} fetchData={true} />
              </CMSWrapper>
            )}
          </Modal.Body>
        </Modal>
        <AddressBody>
          <CheckoutWrapper>
            <CheckoutBase
              activeBreadcrumbId="account_verification"
              breadcrumbData={breadcrumbData}
              isRTL={pageInfo.isRTL}
            >
              <Auth.CheckoutSignUp
                id="sign-up-form"
                dataLocale={localeData}
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
                // privacyPolicyLink="https://www.lenskart.com/privacy-policy"
                moveToSignIn={() => router.replace("/checkout/signin")}
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
                isRTL={isRTL}
                countryCode={countryCode}
                signUpStatus={signInStatus}
                // onClickCms={onClickCms}
                onClickCms={() =>
                  window.open(
                    getCmsLinks(
                      pageInfo.country.toLowerCase(),
                      "PRIVACY_POLICY"
                    ),
                    "_blank"
                  )
                }
                showWhatsAppOption={!configData.HIDE_WHATSAPP}
                configData={configData}
                resetErrorMessage={() => dispatch(resetErrorMessage())}
                phoneCodeConfigData={
                  configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
                  JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
                }
                incCountryCodeFont
                deviceType={deviceType}
              />
            </CheckoutBase>
          </CheckoutWrapper>
          {cartData.cartItems && cartData.cartItems.length > 0 ? (
            <RightWrapper padding="60px 0">
              <StickyDiv>
                <HeadingText styledFont={TypographyENUM.lkSansRegular}>
                  {BILL_DETAILS}
                </HeadingText>
                <NewPriceBreakup
                  id="1"
                  width="100"
                  dataLocale={localeData}
                  priceData={cartData.cartTotal}
                  onShowCartBtnClick={() => {
                    router.push(`/cart`);
                  }}
                  currencyCode={getCurrency(country)}
                  showPolicy={pageInfo.country !== "sa"}
                  showCart={false}
                  subdirectoryPath={pageInfo.subdirectoryPath}
                  isRTL={isRTL}
                  policyLinks={
                    configData.POLICY_LINKS
                      ? JSON.parse(configData.POLICY_LINKS || "")
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
    ),
    [
      configData,
      countryCode,
      localeData,
      pageInfo.isRTL,
      router,
      sessionId,
      signInStatus,
      signupCookies,
      pageInfo.country,
      dispatch,
      breadcrumbData,
      country,
      deviceType,
      showModal,
      pageInfo.subdirectoryPath,
    ]
  );

  const mobileContainer = useMemo(
    () => (
      <>
        <Auth.CheckoutSignupMobile
          id="sign-up-form"
          dataLocale={localeData}
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
          // privacyPolicyLink="https://www.lenskart.com/privacy-policy"
          moveToSignIn={() => router.replace("/checkout/signin")}
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
          isRTL={pageInfo.isRTL}
          countryCode={countryCode}
          signUpStatus={signInStatus}
          // onClickCms={onClickCms}
          onClickCms={() =>
            router.push(
              getCmsLinks(pageInfo.country.toLowerCase(), "PRIVACY_POLICY")
            )
          }
          isMobileView={true}
          onClose={() => router.push("/cart")}
          showWhatsAppOption={!configData.HIDE_WHATSAPP}
          configData={configData}
          phoneCodeConfigData={
            configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
            JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES || "{}")
          }
          incCountryCodeFont
        />
      </>
    ),
    [
      configData,
      countryCode,
      localeData,
      pageInfo.isRTL,
      router,
      sessionId,
      signInStatus,
      signupCookies,
      pageInfo.country,
      dispatch,
    ]
  );

  return (
    <>
      {pageInfo?.deviceType === "desktop" && desktopContainer}
      {pageInfo?.deviceType === "mobilesite" && mobileContainer}
    </>
  );
};

export default CheckoutSignup;

// export const getServerSideProps: GetServerSideProps = async context => {
//     const { req, res } = context;
//     const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });
//     const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
//     const sessionId = `${getCookie(`clientV1_${country}`, { req, res })}`;
//     api.sessionToken = sessionId;
//     api.setHeaders(headerArr);
//     if (!isSessionAvailable) {
//       return {
//         notFound: true,
//       };
//     } else {
//     //   const { data: countryStateData } =
//     //     await checkoutFunctions.fetchCountryState(api);
//     //   const { data: addressData } = await checkoutFunctions.fetchAddress(api);
//       const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`).setHeaders(headerArr).setMethod(APIMethods.GET);
//       const { data: localeData } = await fireBaseFunctions.getConfig(LOCALE, configApi)
//       return {
//         props: {
//         //   addressData: addressData,
//         //   countryStateData: countryStateData,
//           sessionId: sessionId,
//           localeData: localeData
//         },
//       };
//     }
//   };
