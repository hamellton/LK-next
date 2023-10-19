import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { StudioFlowFunctions } from "@lk/core-utils";
import { Store, StudioFlowInfoType } from "@/types/state/studioflowInfoType";
import { paymentFunctions } from "@lk/core-utils";
import { RootState } from "../store";
import { NextRouter } from "next/router";

interface RequestAddressType {
  action: string;
  addressType: string;
  addressline1: string;
  addressline2: string;
  city: string;
  country: string;
  email: string;
  firstName: string;
  gender: string;
  phone: string;
  phoneCode: string;
  postcode: string;
  state: string;
}

const initialState: StudioFlowInfoType = {
  isLoading: false,
  stores: [],
  searchResults: [],
  userInfo: {
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    phone: "",
    phoneCode: "",
  },
  error: {
    isError: false,
    message: "",
    status: 1,
  },
  timeSlots: {
    loading: true,
    timeSlotData: {
      result: {},
      error: {
        isError: false,
      },
    },
    isError: false,
    errorMessage: "",
  },
  bookSlotData: {
    bookSlotLoading: false,
    bookSlotData: {
      result: {},
      error: {
        isError: false,
      },
    },
    bookSlotError: false,
    bookSlotErrorMessage: "",
  },
  bookAppointment: {
    bookAppointmentLoading: false,
    bookAppointmentData: {
      result: {},
      error: {
        isError: false,
      },
    },
    bookAppointmentError: false,
    bookAppointmentErrorMessage: "",
  },
  searchValue: "",
  isAvailable: false,
  selectedStore: null,
  isStoreSelected: false,
  updateShippingAddress: {
    isError: false,
    errorMsg: "",
  },
};

export const fetchStores = createAsyncThunk(
  "fetchStores",
  async (
    reqObj: {
      sessionId: string;
      params?: string;
      isExchange?: boolean;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateStudioFlowLoading(true));
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.setMethod(APIMethods.GET);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      const body = new RequestBody<string>(reqObj.params || "");
      const { data, error, isAvailable } = await StudioFlowFunctions.getStores(
        api,
        body
      );
      thunkAPI.dispatch(updateStudioFlowLoading(false));

      return {
        stores: data,
        error: error,
        isAvailable: isAvailable,
      };
    } catch (err) {
      return {
        stores: [],
        isAvailable: false,
        error: {
          isError: true,
          message: "ERROR_404",
          status: 404,
        },
      };
    }
  }
);

export const getTimeSlots = createAsyncThunk(
  "getTimeSlots",
  async (
    reqObj: {
      sessionId: string;
      body: any;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateTimeSlotsLoading(true));
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.setMethod(APIMethods.POST);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      const body = new RequestBody<string>(reqObj.body || "");
      const { data: result, error } = await StudioFlowFunctions.getTimeSlots(
        api,
        body
      );
      thunkAPI.dispatch(updateTimeSlotsLoading(false));
      return {
        result,
        error,
      };
    } catch (err) {
      return {
        // stores: [],
        error: {
          isError: true,
          message: "ERROR_404",
          status: 404,
        },
      };
    }
  }
);

export const bookSlot = createAsyncThunk(
  "bookSlot",
  async (
    reqObj: {
      sessionId: string;
      body: any;
      orderId: number | "" | undefined;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateBookSlotsLoading(true));
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.setMethod(APIMethods.POST);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      const body = new RequestBody<string>(reqObj.body || "");
      const orderId = reqObj.orderId;
      const { data: result, error } = await StudioFlowFunctions.bookSlots(
        api,
        orderId,
        body
      );
      thunkAPI.dispatch(updateBookSlotsLoading(false));
      return {
        result,
        error,
      };
    } catch (err) {
      console.log("err", err);
      return {
        // stores: [],
        error: {
          isError: true,
          message: "ERROR_404",
          status: 404,
        },
      };
    }
  }
);

export const bookAppointment = createAsyncThunk(
  "bookAppointment",
  async (
    reqObj: {
      sessionId: string;
      body: any;
      orderId: number | "" | undefined;
      reschedule?: boolean;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateBookSlotsLoading(true));
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.setMethod(APIMethods.POST);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      const body = new RequestBody<string>(reqObj.body || "");
      const reschedule = reqObj?.reschedule;
      const orderId = reqObj.orderId;
      const { data: result, error } = await StudioFlowFunctions.bookAppointment(
        api,
        orderId,
        body,
        reschedule
      );
      thunkAPI.dispatch(updateBookSlotsLoading(false));
      return {
        result,
        error,
      };
    } catch (err) {
      return {
        // stores: [],
        error: {
          isError: true,
          message: "Something went wrong!",
          status: 404,
        },
      };
    }
  }
);

export const updateShippingAddress = createAsyncThunk(
  "updateShippingAddress",
  async (
    reqObj: {
      sessionId: string;
      address: Store;
      studioStoreDetails: any;
      contactDetails: any;
      router: NextRouter;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateStudioFlowLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    const body = new RequestBody<{
      address: RequestAddressType;
      studioStoreDetails: any;
      contactDetails: any;
    }>({
      address: {
        action: "NOT_INSERT",
        addressType: "billing",
        addressline1: reqObj.address.address,
        addressline2: "-",
        city: reqObj.address.city,
        country: process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase() as string,
        email: reqObj.address.email,
        firstName: reqObj.address.name,
        gender: "",
        phone: reqObj.address.telephone,
        postcode: reqObj.address.pincode,
        phoneCode: reqObj.address.phoneCode,
        state: reqObj.address.state,
      },
      contactDetails: reqObj.contactDetails,
      studioStoreDetails: reqObj.studioStoreDetails,
    });

    try {
      const { data: shippingData, error } =
        await paymentFunctions.fetchShippingAddress(api, body);
      thunkAPI.dispatch(updateStudioFlowLoading(false));
      if (!error.isError) {
        reqObj.router.push("/payment");
        return shippingData;
      } else {
        return {
          error: {
            isError: true,
            message: error.message,
            status: 1,
          },
        };
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const searchStores = createAsyncThunk(
  "searchStores",
  async (reqObj: { searchQuery: string }, thunkAPI) => {
    // thunkAPI.dispatch(updateStudioFlowLoading(true));
    if (reqObj.searchQuery)
      thunkAPI.dispatch(
        updateSearchResults(
          (thunkAPI.getState() as RootState).studioFlowInfo.stores.filter(
            (store) =>
              store.name
                .toLowerCase()
                .indexOf(reqObj.searchQuery.toLowerCase()) !== -1
          )
        )
      );
    else thunkAPI.dispatch(updateSearchResults([]));
    // thunkAPI.dispatch(updateStudioFlowLoading(false));
  }
);

export const studioFlowSlice = createSlice({
  name: "studioflow",
  initialState,
  reducers: {
    updateStudioFlowLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateTimeSlotsLoading: (state, action: PayloadAction<boolean>) => {
      state.timeSlots.loading = action.payload;
    },
    updateBookSlotsLoading: (state, action: PayloadAction<boolean>) => {
      state.bookSlotData.bookSlotLoading = action.payload;
    },
    resetBookingData: (state) => {
      state.timeSlots.timeSlotData = {
        result: {},
        error: {
          isError: false,
        },
      };
      state.bookSlotData.bookSlotData = {
        result: {},
        error: {
          isError: false,
        },
      };
      state.bookAppointment.bookAppointmentData = {
        result: {},
        error: {
          isError: false,
        },
      };
    },
    resetBookingError: (state) => {
      state.bookSlotData.bookSlotData = {
        error: {
          isError: false,
        },
      };
      state.bookAppointment.bookAppointmentData = {
        error: {
          isError: false,
        },
      };
    },
    updateBookAppointmentLoading: (state, action: PayloadAction<boolean>) => {
      state.bookAppointment.bookAppointmentLoading = action.payload;
    },
    updateSelectedStore: (state, action: PayloadAction<Store>) => {
      state.selectedStore = action.payload;
    },
    updateSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    updateSearchResults: (state, action: PayloadAction<Store[]>) => {
      state.searchResults = action.payload;
    },
    isStoreSelectedReducer: (state, action: PayloadAction<boolean>) => {
      state.isStoreSelected = action.payload;
    },
    resetUpdateShippingAddressError: (state) => {
      state.updateShippingAddress = initialState.updateShippingAddress;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStores.rejected, (state, action) => {
      state.stores = [];
      state.error = {
        isError: true,
        message: "ERROR_404",
        status: 404,
      };
      state.isLoading = false;
    });
    builder.addCase(fetchStores.fulfilled, (state, action) => {
      const { stores, error, isAvailable } = action.payload;
      if (error.isError) {
        state.isLoading = false;
        state.isAvailable = false;
        state.error = {
          isError: error.isError,
          message: error.message,
          status: error.status || 0,
        };
      } else {
        state.stores = stores;
        state.isLoading = false;
        state.isAvailable = isAvailable;
        state.error = {
          isError: false,
          message: "",
          status: 1,
        };
      }
    });
    builder.addCase(getTimeSlots.fulfilled, (state, action) => {
      state.timeSlots.timeSlotData = action.payload;
      state.timeSlots.loading = false;
      state.timeSlots.isError = false;
      state.timeSlots.errorMessage = "";
    });
    builder.addCase(bookSlot.fulfilled, (state, action) => {
      state.bookSlotData.bookSlotData = action.payload;
      state.bookSlotData.bookSlotLoading = false;
      state.bookSlotData.bookSlotError = false;
      state.bookSlotData.bookSlotErrorMessage = "";
    });
    builder.addCase(bookAppointment.fulfilled, (state, action) => {
      state.bookAppointment.bookAppointmentData = action.payload;
      state.bookAppointment.bookAppointmentLoading = false;
      state.bookAppointment.bookAppointmentError = false;
      state.bookAppointment.bookAppointmentErrorMessage = "";
    });
    builder.addCase(updateShippingAddress.fulfilled, (state, action) => {
      if (action.payload?.error?.isError) {
        state.updateShippingAddress.isError = true;
        state.updateShippingAddress.errorMsg = action.payload?.error.message;
      }
    });
  },
});

export const {
  updateStudioFlowLoading,
  updateSearchValue,
  updateSearchResults,
  updateTimeSlotsLoading,
  updateSelectedStore,
  updateBookSlotsLoading,
  resetBookingData,
  resetBookingError,
  resetUpdateShippingAddressError,
  isStoreSelectedReducer,
} = studioFlowSlice.actions;

export default studioFlowSlice.reducer;
