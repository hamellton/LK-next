import {
  cartData,
  eligibility,
  getCartData,
  getCartDataWallet,
  getNearByStore,
  orderDetailInv,
  returnMethod,
  returnResponse,
  saveShippingAddress,
  setCurrentreturnItem,
  userAddress,
} from "@/redux/slices/orderInfo";
import { fetchUserDetails } from "@/redux/slices/userInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import { Checkout } from "@lk/ui-library";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Exchange from "./Exchange";
import ReturnAdd from "./ReturnAdd";
import { returnConfig } from "./returnConfig";
import ReturnMethod from "./ReturnMethod";
import SelectReason from "./SelectReason";
import SideBar from "./SideBar";
import StoreSideBar from "./StoreSideBar";
import { BackdropContainer, LeftOuter, Root, RootBox, Sidebar } from "./styles";

export default function OrderPage({ userdata, configData, localeData }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [returnResp, setReturnResp] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [orderDetail, setOrderDetail] = useState<any>("");
  const [Eligibility, setEligibility] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [storeSidebar, setStoreSidebar] = useState(false);
  const [isExpandable, setIsExpandable] = useState("SELECT_REASON");
  const [orderId, setOrderId] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [returnStepInfo, setReturnStepInfo] = useState<any>("");

  useEffect(() => {
    let getReturnStep: DataType = {};
    if (localStorage.getItem("returnStep")) {
      getReturnStep = JSON.parse(localStorage.getItem("returnStep") || "");
      // dispatch(
      //   cartData({
      //     sessionId: `${getCookie(`clientV1_${country}`)}`,
      //     exchangeMethod: getReturnStep.exchangeMethod,
      //     itemId: Number(getCookie("postcheckItemId")),
      //     orderId: Number(getCookie("postcheckOrderId")),
      //   })
      // );
      setReturnStepInfo(getReturnStep);
    }

    if (localStorage.getItem("ShippingAddress")) {
      const getShippingAddress = JSON.parse(
        localStorage.getItem("ShippingAddress") || ""
      );
      setShippingAddress(getShippingAddress || {});
    }
    setIsExpandable(getReturnStep.isExpandable || "SELECT_REASON");
  }, []);

  // const orderId: any = getCookie("postcheckOrderId");
  // const itemId = getCookie("postcheckItemId");

  const {
    returnResponseResult,
    orderDetailInvResult,
    eligibilityInfo,
    cartInfo,
    userAddresses,
    storeList,
    currentReturnItem,
    cartInfoWallet,
  } = useSelector((state: RootState) => state.orderInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const router = useRouter();
  const { exchange } = router.query;

  useEffect(() => {
    if (exchange && exchange.length) {
      setCookie("postcheckOrderId", exchange[0]);
      setOrderId(parseInt(exchange[0]));
      setCookie("postcheckItemId", exchange[1]);
    }
  }, [exchange]);

  useEffect(() => {
    if (userdata && orderId !== 0) {
      const sessionId = `${getCookie(`clientV1_${pageInfo.country}`)}`;
      dispatch(
        returnResponse({
          classification: "eyeframe",
          sessionId: sessionId,
        })
      );
      dispatch(
        eligibility({
          orderId: orderId,
          sessionId: sessionId,
        })
      );
      dispatch(
        orderDetailInv({
          orderId: orderId,
          sessionId: sessionId,
        })
      );
      // dispatch(
      //   getCartData({
      //     sessionId: sessionId,
      //   })
      // );

      dispatch(getCartDataWallet({ sessionId: sessionId }));
      dispatch(
        userAddress({
          sessionId: sessionId,
        })
      );
      dispatch(fetchUserDetails({ sessionId: sessionId }));
    }
  }, [userdata, orderId, dispatch]);

  useEffect(() => {
    if (orderDetailInvResult) {
      localStorage.setItem(
        "returnUserAddress",
        JSON.stringify(orderDetailInvResult.orders[0].billingAddress)
      );
      dispatch(
        returnMethod({
          pincode: orderDetailInvResult.orders[0].billingAddress.postcode,
          sessionId: `${getCookie(`clientV1_${pageInfo.country}`)}`,
        })
      );
      dispatch(
        getNearByStore({
          address: orderDetailInvResult.orders[0].billingAddress.postcode,
          radius: 20,
          pageSize: 10,
          pageNumber: 0,
          sessionId: `${getCookie(`clientV1_${pageInfo.country}`)}`,
        })
      );
      setReturnResp(returnResponseResult);
      setOrderDetail(orderDetailInvResult);
      setEligibility(eligibilityInfo);
    }
  }, [returnResponseResult, orderDetailInvResult, eligibilityInfo, dispatch]);

  useEffect(() => {
    if (currentReturnItem) {
      if (shippingAddress) {
        dispatch(
          saveShippingAddress({
            sessionId: `${getCookie(`clientV1_${pageInfo.country}`)}`,
            shippingAddress: shippingAddress,
          })
        );
      }
    }
  }, [currentReturnItem, dispatch, shippingAddress]);

  // console.log(userdata);
  const buttonClicked = (userInfo: any) => {
    const sessionId = `${getCookie(`clientV1_${pageInfo.country}`)}`;
    if (isExpandable === "RETURN_ADD") {
      dispatch(
        returnMethod({
          pincode: userInfo.postcode,
          sessionId: sessionId,
        })
      );
      dispatch(
        getNearByStore({
          address: userInfo.postcode,
          radius: 20,
          pageSize: 10,
          pageNumber: 0,
          sessionId: sessionId,
        })
      );
      setReturnAddress(userInfo);
      localStorage.setItem("returnUserAddress", JSON.stringify(userInfo));
    } else {
      setShippingAddress(userInfo);
      localStorage.setItem("ShippingAddress", JSON.stringify(userInfo));
      dispatch(
        saveShippingAddress({
          sessionId: `${getCookie(`clientV1_${pageInfo.country}`)}`,
          shippingAddress: userInfo,
        })
      );
    }
    closeSidebar();
  };
  const closeSidebar = () => {
    setSidebar(false);
    setStoreSidebar(false);
  };
  const OpenSidebar = () => {
    setSidebar(true);
  };

  const StorebuttonClicked = (val: any) => {
    // console.log(val);
  };

  return (
    <div>
      <BackdropContainer disabled={sidebar} />
      <Sidebar disabled={sidebar}>
        <SideBar
          userInfo={userAddresses}
          onClick={buttonClicked}
          closeSidebar={closeSidebar}
          localeData={localeData}
        />
      </Sidebar>

      <Sidebar disabled={storeSidebar}>
        <StoreSideBar
          stores={storeList.stores}
          onClick={StorebuttonClicked}
          closeSidebar={closeSidebar}
          localeData={localeData}
        />
      </Sidebar>
      {orderDetail && (
        <RootBox>
          <LeftOuter>
            <SelectReason
              eligibility={Eligibility}
              isExpandable={isExpandable}
              setIsExpandable={setIsExpandable}
              localeData={localeData}
            />
            {storeList?.stores?.length &&
            (isExpandable === "RETURN_ADD" || returnStepInfo) ? (
              <ReturnAdd
                returnAddress={
                  returnAddress || orderDetailInvResult.orders[0].billingAddress
                }
                OpenSidebar={OpenSidebar}
                setStoreSidebar={setStoreSidebar}
                isExpandable={isExpandable}
                setIsExpandable={setIsExpandable}
                setReturnStepInfo={setReturnStepInfo}
                configData={localeData}
              />
            ) : null}
            {returnStepInfo && returnStepInfo?.thirdStep ? (
              <ReturnMethod
                returnConfig={returnConfig}
                returnEligibiliyDetails={eligibilityInfo}
                isExpandable={isExpandable}
                setIsExpandable={setIsExpandable}
                setReturnStepInfo={setReturnStepInfo}
                localeData={localeData}
                configData={configData}
              />
            ) : null}
            {returnStepInfo && returnStepInfo?.fourthStep ? (
              <Checkout.Shipping
                OpenSidebar={OpenSidebar}
                isExpandable={isExpandable}
                shippingAddress={shippingAddress}
              />
            ) : null}
          </LeftOuter>
          <Root>
            {orderDetail && orderDetail.orders[0].items[0] && cartInfoWallet ? (
              <Exchange
                // cartTotal={cartInfoWallet?.cartData?.result?.items}
                cartItem={cartInfoWallet}
                selectedReasonComponent={false}
                items={orderDetail.orders[0].items[0]}
                returnEligibiliyDetails={null}
                localeData={localeData}
              />
            ) : null}
          </Root>
        </RootBox>
      )}
    </div>
  );
}
