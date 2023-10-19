//> Default
import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from "next/router";

//> Packages
import { Auth } from "@lk/ui-library";
import {
  deleteCookie,
  getCookie,
  hasCookie,
  setCookie,
} from "@/helpers/defaultHeaders";

//> Types
import { DeviceTypes, PageTypes, TypographyENUM } from "@/types/baseTypes";
import { SignInType } from "@/types/state/authInfoType";
import { BaseType } from "./Base.types";

//> Redux
import { AppDispatch, RootState } from "@/redux/store";
import {
  getAccountInfo,
  registerUser,
  resetAuth,
  searchBarStatus,
  updateCaptchaResponse,
  updateIsCaptchaVerified,
  updateOpenSignInModal,
  updateShowOtp,
  updateSignInStatusError,
  validateLoginPassword,
  validateOtpData,
} from "@/redux/slices/auth";
import { searchBarData } from "@/redux/slices/searchbar";
import {
  deleteAllWishlist,
  deleteOneWishlist,
  fetchWishlist,
  setWishListShow,
} from "@/redux/slices/wishListInfo";
//> Styles
import {
  AuthWrapper,
  BtnClose,
  DividerLine,
  ExchangeHead,
  ExchangeHeader,
  ExchangeIconContainer,
  ExchangeMainContainer,
  ExchangeText,
  HeaderWrapper,
} from "./Base.styles";
import {
  passUtmData,
  setWhatsappChecked,
  whatsAppUpdate,
} from "@/redux/slices/userInfo";
import {
  appendScriptToDOM,
  getCmsLinks,
  getUserEventData,
  hideSprinklrBot,
  reDirection,
} from "./helper";
// import { dataLocale } from "./footerData";
import {
  navigationBarGA,
  onSearchGA,
  onSearchIconClickGa,
  onSignIn,
  onSignUp,
  searchGA,
  tryOn3d,
  userProperties,
} from "helpers/userproperties";
import QrCodeScanner from "containers/QrCode/QrCodeScanner.component";
import { pidFromQrInfoSlice } from "@/redux/slices/pidQrInfo";
// import { isRTL } from "pageStyles/constants";
import { APIService, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { userFunctions } from "@lk/core-utils";
import { addToCartNoPower } from "@/redux/slices/cartInfo";
import { Header, Footer, HeaderNav } from "@lk/ui-library";

import { Wishlist, InfoPopMobile, Icons, TopBar } from "@lk/ui-library";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { logoutSprinklrBot, updateChatBotParams } from "helpers/chatbot";
import { ctaClickEvent } from "helpers/gaFour";
import {
  getTrendingSearch,
  updateSearchState,
} from "@/redux/slices/algoliaSearch";
import { ALGOLIA_RECENT_SEARCHES } from "@/constants/index";
import AlgoliaSearch from "@/components/AlgoliaSearch/AlgoliaSearchBox";

enum AuthTabENUM {
  SIGN_IN = "sign_in",
  SIGN_UP = "sign_up",
}

const siteKey = "6LcssXobAAAAABuHKTm_Fk6nevRwZUTGtHij1wS2";

const Base = ({
  children,
  // sessionId,
  headerData,
  isExchangeFlow,
  hideFooter,
  localeData,
  trendingMenus,
  sprinkularBotConfig,
  //footerDataMobile
  languageSwitchData,
  baseContainerStyles,
  configData,
  pageType,
}: BaseType) => {
  const router = useRouter();
  //> Redux State
  const dispatch = useDispatch<AppDispatch>();
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const wishListInfo = useSelector((state: RootState) => state.wishListInfo);
  const authInfo = useSelector((state: RootState) => state.authInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  const searchData = useSelector(
    (state: RootState) => state.searchBarData.data
  );

  const { signInStatus } = authInfo;
  const [loginMethhod, setLoginMethod] = useState("");
  //> Local State
  const [showFooter, setshowFooter] = useState(false);
  const [getWhatsAppUpdate, setGetWhatsAppUpdate] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = React.useState(AuthTabENUM.SIGN_IN);
  const [scriptLoaded, setscriptLoaded] = useState(false);
  const [recaptchaInDom, setRecaptchaInDom] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showAlgoliaSearch, setShowAlgoliaSearch] = useState(false);
  const enableAlgolia =
    configData?.ENABLE_ALGOLIA_CONFIG && deviceType == DeviceTypes.MOBILE;
  const [searchPanelHeight, setSearchPanelHeight] = useState("100vh");
  const setShowAlgoliaSearchState = (value: boolean) => {
    setShowAlgoliaSearch(value);
    setShowSideNav(false);
  };
  const handleResize = () => {
    setSearchPanelHeight(`${window.innerHeight}px`);
    const element: any = document.querySelector(".aa-PanelLayout");
    if (element) {
      // console.log(`hello ${window.innerHeight-50}px`);

      element.style.height = `${window.innerHeight - 65}px`;
    }
  };
  const [cta_flow_and_page, setCta_flow_and_page] = useState("");
  //> Check to show login modal or not
  useEffect(() => {
    if (authInfo.isSignIn) {
      setShowAuthModal(false);
    }
    if (!userInfo.userLoading && authInfo.isSignIn)
      onSignIn(loginMethhod, userInfo);
  }, [authInfo, userInfo.userLoading, loginMethhod, userInfo]);

  //> Show Login Modal Handler
  const onSignInClick = () => {
    setAuthTab(AuthTabENUM.SIGN_IN);
    setShowAuthModal(true);
    const eventName = "cta_click";
    const cta_name = "action-signin";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };

  const onSignUpClick = () => {
    setAuthTab(AuthTabENUM.SIGN_UP);
    setShowAuthModal(true);
    const eventName = "cta_click";
    const cta_name = "action-signup";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };

  useEffect(() => {
    //* hide sprinklr bot for mobilesite
    hideSprinklrBot(deviceType);
  }, []);

  useEffect(() => {
    if (
      userInfo?.isLogin &&
      userInfo?.mobileNumber &&
      userInfo?.email &&
      userInfo?.userDetails
    ) {
      //* update user's login creds
      const reqObj = {
        firstName: userInfo?.userDetails?.firstName || "",
        lastName: userInfo?.userDetails?.lastName || "",
        email: userInfo?.email || "",
        phoneNumber: userInfo?.mobileNumber?.toString() || "",
        countryCode: pageInfo?.countryCode,
        configData: configData,
      };
      updateChatBotParams(reqObj, deviceType || "desktop", configData);

      if (userInfo?.isLogin) {
        const userEventDataObj = getUserEventData("LOGGED_IN");

        dispatch(
          passUtmData({
            sessionId: getCookie(`clientV1_${pageInfo.country}`)?.toString(),
            eventObj: userEventDataObj,
          })
        );
      }
    }
  }, [userInfo?.isLogin]);

  useEffect(() => {
    if (authInfo.openSignInModal && !showAuthModal) {
      onSignInClick();
    } else {
      onSignInClickFunction();
    }
  }, [authInfo.openSignInModal, showAuthModal]);

  //> Close Login Modal Handler
  const onCloseAuthModal = () => {
    setShowAuthModal(false);
    dispatch(resetAuth());
  };

  useEffect(() => {
    if (router.asPath === "/") {
      setCta_flow_and_page("home-page");
    } else if (pageType === PageTypes.PLP) {
      setCta_flow_and_page("product-listing-page");
    } else if (pageType === PageTypes.PDP) {
      setCta_flow_and_page("product-detail-page");
    } else if (pageType === PageTypes.CMS) {
      setCta_flow_and_page("cms-page");
      const pageName = `${router.asPath.split("/").join("-")}-cms-page`;
      userProperties(userInfo, pageName, pageInfo, configData);
    } else if (router.asPath.includes("/customer/account/")) {
      setCta_flow_and_page("customer-account");
    } else {
      setCta_flow_and_page(router.asPath.split("/").join("-"));
    }
  }, [router.asPath, pageType]);

  //> Show Wishlist pop at the bottom of screen
  const onWishListClick = () => {
    window.fbq("trackCustom", "WishListClick", {});
    if (deviceType === DeviceTypes.MOBILE) {
      router.push("/shortlist");
    } else {
      dispatch(
        fetchWishlist({
          sessionId: userInfo.sessionId,
          subdirectoryPath: pageInfo.subdirectoryPath,
        })
      );
      dispatch(
        setWishListShow({ show: true, url: router.asPath, isRemoved: false })
      );
    }
    const eventName = "cta_click";
    const cta_name = "action-wishlist";
    // const cta_flow_and_page = "home-page";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };

  const onMobileClick = () => {
    const eventName = "cta_click";
    const cta_name = "call";
    // const cta_flow_and_page = "home-page";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };

  const onCartClick = () => {
    router.push(`/cart`);
    const eventName = "cta_click";
    const cta_name = "action-cart";
    // const cta_flow_and_page = "home-page";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };

  const onHideWishlist = () => {
    dispatch(setWishListShow({ show: false, url: router.asPath }));
  };

  //> Clear all items from wishlist popup
  const onClearWishList = () => {
    dispatch(
      deleteAllWishlist({
        sessionId: userInfo.sessionId,
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  };

  //> Delete single product from wishlist popup
  const onDeleteWishListItem = (id: number) => {
    dispatch(
      deleteOneWishlist({
        sessionId: userInfo.sessionId,
        productId: id,
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  };

  //> SignIn or SignUp handler
  const verifySignInType = (
    type: SignInType,
    value: string,
    password?: string,
    selectedCountryCode?: string
  ) => {
    if (!password) {
      dispatch(
        getAccountInfo({
          captcha: authInfo.signInStatus.isCaptchaRequired
            ? authInfo.signInStatus.captchaResponse
            : null,
          type: type,
          value: value,
          countryCode: selectedCountryCode ? selectedCountryCode : countryCode,
          sessionId: `${getCookie(
            `clientV1_${process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase()}`
          )}`,
          localeData: localeData,
        })
      );
    } else {
      if (type === SignInType.PHONE) {
        dispatch(
          validateOtpData({
            value: password,
            phoneCode: selectedCountryCode ? selectedCountryCode : countryCode,
            phoneNumber: value,
            sessionId: `${getCookie(
              `clientV1_${process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase()}`
            )}`,
            userInfo,
            pageInfo,
          })
        );
      } else {
        dispatch(
          validateLoginPassword({
            password: password,
            username: value,
            sessionId: `${getCookie(
              `clientV1_${process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase()}`
            )}`,
            userInfo,
            pageInfo,
          })
        );
      }
    }
  };

  const { email } = useSelector((state: RootState) => state.userInfo);

  const verifyCaptchaCallback = (response: string) => {
    if (response.length !== 0) {
      dispatch(updateIsCaptchaVerified(true));
      dispatch(updateCaptchaResponse(response));
    }
  };

  const resetCaptcha = () => {
    if (recaptchaInDom) {
      window?.grecaptcha?.reset();
      dispatch(updateIsCaptchaVerified(false));
      dispatch(updateCaptchaResponse(null));
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

  useEffect(() => {
    if (getWhatsAppUpdate && userInfo.isLogin) {
      dispatch(
        whatsAppUpdate({ sessionId: userInfo.sessionId, optingValue: true })
      );
    }
    if (!userInfo.isLogin && !userInfo.userLoading) {
      loadThirdPartyScript();
    }
  }, [
    userInfo.isLogin,
    dispatch,
    getWhatsAppUpdate,
    userInfo.sessionId,
    userInfo.userLoading,
  ]);

  //> Search Functionality Handler
  const searchFunction = (val: string) => {
    const obj = {
      sessionId: userInfo.sessionId,
      query: val,
      country: pageInfo.country || "",
    };
    sessionStorageHelper.setItem("searchQuery", val);

    dispatch(searchBarData(obj));
  };

  //> Logout user Handler
  const logoutHandler = () => {
    sessionStorageHelper.removeItem("isContactLensCheckboxChecked");
    deleteCookie(`clientV1_${pageInfo.country}`);
    // @TODO revisit logic
    deleteCookie("dittoGuestId");
    setCookie("isLogined", 0);
    setCookie("log_in_status", false);
    setCookie("isPresale", false);
    deleteCookie("presalesUN");
    deleteCookie("presalesUP");
    deleteCookie('hasPlacedOrder');
    window.location.href =
      !pageInfo.subdirectoryPath || pageInfo.subdirectoryPath === "NA"
        ? "/"
        : pageInfo.subdirectoryPath;

    //* logout sprinklr
    logoutSprinklrBot();
    localStorage.setItem(ALGOLIA_RECENT_SEARCHES, JSON.stringify([]));
    sessionStorageHelper.removeItem("hasPlacedOrder");
    sessionStorageHelper.removeItem("query");
  };

  const moveToSignUp = () => {
    setShowAuthModal(true);
    dispatch(resetAuth());
    setAuthTab(AuthTabENUM.SIGN_UP);
  };

  const notShowOtp = () => {
    dispatch(updateShowOtp(false));
  };

  const getQueryData = (text: any) => {
    onSearchGA(text);
    searchGA(
      "search",
      "VirtualPageView",
      userInfo,
      userInfo.sessionId,
      text,
      email,
      "SearchPage",
      pageInfo
    );
    window.location.href = `${window.location.origin}${pageInfo.subdirectoryPath}/search?q=${text}`;
  };
  const resetSignInStatus = () => {
    dispatch(resetAuth());
  };
  const forgotPasswordHandler = async (email: string) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = userInfo.sessionId;
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

  const onSearchIconClick = () => {
    if (enableAlgolia)
      dispatch(getTrendingSearch({ sessionId: userInfo.sessionId })).then(
        () => {
          setShowAlgoliaSearch(true);
        }
      );
    setShowSearch(true);
    setShowSideNav(false);
    onSearchIconClickGa(userInfo);
    const eventName = "cta_click";
    const cta_name = "action-search";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };
  const onLogoClick = () => {
    setShowSideNav(false);
  };
  const onNavMenuClick = () => {
    if (!showSideNav) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    window.fbq("trackCustom", " HamburgerMenu", {});

    setShowSideNav((prev) => !prev);
    setShowSearch(false);
    const eventName = "cta_click";
    const cta_name = "hamburger";
    const cta_flow_and_page = "hamburger-menu";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };
  const onQrClick = () => {
    dispatch(pidFromQrInfoSlice.actions.resetData(true));
    setShowQrCode(!showQrCode);
    setShowSearch(false);
  };

  const openChatSprinkular = () => {
    router.push(`/support`);
  };
  const [productType, setProductType] = useState(
    "Eyeglasses, Sunglasses and Contact Lenses"
  );
  const getProductType = () => {
    if (typeof window !== "undefined") {
      //here `window` is available
      let productType = "Eyeglasses, Sunglasses and Contact Lenses";
      if (window.location.pathname?.indexOf("sunglass") !== -1) {
        return (productType = "SUNGLASSES");
      } else if (window.location.pathname?.indexOf("eyeglass") !== -1) {
        return (productType = "EYEGLASSES");
      } else if (
        window.location.pathname?.indexOf("contact") !== -1 ||
        window.location.pathname?.indexOf("lens") !== -1
      ) {
        return (productType = "CONTACT_LENSES");
      }
    }
  };
  const goToLoginOrRegister = () => {
    dispatch(resetAuth());
    router.push("/customer/account/login");
    const eventName = "cta_click";
    const cta_name = "login";
    const cta_flow_and_page = "hamburger-menu";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };
  const getGoldMembershipHandler = () => {
    const reqObj = {
      sessionId: `${getCookie(`clientV1_${pageInfo.country}`)}`,
      tierName:
        configData?.GOLD_TIER &&
        JSON.parse(configData?.GOLD_TIER)?.defaultTierName,
    };
    dispatch(addToCartNoPower(reqObj));
    const eventName = "cta_click";
    const cta_name = "get_gold";
    const cta_flow_and_page = "hamburger-menu";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };

  const updateSearchBarStatus = (status: boolean) => {
    dispatch(searchBarStatus(status));
  };

  const onSignInClickFunction = () => {
    dispatch(updateOpenSignInModal(false));
  };

  const [item, setItem] = useState({ url: "", id: "", text: "" });

  useEffect(() => {
    if (item?.text !== "") {
      navigationBarGA(item?.text, userInfo, pageInfo);
    }
  }, [item]);

  const setGAEvent = () => {
    tryOn3d(userInfo, pageInfo);
  };

  const handleOnContactUsClick = () => {
    const sprinkularBotConfig =
      configData?.SPRINKLR_BOT_CONFIG &&
      JSON.parse(configData.SPRINKLR_BOT_CONFIG);
    const { isLogin = false, email = "", mobileNumber = "" } = userInfo || {};
    if (sprinkularBotConfig?.desktop_enabled === "ON") {
      if (isLogin && window && window.sprChat) {
        window.sprChat("openNewConversation", {
          conversationContext: {
            "_c_62a329b623cadb2fbf33b21f ": [email], // unique ID from contact us/chat with us, maybe phone number
            _c_62a32a2c23cadb2fbf33f020: ["TRUE"], // triggeredByChatwithUs
          },
          id: mobileNumber, // MANDATORY, maybe phone number
        });
      } else {
        window && window?.sprChat("open", {});
      }
    } else {
      const redirectUrl = configData?.NEED_HELP_REDIRECT_URL || "/cms-queries";
      window.location.href = `${pageInfo.subdirectoryPath}${redirectUrl}`;
    }
  };

  useEffect(() => {
    if (showAlgoliaSearch) {
      document.body.style.overflow = "hidden";
      handleResize();
      window.addEventListener("resize", handleResize, { passive: true });
    } else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleResize);
    };
  }, [showAlgoliaSearch]);

  useEffect(() => {
    const hasParentId = document.getElementById("next") !== null;
    return hasParentId ? setshowFooter(true) : setshowFooter(false);
  }, []);

  const hideFooterDataCategory = JSON.parse(
    configData?.HIDE_FOOTER_SPECIAL_CATEGORY || "[]"
  );
  useEffect(() => {
    if (
      hideFooterDataCategory.includes(router.asPath) &&
      deviceType === DeviceTypes.MOBILE
    ) {
      setshowFooter(false);
    } else {
      setshowFooter(true);
    }
  }, [deviceType, router, hideFooterDataCategory]);

  const [userInfoDataObj, setUserInfoDataObj] = useState({
    isSignedIn: userInfo.isLogin,
    username: userInfo?.userDetails?.firstName as string,
  });

  useEffect(() => {
    setUserInfoDataObj({
      isSignedIn: userInfo.isLogin,
      username: userInfo?.userDetails?.firstName as string,
    });
  }, [userInfo.isLogin, userInfo?.userDetails?.firstName]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <main id="next">
        {isExchangeFlow && deviceType === DeviceTypes.DESKTOP && (
          <>
            <ExchangeHeader>
              <ExchangeMainContainer>
                <ExchangeIconContainer
                  onClick={() => Router.back()}
                  deviceType={deviceType}
                >
                  <Icons.BackArrow />
                </ExchangeIconContainer>
                <div>
                  <ExchangeHead>{localeData.SELECT_FRAME}</ExchangeHead>
                  <ExchangeText>
                    {localeData.EXCHANGE_CHOOSE_FRAME}
                  </ExchangeText>
                </div>
              </ExchangeMainContainer>
              <ExchangeIconContainer onClick={() => Router.back()}>
                <Icons.Cross />
              </ExchangeIconContainer>
            </ExchangeHeader>
          </>
        )}
        {!router.asPath.includes("/recaptcha") && (
          <HeaderWrapper
            id="header-wrapper"
            deviceType={deviceType}
            isTopBarActive={configData?.isTopBarActive}
            topLinks={configData && configData.TOP_LINKS}
          >
            {enableAlgolia && showAlgoliaSearch ? (
              <AlgoliaSearch
                configData={configData}
                setShowAlgoliaSearchState={setShowAlgoliaSearchState}
                userInfo={userInfo}
              />
            ) : (
              <Header
                isLoading={false}
                updateSearchBarStatus={updateSearchBarStatus}
                id="header"
                isNewSearch={enableAlgolia}
                showSearch={showSearch}
                onSearchClick={onSearchIconClick}
                signedInData={userInfoDataObj}
                onCartClick={onCartClick}
                onSignInClick={onSignInClick}
                onLogoClick={onLogoClick}
                onTrackOrderClick={
                  userInfo.isLogin
                    ? () => {
                        window.location.href = `${pageInfo.subdirectoryPath}/customer/account/`;
                        const eventName = "cta_click";
                        const cta_name = "action-trackOrder";
                        // const cta_flow_and_page = "hamburger-menu";
                        ctaClickEvent(
                          eventName,
                          cta_name,
                          cta_flow_and_page,
                          userInfo,
                          pageInfo
                        );
                      }
                    : () => {
                        setShowAuthModal(true);
                        const eventName = "cta_click";
                        const cta_name = "action-trackOrder";
                        // const cta_flow_and_page = "hamburger-menu";
                        ctaClickEvent(
                          eventName,
                          cta_name,
                          cta_flow_and_page,
                          userInfo,
                          pageInfo
                        );
                      }
                }
                signInDropLinks={configData?.SIGN_IN_DROP_LINKS}
                lastRowData={headerData}
                onWishlistClick={onWishListClick}
                onMobileClick={onMobileClick}
                onSignUpClick={onSignUpClick}
                configData={configData}
                topLinks={
                  (configData && configData.TOP_LINKS) || {
                    left: [],
                    right: [],
                  }
                }
                phoneNumberImg={configData?.SUPPORT_NUMBER_IMG || ""}
                phoneNumber={localeData?.HELPLINE_NUMBER}
                searchBarPlaceholder={localeData.WHAT_ARE_YOU_LOOKING_FOR}
                cartCount={cartData.cartCount || 0}
                searchFunction={searchFunction}
                productData={searchData}
                logoutHandler={logoutHandler}
                getQueryData={getQueryData}
                wishlistCount={
                  userInfo.isLogin && wishListInfo.numberOfProducts
                    ? wishListInfo.numberOfProducts
                    : 0
                }
                showLanguageOption={languageSwitchData?.enable as boolean} // Show LanguageChange Option
                //   languageText="English" optional
                trendingMenus={trendingMenus}
                deviceType={deviceType as DeviceTypes}
                showSideNav={showSideNav}
                onQrClick={onQrClick}
                onMenuClick={onNavMenuClick}
                languageText={languageSwitchData?.text} //optional
                onLanguageChange={
                  languageSwitchData?.link
                    ? () => {
                        window.location.href = languageSwitchData.link;
                      }
                    : () => null
                }
                isRTL={pageInfo.isRTL}
                path={pageInfo.subdirectoryPath}
                isExchangeFlow={isExchangeFlow}
                exchangeFlowText={localeData.PRODUCT_DETAILS}
                onExchangeBackClick={() => Router.back()}
                subdirectoryPath={
                  pageInfo?.subdirectoryPath ? pageInfo.subdirectoryPath : ""
                }
                reDirection={reDirection}
                country={pageInfo.country}
                getGoldMembershipHandler={getGoldMembershipHandler}
                localeData={localeData}
                isTopBarActive={configData?.isTopBarActive}
                // setCurrentId={setCurrentId}
                setGAEvent={setGAEvent}
                setItem={setItem}
                onClickContactUs={handleOnContactUsClick}
                router={router}
                sessionStorageHelper={sessionStorageHelper}
              />
            )}
            <DividerLine id="divider" isExchangeFlow={isExchangeFlow} />
          </HeaderWrapper>
        )}
        {!isExchangeFlow && (
          <>
            {showAuthModal && (
              <Auth.AuthModal
                isSignUp={authTab === AuthTabENUM.SIGN_IN ? false : true}
              >
                {authTab === AuthTabENUM.SIGN_IN && (
                  <Auth.SignInComponent
                    signInStatus={signInStatus}
                    redirectToHome={() => {
                      router.push("/");
                      resetSignInStatus();
                    }}
                    resetServerError={() =>
                      dispatch(
                        updateSignInStatusError({ status: false, message: "" })
                      )
                    }
                    forgotPassCallback={forgotPasswordHandler}
                    dataLocale={localeData}
                    OtpTime={
                      deviceType === DeviceTypes.MOBILE
                        ? configData?.SIGN_IN_OTP_TIME?.msite
                        : configData?.SIGN_IN_OTP_TIME?.desktop
                    }
                    resetSignInStatus={resetSignInStatus}
                    onProceed={(
                      fieldType: SignInType,
                      value: string,
                      password?: string,
                      selectedCountryCode?: string
                    ) =>
                      verifySignInType(
                        fieldType,
                        value,
                        password,
                        selectedCountryCode
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
                    onClose={() => {
                      onCloseAuthModal();
                      resetSignInStatus();
                    }}
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
                    loaderImageLink={localeData.LOADER_IMAGE_LINK}
                    notShowOtp={notShowOtp}
                    setGetWhatsAppUpdate={() =>
                      dispatch(setWhatsappChecked(!userInfo.whatsAppChecked))
                    }
                    whatsAppChecked={userInfo.whatsAppChecked}
                    renderCaptcha={renderCaptcha}
                    isHome={
                      window.location.pathname ===
                      pageInfo.subdirectoryPath + "/"
                        ? true
                        : false
                    }
                    resetCaptcha={resetCaptcha}
                    isCaptchaRequired={authInfo.signInStatus.isCaptchaRequired}
                    isCaptchaVerified={authInfo.signInStatus.isCaptchaVerified}
                    scriptLoaded={scriptLoaded}
                    showHome={true}
                    showWhatsAppOption={!configData.HIDE_WHATSAPP}
                    phoneCodeConfigData={
                      configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
                      JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
                    }
                    supportMultipleCountries={
                      configData?.SUPPORT_MULTIPLE_COUNTRIES
                    }
                    incCountryCodeFont
                    deviceType={deviceType}
                  />
                )}
                {authTab === AuthTabENUM.SIGN_UP && (
                  <Auth.SignUpComponent
                    id="sign-up-form"
                    dataLocale={localeData}
                    onClickCms={() =>
                      window.open(
                        getCmsLinks(
                          (pageInfo?.country as string).toLowerCase(),
                          "PRIVACY_POLICY"
                        ),
                        "_blank"
                      )
                    }
                    isRTL={pageInfo.isRTL}
                    onClose={() => onCloseAuthModal()}
                    moveToSignIn={() => setAuthTab(AuthTabENUM.SIGN_IN)}
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
                          sessionId: userInfo.sessionId,
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
                    showWhatsAppOption={!configData.HIDE_WHATSAPP}
                    configData={configData}
                    phoneCodeConfigData={
                      configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
                      JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
                    }
                    incCountryCodeFont
                    deviceType={deviceType}
                    supportMultipleCountries={
                      configData?.SUPPORT_MULTIPLE_COUNTRIES
                    }
                  />
                )}
              </Auth.AuthModal>
            )}
          </>
        )}
        <div style={baseContainerStyles ? baseContainerStyles : {}}>
          {children}
        </div>
        {!hideFooter && (
          <Footer
            footerData={
              typeof configData?.FOOTER_DATA === "string"
                ? JSON.parse(configData?.FOOTER_DATA)?.desktop
                : configData?.FOOTER_DATA?.desktop
            }
            dataLocale={localeData}
            deviceType={deviceType as DeviceTypes}
            subdirectoryPath={pageInfo.subdirectoryPath}
            footerDataMobile={
              typeof configData.FOOTER_DATA === "string"
                ? JSON.parse(configData?.FOOTER_DATA)?.mobile
                : configData?.FOOTER_DATA?.mobile
            }
            openChatSprinkular={openChatSprinkular}
            isRTL={pageInfo.isRTL}
            country={pageInfo.country}
          />
        )}
        {showSideNav && showSideNav && (
          <HeaderNav
            id={1}
            isVisible={showSideNav}
            signedInData={{
              isSignedIn:
                userInfo.isLogin &&
                hasCookie("isLogined") &&
                getCookie("isLogined") === "1",
              username: userInfo?.userDetails?.firstName as string,
            }}
            userInfo={userInfo}
            configData={configData}
            logoutHandler={logoutHandler}
            goToLoginOrRegister={goToLoginOrRegister}
            dataLocale={localeData}
            isRTL={pageInfo.isRTL}
            navigationData={headerData?.navigationData}
            getGoldMembershipHandler={getGoldMembershipHandler}
            subdirectoryPath={pageInfo?.subdirectoryPath}
            gaCtaClick={(cta_name: string) => {
              const eventName = "cta_click";
              // const cta_name = "hamburger";
              const cta_flow_and_page = "hamburger-menu";
              ctaClickEvent(
                eventName,
                cta_name,
                cta_flow_and_page,
                userInfo,
                pageInfo
              );
            }}
          />
        )}
        {showQrCode && (
          <QrCodeScanner
            sessionId={userInfo.sessionId}
            showSearch={showSearch}
            onClose={onQrClick}
            localeData={localeData}
          />
        )}
      </main>
      {deviceType === DeviceTypes.DESKTOP ? (
        <Wishlist
          isLoading={wishListInfo.isLoading}
          show={
            wishListInfo.showWishList &&
            router.asPath.includes(wishListInfo.calledUrl)
          }
          // show={true}
          productList={wishListInfo.productList}
          dataLocale={localeData}
          setShow={() => onHideWishlist()}
          deleteProductFromWishlist={(id: any) => {
            onDeleteWishListItem(id);
          }}
          clearWishlist={onClearWishList}
          isRTL={pageInfo.isRTL}
          subdirectoryPath={pageInfo.subdirectoryPath}
        />
      ) : (
        <InfoPopMobile
          isOpen={!wishListInfo.isLoading && wishListInfo.showWishList}
          text={
            wishListInfo.isRemoved
              ? localeData.PRODUCT_SUCCESSFULY_REMOVED_FROM_SHORTLIST ||
                "Product successfully removed from shortlist"
              : localeData.PRODUCT_SUCCESSFULY_ADDED_TO_SHORTLIST ||
                "Product successfully added to shortlist"
          }
          closeHandler={onHideWishlist}
          time={1000}
        />
      )}
    </>
  );
};

export default Base;
