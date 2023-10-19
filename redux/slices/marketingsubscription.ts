import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIService, RequestBody } from '@lk/utils';
import { headerArr } from 'helpers/defaultHeaders';
import { APIMethods } from '@/types/apiTypes';
import { fetchMarketingSubscriptionFunction } from '@lk/core-utils';
import { marketingSubscriptionType } from '@/types/state/marketingSubscription';

const initialState: marketingSubscriptionType = {
	isLoading: true,
	isError: false,
	errorMessage: '',
	data: []
};

export const marketingSubscriptionData = createAsyncThunk(
	'marketingSubscriptionData',
	async (reqObj: { sessionId: string }, thunkAPI) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.GET);
		try {
			const { data: result, error } = await fetchMarketingSubscriptionFunction.fetchMarketingSubscriptionData(
				api
			);
			thunkAPI.dispatch(updatePayLoading(false));
			if (!error.isError) {
				return result;
			} else {
				thunkAPI.dispatch(updatePayError({ error: true, errorMessage: error.message }));
			}
		} catch (err) {
			return { error: true };
		}
	}
);

export const getMarketingSubscription = createAsyncThunk(
	'getMarketingSubscription',
	async (
		reqObj: { sessionId: string; whatsapp: boolean; sms: boolean; pushNotification: boolean; email: boolean },
		thunkAPI
	) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.POST);
		const body = new RequestBody<{
			whatsapp: boolean;
			sms: boolean;
			pushNotification: boolean;
			email: boolean;
		}>({
			whatsapp: reqObj.whatsapp,
			sms: reqObj.sms,
			pushNotification: reqObj.pushNotification,
			email: reqObj.email
		});
		try {
			const { data: result, error } = await fetchMarketingSubscriptionFunction.getMarketingSubscription(
				api,
				body
			);
			thunkAPI.dispatch(updatePayLoading(false));
			if (!error.isError) {
				return result;
			} else {
				thunkAPI.dispatch(updatePayError({ error: true, errorMessage: error.message }));
			}
		} catch (err) {
			return { error: true };
		}
	}
);

export const marketingSubscriptionInfoSlice = createSlice({
	name: 'marketingSubscriptionInfo',
	initialState,
	reducers: {
		updatePayLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		updatePayError: (state, action: PayloadAction<{ error: boolean; errorMessage: string }>) => {
			state.errorMessage = action.payload.errorMessage;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(marketingSubscriptionData.fulfilled, (state, action) => {
			state.data = action.payload;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
		builder.addCase(getMarketingSubscription.fulfilled, (state, action) => {
			state.data = action.payload;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
	}
});

export const { updatePayLoading, updatePayError } = marketingSubscriptionInfoSlice.actions;

export default marketingSubscriptionInfoSlice.reducer;
