import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { DataType } from "@/types/coreTypes";
import { paymentFunctions, orderFunctions } from "@lk/core-utils";
import { RequestBody } from "@lk/utils";
import { PaymentInfoType } from "@/types/state/paymentInfoType";

const initialState: PaymentInfoType = {
  isLoading: true,
  isError: false,
  errorMessage: "",
  payment: [],
  deliveryOptions: [],
  shippingAddress: [],
  paymentDetails: {
    order: {},
    payment: { actionInfo: { action: "", redirectUrl: "" } },
  },
  jusPayInitiated: undefined,
  jusPayData: undefined,
  jusPaymentStatusLoading: false,
  jusPaymentStatusData: undefined,
  isValidVpa: "",
  vpaPaymentLoading: false,
  upiTransactionStatus: "",
  validateCodOtpInfo: {
    isLoading: false,
    isError: "",
    successData: null,
  },
  paymentMethods: {},
  savedCards: [],
  disableAllExceptQr: false,
  qrCodeData: {
    data: {
      code: "",
      amount: 0,
    },
    qrDataLoading: false,
    error: {
      isError: false,
      errorMsg: "",
    },
  },
};

export const getPayMethods = createAsyncThunk(
  "getPayMethods",
  async (
    reqObj: { sessionId: string; orderId: string; isExchange: boolean },
    thunkAPI
  ) => {
    console.log("inside get paymethod ", reqObj, thunkAPI);
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    api.sessionToken = reqObj.sessionId;
    const { orderId, isExchange } = reqObj;
    try {
      const { data: paymentMethods, error: paymentErr } =
        await paymentFunctions.fetchPaymentMethods(
          api,
          orderId
            ? Buffer.from(orderId as string, "base64").toString("ascii")
            : "",
          isExchange,
          "cc,dc",
          false
        );
      thunkAPI.dispatch(updatePayLoading(false));
      if (!paymentErr.isError) {
        return paymentMethods;
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

export const getSavedCards = createAsyncThunk(
  "getSavedCards",
  async (reqObj: { sessionId: string; orderId?: string }, thunkAPI) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    api.sessionToken = reqObj.sessionId;
    const oid = reqObj?.orderId || "";
    try {
      const { data: savedCards, error: savedCardsErr } =
        await paymentFunctions.getSavedCards(
          api,
          "PU",
          false,
          oid ? Buffer.from(oid as string, "base64").toString("ascii") : ""
        );
      thunkAPI.dispatch(updatePayLoading(false));
      if (!savedCardsErr.isError) {
        return savedCards;
      } else {
        thunkAPI.dispatch(
          updatePayError({
            error: true,
            errorMessage: "Error Fetching Saved Cards!",
          })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const initiateJusPaySdk = createAsyncThunk(
  "initiateJusPaySdk",
  async (
    reqObj: { sessionId: string; orderId?: string; isExchange: boolean },
    thunkAPI
  ) => {
    const { orderId, isExchange, sessionId } = reqObj || {};
    thunkAPI.dispatch(
      updateJusPayData({ jusPayInitiated: false, jusPayData: null })
    );
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    api.sessionToken = sessionId;
    try {
      const { data: payData, error } = await paymentFunctions.juspaySdkInitiate(
        api,
        orderId
      );
      if (!error.isError) {
        thunkAPI.dispatch(
          updateJusPayData({ jusPayInitiated: true, jusPayData: payData })
        );
      } else {
        thunkAPI.dispatch(
          updateJusPayData({ jusPayInitiated: false, jusPayData: null })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);
export const getJusPaymentStatusLoad = createAsyncThunk(
  "getJusPaymentStatusLoad",
  async (
    reqObj: { sessionId: string; orderId: string; isExchange?: boolean },
    thunkAPI
  ) => {
    thunkAPI.dispatch(
      updateJusPayStatusData({
        jusPaymentStatusLoading: true,
        jusPaymentStatusData: undefined,
      })
    );
    const { orderId, sessionId } = reqObj;
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.setMethod(APIMethods.GET);
    api.sessionToken = sessionId;
    api.setHeaders(headerArr);
    try {
      const { data: payData, error } = await paymentFunctions.getJuspayStatus(
        api,
        orderId
      );
      if (!error.isError) {
        thunkAPI.dispatch(
          updateJusPayStatusData({
            jusPaymentStatusLoading: false,
            jusPaymentStatusData: payData,
          })
        );
      } else {
        thunkAPI.dispatch(
          updateJusPayStatusData({
            jusPaymentStatusLoading: false,
            jusPaymentStatusData: undefined,
          })
        );
      }
    } catch (error) {
      updateJusPayStatusData({
        jusPaymentStatusLoading: false,
        jusPaymentStatusData: undefined,
      });
    }
  }
);
export const getDeliveryOptions = createAsyncThunk(
  "getDeliveryOptions",
  async (
    reqObj: { sessionId: string; postcode: string; country: string },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    api.sessionToken = reqObj.sessionId;
    const { postcode, country } = reqObj;
    try {
      const { data: deliveryData, error } =
        await paymentFunctions.fetchDeliveryOptions(api, postcode, country);
      thunkAPI.dispatch(updatePayLoading(false));
      if (!error.isError) {
        return deliveryData;
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

export const getShippingAddress = createAsyncThunk(
  "getShippingAddress",
  async (
    reqObj: { sessionId: string; address: any; giftMessage: any },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    const body = new RequestBody<{ address: any; giftMessage: any }>({
      address: reqObj.address,
      giftMessage: reqObj.giftMessage,
    });

    try {
      const { data: shippingData, error } =
        await paymentFunctions.fetchShippingAddress(api, body);
      thunkAPI.dispatch(updatePayLoading(false));
      if (!error.isError) {
        return shippingData;
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

export const verifyVpa = createAsyncThunk(
  "verifyVpa",
  async (
    reqObj: { sessionId: string; upiId: string; data: any },
    thunkAPI: any
  ) => {
    thunkAPI.dispatch(updateVpaPaymentLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    const body = new RequestBody<{ vpa: string }>({
      vpa: reqObj.upiId,
    });

    try {
      const { data: vpaVerificationData, error } =
        await paymentFunctions.verifyVpa(api, body);
      if (!error.isError) {
        const payDetailObj =
          reqObj.data && JSON.parse(JSON.stringify(reqObj.data));
        payDetailObj.paymentInfo.vpa = reqObj.upiId;
        if (vpaVerificationData?.isValidVpa === "TRUE")
          thunkAPI.dispatch(
            getOrderPayment({
              sessionId: reqObj?.sessionId,
              payDetailObj,
            })
          );
        else thunkAPI.dispatch(updateVpaPaymentLoading(false));
        return vpaVerificationData;
      } else {
        thunkAPI.dispatch(
          updatePayError({ error: true, errorMessage: error.message })
        );
        thunkAPI.dispatch(updateVpaPaymentLoading(false));
      }
    } catch (error) {
      return { error: true };
    }
  }
);

export const getUpiTransactionStatus = createAsyncThunk(
  "getUpiTransactionStatus",
  async (reqObj: { sessionId: string; orderId: string }, thunkAPI) => {
    thunkAPI.dispatch(updateUpiTransactionStatus({ upiTransactionStatus: "" }));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    try {
      const { data: payData, error } =
        await paymentFunctions.upiTransactionStatus(api, reqObj.orderId);
      if (!error.isError) {
        thunkAPI.dispatch(
          updateUpiTransactionStatus({ upiTransactionStatus: payData.status })
        );
      } else {
        thunkAPI.dispatch(
          updateUpiTransactionStatus({ upiTransactionStatus: "ERROR" })
        );
      }
    } catch (error) {
      updateUpiTransactionStatus({ upiTransactionStatus: "ERROR" });
    }
  }
);

/**
 * empty the cart after payment
 */
export const getOrderPayment = createAsyncThunk(
  "getOrderPayment",
  async (reqObj: { sessionId: string; payDetailObj: any }, thunkAPI) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    const body = new RequestBody<{ payDetailObj: any }>({
      ...reqObj.payDetailObj,
    });

    try {
      const { data: orderPayData, error } =
        await paymentFunctions.postOrderPayment(api, body);
      thunkAPI.dispatch(updatePayLoading(false));
      thunkAPI.dispatch(updateVpaPaymentLoading(false));
      if (!error.isError) {
        // thunkAPI.dispatch(
        //   resetCartData()
        // );
        // if(orderPayData.order?.id) {
        //   const date = new Date();
        //   date.setTime(date.getTime() + 5 * 60 * 1000); // here cookie duration = 5 mins
        // setCookie("orderId", orderPayData.order.id, {expires: date});
        // }
        return orderPayData;
      } else {
        return error;
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const validateCodOtp = createAsyncThunk(
  "validateCodOtp",
  async (reqObj: {
    sessionId: string;
    orderId: number;
    otp: number;
    email: string;
  }) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.PUT);
    try {
      const { data, error } = await orderFunctions.validateCodOtp(
        api,
        reqObj.orderId,
        reqObj.email,
        reqObj.otp
      );
      return { data, error };
    } catch (error) {
      return { error: true };
    }
  }
);

export const getQRCode = createAsyncThunk(
  "getQRCode",
  async (reqObj: { sessionId: string; orderId: string }, thunkAPI) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    try {
      thunkAPI.dispatch(updateQRDataLoading(true));
      const body = new RequestBody<null>(null);
      const { data: qrData, error } = await paymentFunctions.getQrCode(
        api,
        reqObj.orderId,
        body
      );
      if (error.isError) {
        thunkAPI.dispatch(
          updateQRDataError({
            isError: true,
            errMsg: "System Error Occured! Please try after sometime.",
          })
        );
      }
      return { qrData, error };
    } catch (error) {
      thunkAPI.dispatch(updateQRDataLoading(false));
      thunkAPI.dispatch(
        updateQRDataError({
          isError: true,
          errMsg: "System Error Occured! Please try after sometime.",
        })
      );
      return { error: true };
    }
  }
);

export const paymentInfoSlice = createSlice({
  name: "paymentInfo",
  initialState,
  reducers: {
    updatePayLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateVpaPaymentLoading: (state, action: PayloadAction<boolean>) => {
      state.vpaPaymentLoading = action.payload;
    },
    resetVpaStatus: (state) => {
      state.isValidVpa = "";
    },
    updateDisableAllExceptQr: (state, action: PayloadAction<boolean>) => {
      state.disableAllExceptQr = action.payload;
    },
    updateQRDataLoading: (state, action: PayloadAction<boolean>) => {
      state.qrCodeData.qrDataLoading = action.payload;
    },
    updateQRDataError: (
      state,
      action: PayloadAction<{
        isError: boolean;
        errMsg: string;
      }>
    ) => {
      state.qrCodeData.error.isError = action.payload.isError;
      state.qrCodeData.error.errorMsg = action.payload.errMsg;
    },
    resetPaymentState: () => initialState,
    updateUpiTransactionStatus: (
      state,
      action: PayloadAction<{
        upiTransactionStatus: string;
      }>
    ) => {
      state.upiTransactionStatus = action.payload.upiTransactionStatus;
    },
    updatePayError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.errorMessage = action.payload.errorMessage;
    },
    updateShippingAndDeliveryData: (
      state,
      action: PayloadAction<{
        shippingAddressData: DataType;
        deliveryData: DataType[];
      }>
    ) => {
      state.shippingAddress = action.payload.shippingAddressData;
      state.deliveryOptions = action.payload.deliveryData;
    },
    updateJusPayData: (
      state,
      action: PayloadAction<{
        jusPayInitiated: boolean;
        jusPayData?: DataType | null;
      }>
    ) => {
      state.jusPayInitiated = action.payload.jusPayInitiated;
      state.jusPayData = action.payload.jusPayData;
    },
    updateJusPayStatusData: (
      state,
      action: PayloadAction<{
        jusPaymentStatusLoading: boolean;
        jusPaymentStatusData?: DataType | null;
      }>
    ) => {
      state.jusPaymentStatusLoading = action.payload.jusPaymentStatusLoading;
      state.jusPaymentStatusData = action.payload.jusPaymentStatusData;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPayMethods.fulfilled, (state, action) => {
      state.paymentMethods = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(getSavedCards.fulfilled, (state, action) => {
      state.savedCards = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(getDeliveryOptions.fulfilled, (state, action) => {
      if (action.payload) {
        state.deliveryOptions = action.payload;
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = "";
      }
    });
    builder.addCase(getShippingAddress.fulfilled, (state, action) => {
      state.shippingAddress = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(getOrderPayment.fulfilled, (state, action) => {
      if (action.payload?.isError) {
        state.errorMessage = action.payload.message;
        state.isError = true;
      } else {
        state.paymentDetails = action.payload;
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = "";
      }
    });
    builder.addCase(verifyVpa.fulfilled, (state, action) => {
      state.isValidVpa = action.payload.isValidVpa;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(validateCodOtp.fulfilled, (state, action) => {
      if (action.payload.error.isError) {
        state.validateCodOtpInfo.isError = action.payload.error;
      } else {
        state.validateCodOtpInfo.successData = action.payload.data;
      }
      state.validateCodOtpInfo.isLoading = false;
    });
    builder.addCase(getQRCode.fulfilled, (state, action) => {
      state.qrCodeData.data = action.payload.qrData;
      state.qrCodeData.qrDataLoading = false;
    });
  },
});

export const {
  updatePayLoading,
  updatePayError,
  updateShippingAndDeliveryData,
  updateJusPayData,
  updateJusPayStatusData,
  resetVpaStatus,
  updateVpaPaymentLoading,
  updateUpiTransactionStatus,
  resetPaymentState,
  updateDisableAllExceptQr,
  updateQRDataLoading,
  updateQRDataError,
} = paymentInfoSlice.actions;

export default paymentInfoSlice.reducer;
