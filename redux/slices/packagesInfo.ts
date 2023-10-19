import { PriceType } from "./../../types/priceTypes";
import { PackageENUM, PackageStepsType } from "@/types/productDetails";
import { APIService } from "@lk/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { exchangeHeaders, headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { packagesFunctions } from "@lk/core-utils";
import { getCookie } from "@/helpers/defaultHeaders";

export enum PackageItemSortENUM {
  PRICE = "price",
  INDEX = "index",
}
interface PackageInfoType {
  id: string | null;
  label: string | null;
  sortBy: PackageItemSortENUM;
  packagesLoading: boolean;
  packagesError: boolean;
  steps: PackageStepsType[];
  prescription: any;
  packages: any;
  framePrice: PriceType | null;
}

const initialState: PackageInfoType = {
  id: null,
  label: null,
  sortBy: PackageItemSortENUM.PRICE,
  packagesLoading: false,
  packagesError: false,
  steps: [],
  prescription: true,
  packages: null,
  framePrice: null,
};

export const fetchPackageSteps = createAsyncThunk(
  "fetchPackageSteps",
  async (
    reqObj: {
      classification: string;
    },
    thunkAPI
  ) => {
    const { data: stepsData, error } = packagesFunctions.getStepsData(
      reqObj.classification
    );
    if (error.isError) {
      thunkAPI.dispatch(updatePackageLoading(false));
      thunkAPI.dispatch(updatePackageError(true));
    }

    return stepsData;
  }
);

export const fetchPackageData = createAsyncThunk(
  "fetchPackages",
  async (
    reqObj: {
      pid: number;
      powerType: string;
      frameType: string;
      classification: string;
      sessionId: string;
    },
    thunkAPI
  ) => {
    const { pid, powerType, frameType, classification } = reqObj;
    thunkAPI.dispatch(updatePackageLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
      headerArr
    );
    api.sessionToken = reqObj.sessionId;
    api.setMethod(APIMethods.GET);
    const isExchangeFlow = getCookie("postcheckExchangeNP") || false;
    if (isExchangeFlow) {
      api.resetHeaders();
      api.setHeaders([...headerArr, ...exchangeHeaders]);
    }
    const returnOrderId = getCookie("postcheckOrderId") || null;
    const returnItemId = getCookie("postcheckItemId") || null;
    const postcheckParams = [];
    if (returnOrderId) {
      postcheckParams.push({
        key: "orderId",
        value: [typeof returnOrderId === "string" ? returnOrderId : ""],
      });
    }
    if (returnItemId) {
      postcheckParams.push({
        key: "itemId",
        value: [typeof returnItemId === "string" ? returnItemId : ""],
      });
    }
    const { data: packagesData, error } =
      await packagesFunctions.getPackagesData(
        pid,
        powerType,
        frameType,
        classification,
        api,
        postcheckParams
      );
    // console.log(packagesData);
    if (error.isError) {
      thunkAPI.dispatch(updatePackageLoading(false));
      thunkAPI.dispatch(updatePackageError(true));
    }
    return {
      packages: packagesData.packages,
    };
  }
);

export const packageInfoSlice = createSlice({
  name: "packageInfo",
  initialState,
  reducers: {
    updateStepsData: (state, action: PayloadAction<PackageStepsType[]>) => {
      state.steps = action.payload;
    },
    updatePackageLoading: (state, action: PayloadAction<boolean>) => {
      state.packagesLoading = action.payload;
    },
    updatePackageError: (state, action: PayloadAction<boolean>) => {
      state.packagesError = action.payload;
    },
    resetPackages: (state) => {
      state.packages = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPackageSteps.fulfilled, (state, action) => {
      if (action.payload.steps) {
        state.steps = action.payload.steps;
        state.packagesLoading = false;
        state.packagesError = false;
      }
    });
    builder.addCase(fetchPackageData.fulfilled, (state, action) => {
      if (action.payload.packages) {
        state.id = action.payload.packages.id;
        state.label = action.payload.packages.label;
        state.framePrice = action.payload.packages.framePrice;
        state.packages = action.payload.packages.packages;
        state.sortBy = action.payload.packages.sortBy;
        state.packagesLoading = false;
        state.packagesError = false;
      }
    });
  },
});

export const {
  updateStepsData,
  updatePackageLoading,
  updatePackageError,
  resetPackages,
} = packageInfoSlice.actions;

export default packageInfoSlice.reducer;
