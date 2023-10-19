import { PriceType } from "@/types/priceTypes";
import { CookieValueTypes, getCookie } from "@/helpers/defaultHeaders";

export const isEmptyObject = (obj: { constructor?: any }) => {
  return (
    typeof obj === "object" &&
    Object.keys(obj).length === 0 &&
    obj.constructor === Object
  );
};

export function convertHttps(value: string) {
  return value && value.replace("http:", "https:");
}

export const updateImageResolution = (
  url: string,
  resolution: string | null = null
) => {
  if (url) {
    const urlArray = url.split("/");
    const indexOfThumbnail = urlArray?.indexOf("thumbnail");
    if (urlArray[indexOfThumbnail - 1] === "1" && resolution) {
      urlArray[indexOfThumbnail + 1] = resolution;
      const newUrlString = urlArray.join("/");
      return convertHttps(newUrlString);
    }
    return convertHttps(url);
  }
  return "";
};

export function modifyProductData(data: {
  specifications: any;
  type: any;
  classification: any;
  price: PriceType;
  prescriptionType: any;
  fullName: any;
  frameDetails: any;
  imageUrlsDetail?: never[] | undefined;
  review?: {} | undefined;
}) {
  let dtmPType,
    generalSpecification,
    newFrameInfoObj = [],
    technicalSpecification,
    frameType,
    frameShape,
    clType,
    frameColor,
    frameSize,
    gender,
    marketPrice,
    lenskartPrice,
    firstFrameFree,
    firstFrameFreeDLPrice,
    powerOption,
    productLensTypeDesc,
    size,
    measure,
    productDetailsImages,
    suitedFor;
  const {
    specifications,
    type,
    classification,
    price,
    prescriptionType,
    fullName,
    frameDetails,
    imageUrlsDetail = [],
    review = {},
  } = data;
  let { reviews = [], imageReviews = [] } = review;
  // Fixing URIMalformed issue
  if (reviews.length) {
    reviews.map((rev: { [x: string]: string | number | boolean }) => {
      if (rev)
        Object.keys(rev).map((key) => {
          rev[key] = encodeURIComponent(rev[key]);
          return true;
        });
      return true;
    });
  }
  if (imageReviews.length) {
    imageReviews.map((rev: { [x: string]: string | number | boolean }) => {
      if (rev)
        Object.keys(rev).map((key) => {
          rev[key] = encodeURIComponent(rev[key]);
          return true;
        });
      return true;
    });
  }

  // Set Specifications
  specifications.filter((obj: { name: string; items: any }) => {
    if (obj.name === "general") {
      generalSpecification = Object.assign([], obj.items);
    }
    if (obj.name === "technical") {
      technicalSpecification = Object.assign([], obj.items);
    }
    return true;
  });
  technicalSpecification?.forEach(
    (obj: { name: string; name_en: string; value: any }) => {
      if (obj.name_en === "Frame Type" || obj.name === "Frame Type") {
        /* Frame Type for buy Options API */
        frameType = obj.value;
      }
      if (obj.name_en === "Frame Shape" || obj.name === "Frame Shape") {
        frameShape = obj.value ? obj.value : "";
      }
      if (obj.name_en === "Type" || obj.name === "Type") {
        clType = classification === "contact_lens" ? obj.value : null;
      }
    }
  );
  for (let i = 0; i < generalSpecification.length; i += 1) {
    const obj = generalSpecification[i];
    if (obj.name_en === "Frame colour" || obj.name === "Frame colour") {
      frameColor = obj.value;
    }
    if (obj.name_en === "Frame Size" || obj.name === "Frame Size") {
      frameSize = obj.value;
    }
    if (obj.name_en === "Suited For" || obj.name === "Suited For") {
      suitedFor = obj.value;
    }
    if (obj.name_en === "Gender" || obj.name === "Gender") {
      gender = obj.value;
    }
    if (
      obj.name_en === "Model No." ||
      obj.name_en === "Frame Material" ||
      obj.name_en === "Collection" ||
      obj.name_en === "Temple Material" ||
      obj.name_en === "Weight" ||
      obj.name === "Model No." ||
      obj.name === "Frame Material" ||
      obj.name === "Collection" ||
      obj.name === "Temple Material" ||
      obj.name === "Weight"
    ) {
      newFrameInfoObj.push(obj);
      generalSpecification.splice(i, 1);
      i -= 1;
    }
  }
  generalSpecification = [...newFrameInfoObj, ...generalSpecification];

  const { firstFrameFreePrice, basePrice, lkPrice } = price;
  if (firstFrameFreePrice) {
    firstFrameFree = true;
    firstFrameFreeDLPrice = 1000;
  }
  marketPrice = basePrice;
  lenskartPrice = lkPrice;
  /* Power Option And productLensTypeDesc */
  if (classification === "eyeframe") {
    if (prescriptionType.length) {
      powerOption = prescriptionType[0].title + "";
    }
    if (fullName?.indexOf("Computer") > -1) {
      if (prescriptionType.length) {
        powerOption = "Zero Power";
      }
    } else if (
      fullName?.indexOf("Swimming Goggles") > -1 ||
      fullName?.indexOf("Reading") > -1
    ) {
      powerOption = "Frame Only";
    }
    productLensTypeDesc = {
      "Single Vision": {
        desc: "For distance or near vision <br/>(Thin, anti-glare, blue-cut options)",
        image: true,
      },
      "Bifocal/Progressive": {
        desc: "Bifocal and Progressives <br/>(For two powers in same lens)",
        image: true,
      },
      "Zero Power": {
        desc: "For computer smartphones & fashion <br/>(Anti-glare and blue-cut options)",
        image: true,
      },
      "Frame Only": {
        desc: "Buy only the frame without any lenses",
        icon: "icon-without_power",
      },
      "Tinted Single Vision": {
        desc: "(Photochromatic, Grey, Brown, Dark Green Color Options)<br/>Available in Single Vision Only",
        image: true,
      },
    };
  } else if (classification === "sunglasses") {
    powerOption = "Without Power";
    if (prescriptionType.length > 1) {
      powerOption = "With Power";
    }
    productLensTypeDesc = {
      "With Power": {
        desc: "Buy powered sunglasses with either distance (far) or reading (near) vision",
        icon: "icon-power_sunglasses",
      },
      "Without Power": {
        desc: "Buy a non-power sunglasses",
        icon: "icon-without_power",
      },
    };
  }
  /* Frame Size Details */
  frameDetails?.forEach((obj: { name: string; value: any }) => {
    if (obj.name === "Size") {
      size = obj.value;
    }
    if (obj.name === "MEASURE") {
      measure = obj.value;
    }
  });
  productDetailsImages = imageUrlsDetail
    .filter((img) => img?.label?.indexOf("Image_About_Product") > -1)
    .sort((a, b) => {
      if (a?.label > b?.label) return 1;
      if (a?.label < b?.label) return -1;
      return 0;
    });

  return {
    dtmPType,
    generalSpecification,
    newFrameInfoObj,
    technicalSpecification,
    frameType,
    frameShape,
    clType,
    frameColor,
    frameSize,
    suitedFor,
    gender,
    marketPrice,
    lenskartPrice,
    firstFrameFree,
    firstFrameFreePrice,
    firstFrameFreeDLPrice,
    powerOption,
    productLensTypeDesc,
    size,
    measure,
    productDetailsImages,
  };
}

export function calcPriceWithGST(price: number, gstPercentage: number) {
  const gst = (price * gstPercentage) / 100;
  return price + gst;
}

export function getGSTPrice(
  classification: string | number,
  brandName: any,
  frameType: string,
  lenskartPrice: any,
  PRODUCTS_GST: { [x: string]: number }
) {
  let gsttotal;
  let finalprice = lenskartPrice;
  const ftype = frameType ? frameType.toLowerCase() : "_";
  if (PRODUCTS_GST) {
    gsttotal =
      PRODUCTS_GST[`non_fff_${classification}_${brandName}_${ftype}`] ||
      PRODUCTS_GST[`${classification}_${brandName}_${ftype}`] ||
      PRODUCTS_GST[`${classification}_${brandName}`];
    // set default GST based on Product Type
    if (gsttotal == null && PRODUCTS_GST[classification]) {
      gsttotal = PRODUCTS_GST[classification] || 0;
    }
    const finalpriceBeforeRoundoff = calcPriceWithGST(
      lenskartPrice,
      Number(gsttotal || 0)
    );
    finalprice =
      Math.round((finalpriceBeforeRoundoff + Number.EPSILON) * 100) / 100;
  }
  return finalprice;
}

export const getAppUrl = (adSet: string, afUrl: any) => {
  if (typeof window !== "undefined") {
    const location = window && window?.location;
    let utmS: CookieValueTypes = getCookie("utm_source");
    utmS = utmS && utmS !== "null" ? utmS : "";
    let utmCH = getCookie("utm_campaign") || "";
    utmCH = utmCH && utmCH !== "null" ? utmCH : "";
    let utmM = getCookie("utm_medium") || "";
    utmM = utmM && utmM !== "null" ? utmM : "";
    let utmC = getCookie("utm_content") || "";
    utmC = utmC && utmC !== "null" ? utmC : "";
    let partnerId = utmS;
    if (partnerId?.toLowerCase() === "facebook") {
      partnerId = "FB";
    } else if (partnerId?.toLowerCase() === "google") {
      partnerId = "GAds";
    }
    const pid = partnerId || "msite";
    let pageUrl = location.href;
    pageUrl = pageUrl
      .replace(".sg", ".com")
      .replace(".ae", ".com")
      .replace("sa.", "")
      .replace("live.", "")
      .replace("preprod.", "");
    const index = pageUrl?.indexOf("lenskart.");
    const wwwIndex = pageUrl?.indexOf("www");

    if (wwwIndex === -1 && index !== -1)
      pageUrl = pageUrl.slice(0, index) + "www." + pageUrl.slice(index);

    const url =
      "https://lenskart.onelink.me/747387224?pid=" +
      pid +
      "&af_dp=" +
      (afUrl || pageUrl) +
      "&af_web_dp=" +
      (afUrl || pageUrl) +
      "&utm_source=" +
      utmS +
      "&utm_medium=" +
      utmM +
      "&utm_campaign=" +
      utmCH +
      "&utm_content=" +
      utmC +
      "&af_siteid=" +
      utmC +
      "&af_adset=" +
      adSet +
      "&is_retargeting=true&c=" +
      utmCH +
      "&af_channel=" +
      utmM +
      "&deep_link_value=" +
      (afUrl || pageUrl);
    return url;
  }
};

export const getBuyOnAppUrl = (id) => {
  const url = `https://preview.app.goo.gl/ej3gt.app.goo.gl?link=https://www.lenskart.com/product/${id}&apn=com.lenskart.app&isi=970343205&ibi=com.valyoo.lenskart&utm_campaign=msite_buyonapppdp&utm_medium=buyonapppdp&utm_source=msite`;
  return url;
};

export const SubDomain = (url: string | undefined) => {
  let urlArray;
  if (url) {
    urlArray = url.split("/");
    urlArray = urlArray.slice(3);
  }
  return `/${urlArray?.join("/")}` || "";
};
