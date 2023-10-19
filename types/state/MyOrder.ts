import { DataType } from "../coreTypes";

export interface MyOrderType {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  orderListingData: any;
  allOrderListingData: DataType[];
  totalOrderCount?: number;
  confirmOrderSuccess: {
    isSuccess: boolean;
    orderId: number | string;
  };
  orderData: any;
  page: number;
  hasMoreOrders: boolean;
  updateShippingAddress: {
    isSuccess: boolean;
  };
  fetchOrderListingDataInfo: {
    isError: boolean;
    errorMessage: string;
  };
}
