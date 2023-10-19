import {
  PhoneCaptureTypes,
  UserInfoDetailType,
  UserInfoType,
  abandonedLeadsType,
} from "./../../types/state/userInfoType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService, localStorageHelper } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import {
  userFunctions,
  wishlistFunctions,
  PhoneCaptureFunctions,
} from "@lk/core-utils";
import { RequestBody } from "@lk/utils";
import { DataType } from "@/types/coreTypes";
import { WritableDraft } from "immer/dist/internal";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import { loginSuccess } from "helpers/gaFour";

const initialState: UserInfoType = {
  userError: false,
  userLoading: true,
  userErrorMessage: "",
  // userDetails: {}  //Initially empty but gets set after me api
  sessionId: "",
  isLogin: false,
  cartId: [],
  mobileNumber: null,
  isWhatsappOptingLoading: true,
  whatsAppOptingStatus: false,
  isGuestFlow: false,
  guestEmail: "",
  guestNumber: null,
  email: "",
  cartItemCount: 0,
  whatsAppChecked: true,
  phoneCapture: {
    isLoading: false,
    isError: false,
    errorMessage: "",
    phoneCapturedSuccess: false,
  },
};

export const fetchUserDetails = createAsyncThunk(
  "fetchUserDetails",
  async (reqObj: { sessionId: string; pageInfo?: any }, thunkAPI) => {
    thunkAPI.dispatch(updateUserLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    const { data: userData, error } = await userFunctions.getUserInfo(api);
    try {
      if (!error.isError) {
        setCookie("isLogined", 1);
        setCookie("log_in_status", true);
        setCookie("hasPlacedOrder", userData.hasPlacedOrder);
        // console.log(userData, "userData inside fetchUserDetails =====>")
        if (reqObj?.pageInfo) {
          const eventName = "login_success";
          loginSuccess(eventName, userData, reqObj.pageInfo);
        }
        return { ...userData, sessionId: reqObj.sessionId };
      } else {
        thunkAPI.dispatch(updateUserError(error.message));
      }
    } catch (err) {
      return err;
    }
  }
);

export const getWhatsappOptingStatus = createAsyncThunk(
  "getWhatsappOptingStatus",
  async (reqObj: { sessionId: string }, thunkAPI) => {
    thunkAPI.dispatch(getUserWhatsAppStatusLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    const { data: data, error } = await userFunctions.getWhatsappOptingStatus(
      api
    );
    try {
      if (!error.isError) {
        return data;
      } else {
        thunkAPI.dispatch(getUserWhatsAppStatusLoading(false));
      }
    } catch (err) {
      return err;
    }
  }
);

export const whatsAppUpdate = createAsyncThunk(
  "whatsAppUpdate",
  async (reqObj: { sessionId: string; optingValue: boolean }) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.PUT);
    const { data, error } = await userFunctions.whatsAppUpdate(
      api,
      reqObj.optingValue
    );
    try {
      if (!error.isError) {
        localStorage.setItem("whatsAppOptInId", data && data?.response && data.response.id)
        return data.response.details === "OPT_IN" ? true : false;
      }
    } catch (err) {
      return err;
    }
  }
);
// export const authenticateUser = createAsyncThunk(
//     "authUser",
//     async (reqObj: {type: string, value: string, password: string, sessionId: string}, thunkAPI) => {
//         thunkAPI.dispatch(updateSignInStatusLoading(true));
//         const api = new APIService(`${process.env.NEXT_PUBLIC_BASE_URL}`)
//         api.sessionToken = reqObj.sessionId;
//         api.setHeaders(headerArr)
//         api.setMethod(APIMethods.POST)
//         const body = new RequestBody<{code: string, phoneCode: string, telephone: string}>({
//             code: reqObj.password,
//             phoneCode: "+91",
//             telephone: reqObj.value
//         });
//         const {data:authData, error} = await authCurrentUser(api, body);
//         if(error.isError) {
//             thunkAPI.dispatch(updateSignInStatusLoading(false));
//             thunkAPI.dispatch(updateSignInStatusError({status: error.isError, message: error.message}));
//         } else {
//             thunkAPI.dispatch(fetchUserDetails({sessionId: authData.sessionId}))
//         }
//     }
// )

// export const saveWishList = createAsyncThunk(
//   "updateWishList",
//   async (reqObj: { productId: number; sessionId: string }, thunkAPI) => {
//     const api = new APIService(`${process.env.NEXT_PUBLIC_BASE_URL}`);
//     api.sessionToken = reqObj.sessionId;
//     api.setHeaders(headerArr);
//     const body = new RequestBody<{ productId: string }>({
//       productId: `${reqObj.productId}`,
//     });
//     api.setMethod(APIMethods.POST);
//     api.sessionToken = reqObj.sessionId;
//     const { data: wishListData, error } = await wishlistFunctions.addToWishlist(api, body);
//     if (!error.isError) {
//       thunkAPI.dispatch(updateWishListLoading(false));
//       thunkAPI.dispatch(updateWishList([`${reqObj.productId}`]));
//     }
//   }
// );

// export const deleteWishList = createAsyncThunk(
//   "deleteWishList",
//   async (reqObj: { productId: number; sessionId: string }, thunkAPI) => {
//     thunkAPI.dispatch(updateWishListLoading(true));
//     const api = new APIService(`${process.env.NEXT_PUBLIC_BASE_URL}`);
//     api.sessionToken = reqObj.sessionId;
//     api.setHeaders(headerArr);
//     api.setMethod(APIMethods.DELETE);
//     api.sessionToken = reqObj.sessionId;
//     const body = new RequestBody<{ productId: string }>({
//       productId: `${reqObj.productId}`,
//     });
//     const { data: wishListData, error } = await wishlistFunctions.addToWishlist(
//       api,
//       body
//     );
//     if (!error.isError) {
//       thunkAPI.dispatch(updateWishListLoading(false));
//       thunkAPI.dispatch(updateWishList([`${reqObj.productId}`]));
//     }
//   }
// );

const userDetails = (
  state: WritableDraft<UserInfoType>,
  action: PayloadAction<DataType>
) => {
  state.userError = false;
  state.userErrorMessage = "";
  state.userLoading = false;
  state.isLogin = true;
  state.isGuestFlow = false;
  state.cartId = action.payload?.lastActiveCartMap;
  state.cartItemCount =
    typeof action.payload?.lastActiveCartMap === "object"
      ? Object.keys(action.payload.lastActiveCartMap).length
      : 0;
  state.email = action.payload?.email;
  if (action.payload?.sessionId) state.sessionId = action.payload?.sessionId;
  state.mobileNumber = action.payload?.telephone;
  state.whatsAppOptingStatus = action.payload?.isWhatsappConsented;
  const userDetailObj: UserInfoDetailType = {
    dittos: action.payload.dittos,
    emailVerified: action.payload.emailVerificationStatus,
    cygnus: action.payload.cygnus,
    firstName: action.payload.firstName,
    lastName: action.payload.lastName,
    gender: action.payload.gender,
    hasPlacedOrder: action.payload.hasPlacedOrder,
    id: action.payload.id,
    isActive: action.payload.isActive,
    marketingEmail: action.payload?.marketingSubscription?.email,
    marketingPushNotifications:
      action.payload?.marketingSubscription?.pushNotification,
    marketingSMS: action.payload?.marketingSubscription?.sms,
    marketingWhatsApp: action.payload?.marketingSubscription?.whatsapp,
    monthlyLoyaltyCount: action.payload.monthlyLoyaltyOrderCount,
    yearlyLoyaltyCount: action.payload.yearlyLoyaltyOrderCount,
    telephoneVerified: action.payload.isTelephoneVerified,
    type: action.payload.type,
    walletVerified: action.payload.isWalletVerified,
    whatsAppConsent: action.payload.isWhatsappConsented,
    searches: action.payload?.searches,
    isLoyalty: action.payload.isLoyalty,
    tierLabel: action.payload.tierLabel,
    loyaltyExpiryDate: action.payload.loyaltyExpiryDate,
    tierName: action.payload.tierName,
  };
  if (userDetailObj?.cygnus?.cygnusId)
    setCookie("dittoGuestId", userDetailObj?.cygnus?.cygnusId);
  state.userDetails = userDetailObj;
};

export const updateUserInfo = createAsyncThunk(
  "updateUserInfo",
  async (
    reqObj: {
      sessionId: string;
      firstName: string;
      lastName: string;
      gender: string;
      email: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateUserLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      firstName: string;
      lastName: string;
      gender: string;
      email: string;
    }>({
      firstName: reqObj.firstName,
      lastName: reqObj.lastName,
      gender: reqObj.gender,
      email: reqObj.email,
    });
    try {
      const { data: userData, error } = await userFunctions.updateUserInfo(
        api,
        body
      );
      thunkAPI.dispatch(updateUserLoading(false));
      if (!error.isError) {
        return { ...userData, sessionId: reqObj.sessionId };
      } else {
        thunkAPI.dispatch(updateUserError(error.message));
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const phoneCaptureData = createAsyncThunk(
  "phoneCapture",
  async (reqObj: PhoneCaptureTypes, thunkAPI) => {
    thunkAPI.dispatch(isPhoneCaptureLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<any>({
      collectionData: [
        {
          UTM: reqObj.UTM,
          created_at: reqObj.created_at,
          device_id: reqObj.device_id,
          is_verified: reqObj.is_verified,
          phone: reqObj.phone,
          phoneCode: reqObj.phoneCode,
          platform: reqObj.platform,
        },
      ],
    });
    try {
      const { data, error } = await PhoneCaptureFunctions.fetchPhoneCaptureData(
        api,
        body
      );
      if (data?.success) {
        localStorageHelper.setItem("repeatFlowPhoneCapture", "true");
      }
      return { data, error };
    } catch (error) {
      return { error: true };
    }
  }
);

export const updateUserRecentSearch = createAsyncThunk(
  "updateUserRecentSearch",
  async (
    reqObj: {
      sessionId: string;
      searches: [];
    },
    thunkAPI
  ) => {
    // console.log("reqObj.sessionId",reqObj.sessionId)
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.PUT);
    const body =
      new RequestBody<{
        searches: []
      }>({
        searches: reqObj.searches,
      });
    try {
      // console.log("Update recent Api",body)
      const { data: userData, error } = await userFunctions.updateRecentSearch(
        api,
        body
      );
      thunkAPI.dispatch(updateUserLoading(false));
      if (!error.isError) {
        return { ...userData, sessionId: reqObj.sessionId };
      } else {
        thunkAPI.dispatch(updateUserError(error.message));
      }
    } catch (err) {
      return { error: true };
    }
  });
export const abandonedLeads = createAsyncThunk(
  "abandonedLeads",
  async (reqObj: abandonedLeadsType) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      cartId: number;
      device: string;
      mobileNumber?: string | null;
      paymentMethod?: string;
      phoneCode: string;
      step: number;
    }>({
      cartId: reqObj.cartId,
      device: reqObj.device,
      mobileNumber: reqObj.mobileNumber,
      paymentMethod: reqObj.paymentMethod,
      phoneCode: reqObj.phoneCode,
      step: reqObj.step,
    });

    try {
      const { data, error } = await userFunctions.abandonLeads(api, body);
      return { data, error };
    } catch (error) {
      return { error: true };
    }
  }
);

export const passUtmData = createAsyncThunk(
  "passUtmData",
  async (reqObj: {
    sessionId: string,
    eventObj: {
      event: string,
      gaClientId: string,
      whatsappOptInId: string,
      utm?: {
        utm_campaign?: string
        utm_medium?: string,
        utm_source?: string
      }
    }
  }) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      eventObj: {
        event: string,
        gaClientId: string,
        whatsappOptInId: string,
        details: {
          utm: {
            utm_campaign: string
            utm_medium: string,
            utm_source: string
          }
        }
      }
    }>({
      ...reqObj.eventObj
    });

    try {
      const { data, error } = await userFunctions.passUtmData(api, body);
      return { data, error };
    } catch (error) {
      return { error: true };
    }
  }
);

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<UserInfoType>) => {
      const { sessionId, isLogin, cartId, mobileNumber, email, cartItemCount } =
        action.payload;
      state.cartId = cartId;
      state.isLogin = isLogin;
      if (isLogin) state.isGuestFlow = false;
      state.cartItemCount = cartItemCount;
      state.sessionId = sessionId;
      state.mobileNumber = mobileNumber;
      state.email = email;
      state.userError = false;
      state.userErrorMessage = "";
      state.userLoading = false;
    },
    updateGuestFlowLogin: (
      state,
      action: PayloadAction<{ email: string; number: string | null }>
    ) => {
      const { email, number } = action.payload;
      state.isGuestFlow = true;
      if (email) state.guestEmail = email;
      if (number) state.guestNumber = number;
    },
    updateUserError: (state, action: PayloadAction<string>) => {
      state.userErrorMessage = action.payload;
      state.userLoading = false;
      state.userError = true;
      state.isLogin = false;
    },
    updateUserLoading: (state, action: PayloadAction<boolean>) => {
      state.userLoading = action.payload;
    },
    updateUserDetails: (state, action: PayloadAction<DataType>) => {
      userDetails(state, action);
    },
    setWhatsappChecked: (state, action: PayloadAction<boolean>) => {
      state.whatsAppChecked = action.payload;
    },
    getUserWhatsAppStatusLoading: (state, action: PayloadAction<boolean>) => {
      state.isWhatsappOptingLoading = action.payload;
    },
    // Phone capture pop up
    isPhoneCaptureLoading: (state, action: PayloadAction<boolean>) => {
      state.phoneCapture.isLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      userDetails(state, action);
    });
    builder.addCase(getWhatsappOptingStatus.fulfilled, (state, action) => {
      state.isWhatsappOptingLoading = false;
      state.whatsAppOptingStatus = action.payload;
    });
    builder.addCase(whatsAppUpdate.fulfilled, (state, action) => {
      state.whatsAppOptingStatus = !!action.payload;
    });
    // Phone capture pop up
    builder.addCase(phoneCaptureData.fulfilled, (state, action) => {
      if (!action.payload.error.isError) {
        state.phoneCapture.phoneCapturedSuccess = action.payload.data.success;
        state.phoneCapture.isLoading = false;
        state.phoneCapture.isError = false;
        state.phoneCapture.errorMessage = "";
      } else {
        // console.log(action.payload);
        state.phoneCapture.phoneCapturedSuccess = false;
        state.phoneCapture.isLoading = false;
        state.phoneCapture.isError = true;
        state.phoneCapture.errorMessage = action.payload.error.message;
      }
    });
    builder.addCase(phoneCaptureData.rejected, (state, action) => {
      state.phoneCapture.phoneCapturedSuccess = false;
      state.phoneCapture.isLoading = false;
      state.phoneCapture.isError = true;
      state.phoneCapture.errorMessage = "";
    });
  },
});

export const {
  updateUserData,
  updateUserError,
  updateUserLoading,
  updateGuestFlowLogin,
  getUserWhatsAppStatusLoading,
  setWhatsappChecked,
  updateUserDetails,
  isPhoneCaptureLoading,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
