//> Default Imports
import { GetServerSideProps } from "next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  PDP as PDPComponents,
  BottomSheet,
  PopUpText,
  GoldMembershipNew,
  Footer,
  getCmsLinks,
} from "@lk/ui-library";
import { CartWishlist } from "@lk/ui-library";
import usePrevious from "hooks/usePrevious";
const siteKey = "6LcssXobAAAAABuHKTm_Fk6nevRwZUTGtHij1wS2";
import NextHead from "next/head";
//> Redux
import {
  addToCartNoPower,
  applyRemoveGv,
  deleteCartItems,
  fetchCarts,
  updateCartItems,
  updateCartPopupError,
  updateCouponError,
} from "@/redux/slices/cartInfo";
import {
  deleteAllWishlist,
  deleteOneWishlist,
  fetchWishlist,
  saveToWishlist,
  setWishListShow,
} from "@/redux/slices/wishListInfo";
import { AppDispatch, RootState } from "@/redux/store";

//> Types
import {
  TypographyENUM,
  ComponentSizeENUM,
  AlertColorsENUM,
  ThemeENUM,
  kindENUM,
  DeviceTypes,
} from "@/types/baseTypes";
import { APIMethods } from "@/types/apiTypes";

//> Packages
import {
  Button,
  CartCard,
  Alert,
  Icons,
  NewPriceBreakup,
  Offers,
  ApplyCoupon,
  CollapsibleSidebar,
  // ApplyCouponBar,
  Coupon,
  Auth,
  MoneyModal,
  Wishlist,
  ContactLensConsentCheckbox,
} from "@lk/ui-library";
import {
  cartFunctions,
  fireBaseFunctions,
  sessionFunctions,
  userFunctions,
} from "@lk/core-utils";
import { APIService, extractUtmParams, RequestBody } from "@lk/utils";

//> Styles
import {
  CartWrapper,
  LeftWrapper,
  RightWrapper,
  CartCardWrapper,
  HeadingText,
  ButtonContent,
  TextButton,
  Flex,
  StickyDiv,
  Overlay,
  OverlayText,
  OverlayContent,
  CrossWrapper,
  Text,
  ButtonWrapper,
  ApplyButton,
  ApplyCouponInput,
  ManualApplyCoupon,
  MainSection,
  ButtonPosition,
  Icon,
  WhiteBG,
} from "../../pageStyles/CartStyles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//> Helpers
import { gaBannerImgObserver, hasContactLensItems } from "helpers/utils";
import { headerArr } from "helpers/defaultHeaders";
import {
  CONFIG,
  COOKIE_NAME,
  LAST_PAGE_VISIT_NAME,
  LOCALE,
} from "../../constants";
import { findGvAmount, findGvCode } from "../../pageStyles/CartHelper";
import CartHeader from "../../pageStyles/CartHeader/CartHeader";
import { getCurrency, removeDomainName } from "helpers/utils";
import {
  addToCartGA,
  removeFromCartGA,
  userProperties,
} from "helpers/userproperties";
import {
  viewCartGA4,
  beginCheckoutGA4,
  addToCartGA4,
  bannerGA4,
  removeFromCartGA4,
} from "helpers/gaFour";
import {
  abandonedLeads,
  fetchUserDetails,
  setWhatsappChecked,
  updateGuestFlowLogin,
  whatsAppUpdate,
} from "@/redux/slices/userInfo";
import { DataType } from "@/types/coreTypes";
import Shortlist from "../../containers/Cart/Shortlist";
import { CommonLoader } from "@lk/ui-library";
import ErrorCart from "containers/Cart/ErrorCart";
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
import { SignInType } from "@/types/state/authInfoType";
import styled from "styled-components";
import useDimensions from "hooks/useDimensions";
import { CartProduct } from "@lk/ui-library";
import MobileCartHeader from "containers/Cart/MobileCartHeader";
import MobileCardBox from "containers/Cart/MobileCardBox";
import CLOffer from "containers/Cart/CLOffer";
import { ApplyCouponBar } from "@lk/ui-library";
import FloatingCta from "containers/Cart/FloatingCta";
import CartItemsBar from "containers/Cart/CartItemsBar";
import { MobileEmptyCart, CheckoutMobile } from "@lk/ui-library";
import { ServiceList } from "@lk/ui-library";
import { updateIsRTL } from "@/redux/slices/pageInfo";
import {
  appendScriptToDOM,
  hideSprinklrBot,
  reDirection,
} from "containers/Base/helper";
import { CheckoutSignInWrapper } from "pageStyles/styles";
import { AddressBody, PageContainer } from "containers/Checkout/address/styles";
import LenskartPromise from "@/components/PDP/Mobile/ProductDelivery/LenskartPromise";
import { triggerFBQEvent } from "helpers/FbqHelper";
import { checkoutVirtualPageView } from "helpers/virtualPageView";
import { createAPIInstance } from "@/helpers/apiHelper";

export interface CartDataType {
  sessionId: string;
  localeData: DataType;
  userData: DataType;
  configData: DataType;
}

const ErrorMessage = styled.div`
  color: red;
  margin: 0 3px;
  font-size: 0.8em;
  padding: 22px 0 8px 0;
`;

enum AuthTabENUM {
  SIGN_IN = "sign_in",
  SIGN_UP = "sign_up",
}
const Cart = ({
  sessionId,
  localeData,
  userData,
  configData,
}: CartDataType) => {
  const config = {
    PROCEED_TO_CHECKOUT: localeData.PROCEED_TO_CHECKOUT
      ? localeData.PROCEED_TO_CHECKOUT
      : "Proceed to Checkout",
    CHECK_AVAILABLE_OFFERS: localeData.CHECK_AVAILABLE_OFFERS
      ? localeData.CHECK_AVAILABLE_OFFERS
      : "Check available offers",
    YOU_ARE_SAVING: localeData.YOU_ARE_SAVING
      ? localeData.YOU_ARE_SAVING
      : "You are saving",
  };

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [getWhatsAppUpdate, setGetWhatsAppUpdate] = useState(false);
  const [scriptLoaded, setscriptLoaded] = useState(false);
  const [recaptchaInDom, setRecaptchaInDom] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | number>("");

  const [isHomeGuestFlow, setIsHomeGuestFlow] = useState(false);
  // const [xPosition, setXPosition] = useState(500);
  const { country, deviceType } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const [xPosition, setXPosition] = useState(0);
  const [isOverlay, setIsOverlay] = useState(-1);
  const [showShotlist, setShowShortList] = useState(true);
  const [showAuthModal, setshowAuthModal] = useState(false);
  // const [coupon, setCoupon] = useState("");
  const [errMsg, setErrorMsg] = useState("");
  const [msgDrop, setMsgDrop] = useState(false);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [signUpBottomSheet, setSignUpBottomSheet] = useState(false);
  const [authTab, setAuthTab] = useState(AuthTabENUM.SIGN_IN);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const authInfo = useSelector((state: RootState) => state.authInfo);
  const wishListInfo = useSelector((state: RootState) => state.wishListInfo);
  const [msgDropText, setMsgDropText] = useState("");
  const [cartsFetched, setCartsFetched] = useState(false);
  const { cartPopupError, cartErrorMessage } = useSelector(
    (state: RootState) => state.cartInfo
  );
  const prevCartData = usePrevious(cartData);
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );
  const cartRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions({
    element: cartRef.current,
    conversionFn: () => {},
  });

  const { signInStatus, isSignIn, signUpStatus } = authInfo;

  const newCartOfferDesign = configData?.NEW_CART_OFFER_DESIGN || false;
  const [bestOffers, setBestOffers] = useState([]);
  const [bankOffers, setBankOffers] = useState([]);
  const [fireViewCartGA, setFireViewCartGA] = useState(false);
  const [fireViewCartGAReload, setFireViewCartGAReload] = useState(0);

  useEffect(() => {
    //* hide sprinklr bot for mobilesite
    hideSprinklrBot(deviceType);
  }, []);

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

  const {
    errorMessage: wishListErrorMessage,
    productIds,
    productList,
  } = useSelector((state: RootState) => state.wishListInfo);
  const couponCode = cartData?.appliedGv.code || "";
  const couponAmount = cartData?.appliedGv.amount;
  let pageName = "cart-page";

  const signupCookies = getCookie("signupRedirectData");

  useEffect(() => {
    localStorage.setItem(LAST_PAGE_VISIT_NAME, pageName);
  }, []);
  useEffect(() => {
    if (userData?.id && userData?.isLoggedIn) {
      dispatch(fetchUserDetails({ sessionId: userData.id }));
    }
  }, [dispatch, userData]);
  const verifyCaptchaCallback = (response: string) => {
    // console.log("Captcha $$$$$$$$$$$$$$$$$$", "verify", "\n")
    if (response.length !== 0) {
      dispatch(updateIsCaptchaVerified(true));
      dispatch(updateCaptchaResponse(response));
    }
  };
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserNumber, setCurrentUserNumber] = useState("");
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
          sessionId: getCookie(COOKIE_NAME),
          optingValue: true,
        })
      );
    }
    if (!userInfo.isLogin) {
      loadThirdPartyScript();
    }
  }, [userInfo.isLogin, dispatch, getWhatsAppUpdate, userInfo.sessionId]);

  const resetSignInStatus = () => {
    // console.log("REsetting sign in");
    // const [unmountSignInBottomSheet, setunmountSignInBottomSheet] = useState(false)
    dispatch(resetAuth());
  };
  const forgotPasswordHandler = async (email: string) => {
    // const api = createAPIInstance({
    //   sessionToken: sessionId,
    //   method: APIMethods.POST
    // });
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = getCookie(COOKIE_NAME);
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
    if (fireViewCartGA) viewCartGA4(cartData, userInfo.isLogin, pageInfo);
  }, [fireViewCartGA]);

  useEffect(() => {
    // viewCartGA4(cartData, userInfo.isLogin);
    if (
      cartData?.cartItems &&
      cartData?.cartItems?.length !== 0 &&
      cartData?.currencyCode &&
      cartData?.cartTotal &&
      Array.isArray(cartData?.cartTotal) &&
      cartData?.cartTotal?.length !== 0
    )
      setTimeout(() => {
        setFireViewCartGA(true);
      }, 0);
  }, [cartData]);

  useEffect(() => {
    dispatch(
      updateIsRTL(process.env.NEXT_PUBLIC_DIRECTION === "RTL" ? true : false)
    );
  }, []);

  useEffect(() => {
    setXPosition(pageInfo.isRTL ? -500 : 500);
  }, [pageInfo]);

  useEffect(() => {
    const cartObj: { sessionId: string; subdirectoryPath: string } = {
      sessionId: getCookie(COOKIE_NAME),
      subdirectoryPath: pageInfo.subdirectoryPath,
    };
    dispatch(fetchCarts(cartObj));
    if (userInfo?.isLogin) {
      setBottomSheet(false);
      setSignUpBottomSheet(false);
    }
    dispatch(fetchWishlist(cartObj));
  }, [dispatch, sessionId, userInfo.isLogin]);

  const moveToSignUp = () => {
    dispatch(resetAuth());
    setAuthTab(AuthTabENUM.SIGN_UP);
  };

  useEffect(() => {
    if (cartData?.isGvApplied) {
      setShowMoneyModal(true);
    }
  }, [cartData?.isGvApplied]);

  useEffect(() => {
    if (!userInfo?.userLoading) {
      userProperties(userInfo, pageName, pageInfo, localeData);
    }
    gaBannerImgObserver("0px", window, userInfo, pageInfo);
  }, []);

  const onHideWishlist = () => {
    dispatch(setWishListShow({ show: false, url: router.asPath }));
  };
  const onDeleteWishListItem = (id: number) => {
    dispatch(
      deleteOneWishlist({
        sessionId: getCookie(COOKIE_NAME),
        productId: id,
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  };
  //> Clear all items from wishlist popup
  const onClearWishList = () => {
    dispatch(
      deleteAllWishlist({
        sessionId: getCookie(COOKIE_NAME),
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  };
  const toggleSideBar = useCallback(() => {
    // if (xPosition === 500) {
    //   setXPosition(0);
    //   setCoupon("");
    // } else {
    //   setXPosition(500);
    //   setCoupon("");
    // }
    setErrorMsg("");
    setShowSidebar((showSidebar) => !showSidebar);
  }, [setShowSidebar]);

  const prevCoupon = usePrevious(couponCode);

  useEffect(() => {
    if (couponCode !== prevCoupon /*&& deviceType == DeviceTypes.DESKTOP*/)
      setShowSidebar(false);
  }, [couponCode, toggleSideBar, prevCoupon]);

  const triggerViewCart = () => {
    setTimeout(function () {
      setFireViewCartGAReload((prev) => prev + 1);
    }, 2000);
    // viewCartGA4(cartData, userInfo.isLogin)
  };

  useEffect(() => {
    if (fireViewCartGAReload !== 0)
      viewCartGA4(cartData, userInfo.isLogin, pageInfo);
  }, [fireViewCartGAReload]);

  useEffect(() => {
    if (showSidebar) {
      const pageName = "apply-coupon-page";
      if (!userInfo.userLoading) {
        userProperties(userInfo, pageName, pageInfo, configData);
      }
    }
  }, [showSidebar]);

  const onIncreaseItem = (itemId: number) => {
    const reqObj: {
      itemId: number;
      sessionId: string;
      flag: string;
      count?: number;
      prevCartData?: any;
      isLogin: boolean;
      pageInfo: any;
    } = {
      itemId: itemId,
      sessionId: getCookie(COOKIE_NAME),
      flag: "increase",
      count: 1,
      isLogin: userInfo?.isLogin,
      prevCartData: prevCartData,
      pageInfo,
    };
    dispatch(updateCartItems(reqObj));
    if (couponCode) applyGvHandler(couponCode, "remove");
    triggerViewCart();
  };

  const deleteAllCount = (itemId: number, type?: string) => {
    const reqObj: {
      itemId: number;
      sessionId: string;
      flag: string;
    } = {
      itemId: itemId,
      sessionId: getCookie(COOKIE_NAME),
      flag: "decrease",
    };

    if (type === "already_in_wishlist")
      setMsgDropText(
        localeData.ITEM_ALREADY_IN_WISHLIST || "Item already in wishlist !"
      );
    else if (type === "wishlist") {
      setMsgDropText(
        localeData.ITEM_MOVED_TO_WISHLIST || "Item moved to wishlist !"
      );
    } else {
      setMsgDropText(localeData.ITEM_REMOVED_FROM_CART);
    }
    dispatch(deleteCartItems(reqObj));
    if (cartData?.cartQty !== 0) {
      setTimeout(() => {
        setMsgDrop(true);
      }, 1000);
    }
    triggerViewCart();
  };

  const confirmDelete = (itemId: number) => {
    setShowConfirmDelete(true);
    setConfirmDeleteId(itemId);
    // deleteAllCount(itemId);
    triggerViewCart();
  };
  const onDecreaseItem = (
    itemId: number,
    itemQty?: number,
    classification?: string,
    productId?: number
  ) => {
    setIsOverlay(-1);
    const isCLItem = classification?.toLowerCase() === "contact_lens" || false;
    let reqObj: {
      itemId: number;
      sessionId: string;
      flag: string;
      count?: number;
      isLogin: boolean;
      productId?: number;
      pageInfo: any;
    } = {
      itemId: itemId,
      sessionId: getCookie(COOKIE_NAME),
      flag: "decrease",
      ...(!isCLItem && { count: 1 }),
      isLogin: userInfo?.isLogin,
      productId: productId,
      pageInfo,
    };
    dispatch(updateCartItems(reqObj));
    setMsgDropText(localeData.ITEM_REMOVED_FROM_CART);

    if (cartData?.cartCount !== 0) {
      setTimeout(() => {
        setMsgDrop(true);
      }, 1000);
    }
    triggerViewCart();
  };

  const toggleOverlay = (key: number) => {
    if (isOverlay > -1) {
      setIsOverlay(-1);
    } else {
      setIsOverlay(key);
    }
  };

  const moveToWishlist = (productId: number) => {
    setIsOverlay(-1);
    const reqObj: {
      productId: number;
      sessionId: string;
      subdirectoryPath: string;
      url: string;
    } = {
      productId: productId,
      sessionId: getCookie(COOKIE_NAME),
      subdirectoryPath: pageInfo.subdirectoryPath,
      url: router.asPath,
    };
    dispatch(saveToWishlist(reqObj));
  };

  useEffect(() => {
    if (cartData?.couponError) {
      if (pageInfo.deviceType === DeviceTypes.DESKTOP) toggleSideBar();
      setErrorMsg("You have entered an invalid coupon code !");
      dispatch(updateCouponError({ error: false }));
    }
  }, [cartData?.couponError, toggleSideBar, pageInfo.deviceType, dispatch]);

  const applyGvHandler = (code: string, flag: string) => {
    // console.log(code, flag);

    if (flag === "apply" && !(pageInfo.deviceType === DeviceTypes.MOBILE)) {
      toggleSideBar();
    }
    setErrorMsg("");
    const reqObj: {
      code: string;
      sessionId: string;
      flag: string;
    } = {
      code: code,
      sessionId: getCookie(COOKIE_NAME),
      flag: flag,
    };
    dispatch(applyRemoveGv(reqObj));
    triggerViewCart();
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

  const wishList = (itemId: number, pid: number) => {
    if (productIds?.length && productIds?.includes(pid.toString())) {
      deleteAllCount(itemId, "already_in_wishlist");
      // onDecreaseItem(itemId, item.itemQty);
      // onDecreaseItem(id);
    } else {
      deleteAllCount(itemId, "wishlist");
      moveToWishlist(pid);
    }
    // if (cartData?.cartItems?.length === 1) {
    //   dispatch(
    //     fetchWishlist({
    //       sessionId: userInfo.sessionId || sessionId,
    //       subdirectoryPath: pageInfo.subdirectoryPath,
    //     })
    //   );
    //   dispatch(setWishListShow(true));
    // }
  };

  // const handleChange = (e: any) => {
  //   const event = e.target;
  //   setCoupon(event.value);
  //   setErrorMsg("");
  //   const re = /\}/g;
  //   if (re.test(event.value)) {
  //     setErrorMsg("Please enter a valid Coupon");
  //   }
  // };

  const utmParameters =
    typeof window !== "undefined" &&
    window &&
    extractUtmParams(window.location.search);

  const navigateToCheckout = (e: any, isMobileView?: boolean) => {
    if (!isMobileView) {
      beginCheckoutGA4(cartData, userInfo?.isLogin, pageInfo);
      checkoutVirtualPageView(
        userInfo,
        utmParameters,
        pageInfo,
        cartData,
        configData
      );
      e.preventDefault();
      triggerFBQEvent(cartData, "InitiateCheckout");
      router.push(userInfo?.isLogin ? "/checkout/address" : "/checkout/signin");
    } else {
      if (userInfo.isLogin) {
        beginCheckoutGA4(cartData, userInfo?.isLogin, pageInfo);
        triggerFBQEvent(cartData, "InitiateCheckout");
        checkoutVirtualPageView(
          userInfo,
          utmParameters,
          pageInfo,
          cartData,
          configData
        );
        router.push("/checkout/address");
      } else {
        beginCheckoutGA4(cartData, userInfo?.isLogin, pageInfo);
        triggerFBQEvent(cartData, "InitiateCheckout");
        checkoutVirtualPageView(
          userInfo,
          utmParameters,
          pageInfo,
          cartData,
          configData
        );
        setBottomSheet(true);
        setSignUpBottomSheet(false);
      }
    }
  };

  const deleteSingleWishlist = (pid: number) => {
    dispatch(
      deleteOneWishlist({
        productId: pid,
        sessionId: getCookie(COOKIE_NAME),
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  };

  const deleteAllWishList = () => {
    dispatch(
      deleteAllWishlist({
        sessionId: getCookie(COOKIE_NAME),
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  };

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
          sessionId: getCookie(COOKIE_NAME),
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
            sessionId: getCookie(COOKIE_NAME),
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
            sessionId: getCookie(COOKIE_NAME),
            userInfo,
            pageInfo,
          })
        );
      }
    }
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

  const ErrorMessage = styled.div`
    color: red;
    margin: 0 3px;
    font-size: 0.8em;
    padding: 22px 0 8px 0;
  `;

  const postNeedHelpWhatsapp = async (phone: number | null) => {
    if (phone) {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
        .setHeaders(headerArr)
        .setMethod(APIMethods.POST);
      api.sessionToken = getCookie(COOKIE_NAME);
      const body = new RequestBody<{ collectionData: [{ phone: string }] }>({
        collectionData: [{ phone: `${phone}` }],
      });
      const { data, error } = await cartFunctions.needHelpWhatsapp(api, body);
      if (error?.isError) {
        alert(
          "Sorry! Due to some technical issue we are unable to communicate with the server"
        );
      }
    }
  };
  const buyWithCallConfig =
    configData &&
    configData?.BUY_ON_CALL_WIDGET &&
    JSON.parse(configData?.BUY_ON_CALL_WIDGET);
  const {
    eyeglasses: { tel },
    cta: { isShown /* whatsappIconGreen, iconGreen, text */ },
  } = buyWithCallConfig;
  const isBuyOnChat = buyWithCallConfig && buyWithCallConfig?.buyonchat;

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
  const { cartItems = [] } = cartData || {};
  const { mainText } = ctaConfig;
  const hasFrameProduct = !!cartItems?.some(
    (eyeFrame: { itemClassification: string; itemPowerRequired: string }) =>
      (eyeFrame.itemClassification === "eyeframe" ||
        eyeFrame.itemClassification === "sunglasses") &&
      eyeFrame.itemPowerRequired === "POWER_REQUIRED"
  );

  const hasStudioFlow =
    cartItems.find((item) => item.itemLensType === "BIFOCAL") &&
    configData?.ENABLE_STUDIOFLOW;

  let mainTextFormat = mainText.toLowerCase().split(" ");
  for (let i = 0; i < mainTextFormat.length; i++) {
    mainTextFormat[i] =
      mainTextFormat[i][0].toUpperCase() + mainTextFormat[i].substr(1);
  }

  mainTextFormat = mainTextFormat.join(" ");

  const ctaMainText = hasStudioFlow
    ? localeData?.CONTINUE_AND_SELECT_STORE
    : hasFrameProduct && mainText
    ? mainTextFormat
    : localeData.PROCEED_TO_CHECKOUT;

  const onCloseAuthModal = () => {
    setSignUpBottomSheet(false);
    setBottomSheet(false);
    dispatch(resetAuth());
  };

  const [isContactLensCheckboxChecked, setIsContactLensCheckboxChecked] =
    useState(
      (typeof window !== "undefined" &&
        sessionStorage.getItem("isContactLensCheckboxChecked") === "true") ||
        false
    );

  const isContactLensConsentEnabled = !!(
    hasContactLensItems(cartItems) && configData?.CL_DISCLAIMER
  );

  const toggleChecked = () => {
    setIsContactLensCheckboxChecked(!isContactLensCheckboxChecked);
  };

  useEffect(() => {
    // cartData?.cartItems &&
    //   addToCartGA(
    //     getCurrency(pageInfo.country),
    //     cartData?.cartItems?.[cartData?.cartItems.length - 1],
    //     userInfo
    //   );
    addToCartGA4(cartData?.cartItems, prevCartData, userInfo.isLogin, pageInfo);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined")
      sessionStorage.setItem(
        "isContactLensCheckboxChecked",
        JSON.stringify(isContactLensCheckboxChecked)
      );
    let a = sessionStorage.getItem("isContactLensCheckboxChecked");
    a = a && JSON.parse(a);
    // console.log("a===>", typeof a);
  }, [isContactLensCheckboxChecked]);

  useEffect(() => {
    if (
      isSignIn &&
      isHomeGuestFlow &&
      !!cartData?.cartItems?.length &&
      !cartsFetched
    ) {
      setCartsFetched(true);
      dispatch(fetchCarts({ sessionId: getCookie(COOKIE_NAME) })).then(
        ({ payload }: { payload: any }) => {
          if (!!payload.cartData?.cartItems?.length) {
            router.push("/checkout/address");
          }
        }
      );
    }
  }, [
    isSignIn,
    isHomeGuestFlow,
    cartData?.cartItems,
    router,
    cartsFetched,
    dispatch,
  ]);

  const desktopView = (
    <PageContainer ref={cartRef}>
      <NextHead>
        <title>Cart</title>
      </NextHead>

      <CartHeader
        appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
        safeText={SAFE_SECURE}
      />
      {false && showShotlist && productList?.length ? (
        <Shortlist
          setShowShortList={setShowShortList}
          deleteSingleWishlist={deleteSingleWishlist}
          deleteAllWishList={deleteAllWishList}
          showShortlist={showShotlist}
        />
      ) : null}

      {showAuthModal && !userInfo?.isLogin && (
        <Auth.AuthModal
          isSignUp
          // onBackdropClick={() => {
          //   setshowAuthModal(false);
          //   resetSignInStatus();
          // }}
        >
          {authTab === AuthTabENUM.SIGN_IN && (
            // <CheckoutSignInWrapper>
            <Auth.SignInComponent
              signInStatus={signInStatus}
              dataLocale={localeData}
              otpSent={signInStatus.otpSent}
              onProceed={(
                fieldType: SignInType,
                value: string,
                password?: string
              ) => verifySignInType(fieldType, value, password)}
              onSignIn={() => null}
              font={TypographyENUM.defaultBook}
              resetServerError={() =>
                dispatch(
                  updateSignInStatusError({ status: false, message: "" })
                )
              }
              whatsAppChecked={userInfo.whatsAppChecked}
              id="sign-in-form"
              setCaptcha={(val: string | null) =>
                dispatch(updateCaptchaResponse(val))
              }
              isRTL={pageInfo.isRTL}
              onClose={() => {
                setshowAuthModal(false);
                resetSignInStatus();
              }}
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
              moveToSignUp={moveToSignUp}
              countryCode={countryCode}
              resetSignInStatus={resetSignInStatus}
              loaderImageLink={localeData.LOADER_IMAGE_LINK}
              setGetWhatsAppUpdate={
                userInfo.isLogin
                  ? () =>
                      dispatch(
                        whatsAppUpdate({
                          sessionId: getCookie(COOKIE_NAME),
                          optingValue: true,
                        })
                      )
                  : () => null
              }
              renderCaptcha={renderCaptcha}
              resetCaptcha={resetCaptcha}
              isCaptchaRequired={authInfo.signInStatus.isCaptchaRequired}
              isCaptchaVerified={authInfo.signInStatus.isCaptchaVerified}
              scriptLoaded={scriptLoaded}
              recaptchaInDom={recaptchaInDom}
              localeData={localeData}
              setRecaptchaInDom={setRecaptchaInDom}
              forgotPassCallback={forgotPasswordHandler}
              redirectToHome={() => {
                resetSignInStatus();
                router.push("/");
              }}
              resetCaptchaVerified={() =>
                dispatch(updateIsCaptchaVerified(false))
              }
              showWhatsAppOption={!configData.HIDE_WHATSAPP}
              phoneCodeConfigData={
                typeof configData?.AVAILABLE_NEIGHBOUR_COUNTRIES === "string"
                  ? JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
                  : configData?.AVAILABLE_NEIGHBOUR_COUNTRIES
              }
              supportMultipleCountries={configData?.SUPPORT_MULTIPLE_COUNTRIES}
              incCountryCodeFont
              deviceType={deviceType}
              OtpTime={
                deviceType === DeviceTypes.MOBILE
                  ? configData?.SIGN_IN_OTP_TIME?.msite
                  : configData?.SIGN_IN_OTP_TIME?.desktop
              }
            />
            // </CheckoutSignInWrapper>
          )}
          {authTab === AuthTabENUM.SIGN_UP && (
            <Auth.SignUpComponent
              id="sign-up-form"
              dataLocale={localeData}
              setGetWhatsAppUpdate={() =>
                dispatch(setWhatsappChecked(!userInfo.whatsAppChecked))
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
                    sessionId: getCookie(COOKIE_NAME),
                    referalCode,
                  })
                )
              }
              font={TypographyENUM.defaultBook}
              isRTL={pageInfo.isRTL}
              onClose={() => {
                setAuthTab(AuthTabENUM.SIGN_IN);
                setshowAuthModal(false);
                resetSignInStatus();
              }}
              moveToSignIn={() => setAuthTab(AuthTabENUM.SIGN_IN)}
              countryCode={countryCode}
              signUpStatus={signInStatus}
              showWhatsAppOption={!configData.HIDE_WHATSAPP}
              configData={configData}
              onClickCms={() =>
                window.open(
                  getCmsLinks(pageInfo.country.toLowerCase(), "PRIVACY_POLICY"),
                  "_blank"
                )
              }
              phoneCodeConfigData={
                typeof configData?.AVAILABLE_NEIGHBOUR_COUNTRIES === "string"
                  ? JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
                  : configData?.AVAILABLE_NEIGHBOUR_COUNTRIES
              }
              incCountryCodeFont
              deviceType={deviceType}
              supportMultipleCountries={configData?.SUPPORT_MULTIPLE_COUNTRIES}
            />
          )}
        </Auth.AuthModal>
      )}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: "#FBF9F7",
          margin: "auto",
          maxWidth: "1500px",
          width: "88vw",
        }}
      > */}
      {cartData?.cartIsLoading ? (
        <CommonLoader show={true} />
      ) : (
        <AddressBody>
          <CartWrapper
            flex={cartData?.cartIsError || cartData?.cartItems?.length === 0}
          >
            {cartPopupError ? (
              <PopUpText
                text={cartErrorMessage || "Error"}
                setMsgDrop={() =>
                  updateCartPopupError({
                    error: false,
                    errorMessage: "",
                  })
                }
                isRTL={pageInfo.isRTL}
                top={true}
              />
            ) : msgDrop ? (
              <PopUpText
                text={msgDropText}
                setMsgDrop={() => setMsgDrop(false)}
                isRTL={pageInfo.isRTL}
                top={true}
              />
            ) : null}
            {!cartData?.cartIsError && cartData?.cartItems?.length !== 0 ? (
              <MainSection>
                <LeftWrapper>
                  {cartData && cartData?.offerBanner && (
                    <div
                      onClick={() =>
                        cartData?.offerBanner?.offerId
                          ? dispatch(
                              addToCartNoPower({
                                pid:
                                  typeof cartData?.offerBanner?.offerId ===
                                  "string"
                                    ? parseInt(cartData?.offerBanner?.offerId)
                                    : cartData?.offerBanner?.offerId,
                                sessionId: getCookie(COOKIE_NAME),
                              })
                            )
                          : () => null
                      }
                    >
                      <Link
                        href={
                          cartData?.offerBanner?.offerUrl ||
                          window.location.href
                        }
                      >
                        <img
                          alt={cartData?.offerBanner?.title || ""}
                          src={cartData?.offerBanner?.image}
                          style={{
                            width: "100%",
                            marginTop:
                              deviceType === DeviceTypes.DESKTOP ? "15px" : 0,
                          }}
                          className="ga-banner-img-obeserver"
                          onClick={() =>
                            bannerGA4(
                              "select_promotion",
                              "TYPE_BANNER",
                              userInfo,
                              "",
                              "",
                              "",
                              "",
                              pageInfo
                            )
                          }
                        />
                      </Link>
                    </div>
                  )}
                  {/* {msgDrop ? (
                <PopUpText
                  text="Item removed from cart !"
                  setMsgDrop={setMsgDrop}
                />
              ) : null} */}
                  {cartData?.cartItems?.length !== 0 && (
                    <HeadingText
                      className="cart-heading"
                      styledFont={TypographyENUM.lkSansRegular}
                    >
                      {CART} {"(" + (cartData?.cartCount || "")}{" "}
                      {cartData?.cartCount <= 1 ? "item" : "items"}
                      {")"}
                    </HeadingText>
                  )}
                  <CartCardWrapper>
                    {cartData?.hasBogoLimitExceeded &&
                    cartData?.bogoNotAppliedMessage ? (
                      <MobileCardBox
                        message={cartData && cartData?.bogoNotAppliedMessage}
                        isMobileView
                      />
                    ) : null}

                    {cartData &&
                      cartData?.cartItems &&
                      cartData?.cartItems?.some(
                        (item: { itemClassification: string }) =>
                          item.itemClassification === "contact_lens"
                      ) &&
                      configData?.CONTACTS_OFFER &&
                      JSON.parse(configData?.CONTACTS_OFFER)?.cart_offer && (
                        <CLOffer>
                          {JSON.parse(configData?.CONTACTS_OFFER)?.cart_offer}
                        </CLOffer>
                      )}
                    {cartData?.cartItems &&
                    Array.isArray(cartData?.cartItems) &&
                    cartData?.cartItems.length > 0
                      ? cartData?.cartItems?.map((item, key: number) => {
                          return (
                            <div key={item.id} style={{ position: "relative" }}>
                              <OverlayText
                                isOverlay={key === isOverlay}
                                styledFont={TypographyENUM.lkSansRegular}
                              >
                                <CrossWrapper>
                                  <Icons.Cross
                                    onClick={() => toggleOverlay(-1)}
                                  />
                                </CrossWrapper>
                                <OverlayContent>
                                  <Text isBold={true}>
                                    {REMOVE_ITEM_FROM_CART}
                                  </Text>
                                  <Text>{WISHLIST_TO_USE_LATER}</Text>
                                  <ButtonWrapper>
                                    <Button
                                      id="remove-button"
                                      theme={ThemeENUM.secondary}
                                      kind={kindENUM.border}
                                      showChildren={true}
                                      font={TypographyENUM.lkSansBold}
                                      onClick={() => {
                                        onDecreaseItem(
                                          item.id,
                                          item.itemQty,
                                          item.itemClassification,
                                          item?.itemId
                                        );
                                        removeFromCartGA(item, userInfo);
                                        removeFromCartGA4(
                                          item,
                                          userInfo.isLogin,
                                          pageInfo
                                        );
                                      }}
                                    >
                                      Yes, Remove
                                    </Button>
                                    <Button
                                      id="wishlist-button"
                                      theme={ThemeENUM.secondary}
                                      kind={kindENUM.background}
                                      showChildren={true}
                                      font={TypographyENUM.lkSansBold}
                                      onClick={() => null}
                                    >
                                      {MOVE_WISHLIST}
                                    </Button>
                                  </ButtonWrapper>
                                </OverlayContent>
                              </OverlayText>
                              <Overlay
                                key={key}
                                isOverlay={key === isOverlay}
                                // onClick={() => router.push(item?.itemUrl)}
                              >
                                <CartCard
                                  {...item}
                                  componentSize={ComponentSizeENUM.large}
                                  font={TypographyENUM.lkSansBold}
                                  currencyCode={getCurrency(country)}
                                  dataLocale={localeData}
                                  onAddClick={() => {
                                    onIncreaseItem(item.id);
                                    // addToCartGA(
                                    //   getCurrency(pageInfo.country),
                                    //   item,
                                    //   userInfo
                                    // );
                                    // addToCartGA4(
                                    //   cartData?.cartItems,
                                    //   prevCartData
                                    // );
                                    if (typeof window?.fbq !== "undefined") {
                                      window?.fbq("track", "AddToCart", {
                                        content_category:
                                          item.itemClassification,
                                        content_ids: item.id,
                                        content_type: "product",
                                        value: item.price.value,
                                        currency: item.price.currencyCode,
                                      });
                                    }
                                  }}
                                  onDeleteClick={
                                    item.itemLensType === "CONTACT_LENS" ||
                                    item.itemClassification?.toUpperCase() ===
                                      "CONTACT_LENS"
                                      ? () => {
                                          deleteAllCount(item.id);
                                          removeFromCartGA(item, userInfo);
                                          removeFromCartGA4(
                                            item,
                                            userInfo.isLogin,
                                            pageInfo
                                          );
                                        }
                                      : () => {
                                          onDecreaseItem(
                                            item.id,
                                            item.itemQty,
                                            item.itemClassification,
                                            item?.itemId
                                          );
                                          removeFromCartGA(item, userInfo);
                                          removeFromCartGA4(
                                            item,
                                            userInfo.isLogin,
                                            pageInfo
                                          );
                                        }
                                  }
                                  deleteAllCount={() => deleteAllCount(item.id)}
                                  wishlist={() => {
                                    wishList(item.id, item.itemId);
                                    removeFromCartGA(item, userInfo);
                                    removeFromCartGA4(
                                      item,
                                      userInfo.isLogin,
                                      pageInfo
                                    );
                                  }}
                                  cartTotal={cartData?.cartTotal}
                                  isRTL={pageInfo.isRTL}
                                  subdirectoryPath={pageInfo.subdirectoryPath}
                                  removeDomainName={removeDomainName}
                                  itemExtraDetails={item.extraDetails}
                                />
                              </Overlay>
                            </div>
                          );
                        })
                      : // <Alert
                        //   color={AlertColorsENUM.blue}
                        //   componentSize={ComponentSizeENUM.large}
                        //   font={TypographyENUM.lkSansRegular}
                        //   id="Alert"
                        // >
                        //   <Flex>
                        //     <span>{YOUR_SHOPPING_CART_IS_EMPTY}</span>
                        //   </Flex>
                        // </Alert>
                        !cartData?.cartIsLoading && (
                          <ErrorCart config={localeData} />
                        )}
                    {/* <div>
                    {productList?.length ? (
                      <CartWishlist
                        productList={productList}
                        mobileView={pageInfo.deviceType === DeviceTypes.MOBILE}
                        isRTL={pageInfo.isRTL}
                        slidesToShow={(() => {
                          if (width >= 1600) return 5.5;
                          else if (width >= 1200) return 3.5;
                          else return 3.7;
                        })()}
                        isTaxable={country !== "sa"}
                      />
                    ) : null}
                  </div> */}
                    {!userInfo?.isLogin && (
                      <>
                        <Alert
                          color={AlertColorsENUM.white}
                          componentSize={ComponentSizeENUM.medium}
                          font={TypographyENUM.lkSansRegular}
                          id="Alert"
                          boxShadow={true}
                          style
                        >
                          <Flex
                            style={{ padding: "12px 4px", cursor: "pointer" }}
                            onClick={() =>
                              width < 1024
                                ? setBottomSheet(!bottomSheet)
                                : setshowAuthModal(true)
                            }
                          >
                            <span>{LOGIN_TO_SEE_EXISTING}</span>
                            <TextButton isRTL={pageInfo.isRTL}>
                              <Icons.RightArrow />
                            </TextButton>
                          </Flex>
                        </Alert>
                      </>
                    )}
                    <div>
                      {productList?.length &&
                      cartData?.cartItems?.length !== 0 ? (
                        <CartWishlist
                          productList={productList}
                          mobileView={
                            pageInfo.deviceType === DeviceTypes.MOBILE
                          }
                          isRTL={pageInfo.isRTL}
                          slidesToShow={(() => {
                            if (width >= 1600) return 3.5;
                            else if (width >= 1200) return 3;
                            else return 3.7;
                          })()}
                          isTaxable={configData?.SHOW_PACKAGE_SCREEN_TAX_TEXT}
                          wishlistLength={productList?.length}
                        />
                      ) : null}
                    </div>
                  </CartCardWrapper>
                </LeftWrapper>
                {cartData?.cartItems &&
                  Array.isArray(cartData?.cartItems) &&
                  cartData?.cartItems.length > 0 && (
                    <RightWrapper>
                      <StickyDiv>
                        <HeadingText
                          styledFont={TypographyENUM.lkSerifNormal}
                          onClick={() => setMsgDrop(!msgDrop)}
                        >
                          {BILL_DETAILS}
                        </HeadingText>
                        <NewPriceBreakup
                          id="1"
                          width="100"
                          dataLocale={localeData}
                          priceData={cartData?.cartTotal}
                          showPolicy={false}
                          showCart={false}
                          currencyCode={getCurrency(pageInfo.country)}
                          infoText={cartData?.taxMessage?.split("\n")}
                          enableTax={configData?.ENABLE_TAX}
                          // infoText={"Tax on Eyeglasses 12%"}
                        />
                        {cartData?.offerDetails ? (
                          <GoldMembershipNew
                            cartTotal={cartData?.cartTotal}
                            cartItems={cartData?.cartItems}
                            subdirectoryPath={pageInfo.subdirectoryPath}
                            offerDetails={cartData?.offerDetails}
                            showTax={country === "in"}
                            currencySymbol={getCurrency(country)}
                            id="offers"
                            width="100"
                            tagText="active"
                            cartSubTotal={cartData?.cartSubTotal}
                            headText="Gold Membership"
                            subText="Hurray! Buy 1 Get 1 applied to cart"
                            descText="You are saving ₹1600 on this order"
                            font={TypographyENUM.lkSansRegular}
                            isRTL={pageInfo.isRTL}
                            addOfferToCart={({
                              productId,
                            }: {
                              productId: number;
                            }) =>
                              dispatch(
                                addToCartNoPower({
                                  pid: productId,
                                  sessionId: getCookie(COOKIE_NAME),
                                })
                              )
                            }
                            // <Offers
                            //   id="offers"
                            //   width="100"
                            //   tagText="active"
                            //   headText="Gold Membership"
                            //   subText="Hurray! Buy 1 Get 1 applied to cart"
                            //   descText="You are saving ₹1600 on this order"
                            //   offerDetail={cartData?.offerDetails}
                            //   finalTotal={cartData?.cartTotal}
                            //   font={TypographyENUM.lkSansRegular}
                            //   isRTL={pageInfo.isRTL}
                            //   currencyCode={getCurrency(country)}
                            //   subdirectoryPath={pageInfo.subdirectoryPath}
                            // />
                          />
                        ) : null}
                        <ApplyCoupon
                          id="ApplyCoupon"
                          width="100"
                          headText={
                            couponCode
                              ? `${couponCode} applied`
                              : "Apply Coupon"
                          }
                          subText={
                            couponAmount ? (
                              <span>
                                {/* <Icons.Tick />{" "} */}
                                {configData.YOU_ARE_SAVING ||
                                  config.YOU_ARE_SAVING}{" "}
                                {getCurrency(country) || "₹"}
                                {couponAmount}
                              </span>
                            ) : (
                              configData.CHECK_AVAILABLE_OFFERS ||
                              config.CHECK_AVAILABLE_OFFERS
                            )
                          }
                          isApplied={couponCode.length > 0}
                          onClick={
                            userInfo.isLogin
                              ? () => !couponCode && toggleSideBar()
                              : () =>
                                  width > 1024
                                    ? setshowAuthModal(true)
                                    : setBottomSheet(!bottomSheet)
                          }
                          onRemoveClick={() =>
                            applyGvHandler(couponCode, "remove")
                          }
                          font={TypographyENUM.lkSansRegular}
                          isRTL={pageInfo.isRTL}
                        />
                        <ButtonPosition>
                          {isContactLensConsentEnabled && (
                            <ContactLensConsentCheckbox
                              deviceType={pageInfo?.deviceType}
                              toggleChecked={toggleChecked}
                              checked={isContactLensCheckboxChecked}
                              dataLocale={localeData}
                              configData={configData}
                            />
                          )}
                          <Button
                            id="button"
                            showChildren={true}
                            width="100"
                            font={TypographyENUM.lkSansBold}
                            onClick={(e: any) => navigateToCheckout(e)}
                            disabled={
                              isContactLensConsentEnabled &&
                              !isContactLensCheckboxChecked
                            }
                          >
                            <ButtonContent
                              styledFont={TypographyENUM.lkSansBold}
                              isRTL={pageInfo.isRTL}
                            >
                              {config.PROCEED_TO_CHECKOUT}{" "}
                              <Icons.DardBlueRightIcon />
                            </ButtonContent>
                          </Button>
                        </ButtonPosition>
                      </StickyDiv>
                    </RightWrapper>
                  )}
              </MainSection>
            ) : (
              <ErrorCart config={localeData} />
            )}
            {/* </div> */}
          </CartWrapper>
          {/* </div> */}
        </AddressBody>
      )}

      <BottomSheet
        show={bottomSheet}
        closebottomSheet={closebottomSheet}
        isRTL={pageInfo.isRTL}
      >
        <Auth.CheckoutSignIn
          signInStatus={signInStatus}
          resetSignInStatus={resetSignInStatus}
          dataLocale={localeData}
          resetServerError={() =>
            dispatch(updateSignInStatusError({ status: false, message: "" }))
          }
          onProceed={(
            fieldType: SignInType,
            value: string,
            password?: string
          ) => verifySignInType(fieldType, value, password)}
          onSignIn={() => null}
          font={TypographyENUM.defaultBook}
          id="sign-in-form"
          isRTL={pageInfo.isRTL}
          onClose={() => {}}
          guestCheckout={({
            email,
            number,
          }: {
            email: string;
            number: string | null;
          }) => {
            dispatch(updateGuestFlowLogin({ email, number }));
            if (number) {
              dispatch(
                abandonedLeads({
                  cartId: cartData.cartId,
                  sessionId: getCookie(COOKIE_NAME),
                  device: deviceType,
                  mobileNumber: number,
                  phoneCode: pageInfo.countryCode,
                  step: 1,
                })
              );
            } else {
              dispatch(
                abandonedLeads({
                  cartId: cartData.cartId,
                  sessionId: getCookie(COOKIE_NAME),
                  device: deviceType,
                  phoneCode: pageInfo.countryCode,
                  step: 1,
                })
              );
            }
            if (isHomeGuestFlow) router.push("/checkout/address");
          }}
          moveToSignUp={moveToSignUp}
          countryCode={countryCode}
          signInImgLink={configData.SIGNIN_IMG_LINK}
          loaderImageLink={configData.LOADER_IMAGE_LINK}
          showWhatsAppOption={!configData.HIDE_WHATSAPP}
          showGuestFlow={false}
          phoneCodeConfigData={
            configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
            JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
          }
          supportMultipleCountries={configData?.SUPPORT_MULTIPLE_COUNTRIES}
          incCountryCodeFont
          deviceType={deviceType}
          OtpTime={
            deviceType === DeviceTypes.MOBILE
              ? configData?.SIGN_IN_OTP_TIME?.msite
              : configData?.SIGN_IN_OTP_TIME?.desktop
          }
        />
      </BottomSheet>
      <ApplyCouponBar
        mobileView={pageInfo.deviceType === DeviceTypes.MOBILE}
        applyGvHandler={applyGvHandler}
        appliedCoupon={couponCode}
        applicableGvs={cartData?.applicableGvs}
        sorryNoCoupon={localeData.SORRY_NO_COUPON}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        errMsg={errMsg}
        isRTL={pageInfo.isRTL}
        setErrorMsg={setErrorMsg}
        newCartOfferDesign={newCartOfferDesign}
        bestOffers={bestOffers}
        bankOffers={bankOffers}
      />
      <Wishlist
        isLoading={wishListInfo.isLoading}
        show={wishListInfo.showWishList}
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
      {/* <CollapsibleSidebar
        id="collapsible"
        height={100}
        overLay={showSidebar}
        xPosition={xPosition}
        title="Apply Coupon"
        onClose={() => toggleSideBar()}
        isRTL={pageInfo.isRTL}
      >
        <ManualApplyCoupon font={TypographyENUM.lkSansRegular}>
          <Flex>
            <ApplyCouponInput
              name="coupon"
              placeholder="Enter Coupon Code"
              type="text"
              value={coupon}
              onChange={(e) => handleChange(e)}
              isRTL={pageInfo.isRTL}
            />
            <ApplyButton
              onClick={
                coupon?.length && !errMsg?.length
                  ? () => applyGv(coupon?.toUpperCase(), "apply")
                  : () => { }
              }
              isActive={(coupon.length && !errMsg.length) || false}
              isRTL={pageInfo.isRTL}
            >
              Apply
            </ApplyButton>
          </Flex>
          {errMsg && <ErrorMessage>{errMsg}</ErrorMessage>}
        </ManualApplyCoupon>

        {cartData?.applicableGvs &&
          Array.isArray(cartData?.applicableGvs) &&
          cartData?.applicableGvs.length > 0 ? (
          cartData?.applicableGvs.map((item, key) => {
            return (
              <Coupon
                id={`Coupon-${key}`}
                width="100"
                headText={item.code}
                subText={item.heading}
                descText={item.description}
                termsAndCondition={item.termsAndConditions}
                onClick={() => applyGvHandler(item.code, "apply")}
                font={TypographyENUM.defaultBook}
                key={key}
              />
            );
          })
        ) : (
          <Alert
            color={AlertColorsENUM.golden}
            componentSize={ComponentSizeENUM.large}
            font={TypographyENUM.lkSansRegular}
            id="Alert"
          >
            <Flex>
              <span>{SORRY_NO_COUPON}</span>
            </Flex>
          </Alert>
        )}
      </CollapsibleSidebar> */}
      {/* <div style={{ marginBottom: "60px" }}></div> */}
    </PageContainer>
  );

  const openChatSprinkular = () => {
    router.push(`/support`);
  };

  const FooterTemp = () => {
    return (
      <>
        <Footer
          footerData={
            typeof configData?.FOOTER_DATA === "string"
              ? JSON.parse(configData.FOOTER_DATA).desktop
              : configData?.FOOTER_DATA.desktop
          }
          dataLocale={localeData}
          deviceType={deviceType}
          subdirectoryPath={pageInfo.subdirectoryPath}
          footerDataMobile={
            typeof configData?.FOOTER_DATA === "string"
              ? JSON.parse(configData.FOOTER_DATA).mobile
              : configData.FOOTER_DATA.mobile
          }
          openChatSprinkular={openChatSprinkular}
          isRTL={pageInfo.isRTL}
          country={pageInfo.country}
        />
      </>
    );
  };

  const placeOrderButtonText = `${
    cartData?.cartTotal?.length
      ? getCurrency(pageInfo.country) +
        cartData?.cartTotal?.[cartData?.cartTotal?.length - 1]?.amount +
        " • "
      : ""
  }${ctaMainText}`;

  const mobileView = (
    <div ref={cartRef}>
      <NextHead>
        <title>{localeData.CART}</title>
      </NextHead>
      <ApplyCouponBar
        mobileView={pageInfo.deviceType === DeviceTypes.MOBILE}
        applyGvHandler={applyGvHandler}
        appliedCoupon={couponCode}
        applicableGvs={cartData?.applicableGvs}
        sorryNoCoupon={localeData.SORRY_NO_COUPON}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        errMsg={errMsg}
        isRTL={pageInfo.isRTL}
        setErrorMsg={setErrorMsg}
        font={TypographyENUM.lkSansRegular}
        textCapitalize={true}
        hideArrowBackground
        newCartOfferDesign={newCartOfferDesign}
        bestOffers={bestOffers}
        bankOffers={bankOffers}
      />
      {cartData?.cartIsLoading ? (
        <CommonLoader show={true} />
      ) : (
        <>
          <MobileCartHeader
            isRTL={pageInfo.isRTL}
            logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
            showBackBtn={false}
            onClickBack={() => null}
            dontShowlogo={false}
            isClickable={true}
            configData={configData}
            hasOnlyCLProduct={
              !cartData?.cartItems?.some(
                (item: {
                  itemClassification: string;
                  itemPowerRequired: string;
                }) =>
                  (item.itemClassification === "eyeframe" ||
                    item.itemClassification === "sunglasses") &&
                  (item.itemPowerRequired === "POWER_REQUIRED" ||
                    item.itemPowerRequired === "POWER_SUBMITTED")
              )
            }
            pageNumber={1}
          />
          <CartWrapper
            flex={false}
            isContactLensConsentEnabled={isContactLensConsentEnabled}
            isMobileView
            isCartEmpty={!!cartData?.cartItems?.length}
          >
            {cartData &&
            cartData?.offerBanner &&
            cartData?.cartItems &&
            Array.isArray(cartData?.cartItems) &&
            cartData?.cartItems.length > 0 ? (
              <div
                onClick={() =>
                  cartData?.offerBanner?.offerId
                    ? dispatch(
                        addToCartNoPower({
                          pid:
                            typeof cartData?.offerBanner?.offerId === "string"
                              ? parseInt(cartData?.offerBanner?.offerId)
                              : cartData?.offerBanner?.offerId,
                          sessionId: getCookie(COOKIE_NAME),
                        })
                      )
                    : () => null
                }
              >
                <Link
                  href={cartData?.offerBanner?.offerUrl || window.location.href}
                >
                  <img
                    style={{
                      width: "100%",
                      marginBottom:
                        deviceType === DeviceTypes.DESKTOP ? "20px" : 0,
                    }}
                    alt={cartData?.offerBanner?.title || ""}
                    src={cartData?.offerBanner?.image}
                    className="ga-banner-img-obeserver"
                  />
                </Link>
              </div>
            ) : null}

            {msgDrop ? (
              <PopUpText
                text={msgDropText}
                setMsgDrop={() => setMsgDrop(false)}
                isRTL={pageInfo.isRTL}
              />
            ) : null}
            {cartData?.cartItems &&
            Array.isArray(cartData?.cartItems) &&
            cartData?.cartItems.length > 0 ? (
              <React.Fragment>
                {cartData?.cartIsLoading ? <CommonLoader show={true} /> : null}
                <CartItemsBar
                  text={`${CART} (${cartData?.cartCount || ""} ${
                    cartData?.cartCount <= 1 ? "item" : "items"
                  })`}
                  showNeedHelp={configData?.CART_NEED_HELP}
                  needHelpLink={isBuyOnChat ? whatsAppChatMsg : `tel:${tel}`}
                  onNeedHelpClick={() =>
                    postNeedHelpWhatsapp(userInfo.mobileNumber)
                  }
                  localeData={localeData}
                />
                {cartData?.hasBogoLimitExceeded &&
                cartData?.bogoNotAppliedMessage ? (
                  <MobileCardBox
                    message={cartData && cartData?.bogoNotAppliedMessage}
                    isMobileView
                  />
                ) : null}

                {cartData &&
                  cartData?.cartItems &&
                  cartData?.cartItems?.some(
                    (item: { itemClassification: string }) =>
                      item.itemClassification === "contact_lens"
                  ) &&
                  configData?.CONTACTS_OFFER &&
                  JSON.parse(configData?.CONTACTS_OFFER)?.cart_offer && (
                    <CLOffer>
                      {JSON.parse(configData?.CONTACTS_OFFER)?.cart_offer}
                    </CLOffer>
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
                      resetServerError={() =>
                        dispatch(
                          updateSignInStatusError({
                            status: false,
                            message: "",
                          })
                        )
                      }
                      onProceed={(
                        fieldType: SignInType,
                        value: string,
                        password?: string
                      ) => verifySignInType(fieldType, value, password)}
                      onSignIn={() => {
                        // if (isHomeGuestFlow) {
                        //   router.push("/checkout/address");
                        // }
                      }}
                      font={TypographyENUM.defaultBook}
                      id="sign-in-form"
                      isRTL={pageInfo.isRTL}
                      onClose={() => resetSignInStatus()}
                      guestCheckout={({
                        email,
                        number,
                      }: {
                        email: string;
                        number: string | null;
                      }) => {
                        dispatch(updateGuestFlowLogin({ email, number }));
                        // if (isHomeGuestFlow) {
                        if (number) {
                          dispatch(
                            abandonedLeads({
                              cartId: cartData.cartId,
                              sessionId: getCookie(COOKIE_NAME),
                              device: deviceType,
                              mobileNumber: number,
                              phoneCode: pageInfo.countryCode,
                              step: 1,
                            })
                          );
                        }
                        router.push("/checkout/address");

                        // } else {
                        //   setBottomSheet((prevState) => !prevState);
                        // }
                      }}
                      moveToSignUp={() => router.push("/checkout/signup")}
                      countryCode={countryCode}
                      signInImgLink={localeData.SIGNIN_IMG_MSITE_LINK}
                      resetSignInStatus={resetSignInStatus}
                      setCaptcha={(val: any) =>
                        dispatch(updateCaptchaResponse(val))
                      }
                      otpSent={signInStatus.otpSent}
                      loaderImageLink={localeData.LOADER_IMAGE_LINK}
                      setGetWhatsAppUpdate={setGetWhatsAppUpdate}
                      renderCaptcha={renderCaptcha}
                      resetCaptcha={resetCaptcha}
                      isCaptchaRequired={
                        authInfo.signInStatus.isCaptchaRequired
                      }
                      isCaptchaVerified={
                        authInfo.signInStatus.isCaptchaVerified
                      }
                      scriptLoaded={scriptLoaded}
                      recaptchaInDom={recaptchaInDom}
                      setRecaptchaInDom={setRecaptchaInDom}
                      forgotPassCallback={forgotPasswordHandler}
                      redirectToHome={() => {
                        resetSignInStatus();
                        router.push("/customer/account/login");
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
                      negativeMargin
                      homeGuestFlow={isHomeGuestFlow}
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
                  overflow
                  height={"80vh"}
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
                      onClickCms={() =>
                        router.push(
                          getCmsLinks(
                            (pageInfo?.country as string).toLowerCase(),
                            "PRIVACY_POLICY"
                          )
                        )
                      }
                      isRTL={pageInfo.isRTL}
                      onClose={() => onCloseAuthModal()}
                      phoneCodeConfigData={
                        configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
                        JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
                      }
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
                            sessionId: getCookie(COOKIE_NAME),
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
                    />
                  ) : null}
                </BottomSheet>
                {cartData?.cartItems?.map((item: any, key: number) => {
                  const hrefLink = removeDomainName(
                    item?.itemUrl,
                    "",
                    "",
                    pageInfo.subdirectoryPath
                  );
                  return (
                    <CartProduct
                      key={key}
                      cartData={cartData}
                      currencySymbol={getCurrency(pageInfo.country)}
                      dataLocale={localeData}
                      item={item}
                      addOnLenskartPrice={0}
                      isRTL={pageInfo.isRTL}
                      configData={configData}
                      deleteAllCount={() => deleteAllCount(item.id)}
                      onAddClick={() => onIncreaseItem(item.id)}
                      onDeleteClick={
                        item.itemLensType === "CONTACT_LENS" ||
                        item.itemClassification?.toUpperCase() ===
                          "CONTACT_LENS"
                          ? () => deleteAllCount(item.id)
                          : () => {
                              onDecreaseItem(
                                item.id,
                                item.itemQty,
                                item.itemClassification,
                                item?.itemId
                              );
                              removeFromCartGA(item, userInfo);
                              removeFromCartGA4(
                                item,
                                userInfo.isLogin,
                                pageInfo
                              );
                            }
                      }
                      wishlist={() => {
                        wishList(item.id, item.itemId);
                        removeFromCartGA(item, userInfo);
                        removeFromCartGA4(item, userInfo.isLogin, pageInfo);
                      }}
                      addOnMarketPrice={0}
                      decreaseItemQtyFunc={
                        item.itemLensType === "CONTACT_LENS" ||
                        item.itemClassification?.toUpperCase() ===
                          "CONTACT_LENS"
                          ? () => {
                              confirmDelete(item.id);
                              removeFromCartGA(item, userInfo);
                              removeFromCartGA4(
                                item,
                                userInfo.isLogin,
                                pageInfo
                              );
                            }
                          : () => {
                              onDecreaseItem(
                                item.id,
                                item.itemQty,
                                item.itemClassification,
                                item?.itemId
                              );
                              removeFromCartGA(item, userInfo);
                              removeFromCartGA4(
                                item,
                                userInfo.isLogin,
                                pageInfo
                              );
                            }
                      }
                      increaseItemQtyFunc={() => {
                        onIncreaseItem(item.id);
                        // addToCartGA(
                        //   getCurrency(pageInfo.country),
                        //   item,
                        //   userInfo
                        // );
                        // addToCartGA4(cartData?.cartItems, prevCartData);
                        if (typeof window?.fbq !== "undefined") {
                          window?.fbq("track", "AddToCart", {
                            content_category: item.itemClassification,
                            content_ids: item.id,
                            content_type: "product",
                            value: item.price.value,
                            currency: item.price.currencyCode,
                          });
                        }
                      }}
                      decreaseItemQtyInCart={
                        item.itemLensType === "CONTACT_LENS" ||
                        item.itemClassification?.toUpperCase() ===
                          "CONTACT_LENS"
                          ? () => {
                              confirmDelete(item.id);
                              removeFromCartGA(item, userInfo);
                              removeFromCartGA4(
                                item,
                                userInfo.isLogin,
                                pageInfo
                              );
                            }
                          : () => {
                              onDecreaseItem(
                                item.id,
                                item.itemQty,
                                item.itemClassification,
                                item?.itemId
                              );
                              removeFromCartGA(item, userInfo);
                              removeFromCartGA4(
                                item,
                                userInfo.isLogin,
                                pageInfo
                              );
                            }
                      }
                      removeItemFromCart={() => {
                        confirmDelete(item.id);
                        removeFromCartGA4(item, userInfo.isLogin, pageInfo);
                      }}
                      itemUrl={pageInfo.subdirectoryPath + hrefLink}
                    />
                  );
                })}
                {!userInfo?.isLogin && (
                  <>
                    <Alert
                      color={AlertColorsENUM.white}
                      componentSize={ComponentSizeENUM.medium}
                      font={TypographyENUM.lkSansRegular}
                      id="Alert"
                      boxShadow={true}
                      style
                    >
                      <Flex
                        style={{ padding: "12px 4px", cursor: "pointer" }}
                        onClick={() => {
                          width < 1024
                            ? setBottomSheet(!bottomSheet)
                            : setshowAuthModal(true);
                          setIsHomeGuestFlow(false);
                        }}
                      >
                        <span>{LOGIN_TO_SEE_EXISTING}</span>
                        <TextButton isRTL={pageInfo.isRTL}>
                          <Icons.RightArrow />
                        </TextButton>
                      </Flex>
                    </Alert>
                  </>
                )}

                {
                  cartData?.offerDetails && (
                    <GoldMembershipNew
                      cartTotal={cartData?.cartTotal}
                      cartItems={cartData?.cartItems}
                      subdirectoryPath={pageInfo.subdirectoryPath}
                      offerDetails={cartData?.offerDetails}
                      showTax={country === "in"}
                      currencySymbol={getCurrency(country)}
                      id="offers"
                      width="100"
                      tagText="active"
                      cartSubTotal={cartData?.cartSubTotal}
                      headText="Gold Membership"
                      subText="Hurray! Buy 1 Get 1 applied to cart"
                      descText="You are saving ₹1600 on this order"
                      font={TypographyENUM.lkSansRegular}
                      isRTL={pageInfo.isRTL}
                      addOfferToCart={({ productId }: { productId: number }) =>
                        dispatch(
                          addToCartNoPower({
                            pid: productId,
                            sessionId: getCookie(COOKIE_NAME),
                          })
                        )
                      }
                    />
                  ) // <Offers
                  //   id="offers"
                  //   width="100"
                  //   tagText="active"
                  //   headText="Gold Membership"
                  //   subText="Hurray! Buy 1 Get 1 applied to cart"
                  //   descText="You are saving ₹1600 on this order"
                  //   offerDetail={cartData?.offerDetails}
                  //   finalTotal={cartData?.cartTotal}
                  //   addOfferToCart={({ productId }: { productId: number }) =>
                  //     dispatch(
                  //       addToCartNoPower({
                  //         pid: productId,
                  //         sessionId: userInfo.sessionId || sessionId,
                  //       })
                  //     )
                  //   }
                  //   font={TypographyENUM.lkSansRegular}
                  // />

                  /* {cartData?.offerDetails ? (
              <GoldMembershipNew 
                offerDetails={cartData?.offerDetails}
                currencySymbol={getCurrency(pageInfo.country) || "₹"}
                localeInfo={localeData}
                addOfferToCart={({productId}: {productId: number}) => dispatch(addToCartNoPower({pid: productId, sessionId: sessionId}))} 
                isMobileView={pageInfo.deviceType === DeviceTypes.MOBILE}
                cartItems={cartData?.cartItems}
                cartTotal={cartData?.cartTotal}
              />
            ) : null} */
                }
                <div
                  style={{ marginTop: "20px" }}
                  onClick={() => setIsHomeGuestFlow(false)}
                >
                  <ApplyCoupon
                    id="ApplyCoupon"
                    width="100"
                    isMobileView
                    headText={
                      couponCode ? `${couponCode} applied` : "Apply Coupon"
                    }
                    subText={
                      couponAmount ? (
                        <span>
                          {/* <Icons.Tick /> */}
                          {config.YOU_ARE_SAVING} {getCurrency(country) || "₹"}
                          {couponAmount} {localeData?.ON_YOUR_FINAL_BILL}
                        </span>
                      ) : (
                        config.CHECK_AVAILABLE_OFFERS
                      )
                    }
                    isApplied={couponCode.length > 0}
                    onClick={
                      userInfo.isLogin
                        ? () => toggleSideBar()
                        : () => setBottomSheet(!bottomSheet)
                    }
                    onRemoveClick={() => applyGvHandler(couponCode, "remove")}
                    font={TypographyENUM.lkSansRegular}
                    isRTL={pageInfo.isRTL}
                  />
                </div>

                <div style={{ margin: "24px 0 24px 0" }}>
                  <HeadingText
                    styledFont={TypographyENUM.lkSansMedium}
                    onClick={() => setMsgDrop(!msgDrop)}
                    isMobileView={true}
                  >
                    {BILL_DETAILS}
                  </HeadingText>
                </div>
                <NewPriceBreakup
                  id="1"
                  width="100"
                  dataLocale={localeData}
                  priceData={cartData?.cartTotal}
                  showCart={false}
                  infoText={cartData?.taxMessage?.split("\n")}
                  currencyCode={getCurrency(pageInfo.country)}
                  isMobileView
                  enableTax={configData?.ENABLE_TAX}
                />
                <div>
                  {productList?.length && cartData?.cartItems?.length !== 0 ? (
                    <CartWishlist
                      productList={productList}
                      mobileView
                      slidesToShow={1.4}
                      wishlistLength={productList?.length}
                      isTaxable={configData?.SHOW_PACKAGE_SCREEN_TAX_TEXT}
                    />
                  ) : null}
                </div>
                {/* <ApplyCouponBar
                  mobileView={pageInfo.deviceType === DeviceTypes.MOBILE}
                  applyGvHandler={applyGvHandler}
                  appliedCoupon={couponCode}
                  applicableGvs={cartData?.applicableGvs}
                  SORRY_NO_COUPON={localeData.SORRY_NO_COUPON}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                  errMsg={errMsg}
                  setErrorMsg={setErrorMsg}
                  font={TypographyENUM.lkSansRegular}
                /> */}
                <FloatingCta
                  isRTL={pageInfo.isRTL}
                  onClick={(e: any) => {
                    dispatch(resetAuth());
                    navigateToCheckout(e, true);
                    setIsHomeGuestFlow(true);
                  }}
                  text={placeOrderButtonText}
                  isContactLensConsentEnabled={isContactLensConsentEnabled}
                  deviceType={pageInfo?.deviceType}
                  toggleChecked={toggleChecked}
                  isContactLensCheckboxChecked={isContactLensCheckboxChecked}
                  localeData={localeData}
                  configData={configData}
                />
                {configData.ISSERVICELIST && (
                  <div style={{ marginTop: "20px" }}>
                    <ServiceList mobileView />
                  </div>
                )}
                {configData && configData?.CART_LENSKART_PROMISE_ACTIVE && (
                  <WhiteBG>
                    <LenskartPromise
                      localeData={localeData}
                      configData={configData}
                    />
                  </WhiteBG>
                )}
              </React.Fragment>
            ) : (
              <MobileEmptyCart
                mobileView
                homeFunction={() => router.push("/")}
                wishListFunction={() => router.push("/shortlist")}
                // if we want to show footer in empty cart pass here FooterTemp function instead of empty function
                FooterTemp={() => {}}
                dataLocale={localeData}
              />
            )}
          </CartWrapper>
        </>
      )}
    </div>
  );

  return deviceType === DeviceTypes.MOBILE ? mobileView : desktopView;
};

export default Cart;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable =
    hasCookie(`clientV1_${country}`, { req, res }) &&
    getCookie(COOKIE_NAME, { req, res }) !== "";
  let currentSessionId;
  if (!isSessionAvailable) {
    const sessionAPI = createAPIInstance({ method: APIMethods.POST });
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      sessionAPI
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(COOKIE_NAME, sessionId.sessionId, { req, res });
    currentSessionId = sessionId.sessionId;
  } else {
    currentSessionId = `${getCookie(COOKIE_NAME, { req, res })}`;
  }
  const api = createAPIInstance({ sessionToken: currentSessionId });
  const configApi = createAPIInstance({
    url: `${process.env.NEXT_PUBLIC_CONFIG_URL}`,
  });

  const promises = [
    fireBaseFunctions.getConfig(LOCALE, configApi),
    fireBaseFunctions.getConfig(CONFIG, configApi),
    sessionFunctions.validateSession(api),
  ];

  const [
    { data: localeData, error: localeDataError },
    { data: configData, error: configError },
    { data: userData, error: userError },
  ] = await Promise.all(promises);

  if (localeDataError.isError || configError.isError || userError.isError) {
    return {
      notFound: true,
    };
  }

  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });
  return {
    props: {
      sessionId: `${getCookie(`clientV1_${country}`, { req, res })}`,
      localeData: localeData,
      configData: configData,
      userData: userData.customerInfo,
    },
  };
};
