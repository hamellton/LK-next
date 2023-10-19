export interface StoreCreditState {
	isLoading?: boolean;
	isError?: boolean;
	errorMessage?: string;
	data: any;
	storeCreditOrderList: any;
	storeCreditOrderHistoryList: any;
	getStoreCreditCodeBySms: any;
	numOfOrders?: string | number;
	getStoreCreditCodeBySmsCode: number | string | undefined;
}
