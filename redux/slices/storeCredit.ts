import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIService } from '@lk/utils';
import { headerArr } from 'helpers/defaultHeaders';
import { APIMethods } from '@/types/apiTypes';
import { storeCreditFunction } from '@lk/core-utils';
import { StoreCreditState } from '@/types/state/storeCreditType';

const initialState: StoreCreditState = {
	isLoading: true,
	isError: false,
	errorMessage: '',
	data: [],
	storeCreditOrderList: [],
	storeCreditOrderHistoryList: [],
    getStoreCreditCodeBySms: '',
	getStoreCreditCodeBySmsCode: undefined,
	numOfOrders: 0
};

export const checkStoreCrditBalance = createAsyncThunk(
	'checkStoreCrditBalance',
	async (reqObj: { sessionId: string; query: string }, thunkAPI) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.GET);
		try {
			const { data: result, error } = await storeCreditFunction.checkStoreCreditBalance(api, reqObj.query);
			thunkAPI.dispatch(updatePayLoading(false));
			if (!error.isError) {
				return result.result;
			} else {
				thunkAPI.dispatch(updatePayError({ error: true, errorMessage: error.message }));
			}
		} catch (err) {
			return { error: true };
		}
	}
);

export const fetchStoreCreditOrderList = createAsyncThunk(
	'storeCreditOrderList',
	async (reqObj: { sessionId: string; query: string, itemsPerPage: number }, thunkAPI) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.GET);
		try {
			const { data: result, error } = await storeCreditFunction.storeCreditOrderList(api, reqObj.query, reqObj.itemsPerPage);
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

export const storeCreditOrderHistory = createAsyncThunk(
	'storeCreditOrderHistory',
	async (reqObj: { sessionId: string; query: string }, thunkAPI) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.GET);
		try {
			const { data: result, error } = await storeCreditFunction.storeCreditOrderHistory(api, reqObj.query);
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

export const getStoreCreditCodeBySMS = createAsyncThunk(
	'getStoreCreditCodeBySMS',
	async (reqObj: { sessionId: string; query: string }, thunkAPI) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.GET);
		try {
			const { data: result, error } = await storeCreditFunction.getStoreCreditCodeBySMS(api, reqObj.query);
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


export const checkStoreCreditInfoSlice = createSlice({
	name: 'checkStoreCreditInfo',
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
		builder.addCase(checkStoreCrditBalance.fulfilled, (state, action) => {
			state.data = action.payload;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
		builder.addCase(fetchStoreCreditOrderList.fulfilled, (state, action) => {
			state.storeCreditOrderList = action.payload?.result?.orderList;
			state.numOfOrders = action.payload?.result?.numOfOrders;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
		builder.addCase(storeCreditOrderHistory.fulfilled, (state, action) => {
			state.storeCreditOrderHistoryList = action.payload.result;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
        builder.addCase(getStoreCreditCodeBySMS.fulfilled, (state, action) => {
			state.getStoreCreditCodeBySms = action.payload.result;
			state.getStoreCreditCodeBySmsCode = action.payload.status;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
	}
});

export const { updatePayLoading, updatePayError } = checkStoreCreditInfoSlice.actions;

export default checkStoreCreditInfoSlice.reducer;
