import { ErrorType } from "../baseTypes";

export interface PrimerInfoType {
  isLoading: boolean;
  isPrimerActive: boolean;
  isScriptAdded: boolean;
  token: string;
  error: ErrorType;
  paymentMethods: any;
  status: {
    orderId: string;
    status: string;
  };
}
