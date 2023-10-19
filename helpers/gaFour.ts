import {
  addToWishListGA4Type,
  categoryType,
  viewCartGA4ProductType,
  viewPaymentGAType,
  addToViewSimilarGA4Type,
  categoryGA3Type,
} from "@/types/googleAnalytics";
import { localStorageHelper } from "@lk/utils";
import { SEARCH_FUNNEL } from "../constants";
import { triggerDataLayerOnPageView } from "./googleAnalytics";
import sessionStorageHelper from "./sessionStorageHelper";
import {
  discountCalculator,
  discountCalculatorV2,
  getCategoryType,
  getCurrencyCode,
  getMembershipDiscount,
  getProductCategories,
  getProductCategoriesGA3,
  getProductType,
  getTopPids,
  pushDataLayer,
} from "./utils";

export const viewItemListGA4 = (
  productData: any,
  login: boolean,
  event: string,
  categoryData: any,
  pageInfo: any,
  category5?: any,
  search?: string,
  searchType?: string,
  pageName?: string
) => {
  const ecommerce: any = {
    item_list_id:  search ??pageInfo?.id,
    item_list_name: searchType ?? categoryData?.categoryName,
    item_category5: category5 ?? "",
    items: [],
  };
  let isPlano: any = "";

  if (productData?.length > 0) {
    productData?.map((product: any, idx: number) => {
      // console.log("view_item_list product", product);
      const obj: categoryType = {
        item_id: product.id,
        item_name: product.productModelName,
        coupon: "",
        affiliation: "",
        currency: product?.price?.currency,
        discount: discountCalculator(
          product?.price.basePrice,
          product?.price.lkPrice
        ),
        index: idx + 1,
        item_brand: product?.productName,
        item_category: getCategoryType(product?.classification), // getProductType(product.sku || ""),
        item_list_id: search ?? pageInfo?.id,
        item_list_name: searchType ?? categoryData?.categoryName,
        item_variant: product.color || "",
        price: product.price.lkPrice,
        quantity: 1,
      };
      ecommerce.items.push(obj);
    });
  }
  triggerDataLayerOnPageView({
    ecommerce,
    event: "view_item_list",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });

  //GA3
  const ecomm: any = {
    currencyCode: productData[0]?.price?.currency,
    impressions: [],
  };
  if (productData.length > 0) {
    productData?.map((product: any, idx: number) => {
      // console.log("view_item_list product", product);
      const obj1: categoryGA3Type = {
        name: product.productModelName,
        id: product.id,
        price: product.price.lkPrice,
        brand: product?.productName,
        category: getCategoryType(product?.classification), //getProductType(product.sku || ""),
        variant: product.color || "",
        list: categoryData?.categoryName,
        position: idx + 1,
      };
      ecomm.impressions.push(obj1);
    });
  }

  const ga3: any = {
    event: "productImpression",
    pageName: pageName || "product-listing-page",
    userType: login ? "loggedin" : "guest",
    ecommerce: ecomm,
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(ga3);
};

export const viewItemGA4 = (
  productData: any,
  login: boolean,
  pageInfo: any,
  item_list_id: string,
  item_list_name: string,
  index?: string | number,
  category5?: any,
  search?: string,
  searchType?: string,
 
  pageName?: string
) => {
  let isPlano: any = "";
  if (productData?.type === "Contact Lens") {
    if (typeof productData?.isPlano !== "undefined") {
      isPlano = true;
    } else if (!productData?.isPlano && productData?.jit) {
      isPlano = false;
    } else isPlano = !!productData?.isPlano;
  } else {
    isPlano = "na";
  }
  // const productListingInfo =
  //   (localStorageHelper.getItem("productListingInfo") &&
  //     JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
  //   {};
  // const item_list_id = productListingInfo?.productData?.id?.item_list_id;
  // console.log("item_list_id", item_list_id);
  const ecommerce: any = { items: [] };
  // console.log("view_item productData", productData);
  const product = {
    item_id: productData.id,
    item_name: productData.productModelName,
    coupon: "",
    alliliation: "",
    currency: productData?.price?.currency,
    discount: discountCalculator(
      productData?.price.basePrice,
      productData?.price.lkPrice
    ),
    index: index || 0,
    item_brand: productData?.brandName,
    item_category: getCategoryType(productData?.classification), //getProductType(productData?.sku),
    item_category5: category5 ?? "",
    item_list_id: search ?? item_list_id,
    item_list_name: searchType ?? item_list_name,
    item_variant: productData?.generalProductInfo?.find(
      (item: any) => item?.name == "Frame colour"
    )?.value,
    price: productData?.price.lkPrice,
    quantity: 1,
  };
  ecommerce.items.push(product);
  triggerDataLayerOnPageView({
    ecommerce,
    event: "view_item",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });

  //GA3
  const ecomm: any = {
    currencyCode: productData?.price?.currency,
    detail: {
      actionField: { list: item_list_name },
      products: [],
    },
  };
  const obj1: categoryGA3Type = {
    name: productData.productModelName,
    id: productData.id,
    price: productData.price.lkPrice,
    brand: productData.productName,
    category: getCategoryType(productData?.classification), //getProductType(productData.sku || ""),
    variant: productData.color || "",
    list: item_list_name,
    position: index || 0,
  };

  ecomm.detail.products.push(obj1);

  const ga3: any = {
    event: "productDetailView",
    pageName: pageName || "product-detail-page",
    userType: login ? "loggedin" : "guest",
    ecommerce: ecomm,
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(ga3);
};

export const viewCartGA4 = (cartData: any, login: boolean, pageInfo: any) => {
  let isPlano: any = "";
  const ecommerce: any = {
    currency: cartData?.currencyCode,
    value:
      cartData?.cartTotal &&
      Array.isArray(cartData?.cartTotal) &&
      cartData?.cartTotal?.find((item: any) => item.type === "total")?.amount,
    coupon: cartData?.appliedGv?.code,
    items: [],
  };
  const productListingInfo =
    (localStorageHelper.getItem("productListingInfo") &&
      JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
    {};
  cartData.cartItems.map((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.itemId]?.["index"] || "";
    // console.log("item_list_id", item_list_id);
    // console.log("item_list_name", item_list_name);
    // console.log("view_cart item", item);
    const product: viewCartGA4ProductType = {
      item_id: item.itemId,
      item_name: item.itemModel,
      coupon: "",
      alliliation: "",
      currency: cartData?.currencyCode,
      discount: discountCalculator(
        item.itemCatalogPrice[0].value,
        item.itemCatalogPrice[1].value
      ),
      index: index,
      item_brand: item.itemBrandName,
      item_category: getCategoryType(item.itemClassification), //getProductType(item.itemSku),
      item_list_id: item_list_id,
      item_list_name: item_list_name,
      item_variant: item.itemFrameColor || "",
      price: item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
      quantity: item.itemQty,
    };
    getProductCategories(item, product);
    if (sessionStorageHelper.getItem(SEARCH_FUNNEL)) {
      const cartData: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
      if (cartData[item.itemId]) {
        const obj2 = cartData[item.itemId].search[0];
        for (const key in obj2) {
          product[key] = obj2[key];
        }
      }
    }
    ecommerce.items.push(product);
    return ecommerce;
  });
  triggerDataLayerOnPageView({
    ecommerce,
    event: "view_cart",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });
};

export const addToWishListGA4 = (item: any, login: boolean, pageInfo: any) => {
  let isPlano: any = "";
  const ecommerce: any = {
    currency: item?.price.currency,
    value: "", // to be discussed
    items: [],
  };
  const productListingInfo =
    (localStorageHelper.getItem("productListingInfo") &&
      JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
    {};
  const item_list_id = productListingInfo?.[item?.id]?.["item_list_id"] || "";
  const item_list_name =
    productListingInfo?.[item?.id]?.["item_list_name"] || "";
  const index = productListingInfo?.[item?.id]?.["index"] || "";
  // console.log("item_list_id", item_list_id);
  // console.log("item_list_name", item_list_name);
  // console.log("add_to_wishlist item", item);
  const obj: addToWishListGA4Type = {
    item_id: item?.id,
    item_name: item.productModelName,
    affiliation: "",
    coupon: "",
    currency: item?.price.currency,
    discount: item?.prices
      ? discountCalculator(item.price.basePrice, item.price.lkPrice)
      : "",
    index: index,
    item_brand: item?.brandName,
    item_category: getCategoryType(item?.classification), //getProductType(item?.sku || ""),
    item_category2: "",
    item_category3: "",
    item_category4: "",
    item_list_id: item_list_id,
    item_list_name: item_list_name,
    item_variant: item?.frameColour || item?.frameColor || "",
    price: item?.lkPrice,
    quantity: 1,
  };
  ecommerce.items.push(obj);
  triggerDataLayerOnPageView({
    ecommerce,
    event: "add_to_wishlist",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });
};

export const addToCartGA4 = (
  cartItems: any,
  prevCartItems: any,
  login: boolean,
  pageInfo?: any
) => {
  let isPlano: any = "";
  const idx = cartItems?.length - prevCartItems?.length || 1;
  let clPowerSubmission;
  if (cartItems[cartItems.length - idx]?.sku?.indexOf("contact:") !== -1) {
    if (
      cartItems[cartItems.length - idx]?.prescriptionView?.left?.sph !==
        "Call Me/Email Me for Power" &&
      cartItems[cartItems.length - idx]?.prescriptionView?.left?.sph !== ""
    ) {
      clPowerSubmission = "self-from-pdp";
    } else if (
      cartItems[cartItems.length - idx]?.prescriptionView?.left?.sph ===
      "Call Me/Email Me for Power"
    ) {
      clPowerSubmission = "later-on-checkout-or-call";
    } else if (cartItems[cartItems.length - idx]?.jit) {
      clPowerSubmission = "jit-usecase";
    } else if (
      cartItems[cartItems.length - idx]?.isPlano ||
      cartItems[cartItems.length - idx]?.powerRequired ===
        "POWER_NOT_REQUIRED" ||
      cartItems[cartItems - idx]?.prescriptionView?.left?.sph === ""
    ) {
      clPowerSubmission = "power-not-required";
    } else {
      clPowerSubmission = "na";
    }
  } else {
    clPowerSubmission = "na";
  }
  if (cartItems.length > 0) {
    const productListingInfo =
      (localStorageHelper.getItem("productListingInfo") &&
        JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
      {};

    const ecommerce: any = { items: [] };
    cartItems.map((item: any, idx: number) => {
      const item_list_id =
        productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
      const item_list_name =
        productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
      const index = productListingInfo?.[item?.itemId]?.["index"] || "";
      // console.log("item_list_id", item_list_id);
      // console.log("item_list_name", item_list_name);
      // console.log("add_to_cart item", item);
      const product: viewCartGA4ProductType = {
        item_id: item.itemId,
        item_name: item.itemModel,
        coupon: "",
        alliliation: "",
        currency: item?.price?.currencyCode,
        discount: discountCalculator(
          item.itemCatalogPrice[0].value,
          item.itemCatalogPrice[1].value
        ),
        index: index,
        item_brand: item.itemBrandName,
        item_category: getCategoryType(item.itemClassification), //getProductType(item.itemSku),
        item_category2: "",
        item_category3: "",
        item_category4: "",
        item_list_id: item_list_id,
        item_list_name: item_list_name,
        item_variant:
          item.frameColor || item.frameColour || item.itemFrameColor || "",
        price:
          item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
        quantity: item.itemQty,
      };
      getProductCategories(item, product);
      if (sessionStorageHelper.getItem(SEARCH_FUNNEL)) {
        const cartData: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
        console.log("cartData",cartData,item.itemId,cartData[item.itemId]?.search)
        if (cartData[item.itemId]) {
          const obj2 = cartData[item.itemId].search[0];
          for (const key in obj2) {
            product[key] = obj2[key];
          }
        }
        // console.log("Cartdata",cartData,"itemId",cartData[item.itemId],item)
      }
      ecommerce.items.push(product);
      return ecommerce;
    });
    triggerDataLayerOnPageView({
      ecommerce,
      event: "add_to_cart",
      isPlano,
      clPowerSubmission: "",
      login_status: login ? "loggedin" : "guest",
      country_code: pageInfo?.country,
      currency_code: getCurrencyCode(pageInfo?.country),
    });

    //GA3
    const ecomm: any = {
      currencyCode: (cartItems && cartItems[0]?.price?.currencyCode) || "",
      add: {
        products: [],
      },
    };

    cartItems.map((item: any, idx: number) => {
      const item_list_id =
        productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
      const item_list_name =
        productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
      const index = productListingInfo?.[item?.itemId]?.["index"] || "";

      const obj1: categoryGA3Type = {
        name: item.itemModel,
        id: item.itemId,
        price:
          item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
        brand: item.itemBrandName,
        category: getCategoryType(item.itemClassification), //getProductType(item.itemSku),
        variant:
          item.frameColor || item.frameColour || item.itemFrameColor || "",
        list: item_list_name,
        position: index || "",
      };
      getProductCategoriesGA3(item, obj1);
      ecomm.add.products.push(obj1);
      return ecomm;
    });

    const ga3: any = {
      event: "addToCart",
      userType: login ? "loggedin" : "guest",
      ecommerce: ecomm,
      arch_type: "new-arch",
      dimension21: "new-arch",
      country_code: pageInfo?.country,
      currency_code: getCurrencyCode(pageInfo?.country),
    };
    pushDataLayer(ga3);
  }
};

export const removeFromCartGA4 = (
  item: any,
  login: boolean,
  pageInfo: any,
  pageName?: string
) => {
  // console.log("removeFromCartGA4", item);
  const ecommerce: any = { items: [] };
  let isPlano: any = "";
  const productListingInfo =
    (localStorageHelper.getItem("productListingInfo") &&
      JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
    {};
  const item_list_id =
    productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
  const item_list_name =
    productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
  const index = productListingInfo?.[item?.itemId]?.["index"] || "";
  // console.log("remove_from_cart item", item);

  const product: viewCartGA4ProductType = {
    item_id: item?.itemId,
    item_name: item.itemModel,
    alliliation: "",
    item_brand: item?.itemBrandName,
    coupon: "",
    currency: item?.currencyCode,
    discount: discountCalculator(
      item.itemCatalogPrice[0].value,
      item.itemCatalogPrice[1].value
    ),
    index: index,
    item_category: getCategoryType(item?.itemClassification),
    item_list_id: item_list_id,
    item_list_name: item_list_name,
    item_variant: item.itemFrameColor || "",
    price: item?.price?.value,
    quantity: item?.itemQty,
  };
  getProductCategories(item, product);
  ecommerce.items.push(product);
  triggerDataLayerOnPageView({
    ecommerce,
    event: "remove_from_cart",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });

  //GA3
  const ecomm: any = {
    currencyCode: item?.currencyCode || "",
    remove: {
      products: [],
    },
  };

  const obj1: categoryGA3Type = {
    name: item.itemModel,
    id: item.itemId,
    price: item?.price?.value,
    brand: item.itemBrandName,
    category: getCategoryType(item?.itemClassification), //getProductType(item.itemSku),
    variant: item.itemFrameColor || item.frameColor || item.frameColour || "",
    list: item_list_name,
    position: index || "",
  };
  getProductCategoriesGA3(item, obj1);
  ecomm.remove.products.push(obj1);

  const ga3: any = {
    event: "removeFromCart",
    pageName: pageName || "cart",
    userType: login ? "loggedin" : "guest",
    ecommerce: ecomm,
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(ga3);
};

export const beginCheckoutGA4 = (
  cartData: any,
  login: boolean,
  pageInfo: any
) => {
  const ecommerce: any = {
    currency: cartData.currencyCode,
    value: cartData?.cartTotal?.find((item: any) => item.type === "total")
      ?.amount,
    coupon_discount: cartData?.appliedGv?.amount,
    coupon: cartData?.appliedGv?.code,
    items: [],
  };
  const productListingInfo =
    (localStorageHelper.getItem("productListingInfo") &&
      JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
    {};

  cartData.cartItems.map((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.itemId]?.["index"] || "";
    // console.log("beginCheckoutGA4", item);
    const product: viewCartGA4ProductType = {
      item_id: item.itemId,
      item_name: item.itemModel,
      coupon: "",
      alliliation: "",
      currency: cartData?.currencyCode,
      discount: discountCalculator(
        item.itemCatalogPrice[0].value,
        item.itemCatalogPrice[1].value
      ),
      index: index,
      item_brand: item.itemBrandName,
      item_category: getCategoryType(item?.itemClassification), // getProductType(item.itemSku),
      item_list_id: item_list_id,
      item_list_name: item_list_name,
      item_variant: item.itemFrameColor || "",
      price: item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
      quantity: item.itemQty,
    };

    getProductCategories(item, product);
    if (sessionStorageHelper.getItem(SEARCH_FUNNEL)) {
      const cartData: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
      if (cartData[item.itemId]) {
        const obj2 = cartData[item.itemId].search[0];
        for (const key in obj2) {
          product[key] = obj2[key];
        }
      }
      // console.log("Cartdata",cartData,"itemId",cartData[item.itemId],item)
    }
    ecommerce.items.push(product);
    return ecommerce;
  });
  let isPlano: any = "";
  triggerDataLayerOnPageView({
    ecommerce,
    event: "begin_checkout",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });

  //GA3
  const ecomm: any = {
    currencyCode: cartData?.currencyCode || "",
    checkout: {
      actionField: {
        step: 1,
        option: "Begin Checkout",
      },
      products: [],
    },
  };

  cartData.cartItems.map((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.itemId]?.["index"] || "";

    const obj1: categoryGA3Type = {
      name: item.itemModel,
      id: item.itemId,
      price: item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
      brand: item.itemBrandName,
      category: getCategoryType(item.itemClassification), //getProductType(item.itemSku),
      variant: item.frameColor || item.frameColour || "",
      list: item_list_name,
      position: index || "",
    };
    getProductCategoriesGA3(item, obj1);
    ecomm.checkout.products.push(obj1);
    return ecomm;
  });

  const ga3: any = {
    event: "checkout1",
    pageName: "cart",
    userType: login ? "loggedin" : "guest",
    ecommerce: ecomm,
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(ga3);
};

export const addShippingInfoGA4 = (
  cartData: any,
  login: boolean,
  pageInfo: any
) => {
  const ecommerce: any = {
    currency: cartData.currencyCode,
    value: cartData?.cartTotal?.find((item: any) => item.type === "total")
      ?.amount,
    coupon: cartData?.appliedGv?.code,
    shopping_tier: "",
    items: [],
  };
  const productListingInfo =
    (localStorageHelper.getItem("productListingInfo") &&
      JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
    {};
  cartData.cartItems.map((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.itemId]?.["index"] || "";
    // console.log("add_shipping_info item", item);
    const product: viewCartGA4ProductType = {
      item_id: item.itemId,
      item_name: item.itemModel,
      coupon: "",
      alliliation: "",
      currency: cartData?.currencyCode,
      discount: discountCalculator(
        item.itemCatalogPrice[0].value,
        item.itemCatalogPrice[1].value
      ),
      index: index,
      item_brand: item.itemBrandName,
      item_category: getCategoryType(item.itemClassification), // getProductType(item.itemSku),
      item_list_id: item_list_id,
      item_list_name: item_list_name,
      item_variant: item.itemFrameColor || "",
      price: item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
      quantity: item.itemQty,
    };
    getProductCategories(item, product);
    if (sessionStorageHelper.getItem(SEARCH_FUNNEL)) {
      const cartData: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
      if (cartData[item.itemId]) {
        const obj2 = cartData[item.itemId].search[0];
        for (const key in obj2) {
          product[key] = obj2[key];
        }
      }
      // console.log("Cartdata",cartData,"itemId",cartData[item.itemId],item)
    }
    ecommerce.items.push(product);
    return ecommerce;
  });
  let isPlano: any = "";
  triggerDataLayerOnPageView({
    ecommerce,
    event: "add_shipping_info",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });

  //GA3
  const ecomm: any = {
    currencyCode: cartData?.currencyCode || "",
    checkout: {
      actionField: {
        step: 2,
        option: "Shipping Address",
      },
      products: [],
    },
  };

  cartData.cartItems.map((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.itemId]?.["index"] || "";

    const obj1: categoryGA3Type = {
      name: item.itemModel,
      id: item.itemId,
      price: item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
      brand: item.itemBrandName,
      category: getCategoryType(item.itemClassification), //getProductType(item.itemSku),
      variant: item.frameColor || item.frameColour || "",
      list: item_list_name,
      position: index || "",
    };
    getProductCategoriesGA3(item, obj1);
    ecomm.checkout.products.push(obj1);
    return ecomm;
  });

  const ga3: any = {
    event: "checkout2",
    pageName: "select-address",
    userType: login ? "loggedin" : "guest",
    ecommerce: ecomm,
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(ga3);
};

export const addPaymentInfoGA4 = (
  cartData: any,
  paymentType: string,
  login: boolean,
  pageInfo: any
) => {
  let isPlano: any = "";
  const ecommerce: any = {
    currency: cartData.currencyCode,
    value: cartData?.cartTotal?.find?.((item: any) => item.type === "total")
      ?.amount,
    coupon_discount: cartData?.appliedGv?.amount,
    coupon: cartData?.appliedGv?.code,
    payment_type: paymentType,
    membership_discount: getMembershipDiscount(cartData),
    items: [],
  };
  const productListingInfo =
    (localStorageHelper.getItem("productListingInfo") &&
      JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
    {};
  cartData.cartItems.map((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.itemId]?.["index"] || "";
    // console.log("addPaymentInfoGA4", item);
    const product: viewPaymentGAType = {
      item_id: item.itemId,
      item_name: item.itemModel,
      coupon: "",
      alliliation: "",
      currency: cartData?.currencyCode,
      discount: discountCalculator(
        item.itemCatalogPrice[0].value,
        item.itemCatalogPrice[1].value
      ),
      index: index,
      item_brand: item.itemBrandName,
      item_category: getCategoryType(item.itemClassification), // getProductType(item.itemSku),
      item_variant: item.itemFrameColor || "",
      price: item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
      quantity: item.itemQty,
      item_list_id: item_list_id,
      item_list_name: item_list_name,
    };
    getProductCategories(item, product);
    if (sessionStorageHelper.getItem(SEARCH_FUNNEL)) {
      const cartData: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
      if (cartData[item.itemId]) {
        const obj2 = cartData[item.itemId].search[0];
        for (const key in obj2) {
          product[key] = obj2[key];
        }
      }
      // console.log("Cartdata",cartData,"itemId",cartData[item.itemId],item)
    }
    ecommerce.items.push(product);
    return ecommerce;
  });
  triggerDataLayerOnPageView({
    ecommerce,
    event: "add_payment_info",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });

  //GA3
  const ecomm: any = {
    currencyCode: cartData?.currencyCode || "",
    checkout: {
      actionField: {
        step: 3,
        option: "Payment",
      },
      products: [],
    },
  };

  cartData.cartItems.map((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.itemId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.itemId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.itemId]?.["index"] || "";

    const obj1: categoryGA3Type = {
      name: item.itemModel,
      id: item.itemId,
      price: item?.itemPriceObj?.itemPrice || item?.itemCatalogPrice[1]?.value,
      brand: item.itemBrandName,
      category: getCategoryType(item.itemClassification), //getProductType(item.itemSku),
      variant: item.frameColor || item.frameColour || "",
      list: item_list_name,
      position: index || "",
    };
    getProductCategoriesGA3(item, obj1);
    ecomm.checkout.products.push(obj1);
    return ecomm;
  });

  const ga3: any = {
    event: "checkout3",
    pageName: "payment",
    userType: login ? "loggedin" : "guest",
    ecommerce: ecomm,
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(ga3);
};

export const productImpressionGA = (
  //this function is not being used, remove during clean up
  categoryData: any,
  productList: any,
  loginStatus: boolean
) => {
  // const { categoryData, productList } = categoryInfo
  const ga: any = {
    event: "productImpression",
    userType: loginStatus ? "loggedIn" : "guest",
    ecommerce: {
      currencyCode: "INR",
      impressions: getTopPids(categoryData, productList),
    },
    arch_type: "new-arch",
  };
  pushDataLayer(ga);
};

// export const purchaseInfoGA4 = (
//   order: any,
//   userInfo: any,
//   eventName: string
// ) => {
//   const ecommerce: any = {
//     currency: order?.amount?.currencyCode,
//     transaction_id: order?.id,
//     value: order?.amount?.total,
//     tax: order?.amount?.totalTax,
//     shipping: order?.amount?.shipping,
//     membership_discount:
//       order?.amount?.discounts[0]?.type === "implicit"
//         ? order?.amount?.discounts[0]?.amount
//         : 0,
//     coupon_discount:
//       order?.amount?.discounts[0]?.type === "gv"
//         ? order?.amount?.discounts[0]?.amount
//         : 0,
//     coupon:
//       order?.amount?.discounts[0]?.type === "gv"
//         ? order?.amount?.discounts[0]?.code
//         : "",
//     payment_mode: order?.payments?.paymentList[0]?.method,
//     items: [],
//   };
//   order?.items?.forEach((item: any, idx: number) => {
//     const itemInfo: any = {
//       item_id: item?.productId,
//       item_name: item?.modelName,
//       currency: order?.amount?.currencyCode,
//       discount: discountCalculatorV2(item?.catalogPrices),
//       index: idx,
//       item_brand: item?.brandName,
//       item_category: getProductType(item?.sku),
//       item_variant: item?.frameColor || item?.frameColour || "",
//       price: item?.amount?.total,
//       quantity: item?.quantity,
//     };
//     ecommerce.items.push(itemInfo);
//     getProductCategories(item, ecommerce.items[ecommerce.items.length - 1]);
//   });
//   const eventData = {
//     ecommerce,
//     event: "purchase",
//     order_content: getOrderContent(order),
//     delivery_option: order?.deliveryOption,
//     gokwik_risk_flag:
//       order?.gokwikRtoDetails?.riskFlag?.split(" ")[0]?.toLowerCase() || "",
//     gokwik_order_type: order?.payments?.paymentList[0]?.method,
//     last_order_city: order?.shippingAddress?.city,
//     number_of_items: order?.items?.length,
//     last_transaction_date: new Date(order?.createdAt)
//       ? new Date(order?.createdAt).toLocaleString("sv").split(" ")[0]
//       : "",
//   };
//   pushDataLayer(eventData);
// };

export const purchaseInfoGA4 = (
  order: any,
  userInfo: any,
  eventName: string,
  pageInfo: any
) => {
  let storeCredit = 0;
  const sc = order?.amount?.discounts.find(
    (discount: any) => discount.type === "sc"
  );
  if (sc !== null && sc !== undefined) {
    storeCredit = sc.amount;
  }

  const productListingInfo =
    (localStorageHelper.getItem("productListingInfo") &&
      JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
    {};

  const ecommerce: any = {
    currency: order?.amount?.currencyCode,
    transaction_id: order?.id,
    value: order?.amount?.total + storeCredit,
    tax: order?.amount?.totalTax,
    shipping: order?.amount?.shipping,
    membership_discount:
      order?.amount?.discounts[0]?.type === "implicit"
        ? order?.amount?.discounts[0]?.amount
        : 0,
    coupon_discount:
      order?.amount?.discounts[0]?.type === "gv"
        ? order?.amount?.discounts[0]?.amount
        : 0,
    coupon:
      order?.amount?.discounts[0]?.type === "gv"
        ? order?.amount?.discounts[0]?.code
        : "",
    payment_mode: order?.payments?.paymentList[0]?.method,
    items: [],
  };
  order?.items?.forEach((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.productId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.productId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.productId]?.["index"] || "";
    // console.log("purchaseInfoGA4 =>", item);
    const itemInfo: any = {
      item_id: item?.productId,
      item_name: item?.modelName,
      currency: order?.amount?.currencyCode,
      discount: discountCalculatorV2(item?.catalogPrices),
      index: index,
      item_brand: item?.brandName,
      item_category: getCategoryType(item?.classification), //getProductType(item?.sku),
      item_variant: item?.frameColor || item?.frameColour || "",
      price: item?.amount?.total,
      quantity: item?.quantity,
      item_list_id: item_list_id,
      item_list_name: item_list_name,
    };
    if (sessionStorageHelper.getItem(SEARCH_FUNNEL)) {
      const cartData: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
      if (cartData[item?.productId]) {
        const obj2 = cartData[item?.productId].search[0];
        for (const key in obj2) {
          itemInfo[key] = obj2[key];
        }
      }
    }
    getProductCategories(item, itemInfo, true);
    ecommerce.items.push(itemInfo);
  });
  const eventData = {
    ecommerce,
    event: eventName,
    order_content: getOrderContent(order),
    delivery_option: order?.deliveryOption,
    gokwik_risk_flag:
      order?.gokwikRtoDetails?.riskFlag?.split(" ")[0]?.toLowerCase() || "",
    gokwik_order_type: order?.payments?.paymentList[0]?.method,
    last_order_city: order?.shippingAddress?.city,
    number_of_items: order?.items?.length,
    last_transaction_date: new Date(order?.createdAt)
      ? new Date(order?.createdAt).toLocaleString("sv").split(" ")[0]
      : "",
    mall_id: order?.metadata?.mall?.split("|")[0] || 0,
    mall_lead_source: order?.metadata?.mall?.split("|")[1] || "",
    coupon_category: order?.amount?.discounts
      ?.map((discount: any) => discount.type)
      ?.join(","),
    userType: order?.guest ? "guest" : "loggedIn",
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(eventData);
};

export const purchaseInfoGA3 = (
  order: any,
  userInfo: any,
  eventName: string,
  pageName?: string,
  pageInfo?: any
) => {
  let storeCredit = 0;
  const sc = order?.amount?.discounts.find(
    (discount: any) => discount.type === "sc"
  );
  if (sc !== null && sc !== undefined) {
    storeCredit = sc.amount;
  }

  const productListingInfo =
    (localStorageHelper.getItem("productListingInfo") &&
      JSON.parse(localStorageHelper.getItem("productListingInfo"))) ||
    {};

  const ecommerce: any = {
    currency: order?.amount?.currencyCode,
    id: order?.id,
    revenue: order?.amount?.total + storeCredit,
    tax: order?.amount?.totalTax,
    shipping: order?.amount?.shipping,
    membership_discount:
      order?.amount?.discounts[0]?.type === "implicit"
        ? order?.amount?.discounts[0]?.amount
        : 0,
    coupon_discount:
      order?.amount?.discounts[0]?.type === "gv"
        ? order?.amount?.discounts[0]?.amount
        : 0,
    couponCategory:
      order?.amount?.discounts[0]?.type === "gv"
        ? order?.amount?.discounts[0]?.code
        : "",
    payment_mode: order?.payments?.paymentList[0]?.method,
    items: [],
  };
  order?.items?.forEach((item: any, idx: number) => {
    const item_list_id =
      productListingInfo?.[item?.productId]?.["item_list_id"] || "";
    const item_list_name =
      productListingInfo?.[item?.productId]?.["item_list_name"] || "";
    const index = productListingInfo?.[item?.productId]?.["index"] || "";
    // console.log("purchaseInfoGA4 =>", item);
    const itemInfo: any = {
      id: item?.productId,
      name: item?.modelName,
      brand: item?.brandName,
      category: getCategoryType(item?.classification), //getProductType(item?.sku),
      variant: item?.frameColor || item?.frameColour || "",
      price: item?.amount?.total,
      quantity: item?.quantity,
    };
    getProductCategoriesGA3(item, itemInfo, true);
    ecommerce.items.push(itemInfo);
  });
  const eventData = {
    ecommerce,
    event: eventName,
    pageName: pageName || "order-success",
    order_content: getOrderContent(order),
    delivery_option: order?.deliveryOption,
    gokwik_risk_flag:
      order?.gokwikRtoDetails?.riskFlag?.split(" ")[0]?.toLowerCase() || "",
    gokwik_order_type: order?.payments?.paymentList[0]?.method,
    last_order_city: order?.shippingAddress?.city,
    number_of_items: order?.items?.length,
    last_transaction_date: new Date(order?.createdAt)
      ? new Date(order?.createdAt).toLocaleString("sv").split(" ")[0]
      : "",
    mall_id: order?.metadata?.mall?.split("|")[0] || 0,
    mall_lead_source: order?.metadata?.mall?.split("|")[1] || "",
    coupon_category: order?.amount?.discounts
      ?.map((discount: any) => discount.type)
      ?.join(","),
    userType: order?.guest ? "guest" : "loggedIn",
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(eventData);
};

export const getOrderContent = (order: any) => {
  let cartHasMembership = false;
  let cartHasProducts = false;
  if (order?.items?.length) {
    cartHasMembership =
      order?.items?.filter(
        (item: any) => getProductType(item?.sku) === "membership"
      ).length > 0;
    cartHasProducts =
      order?.items?.filter(
        (item: any) => getProductType(item?.sku) !== "membership"
      ).length > 0;
  }
  if (cartHasMembership && cartHasProducts) return "membership-and-product";
  else if (cartHasMembership) return "membership-only";
  else if (cartHasProducts) return "product-only";
  return "";
};

var clientID = function () {
  var match = document.cookie.match("(?:^|;)\\s*_ga=([^;]*)"),
    raw = match ? decodeURIComponent(match[1]) : null;
  if (raw) {
    match = raw.match(/(\d+\.\d+)$/);
  }
  return match ? match[1] : null;
};

export function ctaClickEvent(
  eventName: string,
  cta_name: any,
  cta_flow_and_page: string,
  userInfo: any,
  pageInfo: any
) {
  let obj = {
    event: eventName,
    cta_flow_and_page: cta_flow_and_page,
    cta_name: cta_name,
    customer_id: userInfo?.userDetails?.id || "",
    lk_user_type: userInfo?.userDetails?.hasPlacedOrder ? "lk-repeat" : "lkNew",
    country_code: pageInfo?.country,
    platform: pageInfo?.deviceType,
    login_status: userInfo?.isLogin ? "loggedin" : "guest",
    mobile: userInfo?.mobileNumber ? btoa(userInfo?.mobileNumber) : "",
    email: userInfo?.email ? btoa(userInfo?.email) : "",
    client_id: clientID(),
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(obj);
}

export function loginSuccess(eventName: string, userInfo: any, pageInfo: any) {
  let obj = {
    event: eventName,
    customer_id: userInfo?.id || "",
    lk_user_type: userInfo?.hasPlacedOrder ? "lk-repeat" : "lkNew",
    country_code: pageInfo?.country,
    platform: pageInfo?.deviceType,
    login_status: "loggedin",
    mobile: userInfo?.telephone ? btoa(userInfo?.telephone) : "",
    email: userInfo?.email ? btoa(userInfo?.email) : "",
    client_id: clientID(),
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(obj);
}

export function pageViewEvent(
  eventName: string,
  cta_name: any,
  screen_name: string,
  userInfo: any,
  pageInfo: any
) {
  let obj = {
    event: eventName,
    page_name: screen_name,
    cta_name: cta_name,
    customer_id: userInfo?.userDetails?.id,
    lk_user_type: userInfo?.userDetails?.hasPlacedOrder ? "lk-repeat" : "lkNew",
    country_code: pageInfo?.country,
    platform: pageInfo?.deviceType,
    login_status: userInfo?.isLogin ? "loggedin" : "guest",
    mobile: userInfo?.mobileNumber ? btoa(userInfo?.mobileNumber) : "",
    email: userInfo?.email ? btoa(userInfo?.email) : "",
    client_id: clientID(),
    arch_type: "new-arch",
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  pushDataLayer(obj);
}

export const addToViewSimilarGA4 = (
  item: any,
  index?: string | number,
  pageInfo?: any
) => {
  let isPlano: any = "";
  const ecommerce: any = {
    currency: item?.price.currency,
    value: "", // to be discussed
    items: [],
  };
  const obj: addToViewSimilarGA4Type = {
    cta_flow_and_page: "product-detail-page",
    cta_name: "view-similar",
    item_id: item?.id,
    item_name: item.productModelName,
    affiliation: "",
    coupon: "",
    currency: item?.price.currency,
    discount: item?.prices
      ? discountCalculator(item.price.basePrice, item.price.lkPrice)
      : "",
    index: index || 0,
    item_brand: item?.brandName,
  };
  ecommerce.items.push(obj);
  triggerDataLayerOnPageView({
    ecommerce,
    event: "cta_click",
    isPlano,
    clPowerSubmission: "",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });
};

export const bannerGA4 = (
  event: string,
  creative_name: string,
  userInfo: any,
  promotionId: string,
  promotionName: string,
  itemListId: string,
  itemListName: string,
  pageInfo: any
) => {
  const ecommerce: any = {
    creative_name: creative_name,
    promotion_id: promotionId,
    promotion_name: promotionName,
    // item_list_id: itemListId,
    // item_list_name: itemListName,
  };
  let obj = {
    event: event,
    login_status: userInfo?.isLogin ? "loggedin" : "guest",
    ecommerce,
    arch_type: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };
  // console.log("bannerGA4", event, obj);

  pushDataLayer(obj);

  const ga3promoView = {
    event: "promotionImpression",
    userType: userInfo?.userDetails?.hasPlacedOrder ? "lk-repeat" : "lkNew",
    ecommerce: {
      promoView: {
        promotions: [
          {
            id: promotionId,
            name: promotionName,
            creative: creative_name,
          },
        ],
      },
    },
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  const ga3promoClick = {
    event: "promotionClick",
    userType: userInfo?.userDetails?.hasPlacedOrder ? "lk-repeat" : "lkNew",
    ecommerce: {
      promoClick: {
        promotions: [
          {
            id: promotionId,
            name: promotionName,
            creative: creative_name,
          },
        ],
      },
    },
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(event === "view_promotion" ? ga3promoView : ga3promoClick);
};

export const selectItemGA4 = (
  productData: any,
  login: boolean,
  pageInfo: any,
  item_list_id?: string | number | null,
  item_list_name?: string,
  index?: string | number,
  pageName?: string
) => {
  let isPlano: any = "";
  if (productData?.type === "Contact Lens") {
    if (typeof productData?.isPlano !== "undefined") {
      isPlano = true;
    } else if (!productData?.isPlano && productData?.jit) {
      isPlano = false;
    } else isPlano = !!productData?.isPlano;
  } else {
    isPlano = "na";
  }
  const ecommerce: any = {
    item_list_id: item_list_id,
    item_list_name: item_list_name,
    items: [],
  };
  // console.log("productData", productData);

  const product = {
    item_id: productData.id,
    item_name: productData.productModelName,
    coupon: "",
    alliliation: "",
    currency: productData?.price?.currency,
    discount: discountCalculator(
      productData?.price.basePrice,
      productData?.price.lkPrice
    ),
    index: index,
    item_brand: productData.productName,
    item_category: getCategoryType(productData?.classification), //getProductType(productData.sku),
    item_list_id: item_list_id,
    item_list_name: item_list_name,
    item_variant: productData.color || "",
    price: productData.price.lkPrice,
    quantity: 1,
  };
  ecommerce.items.push(product);
  triggerDataLayerOnPageView({
    ecommerce,
    event: "select_item",
    isPlano,
    clPowerSubmission: "",
    login_status: login ? "loggedin" : "guest",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  });

  //GA3
  const ecomm: any = {
    currencyCode: productData?.price?.currency || "",
    click: {
      actionField: { list: item_list_name },
      products: [],
    },
  };
  const obj1: categoryGA3Type = {
    name: productData.productModelName,
    id: productData.id,
    price: productData.price.lkPrice,
    brand: productData.productName,
    category: getCategoryType(productData?.classification), //getProductType(productData.sku || ""),
    variant: productData.color || "",
    list: item_list_name,
    position: index,
  };
  ecomm.click.products.push(obj1);

  const ga3: any = {
    event: "productClick",
    pageName: pageName || "product-listing-page",
    userType: login ? "loggedin" : "guest",
    ecommerce: ecomm,
    arch_type: "new-arch",
    dimension21: "new-arch",
    country_code: pageInfo?.country,
    currency_code: getCurrencyCode(pageInfo?.country),
  };

  pushDataLayer(ga3);
};
