import { updateCartData } from "@/redux/slices/cartInfo";
import { APIMethods } from "@/types/apiTypes";
import { paymentFunctions } from "@lk/core-utils";
import { APIService, localStorageHelper, RequestBody } from "@lk/utils";
import { getCookie, headerArr } from "helpers/defaultHeaders";

interface PaymentPayloadType {
  device: string;
  leadSource: string | null;
  isWebNewArch: boolean;
  nonFranchiseOrder?: boolean;
  orderId?: number | null;
  isWebNewArch: boolean;
  paymentInfo: {
    card?: {
      cardBrand: string | null;
      cardMode: string | null;
      cardToken?: string;
      cardType?: string;
      cvv?: string;
      expired?: boolean | null;
      expiryMonth?: string | null;
      expiryYear?: string | null;
      nameOnCard?: string | null;
      number?: string | null;
      oneClick: boolean;
      oneClickToken: string | null;
      storeCard?: boolean;
    };
    gatewayId?: string | null;
    netbanking?: {
      bankCode?: string;
    };
    partialPaymentInfo?: {
      partialPayment: boolean;
      partialPaymentAmount: number;
      partialPaymentMethod: string | null;
    };
    paymentMethod: string;
    upiFlowType?: string | null;
    poNumber?: string | null;
    subscriptionOrderId?: string | null;
    primerClientSessionToken?: string;
    saveCard?: boolean;
  };
  consent?: any;
}

const getCardPayload = (
  cvv: string,
  expiryMonth: string,
  expiryYear: string,
  nameOnCard: string,
  cardNumber: string,
  storeCard: boolean,
  orderId?: number
) => {
  return {
    device: "desktop",
    leadSource: getCookie("leadSource")
      ? `${localStorageHelper.getItem("preSalesInfo").attrs.preSalesUserId}|`
      : null, // CHECK
    isWebNewArch: true,
    nonFranchiseOrder: getCookie("leadSource"), // CHECK
    orderId: orderId || null, // "1930480038",
    paymentInfo: {
      card: {
        cardBrand: null,
        cardMode: null,
        cvv: cvv,
        expired: null,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        nameOnCard: nameOnCard,
        number: cardNumber,
        oneClick: false,
        oneClickToken: null,
        storeCard: storeCard,
      },
      gatewayId: "PU",
      netbanking: {
        // bankCode: currCardData?.netBankingBank,
      },
      partialPaymentInfo: {
        partialPayment: false,
        partialPaymentAmount: 0,
        partialPaymentMethod: null,
      },
      paymentMethod: "cc",
      // poNumber: currCardData?.value !== "" ? currCardData?.value : null,
      subscriptionOrderId: null,
    },
  };
};

const getSavedCardPayload = (
  paymentCardName: string,
  paymentCardNum: string,
  storeCard: boolean,
  value: string,
  cardToken: string,
  cardType: string,
  cvv: string,
  cardBrand?: string,
  cardMode?: string,
  expired?: string,
  paymentCardExpiry?: string,
  orderId?: number
) => {
  return {
    device: "desktop",
    leadSource: getCookie("leadSource")
      ? `${localStorageHelper.getItem("preSalesInfo").attrs.preSalesUserId}|`
      : null, // CHECK
    isWebNewArch: true,
    nonFranchiseOrder: getCookie("leadSource"), // CHECK
    orderId: orderId || null, // "1930480038",
    paymentInfo: {
      card: {
        cardBrand: cardBrand || null,
        cardMode: cardMode || null,
        cardToken: cardToken,
        cardType: cardType,
        cvv: cvv,
        expired: expired || null,
        expiryMonth: paymentCardExpiry && paymentCardExpiry.substring(0, 2),
        expiryYear: paymentCardExpiry && paymentCardExpiry.slice(-4),
        nameOnCard: paymentCardName,
        number: paymentCardNum,
        oneClick: false,
        oneClickToken: null,
        storeCard: storeCard,
      },
      gatewayId: "PU",
      netbanking: {
        // bankCode: netBankingBank,
      },
      partialPaymentInfo: {
        partialPayment: false,
        partialPaymentAmount: 0,
        partialPaymentMethod: null,
      },
      paymentMethod: "cc",
      poNumber: value !== "" ? value : null,
      subscriptionOrderId: null,
    },
  };
};

const getNormalPaymentPayload = (
  paymentMethod: string,
  gatewayId?: string,
  bankCode?: string,
  upiFlowType?: string,
  deviceType?: string,
  orderId?: number,
  primerClientSessionToken?: string,
  saveCard?: boolean,
  consent?: any
) => {
  const data: PaymentPayloadType = {
    device: deviceType ?? "desktop",
    leadSource: getCookie("leadSource")
      ? `${localStorageHelper.getItem("preSalesInfo").attrs.preSalesUserId}|`
      : null, // CHECK
    isWebNewArch: true,
    nonFranchiseOrder: getCookie("leadSource"), // CHECK
    orderId: orderId || null, // "1930480038",
    paymentInfo: {
      card: {
        cardBrand: null,
        cardMode: null,
        expired: null,
        oneClick: false,
        oneClickToken: null,
      },
      // gatewayId: "PU",
      netbanking: {
        // bankCode: currCardData?.netBankingBank,
      },
      partialPaymentInfo: {
        partialPayment: false,
        partialPaymentAmount: 0,
        partialPaymentMethod: null,
      },
      paymentMethod: paymentMethod,
      upiFlowType: upiFlowType || null,
      primerClientSessionToken,
      saveCard,
      // poNumber: currCardData?.value !== "" ? currCardData?.value : null,
      subscriptionOrderId: null,
    },
    consent: consent || null,
  };
  if (gatewayId) data.paymentInfo.gatewayId = gatewayId;
  if (bankCode && data.paymentInfo.netbanking)
    data.paymentInfo.netbanking.bankCode = bankCode;
  return data;
};

const getFullScCheckoutPayload = () => {
  return {
    device: "desktop",
    leadSource: getCookie("leadSource")
      ? `${localStorageHelper.getItem("preSalesInfo").attrs.preSalesUserId}|`
      : null, // CHECK
    isWebNewArch: true,
    nonFranchiseOrder: getCookie("leadSource"), // CHECK
    paymentInfo: {
      paymentMethod: "sc",
    },
  };
};

export const paymentPayload = {
  getCardPayload,
  getSavedCardPayload,
  getNormalPaymentPayload,
  getFullScCheckoutPayload,
};

export enum CardTypeENUM {
  STORE_CREDIT = "STORE CREDIT",
  BANK_OFFERS = "BANK OFFERS",
  CARD_WALLETS = "CARD WALLETS",
  UPI = "UPI",
  UPI_QR = "UPI QR",
  SAVED_CARD = "SAVED CARD",
  CASH_ON_DELIVERY = "CASH ON DELIVERY",
  NO_CARD = "NO CARD",
  PAYMENT_CARD = "PAYMENT_CARD",
  PAY_LATER = "PAY_LATER",
}

export function getCardTypes(key: string, groupId: string) {
  if (groupId === "UPI") {
    switch (key) {
      case "qrcode_payu":
        return CardTypeENUM.UPI_QR;
      case "paytm_cc":
        return CardTypeENUM.UPI;
      default:
        return CardTypeENUM.UPI;
    }
  } else if (groupId === "primer atome" || groupId === "atome") {
    return CardTypeENUM.PAY_LATER;
  } else {
    switch (key) {
      case "cc":
        return CardTypeENUM.CARD_WALLETS;
      case "sc":
        return CardTypeENUM.STORE_CREDIT;
      case "cod":
        return CardTypeENUM.CASH_ON_DELIVERY;
      case "qrcode_payu":
        return CardTypeENUM.UPI_QR;
      case "paytm_cc":
        return CardTypeENUM.UPI;
      case "PAYMENT_CARD":
      case "payment_card":
        return CardTypeENUM.PAYMENT_CARD;
      default:
        return CardTypeENUM.UPI;
    }
  }
}
export function getGroupEligibility(groupId: string, hideAllExceptSc: boolean) {
  if (hideAllExceptSc && groupId !== "sc") return false;
  switch (groupId) {
    case "cc":
    case "cc/dc":
    case "UPI":
    case "nb":
    case "amazonpay_payu":
    case "airtel_money_payu":
    case "cod":
    case "sc":
    case "Recommended":
      return true;
    default:
      return false;
  }
}
export function getCardEligibility(code: string) {
  switch (code) {
    case "cod":
    case "payuwallet":
    case "cc":
    case "nb":
    case "sc":
    case "paytm_cc":
    case "cod":
    case "PAYMENT_CARD":
    case "ATOME":
    case "HOOLAH":
      return true;
    default:
      return false;
  }
}

export const bankOfferData = [
  {
    head: "Bank Offers",
    offers: [
      "10% Cashback upto ₹200 on Ola Money Postpaid or wallet transaction on a min spend of Rs 1000 . TCA",
      "20% info data",
    ],
    onShowMore: () => null,
    showAll: false,
  },
];

export enum CallBackType {
  fullSc = "FULL_SC",
  gv = "GV",
  null = "NULL",
}
// export function getSubmitFunction(key: string) {
//     if(key === "cc") return (cardNumber: string, nameOnCard: string, expiryMonth: string, expiryYear: string, cvv: string, storeCard: boolean) => cardSubmitHandler(cardNumber, nameOnCard, expiryMonth, expiryYear, cvv, storeCard);
//     if(key === "qrcode_payu") return (paymentMethod: string, paymentGateway: string) => normalPaymentHandler(paymentMethod, paymentGateway);
//     if(key === "cod") return (paymentMethod: string) => normalPaymentHandler(paymentMethod);
//     if(key === "nb") return (paymentMethod: string, bankCode: string) => netbankingHandler(paymentMethod, bankCode);
//     if(key === "sc") return (code: string, amount: number) => storeSubmitHandler(code, amount);
//     return (paymentMethod: string, gatewayId: string) => upiPaymentHandler(paymentMethod, gatewayId);
//   }
