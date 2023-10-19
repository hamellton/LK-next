import { UserPowerFunctions } from '@lk/core-utils';
import { APIService, RequestBody } from '@lk/utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPowerType } from './../../types/state/userPowerType';
import { APIMethods } from '../../types/apiTypes';
import { headerArr } from '../../helpers/defaultHeaders';

const initialState: UserPowerType = {
	isLoading: false,
	isError: false,
	errorMessage: '',
	powertypeList: [],
	prescriptionSavedManual: {}
};

export const getPowerManual = createAsyncThunk(
	'getPowerManual',
	async (reqObj: { sessionId: string; productID: string | number; powerType: string }, thunkAPI) => {
		thunkAPI.dispatch(updateUserPowerData(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.GET);
		const { data: data, error } = await UserPowerFunctions.getPowerDetails(api, reqObj.productID, reqObj.powerType);
		try {
			if (!error.isError) {
				return data;
			} else {
				thunkAPI.dispatch(userPowerDataError(error.message));
			}
		} catch (err) {
			return err;
		}
	}
);

export const putPrescriptionData = createAsyncThunk(
	'putPrescriptionData',
	async (
		reqObj: {
			sessionId: string;
			orderID: string | number;
			itemID: string;
			prescription: any;
			emailID: string;
		},
		thunkAPI
	) => {
		thunkAPI.dispatch(updateUserPowerData(true));
		const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
		api.sessionToken = reqObj.sessionId;
		api.setHeaders(headerArr);
		api.setMethod(APIMethods.PUT);
		const { left, right, userName, imageFileName, powerType } = reqObj.prescription;
		const body = new RequestBody<{
			left: any;
			right: any;
			imageFileName: string;
			powerType: string;
			userName: string;
		}>({
			right: right,
			userName: userName,
			imageFileName: imageFileName,
			powerType: powerType,
			left: left
		});
		try {
			const { data, error } = await UserPowerFunctions.submitPowerManual(
				api,
				reqObj.orderID,
				reqObj.itemID,
				reqObj.emailID,
				body
			);
			thunkAPI.dispatch(updateUserPowerData(false));
			if (error.isError) {
				return { ...data, sessionId: reqObj.sessionId };
			} else {
				thunkAPI.dispatch(userPowerDataError(error.message));
			}
		} catch (err) {
			console.log(err);
		}
	}
);

export const userPowerInfoSlice = createSlice({
	name: 'userPowerInfo',
	initialState,
	reducers: {
		updateUserPowerData: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		userPowerDataError: (state, action: PayloadAction<{ error: boolean; errorMessage: string }>) => {
			state.errorMessage = action.payload.errorMessage;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getPowerManual.fulfilled, (state, action) => {
			state.powertypeList = action.payload;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
		builder.addCase(putPrescriptionData.fulfilled, (state, action) => {
			state.prescriptionSavedManual = action.payload;
			state.isLoading = false;
			state.isError = false;
			state.errorMessage = '';
		});
	}
});

export const { updateUserPowerData, userPowerDataError } = userPowerInfoSlice.actions;

export default userPowerInfoSlice.reducer;
