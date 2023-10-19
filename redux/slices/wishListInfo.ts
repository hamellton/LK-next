import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { wishlistFunctions } from "@lk/core-utils";
import { RequestBody } from "@lk/utils";
import { WishlistInfoType } from "@/types/state/wishlistInfoType";

const initialState: WishlistInfoType = {
  isLoading: false,
  isError: false,
  errorMessage: "",
  numberOfProducts: 0,
  productIds: [],
  productList: [],
  showWishList: false,
  isRemoved: false,
  calledUrl: "",
};

export const deleteAllWishlist = createAsyncThunk(
  "deleteAllWishlist",
  async (reqObj: { sessionId: string; subdirectoryPath: string }, thunkAPI) => {
    thunkAPI.dispatch(updateWishListLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.DELETE);
    try {
      const { data: wishListData, error } =
        await wishlistFunctions.deleteWishlist(api);
      thunkAPI.dispatch(updateWishListLoading(false));
      if (!error.isError) {
        thunkAPI.dispatch(
          fetchWishlist({
            sessionId: reqObj.sessionId,
            subdirectoryPath: reqObj.subdirectoryPath,
          })
        );
        return wishListData;
      } else {
        thunkAPI.dispatch(
          updateWishListError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const deleteOneWishlist = createAsyncThunk(
  "deleteOneWishlist",
  async (
    reqObj: { sessionId: string; productId: number; subdirectoryPath: string },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateWishListLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.DELETE);
    const body = new RequestBody<{
      productId: number;
    }>({
      productId: reqObj.productId,
    });
    try {
      const { data: wishListData, error } =
        await wishlistFunctions.deleteSingleWishlist(api, body);
      thunkAPI.dispatch(updateWishListLoading(false));
      if (!error.isError) {
        thunkAPI.dispatch(
          fetchWishlist({
            sessionId: reqObj.sessionId,
            subdirectoryPath: reqObj.subdirectoryPath,
          })
        );
      } else {
        thunkAPI.dispatch(
          updateWishListError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  "getWishlist",
  async (reqObj: { sessionId: string; subdirectoryPath: string }, thunkAPI) => {
    thunkAPI.dispatch(updateWishListLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    try {
      const { data: wishListData, error } = await wishlistFunctions.getWishlist(
        api,
        reqObj.subdirectoryPath
      );
      thunkAPI.dispatch(updateWishListLoading(false));
      // console.log("wishlistData redux", { wishListData, error });
      if (!error.isError) {
        // thunkAPI.dispatch(setWishListShow(true))
        return wishListData;
      } else {
        thunkAPI.dispatch(
          updateWishListError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const saveToWishlist = createAsyncThunk(
  "saveWishlist",
  async (
    reqObj: {
      productId: number;
      sessionId: string;
      subdirectoryPath: string;
      url: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateWishListLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    const body = new RequestBody<{
      productId: number;
    }>({
      productId: reqObj.productId,
    });
    api.setMethod(APIMethods.POST);
    const { data: wishListData, error } = await wishlistFunctions.addToWishlist(
      api,
      body
    );
    if (!error.isError) {
      thunkAPI.dispatch(updateWishListLoading(false));
      thunkAPI.dispatch(
        fetchWishlist({
          sessionId: reqObj.sessionId,
          subdirectoryPath: reqObj.subdirectoryPath,
        })
      );
      thunkAPI.dispatch(
        updateWishListError({ error: false, errorMessage: "" })
      );
      thunkAPI.dispatch(
        setWishListShow({ show: true, url: reqObj.url, isRemoved: false })
      );
      return wishListData;
    } else {
      thunkAPI.dispatch(
        updateWishListError({ error: true, errorMessage: error.message })
      );
    }
  }
);

export const wishListInfoSlice = createSlice({
  name: "wishListInfo",
  initialState,
  reducers: {
    resetWishList: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
      state.numberOfProducts = 0;
      state.productIds = [];
      state.productList = [];
      state.showWishList = false;
      state.isRemoved = false;
      state.calledUrl = "";
    },
    updateWishListIds: (
      state,
      action: PayloadAction<{ productIds: string[] }>
    ) => {
      state.productIds = action.payload.productIds;
      state.numberOfProducts = action.payload.productIds?.length || 0;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    },
    updateWishListLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setWishListShow: (
      state,
      action: PayloadAction<{ show: boolean; url: string; isRemoved?: boolean }>
    ) => {
      state.showWishList = action.payload.show;
      state.calledUrl = action.payload.url;
      if (typeof action.payload.isRemoved === "boolean")
        state.isRemoved = action.payload.isRemoved;
    },
    updateWishListError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.isError = action.payload.error;
      state.errorMessage = action.payload.errorMessage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.productList = [];
      state.productIds = [];
      state.numberOfProducts = 0;
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = "Error";
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.productList = action?.payload?.wishListData?.productList;
      state.productIds = [...action?.payload?.wishListData?.productIds];
      state.numberOfProducts = action?.payload?.wishListData?.numberOfProducts;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
    // builder.addCase(updateCartItems.fulfilled, (state, action) => {
    //   state.cartItems = action?.payload?.cartItems;
    //   state.cartCount = action?.payload?.cartCount;
    //   state.cartQty = action?.payload?.cartQty;
    //   state.cartTotal = action?.payload?.cartTotal;
    //   state.applicableGvs = action?.payload?.applicableGvs;
    //   state.isLoading = false;
    //   state.isError = false;
    //   state.errorMessage = "";
    // });
    // builder.addCase(applyRemoveGv.fulfilled, (state, action) => {
    //   state.cartItems = action?.payload?.cartItems;
    //   state.cartCount = action?.payload?.cartCount;
    //   state.cartQty = action?.payload?.cartQty;
    //   state.cartTotal = action?.payload?.cartTotal;
    //   state.applicableGvs = action?.payload?.applicableGvs;
    //   state.isGvApplied = true;
    //   state.isLoading = false;
    //   state.isError = false;
    //   state.errorMessage = "";
    // });
  },
});

export const {
  updateWishListIds,
  updateWishListLoading,
  updateWishListError,
  setWishListShow,
} = wishListInfoSlice.actions;

export default wishListInfoSlice.reducer;
