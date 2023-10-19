import {
  Country,
  DeviceTypes,
  PageTypes,
  PlatFormTypes,
} from "@/types/baseTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  languageDirectionType,
  PageInfoType,
} from "./../../types/state/pageInfoType";

console.log(
  "process.env.NEXT_PUBLIC_APP_ENV ===>",
  process.env.NEXT_PUBLIC_APP_ENV
);
const initialState: PageInfoType = {
  id: null,
  pageNumber: 1,
  pageSize: 15,
  deviceType: process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase(),
  platform: PlatFormTypes.DESKTOP,
  country: process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase() || Country.INDIA,
  pageType: PageTypes.NULL,
  language: process.env.NEXT_PUBLIC_APP_LANG?.toLowerCase() || "en",
  countryCode: process.env.NEXT_PUBLIC_PHONE_CODE || "0",
  languageDirection: languageDirectionType.RTL,
  isRTL: process.env.NEXT_PUBLIC_DIRECTION === "RTL" ? true : false,
  subdirectoryPath: `${
    process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
      ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
      : ""
  }`,
  pageLoaded: false,
};

export const pageInfoSlice = createSlice({
  name: "pageInfo",
  initialState,
  reducers: {
    updatePageId: (state, action: PayloadAction<number | string>) => {
      state.id = action.payload;
    },
    updateIsRTL: (state, action: PayloadAction<boolean>) => {
      state.isRTL = action.payload;
    },
    updatePageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    updatePageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    updateDeviceType: (state, action: PayloadAction<DeviceTypes>) => {
      state.deviceType = action.payload;
    },
    updatePlatform: (state, action: PayloadAction<PlatFormTypes>) => {
      state.platform = action.payload;
    },
    updateCountry: (state, action: PayloadAction<Country>) => {
      state.country = action.payload;
    },
    updatePageType: (state, action: PayloadAction<PageTypes>) => {
      state.pageType = action.payload;
    },
    updatePageLoaded: (state, action: PayloadAction<boolean>) => {
      state.pageLoaded = action.payload;
    },
  },
});

export const {
  updatePageId,
  updatePageNumber,
  updatePageSize,
  updateDeviceType,
  updatePlatform,
  updateCountry,
  updatePageType,
  updateIsRTL,
  updatePageLoaded,
} = pageInfoSlice.actions;

export default pageInfoSlice.reducer;
