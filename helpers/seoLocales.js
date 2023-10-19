export const langCodeAllowed = {
  in: {
    defaultLocale: "en_in",
    defaultLanguage: "en",
    countryCode: "in",
    maxMobileNumberLength: 10,
    minMobileNumberLength: 10,
    fbVerificationTag: { enabled: false, key: "" },
    regex: /[6-9][0-9]{9}/,
    isPinCodeHide: false,
    countryName: "India",
    storeHomeTrial: true,
    cookieDomain: "www.lenskart.com",
    newRedisRouting: true,
    domain: "https://www.lenskart.com",
    domainUrl:
      process.env.BUILD_ENV === "development"
        ? "preprod.lenskart.com"
        : "www.lenskart.com",
    hrefLang: "en-in",
    gaId: "UA-130468609-1",
    facebookPixel: "790230201013876",
    GvLkEnabled: true,
    phoneCode: "+91",
    gtmId_mob_prod: "GTM-KPNNZ53",
    gtmId_mob_dev: "GTM-W8RJVT7",
    gtmId_desktop_prod: "GTM-NJM6RCZ",
    gtmId_desktop_dev: "GTM-W8RJVT7",
    localeList: [
      {
        title: "English",
        code: "en_in",
      },
    ],
    trendingSearch_desktop: [
      { name: "Eyeglasses", url: "https://www.lenskart.com/eyeglasses.html" },
      { name: "Sunglasses", url: "https://www.lenskart.com/sunglasses.html" },
      {
        name: "Contact Lenses",
        url: "https://www.lenskart.com/contact-lenses.html",
      },
      {
        name: "Vincent Chase Eyeglasses",
        url: "https://www.lenskart.com/eyeglasses/marketing/vc-air-bestseller-eyeglasses.html",
      },
      {
        name: "Vincent Chase Sunglasses",
        url: "https://www.lenskart.com/sunglasses/special/vincent-chase-bestsellers.html",
      },
      {
        name: "John Jacobs Eyeglasses",
        url: "https://www.lenskart.com/eyeglasses/brands/john-jacobs-eyeglasses.html",
      },
      {
        name: "John Jacobs Sunglasses",
        url: "https://www.lenskart.com/sunglasses/brands/john-jacobs.html",
      },
      {
        name: "Mens Sunglasses",
        url: "https://www.lenskart.com/sunglasses/find-eyewear/mens-sunglasses.html",
      },
      {
        name: "Women Sunglasses",
        url: "https://www.lenskart.com/sunglasses/find-eyewear/womens-sunglasses.html",
      },
      {
        name: "Aviator",
        url: "https://www.lenskart.com/sunglasses/frame-shape/aviator-sunglasses.html",
      },
      {
        name: "Eyewear Accessories",
        url: "https://www.lenskart.com/eyewear-accessories.html",
      },
      {
        name: "Purevision",
        url: "https://www.lenskart.com/contact-lenses/most-popular-contact-lenses/purevision-contact-lenses.html",
      },
      {
        name: "Acuvue",
        url: "https://www.lenskart.com/contact-lenses/most-popular-contact-lenses/acuvue-contact-lenses.html",
      },
      { name: "Eye Checkup", url: "https://www.lenskart.com/HTO/" },
    ],
    trendingSearch_mobile: [
      { name: "Eyeglasses", url: "https://www.lenskart.com/eyeglasses.html" },
      { name: "Sunglasses", url: "https://www.lenskart.com/sunglasses.html" },
      {
        name: "Contact Lenses",
        url: "https://www.lenskart.com/contact-lenses.html",
      },
      {
        name: "Vincent Chase Eyeglasses",
        url: "https://www.lenskart.com/eyeglasses/marketing/vc-air-bestseller-eyeglasses.html",
      },
      {
        name: "Vincent Chase Sunglasses",
        url: "https://www.lenskart.com/sunglasses/special/vincent-chase-bestsellers.html",
      },
      {
        name: "John Jacobs Eyeglasses",
        url: "https://www.lenskart.com/eyeglasses/brands/john-jacobs-eyeglasses.html",
      },
      {
        name: "John Jacobs Sunglasses",
        url: "https://www.lenskart.com/sunglasses/brands/john-jacobs.html",
      },
      {
        name: "Mens Sunglasses",
        url: "https://www.lenskart.com/sunglasses/find-eyewear/mens-sunglasses.html",
      },
      {
        name: "Women Sunglasses",
        url: "https://www.lenskart.com/sunglasses/find-eyewear/womens-sunglasses.html",
      },
      {
        name: "Aviator",
        url: "https://www.lenskart.com/sunglasses/frame-shape/aviator-sunglasses.html",
      },
      {
        name: "Eyewear Accessories",
        url: "https://www.lenskart.com/eyewear-accessories.html",
      },
      {
        name: "Purevision",
        url: "https://www.lenskart.com/contact-lenses/most-popular-contact-lenses/purevision-contact-lenses.html",
      },
      {
        name: "Acuvue",
        url: "https://www.lenskart.com/contact-lenses/most-popular-contact-lenses/acuvue-contact-lenses.html",
      },
      { name: "Eye Checkup", url: "https://www.lenskart.com/HTO/" },
    ],
    allowedTrafficSourceCountries: [
      "AF",
      "AL",
      "DZ",
      "AS",
      "AD",
      "AO",
      "AI",
      "AQ",
      "AG",
      "AR",
      "AM",
      "AW",
      "AT",
      "AZ",
      "BS",
      "BD",
      "BB",
      "BY",
      "BE",
      "BZ",
      "BJ",
      "BM",
      "BT",
      "BO",
      "BQ",
      "BA",
      "BW",
      "BV",
      "BR",
      "IO",
      "BG",
      "BF",
      "BI",
      "CV",
      "CM",
      "CA",
      "KY",
      "CF",
      "TD",
      "CL",
      "CX",
      "CC",
      "CO",
      "KM",
      "CD",
      "CG",
      "CK",
      "CR",
      "HR",
      "CU",
      "CW",
      "CY",
      "CZ",
      "CI",
      "DK",
      "DJ",
      "DM",
      "DO",
      "EC",
      "SV",
      "GQ",
      "ER",
      "EE",
      "SZ",
      "ET",
      "FK",
      "FO",
      "FJ",
      "FI",
      "FR",
      "GF",
      "PF",
      "TF",
      "GA",
      "GM",
      "GE",
      "DE",
      "GH",
      "GI",
      "GR",
      "GL",
      "GD",
      "GP",
      "GU",
      "GT",
      "GG",
      "GN",
      "GW",
      "GY",
      "HT",
      "HM",
      "VA",
      "HN",
      "HU",
      "IS",
      "IN",
      "IE",
      "IM",
      "IL",
      "IT",
      "JM",
      "JE",
      "KZ",
      "KE",
      "KI",
      "KG",
      "LV",
      "LS",
      "LR",
      "LY",
      "LI",
      "LT",
      "LU",
      "MG",
      "MW",
      "MV",
      "ML",
      "MT",
      "MH",
      "MQ",
      "MR",
      "MU",
      "YT",
      "MX",
      "FM",
      "MD",
      "MC",
      "ME",
      "MS",
      "MA",
      "MZ",
      "NA",
      "NR",
      "NP",
      "NL",
      "NC",
      "NI",
      "NE",
      "NG",
      "NU",
      "NF",
      "MP",
      "NO",
      "PK",
      "PW",
      "PS",
      "PA",
      "PG",
      "PY",
      "PE",
      "PN",
      "PL",
      "PT",
      "PR",
      "MK",
      "RO",
      "RU",
      "RW",
      "RE",
      "BL",
      "SH",
      "KN",
      "LC",
      "MF",
      "PM",
      "VC",
      "WS",
      "SM",
      "ST",
      "SA",
      "SN",
      "RS",
      "SC",
      "SL",
      "SX",
      "SK",
      "SI",
      "SB",
      "SO",
      "ZA",
      "GS",
      "SS",
      "ES",
      "LK",
      "SD",
      "SR",
      "SJ",
      "SE",
      "CH",
      "TJ",
      "TZ",
      "TL",
      "TG",
      "TK",
      "TO",
      "TT",
      "TN",
      "TM",
      "TC",
      "TV",
      "UG",
      "UA",
      "GB",
      "UM",
      "US",
      "UY",
      "UZ",
      "VU",
      "VE",
      "VG",
      "VI",
      "WF",
      "EH",
      "ZM",
      "ZW",
      "AX",
    ],
    showSentry: false,
  },
  ae: {
    defaultLocale: "en_ae",
    defaultLanguage: "en",
    fbVerificationTag: { enabled: true, key: "9jb6va8jnp2a7gstkihyr2rlfjcaz1" },
    countryCode: "ae",
    storeHomeTrial: false,
    cookieDomain: ".lenskart.ae",
    gaId: "UA-136497493-3",
    facebookPixel: "592809931699777",
    newRedisRouting: false,
    domain: "https://www.lenskart.com/en-ae",
    domainUrl:
      process.env.BUILD_ENV === "development"
        ? "preprod.lenskart.ae"
        : "www.lenskart.ae",
    maxMobileNumberLength: 9,
    minMobileNumberLength: 9,
    regex: /^\d+$/,
    hrefLang: "en-ae",
    countryName: "United Arab Emirates",
    pathPrefix: "",
    isPinCodeHide: true,
    phoneCode: "+971",
    gtmId_mob_prod: "GTM-PHJ44X8",
    gtmId_mob_dev: "GTM-W8RJVT7",
    gtmId_desktop_prod: "GTM-5BX6D3H",
    gtmId_desktop_dev: "GTM-W8RJVT7",
    GvLkEnabled: true,
    localeList: [
      {
        title: "English",
        code: "en_AE",
      },
    ],
    trendingSearch_desktop: [
      {
        name: "Eyeglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/eyeglasses.html"
            : "https://www.lenskart.ae/eyeglasses.html",
      },
      {
        name: "Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses.html"
            : "https://www.lenskart.ae/sunglasses.html",
      },
      {
        name: "Mens Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/mens-sunglasses.html"
            : "https://www.lenskart.ae/sunglasses/find-eyewear/mens-sunglasses.html",
      },
      {
        name: "Women Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/womens-sunglasses.html"
            : "https://www.lenskart.ae/sunglasses/find-eyewear/womens-sunglasses.html",
      },
      {
        name: "Aviator",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/frame-shape/aviator-sunglasses.html"
            : "https://www.lenskart.ae/sunglasses/frame-shape/aviator-sunglasses.html",
      },
    ],
    trendingSearch_mobile: [
      { name: "Eyeglasses", url: "/eyeglasses.html" },
      { name: "Sunglasses", url: "/sunglasses.html" },
      {
        name: "Eyewear Accessories",
        url:
          process.env.BUILD_ENV === "development"
            ? "/eyewear-accessories.html"
            : "//www.lenskart.ae/eyewear-accessories.html",
      },
      {
        name: "Mens Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/mens-sunglasses.html"
            : "//www.lenskart.ae/sunglasses/find-eyewear/mens-sunglasses.html",
      },
      {
        name: "Women Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/womens-sunglasses.html"
            : "//www.lenskart.ae/sunglasses/find-eyewear/womens-sunglasses.html",
      },
      {
        name: "Aviator",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/frame-shape/aviator-sunglasses.html"
            : "///www.lenskart.ae/sunglasses/frame-shape/aviator-sunglasses.html",
      },
    ],
    allowedTrafficSourceCountries: [
      "AE",
      "QA",
      "KW",
      "BH",
      "OM",
      "EG",
      "TR",
      "JO",
      "LB",
      "YE",
      "IQ",
      "SY",
      "IR",
    ],
    showSentry: false,
  },
  sg: {
    defaultLocale: "en_sg",
    defaultLanguage: "en",
    fbVerificationTag: { enabled: true, key: "pfd8x7ajms35j8pe7h6nitj5b95nqw" },
    countryCode: "sg",
    storeHomeTrial: false,
    cookieDomain: ".lenskart.sg",
    gaId: "UA-131075285-1",
    facebookPixel: "297844910867676",
    tiktokPixel: "C3QE7P84C3SCJI4REVE0",
    newRedisRouting: false,
    domain: "https://www.lenskart.sg",
    domainUrl:
      process.env.BUILD_ENV === "development"
        ? "preprod.lenskart.sg"
        : "www.lenskart.sg",
    maxMobileNumberLength: 8,
    minMobileNumberLength: 8,
    regex: /^\d+$/,
    hrefLang: "en-sg",
    countryName: "Singapore",
    pathPrefix: "",
    isPinCodeHide: true,
    phoneCode: "+65",
    gtmId_mob_prod: "GTM-N8X85PM",
    gtmId_mob_dev: "GTM-W8RJVT7",
    gtmId_desktop_prod: "GTM-KNPJXWK",
    gtmId_desktop_dev: "GTM-W8RJVT7",
    GvLkEnabled: true,
    localeList: [
      {
        title: "English",
        code: "en_SG",
      },
    ],
    trendingSearch_desktop: [
      {
        name: "Eyeglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sg/eyeglasses.html"
            : "https://www.lenskart.sg/sg/eyeglasses.html",
      },
      {
        name: "Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sg/sunglasses.html"
            : "https://www.lenskart.sg/sg/sunglasses.html",
      },
      {
        name: "Best Seller",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sg/eyeglasses/collections/best-sellers.html"
            : "https://www.lenskart.sg/sg/eyeglasses/collections/best-sellers.html",
      },
      {
        name: "Browline",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sg/eyeglasses/shapes/clubmaster.html"
            : "https://www.lenskart.sg/sg/eyeglasses/shapes/clubmaster.html",
      },
    ],
    trendingSearch_mobile: [
      { name: "Eyeglasses", url: "/sg/eyeglasses.html" },
      { name: "Sunglasses", url: "/sg/sunglasses.html" },
      {
        name: "Best Seller",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sg/eyeglasses/collections/best-sellers.html"
            : "https://www.lenskart.sg/sg/eyeglasses/collections/best-sellers.html",
      },
      {
        name: "Browline",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sg/eyeglasses/shapes/clubmaster.html"
            : "https://www.lenskart.sg/sg/eyeglasses/shapes/clubmaster.html",
      },
    ],
    allowedTrafficSourceCountries: [
      "BN",
      "KH",
      "TL",
      "ID",
      "LA",
      "MY",
      "MM",
      "PH",
      "SG",
      "TH",
      "VN",
      "CN",
      "HK",
      "MO",
      "JP",
      "MN",
      "KR",
      "TW",
      "AU",
      "NZ",
      "KP",
    ],
    showSentry: false,
  },
  sa: {
    defaultLocale: "en_sa",
    defaultLanguage: "en",
    fbVerificationTag: { enabled: true, key: "903kf3m83v88kwqatqoj4723m1dmeg" },
    countryCode: "sa",
    storeHomeTrial: false,
    cookieDomain: "sa.lenskart.com",
    gaId: "UA-152862508-14", // temporary test account gaId(only for ga360)
    facebookPixel: "756183872056470",
    newRedisRouting: false,
    domain: "https://www.lenskart.com/en-sa",
    domainUrl:
      process.env.BUILD_ENV === "development"
        ? "preprod-sa.lenskart.sa"
        : "sa.lenskart.com",
    maxMobileNumberLength: 9,
    minMobileNumberLength: 9,
    regex: /^\d+$/,
    hrefLang: "en-sa",
    countryName: "Saudi Arabia",
    pathPrefix: "",
    isPinCodeHide: true,
    phoneCode: "+966",
    gtmId_mob_prod: "GTM-KW2RJWQ",
    gtmId_mob_dev: "GTM-W8RJVT7",
    gtmId_desktop_prod: "GTM-MT9C445",
    gtmId_desktop_dev: "GTM-W8RJVT7",
    GvLkEnabled: true,
    localeList: [
      {
        title: "English",
        code: "en_SA",
      },
    ],
    trendingSearch_desktop: [
      {
        name: "Eyeglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/eyeglasses.html"
            : "https://sa.lenskart.com/eyeglasses.html",
      },
      {
        name: "Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses.html"
            : "https://sa.lenskart.com/sunglasses.html",
      },
      {
        name: "Mens Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/mens-sunglasses.html"
            : "https://sa.lenskart.com/sunglasses/find-eyewear/mens-sunglasses.html",
      },
      {
        name: "Women Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/womens-sunglasses.html"
            : "https://sa.lenskart.com/sunglasses/find-eyewear/womens-sunglasses.html",
      },
      {
        name: "Aviator",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/frame-shape/aviator-sunglasses.html"
            : "https://sa.lenskart.com/sunglasses/frame-shape/aviator-sunglasses.html",
      },
    ],
    trendingSearch_mobile: [
      { name: "Eyeglasses", url: "/eyeglasses.html" },
      { name: "Sunglasses", url: "/sunglasses.html" },
      {
        name: "Eyewear Accessories",
        url:
          process.env.BUILD_ENV === "development"
            ? "/eyewear-accessories.html"
            : "//sa.lenskart.com/eyewear-accessories.html",
      },
      {
        name: "Mens Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/mens-sunglasses.html"
            : "//sa.lenskart.com/sunglasses/find-eyewear/mens-sunglasses.html",
      },
      {
        name: "Women Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/womens-sunglasses.html"
            : "//sa.lenskart.com/sunglasses/find-eyewear/womens-sunglasses.html",
      },
      {
        name: "Aviator",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/frame-shape/aviator-sunglasses.html"
            : "///sa.lenskart.com/sunglasses/frame-shape/aviator-sunglasses.html",
      },
    ],
    allowedTrafficSourceCountries: [],
    showSentry: false,
  },
  us: {
    defaultLocale: "en_us",
    defaultLanguage: "en",
    fbVerificationTag: { enabled: true, key: "9jb6va8jnp2a7gstkihyr2rlfjcaz1" }, // pending
    countryCode: "us",
    storeHomeTrial: false, // pending
    cookieDomain: ".lenskart.us",
    gaId: "UA-136497493-1",
    facebookPixel: "674180879654129",
    newRedisRouting: false,
    domain: "https://www.lenskart.com/en-us",
    domainUrl:
      process.env.BUILD_ENV === "development"
        ? "preprod.lenskart.us"
        : "live.lenskart.us",
    maxMobileNumberLength: 10, // pending
    minMobileNumberLength: 10, // pending
    regex: /^\d+$/,
    hrefLang: "en-us",
    countryName: "United States of America",
    pathPrefix: "",
    isPinCodeHide: false,
    phoneCode: "+1",
    gtmId_mob_prod: "GTM-NKC5VLK",
    gtmId_mob_dev: "GTM-W8RJVT7",
    gtmId_desktop_prod: "GTM-NS6GRN6",
    gtmId_desktop_dev: "GTM-W8RJVT7",
    GvLkEnabled: true,
    localeList: [
      {
        title: "English",
        code: "en_US",
      },
    ],
    trendingSearch_desktop: [
      {
        name: "Eyeglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/eyeglasses.html"
            : "https://live.lenskart.us/eyeglasses.html",
      },
      {
        name: "Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses.html"
            : "https://www.lenskart.us/sunglasses.html",
      },
      {
        name: "Mens Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/mens-sunglasses.html"
            : "https://www.lenskart.us/sunglasses/find-eyewear/mens-sunglasses.html",
      },
      {
        name: "Women Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/womens-sunglasses.html"
            : "https://www.lenskart.us/sunglasses/find-eyewear/womens-sunglasses.html",
      },
      {
        name: "Aviator",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/frame-shape/aviator-sunglasses.html"
            : "https://www.lenskart.us/sunglasses/frame-shape/aviator-sunglasses.html",
      },
    ],
    trendingSearch_mobile: [
      { name: "Eyeglasses", url: "/eyeglasses.html" },
      { name: "Sunglasses", url: "/sunglasses.html" },
      {
        name: "Eyewear Accessories",
        url:
          process.env.BUILD_ENV === "development"
            ? "/eyewear-accessories.html"
            : "//www.lenskart.us/eyewear-accessories.html",
      },
      {
        name: "Mens Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/mens-sunglasses.html"
            : "//www.lenskart.us/sunglasses/find-eyewear/mens-sunglasses.html",
      },
      {
        name: "Women Sunglasses",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/find-eyewear/womens-sunglasses.html"
            : "//www.lenskart.us/sunglasses/find-eyewear/womens-sunglasses.html",
      },
      {
        name: "Aviator",
        url:
          process.env.BUILD_ENV === "development"
            ? "/sunglasses/frame-shape/aviator-sunglasses.html"
            : "///www.lenskart.us/sunglasses/frame-shape/aviator-sunglasses.html",
      },
    ],
    allowedTrafficSourceCountries: [],
  },
};
