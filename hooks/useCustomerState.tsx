import { getCookie } from "@/helpers/defaultHeaders";
import { fetchCarts } from "@/redux/slices/cartInfo";
import { updateIsRTL } from "@/redux/slices/pageInfo";
import {
  fetchUserDetails,
  updateUserData,
  updateUserDetails,
} from "@/redux/slices/userInfo";
import { updateWishListIds } from "@/redux/slices/wishListInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface useCustomerStateType {
  useMounted: boolean;
  userData: any;
  SsrUserData?: DataType;
}

const useCustomerState = ({
  useMounted,
  userData,
  SsrUserData,
}: useCustomerStateType) => {
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const sessionId = getCookie(
    `clientV1_${process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase?.()}`
  );
  // console.log("userData for user ============================>", userData);
  useEffect(() => {
    setMounted(true);
    dispatch(
      updateIsRTL(process.env.NEXT_PUBLIC_DIRECTION === "RTL" ? true : false)
    );
  }, []);

  useEffect(() => {
    if ((useMounted ? mounted : true) && sessionId) {
      dispatch(
        updateUserData({
          userError: false,
          userErrorMessage: "",
          userLoading: false,
          sessionId: sessionId,
          isLogin: userData?.isLoggedIn,
          mobileNumber: userData?.customerMobile
            ? userData?.customerMobile
            : null,
          email: userData?.customerEmail ? userData?.customerEmail : null,
          cartId: userData?.cartIds ? userData?.cartIds : null,
          cartItemCount: userData?.itemsCount ? userData?.itemsCount : 0,
          isWhatsappOptingLoading: userInfo.isWhatsappOptingLoading,
          whatsAppOptingStatus: userInfo.whatsAppOptingStatus,
          isGuestFlow: userInfo.isGuestFlow,
          guestEmail: userInfo.guestEmail,
          guestNumber: userInfo.guestNumber,
          whatsAppChecked: userInfo.whatsAppChecked,
        })
      );
      dispatch(
        updateWishListIds({
          productIds: userData?.wishlist,
        })
      );

      if (
        !SsrUserData?.isError &&
        SsrUserData &&
        Object.keys(SsrUserData).length
      ) {
        dispatch(updateUserDetails(SsrUserData || {}));
      }
    }
  }, [
    dispatch,
    mounted,
    useMounted,
    userData,
    userData?.isLoggedIn,
    sessionId,
  ]);

  useEffect(() => {
    if (useMounted ? mounted : true) {
      // console.log(first)
      if (sessionId && userData?.isLoggedIn) {
        dispatch(fetchUserDetails({ sessionId: sessionId }));
      }
      if (sessionId)
        dispatch(fetchCarts({ sessionId: sessionId, initial: true }));
    }
  }, [
    dispatch,
    mounted,
    useMounted,
    userData,
    userData?.isLoggedIn,
    sessionId,
  ]);

  const mountedState = useMounted ? mounted : true;
  return {
    mounted: mountedState,
  };
};

export default useCustomerState;
