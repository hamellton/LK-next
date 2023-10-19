import { getCurrency, getCurrencyCode, pushDataLayer } from "./utils";

export const homeVirtualPageView = (
  userInfo: any,
  utmParameters: any,
  pageInfo: any,
  cartData: any
) => {
  const orderTotal = cartData?.cartTotal || null;
  const dataLayerData: any = {
    event: "VirtualPageView",
    EmailId: userInfo?.email || userInfo?.guestEmail || null,
    PageUrl: window.location.href,
    mobile:
      typeof window !== "undefined" &&
      typeof window.btoa !== "undefined" &&
      userInfo?.mobileNumber !== undefined &&
      userInfo?.mobileNumber !== null
        ? window.btoa(userInfo?.mobileNumber)
        : "",
    visitorPageType: "HomePage",
    visitorPageTypeInfo: "Static",
    visitorStore: "revamp",
    visitorUtm_Source: utmParameters?.utm_source || "(direct)",
    visitorUtm_Cam: utmParameters?.utm_campaign || "(direct)",
    visitorUtm_Medium: utmParameters?.utm_medium || "(none)",

    // repeat for check if all goes ok then we have to remove repeated one
    utmSource: utmParameters?.utm_source || "",
    utmCampaign: utmParameters?.utm_campaign || "",
    utmMedium: utmParameters?.utm_medium || "",
    utmTerm: utmParameters?.utm_term || "",
    utmContent: utmParameters?.utm_content || "",
    website_source: `${pageInfo?.country} headless`,
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(dataLayerData);
};

export const categoryVirtualPageView = (
  userInfo: any,
  utmParameters: any,
  pageInfo: any,
  cartData: any,
  categoryID: string | number | null,
  categoryName: string
) => {
  const orderTotal = cartData?.cartTotal || null;
  const dataLayerData: any = {
    event: "VirtualPageView",
    EmailId: userInfo?.email || null,
    PageUrl: window.location.href,
    mobile:
      typeof window !== "undefined" &&
      typeof window.btoa !== "undefined" &&
      userInfo?.mobileNumber !== undefined &&
      userInfo?.mobileNumber !== null
        ? window.btoa(userInfo?.mobileNumber)
        : "",
    visitorPageType: "CategoryPage",
    visitorStore: window.location.host,
    isLoggedIn: userInfo?.isLogin ? 1 : 0,
    visitorCategoryId: categoryID,
    visitorCategoryName: categoryName,
    visitorUtm_Source: utmParameters?.utm_source || "(direct)",
    visitorUtm_Cam: utmParameters?.utm_campaign || "(direct)",
    visitorUtm_Medium: utmParameters?.utm_medium || "(none)",

    // repeat for check if all goes ok then we have to remove repeated one
    utmSource: utmParameters?.utm_source || "",
    utmCampaign: utmParameters?.utm_campaign || "",
    utmMedium: utmParameters?.utm_medium || "",
    utmTerm: utmParameters?.utm_term || "",
    utmContent: utmParameters?.utm_content || "",
    website_source: `${pageInfo?.country} headless`,
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(dataLayerData);
};

export const productVirtualPageView = (
  userInfo: any,
  utmParameters: any,
  pageInfo: any,
  cartData: any,
  productData: any
) => {
  const orderTotal = cartData?.cartTotal || null;
  const dataLayerData: any = {
    event: "VirtualPageView",
    EmailId: userInfo?.email || null,
    PageUrl: window.location.href,
    mobile:
      typeof window !== "undefined" &&
      typeof window.btoa !== "undefined" &&
      userInfo?.mobileNumber !== undefined &&
      userInfo?.mobileNumber !== null
        ? window.btoa(userInfo?.mobileNumber)
        : "",
    visitorPageType: "ProductPage",
    visitorStore: window.location.host,
    isLoggedIn: userInfo?.isLogin ? 1 : 0,
    visitorProductId: productData.id,
    visitorCategoryName: productData.brandName,
    visitorProductSku: productData.sku,
    visitorProductValue: productData?.price?.lkPrice || "",
    visitorMarketValue: productData?.price?.basePrice || "",
    visitorUtm_Source: utmParameters?.utm_source || "(direct)",
    visitorUtm_Cam: utmParameters?.utm_campaign || "(direct)",
    visitorUtm_Medium: utmParameters?.utm_medium || "(none)",

    // repeat for check if all goes ok then we have to remove repeated one
    utmSource: utmParameters?.utm_source || "",
    utmCampaign: utmParameters?.utm_campaign || "",
    utmMedium: utmParameters?.utm_medium || "",
    utmTerm: utmParameters?.utm_term || "",
    utmContent: utmParameters?.utm_content || "",
    website_source: `${pageInfo?.country} headless`,
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(dataLayerData);
};

export const checkoutVirtualPageView = (
  userInfo: any,
  utmParameters: any,
  pageInfo: any,
  cartData: any,
  configData: any
) => {
  const orderTotal = cartData?.cartTotal || null;

  let cartProductIdsValue = "";
  let cartProductName = "";
  let cartProductSkuValue = "";
  let quanTityValue = "";
  let lenskartPriceValue = "";
  let cartMarketPrice = "";
  let cartLenskartPrice = "";
  let lenskarttMobile = "";
  let lenskarttEmail = "";
  const cartProductIds: any = [];
  const cartProductNameValue: any = [];
  const cartProductSku: any = [];
  const cartProductBrand: any = [];
  const quanTity: any = [];
  const lenskartPrice: any = [];
  const quanTityId: any = [];

  cartData?.cartItems?.map((key: any) => {
    cartProductIds.push(key.itemId);
    cartProductNameValue.push(key.itemModel);
    cartProductSku.push(key.itemSku);
    cartProductBrand.push(key.itemBrandName);
    quanTity.push(key.itemQty);
    cartProductIdsValue = cartProductIds.toString();
    cartProductName = cartProductNameValue.toString();
    cartProductSkuValue = cartProductSku.toString();
    quanTityValue = quanTity.toString();
    lenskartPrice.push(key.itemPriceObj?.itemPrice);
    lenskartPriceValue = key.itemCatalogPrice[1].value;
    quanTityId.push(key.id);

    key.itemCatalogPrice.map((prices: any) => {
      if (prices.name === "Market Price") {
        cartMarketPrice = prices.value;
      }
      if (prices.name === "Lenskart Price") {
        cartLenskartPrice = prices.value;
      }
      if (window?.dataLayer?.[0]?.[key?.id]) {
        window.dataLayer[0][key.id] = {
          lenskartPrice: cartLenskartPrice,
          marketPrice: cartMarketPrice,
          productId: key.itemId,
          productQty: key.itemQty,
        };
      }
    });
  });

  let visitorLoyal = false;
  const loyaltyConfig =
    configData &&
    configData?.LOYALTY_CONFIG &&
    JSON.parse(configData?.LOYALTY_CONFIG);
  if (
    loyaltyConfig &&
    loyaltyConfig?.goldPid &&
    cartProductIdsValue?.indexOf(loyaltyConfig?.goldPid) > -1
  ) {
    visitorLoyal = true;
  }

  const dataLayerData: any = {
    event: "VirtualPageView",
    EmailId: userInfo?.email || null,
    PageUrl: window.location.href,
    mobile:
      typeof window !== "undefined" &&
      typeof window.btoa !== "undefined" &&
      (userInfo?.mobileNumber || userInfo?.guestNumber) !== undefined &&
      (userInfo?.mobileNumber || userInfo?.guestNumber) !== null
        ? window.btoa(userInfo?.mobileNumber || userInfo?.guestNumber)
        : "",
    visitorStore: window.location.host,
    isLoggedIn: userInfo?.isLogin ? 1 : 0,

    visitorPageType: "CheckoutPage",
    currencyCode: cartData?.currencyCode,
    netAmount:
      (cartData?.cartTotal &&
        Array.isArray(cartData?.cartTotal) &&
        cartData?.cartTotal?.find((item: any) => item.type === "total")
          ?.amount) ||
      0,
    orderTotal: cartData?.cartSubTotal || 0,
    visitorCartProductIds: cartProductIdsValue,
    visitorCartProductIdsArr: cartProductIds,
    visitorCartProductName: cartProductName,
    visitorCartProductNameArr: cartProductNameValue,
    visitorCartProductSku: cartProductSkuValue,
    visitorCartProductSkuArr: cartProductSku,
    visitorCartTotalValue: cartData?.cartSubTotal || 0,
    visitorProductCatArr: cartProductBrand,
    visitorproductQty: quanTityValue,
    visitorlenskartPrice:
      lenskartPriceValue !== "undefined" && lenskartPriceValue.toString(),
    visitormobile:
      typeof window !== "undefined" &&
      typeof window.btoa !== "undefined" &&
      (userInfo?.mobileNumber || userInfo?.guestNumber) !== undefined &&
      (userInfo?.mobileNumber || userInfo?.guestNumber) !== null
        ? window.btoa(userInfo?.mobileNumber || userInfo?.guestNumber)
        : "",
    visitoremail: userInfo?.email || userInfo?.guestEmail || null,
    visitorLoyal,
    visitorUtm_Source: utmParameters?.utm_source || "(direct)",
    visitorUtm_Cam: utmParameters?.utm_campaign || "(direct)",
    visitorUtm_Medium: utmParameters?.utm_medium || "(none)",

    // repeat for check if all goes ok then we have to remove repeated one
    utmSource: utmParameters?.utm_source || "",
    utmCampaign: utmParameters?.utm_campaign || "",
    utmMedium: utmParameters?.utm_medium || "",
    utmTerm: utmParameters?.utm_term || "",
    utmContent: utmParameters?.utm_content || "",
    website_source: `${pageInfo?.country} headless`,
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(dataLayerData);
};

export const successVirtualPageView = (pageInfo: any) => {
  const dataLayerData: any = {
    event: "VirtualPageView",
    website_source: `${pageInfo?.country} headless`,
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(dataLayerData);
};

export const triggerVirtualPageView = (
  userInfo: any,
  utmParameters: any,
  pageInfo: any,
  pageType: string
) => {
  const dataLayerData: any = {
    event: "VirtualPageView",
    EmailId: userInfo?.email || userInfo?.guestEmail || null,
    PageUrl: window.location.href,
    pageType: pageType,
    mobile:
      typeof window !== "undefined" &&
      typeof window.btoa !== "undefined" &&
      userInfo?.mobileNumber !== undefined &&
      userInfo?.mobileNumber !== null
        ? window.btoa(userInfo?.mobileNumber)
        : "",
    email:
      typeof window !== "undefined" &&
      typeof window.btoa !== "undefined" &&
      userInfo?.email !== undefined &&
      userInfo?.email !== null
        ? window.btoa(userInfo?.email)
        : "",
    visitorPageType: pageType,
    visitorUtm_Source: utmParameters?.utm_source || "(direct)",
    visitorUtm_Cam: utmParameters?.utm_campaign || "(direct)",
    visitorUtm_Medium: utmParameters?.utm_medium || "(none)",

    // repeat for check if all goes ok then we have to remove repeated one
    utmSource: utmParameters?.utm_source || "",
    utmCampaign: utmParameters?.utm_campaign || "",
    utmMedium: utmParameters?.utm_medium || "",
    utmTerm: utmParameters?.utm_term || "",
    utmContent: utmParameters?.utm_content || "",
    website_source: `${pageInfo?.country} headless`,
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(dataLayerData);
};
