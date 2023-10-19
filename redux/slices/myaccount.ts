import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { userFunctions } from "@lk/core-utils";
import { MyAccountType } from "@/types/state/myAccount";

const initialState: MyAccountType = {
  isLoading: false,
  isError: false,
  errorMessage: "",
  data: {},
  status: null,
  resetPassword: {
    error: "",
    success: "",
  },
};
// Token Expired/Please Regenerate
export const resetPasswordV2 = createAsyncThunk(
  "resetPasswordV2",
  async (
    reqObj: {
      newPassword: string;
      sessionId: string;
      confirmNewPassword: string;
      token: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateResetLoading(true));
    // console.log(reqObj, reqObj.newPassword, reqObj.confirmNewPassword);

    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      newPassword: string;
      confirmNewPassword: string;
    }>({
      confirmNewPassword: reqObj.confirmNewPassword,
      newPassword: reqObj.newPassword,
    });
    try {
      const { data, error } = await userFunctions.resetPasswordV2(
        api,
        body,
        reqObj.token
      );
      thunkAPI.dispatch(updateResetLoading(false));
      console.log(data, error);

      return { data, error };
    } catch (err) {
      console.log(err);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (
    reqObj: {
      currentPassword: string;
      sessionId: string;
      newPassword: string;
      email: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateResetLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      oldPassword: string;
      newPassword: string;
      email: string;
    }>({
      oldPassword: reqObj.currentPassword,
      newPassword: reqObj.newPassword,
      email: reqObj.email,
    });
    try {
      const { data, error } = await userFunctions.resetPassword(api, body);
      thunkAPI.dispatch(updateResetLoading(false));
      if (!error.isError) {
        return { ...data, sessionId: reqObj.sessionId };
      } else {
        thunkAPI.dispatch(updateUserError(error));
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const myAccountInfoSlice = createSlice({
  name: "myAccountInfo",
  initialState,
  reducers: {
    updateResetLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.errorMessage = initialState.errorMessage;
      state.status = initialState.status;
      state.isError = initialState.isError;
      state.data = initialState.data;
    },
    updateUserError: (
      state,
      action: PayloadAction<{
        isError: boolean;
        message: string;
        status: null | number;
      }>
    ) => {
      state.errorMessage = action.payload.message;
      state.isError = action.payload.isError;
      state.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.errorMessage = initialState.errorMessage;
      state.status = initialState.status;
      state.isError = initialState.isError;
      state.data = action.payload || initialState.data;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(resetPasswordV2.fulfilled, (state, action) => {
      if (action.payload?.error?.isError) {
        state.resetPassword.error = action.payload?.error?.message;
      } else {
        state.resetPassword.success = action.payload?.data;
      }
    });
  },
});

export const { updateResetLoading, updateUserError } =
  myAccountInfoSlice.actions;

export default myAccountInfoSlice.reducer;
