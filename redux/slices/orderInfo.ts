import { APIService, RequestBody } from "@lk/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { checkoutFunctions, orderFunctions } from "@lk/core-utils";
import { action } from "@storybook/addon-actions";

export enum PackageItemSortENUM {
  PRICE = "price",
  INDEX = "index",
}

const initialState: any = {
  primaryReasonId: "",
  secondaryReasonId: "",
  completeReturnReasons: [],
  returnResponseResult: "",
  orderDetailInvResult: "",
  eligibilityInfo: "",
  secondaryReasons: "",
  selectedReturnMethod: "",
  cartItems: "",
  returnMethods: null,
  storeList: {
    isLoading: false,
    isError: "",
    storeList: "",
  },
  userAddresses: "",
  currentReturnItem: "",
  shippingAddressData: null,
  cartInfo: null,
  cartInfoWallet: null,
  returnEligibilityDetailsArr: [],
  returnMethod: null,
};

export const userAddress = createAsyncThunk(
  "userAddress",
  async (reqObj: { sessionId: string }, thunkAPI) => {
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      api.setMethod(APIMethods.GET);
      const { data, error } = await checkoutFunctions.fetchAddress(api);
      return {
        data,
      };
    } catch (err) {
      console.log("cartData");
    }
  }
);

export const cartData = createAsyncThunk(
  "cartData",
  async (
    reqObj: {
      sessionId: string;
      exchangeMethod: string;
      itemId: number;
      orderId: number;
    },
    thunkAPI
  ) => {
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.sessionToken = reqObj.sessionId;
      const exchangeHeaders = [
        {
          key: "x-service-type",
          value: "exchange",
        },
        {
          key: "x-customer-type",
          value: "REPEAT",
        },
      ];
      api.setHeaders({ ...headerArr, ...exchangeHeaders });
      api.setMethod(APIMethods.POST);
      const body = new RequestBody<{
        orderId: number;
        itemId: number;
        exchangeMethod: string;
      }>({
        exchangeMethod: reqObj.exchangeMethod,
        itemId: reqObj.itemId,
        orderId: reqObj.orderId,
      });
      const { data, error } = await orderFunctions.cartData(api, body);
      return {
        cartData: data,
        error: error,
      };
    } catch (err) {
      console.log("cartData");
    }
  }
);

export const saveShippingAddress = createAsyncThunk(
  "saveShippingAddress",
  async (
    reqObj: {
      sessionId: string;
      shippingAddress: any;
    },
    thunkAPI
  ) => {
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.sessionToken = reqObj.sessionId;

      api.setHeaders(headerArr);
      api.setMethod(APIMethods.POST);
      const body = new RequestBody<{
        address: any;
      }>({
        address: reqObj.shippingAddress,
      });
      const { data, error } = await orderFunctions.saveShippingAddress(
        api,
        body
      );
      // console.log(data);
      return {
        data,
        error: error,
      };
    } catch (err) {
      console.log("cartData");
    }
  }
);

export const getCartData = createAsyncThunk(
  "getCartData",
  async (
    reqObj: {
      sessionId: string;
    },
    thunkAPI
  ) => {
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      api.setMethod(APIMethods.GET);
      const { data, error } = await orderFunctions.cartData(api);
      return {
        cartData: data,
        error: error,
      };
    } catch (err) {
      console.log("cartData");
    }
  }
);

export const getCartDataWallet = createAsyncThunk(
  "getCartDataWallet",
  async (
    reqObj: {
      sessionId: string;
    },
    thunkAPI
  ) => {
    try {
      // console.log("in");

      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.sessionToken = reqObj.sessionId;
      const exchangeHeaders = [
        {
          key: "x-service-type",
          value: "exchange",
        },
        {
          key: "x-customer-type",
          value: "REPEAT",
        },
        {
          key: "x-country-code",
          value: "in",
        },
      ];
      api.setHeaders({ ...headerArr, ...exchangeHeaders });
      api.setMethod(APIMethods.GET);
      const { data, error } = await orderFunctions.getCartDataWalletFalse(api);
      // console.log(data);

      return {
        cartData: data,
        error: error,
      };
    } catch (err) {
      console.log("cartData");
    }
  }
);

export const returnMethod = createAsyncThunk(
  "returnMethod",
  async (reqObj: { pincode: number; sessionId: string }, thunkAPI) => {
    try {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      // const head = { ...headerArr, "X-Session-Token": reqObj.sessionId };
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      api.setMethod(APIMethods.GET);
      const { data, error } = await orderFunctions.returnMethods(
        reqObj.pincode,
        api
      );
      return {
        data,
      };
    } catch (err) {
      console.log("cartData");
    }
  }
);

export const getNearByStore = createAsyncThunk(
  "getNearByStore",
  async (
    reqObj: {
      address: number | string;
      radius: number;
      pageSize: number;
      pageNumber: number;
      sessionId: string;
    },
    thunkAPI
  ) => {
    try {
      thunkAPI.dispatch(setLoader(true));
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.sessionToken = reqObj.sessionId;
      api.setHeaders(headerArr);
      api.setMethod(APIMethods.GET);
      // console.log("in");

      const { data, error } = await orderFunctions.nearbyStore(
        reqObj.address,
        reqObj.radius,
        reqObj.pageSize,
        reqObj.pageNumber,
        api
      );
      return {
        result: data,
        error: error,
      };
    } catch (err) {
      console.log("error");
    }
  }
);

export const returnResponse = createAsyncThunk(
  "returnResponse",
  async (
    reqObj: {
      classification: string;
      sessionId: string;
    },
    thunkAPI
  ) => {
    const { classification } = reqObj;
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    // const head = { ...headerArr, "X-Session-Token": reqObj.sessionId };
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    const { data: returnData, error } = await orderFunctions.returnReasons(
      classification,
      api
    );
    // console.log(returnResp);
    if (error.isError) {
      //   thunkAPI.dispatch(updatePackageLoading(false));
      //   thunkAPI.dispatch(updatePackageError(true));
    }
    let returnResponse: any[] = [];
    let secondaryResponse: any = {};
    returnData.result.reasons.forEach((reason: any) => {
      returnResponse.push({ key: reason.reason, value: reason.id });
      const _secondaryResponse = reason.secondaryReasons.map(
        (secondary: any) => {
          return { key: secondary.reason, value: secondary.id };
        }
      );
      secondaryResponse[reason.id] = _secondaryResponse;
    });
    return {
      primary: returnResponse,
      secondary: secondaryResponse,
      complete: returnData.result.reasons
    };
  }
);

export const orderDetailInv = createAsyncThunk(
  "orderDetailInv",
  async (
    reqObj: {
      orderId: number;
      sessionId: string;
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    // const head = { ...headerArr, "X-Session-Token": reqObj.sessionId };
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    const { data: orderDetail, error } =
      await orderFunctions.getOrderDetailsInv(reqObj.orderId, api);

    // console.log(orderDetail);
    if (error.isError) {
      //   thunkAPI.dispatch(updatePackageLoading(false));
      //   thunkAPI.dispatch(updatePackageError(true));
    }
    return {
      result: orderDetail.result,
    };
  }
);

export const eligibility = createAsyncThunk(
  "eligibility",
  async (
    reqObj: {
      orderId: number;
      sessionId: string;
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    const { data: orderDetail, error } = await orderFunctions.eligibility(
      reqObj.orderId,
      api
    );

    // console.log(orderDetail);
    if (error.isError) {
      //   thunkAPI.dispatch(updatePackageLoading(false));
      //   thunkAPI.dispatch(updatePackageError(true));
    }
    return {
      result: orderDetail.result,
    };
  }
);

export const getOrderItemsReturnEligibility = createAsyncThunk(
  "getOrderItemsReturnEligibility",
  async (
    reqObj: {
      orderList: any;
      sessionId: string;
      ELIGIBILITY_STATUS_HISTORY: any;
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    const orderList: any = reqObj.orderList;
    const ELIGIBILITY_STATUS_HISTORY: any = reqObj.ELIGIBILITY_STATUS_HISTORY;
    const callEligibilityApiArr: any = [];
    const returnDetails: any = [];
    const returnResponse: any = [];
    const returnReason: any = {};
    if (orderList) {
      for (let i = 0; i < orderList?.length; i++) {
        try {
          /* CHECK CONDITION TO CALL ELIGIBILITY API : ITEM LEVEL */
          const paymentList: any = orderList[i]?.payments?.paymentList;
          const items: any = orderList[i]?.items;
          if (
            paymentList &&
            paymentList.length > 0 &&
            items &&
            items.length > 0
          ) {
            for (let j = 0; j < paymentList.length; j++) {
              for (let k = 0; k < items.length; k++) {
                const statusHistory = items[k]?.statusHistory;
                // console.log(statusHistory, "statusHistory");
                for (let l = 0; l < statusHistory.length; l++) {
                  if (
                    ELIGIBILITY_STATUS_HISTORY &&
                    Object.keys(ELIGIBILITY_STATUS_HISTORY).includes(
                      paymentList[j].method
                    ) &&
                    ELIGIBILITY_STATUS_HISTORY[paymentList[j].method].includes(
                      statusHistory[l].status.toLowerCase()
                    ) &&
                    !callEligibilityApiArr.includes(orderList[i].id)
                  ) {
                    callEligibilityApiArr.push(orderList[i].id);
                    break;
                  } else if (
                    ELIGIBILITY_STATUS_HISTORY &&
                    !Object.keys(ELIGIBILITY_STATUS_HISTORY).includes(
                      paymentList[j].method
                    ) &&
                    ELIGIBILITY_STATUS_HISTORY?.others?.includes(
                      statusHistory[l].status.toLowerCase()
                    )
                  ) {
                    callEligibilityApiArr.push(orderList[i].id);
                    break;
                  }
                }
                if (callEligibilityApiArr.includes(orderList[i].id)) break;
              }
              if (callEligibilityApiArr.includes(orderList[i].id)) break;
            }
          }
          /* END : CHECK CONDITION TO CALL ELIGIBILITY API : ITEM LEVEL */
          /* CALL ELIGIBILITY API only if callEligibilityApi variable is TRUE */
          if (callEligibilityApiArr.includes(orderList[i].id)) {
            const { data: orderDetail, error } =
              await orderFunctions.eligibility(orderList[i].id, api);
            if (!error.isError) {
              returnDetails.push(orderDetail.result);
            }
            //  else {
            //   return error;
            // }
            if (orderDetail && orderDetail.result && orderDetail.result.items) {
              for (let m = 0; m < orderDetail.result.items.length; m++) {
                if (
                  orderDetail.result.items[m].isExchangeable ||
                  orderDetail.result.items[m].isRefundable ||
                  orderDetail.result.items[m].returnable
                ) {
                  if (orderList && orderList[i] && orderList[i].items) {
                    for (let n = 0; n < orderList[i].items.length; n++) {
                      if (
                        orderList[i].items[n].id + "" ===
                          orderDetail.result.items[m].id + "" &&
                        !returnResponse.includes(
                          orderList[i].items[n].classification
                        )
                      ) {
                        returnResponse.push(
                          orderList[i].items[n].classification
                        );
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (er) {
          returnDetails.push(er);
        }
      }
      for (let i = 0; i < returnResponse.length; i++) {
        try {
          const { data: returnData, error } = await orderFunctions.returnReasons(
            returnResponse[i],
            api
          );
          if (!error.isError) {
            returnReason[returnResponse[i]] =
              returnData.result && returnData.result.reasons;
          } else {
            console.log(error);
          }
        } catch (er) {
          returnReason[returnResponse[i]] = er;
        }
      }
      return { returnDetails: returnDetails, returnReason: returnReason };
      // console.log("returnDetails", returnDetails);
      // console.log("returnReason", returnReason);
      // successAction.data = returnDetails;
      // successReturnResponseAction.data = returnReason;
    }
  }
);

export const orderInfoSlice = createSlice({
  name: "orderInfo",
  initialState,
  reducers: {
    setCurrentreturnItem: (state, action: PayloadAction<any>) => {
      state.currentReturnItem = action.payload;
    },
    setLoader: (state, action: PayloadAction<boolean>) => {
      state.storeList.isLoading = action.payload;
      state.storeList.isError = "";
    },
    updateReturnReason: (state, action: PayloadAction<{primaryReasonId?: string | number, secondaryReasonId?: string | number}>) => {
      state.primaryReasonId = action.payload.primaryReasonId;
      state.secondaryReasonId = action.payload.secondaryReasonId;
    },
    updateSelectedReturnReason: (state, action: PayloadAction<number | string>) => {
      state.returnReason = action.payload;
    },
    updateSelectedReturnMethod: (state, action: PayloadAction<string>) => {
      state.selectedReturnMethod = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(returnResponse.fulfilled, (state, action) => {
      state.returnResponseResult = action.payload.primary;
      state.secondaryReasons = action.payload.secondary;
      state.completeReturnReasons = action.payload.complete;
    });
    builder.addCase(orderDetailInv.fulfilled, (state, action) => {
      state.orderDetailInvResult = action.payload.result;
    });
    builder.addCase(eligibility.fulfilled, (state, action) => {
      state.eligibilityInfo = action.payload.result;
    });
    builder.addCase(cartData.fulfilled, (state, action) => {
      state.cartInfo = action.payload?.cartData;
    });
    builder.addCase(cartData.rejected, (state) => {
      state.cartInfo = {};
    });
    builder.addCase(getCartData.fulfilled, (state, action) => {
      state.cartInfo = action.payload?.cartData;
    });
    builder.addCase(getCartDataWallet.fulfilled, (state, action) => {
      state.cartInfoWallet = action.payload?.cartData?.cartData?.result;
    });
    builder.addCase(getCartDataWallet.rejected, (state, action) => {
      state.cartInfoWallet = null;
    });
    builder.addCase(getCartData.rejected, (state) => {
      state.cartInfo = {};
    });
    builder.addCase(returnMethod.fulfilled, (state, action) => {
      state.returnMethods = action.payload?.data?.returnMethods;
    });
    builder.addCase(userAddress.fulfilled, (state, action) => {
      state.userAddresses = action.payload?.data;
    });
    builder.addCase(getNearByStore.fulfilled, (state, action) => {
      if (!action.payload?.error.isError) {
        state.storeList.storeList = action.payload?.result;
      } else {
        state.storeList.storeList = "";
        state.storeList.isError = action.payload.error.message;
      }
      state.storeList.isLoading = false;
    });
    builder.addCase(
      getOrderItemsReturnEligibility.fulfilled,
      (state, action) => {
        const oldData = state.returnEligibilityDetailsArr;
        const newData = action.payload;
        const newReturnReason: { [key: string]: { [name: string]: any }[] } =
          {};
        let newReturnDetails: { [name: string]: any }[] = [];
        let allReturnKeys =
          oldData?.returnReason && typeof oldData?.returnReason === "object"
            ? Object.keys(oldData.returnReason)
            : [];
        allReturnKeys =
          newData?.returnReason && typeof newData?.returnReason === "object"
            ? [...allReturnKeys, ...Object.keys(newData.returnReason)]
            : allReturnKeys;
        allReturnKeys.forEach((key) => {
          let currKeyData: { [name: string]: any }[] = [];
          if (
            oldData?.returnReason?.[key] &&
            Array.isArray(oldData.returnReason[key])
          )
            currKeyData = [...oldData.returnReason[key]];
          if (
            newData?.returnReason?.[key] &&
            Array.isArray(newData.returnReason[key])
          )
            currKeyData = [...currKeyData, ...newData.returnReason[key]];
          newReturnReason[key] = currKeyData;
        });
        if (oldData?.returnDetails && Array.isArray(oldData.returnDetails))
          newReturnDetails = [...oldData.returnDetails];
        if (newData?.returnDetails && Array.isArray(newData.returnDetails))
          newReturnDetails = [...newReturnDetails, ...newData.returnDetails];
        // Object.keys(state.returnEligibilityDetailsArr?.returnReason).map(d => d.push())
        state.returnEligibilityDetailsArr = {
          returnReason: newReturnReason,
          returnDetails: newReturnDetails,
        };
        // state.returnEligibilityDetailsArr = Array.isArray(state?.returnEligibilityDetailsArr?.returnDetails) && Array.isArray(action.payload?.returnDetails) ? {returnDetails : [...state.returnEligibilityDetailsArr?.returnDetails, ...action.payload?.returnDetails], returnReason: action.payload?.returnReason || state.returnEligibilityDetailsArr?.returnReason} :  action.payload;
      }
    );
  },
});

export const { setCurrentreturnItem, setLoader, updateReturnReason, updateSelectedReturnReason, updateSelectedReturnMethod } = orderInfoSlice.actions;

export default orderInfoSlice.reducer;
