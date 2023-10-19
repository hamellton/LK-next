import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { searchbarFunctions } from "@lk/core-utils";
import { SearchBarType } from "@/types/state/searchBarType";
import { replaceCountryCode } from "../../helpers/utils";

const initialState: SearchBarType = {
  isLoading: true,
  isError: false,
  errorMessage: "",
  data: [],
};

export const searchBarData = createAsyncThunk(
  "searchbar",
  async (
    reqObj: { sessionId: string; query: string; country: string },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updatePayLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    try {
      const { data: result, error } =
        await searchbarFunctions.fetchSearchBarData(api, reqObj.query);
      thunkAPI.dispatch(updatePayLoading(false));
      if (!error.isError) {
        const filteredUrlSearch = result?.productRecommendations?.map(
          (item: any) => {
            let productUrl = new URL(item?.product_url)?.pathname ?? "";
            return {
              ...item,
              product_url: productUrl,
            };
          }
        );
        return { ...result, productRecommendations: [...filteredUrlSearch] };
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

export const searchBarInfoSlice = createSlice({
  name: "searchbarInfo",
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
  },
  extraReducers: (builder) => {
    builder.addCase(searchBarData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
  },
});

export const { updatePayLoading, updatePayError } = searchBarInfoSlice.actions;

export default searchBarInfoSlice.reducer;
