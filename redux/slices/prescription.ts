import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { getPrescriptionFunction, StoreLocatorFuntions } from "@lk/core-utils";
import { prescriptionType } from "@/types/state/prescriptionType";
import { pdpFunctions } from "@lk/core-utils";
import { DataType } from "@/types/coreTypes";
import { UserPowerFunctions } from "@lk/core-utils";
import { Pages } from "@/components/PrescriptionModalV2/helper";

const initialState: prescriptionType = {
  isLoading: true,
  isError: false,
  errorMessage: "",
  data: [],
  updatePrescriptionDataAdded: false,
  userName: "",
  fetchPowerData: {
    isLoading: false,
    result: null,
    error: false,
    errorMessage: "",
  },
  uploadImage: {
    imageUrl: "",
    error: "",
    pdImageURL: "",
  },
  updatePrescriptionDataInfo: {
    prescriptionSavedManual: null,
    isLoading: false,
    isError: false,
    errorMessage: "",
  },
  storeSlots: {
    storePage: "1",
    isLoading: false,
    isError: false,
    errorMessage: "",
    data: null,
  },
  bookSlot: {
    isLoading: false,
    isError: false,
    data: null,
  },
  clPrescriptionData: {
    quantity: 0,
    eye: "",
    clValidateSuccessful: false,
    validateCLError: {
      error: false,
      errMessage: "",
    },
    prescription: {},
    subscriptionsData: {
      isLoading: false,
      isError: false,
      data: null,
    },
    subscriptionDiscountData: {
      isLoading: false,
      isError: false,
      data: null,
    },
    clSolutionsData: {
      isLoading: false,
      isError: false,
      data: null,
    },
  },
  prescriptionPage: Pages.SUBMIT_PRESCRIPTION,
  // prescriptionPage: Pages.ENTER_PD,
  prevPrescriptionPage: "",
  prescriptionPageStatus: false,
};

export const updatePrescriptionData = createAsyncThunk(
  "updatePrescriptionData",
  async (
    reqObj: {
      sessionId: string;
      orderID: string | number;
      itemID: string;
      prescription: any;
      emailID: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateUserPrescriptionData(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.PUT);

    const body = new RequestBody<{
      id?: number;
      imageFileName?: string;
      left: DataType;
      right: DataType;
      powerType: string;
      userName: string;
      showPd?: boolean;
      recordedAt?: number;
      labels?: DataType;
      source?: string;
      pdConfigAvailable?: boolean;
      pdImageFileName?: string;
    }>({
      ...reqObj.prescription,
    });
    thunkAPI.dispatch(updateUserName(reqObj.prescription.userName));
    try {
      const { data, error } = await UserPowerFunctions.submitPowerManual(
        api,
        reqObj.orderID,
        reqObj.itemID,
        reqObj.emailID,
        body
      );
      if (error.isError) {
        return { ...data, error };
      } else {
        return { ...data, error };
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const getSavedPrescriptionData = createAsyncThunk(
  "getSavedPrescriptionData",
  async (reqObj: { sessionId: string }, thunkAPI) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    try {
      const { data: result, error } =
        await getPrescriptionFunction.getPrescriptionData(api);
      thunkAPI.dispatch(updatePayLoading(false));
      if (!error.isError) {
        return result.result;
      } else {
        thunkAPI.dispatch(
          updatePayError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const getStoreSlotes = createAsyncThunk(
  "getStoreSlotes",
  async (
    reqObj: {
      sessionId: string;
      classification: number;
      duration: number;
      skipCurrentDate: number;
      storeCode: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateStoreSlotsLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      classification: number;
      duration: number;
      skipCurrentDate: number;
      storeCode: string;
    }>({
      classification: reqObj.classification,
      duration: reqObj.duration,
      skipCurrentDate: reqObj.skipCurrentDate,
      storeCode: reqObj.storeCode,
    });
    try {
      const { data: result, error } = await StoreLocatorFuntions.getStoreSlots(
        api,
        body
      );
      if (!error.isError) {
        return { result: result.result, error };
      } else {
        return { result, error };
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const bookSlots = createAsyncThunk(
  "bookSlots",
  async (
    reqObj: {
      sessionId: string;
      appointmentType: number;
      countryCode: string;
      customerName: string;
      customerNumber: string;
      date: string;
      slotId: number;
      storeCode: string;
      orderId: number;
      itemId: number;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateBookSlotLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      appointmentType: number;
      countryCode: string;
      customerName: string;
      customerNumber: string;
      date: string;
      slotId: number;
      storeCode: string;
    }>({
      appointmentType: reqObj.appointmentType,
      countryCode: reqObj.countryCode,
      customerName: reqObj.customerName,
      customerNumber: reqObj.customerNumber,
      date: reqObj.date,
      slotId: reqObj.slotId,
      storeCode: reqObj.storeCode,
    });
    try {
      const { data: result, error } = await StoreLocatorFuntions.bookSlots(
        api,
        reqObj.orderId,
        reqObj.itemId,
        body
      );
      if (!error.isError) {
        return { result: result.result, error };
      } else {
        return { result, error };
        console.log("Error", result, error);
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const fetchPowers = createAsyncThunk(
  "fetchPowers",
  async (
    reqObj: {
      sessionId: string;
      pid: number;
      powerType: string;
      consumer: boolean;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    try {
      const { data: result, error } = await pdpFunctions.fetchPowers(
        reqObj.pid,
        api,
        reqObj.powerType,
        reqObj.consumer
      );
      if (!error.isError) {
        return result;
      } else {
        thunkAPI.dispatch(
          updateFetchPowerError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const getPrescriptionDataWithPowerType = createAsyncThunk(
  "getPrescriptionDataWithPowerType",
  async (reqObj: { sessionId: string; powerType: string }, thunkAPI) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders([
      ...headerArr,
      // {
      //   key: "x-api-client",
      //   value: `mobilesite`,
      // },
      { key: "sec-fetch-site", value: "same-site" },
    ]);
    api.setMethod(APIMethods.GET);
    try {
      const { data: result, error } =
        await getPrescriptionFunction.getPrescriptionDataWithPowerType(
          api,
          reqObj.powerType
        );
      if (!error.isError) {
        return result.result;
      } else {
        thunkAPI.dispatch(
          updatePayError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const uploadImage = createAsyncThunk(
  "uploadImage",
  async (reqObj: { fileData: any }, thunkAPI) => {
    const formData = new FormData();
    formData.append("file", reqObj.fileData);

    return fetch(
      "https://api-gateway.juno.preprod.lenskart.com/magento/me/index/uploadprescfile",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((r) => r.json())
      .then((data) => {
        // console.log(data);
        if (data) {
          console.log(data);
          return { data, error: true };
        } else return { data, error: false };
      });
  }
);

export const getCLSubscriptions = createAsyncThunk(
  "getSubscriptionsForCL",
  async (
    reqObj: {
      sessionId: string;
      productId: string | number;
      isBothEye: boolean;
    },
    thunkAPI
  ) => {
    console.log("reqObj", reqObj);
    // thunkAPI.dispatch(updatePayLoading(true));
    thunkAPI.dispatch(updateCLPrescriptionDataLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders([...headerArr]);
    api.setMethod(APIMethods.GET);
    try {
      const { data: result, error } =
        await getPrescriptionFunction.getCLSubscriptionData(
          api,
          reqObj.productId,
          reqObj.isBothEye
        );
      thunkAPI.dispatch(updateCLPrescriptionDataLoading(false));
      if (!error.isError) {
        return result.result;
      } else {
        thunkAPI.dispatch(
          updatePayError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const getSubscriptionDiscount = createAsyncThunk(
  "getSubscriptionDiscount",
  async (
    reqObj: {
      sessionId: string;
      productId: string | number;
      subscriptionsType: string;
    },
    thunkAPI
  ) => {
    console.log("reqObj", reqObj);
    // thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders([...headerArr]);
    api.setMethod(APIMethods.GET);
    try {
      const { data: result, error } =
        await getPrescriptionFunction.getCLSubscriptionDiscount(
          reqObj.productId,
          reqObj.subscriptionsType,
          api
        );
      if (!error.isError) {
        return result.result;
      } else {
        thunkAPI.dispatch(
          updatePayError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);
export const getCLSolutions = createAsyncThunk(
  "getCLSolutions",
  async (
    reqObj: {
      sessionId: string;
      productId: string | number;
    },
    thunkAPI
  ) => {
    console.log("reqObj", reqObj);
    // thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders([...headerArr]);
    api.setMethod(APIMethods.GET);
    try {
      const { data: result, error } =
        await getPrescriptionFunction.getCLSolutions(reqObj.productId, api);
      if (!error.isError) {
        return result.result;
      } else {
        thunkAPI.dispatch(
          updatePayError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const validateCLPrescription = createAsyncThunk(
  "validateCLPrescription",
  async (
    reqObj: {
      sessionId: string;
      prescription: {
        left?: any;
        right?: any;
      };
      productId: string | number;
      quantity: number;
      userName: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(validateCLError({ error: false, errorMessage: "" }));
    // thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders([...headerArr]);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      prescription: any;
      productId: string | number;
      quantity: number;
      userName: string;
    }>({
      prescription: reqObj.prescription,
      productId: reqObj.productId,
      quantity: reqObj.quantity,
      userName: reqObj.userName,
    });

    try {
      const { data: result, error } = await pdpFunctions.validateCLPrescription(
        body,
        api
      );
      if (!error.isError) {
        thunkAPI.dispatch(validateCLSuccessful(true));
        return result.result;
      } else {
        thunkAPI.dispatch(
          validateCLError({ error: true, errorMessage: error.message })
        );
        validateCLSuccessful(false);
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const prescriptionInfoSlice = createSlice({
  name: "prescriptionInfo",
  initialState,
  reducers: {
    updatePayLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updatePayError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.errorMessage = action.payload.errorMessage;
    },
    validateCLError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.clPrescriptionData.validateCLError.error = action.payload.error;
      state.clPrescriptionData.validateCLError.errMessage =
        action.payload.errorMessage;
    },
    validateCLSuccessful: (state, action: PayloadAction<boolean>) => {
      state.clPrescriptionData.clValidateSuccessful = action.payload;
    },
    updateFetchPowerError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.fetchPowerData.error = action.payload.error;
      state.fetchPowerData.errorMessage = action.payload.errorMessage;
    },
    updateUploadData: (
      state,
      action: PayloadAction<{
        error: string;
        imageUrl: string;
        pdImageURL: string;
      }>
    ) => {
      state.uploadImage.error = action.payload.error;
      state.uploadImage.imageUrl = action.payload.imageUrl;
      state.uploadImage.pdImageURL = action.payload.pdImageURL;
    },
    updateUserPrescriptionData: (state, action: PayloadAction<boolean>) => {
      state.updatePrescriptionDataInfo.isLoading = action.payload;
      state.updatePrescriptionDataInfo.isError = false;
    },
    updateCLPrescriptionDataLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.clPrescriptionData.subscriptionsData.isLoading = action.payload;
      state.updatePrescriptionDataInfo.isError = false;
    },
    updateCLPrescriptionData: (state, action: PayloadAction<boolean>) => {
      state.clPrescriptionData.subscriptionsData.isLoading = action.payload;
      state.updatePrescriptionDataInfo.isError = false;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    updateCLEye: (state, action: PayloadAction<string>) => {
      state.clPrescriptionData.eye = action.payload;
    },
    updateCLQuantity: (state, action: PayloadAction<number>) => {
      state.clPrescriptionData.quantity = action.payload;
    },
    updateCLPrescription: (
      state,
      action: PayloadAction<{
        imageFileName?: string;
        left?: {
          boxes?: number;
        };
        right?: {
          boxes?: number;
        };
        powerType: string;
      }>
    ) => {
      state.clPrescriptionData.prescription = action.payload;
    },
    updatePrescriptionPage: (state, action: PayloadAction<string>) => {
      state.prescriptionPage = action.payload;
    },
    updatePrevPrescriptionPage: (state, action: PayloadAction<string>) => {
      state.prevPrescriptionPage = action.payload;
    },
    updateStoreSlotsLoading: (state, action: PayloadAction<boolean>) => {
      state.storeSlots.isLoading = action.payload;
      state.storeSlots.isError = false;
    },
    updateBookSlotsLoading: (state, action: PayloadAction<boolean>) => {
      state.bookSlot.isLoading = action.payload;
      state.bookSlot.isError = false;
    },
    updateBookSlotLoading: (state, action: PayloadAction<boolean>) => {
      state.bookSlot.isLoading = action.payload;
      state.bookSlot.isError = false;
    },
    setStoreLocatorPage: (state, action: PayloadAction<string>) => {
      state.storeSlots.storePage = action.payload;
    },
    resetPrescriptionData: (state) => {
      state.prescriptionPage = initialState.prescriptionPage;
      state.fetchPowerData = initialState.fetchPowerData;
      state.prescriptionPage = initialState.prescriptionPage;
      state.prevPrescriptionPage = "";
      state.storeSlots = initialState.storeSlots;
      state.updatePrescriptionDataInfo =
        initialState.updatePrescriptionDataInfo;
    },
    setPrescriptionPageStatus: (state, action: PayloadAction<boolean>) => {
      state.prescriptionPageStatus = action.payload;
      state.fetchPowerData = initialState.fetchPowerData;
    },
    resetUpdatePrescriptionDataInfo: (state) => {
      state.updatePrescriptionDataInfo =
        initialState.updatePrescriptionDataInfo;
    },
    resetUpdatePrescriptionDataAdded: (state) => {
      state.updatePrescriptionDataAdded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSavedPrescriptionData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(
      getPrescriptionDataWithPowerType.fulfilled,
      (state, action) => {
        if (action.payload) {
          state.data = action.payload;
          state.isLoading = false;
          state.isError = false;
          state.errorMessage = "";
        }
      }
    );
    builder.addCase(fetchPowers.fulfilled, (state, action) => {
      state.fetchPowerData.result = { ...action.payload };
      state.fetchPowerData.isLoading = false;
    });
    builder.addCase(fetchPowers.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updatePrescriptionData.fulfilled, (state, action) => {
      if (!action.payload?.error?.isError) {
        state.updatePrescriptionDataInfo.prescriptionSavedManual = {
          ...action.payload.result,
        };
        state.updatePrescriptionDataAdded = true;
      } else {
        state.updatePrescriptionDataInfo.isError = true;
        state.updatePrescriptionDataInfo.errorMessage =
          action.payload?.error?.message;
      }
      state.updatePrescriptionDataInfo.isLoading = false;
    });
    builder.addCase(updatePrescriptionData.rejected, (state) => {
      state.updatePrescriptionDataInfo.isError = true;
      state.updatePrescriptionDataInfo.isLoading = false;
    });
    builder.addCase(getStoreSlotes.fulfilled, (state, action) => {
      if (action.payload.error.isError) {
        state.storeSlots.isError = true;
        state.storeSlots.errorMessage = action.payload.error.message;
      } else {
        state.storeSlots.data = { ...action.payload.result };
      }
      state.storeSlots.isLoading = false;
    });
    builder.addCase(bookSlots.fulfilled, (state, action) => {
      console.log(action.payload);

      if (action.payload.error.isError) {
        state.bookSlot.isError = true;
      } else {
        state.bookSlot.data = { ...action.payload.result.data };
      }
      state.bookSlot.isLoading = false;
    });
    builder.addCase(getCLSubscriptions.fulfilled, (state, action) => {
      state.clPrescriptionData.subscriptionsData.data = action.payload;
      state.clPrescriptionData.subscriptionsData.isLoading = false;
      state.clPrescriptionData.subscriptionsData.isError = false;
    });
    builder.addCase(getSubscriptionDiscount.fulfilled, (state, action) => {
      state.clPrescriptionData.subscriptionDiscountData.data = action.payload;
      state.clPrescriptionData.subscriptionDiscountData.isLoading = false;
      state.clPrescriptionData.subscriptionDiscountData.isError = false;
      // state.errorMessage = '';
    });
    builder.addCase(getCLSolutions.fulfilled, (state, action) => {
      state.clPrescriptionData.clSolutionsData.data = action.payload;
      state.clPrescriptionData.clSolutionsData.isLoading = false;
      state.clPrescriptionData.clSolutionsData.isError = false;
      // state.errorMessage = '';
    });
  },
});

export const {
  updatePayLoading,
  updatePayError,
  updateFetchPowerError,
  updateUploadData,
  updateUserPrescriptionData,
  updatePrescriptionPage,
  resetPrescriptionData,
  setPrescriptionPageStatus,
  updatePrevPrescriptionPage,
  updateStoreSlotsLoading,
  updateBookSlotLoading,
  setStoreLocatorPage,
  updateCLPrescriptionDataLoading,
  updateCLQuantity,
  updateCLEye,
  updateCLPrescription,
  resetUpdatePrescriptionDataInfo,
  validateCLError,
  validateCLSuccessful,
  resetUpdatePrescriptionDataAdded,
  updateUserName,
} = prescriptionInfoSlice.actions;

export default prescriptionInfoSlice.reducer;
