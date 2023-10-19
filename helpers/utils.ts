import { DataType } from "@/types/coreTypes";
import { bannerGA4 } from "./gaFour";

/**
 *
 * @param alternateInfo
 * <link data-react-helmet="true" rel="alternate" href="https://preprod.lenskart.com/vincent-chase-vc-e14327-c3-eyeglasses.html" hreflang="x-default" /><link data-react-helmet="true" rel="alternate" hrefLang="en-ae" href="https://preprod.lenskart.com/en-ae/vincent-chase-vc-e14327-c3-eyeglasses.html" />
 */
export const generateSEOLink = (alternateInfo: DataType) => {
  const keys = Object.keys(alternateInfo);
  keys.map((item: string, index: number) => {
    let url = alternateInfo[item];
    const str = `<link rel="alternate" href=${url} hreflang=${item.toLowerCase()}/>`;
  });
};

export const getCurrency = (code: string) => {
  if (code === "in") {
    return "₹";
  } else if (code === "sg") {
    return "$";
  } else if (code === "sa") {
    return "SAR";
  } else if (code === "ae") {
    return "AED";
  } else if (code === "us") {
    return "$";
  }
  return "";
};

export const getCurrencyCode = (code: string) => {
  if (code === "in") {
    return "INR";
  } else if (code === "sg") {
    return "SGD";
  } else if (code === "sa") {
    return "SAR";
  } else if (code === "ae") {
    return "AED";
  } else if (code === "us") {
    return "USD";
  }
  return "";
};

export const getProductCategories = (
  product: any,
  ga4Product: any,
  orderSuccess?: boolean
) => {
  //orderSuccess param is for purchase success as the key in product object are different
  if (
    orderSuccess &&
    product?.itemLensType?.toLowerCase() !== "services" &&
    product?.itemLensType !== "CONTACT_LENS"
  ) {
    ga4Product.item_category2 = product.lensType;
    if (product?.prescriptionView?.powerType) {
      ga4Product.item_category3 = product?.options[0]?.name;
      ga4Product.item_category4 = product?.options?.filter(
        (option: any) => option.type === "COATING"
      )?.length
        ? "yes"
        : "no";
    } else {
      ga4Product.item_category3 = "";
      ga4Product.item_category4 = "";
    }
  } else if (
    product?.itemLensType?.toLowerCase() === "services" ||
    product?.itemLensType === "CONTACT_LENS" ||
    !product?.itemLensType
  ) {
    ga4Product.item_category2 = "";
    ga4Product.item_category3 = "";
    ga4Product.item_category4 = "";
  } else {
    ga4Product.item_category2 = product.itemLensType;
    if (product?.itemPrescriptionView?.powerType) {
      ga4Product.item_category3 = product?.itemOptions[0]?.name;
      ga4Product.item_category4 = product?.itemOptions?.filter(
        (option: any) => option.type === "COATING"
      )?.length
        ? "yes"
        : "no";
    } else {
      ga4Product.item_category3 = "";
      ga4Product.item_category4 = "";
    }
  }
};

export const getProductCategoriesGA3 = (
  product: any,
  ga3Product: any,
  orderSuccess?: boolean
) => {
  //orderSuccess param is for purchase success as the key in product object are different
  if (
    orderSuccess &&
    product?.itemLensType?.toLowerCase() !== "services" &&
    product?.itemLensType !== "CONTACT_LENS"
  ) {
    ga3Product.coating_applied = product.lensType;
    if (product?.prescriptionView?.powerType) {
      ga3Product.vision_type = product?.options[0]?.name;
      ga3Product.selected_package = product?.options?.filter(
        (option: any) => option.type === "COATING"
      )?.length
        ? "yes"
        : "no";
    } else {
      ga3Product.vision_type = "";
      ga3Product.selected_package = "";
    }
  } else if (
    product?.itemLensType?.toLowerCase() === "services" ||
    product?.itemLensType === "CONTACT_LENS" ||
    !product?.itemLensType
  ) {
    ga3Product.coating_applied = "";
    ga3Product.vision_type = "";
    ga3Product.selected_package = "";
  } else {
    ga3Product.coating_applied = product.itemLensType;
    if (product?.itemPrescriptionView?.powerType) {
      ga3Product.vision_type = product?.itemOptions[0]?.name;
      ga3Product.selected_package = product?.itemOptions?.filter(
        (option: any) => option.type === "COATING"
      )?.length
        ? "yes"
        : "no";
    } else {
      ga3Product.vision_type = "";
      ga3Product.selected_package = "";
    }
  }
};

export const getMembershipDiscount = (cartData: any) => {
  const goldDiscount =
    cartData?.cartTotal &&
    Array.isArray(cartData?.cartTotal) &&
    cartData?.cartTotal?.filter(
      (cartValue: any) => cartValue?.id === "goldDiscount"
    );
  if (goldDiscount?.length) {
    return goldDiscount[0]?.value;
  }
  return 0;
};

export const getTopPids = (categoryData: any, productList: any) => {
  // console.log(categoryData);
  let count: number = 1;
  const topPids: any =
    productList &&
    productList.map((item: any) => {
      let prodType = "";
      if (item.productURL.indexOf("eyeglass") > -1) prodType = "Eyeglasses";
      else if (item.productURL.indexOf("sunglass") > -1)
        prodType = "Sunglasses";
      else if (item.productURL.indexOf("contact") > -1)
        prodType = "Contact Lens";
      else prodType = "Others";
      return {
        name: item.productModelName,
        id: item.id,
        price: item.price.lkPrice,
        brand: item.productName,
        category: prodType,
        variant: "",
        list: "",
        //dimension21: categoryData.categoryId,
        position: count++,
      };
    });
  return topPids;
};

export const pushDataLayer = (
  data: any,
  retryCount = 0,
  maximumRetires = 3
) => {
  if (typeof window.dataLayer === "undefined" && retryCount < maximumRetires)
    setTimeout(() => {
      pushDataLayer(data, ++retryCount, maximumRetires);
    }, 2000);
  else if (typeof window.dataLayer !== "undefined" && window.dataLayer) {
    window.dataLayer.push(data);
  } else console.log("dataLayer is not defined.");
};

export const discountCalculator = (basePrice: number, lkPrice: number) => {
  return basePrice - lkPrice;
};

export const getProductType = (sku: string) => {
  if (sku && typeof sku === "string") {
    let prodType: string = "";
    if (sku && sku.indexOf("eye:") > -1) prodType = "eyeglass";
    else if (sku && sku.indexOf("sun:") > -1) prodType = "sunglass";
    else if (sku && sku.indexOf("contact:") > -1) prodType = "contact lens";
    else if (sku && sku.indexOf("watch:") > -1) prodType = "accessories";
    else if (sku && sku.indexOf("service:") > -1) prodType = "membership";
    else prodType = "";
    return prodType;
  }
  return "";
};

export const getCategoryType = (category: string) => {
  switch (category) {
    case "eyeframe":
      return "eyeglass";
    case "sunglasses":
      return "sunglass";
    case "loyalty services":
    case "loyalty_services":
      return "membership";
    case "accessories_revenue":
      return "accessories";
    case "contact_lens_solution":
      return "contact lens solution";
    case "contact_lens":
      return "contact lens";
    default:
      return "";
  }
};

export const removeDomainName = (
  url: string,
  alsoRemove = "",
  country = "",
  subdirectoryPath = ""
) => {
  if (!url) return "";
  let domain = url
    .replace("https://www.lenskart.com/en-us", "")
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.lenskart.com", "")
    .replace("sa.lenskart.com", "")
    .replace("www.lenskart.ae", "")
    .replace("preprod.lenskart.ae", "")
    .replace("preprod.lenskart.sg", "")
    .replace("staging.lenskart.sg", "")
    .replace("www.lenskart.sg", "");

  if (alsoRemove) domain = domain.replace(alsoRemove, "");
  if (subdirectoryPath) {
    domain = domain
      .replace(`www.lenskart.com${subdirectoryPath}`, "")
      .replace(`preprod.lenskart.com${subdirectoryPath}`, "")
      .replace(`${subdirectoryPath}`, "");
  }
  if (country) {
    domain = domain
      .replace("frontend-preprod.lenskart.com", "")
      .replace(`www.lenskart.${country}`, "")
      .replace(`frontend-preprod-${country}.lenskart.com`, "")
      .replace(`frontend-preprod-${country}.lenskart.${country}`, "")
      .replace(`frontend-preprod-${country}`, "")
      .replace(`frontend-preprod.lenskart.${country}`, "")
      .replace(`preprod.lenskart.${country}`, "")
      .replace(`preprod-${country}.lenskart.com`, "")
      .replace(`${country}.lenskart.com`, "");
  }

  return domain;
};

export function debounce(
  func: (...funcArgs: any) => any,
  wait: number,
  immediate?: boolean
) {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function (this: Function, ...args: any) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    window.clearTimeout(timeout as ReturnType<typeof setTimeout>);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const hasContactLensItems = (cartItems: any) => {
  return cartItems.some(
    (cartItem: any) => cartItem?.itemClassification === "contact_lens"
  );
};

export const isValidMobile = (mobileNumber: string, countryCode: string) => {
  if (countryCode?.toLowerCase() === "sg")
    if (mobileNumber.length === 8) return true;
    else return false;
};

export const discountCalculatorV2 = (prices: any) => {
  if (prices.length === 0 || prices.length === 1) {
    return 0;
  }
  let marketPrice = prices.filter(
    (price: any) => price.name === "Market Price"
  )[0];
  marketPrice = marketPrice.price || marketPrice.value;
  let lenskartPrice = prices.filter(
    (price: any) => price.name === "Lenskart Price"
  )[0];
  lenskartPrice = lenskartPrice.price || lenskartPrice.value;
  return marketPrice - lenskartPrice;
};

export const replaceCountryCode = (url: string, country = "") => {
  if (country === "in" && url.includes(".com")) {
    return url;
  } else if (country === "sg") {
    return url.replace(".com", ".sg");
  } else if (country === "sa") {
    return url.replace(".com", ".com/en-sa");
  } else if (country === "ae") {
    return url.replace(".com", ".com/en-ae");
  } else if (country === "us") {
    return url.replace(".com", ".com/en-us");
  }
  return url;
};
export const gaBannerImgObserver = (
  rootMargin: string,
  window: any,
  userInfo: any,
  pageInfo: any,
  selector?: string,
  creativeName?: string,
  promotionId?: string,
  promotionName?: string,
  itemListId?: string,
  itemListName?: string
) => {
  if (window?.IntersectionObserver) {
    const gaBannerImgObserverfn = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          let flag = true;
          if (
            entry.isIntersecting &&
            flag &&
            creativeName &&
            promotionId &&
            promotionName
          ) {
            bannerGA4(
              "view_promotion",
              creativeName || "",
              userInfo,
              promotionId || "",
              promotionName || "",
              itemListId || "",
              itemListName || "",
              pageInfo
            );
            flag = false;
          } else if (entry.isIntersecting && flag) {
            // console.log("entry.target", entry.target);

            let dropdown = null;
            dropdown = entry.target.querySelectorAll(".dropdown");
            // console.log("dropdown", dropdown);

            if (dropdown.length !== 0) {
              // console.log("inside dropdown", dropdown);
              dropdown.forEach((item) => {
                const anchorTag = item.querySelector("a.top-level");
                const gaPromotionObj = {
                  creativeName: anchorTag?.getAttribute("data-creative-name"),
                  promotionId: anchorTag?.getAttribute("data-promotion-id"),
                  promotionName: anchorTag?.getAttribute("data-promotion-name"),
                  itemlistId: anchorTag?.getAttribute("data-itemlist-id"),
                  itemlistName: anchorTag?.getAttribute("data-itemlist-name"),
                };
                bannerGA4(
                  "view_promotion",
                  gaPromotionObj?.creativeName || "",
                  userInfo,
                  gaPromotionObj?.promotionId || "",
                  gaPromotionObj?.promotionName || "",
                  gaPromotionObj?.itemlistId || "",
                  gaPromotionObj?.itemlistName || "",
                  pageInfo
                );
                // console.log("anchorTag dropdown", anchorTag);
              });
            } else {
              // console.log("inside else", entry.target);
              const anchorTagList = entry.target.querySelectorAll("a");
              // console.log("anchorTagList", anchorTagList);

              anchorTagList.forEach((anchorTag) => {
                const gaPromotionObj = {
                  creativeName: anchorTag?.getAttribute("data-creative-name"),
                  promotionId: anchorTag?.getAttribute("data-promotion-id"),
                  promotionName: anchorTag?.getAttribute("data-promotion-name"),
                  itemlistId: anchorTag?.getAttribute("data-itemlist-id"),
                  itemlistName: anchorTag?.getAttribute("data-itemlist-name"),
                };
                bannerGA4(
                  "view_promotion",
                  gaPromotionObj?.creativeName || "",
                  userInfo,
                  gaPromotionObj?.promotionId || "",
                  gaPromotionObj?.promotionName || "",
                  gaPromotionObj?.itemlistId || "",
                  gaPromotionObj?.itemlistName || "",
                  pageInfo
                );
                // console.log("anchorTag", anchorTag);
              });
            }
            flag = false;
          } else {
            flag = true;
          }
        });
      },
      {
        rootMargin: rootMargin || "0px",
        // threshold: 1.0,
      }
    );
    document
      .querySelectorAll(selector || ".ga-banner-img-obeserver")
      .forEach(function (lazyImage) {
        // console.log("lazyImage", lazyImage);

        gaBannerImgObserverfn.observe(lazyImage);
      });
  } else {
    // Possibly fall back to event handlers here
    console.log("Error: IntersectionObserver not present in Window.");
  }
};

export const carouselObserver = (userInfo: any, pageInfo: any) => {
  if (window?.IntersectionObserver) {
    const gaBannerImgObserverfn = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          let flag = true;
          if (entry.isIntersecting && flag) {
            const gaPromotionObj = {
              creativeName: entry.target?.getAttribute("data-creative-name"),
              promotionId: entry.target?.getAttribute("data-promotion-id"),
              promotionName: entry.target?.getAttribute("data-promotion-name"),
              itemlistId: entry.target?.getAttribute("data-itemlist-id"),
              itemlistName: entry.target?.getAttribute("data-itemlist-name"),
            };
            bannerGA4(
              "view_promotion",
              gaPromotionObj?.creativeName || "",
              userInfo,
              gaPromotionObj?.promotionId || "",
              gaPromotionObj?.promotionName || "",
              gaPromotionObj?.itemlistId || "",
              gaPromotionObj?.itemlistName || "",
              pageInfo
            );
            flag = false;
          } else {
            flag = true;
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 1.0,
      }
    );
    document
      .querySelectorAll(".home-page-slider a")
      .forEach(function (sliderImage) {
        // console.log("sliderImage", sliderImage);
        gaBannerImgObserverfn.observe(sliderImage);
      });
  }
};

export const switchBackgroundScroll = (disable: boolean) => {
  if (typeof window !== "undefined") {
    document.body.style.overflow = disable ? "hidden" : "auto";
  }
};
