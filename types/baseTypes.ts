import { DataType } from "./coreTypes";

export interface SEOType {
  title: string;
  keyword: string;
  description: string;
  canonical: string;
  alternate: string;
}

export enum PageTypes {
  CMS = "cms",
  PLP = "cat",
  PDP = "prod",
  NULL = "null",
  CART = "cart",
  COL = "col",
  SPECIAL_CATEGORY = "SPECIAL_CATEGORY",
}

export enum CheckoutTypes {
  ADDRESS = "address",
  SIGN_IN = "signin",
  SIGN_UP = "signup",
  SUCCESS = "success",
  FAILURE = "failure",
  PRESALE_LOGIN = "presales",
  RETRY = "retry",
  SUBMIT_PRESCRIPTION = "submitprescription",
}

export enum ExchangePageTypes {
  exchangeDetails = "exchange-details",
}

export interface ExchangePropTypes {
  userData: DataType;
  localeData: DataType;
  configData: DataType;
  headerData: DataType;
  orderId: string;
  itemId: string;
  sessionId: string;
  subPath: string;
}

export interface ErrorType {
  message: string;
  isError: boolean;
}

export enum Country {
  INDIA = "in",
  SG = "sg",
  AED = "aed",
  SA = "sa",
}

export enum DeviceTypes {
  MOBILE = "mobilesite",
  TAB = "tab",
  DESKTOP = "desktop",
}

export enum PlatFormTypes {
  IOS = "ios",
  ANDROID = "android",
  MWEB = "m-web",
  DESKTOP = "desktop",
}

export enum ComponentSizeENUM {
  small = "small",
  medium = "medium",
  large = "large",
  extraLarge = "extraLarge",
}

export enum TypographyENUM {
  sans = "var(--font-sans)",
  serif = "var(--font-serif)",
  lkSansBold = "var(--font-lksans-bold)",
  lkSansHairline = "var(--font-lksans-hairline)",
  lkSansMedium = "var(--font-lksans-medium)",
  lkSansRegular = "var(--font-lksans-regular)",
  defaultHeavy = "var(--font-default-heavy)",
  defaultMedium = "var(--font-default-medium)",
  defaultBook = "var(--font-default-book)",
  rajdhaniRegular = "var(--font-rajdhani-regular)",
  lkSerifNormal = "var(--font-lkserif-normal)",
  lkSerifBook = "var(--font-lkserif-book)",
}

export enum AlertColorsENUM {
  golden = "#F7F1DE",
  blue = "#E0FFFD",
  grey = "#EEEEF5",
  white = "#FFFFFF",
}

export enum ThemeENUM {
  primary = "primary",
  secondary = "secondary",
  msitePrimary = "msitePrimary",
  newSecondary = "newSecondary",
}
export enum kindENUM {
  background = "background",
  border = "border",
  tertiary = "tertiary",
}

export enum positionENUM {
  right = "right",
  left = "left",
  // top="top",
}
