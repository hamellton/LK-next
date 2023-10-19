import { action } from "@storybook/addon-actions";
import { ReviewsType } from "./../../types/reviewTypes";
import { ProductDetailType } from "@/types/productDetails";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService, RequestBody } from "@lk/utils";
import { APIMethods } from "@/types/apiTypes";
import { headerArr } from "helpers/defaultHeaders";
import { pdpFunctions } from "@lk/core-utils";
import { getLocationApiErrorMessage } from "containers/Base/helper";

interface ProductDetailInfoType {
  productDetailLoading: boolean;
  productDetailData: ProductDetailType | null;
  pinCodeLoading: boolean;
  pinCodeError: boolean;
  pinCodeErrorMessage: string;
  pinCodeData: any;
  reviewsLoading: boolean;
  reviewsData: ReviewsType;
  percentage: string;
  reviewError: string;
  reviewLoading: boolean;
  reviewMessage: string;
  locationLoading: boolean;
  oosSubscription: {
    isError: boolean;
    isLoading: boolean;
    data: any;
  };
}

const initialState: ProductDetailInfoType = {
  productDetailLoading: false,
  productDetailData: null,
  pinCodeError: false,
  pinCodeErrorMessage: "",
  pinCodeLoading: false,
  pinCodeData: {},
  reviewsLoading: false,
  reviewsData: {
    count: 0,
    reviews: [],
    pageCount: 1,
    pageSize: 10,
    rating: 0,
  },
  reviewError: "",
  reviewLoading: false,
  reviewMessage: "",
  oosSubscription: {
    isError: false,
    isLoading: false,
    data: null,
  },
  locationLoading: false,
};

export const dispatchFetchMoreReviews = createAsyncThunk(
  "dispatchFetchMoreReviews",
  async (
    reqObj: {
      pid: number;
      pageSize: number;
      nextPage: string;
      sessionId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateReviewsLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    api.sessionToken = reqObj.sessionId;
    try {
      const { data: reviewData, error } = await pdpFunctions.getReviews(
        reqObj.pid,
        reqObj.pageSize,
        reqObj.nextPage,
        api
      );

      let reviews = reviewData.reviews;
      return { reviews, reqObj, error };
    } catch (err) {
      console.log("catch");

      return { error: true };
    }
  }
);

interface ReviewType {
  noOfStars: number;
  reviewDetail: string;
  reviewTitle: string;
  reviewee: string;
}

export const dispatchPostReview = createAsyncThunk(
  "dispatchPostReview",
  async (
    reqObj: {
      pid: number;
      email: string;
      review: ReviewType;
      sessionId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updatePostReviewLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    try {
      const body = new RequestBody<{ email: string; review: any }>({
        email: reqObj.email,
        review: reqObj.review,
      });
      const { data: reviewData, error } = await pdpFunctions.postReview(
        reqObj.pid,
        api,
        body
      );

      if (!error.isError) {
        return reviewData.message.result.message;
      } else {
        thunkAPI.dispatch(
          updateReviewsError({ error: true, errorMessage: error.message })
        );
      }
    } catch (err) {
      return { error: true };
    }
  }
);

export const postOosSubscription = createAsyncThunk(
  "oosSubscription",
  async (
    reqObj: {
      product_id: number;
      subscription_email: string;
      subscription_number: number;
      related_product: string;
      sessionId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateOosLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    api.sessionToken = reqObj.sessionId;
    try {
      const body = new RequestBody<{
        product_id: number;
        subscription_email: string;
        subscription_number: number;
        related_product: string;
      }>({
        product_id: reqObj.product_id,
        subscription_email: reqObj.subscription_email,
        subscription_number: reqObj.subscription_number,
        related_product: "",
      });
      const { data, error } = await pdpFunctions.oosSubscription(api, body);

      return { data, error };
    } catch (err) {
      return { error: true };
    }
  }
);

export const dispatchPinCodeData = createAsyncThunk(
  "dispatchPinCodeData",
  async (
    reqObj: {
      pid: number;
      pinCode: number;
      countryCode: string;
      sessionId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updatePinCodeLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    api.sessionToken = reqObj.sessionId;

    if (!reqObj.pinCode) {
      thunkAPI.dispatch(
        updatePinCodeError({ error: true, message: "Please enter Pincode" })
      );
      return;
    }

    try {
      const { data: pinCodeData, error } = await pdpFunctions.getPinCode(
        reqObj.pid,
        reqObj.pinCode,
        reqObj.countryCode,
        api
      );
      if (error.isError) {
        thunkAPI.dispatch(
          updatePinCodeError({ error: error.isError, message: error.message })
        );
      } else {
        thunkAPI.dispatch(updatePinCodeLoading(false));
        thunkAPI.dispatch(
          updatePinCodeData({ ...pinCodeData, pinCode: reqObj.pinCode })
        );
      }
    } catch (err) {
      thunkAPI.dispatch(updatePinCodeError({ error: true, message: "Error" }));
    }
    thunkAPI.dispatch(updateLocationLoading({ isLoading: false }));
  }
);

export const getLocation = createAsyncThunk(
  "getLocation",
  async (
    reqObj: {
      pid?: number;
      sessionId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateLocationLoading({ isLoading: true }));
    if ("geolocation" in window.navigator) {
      window.navigator.geolocation.getCurrentPosition(
        (position: any) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location = { lat, lng };
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location }, (results: any, status) => {
            if (status === "OK") {
              if (results[0]) {
                const components: any = results[0].address_components;
                const postalObj: any = components.find(
                  (component: any) => component.types[0] === "postal_code"
                );
                const pincode = postalObj.long_name;
                thunkAPI.dispatch(
                  dispatchPinCodeData({
                    pid: reqObj.pid as number,
                    pinCode: Number(pincode),
                    countryCode: "in",
                    sessionId: reqObj.sessionId,
                  })
                );
              } else {
                thunkAPI.dispatch(updateLocationLoading({ isLoading: false }));
                console.log("No results found");
              }
            } else {
              thunkAPI.dispatch(updateLocationLoading({ isLoading: false }));
              console.log("Geocoder failed due to: " + status);
            }
          });
        },
        (error) => {
          thunkAPI.dispatch(updateLocationLoading({ isLoading: false }));
          thunkAPI.dispatch(
            updatePinCodeError({
              error: true,
              message: getLocationApiErrorMessage(error),
            })
          );
        }
      );
    }
  }
);

export const productDetailInfoSlice = createSlice({
  name: "productDetailInfo",
  initialState,
  reducers: {
    updateProductDetailLoading: (state, action: PayloadAction<boolean>) => {
      state.productDetailLoading = action.payload;
    },
    updateProductDetailData: (
      state,
      action: PayloadAction<ProductDetailType>
    ) => {
      state.productDetailData = action.payload;
    },
    updatePinCodeLoading: (state, action: PayloadAction<boolean>) => {
      state.pinCodeLoading = action.payload;
    },
    updatePinCodeData: (state, action: PayloadAction<any>) => {
      state.pinCodeData = action.payload;
      state.pinCodeError = false;
      state.pinCodeErrorMessage = "";
    },
    updatePinCodeError: (
      state,
      action: PayloadAction<{ error: boolean; message: string }>
    ) => {
      state.pinCodeLoading = false;
      state.pinCodeError = action.payload.error;
      state.pinCodeErrorMessage = action.payload.message;
      state.locationLoading = false;
    },
    updateReviewsLoading: (state, action: PayloadAction<boolean>) => {
      state.reviewsLoading = action.payload;
    },
    updateOosLoading: (state, action: PayloadAction<boolean>) => {
      state.oosSubscription.isLoading = action.payload;
    },
    updateReviewsData: (state, action: PayloadAction<ReviewsType>) => {
      state.reviewsData = action.payload;
    },
    updatePostReviewLoading: (state, action: PayloadAction<boolean>) => {
      state.reviewLoading = action.payload;
    },
    resetReviewData: (state) => {
      state.reviewMessage = "";
      state.reviewError = "";
    },

    updateReviewsMoreData: (state, action: PayloadAction<ReviewsType>) => {
      const data = action.payload;
      let reviews: any[] = [];
      if (state.reviewsData?.reviews) reviews = [...state.reviewsData.reviews];
      if (data.reviews) reviews = [...reviews, ...data.reviews];
      state.reviewsData = {
        pageSize: data.pageSize,
        count: data.count + (state.reviewsData?.count || 0),
        pageCount: data.pageCount,
        reviews: reviews,
      };
    },
    updateReviewsError: (
      state,
      action: PayloadAction<{ error: boolean; errorMessage: string }>
    ) => {
      state.reviewLoading = false;
      state.reviewError = action.payload.errorMessage;
    },
    updateLocationLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean }>
    ) => {
      state.locationLoading = action.payload.isLoading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(dispatchFetchMoreReviews.rejected, (state, action) => {
      state.reviewLoading = false;
      state.reviewError = "Error";
    }),
      builder.addCase(postOosSubscription.fulfilled, (state, action) => {
        if (action.payload?.error?.isError) {
          state.oosSubscription.isError = action.payload?.error?.isError;
        } else {
          state.oosSubscription.data = action.payload?.data;
        }
        state.oosSubscription.isLoading = false;
      }),
      builder.addCase(postOosSubscription.rejected, (state) => {
        state.oosSubscription.isError = true;
        state.oosSubscription.isLoading = false;
      }),
      builder.addCase(dispatchFetchMoreReviews.fulfilled, (state, action) => {
        const data: any = action.payload;
        if (data.error.isError) {
          state.reviewError = "Error";
        } else {
          let reviewsInfo: any[] = [];
          if (state.reviewsData?.reviews)
            reviewsInfo = [...state.reviewsData.reviews];
          if (data.reviews.status === 200)
            reviewsInfo = reviewsInfo.concat(
              data.reviews.result.review.reviews
            );
          state.reviewsData = {
            pageSize: data.reqObj.pageSize,
            count: data.reviews.result.numberOfReviews,
            rating: data.reviews.result.avgRating,
            pageCount: parseInt(data.reqObj.nextPage),
            reviews: reviewsInfo,
          };
        }
        state.reviewsLoading = false;
      }),
      builder.addCase(dispatchPostReview.rejected, (state, action) => {
        // console.log(action.payload);

        state.reviewLoading = false;
        state.reviewError = "Error";
      }),
      builder.addCase(dispatchPostReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewMessage =
          typeof action.payload !== "string" ? "" : action.payload;
      });
    builder.addCase(getLocation.rejected, (state, action) => {
      state.pinCodeError = true;
      state.pinCodeErrorMessage = "Something went wrong. Please try again.";
      state.locationLoading = false;
    });
    builder.addCase(getLocation.fulfilled, (state, action) => {
      // state.locationLoading = false;
    });
  },
});

export const {
  updateProductDetailLoading,
  updatePinCodeLoading,
  updateReviewsLoading,
  updateProductDetailData,
  updatePinCodeData,
  updatePinCodeError,
  updateReviewsData,
  updateReviewsMoreData,
  updateReviewsError,
  resetReviewData,
  updateOosLoading,
  updatePostReviewLoading,
  updateLocationLoading,
} = productDetailInfoSlice.actions;

export default productDetailInfoSlice.reducer;
