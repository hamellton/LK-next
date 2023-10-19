import { APIMethods } from "@/types/apiTypes";
import { APIService } from "@lk/utils";
import {
  CategoryData,
  defaultCategoryParams,
  CategoryParams,
} from "@/types/categoryTypes";
import { ProductTypeBasic } from "@/types/productDetails";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { headerArr } from "helpers/defaultHeaders";
import { categoryFunctions } from "@lk/core-utils";
import { FilterType } from "@/types/filterTypes";
import { ChangeEvent } from "react";
import { RootState } from "../store";
import { DEFAULT_PAGE_COUNT, DEFAULT_PAGE_SIZE } from "@/constants/index";
import { action } from "@storybook/addon-actions";
import { DataType } from "@/types/coreTypes";
import { viewItemListGA4 } from "helpers/gaFour";

interface CategoryInfoType {
  categoryData: CategoryData | null;
  categoryDataLoading: boolean;
  productList: ProductTypeBasic[] | [];
  productListLoading: boolean;
  filters: FilterType | { filters: [] } | null;
  filtersLoading: boolean;
  defaultParams: DefaultParamsType;
  otherParams: DataType;
  isRenderedOnce: boolean;
  isDittoEnabled: boolean;
  filterSelected: DataType;
  filterDeleted: boolean;
  filterMapping: DataType;
  webUrl:string;
  stopPagination: boolean;
  categoryCarouselData: any;
}

interface DefaultParamsType {
  pageCount: number;
  pageSize: number;
}

const subdirectoryPath =
  process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
    ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
    : "";

const initialState: CategoryInfoType = {
  categoryData: null,
  categoryDataLoading: true,
  productList: [],
  productListLoading: false,
  filters: null,
  filtersLoading: true,
  defaultParams: {
    pageCount: DEFAULT_PAGE_COUNT,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  otherParams: {},
  isRenderedOnce: false,
  isDittoEnabled: false,
  filterSelected: {},
  filterDeleted: false,
  filterMapping: {},
  webUrl:"",
  stopPagination: false,
  categoryCarouselData: {},
};
const isAlgoliaSearch = true

// Not use anywhere in code, if not useful - remove
export const fetchQueryFilter = createAsyncThunk(
  "fetchQueryFilter",
  async (
    reqObj: {
      sessionId: string;
      query: string;
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    thunkAPI.dispatch(updateFiltersLoading(true));
    const { data: queryFilterData, error } =
      await categoryFunctions.getQueryFilter(api, reqObj.query);

    // console.log(queryFilterData, reqObj);

    if (!error.isError) {
      return queryFilterData;
    } else {
      console.log(error.isError);
    }
  }
);

export const fetchQueryData = createAsyncThunk(
  "fetchQueryData",
  async (
    reqObj: {
      sessionId: string;
      query: string;
      pageSize: number;
      pageNumber: number;
      subdirectoryPath?: string;
      otherFilters?: DataType[];
      isAlgoliaSearch?:boolean,
      similarProductId?:boolean,
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    if(reqObj.isAlgoliaSearch)
    api.setMethod(APIMethods.POST)
    else
    api.setMethod(APIMethods.GET);
    thunkAPI.dispatch(updateFiltersLoading(true));

    const { formatData, error,webUrl="" } =
      await categoryFunctions.getQuerySelectedFilterData(
        reqObj.query,
        reqObj.pageSize,
        reqObj.pageNumber,
        api,
        reqObj.subdirectoryPath,
        reqObj.otherFilters,
        reqObj.isAlgoliaSearch,
        reqObj.similarProductId
      );
    // console.log(error, formatData);

    // if (!error.isError) {

    if (
      formatData.categoryData?.productCount !== 0 &&
      formatData.productData?.length > 0
    ) {
      return { formatData, error, reqObj, stopPagination: false,webUrl };
    } else {
      thunkAPI.dispatch(updatePaginationBool(true));
      return { formatData, error, reqObj, stopPagination: true,webUrl };
    }
    // } else {
    //   console.log(error.isError);
    // }
  }
);

export const fetchFilters = createAsyncThunk(
  "fetchFilters",
  async (
    reqObj: {
      id: number | null | string;
      sessionId: string;
      defaultFilters: DefaultParamsType;
      otherParams: DataType[];
      search: boolean;
      isLogin?: boolean;
      pageInfo?: any;
      categoryData?: any;
      isAlgoliaSearch?:boolean,
      similarProductId?:boolean,

    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    if(reqObj.isAlgoliaSearch &&  reqObj.search)
    api.setMethod(APIMethods.POST)
    else
    api.setMethod(APIMethods.GET);
    thunkAPI.dispatch(updateFiltersLoading(true));
    thunkAPI.dispatch(updateProductListLoading(true));
    const { data: paramsData, error } = await categoryFunctions.getFiltersData(
      reqObj.id,
      reqObj.defaultFilters,
      reqObj.otherParams,
      api,
      reqObj.search,
      subdirectoryPath,
      reqObj.isAlgoliaSearch,
      reqObj.similarProductId
    );

    if (!error.isError) {
      if (
        paramsData.categoryData?.productCount !== 0 &&
        paramsData?.productListData?.length > 0
      ) {
        viewItemListGA4(
          paramsData?.productListData,
          reqObj.isLogin || false,
          "view-item-list",
          reqObj?.categoryData,
          reqObj?.pageInfo
        );
        return { paramsData, reqObj, stopPagination: false, error };
      } else {
        // thunkAPI.dispatch(updatePaginationBool(true));
        return { paramsData, reqObj, stopPagination: true, error };
      }
    } else {
      console.log(error.isError);
    }
  }
);

export const setDittoUrl = createAsyncThunk(
  "setDittoUrl",
  async (reqObj: { dittoUrl: any }) => {
    return reqObj.dittoUrl;
  }
);

export const fetchFilterData = createAsyncThunk(
  "fetchFilterData",
  async (
    reqObj: {
      filterId: number | string;
      sessionId: string;
      search: boolean;
      selectedFilter?: DataType;
      isAlgoliaSearch?:boolean,
      similarProductId?:boolean,
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
      headerArr
    );
    thunkAPI.dispatch(updateFiltersLoading(true));
    api.sessionToken = reqObj.sessionId;
    if(reqObj.isAlgoliaSearch && reqObj.search)
    api.setMethod(APIMethods.POST)
    else
    api.setMethod(APIMethods.GET);
    let filterParams = {};
    if (
      reqObj.selectedFilter &&
      Object.keys(reqObj.selectedFilter).length > 0
    ) {
      filterParams = { ...reqObj.selectedFilter };
    }
    const { data: filterData, error } = await categoryFunctions.getFilterData(
      reqObj.filterId,
      api,
      reqObj.search,
      filterParams,
      reqObj.isAlgoliaSearch,
      reqObj.similarProductId
    );
    return { filterData, error };
  }
);

export const getCategoryCarouselData = createAsyncThunk(
  "getCategoryCarouselData",
  async (
    reqObj: {
      sessionId: string;
      catIds: string;
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
      headerArr
    );
    api.sessionToken = reqObj.sessionId;
    api.setMethod(APIMethods.GET);
    const { data, error } = await categoryFunctions.getCategoryCarouselData(
      api,
      reqObj.catIds
    );
    return { data, error };
  }
);

export const applyFilters = createAsyncThunk(
  "applyFilters",
  async (
    reqObj: {
      id: number | null;
      sessionId: string;
      defaultParams: defaultCategoryParams;
      params: CategoryParams[];
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
      headerArr
    );
    api.sessionToken = reqObj.sessionId;
    api.setMethod(APIMethods.GET);

    const { data, error } = await categoryFunctions.getCategoryData(
      reqObj.id as number,
      api,
      process.env.NEXT_PUBLIC_BASE_ROUTE === "NA"
        ? ""
        : `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`,
      (thunkAPI.getState() as RootState).categoryInfo.defaultParams,
      reqObj.params
    );
    thunkAPI.dispatch(updateProductList(data.productListData || []));
    thunkAPI.dispatch(updateProductListLoading(false));
  }
);

export const lazyloadProductList = createAsyncThunk(
  "lazyloadProductList",
  async (
    reqObj: {
      id: number | null;
      sessionId: string;
      defaultParams: defaultCategoryParams;
      params: CategoryParams[];
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
      headerArr
    );
    api.sessionToken = reqObj.sessionId;
    api.setMethod(APIMethods.GET);
    // console.log();
    const { data, error } = await categoryFunctions.getCategoryData(
      reqObj.id as number,
      api,
      process.env.NEXT_PUBLIC_BASE_ROUTE === "NA"
        ? ""
        : `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`,
      reqObj.defaultParams,
      reqObj.params
    );
    if (!error.isError) {
      if (data.categoryData) {
        if (
          data.categoryData.productCount !== 0 &&
          data.productListData?.length > 0
        ) {
          thunkAPI.dispatch(updateCategoryData(data?.categoryData));
        } else {
          thunkAPI.dispatch(updatePaginationBool(true));
        }
      }
      if (data?.productListData) {
        thunkAPI.dispatch(updateProductList(data.productListData || []));
      }
    }
  }
);

export const applySorting = createAsyncThunk(
  "applySorting",
  async (
    reqObj: {
      event?: ChangeEvent<HTMLSelectElement>;
      id: number | null | string;
      sessionId: string;
      defaultParams: defaultCategoryParams;
      params: DataType[];
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
      headerArr
    );
    api.sessionToken = reqObj.sessionId;
    api.setMethod(APIMethods.GET);
    const { data, error } = await categoryFunctions.getCategoryData(
      reqObj.id as number,
      api,
      process.env.NEXT_PUBLIC_BASE_ROUTE === "NA"
        ? ""
        : `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`,
      reqObj.defaultParams,
      reqObj.params
    );
    if (
      data?.categoryData?.productCount !== 0 &&
      data?.categoryData?.productList?.length > 0
    ) {
      thunkAPI.dispatch(updateCategoryData(data.categoryData));
    } else {
      thunkAPI.dispatch(updatePaginationBool(true));
    }
    try {
      return data.productListData;
    } catch (err) {
      console.log(err);
    }
  }
);

export const categoryInfoSlice = createSlice({
  name: "categoryInfo",
  initialState,
  reducers: {
    updateCategoryState: (state, action: PayloadAction<CategoryInfoType>) => {
      state.categoryData = action.payload.categoryData;
      state.filters = action.payload.filters;
      state.productList = action.payload.productList;
      state.filtersLoading = false;
      state.categoryDataLoading = false;
      state.productListLoading = false;
      state.isRenderedOnce = true;
    },
    updateDefaultParams: (state, action: PayloadAction<DefaultParamsType>) => {
      state.defaultParams = action.payload;
    },
    updateProductList: (state, action: PayloadAction<ProductTypeBasic[]>) => {
      state.productList = [...state.productList, ...action.payload];
    },
    updateFilterData: (state, action: PayloadAction<FilterType>) => {
      state.filters = action.payload;
    },
    updatePaginationBool: (state, action: PayloadAction<boolean>) => {
      state.stopPagination = action.payload;
    },
    updateCategoryData: (state, action: PayloadAction<CategoryData>) => {
      state.categoryData = action.payload;
      state.stopPagination = false;
    },
    updateFiltersLoading: (state, action: PayloadAction<boolean>) => {
      state.filtersLoading = action.payload;
    },
    updateCategoryDataLoading: (state, action: PayloadAction<boolean>) => {
      state.categoryDataLoading = action.payload;
    },
    updateProductListLoading: (state, action: PayloadAction<boolean>) => {
      state.productListLoading = action.payload;
    },
    setDittoEnabled: (state, action: PayloadAction<boolean>) => {
      state.isDittoEnabled = action.payload;
    },
    deleteSelectedfilter: (state, action: PayloadAction<any>) => {
      const filterState = { ...state.filterSelected };
      filterState[action.payload.id] = filterState[action.payload.id].filter(
        (val: string) => val !== action.payload.value[0]
      );
      if (filterState[action.payload.id].length === 0) {
        delete filterState[action.payload.id];
      }
      state.filterDeleted = true;
      state.filterSelected = { ...filterState };
    },
    updateMobileSizeFilter: (
      state,
      action: PayloadAction<{ id: string; value: string[] }>
    ) => {
      if (action.payload.value.length === 0) {
        const filterState = { ...state.filterSelected };
        delete filterState[action.payload.id];
        state.filterSelected = { ...filterState };
      } else
        state.filterSelected[action.payload.id] = [...action.payload.value];
    },
    updateSelectedFilter: (state, action: PayloadAction<any>) => {
      if(action.payload.id!=="search"&&action.payload.id!=="similarProductId" )
      state.filterSelected[action.payload.id]
        ? (state.filterSelected = {
            ...state.filterSelected,
            [action.payload.id]: [
              ...state.filterSelected[action.payload.id],
              ...action.payload.value,
            ],
          })
        : (state.filterSelected = {
            ...state.filterSelected,
            [action.payload.id]: [...action.payload.value],
          });
      state.filterDeleted = false;
    },
    resetFilterSelected: (state) => {
      state.filterSelected = initialState.filterSelected;
    },
    fillFilterSelected: (state, action: PayloadAction<any>) => {
      if(!action.payload?.search)
      state.filterSelected = action.payload;
    },
    setMapFilterKeyValue: (state, action: PayloadAction<any>) => {
      state.filterMapping = action.payload;
    },
    setQueryFilter: (state, action: PayloadAction<any>) => {
      state.filters = { ...action.payload };
      if (action.payload.filters) {
        action.payload.filters.forEach((element: any) => {
          state.filterMapping = {
            ...state.filterMapping,
            [element.id]: element.name,
          };
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchFilters.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.filtersLoading = false;
        console.log(action.payload);

        if (!action.payload?.error?.isError) {
          if (!action.payload?.stopPagination) {
            state.categoryData = action.payload?.paramsData.categoryData;
            // state.productList = action.payload.productListData;
            state.categoryDataLoading = false;

            if (action.payload?.reqObj?.defaultFilters.pageCount === 0) {
              state.productList = [
                ...action.payload.paramsData.productListData,
              ];
            } else if (action.payload?.paramsData.productListData) {
              state.productList = [
                ...state.productList,
                ...action.payload.paramsData.productListData,
              ];
            }
          } else {
            state.productList = [...action.payload.paramsData.productListData];
            // state.categoryData = action.payload?.paramsData.categoryData;
          }
        } else {
          state.productList = [];
        }
        state.stopPagination = !!action?.payload?.stopPagination;
        state.productListLoading = false;
        // state.defaultParams = action.payload.defaultParams;
        // state.otherParams = action.payload.otherParams;
      }
    ),
      builder.addCase(
        fetchQueryData.fulfilled,
        (state, action: PayloadAction<any>) => {
          if (!action.payload.stopPagination) {
            if (action.payload.reqObj.pageNumber === 0) {
              state.productList = action.payload.formatData.productData;
              state.webUrl=action.payload.webUrl??""
            } else {
              state.productList = [
                ...state.productList,
                ...action.payload.formatData.productData,
              ];
            }
            state.categoryData = action.payload.formatData.categoryData;
            state.stopPagination = action.payload.stopPagination;
          }
          state.stopPagination = action.payload.stopPagination;
          state.productListLoading = false;
        }
      );
    builder.addCase(
      fetchFilterData.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.filtersLoading = false;
        if (!action.payload.error.isError) {
          state.filters = { ...action.payload.filterData };
          if (action.payload.filterData.filters) {
            action.payload.filterData.filters.forEach((element: any) => {
              state.filterMapping = {
                ...state.filterMapping,
                [element.id]: element.name,
              };
            });
          }
        } else {
          state.filters = {
            filters: [],
          };
        }
      }
    );
    builder.addCase(
      applySorting.fulfilled,
      (state, action: PayloadAction<ProductTypeBasic[]>) => {
        state.productList = action.payload;
      }
    ),
      builder.addCase(
        getCategoryCarouselData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.categoryCarouselData = action.payload;
        }
      ),
      builder.addCase(
        setDittoUrl.fulfilled,
        (state, action: PayloadAction<any>) => {
          // const data = [...state.productList];
          for (let i = 0; i < state.productList.length; i++) {
            // if (action.payload[state.productList[i].id]) {
            //   state.productList[i].productImage = {
            //     ...state.productList[i].productImage,
            //     hoverURL: action.payload[state.productList[i].id],
            //   };
            // }
          }
        }
      );
  },
});

export const {
  updateCategoryState,
  updateProductList,
  updateFilterData,
  updateCategoryData,
  updatePaginationBool,
  updateFiltersLoading,
  updateProductListLoading,
  updateDefaultParams,
  setDittoEnabled,
  updateSelectedFilter,
  updateMobileSizeFilter,
  deleteSelectedfilter,
  resetFilterSelected,
  fillFilterSelected,
  setMapFilterKeyValue,
  setQueryFilter,
} = categoryInfoSlice.actions;

export default categoryInfoSlice.reducer;
