import { Country, PageTypes, PlatFormTypes } from "../baseTypes";

export interface PageInfoType {
  id: number | null | string;
  pageSize: number | null;
  pageNumber: number | null;
  deviceType: string;
  platform: PlatFormTypes;
  country: string;
  pageType: PageTypes;
  countryCode: string;
  languageDirection: languageDirectionType;
  isRTL: boolean;
  subdirectoryPath: string;
  language: string;
  pageLoaded: boolean;
}

export enum languageDirectionType {
  LTR = "ltr",
  RTL = "rtl",
}
