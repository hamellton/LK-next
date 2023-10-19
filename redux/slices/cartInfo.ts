import { createAPIInstance } from "./../../helpers/apiHelper";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@lk/utils";
import { exchangeHeaders, headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { cartFunctions } from "@lk/core-utils";
import { RequestBody } from "@lk/utils";
import { CartInfoType } from "@/types/state/cartInfoType";
import Router from "next/router";
import { addToCartGA4 } from "helpers/gaFour";
import {
  addToSearchFunnel,
  removeFromSearchFunnel,
} from "@/components/AlgoliaSearch/gaHelper";

const subdirectoryPath =
  process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
    ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
    : "";

const initialState: CartInfoType = {
  cartIsLoading: true,
  cartIsError: false,
  cartPopupError: false,
  cartErrorMessage: "",
  cartStatusCode: 0,
  isGvApplied: false,
  applicableGvs: [],
  taxMessage: "",
  appliedGv: {
    code: "",
    amount: 0,
  },
  appliedSc: [],
  lkCash: {
    applicableAmount: 0,
    isApplicable: false,
    moneySaved: 0,
    totalWalletAmount: 0,
  },
  cartCount: 0,
  cartQty: 0,
  cartTotal: [],
  cartSubTotal: 0,
  cartItems: [],
  currencyCode: "",
  offerDetails: "",
  hasOnlyCLProduct: false,
  couponError: false,
  offerBanner: null,
  hasBogoLimitExceeded: false,
  bogoNotAppliedMessage: "",
  payLaterAllowed: false,
  cartId: 0,
  studioFlow: false,
};

export const fetchCarts = createAsyncThunk(
  "fetchCarts",
  async (
    reqObj: {
      sessionId: string;
      params?: string;
      isExchange?: boolean;
      initial?: boolean;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCartLoading(true));
    try {
      // const api = createAPIInstance({ sessionToken: reqObj.sessionId });
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
      api.setMethod(APIMethods.GET);
      api.sessionToken = reqObj.sessionId;
      const headers = reqObj.isExchange
        ? [...headerArr, ...exchangeHeaders]
        : [
            ...headerArr,
            {
              key: "cache-control",
              value: "no-cache",
            },
          ];
      api.setHeaders(headers);
      const { data, error } = await cartFunctions.fetchCart(
        api,
        reqObj.params || "",
        subdirectoryPath
      );

      thunkAPI.dispatch(updateCartLoading(false));

      return {
        cartData: data,
        error: error,
        initialCall: reqObj.initial,
      };
    } catch (err) {
      return {
        cartData: {
          cartCount: 0,
          cartItems: [],
          cartQty: 0,
          applicableGvs: [],
          offerDetails: "",
          appliedGv: {},
          appliedSc: [],
        },
        error: {
          isError: true,
          message: "ERROR_404",
          status: 404,
        },
      };
    }
  }
);
export const addToCartExchange = createAsyncThunk(
  "addToCartExchange",
  async (
    reqObj: {
      exchangeMethod: string;
      orderId: number;
      itemId: number;
      sessionId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCartLoading(true));
    // const api: APIService = createAPIInstance({
    //   method: APIMethods.POST,
    //   sessionToken: reqObj.sessionId,
    // });
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    // api.setHeaders(headerArr);
    api.setHeaders([...headerArr, ...exchangeHeaders]);
    const body = new RequestBody<{
      exchangeMethod: string;
      orderId: number;
      itemId: number;
    }>({
      exchangeMethod: reqObj.exchangeMethod,
      orderId: reqObj.orderId,
      itemId: reqObj.itemId,
    });

    try {
      const { data, error } = await cartFunctions.addToCartNoPower(api, body);
      thunkAPI.dispatch(updateCartLoading(false));
      if (!error.isError) {
        Router.push(
          `/sales/my/order/exchange/${reqObj.orderId}/${reqObj.itemId}/exchange-details`
        );
      }
      return {
        cartData: data,
        error: error,
      };
    } catch (err: any) {
      return {
        cartData: {},
        error: {
          isError: true,
          message: err?.message || "Failed to add item to cart.",
        },
      };
    }
    // finally {
    //   if (reqObj.orderId && reqObj.itemId)
    //     Router.push(`/sales/my/order/exchange/${reqObj.orderId}/${reqObj.itemId}/exchange-details`);
    // }
  }
);
export const addToCartCLItems = createAsyncThunk(
  "addToCartCLItems",
  async (
    reqObj: {
      sessionId?: string;
      displayPrice?: number;
      isBothEye?: string;
      prescription: {
        imageFileName?: string;
        left?: {
          boxes?: number;
          sph?: string;
        };
        right?: {
          boxes?: number;
          sph?: string;
        };
        powerType?: string;
      };
      productId?: string | number;
      quantity?: number;
      relatedItems?: [
        {
          productId?: string;
          quantity?: number;
        }
      ];
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCartLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj?.sessionId;
    api.setHeaders(headerArr);
    // api.setHeaders([...headerArr, ...exchangeHeaders]);
    const body = new RequestBody<{
      isBothEye: string;
      prescription: any;
      productId: string | number;
      quantity?: number;
      relatedItems?: any;
      displayPrice?: number;
    }>({
      isBothEye: reqObj.isBothEye,
      productId: reqObj.productId,
      quantity: reqObj.quantity,
      relatedItems: reqObj.relatedItems,
      prescription: reqObj.prescription,
      displayPrice: reqObj.displayPrice,
    });

    try {
      const { data, error } = await cartFunctions.addToCartNoPower(api, body);
      thunkAPI.dispatch(updateCartLoading(false));
      // if (!error.isError) {
      //   Router.push(
      //     `/sales/my/order/exchange/${reqObj.orderId}/${reqObj.itemId}/exchange-details`
      //   );
      // }
      if (!error.isError) {
        Router.push("/cart");
      }
      return {
        cartData: data,
        error: error,
      };
    } catch (err: any) {
      return {
        cartData: {},
        error: {
          isError: true,
          message: err?.message || "Failed to add item to cart.",
        },
      };
    } finally {
      // if(!error.isError){
      // Router.push("/cart");
      if (
        typeof window !== "undefined" &&
        window.location.search.includes("search=true")
      )
        addToSearchFunnel(reqObj.productId, "search");
      else addToSearchFunnel(reqObj.productId, "non_search");
      Router.push("/cart");
      // }
    }
    // finally {
    //   if (reqObj.orderId && reqObj.itemId)
    //     Router.push(`/sales/my/order/exchange/${reqObj.orderId}/${reqObj.itemId}/exchange-details`);
    // }
  }
);
export const addToCartNoPower = createAsyncThunk(
  "addToCartNoPower",
  async (
    reqObj: {
      pid?: number;
      sessionId: string;
      powerType?: string;
      orderId?: number;
      itemId?: number;
      tierName?: string;
      quantity?: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCartLoading(true));
    const api: APIService = createAPIInstance({
      method: APIMethods.POST,
      sessionToken: reqObj.sessionId,
    });
    let body;
    if (reqObj.powerType) {
      if (!reqObj.orderId) {
        body = new RequestBody<{ productId: string; powerType: string }>({
          productId: `${reqObj.pid}`,
          powerType: reqObj.powerType,
        });
      } else {
        api.setHeaders([...headerArr, ...exchangeHeaders]);
        body = new RequestBody<{
          productId: string;
          powerType: string;
          orderId?: number;
          itemId?: number;
        }>({
          productId: `${reqObj.pid}`,
          powerType: reqObj.powerType,
          orderId: reqObj.orderId,
          itemId: reqObj.itemId,
        });
      }
    } else if (reqObj.tierName) {
      body = new RequestBody<{ tierName: string }>({
        tierName: `${reqObj.tierName}`,
      });
    } else {
      if (!reqObj.orderId) {
        body = new RequestBody<{ productId: string; quantity?: string }>({
          productId: `${reqObj.pid}`,
          quantity: reqObj?.quantity,
        });
      } else {
        api.setHeaders([...headerArr, ...exchangeHeaders]);
        body = new RequestBody<{
          productId: string;
          powerType: string | undefined;
          orderId?: number;
          itemId?: number;
        }>({
          productId: `${reqObj.pid}`,
          powerType: reqObj.powerType,
          orderId: reqObj.orderId,
          itemId: reqObj.itemId,
        });
      }
    }

    try {
      const { data, error } = await cartFunctions.addToCartNoPower(api, body);
      // thunkAPI.dispatch(updateCartLoading(false));
      if (!error.isError) {
        if (
          typeof window !== "undefined" &&
          window.location.search.includes("search=true")
        )
          addToSearchFunnel(reqObj.pid, "search");
        else addToSearchFunnel(reqObj.pid, "non_search");
        if (reqObj.orderId && reqObj.itemId)
          Router.push(`/order/return/${reqObj.orderId}/${reqObj.itemId}`);
        else Router.push("/cart");
      }
      return {
        cartData: data,
        error: error,
      };
    } catch (err: any) {
      return {
        cartData: {},
        error: {
          isError: true,
          message: err?.message || "Failed to add item to cart.",
        },
      };
    }
    // finally {
    // if (reqObj.orderId && reqObj.itemId)
    //   Router.push(`/order/return/${reqObj.orderId}/${reqObj.itemId}`);
    // }
  }
);
export enum saveToCartENUM {
  cl = "CL",
  glasses = "GLASSES",
}
export const saveToCart = createAsyncThunk(
  "updateCart",
  async (
    reqObj:
      | {
          powerType: string;
          productId: number;
          packageId: string;
          sessionId: string;
          addOns?: string;
          orderId?: number;
          itemId?: number;
        }
      | {
          sessionId: string;
          productId: number;
          quantity: number;
          prescription: {
            dob: string;
            gender: string;
            notes: string;
            userName: string;
            powerType: string;
            left: {
              boxes: string;
              sph: string;
            };
          };
          orderId?: number;
          itemId?: number;
        },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCartLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    let body;
    if (reqObj?.addOns) {
      if (!reqObj.orderId) {
        body = new RequestBody<{
          productId: string | number;
          powerType: string;
          packageId: string;
          addOns: string;
        }>({
          productId: reqObj.productId,
          powerType: reqObj.powerType,
          packageId: reqObj.packageId,
          addOns: reqObj.addOns ? reqObj.addOns : "",
        });
      } else {
        api.resetHeaders();
        api.setHeaders([...headerArr, ...exchangeHeaders]);
        body = new RequestBody<{
          productId: string | number;
          powerType: string;
          packageId: string;
          addOns: string;
          itemId: number | null;
          orderId: number | null;
        }>({
          productId: reqObj.productId,
          powerType: reqObj.powerType,
          packageId: reqObj.packageId,
          addOns: reqObj.addOns ? reqObj.addOns : "",
          itemId: reqObj.itemId || null,
          orderId: reqObj.orderId || null,
        });
      }
    } else {
      if (!reqObj.orderId) {
        body = new RequestBody<{
          productId: number;
          powerType: string;
          packageId: string;
        }>({
          productId: reqObj.productId,
          powerType: reqObj.powerType,
          packageId: reqObj.packageId,
        });
      } else {
        api.resetHeaders();
        api.setHeaders([...headerArr, ...exchangeHeaders]);
        body = new RequestBody<{
          productId: number;
          powerType: string;
          packageId: string;
          itemId: number | null;
          orderId: number | null;
        }>({
          productId: reqObj.productId,
          powerType: reqObj.powerType,
          packageId: reqObj.packageId,
          itemId: reqObj.itemId || null,
          orderId: reqObj.orderId || null,
        });
      }
    }
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    try {
      const { data: cartData, error } = await cartFunctions.addToCartNoPower(
        api,
        body
      );
      if (!error.isError) {
        if (
          typeof window !== "undefined" &&
          window.location.search.includes("search=true")
        )
          addToSearchFunnel(reqObj.productId, "search");
        else addToSearchFunnel(reqObj.productId, "non_search");
        if (reqObj.orderId && reqObj.itemId)
          Router.push(`/order/return/${reqObj.orderId}/${reqObj.itemId}`);
        else Router.push("/cart");
      }
      return {
        cartData: cartData,
        error: error,
      };
    } catch (err: any) {
      return {
        cartData: {},
        error: {
          isError: true,
          message: err?.message || "Failed to add item to cart.",
        },
      };
    }
    // finally {
    // if (reqObj.orderId && reqObj.itemId)
    //   Router.push(`/order/return/${reqObj.orderId}/${reqObj.itemId}`);
    // }
  }
);
export interface prescriptionType {
  dob?: string;
  gender?: string;
  notes?: string;
  userName?: string;
  powerType?: string;
  left?: { [name: string]: string };
  right?: { [name: string]: string };
}
interface cartDataType {
  productId: number;
  quantity: string;
  prescription: prescriptionType;
}
interface validationDataType {
  powerOptionList: {
    type: string;
    value: string;
    price: number;
  }[];
}
export interface reqSaveToCLObjType {
  [x: string]: any;
  sessionId: string;
  pid: number | null;
  cartData: cartDataType;
  validationData: validationDataType;
}
export const saveToCartCL = createAsyncThunk(
  "updateCartCL",
  async (reqObj: reqSaveToCLObjType, thunkAPI) => {
    thunkAPI.dispatch(updateCartLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    const body = new RequestBody<cartDataType>(reqObj.cartData);
    let validationBody;
    if (reqObj.pid) {
      validationBody = new RequestBody<validationDataType>(
        reqObj.validationData
      );
    } else {
      validationBody = new RequestBody<cartDataType>(reqObj.cartData);
    }
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    try {
      const { data: cartData, error } =
        await cartFunctions.addToCartCLWithValidate(
          api,
          body,
          validationBody,
          reqObj.pid
        );
      thunkAPI.dispatch(updateCartLoading(false));
      if (!error.isError) {
        if (
          typeof window !== "undefined" &&
          window.location.search.includes("search=true")
        )
          addToSearchFunnel(reqObj.pid, "search");
        else addToSearchFunnel(reqObj.pid, "non_search");
      }
      !error.isError && Router.push("/cart");
      return {
        cartData: cartData,
        error: error,
      };
    } catch (err: any) {
      return {
        cartData: {},
        error: {
          isError: true,
          message: err?.message || "Failed to add item to cart.",
        },
      };
    }
  }
);

export const updateCartItems = createAsyncThunk(
  "updateCartItems",
  async (
    reqObj: {
      itemId: number;
      count?: number;
      flag: string;
      sessionId: string;
      isLogin: boolean;
      prevCartData?: any;
      productId?: any;
      pageInfo: any;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCartLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    if (reqObj.flag === "increase") {
      api.setMethod(APIMethods.PUT);
    } else if (reqObj.flag === "decrease") {
      api.setMethod(APIMethods.DELETE);
    } else {
      api.setMethod(APIMethods.DELETE);
    }
    const body = new RequestBody<{
      itemId: number;
      count?: number;
    }>({
      itemId: reqObj.itemId,
      ...(reqObj?.count && { count: reqObj.count }),
    });
    try {
      const { data: cartData, error } = await cartFunctions.updateCartItem(
        api,
        body,
        subdirectoryPath
      );
      if (!error.isError) {
        const {
          cartItems,
          cartTotal,
          cartSubTotal,
          applicableGvs,
          cartQty,
          cartCount,
          offerDetails,
          appliedGv,
          appliedSc,
          currencyCode,
          taxMessage,
          offerBanner,
          couponError,
          hasOnlyCLProduct,
          lkCash,
          hasBogoLimitExceeded,
          bogoNotAppliedMessage,
          cartItemsCount,
          cartItemsQty,
          payLaterAllowed,
          cartId,
          studioFlow,
        } = cartData;

        thunkAPI.dispatch(
          updateCartData({
            cartItems,
            cartTotal,
            cartSubTotal,
            applicableGvs,
            cartQty,
            cartCount,
            offerDetails,
            appliedGv,
            appliedSc,
            currencyCode,
            offerBanner,
            taxMessage,
            couponError,
            hasOnlyCLProduct,
            lkCash,
            hasBogoLimitExceeded,
            bogoNotAppliedMessage,
            payLaterAllowed,
            cartId,
            studioFlow,
          })
        );
        if (reqObj.flag === "increase" && reqObj?.prevCartData) {
          addToCartGA4(
            cartItems,
            reqObj?.prevCartData,
            reqObj?.isLogin,
            reqObj?.pageInfo
          );
        }
        if (reqObj.flag == "decrease") {
          removeFromSearchFunnel(reqObj.productId);
        }
        return {
          data: {
            cartItems,
            cartTotal,
            cartSubTotal,
            applicableGvs,
            cartQty,
            cartCount,
            offerDetails,
            appliedGv,
            appliedSc,
            currencyCode,
            offerBanner,
            taxMessage,
            couponError,
            hasOnlyCLProduct,
            lkCash,
            hasBogoLimitExceeded,
            bogoNotAppliedMessage,
            cartItemsCount,
            cartItemsQty,
            payLaterAllowed,
            cartId,
            studioFlow,
          },
          error: error,
        };
      } else {
        thunkAPI.dispatch(
          updateCartPopupError({ error: true, errorMessage: error.message })
        );
        return { error: error, data: {} };
      }
    } catch (err) {
      return {
        data: {},
        error: { isError: true, message: "Error in updating card" },
      };
    } finally {
      thunkAPI.dispatch(updateCartLoading(false));
    }
  }
);

export const deleteCartItems = createAsyncThunk(
  "deleteCartItems",
  async (
    reqObj: {
      itemId: number;
      flag: string;
      sessionId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCartLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    if (reqObj.flag === "increase") {
      api.setMethod(APIMethods.PUT);
    } else if (reqObj.flag === "decrease") {
      api.setMethod(APIMethods.DELETE);
    } else {
      api.setMethod(APIMethods.DELETE);
    }
    const body = new RequestBody<{
      itemId: number;
    }>({
      itemId: reqObj.itemId,
    });
    try {
      const { data: cartData, error } = await cartFunctions.deleteCartItem(
        api,
        body,
        subdirectoryPath
      );
      if (!error.isError) {
        const {
          cartItems,
          cartTotal,
          cartSubTotal,
          applicableGvs,
          cartQty,
          cartCount,
          offerDetails,
          appliedGv,
          appliedSc,
          taxMessage,
          offerBanner,
          currencyCode,
          couponError,
          hasOnlyCLProduct,
          lkCash,
          hasBogoLimitExceeded,
          bogoNotAppliedMessage,
          cartItemsCount,
          cartItemsQty,
          payLaterAllowed,
          cartId,
          studioFlow,
        } = cartData;
        thunkAPI.dispatch(
          updateCartData({
            cartItems,
            cartTotal,
            cartSubTotal,
            applicableGvs,
            cartQty,
            cartCount,
            offerDetails,
            appliedGv,
            appliedSc,
            offerBanner,
            currencyCode,
            taxMessage,
            couponError,
            hasOnlyCLProduct,
            lkCash,
            hasBogoLimitExceeded,
            bogoNotAppliedMessage,
            payLaterAllowed,
            cartId,
            studioFlow,
          })
        );
        return {
          data: {
            cartItems,
            cartTotal,
            cartSubTotal,
            applicableGvs,
            cartQty,
            cartCount,
            offerDetails,
            appliedGv,
            appliedSc,
            offerBanner,
            currencyCode,
            couponError,
            hasOnlyCLProduct,
            taxMessage,
            lkCash,
            hasBogoLimitExceeded,
            bogoNotAppliedMessage,
            cartItemsCount,
            cartItemsQty,
            payLaterAllowed,
            cartId,
            studioFlow,
          },
          error: error,
        };
      } else {
        thunkAPI.dispatch(
          updateCartPopupError({ error: true, errorMessage: error.message })
        );
        return { error: error, data: {} };
      }
    } catch (err) {
      return {
        error: { isError: true, message: "Error in deleting cart items" },
        data: {},
      };
    } finally {
      thunkAPI.dispatch(updateCartLoading(false));
    }
  }
);

export const applyRemoveGv = createAsyncThunk(
  "applyRemoveGV",
  async (
    reqObj: {
      code: string;
      flag: string;
      sessionId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCartLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    if (reqObj.flag === "apply") {
      api.setMethod(APIMethods.POST);
    } else if (reqObj.flag === "remove") {
      api.setMethod(APIMethods.DELETE);
    }
    const body = new RequestBody<{
      code: string;
    }>({
      code: reqObj.code,
    });
    try {
      const { data: cartData, error } = await cartFunctions.applyGV(api, body);
      if (!error.isError) {
        return { cartData, error };
      } else {
        thunkAPI.dispatch(updateCouponError({ error: true }));
        return {
          error: error,
          cartData: {},
        };
      }
    } catch (err) {
      return {
        error: { isError: true, message: "Failed to update gv" },
        cartData: {},
      };
    } finally {
      thunkAPI.dispatch(updateCartLoading(false));
    }
  }
);

export const cartInfoSlice = createSlice({
  name: "cartInfo",
  initialState,
  reducers: {
    updateCartData: (state, action: PayloadAction<CartInfoType>) => {
      const {
        cartItemsCount,
        cartItemsQty,
        cartItems,
        cartTotal,
        cartSubTotal,
        cartQty,
        cartCount,
        currencyCode,
        offerDetails,
        appliedGv,
        appliedSc,
        offerBanner,
        taxMessage,
        hasOnlyCLProduct,
        hasBogoLimitExceeded,
        bogoNotAppliedMessage,
        cartId,
        payLaterAllowed,
        studioFlow,
      } = action.payload;
      if (appliedGv?.code && appliedGv?.amount) {
        state.isGvApplied = true;
        state.appliedGv = {
          code: appliedGv?.code || "",
          amount: appliedGv.amount || 0,
        };
      }
      if (appliedSc && Array.isArray(appliedSc)) state.appliedSc = appliedSc;
      state.cartItems = cartItems;
      state.offerBanner = offerBanner;
      state.hasOnlyCLProduct = hasOnlyCLProduct;
      state.hasBogoLimitExceeded = hasBogoLimitExceeded;
      state.bogoNotAppliedMessage = bogoNotAppliedMessage;
      state.cartCount = cartItemsCount || cartCount;
      state.cartQty = cartItemsQty || cartQty;
      state.cartTotal = cartTotal;
      state.cartSubTotal = cartSubTotal;
      state.taxMessage = taxMessage;
      state.currencyCode = currencyCode;
      state.applicableGvs = action?.payload?.applicableGvs;
      state.offerDetails = offerDetails;
      state.isLoading = false;
      state.isError = false;
      state.cartId = cartId;
      state.errorMessage = "";
      state.payLaterAllowed = payLaterAllowed;
      state.studioFlow = studioFlow;
    },
    resetCartData: (state, action: PayloadAction<undefined>) => {
      state.cartIsLoading = true;
      state.cartIsError = false;
      state.cartPopupError = false;
      state.cartErrorMessage = "";
      state.cartStatusCode = 0;
      state.isGvApplied = false;
      state.applicableGvs = [];
      (state.appliedGv = {
        code: "",
        amount: 0,
      }),
        (state.appliedSc = []);
      state.lkCash = {
        applicableAmount: 0,
        isApplicable: false,
        moneySaved: 0,
        totalWalletAmount: 0,
      };
      state.cartCount = 0;
      state.cartQty = 0;
      state.cartTotal = [];
      state.cartSubTotal = 0;
      state.cartItems = [];
      state.taxMessage = "";
      state.offerBanner = null;
      state.hasOnlyCLProduct = false;
      state.hasBogoLimitExceeded = false;
      state.bogoNotAppliedMessage = "";
      state.offerDetails = "";
      state.couponError = false;
      state.payLaterAllowed = false;
      state.cartId = "";
      state.studioFlow = false;
    },
    updateCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
    updateCartLoading: (state, action: PayloadAction<boolean>) => {
      state.cartIsLoading = action.payload;
    },
    updateCartError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.cartIsError = action.payload.error;
      state.cartErrorMessage = action.payload.errorMessage;
    },
    updateCartPopupError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.cartIsLoading = false;
      state.cartPopupError = action.payload.error;
      state.cartErrorMessage = action.payload.errorMessage;
    },
    updateCouponError: (state, action: PayloadAction<{ error: boolean }>) => {
      state.couponError = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCartItems.fulfilled, (state, action) => {
      const { error, data } = action.payload;
      if (error.isError) {
        state.cartIsLoading = false;
        // state.cartIsError = true;
        // state.cartPopupError = true;
        // state.cartErrorMessage = error.message;
      } else {
        const {
          cartItemsCount,
          cartItemsQty,
          cartItems,
          cartTotal,
          cartSubTotal,
          cartQty,
          cartCount,
          offerDetails,
          appliedGv,
          appliedSc,
          offerBanner,
          taxMessage,
          hasOnlyCLProduct,
          hasBogoLimitExceeded,
          bogoNotAppliedMessage,
          applicableGvs,
          payLaterAllowed,
          cartId,
          studioFlow,
        } = data;
        if (appliedGv?.code && appliedGv?.amount) {
          state.isGvApplied = true;
          state.appliedGv = {
            code: appliedGv?.code || "",
            amount: appliedGv.amount || 0,
          };
        }
        if (appliedSc && Array.isArray(appliedSc)) state.appliedSc = appliedSc;
        state.cartItems = cartItems;
        state.offerBanner = offerBanner;
        state.hasOnlyCLProduct = hasOnlyCLProduct;
        state.hasBogoLimitExceeded = hasBogoLimitExceeded;
        state.bogoNotAppliedMessage = bogoNotAppliedMessage;
        state.cartCount = cartItemsCount || cartCount;
        state.cartQty = cartItemsQty || cartQty;
        state.cartTotal = cartTotal;
        state.cartSubTotal = cartSubTotal;
        state.applicableGvs = applicableGvs;
        state.offerDetails = offerDetails;
        state.taxMessage = taxMessage;
        state.isLoading = false;
        state.cartIsLoading = false;
        state.isError = false;
        state.errorMessage = "";
        state.payLaterAllowed = payLaterAllowed;
        state.cartId = cartId;
        state.studioFlow = studioFlow;
      }
    }),
      builder.addCase(updateCartItems.rejected, (state) => {
        state.cartIsLoading = false;
      }),
      builder.addCase(deleteCartItems.rejected, (state, action) => {
        // console.log(action.payload, "rejected");
        state.cartIsLoading = false;
      }),
      builder.addCase(deleteCartItems.fulfilled, (state, action) => {
        const { error, data } = action.payload;
        if (error.isError) {
          state.cartIsLoading = false;
          // state.cartIsError = true;
          // state.cartPopupError = true;
          // state.cartErrorMessage = error.message;
        } else {
          const {
            cartItemsCount,
            cartItemsQty,
            cartItems,
            cartTotal,
            cartSubTotal,
            cartQty,
            cartCount,
            offerDetails,
            appliedGv,
            appliedSc,
            offerBanner,
            hasOnlyCLProduct,
            taxMessage,
            hasBogoLimitExceeded,
            bogoNotAppliedMessage,
            applicableGvs,
            cartId,
            studioFlow,
          } = data;
          if (appliedGv?.code && appliedGv?.amount) {
            state.isGvApplied = true;
            state.appliedGv = {
              code: appliedGv?.code || "",
              amount: appliedGv.amount || 0,
            };
          }
          if (appliedSc && Array.isArray(appliedSc))
            state.appliedSc = appliedSc;
          state.cartItems = cartItems;
          state.offerBanner = offerBanner;
          state.hasOnlyCLProduct = hasOnlyCLProduct;
          state.hasBogoLimitExceeded = hasBogoLimitExceeded;
          state.bogoNotAppliedMessage = bogoNotAppliedMessage;
          state.cartCount = cartItemsCount || cartCount;
          state.cartQty = cartItemsQty || cartQty;
          state.cartTotal = cartTotal;
          state.cartSubTotal = cartSubTotal;
          state.applicableGvs = applicableGvs;
          state.offerDetails = offerDetails;
          state.taxMessage = taxMessage;
          state.isLoading = false;
          state.cartIsLoading = false;
          state.isError = false;
          state.errorMessage = "";
          state.cartId = cartId;
          state.studioFlow = studioFlow;
        }
      }),
      builder.addCase(addToCartNoPower.rejected, (state, action) => {
        state.cartIsLoading = false;
        // state.cartIsError = true;
        state.cartPopupError = true;
        state.cartErrorMessage = "Failed to add the item into cart.";
      }),
      builder.addCase(addToCartNoPower.fulfilled, (state, action) => {
        const { cartData, error } = action.payload;
        if (error.isError) {
          state.cartIsLoading = false;
          // state.cartIsError = true;
          state.cartPopupError = true;
          state.cartErrorMessage = error.message;
        } else {
          if (cartData?.appliedGv?.code && cartData?.appliedGv?.amount) {
            state.isGvApplied = true;
            state.appliedGv = {
              code: cartData?.appliedGv?.code || "",
              amount: cartData?.appliedGv.amount || 0,
            };
          }
          if (cartData?.appliedSc && typeof cartData?.appliedSc === "object")
            state.appliedSc = cartData?.appliedSc;
          state.cartCount = cartData?.cartCount;
          state.cartItems = cartData?.cartItems;
          state.offerBanner = cartData?.offerBanner;
          state.taxMessage = cartData?.taxMessage;
          state.hasOnlyCLProduct = cartData?.hasOnlyCLProduct;
          state.hasBogoLimitExceeded = cartData?.hasBogoLimitExceeded;
          state.bogoNotAppliedMessage = cartData?.bogoNotAppliedMessage;
          state.cartQty = cartData?.cartQty;
          state.applicableGvs = cartData?.applicableGvs;
          state.cartIsLoading = false;
          state.cartIsError = false;
          state.cartPopupError = false;
          state.cartErrorMessage = "";
          state.payLaterAllowed = cartData?.payLaterAllowed;
          state.offerDetails = cartData?.offerDetails;
          state.cartId = cartData?.cartId;
          state.studioFlow = cartData?.studioFlow;
        }
      }),
      builder.addCase(addToCartCLItems.fulfilled, (state, action) => {
        const { cartData, error } = action.payload;
        if (error.isError) {
          state.cartIsLoading = false;
          state.cartIsError = true;
          // state.cartPopupError = true;
          state.cartErrorMessage = error.message;
        } else {
          state.cartIsLoading = false;
          state.cartIsError = false;
          // state.cartPopupError = true;
          state.cartErrorMessage = "";
        }
      }),
      builder.addCase(saveToCart.fulfilled, (state, action) => {
        const { cartData, error } = action.payload;
        if (error.isError) {
          state.cartIsLoading = false;
          // state.cartIsError = true;
          state.cartPopupError = true;
          state.cartErrorMessage = error.message;
        } else {
          if (cartData?.appliedGv?.code && cartData?.appliedGv?.amount) {
            state.isGvApplied = true;
            state.appliedGv = {
              code: cartData?.appliedGv?.code || "",
              amount: cartData?.appliedGv.amount || 0,
            };
          }
          if (cartData?.appliedSc && typeof cartData?.appliedSc === "object")
            state.appliedSc = cartData?.appliedSc;
          state.cartCount = cartData?.cartCount;
          state.cartItems = cartData?.cartItems;
          state.offerBanner = cartData?.offerBanner;
          state.taxMessage = cartData?.taxMessage;
          state.hasOnlyCLProduct = cartData?.hasOnlyCLProduct;
          state.hasBogoLimitExceeded = cartData?.hasBogoLimitExceeded;
          state.bogoNotAppliedMessage = cartData?.bogoNotAppliedMessage;
          state.cartQty = cartData?.cartQty;
          state.applicableGvs = cartData?.applicableGvs;
          state.cartIsLoading = false;
          state.cartIsError = false;
          state.cartPopupError = false;
          state.cartErrorMessage = "";
          state.cartId = cartData?.cartId;
          state.studioFlow = cartData?.studioFlow;
        }
      }),
      builder.addCase(saveToCartCL.fulfilled, (state, action) => {
        const { cartData, error } = action.payload;
        if (error.isError) {
          state.cartIsLoading = false;
          // state.cartIsError = true;
          state.cartPopupError = true;
          state.cartErrorMessage = error.message;
        } else {
          if (cartData?.appliedGv?.code && cartData?.appliedGv?.amount) {
            state.isGvApplied = true;
            state.appliedGv = {
              code: cartData?.appliedGv?.code || "",
              amount: cartData?.appliedGv.amount || 0,
            };
          }
          if (cartData?.appliedSc && typeof cartData?.appliedSc === "object")
            state.appliedSc = cartData?.appliedSc;
          state.cartCount = cartData?.cartCount;
          state.cartItems = cartData?.cartItems;
          state.offerBanner = cartData?.offerBanner;
          state.taxMessage = cartData?.taxMessage;
          state.hasOnlyCLProduct = cartData?.hasOnlyCLProduct;
          state.hasBogoLimitExceeded = cartData?.hasBogoLimitExceeded;
          state.bogoNotAppliedMessage = cartData?.bogoNotAppliedMessage;
          state.cartQty = cartData?.cartQty;
          state.applicableGvs = cartData?.applicableGvs;
          state.cartIsLoading = false;
          state.cartIsError = false;
          state.cartPopupError = false;
          state.cartErrorMessage = "";
          state.cartId = cartData?.cartId;
          state.studioFlow = cartData?.studioFlow;
        }
      }),
      builder.addCase(saveToCart.rejected, (state, action) => {
        state.cartIsLoading = false;
        // state.cartIsError = true;
        state.cartPopupError = true;
        state.cartErrorMessage = "Failed to add the item into cart.";
      }),
      builder.addCase(saveToCartCL.rejected, (state, action) => {
        state.cartIsLoading = false;
        // state.cartIsError = true;
        state.cartPopupError = true;
        state.cartErrorMessage = "Failed to add the item into cart.";
      }),
      builder.addCase(fetchCarts.rejected, (state, action) => {
        state.cartItems = [];
        state.offerBanner = null;
        state.hasOnlyCLProduct = false;
        state.hasBogoLimitExceeded = false;
        state.bogoNotAppliedMessage = "";
        state.cartCount = 0;
        state.cartQty = 0;
        state.cartTotal = {
          currencyCode: "",
          discounts: [],
          totalDiscount: 0,
          taxes: [],
          totalTax: 0,
          shipping: 0,
          subTotal: 0,
          total: 0,
        };
        state.cartSubTotal = 0;
        state.applicableGvs = [];
        state.cartIsLoading = false;
        state.cartIsError = true;
        state.taxMessage = "";
        state.cartErrorMessage = "ERROR_404";
        state.cartStatusCode = 1;
        state.payLaterAllowed = false;
        state.cartId = "";
        state.studioFlow = false;
      });
    builder.addCase(fetchCarts.fulfilled, (state, action) => {
      const { cartData, error, initialCall } = action.payload;

      if (error.isError) {
        state.cartIsLoading = false;
        state.cartIsError = initialCall ? false : true;
        state.cartStatusCode = error.status;
        state.cartErrorMessage = initialCall ? "" : error.message;
        state.cartItems = [];
        state.offerBanner = null;
        state.hasOnlyCLProduct = false;
        state.hasBogoLimitExceeded = false;
        state.bogoNotAppliedMessage = "";
        state.cartCount = 0;
        state.cartQty = 0;
        state.cartTotal = {
          currencyCode: "",
          discounts: [],
          totalDiscount: 0,
          taxes: [],
          totalTax: 0,
          shipping: 0,
          subTotal: 0,
          total: 0,
        };
        state.cartSubTotal = 0;
        state.applicableGvs = [];
        state.cartIsLoading = false;
        state.cartIsError = initialCall ? false : true;
        state.taxMessage = "";
        state.cartErrorMessage = initialCall ? "" : "ERROR_404";
        state.cartStatusCode = 1;
        state.payLaterAllowed = false;
        state.cartId = "";
        state.studioFlow = false;
      } else {
        if (cartData?.appliedGv?.code && cartData?.appliedGv?.amount) {
          state.isGvApplied = true;
          state.appliedGv = {
            code: cartData?.appliedGv?.code || "",
            amount: cartData?.appliedGv.amount || 0,
          };
        }
        if (!cartData?.appliedGv?.code) {
          state.isGvApplied = false;
          state.appliedGv = { code: "", amount: 0 };
        }
        if (cartData?.appliedSc && typeof cartData?.appliedSc === "object")
          state.appliedSc = cartData?.appliedSc;
        // if(cartData?.lkCash.applicableAmount) state.lkCash.applicableAmount = cartData?.lkCash.applicableAmount;
        // if(cartData?.lkCash.isApplicable) state.lkCash.isApplicable = cartData?.lkCash.isApplicable;
        // if(cartData?.lkCash.moneySaved) state.lkCash.moneySaved = cartData?.lkCash.moneySaved;
        // if(cartData?.lkCash.totalWalletAmount) state.lkCash.totalWalletAmount = cartData?.lkCash.totalWalletAmount;
        state.lkCash.applicableAmount = cartData?.lkCash.applicableAmount;
        state.lkCash.isApplicable = cartData?.lkCash.isApplicable;
        state.lkCash.moneySaved = cartData?.lkCash.moneySaved;
        state.lkCash.totalWalletAmount = cartData?.lkCash.totalWalletAmount;
        state.cartItems = cartData?.cartItems;
        state.offerBanner = cartData?.offerBanner;
        state.hasOnlyCLProduct = cartData?.hasOnlyCLProduct;
        state.hasBogoLimitExceeded = cartData?.hasBogoLimitExceeded;
        state.bogoNotAppliedMessage = cartData?.bogoNotAppliedMessage;
        state.cartCount = cartData?.cartCount;
        state.cartQty = cartData?.cartQty;
        state.cartTotal = cartData?.cartTotal;
        state.cartSubTotal = cartData?.cartSubTotal;
        state.currencyCode = cartData?.currencyCode;
        state.taxMessage = cartData?.taxMessage;
        state.applicableGvs = cartData?.applicableGvs;
        state.offerDetails = cartData?.offerDetails;
        state.cartIsLoading = false;
        state.cartIsError = false;
        state.cartPopupError = false;
        state.cartErrorMessage = "";
        state.cartStatusCode = 0;
        state.payLaterAllowed = cartData?.payLaterAllowed;
        state.cartId = cartData?.cartId;
        state.studioFlow = cartData?.studioFlow;
      }
    });
    builder.addCase(applyRemoveGv.fulfilled, (state, action) => {
      const cartData = action.payload?.cartData;
      const error = action.payload?.error;

      // const { cartData, error } = action.payload;
      if (!error?.isError && cartData) {
        if (cartData?.appliedGv?.code && cartData?.appliedGv?.amount) {
          state.isGvApplied = true;
          state.appliedGv = {
            code: cartData?.appliedGv?.code || "",
            amount: cartData?.appliedGv.amount || 0,
          };
        } else {
          state.isGvApplied = false;
          state.appliedGv = {
            code: "",
            amount: 0,
          };
        }
        state.cartIsLoading = false;
        state.cartIsError = false;
        state.cartPopupError = false;
        state.cartErrorMessage = "";
        // const {
        // cartItemsCount,
        // cartItemsQty,
        // cartItems,
        // cartTotal,
        // cartQty,
        // cartCount,
        // offerDetails,
        // } = action.payload;
        state.lkCash.applicableAmount = cartData?.lkCash.applicableAmount;
        state.lkCash.isApplicable = cartData?.lkCash.isApplicable;
        state.lkCash.moneySaved = cartData?.lkCash.moneySaved;
        state.lkCash.totalWalletAmount = cartData?.lkCash.totalWalletAmount;
        state.cartItems = cartData?.cartItems;
        state.offerBanner = cartData?.offerBanner;
        state.taxMessage = cartData?.taxMessage;
        state.hasOnlyCLProduct = !!cartData?.hasOnlyCLProduct;
        state.hasBogoLimitExceeded = !!cartData?.hasBogoLimitExceeded;
        state.bogoNotAppliedMessage = cartData?.bogoNotAppliedMessage || "";
        state.cartCount = cartData?.cartItemsCount || cartData?.cartCount;
        state.cartQty = cartData?.cartItemsQty || cartData?.cartQty;
        state.cartTotal = cartData?.cartTotal;
        state.cartSubTotal = cartData?.cartSubTotal;
        state.applicableGvs = cartData?.applicableGvs;
        state.offerDetails = cartData?.offerDetails;
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = "";
        state.payLaterAllowed = cartData?.payLaterAllowed;
        state.cartId = cartData?.cartId;
        state.studioFlow = cartData?.studioFlow;
      }
    });
  },
});

export const {
  updateCartData,
  updateCartLoading,
  updateCartCount,
  updateCartError,
  updateCouponError,
  resetCartData,
  updateCartPopupError,
} = cartInfoSlice.actions;

export default cartInfoSlice.reducer;
