export interface onCheckoutCompleteType {
  payment: PrimerPaymentType;
}

export interface onCheckoutFailType extends onCheckoutCompleteType {
  error: PrimerErrorType;
  handler: any;
}

export type PrimerErrorType = {
  code: string;
  message: string;
  diagnosticsId: string;
};

export type PrimerPaymentType = {
  id: string;
  orderId: string;
  paymentMethodData: PrimerPaymentMethodType[];
};

export type PrimerPaymentMethodType = {
  type: string;
  managerType: managerTypeEnum;
};

enum managerTypeEnum {
  CARD = "CARD",
  NATIVE = "NATIVE",
  REDIRECT = "REDIRECT",
}

export enum MethodsToShow {
  PAYMENT_CARD = "PAYMENT_CARD",
  NATIVE = "NATIVE",
  REDIRECT = "REDIRECT",
  ATOME = "ATOME",
  HOOLAH = "HOOLAH",
}

export interface showPaymentMethodsUIType {
  methodToShow: MethodsToShow[];
}

export interface configureCardFormType {
  headless: any;
  orderPayment: any;
  primerToken: string;
  device: string;
  orderId: string;
  consent?: boolean;
}
