import {
  deleteCookie,
  getCookie,
  hasCookie,
  setCookie,
} from "@/helpers/defaultHeaders";

export interface ConfigDataType {
  [name: string]: any;
}

export interface ConfigErrorDataType {
  isError: boolean;
  message: string;
}

export interface LocaleDataType {
  [name: string]: string;
}

export interface LocaleErrorDataType {
  isError: boolean;
  message: string;
}

export interface DataType {
  [name: string]: any;
}

export interface Exchange {
  isExchangeFlow: boolean;
  returnOrderId: number;
  returnItemId: number;
}

export interface ConfigType {
  configData: ConfigDataType;
}

export interface ConfigErrorType {
  configError: ConfigErrorDataType;
}

export interface LocalType {
  localeData: LocaleDataType;
}

export interface LocalErrorType {
  localeError: LocaleErrorDataType;
}

export interface ExchangeType {
  exchangeFlow: Exchange;
}

export enum TypographyENUM {
  sans = "var(--font-sans)",
  serif = "var(--font-serif)",
  lkSansBold = "var(--font-lksans-bold)",
  lkSansHairline = "var(--font-lksans-hairline)",
  lkSansRegular = "var(--font-lksans-regular)",
  lkSansMedium = "var(--font-secondary-medium)",
  defaultHeavy = "var(--font-default-heavy)",
  defaultMedium = "var(--font-default-medium)",
  defaultBook = "var(--font-default-book)",
  rajdhaniRegular = "var(--font-rajdhani-regular)",
}

export interface FontType {
  font: TypographyENUM;
}

declare global {
  export interface Window {
    dittoTimeout: any;
    tryOn: any;
    grecaptcha: any;
    __LK__: {
      getCookie: typeof getCookie;
      setCookie: typeof setCookie;
      hasCookie: typeof hasCookie;
      deleteCookie: typeof deleteCookie;
    };
  }
}
