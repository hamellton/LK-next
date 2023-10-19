import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { orderFunctions } from "@lk/core-utils";
import { MyOrderType } from "@/types/state/MyOrder";
import { AddressObjectType } from "pageStyles/Checkout.types";
import { createAPIInstance } from "@/helpers/apiHelper";

const initialState: MyOrderType = {
  isLoading: true,
  isError: false,
  errorMessage: "",
  orderListingData: [],
  allOrderListingData: [],
  totalOrderCount: undefined,
  confirmOrderSuccess: {
    isSuccess: false,
    orderId: "",
  },
  fetchOrderListingDataInfo: {
    isError: false,
    errorMessage: "",
  },
  updateShippingAddress: {
    isSuccess: false,
  },
  orderData: {},
  page: 0,
  hasMoreOrders: true,
};

export const fetchOrderListingData = createAsyncThunk(
  "fetchOrderListingData",
  async (
    reqObj: {
      sessionId: string;
      page: number;
      itemsPerPage: number;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateOrderListingLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);

    try {
      const { data, error } = await orderFunctions.getOrderListing(
        api,
        reqObj.page,
        reqObj.itemsPerPage
      );
      // thunkAPI.dispatch(updateOrderListingLoading(false));

      // if (!error.isError) {
      return { data, error };
      // } else {
      // thunkAPI.dispatch(
      //   updateOderListingError({ error: true, errorMessage: error.message })
      // );

      // }
    } catch (err) {
      console.log(err);
    }
  }
);

export const getOrderData = createAsyncThunk(
  "getOrderData",
  async (
    reqObj: {
      sessionId: string;
      orderID: number | string;
      replace?: boolean;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateOrderListingLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    try {
      const { data, error } = await orderFunctions.getOrderData(
        api,
        reqObj.orderID
      );
      if (!error?.isError) {
        thunkAPI.dispatch(updateOrderListingLoading(false));
        return { data: data.result.orders[0], replace: reqObj.replace };
      }
    } catch (err) {
      console.log(err);
    }
  }
);
export const getV2OrderData = createAsyncThunk(
  "getV2OrderData",
  async (
    reqObj: {
      sessionId: string;
      orderID: number | string;
      email?: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateOrderListingLoading(true));
    const api = createAPIInstance({
      sessionToken: reqObj.sessionId
    })
    try {
      const { data, error } = await orderFunctions.getV2OrderData(
        api,
        reqObj.orderID,
        reqObj.email
      );
      if (!error?.isError) {
        return data.result;
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const updateShippingAddress = createAsyncThunk(
  "updateShippingAddress",
  async (
    reqObj: {
      sessionId: string;
      orderID: number | string;
      addressDetail: any;
    },
    thunkAPI
  ) => {
    // thunkAPI.dispatch(updateOrderListingLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.PUT);
    const body = new RequestBody<AddressObjectType>({
      ...reqObj.addressDetail,
    });
    try {
      const { data, error } = await orderFunctions.updateShippingAddress(
        reqObj.orderID,
        api,
        body
      );
      return { data, error };
    } catch (err) {
      console.log(err);
    }
  }
);

export const putConfirmOrder = createAsyncThunk(
  "putConfirmOrder",
  async (
    reqObj: {
      sessionId: string;
      id: number;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateOrderListingLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.PUT);
    try {
      const { data, error } = await orderFunctions.confirmOrders(
        api,
        reqObj.id
      );
      if (!error?.isError) {
        thunkAPI.dispatch(updateOrderListingLoading(false));
        return { data: true, orderID: reqObj.id };
      } else {
        return { data: false, orderID: "" };
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const myOderInfoSlice = createSlice({
  name: "myOrderInfo",
  initialState,
  reducers: {
    updateOrderListingLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateOderListingError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.errorMessage = action.payload.errorMessage;
      state.isError = action.payload.error;
      state.hasMoreOrders = false;
    },
    updateOrderListingData: (state, action: PayloadAction<any>) => {
      state.orderListingData = [...action.payload];
    },
    resetUpdateShippingAddress: (state) => {
      state.updateShippingAddress.isSuccess = false;
    },
    resetConfirmOrder: (state) => {
      state.confirmOrderSuccess = initialState.confirmOrderSuccess;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrderListingData.fulfilled, (state, action) => {
      if (action.payload?.error?.isError) {
        state.fetchOrderListingDataInfo.isError = true;
        state.fetchOrderListingDataInfo.errorMessage =
          "You currently have 0 orders";
      } else {
        const newOrders = action.payload?.data?.result?.orders;
        if (newOrders?.length) {
          state.allOrderListingData = state.allOrderListingData
            ? [...state.allOrderListingData, ...newOrders]
            : newOrders;
          state.orderListingData = newOrders;
          state.totalOrderCount = action.payload?.data?.result?.totalOrder;
          state.page = state.page + 1;
        } else {
          state.hasMoreOrders = false;
        }
        state.fetchOrderListingDataInfo.isError = false;
        state.fetchOrderListingDataInfo.errorMessage = "";
      }
      state.isLoading = false;
    });
    builder.addCase(putConfirmOrder.fulfilled, (state, action) => {
      state.confirmOrderSuccess.isSuccess = action.payload?.data || false;
      state.confirmOrderSuccess.orderId = action.payload?.orderID || "";
    });
    builder.addCase(getOrderData.fulfilled, (state, action) => {
      state.orderData = action.payload?.data;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";

      if (action.payload?.replace) {
        const getIndex = state.allOrderListingData.findIndex(
          (obj) => obj.id === action.payload?.data.id
        );
        state.allOrderListingData = [
          ...state.allOrderListingData.slice(0, getIndex),
          action.payload?.data,
          ...state.allOrderListingData.slice(getIndex + 1),
        ];
      }
    });
    builder.addCase(getV2OrderData.fulfilled, (state, action) => {
      state.orderData = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(updateShippingAddress.fulfilled, (state, action) => {
      if (action.payload?.error?.isError) {
        state.updateShippingAddress.isSuccess = false;
      } else {
        state.updateShippingAddress.isSuccess = true;
      }
    });
  },
});

export const {
  updateOrderListingLoading,
  updateOderListingError,
  updateOrderListingData,
  resetUpdateShippingAddress,
  resetConfirmOrder,
} = myOderInfoSlice.actions;

export default myOderInfoSlice.reducer;
