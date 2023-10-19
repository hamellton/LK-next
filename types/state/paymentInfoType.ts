import { DataType } from "../coreTypes";

export interface PaymentInfoType {
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  payment: any;
  deliveryOptions: any;
  shippingAddress: any;
  paymentDetails: { order: any; payment: any };
  jusPayInitiated?: boolean;
  jusPayData?: DataType | null;
  jusPaymentStatusLoading?: boolean;
  jusPaymentStatusData?: DataType | null;
  isValidVpa: "";
  vpaPaymentLoading: boolean;
  upiTransactionStatus: string;
  validateCodOtpInfo: any;
  paymentMethods: any;
  savedCards: any;
  disableAllExceptQr?: boolean;
  qrCodeData: {
    data: {
      code: string;
      amount: number;
    };
    qrDataLoading: boolean;
    error: {
      isError: boolean;
      errorMsg: string;
    };
  };
}
