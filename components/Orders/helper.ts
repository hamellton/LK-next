
export function formatDate(time: number, pattern: string, year = "") {
  let formattedString = "";
  if (isNaN(time)) return "";
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(time).getDate();
  const day = new Date(time).getDay();
  const month = new Date(time).getMonth();
  formattedString = pattern.replace("EEE", days[day].substr(0, 3));
  formattedString = formattedString.replace("MMM", months[month].substr(0, 3));
  // In case of December, Date will replace on second D other than Dec
  if (month === 11 && pattern.includes("D")) {
    const firstPart = formattedString.substr(0, pattern.indexOf("D"));
    const lastPart = formattedString.substr(pattern.indexOf("D") + 1);
    formattedString = firstPart + date + lastPart;
  } else {
    formattedString = formattedString.replace("D", date as any);
  }
  if (year) {
    formattedString = formattedString.concat(
      " " + new Date(time).getFullYear()
    );
  }
  return formattedString;
}

export const getPendingStatus = (
  pendingOrderStatus: string,
  powerRequired: string,
  dataLocale: any,
  createdAt: number,
  isSeamless: boolean
) => {
  const pendingStatusObj: any = {};
  const {
    PAYMENT_AND_POWER_PENDING,
    COMPLETE_PAYMENT_AND_POWER_PENDING,
    COD_AND_POWER_PENDING,
    COMPLETE_COD_AND_POWER_PENDING,
    POWER_PENDING,
    SUBMIT_POWER_TEXT,
    PAYMENT_PENDING,
    COMPLETE_PAYMENT,
    COD_PENDING,
    CONFIRM_COD,
    WE_ARE_CONFIRMING_PAYMENT_FOR_YOUR_ORDER,
    ORDER_CONFIRMATION_PENDING,
    INSURER_ORDER_PENDING,
    WILL_KEEP_YOU_UPDATED,
  } = dataLocale;

  let pendingPaymentBuffer;
  if (pendingOrderStatus === "pendingOnInsurer") {
    pendingStatusObj.title = ORDER_CONFIRMATION_PENDING;
    pendingStatusObj.subTitle = `${INSURER_ORDER_PENDING} ${WILL_KEEP_YOU_UPDATED}`;
    return pendingStatusObj;
  }
  if (pendingOrderStatus === "pendingPayment") {
    const presentDate = new Date();
    const datesDifference = presentDate.getTime() - createdAt;
    pendingPaymentBuffer =
      Math.floor(datesDifference / 1000 / 60) <= 30 && !isSeamless;
  }
  if (powerRequired === "POWER_REQUIRED") {
    pendingStatusObj.title = PAYMENT_AND_POWER_PENDING;
    if (pendingOrderStatus === "pendingPayment") {
      if (pendingPaymentBuffer) {
        pendingStatusObj.subTitle = WE_ARE_CONFIRMING_PAYMENT_FOR_YOUR_ORDER;
      } else {
        pendingStatusObj.subTitle = COMPLETE_PAYMENT_AND_POWER_PENDING;
      }
    } else if (pendingOrderStatus === "cod") {
      pendingStatusObj.title = COD_AND_POWER_PENDING;
      pendingStatusObj.subTitle = COMPLETE_COD_AND_POWER_PENDING;
    } else {
      pendingStatusObj.title = POWER_PENDING;
      pendingStatusObj.subTitle = SUBMIT_POWER_TEXT;
    }
  } else if (pendingOrderStatus === "pendingPayment") {
    pendingStatusObj.title = PAYMENT_PENDING;
    if (pendingPaymentBuffer) {
      pendingStatusObj.subTitle = WE_ARE_CONFIRMING_PAYMENT_FOR_YOUR_ORDER;
    } else {
      pendingStatusObj.subTitle = COMPLETE_PAYMENT;
    }
  } else if (pendingOrderStatus === "cod") {
    pendingStatusObj.title = COD_PENDING;
    pendingStatusObj.subTitle = CONFIRM_COD;
  }
  return pendingStatusObj;
};
declare global {
  interface Window {
    chatBotParams: any;
    sprChat: (name: string, object: any) => void;
  }
}

export function onNeedHelpClickHandler(id: number) {
  window.setTimeout(() => {
    window &&
      window.sprChat &&
      window.sprChat("openNewConversation", {
        conversationContext: {
          _c_6216101a55e837709d0a6190: [id], // order ID from each need help button
          _c_62a1a4e3d7c1ad35cd4ae0d8: ["TRUE"], // triggeredByOrderButton
        },
        initialMessages: [{ message: "Need Help", isSentByUser: true }],
        id: id, // MANDATORY, order ID from each need help button
      });
  }, 2000);
}

export const filterTrackingStatus = (item: any, EARLY: string) => {
  const {
    statusHistory = [],
    itemTracking: {
      courierTrackingUrl = "",
      statusLabel = "",
      histories = [],
    } = {},
  } = item;
  let currentStatus: any;
  let hasDelivered: boolean = false;
  let statusObj: any;
  let arrivedEarlyText: string = "";
  const historiesLen = histories.length;
  if (historiesLen) {
    for (let i = 0; i < historiesLen; i++) {
      statusObj = histories[i];
      const { status, current, createdAt, isEarly } = statusObj;
      if (
        ["DELIVERED_AT_STORE", "DELIVERED_TO_CUSTOMER"].includes(status) &&
        createdAt
      ) {
        hasDelivered = true;
      }
      if (current) {
        if (isEarly) {
          arrivedEarlyText = EARLY;
        }
        currentStatus = statusObj;
        break;
      }
    }
  } else {
    hasDelivered = statusHistory.some(
      (history: any) => history.status === "DELIVERED"
    );
    currentStatus = {
      statusLabel: statusLabel,
      courierTrackingUrl: courierTrackingUrl,
    };
  }
  return {
    currentStatus,
    hasDelivered: hasDelivered,
    arrivedEarlyText: arrivedEarlyText,
  };
};
