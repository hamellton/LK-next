import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { PrimerFunctions } from "@lk/core-utils";
import { PrimerInfoType } from "@/types/state/primerInfoType";
import { ConfigDataType } from "@/types/coreTypes";
import { RootState } from "../store";

const initialState: PrimerInfoType = {
  isLoading: false,
  isPrimerActive: true,
  isScriptAdded: false,
  token: "",
  paymentMethods: null,
  error: {
    isError: false,
    message: "",
  },
  status: {
    orderId: "",
    status: "",
  },
};

export const getClientToken = createAsyncThunk(
  "getClientToken",
  async (
    reqObj: {
      sessionId: string;
      orderId?: string;
    },
    thunkAPI
  ) => {
    // thunkAPI.dispatch(updatePrimerLoading(true));
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.setMethod(APIMethods.GET);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      const body = new RequestBody<string>(reqObj.orderId || "");
      const { data, error } = await PrimerFunctions.getClientToken(api, body);
      // thunkAPI.dispatch(updatePrimerLoading(false));

      return {
        token: data,
        error: error,
      };
    } catch (err) {
      return {
        token: "",
        error: {
          isError: true,
          message: "ERROR_404",
          status: 404,
        },
      };
    }
  }
);

export const getPrimerPaymentStatus = createAsyncThunk(
  "getPrimerPaymentStatus",
  async (
    reqObj: {
      sessionId: string;
      paymentId: string;
      paymentRefId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updatePrimerLoading(true));
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      const { payment } = (thunkAPI.getState() as RootState).paymentInfo
        .paymentDetails;
      api.setMethod(APIMethods.GET);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      const body = new RequestBody<{
        paymentId: string;
        paymentRefId: string;
      }>({ paymentId: payment.paymentId, paymentRefId: reqObj.paymentRefId });
      const { data, error } = await PrimerFunctions.getPrimerPaymentStatus(
        api,
        body
      );
      thunkAPI.dispatch(updatePrimerLoading(false));

      return {
        status: data,
        error: error,
      };
    } catch (err) {
      return {
        status: "",
        error: {
          isError: true,
          message: "ERROR_404",
          status: 404,
        },
      };
    }
  }
);

export const getPrimerPaymentMethods = createAsyncThunk(
  "getPrimerPaymentMethods",
  async (
    reqObj: {
      sessionId: string;
      orderId?: string;
      paymentMethods: any;
      configData: ConfigDataType;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updatePrimerLoading(true));
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.setMethod(APIMethods.GET);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      const body = new RequestBody<{
        paymentMethods: any;
        orderId?: string;
        configData: ConfigDataType;
      }>({
        paymentMethods: reqObj.paymentMethods,
        orderId: reqObj.orderId,
        configData: reqObj.configData,
      });
      const { data, error } = await PrimerFunctions.getPaymentMethods(
        api,
        body
      );
      thunkAPI.dispatch(updatePrimerLoading(false));

      return {
        paymentMethods: data,
        error: error,
      };
    } catch (err) {
      return {
        paymentMethods: null,
        error: {
          isError: true,
          message: "ERROR_402",
          status: 404,
        },
      };
    }
  }
);

export const primerSlice = createSlice({
  name: "primer",
  initialState,
  reducers: {
    updatePrimerLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateIsPrimerActive: (state, action: PayloadAction<boolean>) => {
      state.isPrimerActive = action.payload;
    },
    updateIsScriptAdded: (state, action: PayloadAction<boolean>) => {
      state.isScriptAdded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClientToken.rejected, (state, action) => {
      state.token = "";
      state.isPrimerActive = false;
      state.error = {
        isError: true,
        message: "ERROR_404",
      };
      state.isLoading = false;
    });
    builder.addCase(getClientToken.fulfilled, (state, action) => {
      const { token, error } = action.payload;
      state.isLoading = false;
      if (error.isError) {
        state.isPrimerActive = false;
        state.token = "";
        state.error = {
          isError: error.isError,
          message: error.message,
        };
      } else {
        state.token = token;
        state.error = {
          isError: false,
          message: "",
        };
      }
    });
    builder.addCase(getPrimerPaymentMethods.rejected, (state, action) => {
      state.paymentMethods = null;
      state.isPrimerActive = false;
      state.error = {
        isError: true,
        message: "ERROR_401",
      };
      state.isLoading = false;
    });
    builder.addCase(getPrimerPaymentMethods.fulfilled, (state, action) => {
      const { paymentMethods, error } = action.payload;
      state.isLoading = false;
      if (error.isError) {
        state.isPrimerActive = false;
        state.paymentMethods = null;
        state.error = {
          isError: error.isError,
          message: error.message,
        };
      } else {
        state.paymentMethods = paymentMethods;
        state.error = {
          isError: false,
          message: "",
        };
      }
    });
    builder.addCase(getPrimerPaymentStatus.rejected, (state, action) => {
      state.isPrimerActive = false;
      state.status = {
        orderId: "",
        status: "",
      };
      state.error = {
        isError: true,
        message: "ERROR_401",
      };
      state.isLoading = false;
    });
    builder.addCase(getPrimerPaymentStatus.fulfilled, (state, action) => {
      const { status, error } = action.payload;
      state.isLoading = false;
      if (error.isError) {
        state.isPrimerActive = false;
        state.status = {
          orderId: "",
          status: "",
        };
        state.error = {
          isError: error.isError,
          message: error.message,
        };
      } else {
        state.status = status;
        state.error = {
          isError: false,
          message: "",
        };
      }
    });
  },
});

export const {
  updatePrimerLoading,
  updateIsPrimerActive,
  updateIsScriptAdded,
} = primerSlice.actions;

export default primerSlice.reducer;
