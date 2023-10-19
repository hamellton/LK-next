import { LOCALE, CONFIG, COOKIE_NAME, SEARCH_FUNNEL } from "@/constants/index";
import { AppDispatch, RootState } from "@/redux/store";
import { APIMethods } from "@/types/apiTypes";
import { CheckoutTypes, DeviceTypes } from "@/types/baseTypes";
import {
  checkoutFunctions,
  fireBaseFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { APIService } from "@lk/utils";
import Checkout from "containers/Checkout/address";
import CheckoutBase from "containers/Checkout/Checkout.component";
import CheckoutSignin from "containers/Checkout/signin";
import CheckoutSignup from "containers/Checkout/signup";
import {
  deleteCookie,
  getCookie,
  hasCookie,
  setCookie,
} from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import useCustomerState from "hooks/useCustomerState";
import { GetServerSideProps } from "next";
import PaymentSummary from "containers/Payment/components/PaymentSummary";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import { PaymentSummaryWrapper } from "pageStyles/Checkout.styles";
import { CheckoutType } from "pageStyles/Checkout.types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dualLogin, resetAuth } from "@/redux/slices/auth";
import { logger } from "@/components/Logger/Logger";
import PresaleLogin from "containers/Checkout/PresaleLogin";
import { updateDeviceType } from "@/redux/slices/pageInfo";
import { CheckoutMobile } from "@lk/ui-library";
import { useRouter } from "next/router";
import Retry from "containers/Checkout/retry";
import { getOrderData, getV2OrderData } from "@/redux/slices/myorder";
import Slider from "@/components/PrescriptionModalV2/Slider";
import { Pages } from "@/components/PrescriptionModalV2/helper";
import {
  resetPrescriptionData,
  resetUpdatePrescriptionDataAdded,
  setPrescriptionPageStatus,
  setStoreLocatorPage,
  updatePrescriptionPage,
  updatePrevPrescriptionPage,
} from "@/redux/slices/prescription";
import CheckoutStudioFlow from "containers/Checkout/studioflow";
import { fetchCarts } from "@/redux/slices/cartInfo";
import PostCheckoutItemsList, {
  Wrapper,
  WrapperFullWidth,
} from "containers/Payment/components/PostCheckoutItemsList";
import MobileCartHeader from "containers/Cart/MobileCartHeader";
import PostCheckoutItemsListMobile from "containers/Payment/components/PostCheckoutItemsListMobile";
import { AddressBody } from "containers/Checkout/address/styles";
import { purchaseInfoGA3, purchaseInfoGA4 } from "helpers/gaFour";
import { userProperties } from "helpers/userproperties";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { successVirtualPageView } from "helpers/virtualPageView";
import CryptoJs from "crypto-js";
import { hideSprinklrBot } from "containers/Base/helper";
import { createAPIInstance } from "@/helpers/apiHelper";

const CheckoutStep = ({
  addressData,
  countryStateData,
  sessionId,
  localeData,
  configData,
  step,
  userData,
  phoneCode,
  oid,
  eid,
}: CheckoutType) => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { orderData, isLoading } = useSelector(
    (state: RootState) => state.myOrderInfo
  );
  const [orderId, setOrderId] = useState(0);
  const [items, setItems] = useState(null);
  const [isStudioflow, setIsStudioflow] = useState(false);
  const [isStudioFlowLoading, setIsStudioFlowLoading] = useState(true);
  const [purchaseActive, setPurchaseActive] = useState(false);
  const [fireGAPurchase, setFireGAPurchase] = useState(false);

  const {
    storeSlots,
    prescriptionPage,
    prescriptionPageStatus,
    prevPrescriptionPage,
    updatePrescriptionDataInfo,
    updatePrescriptionDataAdded,
  } = useSelector((state: RootState) => state.prescriptionInfo);

  const { cartItems } = useSelector((state: RootState) => state.cartInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );

  useEffect(() => {
    if (sessionId) {
      const cartObj: { sessionId: string } = {
        sessionId: sessionId,
      };
      dispatch(fetchCarts(cartObj));
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    dispatch(resetPrescriptionData());
    dispatch(setPrescriptionPageStatus(false));
    //* hide sprinklr bot for mobilesite
    hideSprinklrBot(deviceType);
  }, []);

  useEffect(() => {
    if (cartItems) {
      if (cartItems.find((item) => item.itemLensType === "BIFOCAL")) {
        setIsStudioflow(true);
      } else setIsStudioflow(false);
      setIsStudioFlowLoading(false);
    }
  }, [cartItems]);

  useEffect(() => {
    if (purchaseActive) {
      let contentID: any = [];
      orderData?.items?.forEach((item: any) => {
        contentID.push(item.productId);
      });
      window?.fbq("track", "Purchase", {
        content_type: "product",
        content_ids: contentID.toString().split(","),
        value: orderData?.amount?.total,
        currency: orderData?.amount?.currencyCode,
      });
    }
  }, [purchaseActive]);

  useEffect(() => {
    if (
      step === CheckoutTypes.SUCCESS &&
      orderData &&
      Object.keys(orderData)?.length &&
      typeof window !== undefined
    ) {
      if (!!orderData?.items?.length) {
        setPurchaseActive(true);
      }
    }
  }, [orderData?.items]);

  useEffect(() => {
    if (fireGAPurchase) {
      purchaseInfoGA4(orderData, userInfo, "purchase", pageInfo);
      // purchaseInfoGA4(orderData, userInfo, "purchaseSuccessV2");
      userProperties(
        userInfo,
        "order-success-page",
        pageInfo,
        localeData,
        "order-confirmation-page"
      );
      purchaseInfoGA3(
        orderData,
        userInfo,
        "purchaseSuccess",
        "order-success-page",
        pageInfo
      );
      successVirtualPageView(pageInfo);
    }
  }, [fireGAPurchase]);

  useEffect(() => {
    if (
      step === CheckoutTypes.SUCCESS &&
      orderData &&
      Object.keys(orderData)?.length &&
      typeof window !== undefined
    ) {
      if (!userInfo.userLoading && !!orderData?.items?.length) {
        setFireGAPurchase(true);
        // purchaseInfoGA4(orderData, userInfo);
        // userProperties(userInfo, "order-success-page", pageInfo, localeData);
        userProperties(userInfo, "order-success-page", pageInfo, localeData);
        setTimeout(()=>{
             const searchArray: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
        if (searchArray) sessionStorageHelper.removeItem(SEARCH_FUNNEL);
        },1000)
      }
    }
  }, [userInfo.userLoading, orderData?.items]);

  useEffect(() => {
    const device =
      process.env.NEXT_PUBLIC_APP_CLIENT === "mobilesite"
        ? DeviceTypes.MOBILE
        : DeviceTypes.DESKTOP;
    dispatch(updateDeviceType(device));
    if (userInfo.isGuestFlow)
      console.log("guest flow", userInfo.guestEmail, userInfo.guestNumber);
  }, [
    dispatch,
    userInfo.isGuestFlow,
    userInfo.guestEmail,
    userInfo.guestNumber,
  ]);

  const { mounted } = useCustomerState({
    useMounted: true,
    userData: userData,
  });

  const { countryCode, isRTL } = useSelector(
    (state: RootState) => state.pageInfo
  );
  useEffect(() => {
    dispatch(resetAuth());

    if (step === CheckoutTypes.SUCCESS) {
      const orderId = localStorage.getItem("pixelFiredForOrder") || "";
      if (orderId)
        dispatch(
          getV2OrderData({
            sessionId: sessionId,
            orderID: orderId,
          })
        );
    }
  }, [step, sessionId, dispatch]);

  const router = useRouter();
  const cartData = useSelector((state: RootState) => state.cartInfo);

  useEffect(() => {
    // if (step === CheckoutTypes.SUCCESS) {
    const orderId = getCookie("orderId") || "";
    if (orderId)
      dispatch(
        getV2OrderData({
          sessionId: sessionId,
          orderID: getCookie("orderId")?.toString() || "",
        })
      );
    // }
  }, [step]);

  const addPowerClick = (props: any) => {
    // console.log(props, "add power props");
    setOrderId(props.orderList.id);
    setItems(props.item);
    dispatch(setPrescriptionPageStatus(true));
  };

  const addPdClick = (props: any) => {
    setOrderId(props.orderList.id);
    setItems(props.item);
    dispatch(updatePrescriptionPage(Pages.ENTER_PD));
    dispatch(updatePrevPrescriptionPage(Pages.ENTER_PD));
    dispatch(setPrescriptionPageStatus(true));
  };

  useEffect(() => {
    if (!isLoading && prescriptionPageStatus && items?.id) {
      setItems((prev) => {
        const data = orderData.items.filter(
          (item: { id: any }) => item.id === prev?.id
        );
        return data[0];
      });
    }
  }, [isLoading]);

  const closeSlider = (close: boolean) => {
    if (close) {
      dispatch(resetPrescriptionData());
      dispatch(setPrescriptionPageStatus(false));
    } else {
      if (
        prescriptionPage === Pages.STORE_VISIT &&
        storeSlots.storePage !== "1"
      ) {
        if (storeSlots.storePage === "2") {
          dispatch(setStoreLocatorPage("1"));
        } else if (storeSlots.storePage === "3") {
          dispatch(setStoreLocatorPage("2"));
        }
      } else if (
        !prevPrescriptionPage ||
        prevPrescriptionPage === prescriptionPage
      ) {
        dispatch(resetPrescriptionData());
        dispatch(setPrescriptionPageStatus(false));
      } else {
        dispatch(updatePrescriptionPage(prevPrescriptionPage));
        // dispatch(updatePrevPrescriptionPage(""));
      }
    }
  };

  useEffect(() => {
    if (
      updatePrescriptionDataAdded &&
      !updatePrescriptionDataInfo.isLoading &&
      step === CheckoutTypes.SUBMIT_PRESCRIPTION
    ) {
      const orderId = getCookie("orderId")?.toString() || "";
      if (orderId)
        dispatch(
          getV2OrderData({
            sessionId: sessionId,
            orderID: orderId || "",
          })
        );
      dispatch(resetUpdatePrescriptionDataAdded());
    }
  }, [updatePrescriptionDataAdded, step, updatePrescriptionDataInfo]);

  // * presales login
  useEffect(() => {
    const isPresale = getCookie("isPresale");
    if (isPresale) {
      const username = getCookie("presalesUN");
      const password = getCookie("presalesUP");
      const decryptedUsername =
        typeof username === "string" && username !== ""
          ? CryptoJs.AES.decrypt(username, "secret-key").toString(
              CryptoJs.enc.Utf8
            )
          : "";
      const decryptedPassword =
        typeof password === "string" && password !== ""
          ? CryptoJs.AES.decrypt(password, "secret-key").toString(
              CryptoJs.enc.Utf8
            )
          : "";

      dispatch(
        dualLogin({
          password: decryptedPassword,
          username: decryptedUsername,
          sessionId,
          pageInfo,
        })
      );
    } else {
      // remove username and password cookie
      deleteCookie("presalesUN");
      deleteCookie("presalesUP");
    }
  }, []);

  const checkoutBreadcrumb =
    configData?.CHECKOUT_BREADCRUMB_TEXT &&
    JSON.parse(configData.CHECKOUT_BREADCRUMB_TEXT);

  const redirectURL =
    process.env.NEXT_PUBLIC_BASE_ROUTE === "NA"
      ? "/"
      : `/${process.env.NEXT_PUBLIC_BASE_ROUTE}/`;

  const desktopContainer = mounted ? (
    <div>
      {step === CheckoutTypes.SIGN_IN && (
        <CheckoutSignin
          addressData={addressData}
          countryStateData={countryStateData}
          sessionId={sessionId}
          localeData={localeData}
          phoneCode={countryCode}
          configData={configData}
        />
      )}
      {step === CheckoutTypes.SIGN_UP && (
        <CheckoutSignup
          addressData={addressData}
          countryStateData={countryStateData}
          sessionId={sessionId}
          localeData={localeData}
          phoneCode={countryCode}
          configData={configData}
        />
      )}
      {step === CheckoutTypes.ADDRESS &&
        ((!cartData.studioFlow && !isStudioFlowLoading) ||
          !configData.ENABLE_STUDIOFLOW) && (
          <Checkout
            addressData={addressData}
            countryStateData={countryStateData}
            sessionId={sessionId}
            localeData={localeData}
            phoneCode={countryCode}
            configData={configData}
          />
        )}
      {step === CheckoutTypes.ADDRESS &&
        cartData.studioFlow &&
        !isStudioFlowLoading &&
        (configData.ENABLE_STUDIOFLOW as boolean) && (
          <CheckoutStudioFlow
            addressData={addressData}
            countryStateData={countryStateData}
            sessionId={sessionId}
            localeData={localeData}
            phoneCode={countryCode}
            configData={configData}
          />
        )}
      {step === CheckoutTypes.PRESALE_LOGIN && (
        <PresaleLogin sessionId={sessionId} localeData={localeData} />
      )}
      {step === CheckoutTypes.SUCCESS && (
        <div style={{ minHeight: "100vh", backgroundColor: "#FBF9F7" }}>
          <CartHeader
            appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
            safeText={localeData.SAFE_SECURE}
          />
          <AddressBody>
            <PaymentSummaryWrapper>
              <CheckoutBase
                isRTL={isRTL}
                activeBreadcrumbId="summary"
                breadcrumbData={[
                  {
                    text: checkoutBreadcrumb?.LOGIN_SIGNUP,
                    onClick: () => null,
                    disabled: true,
                    id: "account_verification",
                  },
                  {
                    text: "Shipping Address",
                    onClick: () => null,
                    disabled: true,
                    id: "shipping_address",
                  },
                  {
                    text: "Payment",
                    onClick: () => null,
                    disabled: true,
                    id: "payment",
                  },
                  {
                    // text: "Summary",
                    text: `${
                      orderData?.studioFlow ? "Book Appointment" : "Summary"
                    }`,
                    onClick: () => null,
                    disabled: false,
                    id: "summary",
                  },
                ]}
              >
                <PaymentSummary
                  sessionId={sessionId}
                  // configData={localeData}
                  success={true}
                  orderId={
                    typeof getCookie("orderId") === "string"
                      ? getCookie("orderId")?.toString()
                      : ""
                  }
                  // orderId={orderId}
                  heading={localeData.ORDER_CONFIRMED_POST}
                  headingL2={
                    !orderData?.studioFlow
                      ? localeData.THANK_YOU_FOR_SHOPPING_POST
                      : localeData?.WE_ARE_EXPECTING_YOU_AT_THE_STORE
                  }
                  mainInfo={localeData.RECEIVE_CONFIRMATION_EMAIL_POST}
                  subhead=""
                  orderList={orderData?.items}
                  dataLocale={localeData}
                  configData={configData}
                  orderData={orderData}
                />
              </CheckoutBase>
            </PaymentSummaryWrapper>
          </AddressBody>
        </div>
      )}

      {step === CheckoutTypes.FAILURE && (
        <div style={{ minHeight: "100vh", backgroundColor: "#FBF9F7" }}>
          <CartHeader
            appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
            safeText={localeData.SAFE_SECURE}
          />
          <AddressBody>
            <PaymentSummaryWrapper>
              <CheckoutBase
                isRTL={isRTL}
                activeBreadcrumbId="summary"
                breadcrumbData={[
                  {
                    text: checkoutBreadcrumb?.LOGIN_SIGNUP,
                    onClick: () => null,
                    disabled: true,
                    id: "account_verification",
                  },
                  {
                    text: "Shipping Address",
                    onClick: () => null,
                    disabled: true,
                    id: "shipping_address",
                  },
                  {
                    text: "Payment",
                    onClick: () => null,
                    disabled: true,
                    id: "payment",
                  },
                  {
                    text: "Summary",
                    onClick: () => null,
                    disabled: false,
                    id: "summary",
                  },
                ]}
              >
                <PaymentSummary
                  sessionId={sessionId}
                  // configData={localeData}
                  success={false}
                  orderId={
                    typeof getCookie("orderId") === "string"
                      ? getCookie("orderId")?.toString()
                      : ""
                  }
                  // orderId={orderId}
                  heading={
                    localeData.YOUR_PAYMENT_WAS_UNSUCCESSFUL_BUT_PLACED_ORDER
                  }
                  mainInfo=""
                  subhead={localeData.SO_THAT_YOU_DONT_MISS_OUT_ON_INVENTORY}
                  orderList={orderData?.items}
                  dataLocale={localeData}
                  configData={configData}
                  orderData={orderData}
                />
              </CheckoutBase>
            </PaymentSummaryWrapper>
          </AddressBody>
        </div>
      )}

      {step === CheckoutTypes.SUBMIT_PRESCRIPTION && (
        <div style={{ minHeight: "100vh", backgroundColor: "#FBF9F7" }}>
          <CartHeader
            appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
            safeText={localeData.SAFE_SECURE}
          />
          <AddressBody>
            <Wrapper>
              <CheckoutBase
                isRTL={isRTL}
                activeBreadcrumbId="summary"
                breadcrumbData={[
                  {
                    text: checkoutBreadcrumb?.LOGIN_SIGNUP,
                    onClick: () => null,
                    disabled: true,
                    id: "account_verification",
                  },
                  {
                    text: "Shipping Address",
                    onClick: () => null,
                    disabled: true,
                    id: "shipping_address",
                  },
                  {
                    text: "Payment",
                    onClick: () => null,
                    disabled: true,
                    id: "payment",
                  },
                  {
                    text: "Summary",
                    onClick: () => null,
                    disabled: false,
                    id: "summary",
                  },
                ]}
              >
                <></>
              </CheckoutBase>
            </Wrapper>
          </AddressBody>
          <Slider
            show={prescriptionPageStatus}
            closeSlider={closeSlider}
            orderId={orderId}
            item={items}
            localeData={localeData}
            configData={configData}
          />
          <PostCheckoutItemsList
            orderData={orderData?.items}
            onAddPowerClick={(data: any) => addPowerClick(data)}
            orderList={orderData}
            configData={configData}
            localeData={localeData}
            cartData={orderData}
            isRTL={isRTL}
            onPdClick={(data: any) => addPdClick(data)}
            isLogin={userInfo.isLogin}
          />
        </div>
      )}

      {step === CheckoutTypes.RETRY && (
        <div style={{ minHeight: "100vh", backgroundColor: "#FBF9F7" }}>
          <CartHeader
            appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
            safeText={localeData.SAFE_SECURE}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              backgroundColor: "#FBF9F7",
              margin: "auto",
              // maxWidth: "1500px",
              padding: "0 15%",
            }}
          >
            <WrapperFullWidth>
              <CheckoutBase
                isRTL={isRTL}
                activeBreadcrumbId="summary"
                breadcrumbData={[
                  {
                    text: checkoutBreadcrumb?.LOGIN_SIGNUP,
                    onClick: () => null,
                    disabled: true,
                    id: "account_verification",
                  },
                  {
                    text: "Shipping Address",
                    onClick: () => null,
                    disabled: true,
                    id: "shipping_address",
                  },
                  {
                    text: "Payment",
                    onClick: () => null,
                    disabled: true,
                    id: "payment",
                  },
                  {
                    text: "Summary",
                    onClick: () => null,
                    disabled: false,
                    id: "summary",
                  },
                ]}
              >
                <Retry
                  oid={oid}
                  eid={eid}
                  localeData={localeData}
                  isRTL={pageInfo.isRTL}
                />
              </CheckoutBase>
            </WrapperFullWidth>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div />
  );

  const mobileContainer = mounted ? (
    <div>
      {step === CheckoutTypes.SIGN_IN && (
        <CheckoutSignin
          addressData={addressData}
          countryStateData={countryStateData}
          sessionId={sessionId}
          localeData={localeData}
          phoneCode={countryCode}
          configData={configData}
        />
      )}
      {step === CheckoutTypes.SIGN_UP && (
        <CheckoutSignup
          addressData={addressData}
          countryStateData={countryStateData}
          sessionId={sessionId}
          localeData={localeData}
          phoneCode={countryCode}
          configData={configData}
        />
      )}
      {step === CheckoutTypes.ADDRESS &&
        ((!cartData.studioFlow && !isStudioFlowLoading) ||
          !configData.ENABLE_STUDIOFLOW) && (
          <Checkout
            addressData={addressData}
            countryStateData={countryStateData}
            sessionId={sessionId}
            localeData={localeData}
            phoneCode={countryCode}
            configData={configData}
          />
        )}
      {step === CheckoutTypes.ADDRESS &&
        cartData.studioFlow &&
        !isStudioFlowLoading &&
        (configData.ENABLE_STUDIOFLOW as boolean) && (
          <CheckoutStudioFlow
            addressData={addressData}
            countryStateData={countryStateData}
            sessionId={sessionId}
            localeData={localeData}
            phoneCode={countryCode}
            configData={configData}
          />
        )}
      {step === CheckoutTypes.PRESALE_LOGIN && (
        <PresaleLogin sessionId={sessionId} localeData={localeData} />
      )}
      {step === CheckoutTypes.SUCCESS && (
        <div style={{ backgroundColor: "#FBF9F7" }}>
          <>
            <MobileCartHeader
              isRTL={pageInfo.isRTL}
              logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
              showBackBtn={false}
              onClickBack={() => null}
              dontShowlogo={false}
              isClickable={true}
              configData={configData}
              hasOnlyCLProduct={
                !cartData?.cartItems?.some(
                  (item) =>
                    (item.itemClassification === "eyeframe" ||
                      item.itemClassification === "sunglasses") &&
                    (item.itemPowerRequired === "POWER_REQUIRED" ||
                      item.itemPowerRequired === "POWER_SUBMITTED")
                )
              }
              pageNumber={1}
              noNumber={true}
            />
            {/* <Slider
              show={prescriptionPageStatus}
              closeSlider={closeSlider}
              orderId={orderId}
              item={items}
              localeData={localeData}
              configData={configData}
            /> */}
            <CheckoutMobile.PostCheckoutMobile
              // sessionId={sessionId}
              // configData={localeData}
              success={true}
              heading={localeData.ORDER_CONFIRMED_POST}
              thankYouMessage={localeData.THANK_YOU_FOR_SHOPPING_POST}
              onContinue={() => {
                router.push("/");
              }}
              isRTL={isRTL}
              dataLocale={localeData}
              orderData={orderData?.items}
              orderList={orderData}
              onAddPowerClick={(data: any) => addPowerClick(data)}
              onPdClick={(data: any) => addPdClick(data)}
              redirectTopayment={() => router.push("/payment")}
              isLogin={userInfo.isLogin}
              isStudioInfo={{
                isStudioFlow: orderData?.studioFlow,
                link: () =>
                  router.push(
                    `/studio/bookappointment?orderId=${getCookie(
                      "orderId"
                    )}&store=${orderData?.studioStoreDetails?.code}`
                  ),
              }}
              // viewOrder={() =>
              //   router.push(`/sales/order/history/${orderData?.id}`)
              // }
              viewOrder={() =>
                (window.location.href =
                  getCookie("orderId") || orderId
                    ? `${redirectURL}sales/order/history/order-detail/${
                        getCookie("orderId") || orderId
                      }`
                    : `${redirectURL}sales/order/history/`)
              }
              prescriptionPageStatus={prescriptionPageStatus}
              onSubmitPrescription={() =>
                router.push("/checkout/submitprescription")
              }
            />
          </>
        </div>
      )}
      {step === CheckoutTypes.FAILURE && (
        <div style={{ backgroundColor: "#FBF9F7" }}>
          <MobileCartHeader
            isRTL={pageInfo.isRTL}
            logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
            showBackBtn={false}
            onClickBack={() => null}
            dontShowlogo={false}
            isClickable={true}
            configData={configData}
            hasOnlyCLProduct={
              !cartData?.cartItems?.some(
                (item) =>
                  (item.itemClassification === "eyeframe" ||
                    item.itemClassification === "sunglasses") &&
                  (item.itemPowerRequired === "POWER_REQUIRED" ||
                    item.itemPowerRequired === "POWER_SUBMITTED")
              )
            }
            pageNumber={1}
            noNumber={true}
          />
          <CheckoutMobile.PostCheckoutMobile
            // sessionId={sessionId}
            // configData={localeData}
            thankYouMessage=""
            success={false}
            heading={localeData.PAYMENT_FAILED_ORDER_CREATED}
            onContinue={() => router.push("/")}
            dataLocale={localeData}
            orderData={orderData?.items}
            orderList={orderData}
            onAddPowerClick={(data: any) => addPowerClick(data)}
            onPdClick={(data: any) => addPdClick(data)}
            redirectTopayment={() => router.push("/payment")}
            isLogin={userInfo.isLogin}
            // viewOrder={() =>
            //   router.push(`/sales/order/history/${orderData?.id}`)
            // }
            viewOrder={() =>
              (window.location.href =
                getCookie("orderId") || orderId
                  ? `/sales/order/history/order-detail/${
                      getCookie("orderId") || orderId
                    }`
                  : `/sales/order/history/`)
            }
            prescriptionPageStatus={prescriptionPageStatus}
            onSubmitPrescription={() =>
              router.push("/checkout/submitprescription")
            }
            isRTL={pageInfo.isRTL}
          />
        </div>
      )}

      {step === CheckoutTypes.SUBMIT_PRESCRIPTION && (
        <>
          <MobileCartHeader
            isRTL={pageInfo.isRTL}
            logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
            showBackBtn={false}
            onClickBack={() => null}
            dontShowlogo={false}
            isClickable={true}
            configData={configData}
            hasOnlyCLProduct={
              !cartData?.cartItems?.some(
                (item) =>
                  (item.itemClassification === "eyeframe" ||
                    item.itemClassification === "sunglasses") &&
                  (item.itemPowerRequired === "POWER_REQUIRED" ||
                    item.itemPowerRequired === "POWER_SUBMITTED")
              )
            }
            pageNumber={1}
            noNumber={true}
          />
          <>
            <div
              style={{
                padding: "20px 10px",
                backgroundColor: "#eaeff4",
                height: "100vh",
              }}
            >
              <Slider
                show={prescriptionPageStatus}
                closeSlider={closeSlider}
                orderId={orderId}
                item={items}
                localeData={localeData}
                configData={configData}
              />
              <PostCheckoutItemsListMobile
                orderList={orderData}
                onAddPowerClick={(data: any) => addPowerClick(data)}
                items={orderData?.items}
                onPdClick={(data: any) => addPdClick(data)}
                dataLocale={localeData}
                isRTL={isRTL}
                isLogin={userInfo.isLogin}
              />
            </div>
          </>
        </>
      )}
      {step === CheckoutTypes.RETRY && (
        <div style={{ backgroundColor: "#FBF9F7", height: "100vh" }}>
          <MobileCartHeader
            isRTL={pageInfo.isRTL}
            logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
            showBackBtn={false}
            onClickBack={() => null}
            dontShowlogo={false}
            isClickable={true}
            configData={configData}
            hasOnlyCLProduct={
              !cartData?.cartItems?.some(
                (item) =>
                  (item.itemClassification === "eyeframe" ||
                    item.itemClassification === "sunglasses") &&
                  (item.itemPowerRequired === "POWER_REQUIRED" ||
                    item.itemPowerRequired === "POWER_SUBMITTED")
              )
            }
            pageNumber={1}
            noNumber={true}
          />
          <Retry
            oid={oid || ""}
            eid={eid || ""}
            localeData={localeData}
            isRTL={pageInfo.isRTL}
          />
        </div>
      )}
    </div>
  ) : (
    <div />
  );

  return pageInfo?.deviceType === DeviceTypes.DESKTOP
    ? desktopContainer
    : mobileContainer;
};

export default CheckoutStep;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const { step, oid, eid } = context.query;
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  if (!step?.length || step.length <= 0 || step.length > 1) {
    return {
      notFound: true,
    };
  }

  const isSessionAvailable =
    hasCookie(COOKIE_NAME, { req, res }) &&
    getCookie(COOKIE_NAME, { req, res }) !== "";
  let currentSessionId;
  if (isSessionAvailable) {
    currentSessionId = `${getCookie(COOKIE_NAME, { req, res })}`;
  } else {
    const sessionAPI = createAPIInstance({ method: APIMethods.POST });
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      sessionAPI
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(COOKIE_NAME, sessionId.sessionId, { req, res });
    currentSessionId = sessionId.sessionId;
  }
  const api = createAPIInstance({ sessionToken: currentSessionId });
  const configApi = createAPIInstance({
    url: `${process.env.NEXT_PUBLIC_CONFIG_URL}`,
  });

  const promises = [
    checkoutFunctions.fetchCountryState(api),
    checkoutFunctions.fetchAddress(api),
    fireBaseFunctions.getConfig(LOCALE, configApi),
    fireBaseFunctions.getConfig(CONFIG, configApi),
    sessionFunctions.validateSession(api),
  ];

  const [
    { data: countryStateData },
    { data: addressData, error: addressError },
    { data: localeData, error: localeError },
    { data: configData, error: configError },
    { data: userData, error: userError },
  ] = await Promise.all(promises);

  if (localeError.isError || configError.isError || userError.isError) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo?.id, { req, res });

  return {
    props: {
      addressData: Array.isArray(addressData) ? addressData : [],
      countryStateData: countryStateData || null,
      sessionId: currentSessionId || null,
      localeData: localeData || null,
      configData: { ...configData } || null,
      step: step[0] || null,
      userData: userData?.customerInfo || null,
      oid: oid || "",
      eid: eid || "",
    },
  };
};
