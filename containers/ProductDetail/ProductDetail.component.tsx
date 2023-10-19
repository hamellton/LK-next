//> Default Imports
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import { getCookie } from "@/helpers/defaultHeaders";

import { AppDispatch, RootState } from "@/redux/store";

//> Packages
import {
  Modal,
  Breadcrumbs,
  PDP as PDPComponents,
  Accordions,
  Divider,
  OutOfStock,
  ToastMessage,
} from "@lk/ui-library";
import { APIService, extractUtmParams, localStorageHelper } from "@lk/utils";
import { pdpFunctions } from "@lk/core-utils";

//> Styles
import {
  ProductDetailWrapper,
  AsideWrapper,
  BreadcrumbsWrapper,
  CloseButton,
  CMSWrapper,
  OutOfStockWrapper,
  PDPWrapper,
  RichContentWrapper,
  ProductDetailMobileWrapper,
  BannerWrapper,
  ProductDetailsWrapper,
  Title,
  ContactLensCarouselContainer,
  RecentlyViewedWrapper,
  ProductImagesWithDittoWrapper,
  WhiteBG,
  DeliveryText,
  ProductAndOfferWrapper,
  SellerLabel,
} from "./ProductDetail.styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//> Redux Slices
import { addToCartNoPower } from "@/redux/slices/cartInfo";
import { fetchPackageSteps } from "@/redux/slices/packagesInfo";
import {
  deleteOneWishlist,
  saveToWishlist,
  setWishListShow,
} from "@/redux/slices/wishListInfo";

//>Types
import { TypographyENUM, ComponentSizeENUM } from "@/types/baseTypes";
import { APIMethods } from "@/types/apiTypes";
import { PowerTypeList, ProductDetailTypes } from "./ProductDetail.types";

// import { localStorageHelper } from "@lk/utils";
//> Components
import ImageGrid from "@/components/PDP/ImageGrid/ImageGrid.component";
import PackageSection from "@/components/PDP/Package/Package.component";
import ContactLensSelectPower from "@/components/PDP/CLSelectPower/CLSelectPower.component";
import CLInfo from "@/components/PDP/CLInfo/CLInfo.component";
import CMS from "containers/CMS/CMS.component";

//> Helpers
import getProductAdditionalInfo from "./productAdditionalInfo";
import { headerArr } from "helpers/defaultHeaders";
import { searchPageLoad, userProperties } from "helpers/userproperties";

//> Ga4
import { addToWishListGA4, ctaClickEvent, viewItemGA4 } from "helpers/gaFour";

import {
  getCygnusOverlayImage,
  getDittoProfiles,
  setDittoImageLoading,
  setTryOnActive,
} from "@/redux/slices/ditto";
import { InfoPopUp, Spinner } from "@lk/ui-library";
// import { TechnicalDetails } from '@lk/ui-library'
import ProductReviews from "@/components/PDP/Mobile/Reviews/ProductReviews";
import Link from "next/link";
import {
  getGSTPrice,
  isEmptyObject,
  modifyProductData,
  SubDomain,
} from "./helper";
import ProductDeliveryMobile from "@/components/PDP/Mobile/ProductDelivery/ProductDelivery";
import TryAtHomeAndStoresButton from "@/components/PDP/Mobile/TryAtHomeAndStoreButton/TryAtHomeAndStoresButton";
import { TechnicalDetails } from "@lk/ui-library";
import { ProductDetailsMobile } from "@lk/ui-library";
import { ItemDelivery } from "@lk/ui-library";
import { OfferDisplay } from "@lk/ui-library";
import RecentlyViewedProducts from "@/components/PDP/Mobile/RecentlyViewedProducts/RecentlyViewedProducts";
import Information from "@/components/PDP/Mobile/Information/Information";
import ProductCTA from "@/components/PDP/Mobile/ProductCTA/ProductCTA";
import RelatedProducts from "@/components/PDP/Mobile/RelatedProducts/RelatedProducts";
import ProductImagesWithDitto from "@/components/PDP/Mobile/ProductImagesWithDitto/ProductImagesWithDitto";
import ColorOptions from "@/components/PDP/Mobile/ColorOptions/ColorOptions";
import { DeviceTypes } from "@/types/baseTypes";
import {
  postOosSubscription,
  updateProductDetailLoading,
} from "@/redux/slices/productDetailInfo";
import { getUserEventData, reDirection } from "containers/Base/helper";
import NewCLSelectPower from "@/components/PDP/NewClSelectPower/NewCLSelectPower";
import {
  getPrescriptionDataWithPowerType,
  getSavedPrescriptionData,
} from "@/redux/slices/prescription";
import LenskartPromise from "@/components/PDP/Mobile/ProductDelivery/LenskartPromise";
import {
  LAST_PAGE_VISIT_NAME,
  QUERY_SUGGESTION_CLICK_FROM,
} from "@/constants/index";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { setCookie } from "@/helpers/defaultHeaders";
import { updatePageLoaded } from "@/redux/slices/pageInfo";
import { productVirtualPageView } from "helpers/virtualPageView";
import Head from "next/head";
import {
  getBreadcrumbSchema,
  getOffersSchema,
  getProductSchema,
  getRatingSchema,
  getReviewSchema,
} from "helpers/schemaHelper";
import { removeDomainName } from "helpers/utils";
import RecommendedProducts from "@/components/PDP/Mobile/RecommendedProducts/RecommendedProducts";
import { passUtmData } from "@/redux/slices/userInfo";

const ProductDetail = ({
  productDetailData,
  id,
  sessionId,
  configData,
  localeData,
  exchangeFlow,
  categoryData,
}: ProductDetailTypes) => {
  const [isOOStockSaved, setIsOOStockSaved] = useState<boolean | number>(false);
  useEffect(() => {
    if (configData?.ENABLE_POSTPAY) {
      const script = document.createElement("script");
      script.src = "https://cdn.postpay.io/v1/js/postpay.js";
      script.async = true;
      document.head.appendChild(script);
    }
    if (typeof window?.fbq !== "undefined") {
      window?.fbq("track", "ViewContent", {
        content_name: productDetailData?.productName,
        content_category: productDetailData?.type,
        content_ids: [productDetailData.id],
        content_type: "product",
        value: productDetailData.price.lkPrice,
        currency: productDetailData.price.currency,
      });
    }
  }, []);
  // console.log(pageInfo);

  useEffect(() => {
    let _isOOStockSaved =
      (typeof window !== "undefined" &&
        sessionStorage.getItem("outOfStockList") !== null &&
        sessionStorage.getItem("outOfStockList")?.indexOf(id)) ||
      false;

    setIsOOStockSaved(_isOOStockSaved);
  }, []);

  const router = useRouter();

  const isDesktopNearby = configData.SHOW_DESKTOP_NEARBY_STORE || false;
  const isDesktopDelivery = configData.SHOW_DESKTOP_CDO || false;
  const { isExchangeFlow } = exchangeFlow;
  // > redis configs - msite
  const {
    frameSizeConfig,
    SHOW_EYE_TEST_BANNER,
    PDP_CONFIG,
    PDP_OFFER_BANNER,
  } = configData;
  const sizeQuizConfig = frameSizeConfig ? JSON.parse(frameSizeConfig) : {};
  const { showFrameSizeButtonInPdp = true, frameSizeBannerInPdp } =
    sizeQuizConfig;
  const bannerDetails = SHOW_EYE_TEST_BANNER
    ? JSON.parse(SHOW_EYE_TEST_BANNER)
    : {};
  const pdpConfig = PDP_CONFIG ? JSON.parse(PDP_CONFIG) : {};

  //> Redux States
  const dispatch = useDispatch<AppDispatch>();
  const { productIds: wishlistPIDs } = useSelector(
    (state: RootState) => state.wishListInfo
  );
  const { isLogin } = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  let pageName = "pdp-page";
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { dittoProfiles, cygnus } = useSelector(
    (state: RootState) => state.dittoInfo
  );
  const page = useSelector((state: RootState) => state.pageInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);

  const deviceType = page.deviceType;
  const { reviewsData, oosSubscription, productDetailLoading } = useSelector(
    (state: RootState) => state.productDetailInfo
  );

  //> Local States
  const [returnOrderId, setReturnOrderId] = useState<number | null>(null);
  const [returnItemId, setReturnItemId] = useState<number | null>(null);
  const [powerData, setPowerData] = useState<PowerTypeList[] | []>([]);
  const [showPowerTypeModal, setShowPowerTypeModal] = useState(false);
  const [showCMSInfoModal, setShowCSMInfoModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isWishListSelected, setIsWishListSelected] = useState<boolean>(
    (wishlistPIDs && wishlistPIDs.includes(`${id}`)) || false
  );
  const [fireUserProperties, setFireUserProperties] = useState(false);

  useEffect(() => {
    localStorage.setItem(LAST_PAGE_VISIT_NAME, pageName);
  }, []);
  const recommendedCats = localStorageHelper.getItem(
    `recentlyViewedCategories_${pageInfo?.country}`
  );

  useEffect(() => {
    if (sessionId) {
      dispatch(getDittoProfiles({ sessionId: sessionId }));
    }
  }, [sessionId]);

  //> Check if Wishlist should be selected or not
  useEffect(() => {
    setIsWishListSelected(
      (wishlistPIDs && wishlistPIDs.includes(`${id}`)) || false
    );
  }, [id, wishlistPIDs]);

  useEffect(() => {
    if (fireUserProperties) {
      userProperties(
        userInfo,
        pageName,
        pageInfo,
        configData,
        "product-detail-page"
      );
      if (Object.keys(productDetailData).length > 0) {
        const productListingInfo =
          (localStorageHelper.getItem("productListingInfo") &&
            JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
          {};
        const item_list_id =
          productListingInfo?.[productDetailData?.id]?.["item_list_id"];
        const item_list_name =
          productListingInfo?.[productDetailData?.id]?.["item_list_name"];
        const index = productListingInfo?.[productDetailData?.id]?.["index"];
        const searchType =
          localStorage.getItem(QUERY_SUGGESTION_CLICK_FROM) ?? "";
        const query: any = sessionStorageHelper.getItem("query");
        if (location.search.includes("search=true")) {
          searchPageLoad(
            userInfo,
            searchType,
            sessionStorageHelper.getItem("query"),
            "successful"
          );
          viewItemGA4(
            productDetailData,
            userInfo?.isLogin,
            pageInfo,
            item_list_id,
            item_list_name,
            index,
            query,
            "search",
            searchType
          );
        } else
          viewItemGA4(
            productDetailData,
            userInfo?.isLogin,
            pageInfo,
            item_list_id,
            item_list_name,
            index
          );
        const utmParameters =
          typeof window !== "undefined" &&
          window &&
          extractUtmParams(window.location.search);
        productVirtualPageView(
          userInfo,
          utmParameters,
          pageInfo,
          cartData,
          productDetailData
        );
      }
    }
  }, [fireUserProperties]);

  useEffect(() => {
    if (!userInfo.userLoading) {
      setTimeout(() => {
        setFireUserProperties(true);
      }, 500);
    }
  }, [userInfo.userLoading, pageInfo]);

  // useEffect(() => {
  //   if (Object.keys(productDetailData).length > 0) {
  //     const productListingInfo =
  //       (localStorageHelper.getItem("productListingInfo") &&
  //         JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
  //       {};
  //     const item_list_id =
  //       productListingInfo?.[productDetailData?.id]?.["item_list_id"];
  //     const item_list_name =
  //       productListingInfo?.[productDetailData?.id]?.["item_list_name"];
  //     const index = productListingInfo?.[productDetailData?.id]?.["index"];
  //     viewItemGA4(
  //       productDetailData,
  //       userInfo?.isLogin,
  //       item_list_id,
  //       item_list_name,
  //       index
  //     );
  //     const utmParameters =
  //       typeof window !== "undefined" &&
  //       window &&
  //       extractUtmParams(window.location.search);
  //     productVirtualPageView(
  //       userInfo,
  //       utmParameters,
  //       pageInfo,
  //       cartData,
  //       productDetailData
  //     );
  //   }
  // }, [productDetailData]);

  //> Fetch Contact Lens Powers
  useEffect(() => {
    if (productDetailData.classification === "contact_lens" && sessionId) {
      (async () => {
        const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
          .setHeaders(headerArr)
          .setMethod(APIMethods.GET);
        api.sessionToken = sessionId;
        const { data: powerData, error } = await pdpFunctions.fetchPowers(
          productDetailData.id,
          api,
          "contact_lens"
        );
        if (error.isError) {
          setPowerData([]);
        } else {
          setPowerData(powerData.powerTypeList || []);
        }
      })();
    }
  }, [
    productDetailData.classification,
    productDetailData.id,
    sessionId,
    isLogin,
  ]);
  //> Set Exchange related Cookies
  const setExchangeCookies = () => {
    const postCheckOrderCookie = getCookie("postcheckOrderId");
    if (typeof postCheckOrderCookie === "string")
      setReturnOrderId(parseInt(postCheckOrderCookie));
    else setReturnOrderId(null);

    const postCheckItemCookie = getCookie("postcheckItemId");
    if (typeof postCheckItemCookie === "string")
      setReturnItemId(parseInt(postCheckItemCookie));
    else setReturnItemId(null);
  };

  //> Add to Cart - With Power
  const addToCartWithPower = () => {
    setShowPowerTypeModal(true);
    const reqObj = {
      classification: productDetailData.classification,
    };
    dispatch(fetchPackageSteps(reqObj));
  };

  //> Add to Cart - Only Lens
  const addToCartNoPowerHandler = (powerType?: string, quantity?: string) => {
    if (typeof window?.fbq !== "undefined") {
      window?.fbq("track", "AddToCart", {
        content_category: productDetailData.classification,
        content_ids: productDetailData.id,
        content_type: "product",
        value: productDetailData.price.lkPrice,
        currency: productDetailData.price.currency,
      });
    }
    if (powerType) {
      const reqObj: {
        pid: number;
        sessionId: string;
        powerType: string;
        orderId?: number;
        itemId?: number;
      } = {
        pid: productDetailData.id,
        powerType: powerType,
        sessionId: sessionId,
      };
      if (isExchangeFlow) setExchangeCookies();
      if (returnOrderId) reqObj.orderId = returnOrderId;
      if (returnItemId) reqObj.itemId = returnItemId;
      dispatch(addToCartNoPower(reqObj));
      setShowPowerTypeModal(false);
    } else if (quantity) {
      const reqObj: {
        pid: number;
        sessionId: string;
        orderId?: number;
        itemId?: number;
        quantity: string;
      } = {
        pid: productDetailData.id,
        sessionId: sessionId,
        quantity: quantity,
      };
      if (isExchangeFlow) setExchangeCookies();
      if (returnOrderId) reqObj.orderId = returnOrderId;
      if (returnItemId) reqObj.itemId = returnItemId;
      dispatch(addToCartNoPower(reqObj));
      // Router.push("/cart");
    } else {
      const reqObj: {
        pid: number;
        sessionId: string;
        orderId?: number;
        itemId?: number;
      } = {
        pid: productDetailData.id,
        sessionId: sessionId,
      };
      if (isExchangeFlow) setExchangeCookies();
      if (returnOrderId) reqObj.orderId = returnOrderId;
      if (returnItemId) reqObj.itemId = returnItemId;
      dispatch(addToCartNoPower(reqObj));
      // Router.push("/cart");
    }
    // Router.push("/cart");
  };

  useEffect(() => {
    if (!cartData?.cartIsLoading && cartData?.cartPopupError) {
      setShowToast(true);
    }
  }, [cartData?.cartIsLoading, cartData?.cartPopupError]);

  //> Handle Delete item from wishlist or Add item to wishlist
  const onWishListClick = async (pid: number) => {
    const eventName = "cta_click";
    const cta_name = "wishlist-add";
    const cta_flow_and_page = "product-detail-page";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
    if (isWishListSelected) {
      dispatch(
        deleteOneWishlist({
          productId: productDetailData.id,
          sessionId: sessionId,
          subdirectoryPath: pageInfo.subdirectoryPath,
        })
      );
      if (deviceType === DeviceTypes.MOBILE)
        dispatch(
          setWishListShow({ show: true, url: router.asPath, isRemoved: true })
        );
    } else {
      const reqObj: {
        productId: number;
        sessionId: string;
        subdirectoryPath: string;
        url: string;
      } = {
        productId: productDetailData.id,
        sessionId: sessionId,
        subdirectoryPath: pageInfo.subdirectoryPath,
        url: router.asPath,
      };
      addToWishListGA4(productDetailData, userInfo.isLogin, pageInfo);
      dispatch(saveToWishlist(reqObj));
    }
  };

  //> Get CMS URL
  const frameSizeData =
    productDetailData.generalProductInfo &&
    productDetailData.generalProductInfo?.find(
      (info) => info.name_en === "Frame Size" || info.name === "Frame Size"
    );
  const cmsUrl = frameSizeData?.additionalInfoUrl;

  //> Show / Hide CMS Modal
  const cmsInfoHandler = () => {
    setShowCSMInfoModal(!showCMSInfoModal);
  };

  //> Redirect to Ditto handler
  const onClickTryOn = () => {
    const guestId = getCookie("dittoGuestId") || "";

    if (guestId || userInfo?.userDetails?.cygnus?.cygnusId) {
      dispatch(setTryOnActive(true));
    } else {
      reDirection(pageInfo.subdirectoryPath);
      localStorage.setItem("DittoOn", "true");
      setCookie("isDitto", "true");
    }
  };

  useEffect(() => {
    const guestId = getCookie("dittoGuestId") || "";
    const showDitto = JSON.parse(
      localStorage.getItem("DittoOn") || "" || "false"
    );

    if (
      (guestId || userInfo?.userDetails?.cygnus?.cygnusId) &&
      showDitto === true
    ) {
      // localStorage.setItem("DittoOn", "true");
      dispatch(setTryOnActive(true));
    }
    return () => {
      dispatch(updatePageLoaded(false));
    };
  }, []);
  // > fetch saved prescription data if user logs in on pdp
  // useEffect(() => {
  //   if (userInfo?.userDetails?.id) {
  //     getSavedPrescriptionData({ sessionId: userInfo?.sessionId });
  //     dispatch(
  //       getPrescriptionDataWithPowerType({
  //         sessionId: userInfo?.sessionId,
  //         powerType: "CONTACT_LENS",
  //       })
  //     );
  //   }
  // }, [userInfo?.userDetails?.id]);

  const {
    PRODUCT_OFFERID_CONFIG_MOBILE,
    FACE_ANALYSIS,
    PRODUCTS_GST,
    EXCHANGE_CONFIG,
    VC_FULL_RIM,
    VC_HALF_RIM,
    VC_RIMLESS,
    SHOW_BUY_ON_CHAT,
    BUY_ON_CALL_WIDGET,
    APP_DOWNLOAD_PUSH_CONFIG,
    MISSCALL_CONFIG,
    SHOW_CONTACT_LENS_CAROUSEL,
    TRY_FRAMES_3D_BANNER,
    DISABLE_BUY_CALL,
    WHATSAPP_CHAT_URL,
  } = configData || {};

  const disableBuyOnCall = DISABLE_BUY_CALL && DISABLE_BUY_CALL === "ON";
  const {
    ORDER,
    ON_PHONE,
    SUB_TEXT_3,
    INCLUDES_FREE_SHIPPING,
    DELIVERY_CHARGES_MAY_APPLY,
    INCLUDING_POWER_LENSES,
    ABOUT_THE_PRODUCT,
    PRODUCT_DETAILS,
    TECHNICAL_INFORMATION,
  } = localeData || {};

  const buyOnChat = SHOW_BUY_ON_CHAT ? JSON.parse(SHOW_BUY_ON_CHAT) : {};
  const buyWithCallConfig =
    BUY_ON_CALL_WIDGET && JSON.parse(BUY_ON_CALL_WIDGET);
  const isBuyOnChat = buyWithCallConfig && buyWithCallConfig.buyonchat;

  const appPushConfig =
    (APP_DOWNLOAD_PUSH_CONFIG && JSON.parse(APP_DOWNLOAD_PUSH_CONFIG)) || {};
  const showAppPush =
    appPushConfig.pdp &&
    appPushConfig.pdp.appDownloadPush === "ON" &&
    appPushConfig.pdp.classification &&
    appPushConfig.pdp.classification.includes(productDetailData.classification);

  const missCallConfig = MISSCALL_CONFIG ? JSON.parse(MISSCALL_CONFIG) : {};
  let missCallBackConfig: { enabled?: boolean; callbackPhoneNumber?: number } =
      {},
    redisShowCallbackModal = false,
    callbackPhoneNumber;
  if (Object.keys(missCallConfig).length > 0) {
    missCallBackConfig =
      productDetailData?.classification?.indexOf("contact_lens") > -1
        ? missCallConfig.contact_lens
        : missCallConfig.default;
  }
  if (missCallBackConfig && missCallBackConfig?.enabled) {
    redisShowCallbackModal = true;
  }
  if (missCallBackConfig && missCallBackConfig.callbackPhoneNumber) {
    callbackPhoneNumber = missCallBackConfig.callbackPhoneNumber;
  }

  const showContactLensCarousel = SHOW_CONTACT_LENS_CAROUSEL
    ? JSON.parse(SHOW_CONTACT_LENS_CAROUSEL)?.mobile
    : false;

  let { suitedFor, lenskartPrice, powerOption, gender, productLensTypeDesc } =
    modifyProductData(productDetailData);

  let powerInfoText = INCLUDES_FREE_SHIPPING;
  if (lenskartPrice < 501 && productDetailData.type !== "Contact Lens") {
    powerInfoText = DELIVERY_CHARGES_MAY_APPLY;
  }
  if (productDetailData.type === "Eyeglasses") {
    powerInfoText = INCLUDING_POWER_LENSES;
  }

  const frameAnalysis = FACE_ANALYSIS ? JSON.parse(FACE_ANALYSIS) : {};
  const frameWidthLabels =
    frameAnalysis &&
    frameAnalysis.faceAnalysisConfig &&
    frameAnalysis.faceAnalysisConfig.labels;
  const frameWidth = productDetailData?.frameDetails?.find(
    (width: { name: string; name_en: string }) =>
      (width.name_en || width.name).toLowerCase() === "width"
  );
  const productgst = PRODUCTS_GST ? JSON.parse(PRODUCTS_GST) : {};

  let subSelection = "default";
  if (isLogin) {
    subSelection = userInfo?.userDetails?.hasPlacedOrder ? "repeat" : "new";
  }
  const productOfferIdDetails =
    PRODUCT_OFFERID_CONFIG_MOBILE &&
    PRODUCT_OFFERID_CONFIG_MOBILE[productDetailData.offerText] &&
    PRODUCT_OFFERID_CONFIG_MOBILE[productDetailData.offerText][subSelection];

  const pdpOfferEnabled =
    PRODUCT_OFFERID_CONFIG_MOBILE &&
    PRODUCT_OFFERID_CONFIG_MOBILE[productDetailData.offerText] &&
    PRODUCT_OFFERID_CONFIG_MOBILE[productDetailData.offerText].pdp_ipl;

  const exchangeConfig = EXCHANGE_CONFIG && JSON?.parse(EXCHANGE_CONFIG);
  const exchangeFreeText = exchangeConfig && exchangeConfig.EXCHANGE_FREE_TEXT;
  const exchangeText = exchangeConfig && exchangeConfig.EXCHANGE_TEXT;

  const BUYONCHAT_HELP_CTA_PDP = buyOnChat.content;
  const whatsAppChatMsg =
    WHATSAPP_CHAT_URL &&
    buyOnChat &&
    `${WHATSAPP_CHAT_URL}${BUYONCHAT_HELP_CTA_PDP}${id}`.replace(
      "<phoneNumber>",
      buyOnChat.number
    );
  const handleFindMyFitClick = () => {
    const { classification } = productDetailData;
    let sizeQuizUrl = "/frame-size";
    if (classification === "eyeframe" || classification === "sunglasses") {
      // onFindMyFitClick();
    }
    if (gender && gender?.indexOf("Kid") !== -1) {
      sizeQuizUrl = "/frame-size-guide";
    } else if (!isEmptyObject(sizeQuizConfig)) {
      sizeQuizUrl = sizeQuizConfig.enabled
        ? "/frame-size"
        : sizeQuizConfig.disabledUrl;
    }
    Router.push(sizeQuizUrl);
  };

  const onSelectContactLensColor = (index: number) => {
    dispatch(updateProductDetailLoading(true));
    const data = productDetailData?.additionalOptions;
    window.location.href = `/product/${data?.optionsMapping[index]?.productId}`;
    dispatch(updateProductDetailLoading(false));
  };

  const onClickAdditionalInfo = (url) => {
    Router.push(url);
  };

  const handleReviewClick = () => {
    const scrollTop =
      document && document?.getElementById("review-container")?.offsetTop;
    window.scrollTo({
      behavior: "smooth",
      top:
        (document &&
          document?.getElementById("review-container")?.offsetTop - 60) ||
        0,
    });
  };

  const triggerUTMData = () => {
    const userEventDataObj = getUserEventData("BUY_ON_CHAT");

    dispatch(
      passUtmData({
        sessionId: getCookie(`clientV1_${pageInfo.country}`)?.toString(),
        eventObj: userEventDataObj,
      })
    );
  };

  const onclickBuyonChat = () => {
    const eventName = "cta_click";
    const cta_flow_and_page = "product-detail-page";
    const cta_name = "buy-on-call";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);

    triggerUTMData();

    window.open(whatsAppChatMsg, "_self");
  };
  const orderOnPhone = {
    sub_text_1: ORDER,
    sub_text_2: ON_PHONE,
    sub_text_3: SUB_TEXT_3,
    logo: "https://static.lenskart.com/media/mobile/universal/assets/call.png",
  };

  const keepMePosted = (mobile: number, email: string) => {
    const body = {
      product_id: productDetailData?.id,
      subscription_email: email,
      subscription_number: mobile,
      related_product: "",
      sessionId: sessionId,
    };
    dispatch(postOosSubscription(body));
  };

  useEffect(() => {
    if (oosSubscription.data?.message) {
      let outOfStockList = sessionStorage.getItem("outOfStockList")
        ? JSON.parse(
            (sessionStorage.getItem("outOfStockList") || "[]").toString()
          )
        : [];
      if (outOfStockList.indexOf(id) === -1) {
        if (typeof outOfStockList === "string") {
          outOfStockList = JSON.parse(outOfStockList);
        }
        outOfStockList.push(id);
        sessionStorage.setItem(
          "outOfStockList",
          JSON.stringify(outOfStockList)
        );
      }
    }
  }, [oosSubscription]);

  const isHustlrProduct = productDetailData.isQuickCheckout;

  // const handleWishListClick = ( ) => {
  //   if(isWishListSelected){
  //     dispatch(
  //       deleteOneWishlist({
  //         productId: productDetailData.id,
  //         sessionId
  //       })
  //     )
  //   }else{
  //     dispatch(saveToWishList({productId: productDetailData.id, sessionId}))
  //   }
  // }
  const modBreadcrumbData = useMemo(() => {
    return productDetailData?.breadcrumb?.map((ctg) => {
      if (!!ctg.link) {
        if (ctg?.link?.indexOf("www.lenskart.com") === -1) {
          return {
            ...ctg,
            link: `${
              pageInfo.subdirectoryPath
                ? `${pageInfo.subdirectoryPath?.substring(1)}/`
                : ""
            }${ctg?.link}`,
          };
        } else
          return {
            ...ctg,
            link: `${
              pageInfo.subdirectoryPath
                ? `${pageInfo.subdirectoryPath?.substring(1)}/`
                : ""
            }${ctg?.link}`,
          };
      } else return ctg;
    });
  }, [productDetailData.breadcrumb, pageInfo.subdirectoryPath]);

  const productGeneralInfo = useMemo(() => {
    return productDetailData?.generalProductInfo?.map((ctg) => {
      if (!!ctg.additionalInfoUrl) {
        if (
          ctg?.additionalInfoUrl?.includes("www.lenskart.com") ||
          ctg?.additionalInfoUrl?.includes("www.lenskart.sg")
        ) {
          return {
            ...ctg,
            additionalInfoUrl: `${SubDomain(ctg?.additionalInfoUrl)}`,
          };
        }
      } else return ctg;
    });
  }, [productDetailData.generalProductInfo, pageInfo.subdirectoryPath]);

  const productTechnicalInfo = useMemo(() => {
    return productDetailData?.technicalProductInfo?.map((ctg) => {
      if (!!ctg.additionalInfoUrl) {
        if (
          ctg?.additionalInfoUrl?.includes("www.lenskart.com") ||
          ctg?.additionalInfoUrl?.includes("www.lenskart.sg")
        ) {
          return {
            ...ctg,
            additionalInfoUrl: `${SubDomain(ctg?.additionalInfoUrl)}`,
          };
        }
      } else return ctg;
    });
  }, [productDetailData.technicalProductInfo, pageInfo.subdirectoryPath]);

  /*
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "Lenskart Air LA E13511AF",
    image:
      "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/628x301/9df78eab33525d08d6e5fb8d27136e95//l/e/lenskart-air-la-e13511af-c2-eyeglasses_g_0594.jpg",
    description:
      "Buy Our Lenskart Air Transparent TR90 Wayfarer Spectacles Online || 143733",
    mpn: "143733",
    sku: "eye:lenskart-air-la-e13511af-c2-eyeglasses",
    brand: { "@type": "Brand", name: "Lenskart Air" },
    model: "LA E13511AF",
    itemCondition: "https://schema.org/NewCondition",
    offers: {
      "@type": "Offer",
      priceCurrency: "SGD",
      price: "98",
      priceValidUntil: "2024-06-8",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      url: "https://www.lenskart.sg/lenskart-air-la-e13511af-c2-eyeglasses.html",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 5,
      reviewCount: 3,
      itemReviewed: { "@type": "Organization", name: "Anonymous" },
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Wong C." },
        itemReviewed: { "@type": "Person", name: "Wong C." },
        datePublished: "2023-03-26",
        description:
          "3rd day wearing it, still getting used to it but it is doing great so far, wanna thanks the Yishun Outlet staffs for their services too, and I was able to pick up my 1FOR 1 orders the next day",
        name: "New Spectacle Review (3rd day)",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Cheris L." },
        itemReviewed: { "@type": "Person", name: "Cheris L." },
        datePublished: "2023-02-21",
        description:
          "my face shape is round + square and i have high cheekbones. this glasses doesn’t hit my cheekbones, and it is very comfortable !! if its too tight, you can visit the store to get them to adjust for you ((:",
        name: "favourite !!",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "belle" },
        itemReviewed: { "@type": "Person", name: "belle" },
        datePublished: "2021-11-10",
        description: "my go to everyday glasses",
        name: "super light weight",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
      },
    ],
  }
  */
  const schema = {
    ...getProductSchema(
      productDetailData.brandName,
      productDetailData.productModelName,
      productDetailData?.gridImages,
      productDetailData?.seo.description,
      productDetailData.id,
      productDetailData.sku,
      configData,
      productDetailData?.color ?? "",
      productDetailData?.size,
      productDetailData?.generalProductInfo
    ),
    offers: {
      ...getOffersSchema(
        productDetailData.price.currency,
        lenskartPrice,
        productDetailData.productQuantity as number,
        productDetailData.productURL,
        configData
      ),
    },
    aggregateRating: {
      ...getRatingSchema(
        productDetailData.productRating,
        productDetailData.reviews.reviews?.length,
        configData
      ),
    },
    review: getReviewSchema(productDetailData.reviews.reviews, configData),
  };

  const breadcrumbSchema = {
    ...getBreadcrumbSchema(productDetailData.breadcrumb, configData?.DOMAIN),
  };

  if (deviceType?.toLowerCase() === "mobilesite") {
    return (
      <>
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
          {productDetailData.breadcrumb?.length > 0 && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbSchema),
              }}
            />
          )}
          {productDetailData.gridImages.length > 0 && (
            <link
              href={productDetailData.gridImages[0].imageUrl}
              rel="preload"
              as="image"
            />
          )}
        </Head>
        {productDetailLoading ? (
          <Spinner show fullPage={true} color={"#ffff"} />
        ) : null}
        <ProductDetailMobileWrapper>
          {/* //> Breadcrumbs Section */}
          {!isExchangeFlow && (
            <BreadcrumbsWrapper isMobile={true}>
              <Breadcrumbs
                font={TypographyENUM.defaultBook}
                componentSize={ComponentSizeENUM.small}
                id="pdp-breadcrumbs"
                productID={id}
                isRTL={pageInfo.isRTL}
                contactLensPowerFromUrl=""
                helplineNo={localeData.CONTACT_NUMBER}
                dataLocale={localeData}
                breadcrumbData={modBreadcrumbData}
                deviceType="mobilesite"
                subDirectory={
                  process?.env?.NEXT_PUBLIC_BASE_ROUTE?.toLowerCase() !== "na"
                    ? process.env.NEXT_PUBLIC_BASE_ROUTE
                    : null
                }
              />
            </BreadcrumbsWrapper>
          )}

          {!isHustlrProduct && (
            <>
              {!isExchangeFlow && (
                <TryAtHomeAndStoresButton
                  type={productDetailData.type}
                  localeData={localeData}
                  isDittoEnabled={
                    (!configData.ENABLE_CYGNUS &&
                      productDetailData.isTryOnEnabled) ||
                    (configData.ENABLE_CYGNUS &&
                      productDetailData.isCygnusEnabled)
                  }
                  configData={configData}
                  isContactLens={["contact_lens"]?.indexOf(
                    productDetailData.classification
                  ) > -1 }
                />
              )}

              <ProductImagesWithDittoWrapper>
                <ProductImagesWithDitto
                  localeData={localeData}
                  isExchangeFlow={isExchangeFlow}
                  configData={configData}
                  productDetailData={productDetailData}
                />
              </ProductImagesWithDittoWrapper>
            </>
          )}
          {productDetailData.classification === "contact_lens" &&
            Object.keys(productDetailData?.additionalOptions).length != 0 && (
              <PDPComponents.ContactLensColorOptions
                options={productDetailData}
                onSelectContactLensColor={onSelectContactLensColor}
                dataLocale={localeData}
              />
            )}
          <ProductAndOfferWrapper>
            <ProductDetailsWrapper>
              <ProductDetailsMobile
                productName={productDetailData?.brandName}
                purchaseCount={productDetailData?.purchaseCount}
                displaySubname={productDetailData?.productName}
                frameWidthLabels={frameWidthLabels}
                onclickBuyonChat={onclickBuyonChat}
                productData={productDetailData}
                // frameWidth={frameWidth?.value}
                additionalInfoUrl={removeDomainName(
                  productDetailData?.cmsLinkAndroid || ""
                )}
                frameSize={productDetailData?.size}
                onClickAdditionalInfo={onClickAdditionalInfo}
                frameWidth={frameWidth?.value}
                suitedFor={suitedFor}
                taxInclusivePrice={getGSTPrice(
                  productDetailData.classification,
                  productDetailData.brandName,
                  productDetailData.frameType,
                  lenskartPrice,
                  productgst
                )}
                price={productDetailData.price}
                noOfReviews={reviewsData?.count || 0}
                rating={reviewsData?.rating || 0}
                onReviewsClickHandler={handleReviewClick}
                productOfferText={productOfferIdDetails?.text2}
                powerInfoText={powerInfoText}
                dataLocale={localeData}
                isShortListed={isWishListSelected}
                onWishListClick={onWishListClick}
                isExchangeFlow={isExchangeFlow}
                buyOnChat={buyOnChat.enableForPDP}
                // hasSpecialPrice={true}
                isRTL={pageInfo.isRTL}
                showGST={configData?.SHOW_GST}
                showPostPay={true}
              ></ProductDetailsMobile>
            </ProductDetailsWrapper>
            {PDP_OFFER_BANNER === "ON" &&
              Object.keys(productDetailData?.offerDetails || {}).length > 0 && (
                <OfferDisplay
                  headline1={productDetailData?.offerDetails?.headline1}
                  headline2={productDetailData?.offerDetails?.headline2}
                  icon={productDetailData?.offerDetails?.icon}
                />
              )}
          </ProductAndOfferWrapper>

          {/* //> check frame size and try-at-home banner  */}
          <BannerWrapper>
            {showFrameSizeButtonInPdp &&
              ["eyeframe", "sunglasses"]?.indexOf(
                productDetailData.classification
              ) > -1 && (
                <div onClick={handleFindMyFitClick}>
                  <img
                    alt="find my size"
                    src={
                      frameSizeBannerInPdp ||
                      "https://static1.lenskart.com/media/desktop/img/4-Oct-19/strip_banner_pdp2.jpg"
                    }
                  />
                </div>
              )}
            {bannerDetails.enable &&
              productDetailData?.classification === "eyeframe" && (
                <div>
                  <Link href="/HTO/">
                    <img alt="Home eye test" src={bannerDetails.image} />
                  </Link>
                </div>
              )}
          </BannerWrapper>

          {pageInfo?.country?.toLowerCase() === "in" && (
            <ProductDeliveryMobile
              configData={configData}
              localeData={localeData}
              type={productDetailData.type}
              pid={productDetailData.id}
            />
          )}

          {configData && configData?.SHOW_DELIVERY && (
            <>
              <ItemDelivery
                localeData={localeData}
                productClassification={productDetailData?.classification}
              />
            </>
          )}
          {configData && configData.PDP_LENSKART_PROMISE_ACTIVE && (
            <WhiteBG>
              <LenskartPromise
                localeData={localeData}
                configData={configData}
              />
            </WhiteBG>
          )}

          {/* //> Rich Content section */}
          {pdpConfig.showPDPRich?.msite === "ON" &&
            productDetailData?.richContent && (
              <RichContentWrapper
                dangerouslySetInnerHTML={{
                  __html: productDetailData.richContent,
                }}
                mobileView={true}
              ></RichContentWrapper>
            )}
          <ProductDetailsWrapper marginNeeded>
            <Title>{ABOUT_THE_PRODUCT}</Title>
            <TechnicalDetails
              font={"Roboto"}
              productDetailTitle={PRODUCT_DETAILS}
              productDetailText={productDetailData.sellerLabel}
              specifications={[
                { name: "Product Id", value: productDetailData.id },
                ...productGeneralInfo,
              ]}
              onClickHandler={(url: string) => {
                Router.push(url);
              }}
              isExchangeFlow={isExchangeFlow}
              localeData={localeData}
              isRTL={pageInfo.isRTL}
            ></TechnicalDetails>
            <TechnicalDetails
              font={"Roboto"}
              productDetailTitle={TECHNICAL_INFORMATION}
              // productDetailText={productDetailData.sellerLabel}
              specifications={productTechnicalInfo}
              onClickHandler={(url: string) => {
                // Router.push(url).then(() => window.location.reload());
                window.location.href = pageInfo?.subdirectoryPath + url;
              }}
              isExchangeFlow={isExchangeFlow}
              localeData={localeData}
              isRTL={pageInfo.isRTL}
              className="tech-bot-info"
            ></TechnicalDetails>
          </ProductDetailsWrapper>

          {productDetailData?.colorOptions?.length > 0 && (
            <ColorOptions localeData={localeData} />
          )}

          {/* //> Reviews section */}
          <ProductReviews
            localeData={localeData}
            productDetailData={productDetailData}
          />

          <RecentlyViewedWrapper>
            <RecentlyViewedProducts localeData={localeData} />
          </RecentlyViewedWrapper>

          {productDetailData?.relatedItems?.length > 0 && (
            <RecentlyViewedWrapper>
              <RelatedProducts localeData={localeData} />
            </RecentlyViewedWrapper>
          )}

          {/* {productDetailData?.colorOptions?.length > 0 && (
            <ColorOptions localeData={localeData} />
          )} */}

          {recommendedCats && recommendedCats?.length > 0 && (
            <RecommendedProducts
              localeData={localeData}
              productDetailData={productDetailData}
            />
          )}

          {productDetailData.classification === "contact_lens" &&
          !disableBuyOnCall ? (
            <div
              onClick={() =>
                (window.location.href = `tel:${localeData.CALL_FOR_POWER_NUMBER}`)
              }
            >
              <Information info={orderOnPhone} country={pageInfo.country} />
            </div>
          ) : null}

          {!isExchangeFlow &&
            pdpConfig.homeTryOn &&
            pdpConfig.homeTryOn.pdp &&
            Object.keys(pdpConfig.homeTryOn.pdp).length > 0 &&
            ["eyeframe", "sunglasses"]?.indexOf(
              productDetailData.classification
            ) > -1 && (
              <div className="mr-t10" onClick={() => {}}>
                <Information
                  info={pdpConfig.homeTryOn.pdp}
                  showTryOn={configData.SHOW_TRY_ON}
                ></Information>
              </div>
            )}
          <ProductCTA
            configData={configData}
            productData={productDetailData}
            powerOption={powerOption}
            productLensTypeDesc={productLensTypeDesc}
            localeData={localeData}
            sessionId={sessionId}
            addToCartNoPowerHandler={addToCartNoPowerHandler}
            isExchangeFlow={isExchangeFlow}
            powerTypeList={powerData}
            isJitProduct={productDetailData?.jit}
            isPlano={productDetailData.isPlano}
            isContactLens={["contact_lens"]?.indexOf(productDetailData.classification) > -1 }
          />
        </ProductDetailMobileWrapper>
      </>
    );
  }
  const enableQtyInput =
    (productDetailData.type !== "Contact Lens" &&
      productDetailData.sku?.indexOf("watch:") !== -1) ||
    ((productDetailData.brandName === "Vincent Chase" ||
      productDetailData.brandName === "Lenskart") &&
      productDetailData.classification === "accessories_revenue");
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {productDetailData.breadcrumb?.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
            }}
          />
        )}
      </Head>
      {showToast && (
        <ToastMessage
          message={cartData?.cartErrorMessage}
          color="orange"
          duration={4000}
          show={showToast}
          hideFn={() => {
            setShowToast(false);
          }}
          showIcon={false}
        />
      )}
      <ProductDetailWrapper>
        {/* //> Breadcrumbs Section */}
        <BreadcrumbsWrapper>
          <Breadcrumbs
            font={TypographyENUM.defaultBook}
            componentSize={ComponentSizeENUM.small}
            id="pdp-breadcrumbs"
            productID={id}
            isRTL={pageInfo.isRTL}
            contactLensPowerFromUrl=""
            helplineNo={localeData.CONTACT_NUMBER}
            dataLocale={localeData}
            color={configData?.HELPLINE_COLOR}
            breadcrumbData={modBreadcrumbData}
            deviceType="desktop"
            subDirectory={
              process?.env?.NEXT_PUBLIC_BASE_ROUTE?.toLowerCase() !== "na"
                ? process.env.NEXT_PUBLIC_BASE_ROUTE
                : null
            }
          />
        </BreadcrumbsWrapper>

        <PDPWrapper showPowerTypeModal={showPowerTypeModal}>
          {/* //> Images Grid Section */}
          <ImageGrid
            altText={`${productDetailData?.brandName} ${productDetailData?.productName}`}
            gridImages={productDetailData.gridImages}
            id={id}
            configData={configData}
            sessionId={sessionId}
            dataLocale={localeData}
          />
          {/* //> Product Details Section */}
          <AsideWrapper isRTL={pageInfo.isRTL}>
            {productDetailData.classification !== "contact_lens" && (
              //> Non Contact Lens Product Info Section
              <PDPComponents.ProductInfo
                showInfo={cmsUrl ? true : false}
                onInfoClick={() => cmsInfoHandler()}
                isRTL={pageInfo.isRTL}
                locale={localeData}
                showDelivery={configData?.SHOW_DELIVERY}
                deviceType={pageInfo.deviceType}
                classification={productDetailData?.classification}
                showTryOn={
                  productDetailData.productQuantity === 0 ||
                  productDetailData?.classification === "loyalty_services"
                    ? false
                    : true
                }
                offerDetails={productDetailData?.offerDetails || {}}
                showOfferBanner={PDP_OFFER_BANNER === "ON"}
                addToCartButtons={
                  productDetailData.productQuantity === 0
                    ? []
                    : productDetailData.addToCartButtons
                }
                font={TypographyENUM.defaultBook}
                sizeText={productDetailData.size}
                colorOptions={productDetailData?.colorOptions}
                price={productDetailData.price}
                productBrand={productDetailData.brandName}
                productName={productDetailData.productName}
                wishListSelected={isWishListSelected}
                isExchangeFlow={isExchangeFlow}
                id={`pdp-prod-info-section-${productDetailData.id}`}
                pid={productDetailData.id}
                componentSize={ComponentSizeENUM.medium}
                InfoText={
                  productDetailData.classification === "eyeframe"
                    ? configData.FRAME_PLUS_LENS
                    : ""
                } //Should be made dynamic
                onTryOnClick={() => {
                  onClickTryOn();
                  const eventName = "cta_click";
                  const cta_name = "try-on";
                  const cta_flow_and_page = "product-detail-page";
                  ctaClickEvent(
                    eventName,
                    cta_name,
                    cta_flow_and_page,
                    userInfo,
                    pageInfo
                  );
                }}
                onButtonClick={(
                  onlyLens: boolean,
                  withPower: boolean,
                  quantity?: string
                ) => {
                  if (onlyLens) {
                    addToCartWithPower();
                    const eventName = "cta_click";
                    const cta_name = "select-lenses";
                    const cta_flow_and_page = "product-detail-page";
                    ctaClickEvent(
                      eventName,
                      cta_name,
                      cta_flow_and_page,
                      userInfo,
                      pageInfo
                    );
                  } else if (quantity) {
                    addToCartNoPowerHandler(undefined, quantity);
                    const eventName = "cta_click";
                    const cta_name = "add-to-cart";
                    const cta_flow_and_page = "product-detail-page";
                    ctaClickEvent(
                      eventName,
                      cta_name,
                      cta_flow_and_page,
                      userInfo,
                      pageInfo
                    );
                  } else {
                    addToCartNoPowerHandler();
                    const eventName = "cta_click";
                    const cta_name = "add-to-cart";
                    const cta_flow_and_page = "product-detail-page";
                    ctaClickEvent(
                      eventName,
                      cta_name,
                      cta_flow_and_page,
                      userInfo,
                      pageInfo
                    );
                  }
                }}
                isCygnusEnabled={productDetailData.isDitto}
                triggerWishlist={(pid: number) => onWishListClick(pid)}
                desktopPriceFontBold
                showPostPay={true}
                isLoading={userInfo.userLoading}
                triggerCtaGA={(cta_name: string, cta_flow_and_page: string) => {
                  const eventName = "cta_click";
                  // const cta_name = "color-options";
                  // const cta_flow_and_page = "product-detail-page";
                  ctaClickEvent(
                    eventName,
                    cta_name,
                    cta_flow_and_page,
                    userInfo,
                    pageInfo
                  );
                }}
                taxInclusivePrice={
                  configData?.SHOW_GST &&
                  getGSTPrice(
                    productDetailData.classification,
                    productDetailData.brandName,
                    productDetailData.frameType,
                    lenskartPrice,
                    productgst
                  )
                }
                enableQtyInput={enableQtyInput}
              ></PDPComponents.ProductInfo>
            )}
            {productDetailData.classification === "contact_lens" &&
              powerData && (
                //> Contact Lens Product Info Section
                //! Move this to Story Book
                <CLInfo
                  id={`pdp-cl-info-section-${productDetailData.id}`}
                  pid={productDetailData.id}
                  font={TypographyENUM.defaultBook}
                  wishListSelected={isWishListSelected}
                  productBrand={productDetailData.brandName}
                  productName={productDetailData.productName}
                  price={productDetailData.price}
                  localeData={localeData}
                  triggerWishlist={(pid: number) => onWishListClick(pid)}
                  isRTL={pageInfo.isRTL}
                  showInfo={cmsUrl ? true : false}
                  onInfoClick={() => cmsInfoHandler()}
                  isExchangeFlow={isExchangeFlow}
                  desktopPriceFontBold
                  configData={configData}
                  showOfferBanner={PDP_OFFER_BANNER === "ON"}
                  offerDetails={productDetailData?.offerDetails}
                  taxInclusivePrice={
                    configData?.SHOW_GST &&
                    getGSTPrice(
                      productDetailData.classification,
                      productDetailData.brandName,
                      productDetailData.frameType,
                      lenskartPrice,
                      productgst
                    )
                  }
                  crossShell={productDetailData?.crossSells}
                >
                  {configData?.SHOW_DELIVERY && (
                    <DeliveryText>
                      {localeData.DELIVERY_CONTACT_LENSES}
                    </DeliveryText>
                  )}
                  {/* <ContactLensSelectPower
                  powerTypeList={powerData}
                  isJitProduct={productDetailData?.jit}
                  font={TypographyENUM.defaultBook}
                  isPlano={false}
                  productId={productDetailData.id}
                  sessionId={sessionId}
                  localeData={localeData}
                /> */}
                  <NewCLSelectPower
                    powerTypeList={powerData}
                    isJitProduct={productDetailData?.jit}
                    font={TypographyENUM.defaultBook}
                    isPlano={productDetailData?.isPlano}
                    productId={productDetailData.id}
                    sessionId={sessionId}
                    localeData={localeData}
                    productData={productDetailData}
                    configData={configData}
                  />
                </CLInfo>
              )}
            {/* //> Handle Out Of Stock Section */}
            {!productDetailData?.productQuantity && (
              <OutOfStockWrapper>
                <OutOfStock
                  id="pdp-out-of-stock"
                  font={TypographyENUM.defaultBook}
                  isRTL={false}
                  onKepMePosted={keepMePosted}
                  dataLocale={localeData}
                  oosSubscription={oosSubscription}
                  countryCode={pageInfo.countryCode}
                  isOOStockSaved={isOOStockSaved}
                />
              </OutOfStockWrapper>
            )}
            {/* //> Product Info Accordions */}
            <Accordions
              font={TypographyENUM.defaultBook}
              id="pdp-additional-info-details"
              filters={getProductAdditionalInfo(
                productDetailData,
                localeData,
                pageInfo,
                isDesktopNearby,
                isDesktopDelivery
              )}
              defaultExpand={
                getProductAdditionalInfo(
                  productDetailData,
                  localeData,
                  pageInfo,
                  isDesktopNearby,
                  isDesktopDelivery
                ).length
              }
              padding
              // padding
            />
            {/* //> Rich Content Section */}
            <Divider id="pdp-rich-content-divider" color="#d5d5d5" />
            {productDetailData.richContent && (
              <RichContentWrapper
                dangerouslySetInnerHTML={{
                  __html: productDetailData.richContent,
                }}
              ></RichContentWrapper>
            )}
          </AsideWrapper>
          {/* //> Package Section */}
          <PackageSection
            configData={configData}
            localeData={localeData}
            id={id}
            isExchangeFlow={isExchangeFlow}
            sessionId={sessionId}
            productDetailData={productDetailData}
            addToCartNoPowerHandler={addToCartNoPowerHandler}
            showPowerTypeModal={showPowerTypeModal}
            onPowerModalClose={(status: boolean) =>
              setShowPowerTypeModal(status)
            }
          />
        </PDPWrapper>
        {/* //> Modal to view Frame Size CMS Page*/}
        <Modal
          onHide={() => null}
          show={showCMSInfoModal}
          bsSize={"lg"}
          keyboard={true}
          dialogCss={`width: 70vw;`}
        >
          <Modal.Body className={"fullheight"}>
            <div>
              <CloseButton onClick={() => setShowCSMInfoModal(false)}>
                <div className="left"></div>
                <div className="right"></div>
              </CloseButton>
            </div>
            {cmsUrl && (
              <CMSWrapper>
                <CMS cmsURL={cmsUrl} fetchData={true} />
              </CMSWrapper>
            )}
          </Modal.Body>
        </Modal>
      </ProductDetailWrapper>
    </>
  );
};

export default ProductDetail;
