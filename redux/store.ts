import productDetailInfoSlice from "./slices/productDetailInfo";
import userInfoSlice from "./slices/userInfo";
import pageInfoSlice from "./slices/pageInfo";
import { configureStore } from "@reduxjs/toolkit";
import categoryInfoSlice from "./slices/categoryInfo";
import cartInfoSlice from "./slices/cartInfo";
import searchBarInfoSlice from "./slices/searchbar";
import packagesInfo from "./slices/packagesInfo";
import paymentInfoSlice from "./slices/paymentInfo";
import wishListInfo from "./slices/wishListInfo";
import authInfoSlice from "./slices/auth";
import { useDispatch } from "react-redux";
import dittoSlice from "./slices/ditto";
import orderInfoSlice from "./slices/orderInfo";
import marketingSubscriptionInfoSlice from "./slices/marketingsubscription";
import myAccountInfoSlice from "./slices/myaccount";
import saveCardInfoSlice from "./slices/savedCard";
import checkBalanceInfoSlice from "./slices/checkBalance";
import prescriptionInfoSlice from "./slices/prescription";
import checkStoreCreditInfoSlice from "./slices/storeCredit";
import myOrderInfoSlice from "./slices/myorder";
import userPowerInfoSlice from "./slices/userPowerInfo";
import pidFromQrInfoSlice from "./slices/pidQrInfo";
import studioFlowSlice from "./slices/studioflow";
import primerSlice from "./slices/primer";
import algoliaSearchSlice  from "./slices/algoliaSearch";

export const store = configureStore({
  devTools: true,
  reducer: {
    pageInfo: pageInfoSlice,
    userInfo: userInfoSlice,
    categoryInfo: categoryInfoSlice,
    productDetailInfo: productDetailInfoSlice,
    cartInfo: cartInfoSlice,
    packageInfo: packagesInfo,
    wishListInfo: wishListInfo,
    authInfo: authInfoSlice,
    paymentInfo: paymentInfoSlice,
    dittoInfo: dittoSlice,
    searchBarData: searchBarInfoSlice,
    orderInfo: orderInfoSlice,
    marketingSubscriptionInfo: marketingSubscriptionInfoSlice,
    myAccountInfo: myAccountInfoSlice,
    saveCardInfo: saveCardInfoSlice,
    checkBalanceInfo: checkBalanceInfoSlice,
    prescriptionInfo: prescriptionInfoSlice,
    checkStoreCreditInfo: checkStoreCreditInfoSlice,
    myOrderInfo: myOrderInfoSlice,
    userPowerInfo: userPowerInfoSlice,
    pidFromQrData: pidFromQrInfoSlice,
    studioFlowInfo: studioFlowSlice,
    primerInfo: primerSlice,
    algoliaSearch:algoliaSearchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
