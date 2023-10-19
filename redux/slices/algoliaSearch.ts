import { APIMethods } from "@/types/apiTypes";
import { AlgoliaSearchType } from "@/types/state/algoliaSearchType";
import { APIService } from "@lk/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { headerArr } from "helpers/defaultHeaders";
import { newSearchFunctions } from "@lk/core-utils";
import { ALGOLIA_TRENDING_SEARCHES } from "@/constants/index";

const initialState: AlgoliaSearchType = {
  isLoading: true,
  isError: false,
  errorMessage: "",
  data: [],
  showResult: false,
  noResult: false,
  isOpen: true,
  recentSearches: [],
  trendingSearches: [],
  isSelected:false
};
export const getTrendingSearch = createAsyncThunk(
  "getTrendingSearch",
  async (reqObj: { sessionId: string }, thunkAPI) => {
    thunkAPI.dispatch(updateSearchLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    const { data: data, error } = await newSearchFunctions.getTrendingSearch(
      api
    );
    const mockData = {
      searches: [
        {
          query: "Sunglass",
          label: "Sunglass",
          thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/399/399766.png",
          objectID: "1234",
        },
        {
          query: "Eyeglasses",
          label: "Eyeglasses",
          thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/399/399766.png",
          objectID: "1235",
        },
        {
          query: "Contact lens",
          label: "Contact lens",
          thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/399/399766.png",
          objectID: "1236",
        },

        {
          query: "Men Eyeglasses",
          label: "Men Eyeglasses",
          thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/399/399766.png",
          objectID: "1237",
        },
        {
          query: "Women Eyeglasses",
          label: "Women Eyeglasses",
          thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/399/399766.png",
          objectID: "1238",
        },
      ],
    };

    try {
      if (!error.isError) {
        localStorage.setItem(
          ALGOLIA_TRENDING_SEARCHES,
          JSON.stringify(data.searches)
        );
        return data;
      } else {
    
        thunkAPI.dispatch(updateSearchLoading(false));
        localStorage.setItem(
          ALGOLIA_TRENDING_SEARCHES,
          JSON.stringify([])
        );
        return [];
      }
    } catch (err) {
      return err;
    }
  }
);

export const algoliaSearchSlice = createSlice({
  name: "algoliaSearch",
  initialState,
  reducers: {
    updateSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateSearchError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.isError = action.payload.error;
      state.errorMessage = action.payload.errorMessage;
      state.showResult = true;
      state.noResult = true;
    },
    updateSearchState: (
      state,
      action: PayloadAction<{ showResult?: boolean,isSelected?:boolean }>
    ) => {
      state.showResult = action.payload.showResult;
      state.isSelected=action.payload.isSelected;
    },
    updateResultState: (
      state,
      action: PayloadAction<{ noResult: boolean }>
    ) => {
      state.noResult = action.payload.noResult;
    },
    updateRecentSearches: (
      state,
      action: PayloadAction<{ recentSearches: [] }>
    ) => {
      state.recentSearches = action.payload.recentSearches;
    },
    updateTrendingSearches: (
      state,
      action: PayloadAction<{ trendingSearches: [] }>
    ) => {
      state.trendingSearches = action.payload.trendingSearches;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTrendingSearch.fulfilled, (state, action) => {
      state.trendingSearches = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
    });
  },
});

export const {
  updateSearchLoading,
  updateSearchError,
  updateSearchState,
  updateResultState,
  updateRecentSearches,
  updateTrendingSearches,
} = algoliaSearchSlice.actions;

export default algoliaSearchSlice.reducer;
