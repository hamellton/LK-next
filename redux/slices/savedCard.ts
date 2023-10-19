import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIService } from '@lk/utils';
import { headerArr } from 'helpers/defaultHeaders';
import { APIMethods } from '@/types/apiTypes';
import { saveCardFunctions } from '@lk/core-utils';
import { SaveCardType } from '@/types/state/savedCardType';
import { action } from '@storybook/addon-actions';

const initialState: SaveCardType = {
	isLoading: true,
	isError: false,
	errorMessage: '',
	data: [],
	isDeletedSavedCardSuccess: false
};

export const savedCardData = createAsyncThunk(
	'savedCardData',
	async (reqObj: { sessionId: string; query?: string }, thunkAPI) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.GET);
		try {
			const { data: result, error } = await saveCardFunctions.fetchSavedCardData(api, reqObj.query || 'PU');
			thunkAPI.dispatch(updatePayLoading(false));
			if (!error.isError) {
				return result.result.savedCards;
			} else {
				thunkAPI.dispatch(updatePayError({ error: true, errorMessage: error.message }));
			}
		} catch (err) {
			return { error: true };
		}
	}
);

export const deleteSavedCardData = createAsyncThunk(
	'deleteSavedCardData',
	async (reqObj: { sessionId: string; cardToken: string; email: string }, thunkAPI) => {
		thunkAPI.dispatch(updatePayLoading(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.DELETE);
		try {
			const { data: result, error } = await saveCardFunctions.deleteSavedCardData(
				api,
				reqObj.cardToken,
				reqObj.email
			);
			thunkAPI.dispatch(updatePayLoading(false));
			if (!error.isError) {
				return result.result.savedCards;
			} else {
				thunkAPI.dispatch(updatePayError({ error: true, errorMessage: error.message }));
			}
		} catch (err) {
			return { error: true };
		}
	}
);

export const saveCardInfoSlice = createSlice({
	name: 'saveCardInfo',
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
		builder.addCase(savedCardData.fulfilled, (state, action) => {
			state.data = action.payload;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
		builder.addCase(deleteSavedCardData.fulfilled, (state, action) => {
			state.isDeletedSavedCardSuccess = true;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
			state.data = action.payload;
		});
	}
});

export const { updatePayLoading, updatePayError } = saveCardInfoSlice.actions;

export default saveCardInfoSlice.reducer;
