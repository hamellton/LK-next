import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { qrCodePidFunction } from "@lk/core-utils";
import { PidQrType } from "@/types/state/qidQrInfoType";

const initialState: PidQrType = {
  isLoading: true,
  isError: false,
  errorMessage: "",
  data: [],
};

export const pidFromQrData = createAsyncThunk(
  "pidFromQr",
  async (reqObj: { sessionId: string; query: string }, thunkAPI) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    try {
      const { data: result, error } = await qrCodePidFunction.fetchPidFromQr(
        api,
        reqObj.query
      );
      thunkAPI.dispatch(updatePayLoading(false));
      if (!error.isError) {
        return result;
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

export const pidFromQrInfoSlice = createSlice({
  name: "pidQrInfo",
  initialState,
  reducers: {
    updatePayLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updatePayError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.errorMessage = action.payload.errorMessage;
    },
	resetData: (state, action: PayloadAction<boolean>) => {
	state.data = [];
      state.isLoading = false;
      state.isError = false;
	  state.errorMessage ="";
	  },
  },
  extraReducers: (builder) => {
    builder.addCase(pidFromQrData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isError = false;
    });

  },
});

export const { updatePayLoading, updatePayError } = pidFromQrInfoSlice.actions;

export default pidFromQrInfoSlice.reducer;
