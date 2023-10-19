import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIService } from '@lk/utils';
import { headerArr } from 'helpers/defaultHeaders';
import { APIMethods } from '@/types/apiTypes';
import { checkVoucherFunctions } from '@lk/core-utils';
import { BalanceCheckState } from '@/types/state/CheckBalanceType';

const initialState: BalanceCheckState = {
	isLoading: true,
	isError: false,
	errorMessage: '',
	data: []
};

export const checkBalance = createAsyncThunk(
	'checkBalance',
	async (reqObj: { sessionId: string; query: string }, thunkAPI) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.GET);
		try {
			const { data: result, error } = await checkVoucherFunctions.checkVoucherBalance(api, reqObj.query);
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

export const checkBalanceInfoSlice = createSlice({
	name: 'checkBalanceInfo',
	initialState,
	reducers: {
		resetCheckBalance: (state) => {
			state.isLoading = true;
			state.isError = false;
			state.errorMessage = '';
			state.data = [];
		},
		updatePayLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		updatePayError: (state, action: PayloadAction<{ error: boolean; errorMessage: string }>) => {
			state.isError = action.payload.error;
			state.errorMessage = action.payload.errorMessage;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(checkBalance.fulfilled, (state, action) => {
			if (action.payload) {
				state.data = action.payload;
				state.isLoading = false;
				state.isError = false;
				state.errorMessage = '';
			}
		});
	}
});

export const { resetCheckBalance, updatePayLoading, updatePayError } = checkBalanceInfoSlice.actions;

export default checkBalanceInfoSlice.reducer;
