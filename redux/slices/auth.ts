import { action } from "@storybook/addon-actions";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthInfoType, SignInType } from "@/types/state/authInfoType";
import { APIService, localStorageHelper, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { checkoutFunctions, userFunctions } from "@lk/core-utils";
import { setCookie } from "@/helpers/defaultHeaders";
import { fetchUserDetails, updateUserData } from "./userInfo";
import { cartFunctions } from "@lk/core-utils";
import { userProperties } from "helpers/userproperties";
import { ctaClickEvent } from "helpers/gaFour";
import { fetchCarts } from "./cartInfo";
import { fetchWishlist } from "./wishListInfo";
import { createAPIInstance } from "@/helpers/apiHelper";

const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();

const initialState: AuthInfoType = {
  isSignIn: false,
  isSignUp: false,
  searchBar: false,
  openSignInModal: false,
  inViewPort: false,
  dualLoginStatus: {
    isLoading: false,
    isError: false,
    errorMessage: "",
    isLoggedIn: false,
    data: null,
  },
  signInStatus: {
    type: SignInType.EMAIL,
    showLogin: true,
    showOTP: false,
    sendOTP: false,
    showPassword: false,
    isLoading: false,
    isError: false,
    errorMessage: null,
    otpSent: false,
    isRedirectToSignup: false,
    isCaptchaRequired: false,
    isCaptchaVerified: false,
    captchaResponse: null,
  },
  signUpStatus: {
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  // dualLoginStatus: undefined,
};

export const getAccountInfo = createAsyncThunk(
  "accountInfo",
  async (
    reqObj: {
      captcha: string | null;
      type: SignInType;
      value: string;
      countryCode: string;
      sessionId: string;
      localeData: any;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateSignInStatusLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    const { data, error } = await userFunctions.validateAccountInfo(
      reqObj.captcha,
      reqObj.type,
      reqObj.value,
      reqObj.countryCode,
      reqObj.localeData,
      api
    );

    console.log(data, error);

    if (error.isError) {
      thunkAPI.dispatch(updateSignInStatusLoading(false));
      thunkAPI.dispatch(
        updateSignInStatusError({
          status: error.isError,
          message: error.message,
          isRedirectToSignup: data?.isRedirectToSignup,
        })
      );
    } else {
      return {
        type: data.type,
        showPassword: data.showPassword,
        showOTP: data.showOTP,
        optSent: data.optSent,
        isCaptchaRequired: data.isCaptchaRequired,
      };
    }
  }
);

export const validateOtpData = createAsyncThunk(
  "validateOtpData",
  async (
    reqObj: {
      value: string;
      phoneCode: string;
      phoneNumber: string;
      sessionId: string;
      userInfo: any;
      pageInfo: any;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateSignInStatusLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      code: string;
      phoneCode: string;
      telephone: string;
    }>({
      code: reqObj.value,
      phoneCode: reqObj.phoneCode,
      telephone: reqObj.phoneNumber,
    });
    const { data, error } = await userFunctions.validateOTP(api, body); //

    if (error.isError) {
      thunkAPI.dispatch(updateSignInStatusLoading(false));
      thunkAPI.dispatch(
        updateSignInStatusError({
          status: error.isError,
          message: error.message,
        })
      );
    } else {
      setCookie(`clientV1_${country}`, data.token);
      thunkAPI.dispatch(
        fetchUserDetails({ sessionId: data.token, pageInfo: reqObj?.pageInfo })
      );
      thunkAPI.dispatch(fetchCarts({ sessionId: data.token }));
      thunkAPI.dispatch(
        fetchWishlist({
          sessionId: data.token,
          subdirectoryPath: `${
            process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
              ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
              : ""
          }`,
        })
      );
      return {
        isSignIn: true,
        showLogin: false,
        showOTP: false,
        showPassword: false,
      };
    }
  }
);

export const validateLoginPassword = createAsyncThunk(
  "validateLoginPassword",
  async (
    reqObj: {
      password: string;
      username: string;
      sessionId: string;
      userInfo: any;
      pageInfo: any;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateSignInStatusLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{ password: string; username: string }>({
      password: reqObj.password,
      username: reqObj.username,
    });
    const { data, error } = await userFunctions.validatePassword(api, body); //
    if (error.isError) {
      thunkAPI.dispatch(updateSignInStatusLoading(false));
      thunkAPI.dispatch(
        updateSignInStatusError({
          status: error.isError,
          message: error.message,
        })
      );
    } else {
      setCookie(`clientV1_${country}`, data.token);
      thunkAPI.dispatch(
        fetchUserDetails({ sessionId: data.token, pageInfo: reqObj?.pageInfo })
      );
      thunkAPI.dispatch(fetchCarts({ sessionId: data.token }));
      thunkAPI.dispatch(
        fetchWishlist({
          sessionId: data.token,
          subdirectoryPath: `${
            process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
              ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
              : ""
          }`,
        })
      );
      return {
        isSignIn: true,
        showLogin: false,
        showOTP: false,
        showPassword: false,
      };
    }
  }
);

export const getPreSalesInfo = createAsyncThunk(
  "getPreSalesInfo",
  async (reqObj: { sessionId: string }, thunkAPI) => {
    const api = createAPIInstance({ sessionToken: reqObj.sessionId });
    const { data, error } = await checkoutFunctions.getPresalesInfo(api);
    if (error.isError) {
      setCookie("isPresale", false);
      return { data, error };
    } else {
      setCookie(
        "leadSource",
        Boolean(data && data.attrs.preSalesUserIsLoggedIn)
      );
      localStorageHelper.setItem("preSalesInfo", data);
    }
  }
);

export const dualLogin = createAsyncThunk(
  "dualLogin",
  async (
    reqObj: {
      password: string;
      username: string;
      sessionId: string;
      pageInfo: any;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateDualLoginStatusLoading(true));
    const api = createAPIInstance({
      sessionToken: reqObj.sessionId,
      method: APIMethods.POST,
    });
    const body = new RequestBody<{ password: string; userName: string }>({
      password: reqObj.password,
      userName: reqObj.username,
    });
    const { data, error } = await checkoutFunctions.dualLogin(body, api); //

    console.log(data, error);

    if (error.isError) {
      setCookie("isPresale", false);
      return { data, error };
    } else {
      setCookie(`clientV1_${country}`, data.token);
      setCookie("isPresale", true);
      thunkAPI.dispatch(
        fetchUserDetails({ sessionId: data.token, pageInfo: reqObj?.pageInfo })
      );
      thunkAPI.dispatch(fetchCarts({ sessionId: data.token }));
      thunkAPI.dispatch(getPreSalesInfo({ sessionId: data.token }));
      thunkAPI.dispatch(
        fetchWishlist({
          sessionId: data.token,
          subdirectoryPath: `${
            process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
              ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
              : ""
          }`,
        })
      );
      console.log("ccc");
      return {
        data,
        error,
      };
    }
  }
);

export const postNeedHelpWhatsapp = createAsyncThunk(
  "postNeedHelpWhatsapp",
  async (reqObj: { phone: number | null; sessionId: string }) => {
    if (reqObj.phone) {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
        .setHeaders(headerArr)
        .setMethod(APIMethods.POST);
      api.sessionToken = reqObj.sessionId;
      const body = new RequestBody<{ collectionData: [{ phone: string }] }>({
        collectionData: [{ phone: `${reqObj.phone}` }],
      });
      const { data, error } = await cartFunctions.needHelpWhatsapp(api, body);
      if (error?.isError) {
        alert(
          "Sorry! Due to some technical issue we are unable to communicate with the server"
        );
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  "registerUser",
  async (
    reqObj: {
      email: string;
      firstName: string;
      lastName: string;
      mobile: string;
      password: string;
      phoneCode: string;
      sessionId: string;
      referalCode?: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateSignInStatusLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      email: string;
      firstName: string;
      lastName: string;
      mobile: string;
      password: string;
      phoneCode: string;
      referalCode: string | null;
    }>({
      email: reqObj.email,
      firstName: reqObj.firstName,
      lastName: reqObj.lastName,
      mobile: reqObj.mobile,
      password: reqObj.password,
      phoneCode: reqObj.phoneCode,
      referalCode: reqObj.referalCode || null,
    });
    try {
      const { data, error } = await userFunctions.signup(api, body); //
      if (error.isError) {
        thunkAPI.dispatch(updateSignInStatusLoading(false));
        thunkAPI.dispatch(
          updateSignInStatusError({
            status: error.isError,
            message: error.message,
          })
        );
      } else {
        setCookie("isLogined", 1);
        setCookie("log_in_status", true);
        setCookie(`clientV1_${country}`, data.token);
        thunkAPI.dispatch(fetchUserDetails({ sessionId: data.token }));
        thunkAPI.dispatch(fetchCarts({ sessionId: data.token }));
        thunkAPI.dispatch(
          fetchWishlist({
            sessionId: data.token,
            subdirectoryPath: `${
              process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
                ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
                : ""
            }`,
          })
        );
        // thunkAPI.dispatch(updateRegisteredUserDetails({ sessionId: data.token, isLogin: boolean, cartId: string[], mobileNumber: number | null, email: string, cartItemCount: number, userDetailObj  }));
        return {
          isSignUp: true,
          isSignIn: true,
          showLogin: false,
          showOTP: false,
          showPassword: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const authInfoSlice = createSlice({
  name: "authInfo",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.isSignIn = false;
      state.isSignUp = false;
      state.signInStatus = {
        type: SignInType.EMAIL,
        showLogin: true,
        showOTP: false,
        sendOTP: false,
        showPassword: false,
        isLoading: false,
        isError: false,
        errorMessage: null,
        otpSent: false,
        isCaptchaRequired: false,
        isCaptchaVerified: false,
        captchaResponse: null,
        isRedirectToSignup: false, //check
      };
    },
    resetSignupRedirectLogic: (state) => {
      state.signInStatus = {
        ...state.signInStatus,
        isRedirectToSignup: false, //check
      };
    },
    updateSignIn: (state, action: PayloadAction<boolean>) => {
      state.isSignIn = action.payload;
    },
    resetErrorMessage: (state) => {
      (state.signInStatus.isError = false),
        (state.signInStatus.errorMessage = "");
    },
    updateSignInLogin: (state, action: PayloadAction<boolean>) => {
      state.signInStatus.showLogin = action.payload;
    },
    updateSignInOTPStatus: (state, action: PayloadAction<boolean>) => {
      state.signInStatus.sendOTP = action.payload;
    },
    updateSignInPasswordStatus: (state, action: PayloadAction<boolean>) => {
      state.signInStatus.showPassword = action.payload;
    },
    updateSignInLoading: (state, action: PayloadAction<boolean>) => {
      state.signInStatus.isLoading = action.payload;
    },
    updateSignInError: (
      state,
      action: PayloadAction<{ status: boolean; message: string | null }>
    ) => {
      state.signInStatus.isError = action.payload.status;
      state.signInStatus.errorMessage = action.payload.message;
    },
    updateSignInStatusLoading: (state, action: PayloadAction<boolean>) => {
      state.signInStatus.isLoading = action.payload;
    },
    updateDualLoginStatusLoading: (state, action: PayloadAction<boolean>) => {
      state.dualLoginStatus.isLoading = action.payload;
    },
    updateOpenSignInModal: (state, action: PayloadAction<boolean>) => {
      state.openSignInModal = action.payload;
    },
    updateSignInStatusError: (
      state,
      action: PayloadAction<{
        status: boolean;
        message: string;
        isRedirectToSignup?: boolean;
      }>
    ) => {
      state.signInStatus.isError = action.payload.status;
      state.signInStatus.errorMessage = action.payload.message;
      if (action.payload.isRedirectToSignup)
        state.signInStatus.isRedirectToSignup =
          action.payload.isRedirectToSignup;
    },
    updateIsCaptchaVerified: (state, action: PayloadAction<boolean>) => {
      state.signInStatus.isCaptchaVerified = action.payload;
    },
    updateCaptchaResponse: (state, action: PayloadAction<string | null>) => {
      state.signInStatus.captchaResponse = action.payload;
    },
    updateShowOtp: (state, action: PayloadAction<boolean>) => {
      state.signInStatus.showOTP = action.payload;
    },
    searchBarStatus: (state, action: PayloadAction<boolean>) => {
      state.searchBar = action.payload;
    },
    // updateSignUpStatusLoading: (state, action: PayloadAction<boolean>) => {
    //     state.signUpStatus.isLoading = action.payload;
    // },
    // updateSignUpStatusError: (state, action: PayloadAction<{status: boolean, message: string}>) => {
    //     state.signUpStatus.isError = action.payload.status;
    //     state.signUpStatus.errorMessage = action.payload.message;
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(getAccountInfo.fulfilled, (state, action) => {
      if (action.payload) {
        state.signInStatus.isLoading = false;
        state.signInStatus.isError = false;
        state.signInStatus.showPassword = !!action.payload?.showPassword;
        state.signInStatus.type =
          action.payload?.type === SignInType.PHONE
            ? SignInType.PHONE
            : SignInType.EMAIL;
        state.signInStatus.showOTP = !!action.payload?.showOTP;
        state.signInStatus.otpSent = !!action.payload?.optSent;
        state.signInStatus.isCaptchaRequired =
          !!action.payload?.isCaptchaRequired;
        if (state.signInStatus.captchaResponse) {
          state.signInStatus.isCaptchaVerified = true;
        }
      }
    }),
      builder.addCase(validateOtpData.fulfilled, (state, action) => {
        (state.isSignIn = !!action.payload?.isSignIn),
          (state.signInStatus.showLogin = !!action.payload?.showLogin);
        state.signInStatus.showOTP = !!action.payload?.showOTP;
        state.signInStatus.showPassword = !!action.payload?.showPassword;
      }),
      builder.addCase(dualLogin.fulfilled, (state, action) => {
        if (action.payload?.error.isError) {
          state.dualLoginStatus.isLoading = false;
          state.dualLoginStatus.isError = true;
          state.dualLoginStatus.isLoggedIn = false;
          state.dualLoginStatus.errorMessage = action.payload.error.message;
        } else {
          state.dualLoginStatus.isLoading = false;
          state.dualLoginStatus.data = { ...action.payload?.data };
          state.dualLoginStatus.isLoggedIn = true;
          state.dualLoginStatus.isError = false;
        }
      }),
      builder.addCase(validateLoginPassword.fulfilled, (state, action) => {
        (state.isSignIn = !!action.payload?.isSignIn),
          (state.signInStatus.showLogin = !!action.payload?.showLogin);
        state.signInStatus.showOTP = !!action.payload?.showOTP;
        state.signInStatus.showPassword = !!action.payload?.showPassword;
      }),
      builder.addCase(registerUser.fulfilled, (state, action) => {
        (state.isSignIn = !!action.payload?.isSignIn),
          (state.isSignUp = !!action.payload?.isSignUp),
          (state.signInStatus.showLogin = !!action.payload?.showLogin);
        state.signInStatus.showOTP = !!action.payload?.showOTP;
        state.signInStatus.showPassword = !!action.payload?.showPassword;
      });
  },
});

export const {
  resetAuth,
  resetSignupRedirectLogic,
  updateSignIn,
  updateSignInError,
  updateSignInLoading,
  updateSignInLogin,
  updateSignInOTPStatus,
  updateSignInPasswordStatus,
  updateSignInStatusLoading,
  updateSignInStatusError,
  updateIsCaptchaVerified,
  updateCaptchaResponse,
  updateShowOtp,
  updateDualLoginStatusLoading,
  searchBarStatus,
  updateOpenSignInModal,
  resetErrorMessage,
  // updateSignUpStatusLoading,
  // updateSignUpStatusError
} = authInfoSlice.actions;

export default authInfoSlice.reducer;
