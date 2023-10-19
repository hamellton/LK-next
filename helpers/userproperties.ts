import { DataType } from "@/types/coreTypes";
import { extractUtmParams, localStorageHelper } from "@lk/utils";
import { LAST_PAGE_VISIT_NAME, SEARCH_FUNNEL } from "../constants";
import sessionStorageHelper from "./sessionStorageHelper";
import {
  discountCalculator,
  getCategoryType,
  getCurrency,
  getCurrencyCode,
  getProductType,
  pushDataLayer,
} from "./utils";

export const userProperties = (
  userInfo: DataType,
  pageName: string,
  pageInfo: DataType,
  dataLocale: DataType,
  pageView?: string
) => {
  const userData = userInfo.userDetails;
  var clientID = function () {
    var match = document.cookie.match("(?:^|;)\\s*_ga=([^;]*)"),
      raw = match ? decodeURIComponent(match[1]) : null;
    if (raw) {
      match = raw.match(/(\d+\.\d+)$/);
    }
    return match ? match[1] : null;
  };
  const {
    utm_source = null,
    utm_medium = null,
    utm_campaign = null,
    utm_term = null,
    utm_content = null,
  } = extractUtmParams(window.location.search);
  if (utm_source) {
    localStorage.setItem(
      "utmSource",
      JSON.stringify({
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
      })
    );
  } else if (!localStorage.getItem("utmSource")) {
    localStorage.setItem(
      "utmSource",
      JSON.stringify({
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
      })
    );
  }
  const utmSource: any = localStorageHelper.getItem("utmSource");
  let obj = {
    event: "page_load",
    country_code: pageInfo?.country,
    currency_code:
      getCurrencyCode(pageInfo?.country) || dataLocale?.CURRENCY_CODE || "",
    client_id: clientID(),
    platform: pageInfo?.deviceType,
    lk_user_type: userData?.hasPlacedOrder ? "lk-repeat" : "lk-new",
    login_status: userInfo?.isLogin ? "loggedin" : "guest",
    customer_id: userInfo?.isLogin ? userData?.id : "",
    mobile: userInfo?.mobileNumber ? btoa(userInfo?.mobileNumber) : "",
    email: userInfo?.email ? btoa(userInfo?.email) : "",
    page_url: window?.location?.href,
    page_name: pageName,
    web_utm_source: utmSource.utm_source || "(direct)",
    web_utm_medium: utmSource.utm_medium || "(none)",
    web_utm_campaign: utmSource.utm_campaign || "(direct)",
    web_utm_term: utmSource.utm_term || "",
    web_utm_content: utmSource.utm_content || "",
    arch_type: "new-arch",
    dimension21: "new-arch",
  };
  pushDataLayer(obj);
  let obj1 = {
    event: "page_view",
    country_code: pageInfo?.country,
    currency_code:
      getCurrencyCode(pageInfo?.country) || dataLocale?.CURRENCY_CODE || "",
    client_id: clientID(),
    platform: pageInfo?.deviceType,
    lk_user_type: userData?.hasPlacedOrder ? "lk-repeat" : "lk-new",
    login_status: userInfo?.isLogin ? "loggedin" : "guest",
    customer_id: userInfo?.isLogin ? userData?.id : "",
    mobile: userInfo?.mobileNumber ? btoa(userInfo?.mobileNumber) : "",
    email: userInfo?.email ? btoa(userInfo?.email) : "",
    page_url: window?.location?.href,
    page_name: pageView || pageName,
    web_utm_source: utmSource.utm_source || "(direct)",
    web_utm_medium: utmSource.utm_medium || "(none)",
    web_utm_campaign: utmSource.utm_campaign || "(direct)",
    web_utm_term: utmSource.utm_term || "",
    web_utm_content: utmSource.utm_content || "",
    arch_type: "new-arch",
  };
  pushDataLayer(obj1);
};

export const onSignIn = (method: string, userInfo?: any) => {
  const obj: any = {
    event: "login",
    method: method,
    mobile: userInfo?.mobileNumber ? btoa(userInfo?.mobileNumber) : "",
    arch_type: "new-arch",
    dimension21: "new-arch",
  };
  pushDataLayer(obj);
};

export function ctaClickProperties(
  cta_name: any,
  cta_flow_and_page: string,
  userDetails: any
) {
  let obj = {
    event: "cta_click",
    cta_flow_and_page: cta_flow_and_page,
    cta_name: cta_name,
    customer_id: userDetails?.id,
    lk_user_type: userDetails?.hasPlacedOrder ? "lk-repeat" : "lkNew",
    arch_type: "new-arch",
  };
  pushDataLayer(obj);
}

export const navigationBarGA = (
  cta_name: string,
  userInfo: any,
  pageInfo: any
) => {
  const data = {
    cta_flow_and_page: "navigation-bar",
    cta_name: cta_name,
    event: "cta_click",
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
    website_source: `${pageInfo?.country} headless`,
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(data);
};

export const removeFromCartGA = (item: any, userInfo: any) => {
  const ecommerce: any = { remove: { products: [] } };
  const data = {
    ecommerce: ecommerce,
    event: "removeFromCart",
    userType: userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
    arch_type: "new-arch",
    dimension21: "new-arch",
  };
  const product: any = {
    brand: item?.itemBrandName,
    category: item?.itemLensCategory,
    dimension21: item?.itemId,
    dimension22:
      item?.itemLensCategory.toLowerCase() === "eyeglasses"
        ? "single_vision,bifocal,zero_power,frame_only"
        : "",
    dimension23: item?.itemLensType,
    dimension24: item?.itemName,
    dimension25: "",
    id: item.itemId,
    name: item.itemModel,
    price: item?.price?.value,
    quantity: item?.itemQty,
    item_variant: item.itemFrameColor || "",
  };
  if (sessionStorageHelper.getItem(SEARCH_FUNNEL)) {
    const cartData: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
    if (cartData[item.itemId]) {
      const obj2 = cartData[item.itemId].search[0];
      for (const key in obj2) {
        product[key] = obj2[key];
      }
    }
  }
  ecommerce.remove.products.push(product);

  pushDataLayer(data);
};

export function ctaClicktry_3d_on(data: {
  event: string;
  ctaname: string;
  ctasection: string;
}) {
  let obj = {
    ...data,
  };
  pushDataLayer(obj);
}

export const new3dButtonClick = (userInfo: any, pageInfo: any) => {
  const data = {
    event: "cta_click",
    ctaname: "try_3d_on",
    ctasection: "try_3d_on_detail",
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
    website_source: `${pageInfo?.country} headless`,
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(data);
};

export function SortByEvent(data: { event: string; sortSelected: string }) {
  let obj = {
    ...data,
    arch_type: "new-arch",
  };
  pushDataLayer(obj);
}

export function AllSizeEvent(data: { event: string; frame_size_id: string }) {
  let obj = {
    ...data,
    arch_type: "new-arch",
  };
  pushDataLayer(obj);
}

export function FilterClickEvent(data: {
  [x: string]: any;
  event: string;
  filterCount: number;
}) {
  let obj = {
    ...data,
    arch_type: "new-arch",
  };
  pushDataLayer(obj);
}
export function LensDescriptionEvent(data: {
  event: string;
  powerType: string;
}) {
  let obj = {
    ...data,
    arch_type: "new-arch",
  };
  pushDataLayer(obj);
}

export const onSignUp = (value: string) => {
  const obj = {
    event: "sign_up",
    method: "mannual",
    mobile: btoa(value),
    arch_type: "new-arch",
  };
  pushDataLayer(obj);
};

export const addPowerCtaClick = (listing: boolean) => {
  const data = {
    event: "cta_click",
    ctaname: listing ? "order listing|add power" : "order details|add power",
    pname: listing ? "order listing" : "order details",
    arch_type: "new-arch",
  };
  pushDataLayer(data);
};

export const addPowerCtaGA = (
  cta_flow_and_page: string,
  customer_id: any,
  userInfo: any,
  pp_prescription_type: string
) => {
  const data = {
    cta_flow_and_page: cta_flow_and_page,
    cta_name: "add-power",
    customer_id: customer_id,
    event: "cta_click",
    lk_user_type: userInfo?.userDetails?.hasPlacedOrder ? "lkRepeat" : "lkNew",
    pp_prescription_type: pp_prescription_type,
    arch_type: "new-arch",
  };
  pushDataLayer(data);
};

export const packageScreenSelectionGA = (value: any) => {
  const data = {
    cta_click: value,
    cta_flow_and_page: "eyeglasses-package-screen",
    event: "cta_click",
    arch_type: "new-arch",
  };

  pushDataLayer(data);
};

export const findMyFit = (userInfo: any, pageInfo: any) => {
  const data = {
    ctaname: "find_my_fit",
    ctasection: "find_my_fit_listing",
    event: "cta_click",
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
    website_source: `${pageInfo?.country} headless`,
    cta_flow_and_page: "product-listing-page",
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(data);
};

export const tryOnEvent = (TryOn: boolean, userInfo: any, pageInfo: any) => {
  const data = {
    ctaname: "try_3d_on",
    ctasection: `detailpage: turn ${TryOn ? "on" : "off"}`,
    event: "cta_click",
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
    website_source: `${pageInfo?.country} headless`,
    cta_flow_and_page: "product-listing-page",
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(data);
};

export const BannerClicks = (
  action: string,
  label: string,
  userInfo: any,
  userType: string,
  pageInfo: any,
  category: string,
  event: string
) => {
  const data = {
    action: action,
    category: category,
    event: event,
    label: label,
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userType,
    website_source: `${pageInfo?.country} headless`,
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  // console.log("bannerclicks", data);
  pushDataLayer(data);
};

export const homePageGridCtaClick = (
  cta_name: string,
  userInfo: any,
  pageInfo: any,
  userType: string
) => {
  const data = {
    cta_flow_and_page: "home-page-grid",
    cta_name: cta_name,
    ctasection: `${cta_name}_home`,
    event: "cta_click",
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userType,
    website_source: `${pageInfo?.country} headless`,
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(data);
};

export const homePageBannerCtaClick = (
  cta_flow_and_page: string,
  cta_name: string,
  userInfo: any,
  userType: string,
  pageInfo: any
) => {
  const data = {
    cta_flow_and_page: cta_flow_and_page,
    cta_name: cta_name,
    ctasection: `${cta_name}_l1`,
    event: "cta_click",
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userType,
    website_source: `${pageInfo?.country} headless`,
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(data);
};

export const addToCartGA = (
  currencyCode: string,
  product: any,
  userInfo: any
) => {
  const data: any = {
    ecommerce: { add: { products: [] }, currencyCode: currencyCode },
    event: "addToCart",
    userType: userInfo?.isLogin ? "loggedin" : "guest",
    arch_type: "new-arch",
  };

  const ecommerceObj: any = {
    brand: product?.itemBrandName,
    category: product?.itemLensCategory,
    dimension21: product?.itemId,
    dimension22:
      product?.itemLensCategory.toLowerCase() === "eyeglasses"
        ? "single_vision,bifocal,zero_power,frame_only"
        : "",
    dimension23: product?.itemLensType,
    dimension24: product?.itemName,
    dimension25: "",
    id: product?.itemId,
    name: product?.itemModel,
    price: product?.itemTotalPrice,
    variant: product?.itemFrameType,
  };

  data.ecommerce.add.products.push(ecommerceObj);
  pushDataLayer(data);
};

export const searchGA = (
  PageUrl: string,
  event: string,
  userInfo: any,
  visitorCategoryId: any,
  visitorCategoryName: string,
  visitorEmail: string,
  visitorPageType: string,
  pageInfo: any
) => {
  const data = {
    PageUrl: PageUrl,
    event: event || "cta_click",
    gaMobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
    visitorCategoryId: visitorCategoryId,
    visitorCategoryName: visitorCategoryName,
    visitorEmail: visitorEmail,
    visitorMobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    visitorPageType: visitorPageType,
    website_source: `${pageInfo?.country} headless`,
    arch_type: "new-arch",
    dimension21: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(data);
};

export const tryOn3d = (userInfo: any, pageInfo: any) => {
  const data = {
    ctaname: "try_3d_on",
    ctasection: "get_started",
    event: "cta_click",
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userInfo?.userDetails?.hasPlacedOrder ? "lkRepeat" : "lkNew",
    website_source: `${pageInfo?.country} headless`,
    arch_type: "new-arch",
    dimension21: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(data);
};

export const addToWishList = (
  item: any,
  userInfo: any,
  pageInfo: any,
  categoryData: any
) => {
  const ecommerce: any = {
    currency: item?.price.currency,
    value: "",
    items: [],
  };
  // const productListingInfo =
  //   (localStorageHelper.getItem("productListingInfo") &&
  //     JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
  //   {};
  // const item_list_id = productListingInfo[item?.id]["item_list_id"] || "";
  // const item_list_name = productListingInfo[item?.id]["item_list_name"] || "";
  const data: any = {
    ecommerce: ecommerce,
    event: "add_to_wishlist",
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    userType: userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
    website_source: `${pageInfo?.country} headless`,
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  const obj: any = {
    item_id: item?.id,
    item_name: item.productModelName,
    affiliation: "",
    coupon: "",
    currency: item?.price.currency,
    discount: item?.prices
      ? discountCalculator(item.price.basePrice, item.price.lkPrice)
      : "",
    index: 0,
    item_brand: item?.productName,
    item_category: getCategoryType(item?.classification) || "", //getProductType(item?.sku || ""),
    item_category2: "",
    item_category3: "",
    item_category4: "",
    item_list_id: pageInfo?.id || "",
    item_list_name: categoryData?.categoryName || "",
    item_variant: item?.frameColour || item?.frameColor || "",
    price: item?.price?.lkPrice,
    quantity: 1,
  };
  ecommerce.items.push(obj);
  pushDataLayer(data);
};

export const onSearchGA = (value: string) => {
  const obj: any = {
    event: "cta_click",
    cta_name: "search_click",
    search_term: value,
    arch_type: "new-arch",
  };
  pushDataLayer(obj);
};

export const trackingDetail = (pageType: string, userInfo: any) => {
  const dlUpdate = {
    event: "standardParams",
    PageUrl: location.href,
    pageType: pageType, // localeData.MANAGE_COMMUNICATION_PREFERENCES,
    mobile: btoa(userInfo?.mobileNumber?.toString() || ""),
    email: btoa(userInfo?.email || ""),
    loginStatus: userInfo?.isLogin,
    lkUserType: userInfo?.userDetails?.hasPlacedOrder ? "lkRepeat" : "lkNew",
    customerId: userInfo?.userDetails?.id,
    arch_type: "new-arch",
    dimension21: "new-arch",
    //countryCode: userInfo?.countryCode,
  };
  pushDataLayer(dlUpdate);
};

export const selectLens = (
  selectLensOptionChosen?: string,
  mobile?: string,
  userType?: string,
  country?: string,
  classification?: string
) => {
  const { utm_source = null } = extractUtmParams(window.location.search);
  if (utm_source) {
    localStorage.setItem(
      "utmSource",
      JSON.stringify({
        utm_source,
      })
    );
  } else if (!localStorage.getItem("utmSource")) {
    localStorage.setItem(
      "utmSource",
      JSON.stringify({
        utm_source,
      })
    );
  }
  const utmSource: any = localStorageHelper.getItem("utmSource");
  const dlUpdate = {
    event: "selectLens",
    PageUrl: location.href,
    selectLensOptionChosen: selectLensOptionChosen, // localeData.MANAGE_COMMUNICATION_PREFERENCES,
    mobile: btoa(mobile || ""),
    selectLensSection: classification || "Prescription type",
    userType,
    web_utm_source: utmSource.utm_source || `${country} headless`,
    arch_type: "new-arch",
    dimension21: "new-arch",
    //countryCode: userInfo?.countryCode,
  };
  pushDataLayer(dlUpdate);
};

export const selectLensPres = (
  eventName: string,
  cta_flow_and_page: string,
  selectLensOptionChosen?: string,
  mobile?: string,
  userType?: string,
  country?: string
) => {
  const { utm_source = null } = extractUtmParams(window.location.search);
  if (utm_source) {
    localStorage.setItem(
      "utmSource",
      JSON.stringify({
        utm_source,
      })
    );
  } else if (!localStorage.getItem("utmSource")) {
    localStorage.setItem(
      "utmSource",
      JSON.stringify({
        utm_source,
      })
    );
  }
  const utmSource: any = localStorageHelper.getItem("utmSource");
  const dlUpdate = {
    event: eventName,
    cta_name: selectLensOptionChosen,
    PageUrl: location.href,
    // selectLensOptionChosen: selectLensOptionChosen, // localeData.MANAGE_COMMUNICATION_PREFERENCES,
    mobile: btoa(mobile || ""),
    //selectLensSection: "Prescription type",
    cta_flow_and_page: cta_flow_and_page,
    userType,
    web_utm_source: utmSource.utm_source || `${country} headless`,
    arch_type: "new-arch",
    dimension21: "new-arch",
    //countryCode: userInfo?.countryCode,
    currency_code: getCurrencyCode(country || ""),
  };
  pushDataLayer(dlUpdate);
};

// --- Search Events ---
const createEventData = (eventObj: {
  userInfo: DataType;
  eventName: string;
  searchType?: string;
  searchKeyword?: string;
  suggestedQuery?: string;
  queryPosition?: any;
  searchOptionsCount?: any;
  searchResult?: any;
}) => {
  const pageName: any = localStorageHelper.getItem(LAST_PAGE_VISIT_NAME);
  const hasPlacedOrder = sessionStorage.getItem("hasPlacedOrder");
  const userData = eventObj.userInfo?.userDetails;
  const ga: any = {
    event: eventObj.eventName,
    page_name: pageName || "",
    customer_type:
      userData?.hasPlacedOrder || hasPlacedOrder ? "lk-repeat" : "lk-new",
    login_status:
      eventObj.userInfo?.isLogin || eventObj.userInfo?.isLoggedIn
        ? "loggedin"
        : "guest",
  };
  if (eventObj.searchType !== undefined) {
    ga.search_type = eventObj.searchType;
  }

  if (eventObj.searchKeyword !== undefined) {
    ga.search_keyword = eventObj.searchKeyword;
  }
  if (eventObj.suggestedQuery !== undefined) {
    ga.suggested_query = eventObj.suggestedQuery;
  }
  if (eventObj.queryPosition !== undefined) {
    ga.query_position = eventObj.queryPosition;
  }

  if (eventObj.searchOptionsCount !== undefined) {
    ga.no_of_search_option = eventObj.searchOptionsCount;
  }
  if (eventObj.searchResult !== undefined) {
    ga.search_result = eventObj.searchResult;
  }

  pushDataLayer(ga);
};

export const onRecentTrendingClick = (
  eventName: any,
  userInfo: DataType,
  searchKeyword: string,
  queryPosition: any
) => {
  createEventData({ userInfo, eventName, searchKeyword, queryPosition });
};

export const onQuerySuggestionClick = (
  userInfo: DataType,
  searchKeyword: string,
  suggestedQuery: string,
  queryPosition: any,
  searchOptionsCount: any
) => {
  createEventData({
    userInfo,
    eventName: "query_suggestion_click",
    searchKeyword,
    suggestedQuery,
    queryPosition,
    searchOptionsCount,
  });
};

export const onCustomQueryClick = (
  userInfo: DataType,
  searchKeyword: string,
  searchOptionsCount: any
) => {
  createEventData({
    userInfo,
    eventName: "custom_search",
    searchKeyword,
    searchOptionsCount,
  });
};

export const onSearchBarTyping = (userInfo: DataType) => {
  createEventData({ userInfo, eventName: "search_bar_typing" });
};

export const onSearchIconClickGa = (userInfo: DataType) => {
  createEventData({ userInfo, eventName: "search_icon_click" });
};

export const searchPageLoad = (
  userInfo: DataType,
  searchType: string,
  searchKeyword: any,
  searchResult: any
) => {
  createEventData({
    userInfo,
    eventName: "search_page_load",
    searchType,
    searchKeyword,
    searchResult,
  });
};

export const searchNoResult = (
  userInfo: DataType,
  searchType: string,
  searchKeyword: string,
  searchResult: any
) => {
  createEventData({
    userInfo,
    eventName: "no_results_page",
    searchType,
    searchKeyword,
    searchResult,
  });
};

export const onClearIconClick = (userInfo: DataType, searchKeyword: string) => {
  createEventData({
    userInfo,
    eventName: "search_clear_button",
    searchKeyword,
  });
};

export const onSearchBackIconClick = (userInfo: DataType) => {
  createEventData({ userInfo, eventName: "search_back_button" });
};
