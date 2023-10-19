import { Fragment, useEffect, useRef, useState } from "react";
import { APIMethods } from "@/types/apiTypes";
import { DataType } from "@/types/coreTypes";
// import { Icons } from "@lk/ui-library";
import {
  PageContainer,
  AddressBody,
  AddNewAddressContainer,
  AddressesContainer,
  AddressFormContainer,
  IconContainer,
  NewAddressHeader,
  AddressHeading,
  Height,
  EmptySpace,
  PowerCheckout,
} from "./styles";
import {
  TypographyENUM,
  ComponentSizeENUM,
  AlertColorsENUM,
  kindENUM,
  DeviceTypes,
} from "@/types/baseTypes";
import {
  checkoutFunctions,
  paymentFunctions,
  userFunctions,
} from "@lk/core-utils";
import {
  Button,
  Icons,
  Checkout as CheckoutComponent,
  HeadingBackPress,
  Toast,
} from "@lk/ui-library";
import { APIService, RequestBody } from "@lk/utils";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { deleteCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { CommonLoader } from "@lk/ui-library";
import NextHead from "next/head";
import { addShippingInfoGA4 } from "helpers/gaFour";
import { CheckoutMobile, NeedHelpCta, ToastMessage } from "@lk/ui-library";
import MobileCartHeader from "containers/Cart/MobileCartHeader";
import Header from "../../Cart/MobileCartHeader";

import {
  CheckoutWrapper,
  Head,
  Title,
  AddNewAddressButton,
  Heading,
  SubHeading,
} from "../../../pageStyles/Checkout.styles";
import {
  AddressObjectBodyType,
  AddressObjectType,
  CartObjectType,
  CheckoutType,
} from "../../../pageStyles/Checkout.types";
import { Alert } from "@lk/ui-library";
import {
  ButtonContent,
  Flex,
  HeadingText,
  RightWrapper,
  StickyDiv,
  TextButton,
} from "pageStyles/CartStyles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  NewPriceBreakup,
  Offers,
  ApplyCoupon as AddNewAddressCTA,
} from "@lk/ui-library";
import Link from "next/link";
import { fireBaseFunctions } from "@lk/core-utils";
import { LOCALE } from "@/constants/index";
import { fetchCarts } from "@/redux/slices/cartInfo";
import Router, { useRouter } from "next/router";
import {
  getDeliveryOptions,
  getShippingAddress,
  updateShippingAndDeliveryData,
} from "@/redux/slices/paymentInfo";
import { userProperties } from "helpers/userproperties";
import styled from "styled-components";
import NewAddressField from "../ApplyCoupon";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import CheckoutBase from "containers/Checkout/Checkout.component";
import { getCurrency } from "helpers/utils";
import { AlertMessage } from "pageStyles/styles";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import EditAddressHeader from "@/components/Mobile/EditAddressHeader";
import { updateShippingAddress } from "@/redux/slices/myorder";
import { logoutSprinklrBot } from "helpers/chatbot";
import { abandonedLeads } from "@/redux/slices/userInfo";
import { PowerCheckout as PowerCheckoutMsite } from "../../../containers/Payment/styles";
// import { isRTL } from "pageStyles/constants";
// import { addressForm } from "./config";

const ShowMore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-bottom: 16px;
  cursor: pointer;
`;
const ShowMoreText = styled.span`
  margin-right: 8px;
  color: var(--dark-blue-100);
  letter-spacing: -0.02em;
  // font-family: 'Lenskart Sans';
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  // font-weight: 700;
  // font-size: 12px;
  line-height: 18px;
  text-transform: capitalize;
`;
const ArrowContainer = styled.div<{ reverse: boolean }>`
  transform: rotate(${(props) => (props.reverse ? "180deg" : "0deg")});
`;
export const LoginInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;
export const LoginUser = styled.span`
  color: #445962;
  font-family: ${TypographyENUM.lkSansBold};
`;
export const LogOutButton = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  color: #e34934;
  text-decoration: underline;
`;
// const NewAddressField = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   background: #FFFFFF;
// box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
// border-radius: 12px;
// padding: 24px;
// `
enum SubmitType {
  add = "ADD",
  edit = "EDIT",
  read = "READ",
}
const Checkout = ({
  addressData,
  countryStateData,
  sessionId,
  localeData,
  phoneCode,
  configData,
  isReturnRefund,
  isExchange,
  setEditAddress,
  isOrderDetailPage,
}: CheckoutType) => {
  const [allAddressData, setAllAddressData] = useState(addressData);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [addressIndex, setAddressIndex] = useState<string | number>(
    allAddressData?.[0]?.id || ""
  );
  const [showMoreAddress, setShowMoreAddress] = useState(false);
  const [msiteDeletePopup, setMsiteDeletePopup] = useState<{
    render: boolean;
    id: number | null;
  }>({ render: false, id: null });
  const [currentEditAddress, setCurrentEditAddress] = useState<DataType | null>(
    null
  );
  const [showDeletedAddressText, setShowDeletedAddressText] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const submitRef = useRef<HTMLFormElement>(null);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const authInfo = useSelector((state: RootState) => state.authInfo);
  const { orderData } = useSelector((state: RootState) => state.myOrderInfo);

  const [openSelectAddressModal, setOpenSelectAddressModal] = useState(false);

  // const isGuestFlow = useSelector((state: RootState) => state.userInfo.isGuestFlow);
  const { isError, errorMessage } = useSelector(
    (state: RootState) => state.paymentInfo
  );
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const placeOrderButtonText = `${
    cartData?.cartTotal?.length
      ? getCurrency(pageInfo.country) +
        cartData?.cartTotal?.[cartData?.cartTotal?.length - 1]?.amount +
        " • "
      : ""
  }${localeData?.PLACE_ORDER}`;

  const addAddressButtonText = `${
    cartData?.cartTotal?.length
      ? getCurrency(pageInfo.country) +
        cartData?.cartTotal?.[cartData?.cartTotal?.length - 1]?.amount +
        " • "
      : ""
  } ${localeData.SAVE_AND_USE_ADDRESS || "Save And Use Address"}`;

  const isPlaceOrderDisabled =
    !showAddAddress && !userInfo.isGuestFlow && allAddressData.length > 0
      ? buttonDisabled ||
        (!showAddAddress && !addressIndex && typeof addressIndex === "string")
      : false;

  const { cartItems = [] } = cartData || {};
  const pIds = cartItems ? cartItems.map((item) => item.itemId) : [];
  const whatsAppChatMsg =
    localeData.BUY_ON_CHAT_HELP_CTA_CART ||
    (localeData.BUYONCHAT_HELP_CTA_CART &&
      (
        localeData.BUY_ON_CHAT_HELP_CTA_CART ||
        localeData.BUYONCHAT_HELP_CTA_CART
      )
        .replace("<pageName>", "Select Address Page")
        .replace("<pid-no>", pIds.join(",")));

  const buyOnChatConfig =
    configData?.BUY_ON_CALL_WIDGET &&
    JSON.parse(configData?.BUY_ON_CALL_WIDGET);

  const hasFrameProduct = !!cartItems?.some(
    (eyeFrame: { itemClassification: string; itemPowerRequired: string }) =>
      (eyeFrame.itemClassification === "eyeframe" ||
        eyeFrame.itemClassification === "sunglasses") &&
      eyeFrame.itemPowerRequired === "POWER_REQUIRED"
  );

  const { BILL_DETAILS } = localeData;
  const getDeliveryStatus = async (pin: string) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = sessionId;
    api.setHeaders(headerArr);
    try {
      const { data: deliveryStatusData, error } =
        await checkoutFunctions.fetchDeliveryStatus(pin, api);
      return error.isError ? error : deliveryStatusData;
    } catch (err) {
      console.log(err);
    }
  };
  let pageName = "shipping-page";
  useEffect(() => {
    userProperties(
      userInfo,
      pageName,
      pageInfo,
      localeData,
      "select-address-page"
    );
    // addShippingInfoGA4(cartData, userInfo?.isLogin);
    deleteCookie("orderId", { domain: `.${window.location.hostname}` });
    deleteCookie("orderId");
  }, []);

  useEffect(() => {
    if (showAddAddress) {
      const pageName = "add-address-page";
      userProperties(
        userInfo,
        pageName,
        pageInfo,
        localeData,
        "add-address-page"
      );
    }
  }, [showAddAddress]);

  const [toast, setToast] = useState("");

  const [showScreenLoader, setShowScreenLoader] = useState(false);
  //   getDeliveryOptions
  const postShippingAddress = async (
    type: SubmitType,
    id: number | string,
    data: AddressObjectType
  ) => {
    setShowScreenLoader(true);
    if (!data.postcode) {
      data.postcode = "000000";
    }
    if (isReturnRefund) {
      const body = new RequestBody<AddressObjectType | null>(data);
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setMethod(id ? APIMethods.PUT : APIMethods.POST);
      api.sessionToken = sessionId;
      api.setHeaders(headerArr);

      const { data: userAddr, error: userErr } =
        await userFunctions.updateUserAddress(api, body, id);
      // return {}
      if (userErr.isError) {
        // alert(`Error: ${userErr.message}`);
        setToast(`Error: ${userErr.message}`);
      } else {
        router.back();
      }
      setShowScreenLoader(false);
      return;
    }
    if (type === SubmitType.add && data) {
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setMethod(APIMethods.POST);
      api.sessionToken = sessionId;
      api.setHeaders(headerArr);
      if (!userInfo.isGuestFlow) {
        const body = new RequestBody<AddressObjectType | null>(data);
        const { data: addAddressData, error: addAddrErr } =
          await checkoutFunctions.addAddress(api, body);
        if (addAddrErr.isError) {
          console.log(addAddrErr);
          // alert(`Error: ${addAddrErr.message}`);
          setToast(`Error: ${addAddrErr.message}`);
          setShowScreenLoader(false);
        } else {
          if (addAddressData?.updated) delete addAddressData.updated;
          if (addAddressData?.created) delete addAddressData.created;
          const newData = {
            addressType: "billing",
            // alternatePhone: "",
            // comment: "",
            // floor: 0,
            // gender: "male",
            // liftAvailable: false,
            // locality: null,
            ...addAddressData,
          };
          const { data: combineData, error } =
            await paymentFunctions.getShippingAndDelivery(
              api,
              new RequestBody<{
                address: AddressObjectType | null;
                giftMessage: string | null;
              }>({ address: newData, giftMessage: null })
            );
          if (error.isError) {
            console.log(error);
            // alert(`Error: ${error.message}`);
            setToast(`Error: ${error.message}`);
            setShowScreenLoader(false);
          } else {
            dispatch(updateShippingAndDeliveryData(combineData));
            // setShowScreenLoader(false);
            if (!isExchange) {
              setTimeout(() => {
                router.push("/payment");
              }, 0);
            } else
              setTimeout(() => {
                router.back();
              }, 0);
          }
        }
      } else {
        const { data: combineData, error } =
          await paymentFunctions.getShippingAndDelivery(
            api,
            new RequestBody<{
              address: AddressObjectType | null;
              giftMessage: string | null;
            }>({
              address: { ...data, addressType: "billing" },
              giftMessage: null,
            })
          );
        if (error.isError) {
          console.log(error);
          // alert(`Error: ${error.message}`);
          setToast(`Error: ${error.message}`);
          setShowScreenLoader(false);
        } else {
          dispatch(updateShippingAndDeliveryData(combineData));
          // setShowScreenLoader(false);
          if (!isExchange) {
            setTimeout(() => {
              router.push("/payment");
            }, 0);
          } else
            setTimeout(() => {
              router.back();
            }, 0);
        }
      }
    } else if (type === SubmitType.edit && id) {
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setMethod(APIMethods.PUT);
      api.sessionToken = sessionId;
      api.setHeaders(headerArr);
      // if(!userInfo.isGuestFlow)
      const currAddress = allAddressData?.find((ad) => ad.id === id) || null;
      // const newAddressData = addressNew ? {...addressNew, defaultAddress: false, floor: 0, liftAvailable: false} : null; //gender
      const newAddressData = data ? { ...data } : currAddress; //gender
      if (newAddressData?.updated) delete newAddressData.updated;
      if (newAddressData?.created) delete newAddressData.created;
      setCurrentEditAddress(newAddressData);
      // editAddressData.defaultAddress = false;
      const body = new RequestBody<AddressObjectBodyType | null>(data || null);
      const { data: editAddressData, error: editAddrErr } =
        await checkoutFunctions.editAddress(id, api, body);
      if (editAddrErr.isError) {
        setShowScreenLoader(false);
        console.log(editAddrErr);
        // alert(`Error: ${editAddrErr.message}`);
        setToast(`Error: ${editAddrErr.message}`);
      } else {
        const api = new APIService(
          `${process.env.NEXT_PUBLIC_API_URL}`
        ).setMethod(APIMethods.POST);
        api.sessionToken = sessionId;
        api.setHeaders(headerArr);
        if (editAddressData?.updated) delete editAddressData.updated;
        if (editAddressData?.created) delete editAddressData.created;
        const newData = {
          addressType: "billing",
          ...editAddressData,
        };
        const { data: combineData, error } =
          await paymentFunctions.getShippingAndDelivery(
            api,
            new RequestBody<CartObjectType | null>({
              address: newData,
              giftMessage: null,
            })
          );
        if (error.isError) {
          setShowScreenLoader(false);
          console.log(error);
          // alert(`Error: ${error.message}`);
          setToast(`Error: ${error.message}`);
        } else {
          dispatch(updateShippingAndDeliveryData(combineData));
          if (!isExchange) {
            setTimeout(() => {
              router.push("/payment");
            }, 0);
          } else
            setTimeout(() => {
              router.back();
            }, 0);
        }
      }
    } else if (type === SubmitType.read && id) {
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setMethod(APIMethods.POST);
      api.sessionToken = sessionId;
      api.setHeaders(headerArr);
      const { data: combineData, error } =
        await paymentFunctions.getShippingAndDelivery(
          api,
          new RequestBody<CartObjectType | null>({
            address: data,
            giftMessage: null,
          })
        );
      if (error.isError) {
        console.log(error);
        // alert(`Error: ${error.message}`);
        setToast(`Error: ${error.message}`);
        setShowScreenLoader(false);
      } else {
        dispatch(updateShippingAndDeliveryData(combineData));
        if (!isExchange) {
          setTimeout(() => {
            router.push("/payment");
          }, 0);
        } else
          setTimeout(() => {
            router.back();
          }, 0);
      }
    }

    if (data?.phone) {
      sessionStorageHelper.setItem("mobileNumber", data.phone);
      dispatch(
        abandonedLeads({
          cartId: cartData.cartId,
          sessionId: sessionId,
          device: deviceType,
          mobileNumber: data.phone,
          phoneCode: pageInfo.countryCode,
          step: 2,
        })
      );
    } else {
      dispatch(
        abandonedLeads({
          cartId: cartData.cartId,
          sessionId: sessionId,
          device: deviceType,
          phoneCode: pageInfo.countryCode,
          step: 2,
        })
      );
    }
  };

  const toggleAddress = () => {
    setShowAddAddress((showAddAddress) => !showAddAddress);
    if (pageInfo.country === "in") setShowPolicy((showPolicy) => !showPolicy);
  };

  useEffect(() => {
    const cartObj: { sessionId: string } = {
      sessionId: sessionId,
    };
    if (sessionId) dispatch(fetchCarts(cartObj));
  }, [sessionId, dispatch]);

  useEffect(() => {
    if (
      !(allAddressData.length > 0) &&
      !userInfo.isGuestFlow &&
      !userInfo.isLogin &&
      !userInfo.userLoading
    ) {
      if (pageInfo.deviceType === DeviceTypes.DESKTOP)
        router.replace("/checkout/signin"); //
      else router.replace("/cart");
    }
  }, [
    userInfo.isGuestFlow,
    userInfo.isLogin,
    userInfo.userLoading,
    allAddressData?.length,
    router,
    pageInfo.subdirectoryPath,
  ]);

  useEffect(() => {
    if (allAddressData.length === 0) {
      setShowAddAddress(true);
      setShowPolicy(true);
    }
  }, []);

  const [isEditAddress, setIsEditAddress] = useState(false);

  const editAddressHandler = (id: number) => {
    setCurrentEditAddress(allAddressData?.find((add) => add.id === id) || null);
    toggleAddress();
  };
  const addAddressHandler = () => {
    setCurrentEditAddress(null);
    toggleAddress();
  };
  const deleteAddressHandler = async (
    id: number,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading && setLoading(true);
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setMethod(
      APIMethods.DELETE
    );
    api.sessionToken = sessionId;
    api.setHeaders(headerArr);
    const { data: delAddressData, error } =
      await checkoutFunctions.deleteAddress(id, api);
    setLoading && setLoading(false);
    setMsiteDeletePopup({ render: false, id: null });
    if (error.isError) {
      // alert("Failed to delete!");
      setToast("Failed to delete!");
      console.log(error);
    } else {
      // dispatch(fetchCarts({sessionId: sessionId}));
      api.setMethod(APIMethods.GET);
      const { data: addressData, error } = await checkoutFunctions.fetchAddress(
        api
      );
      setShowDeletedAddressText(true);
      setTimeout(() => {
        setShowDeletedAddressText(false);
      }, 10000);
      if (!error.isError) {
        setAllAddressData(addressData);
      }
      // alert("Successfully deleted!")
    }
  };

  useEffect(() => {
    if (allAddressData?.length >= 1 && addressIndex !== allAddressData[0].id) {
      setAddressIndex(allAddressData[0].id);
    }
  }, [allAddressData]);

  function pincodeCheck(pincode: number) {
    // /v2/utility/checkpincode/
    return new Promise((resolve, reject) => {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
        .setHeaders(headerArr)
        .setMethod(APIMethods.GET);
    });
  }
  const checkoutBreadcrumb =
    configData?.CHECKOUT_BREADCRUMB_TEXT &&
    JSON.parse(configData.CHECKOUT_BREADCRUMB_TEXT);
  const breadcrumbData = [
    {
      text: checkoutBreadcrumb?.LOGIN_SIGNUP,
      onClick: () => router.replace("/checkout/signin"),
      disabled: !(
        (userInfo.isGuestFlow &&
          (userInfo.guestNumber || userInfo.guestEmail) &&
          !userInfo.isLogin) ||
        false
      ),
      id: "account_verification",
    },
    {
      text: checkoutBreadcrumb?.SHIPPING_ADDRESS,
      onClick: () => null,
      disabled: false,
      id: "shipping_address",
    },
    {
      text: checkoutBreadcrumb?.PAYMENT,
      onClick: () => null,
      disabled: true,
      id: "payment",
    },
    {
      text: checkoutBreadcrumb?.SUMMARY,
      onClick: () => null,
      disabled: true,
      id: "summary",
    },
  ];
  const showMoreHandler = () => {
    if (addressIndex) {
      const newAddressData = allAddressData.filter(
        (addr) => addr.id === addressIndex
      );
      allAddressData.forEach((addr) => {
        if (addr.id !== addressIndex) newAddressData.push(addr);
      });
      setAllAddressData(newAddressData);
    }
    setShowMoreAddress((show) => !show);
  };
  const temporaryStoreAddressData = {
    delete() {
      deleteCookie(`tempStoreCheckoutAddressData_${pageInfo.country}`);
    },
    add(data: DataType) {
      // console.log(data, "user provided data");
      const newData = {
        firstName: data?.firstName || "" || "",
        lastName: data?.lastName || "",
        mobile: data?.mobile || "",
        email: data?.email || "",
        addressLine1: data?.addressLine1 || "",
        addressLine2: data?.addressLine2 || "",
        zipCode: data?.zipCode || "",
        cityDistrict: data?.cityDistrict || "",
        state: data?.state || "",
        country: data?.country || "",
        addressLabel: data?.addressLabel || "",
        landmark: data?.landmark || "",
        phoneCode: data?.phoneCode || "",
        gender: data?.gender,
      };
      const oldData = temporaryStoreAddressData.get();
      if (
        !oldData ||
        (newData && temporaryStoreAddressData.isChangedV2(newData, oldData))
      ) {
        const date = new Date();
        date.setTime(date.getTime() + 5 * 60 * 1000); // here cookie duration = 5 mins
        !isEditAddress &&
          setCookie(
            `tempStoreCheckoutAddressData_${pageInfo.country}`,
            JSON.stringify({
              data: { ...oldData, ...newData },
              sessionId: sessionId,
            }),
            { expires: date }
          );
      }
    },
    get() {
      const cookieData = JSON.parse(
        getCookie(
          `tempStoreCheckoutAddressData_${pageInfo.country}`
        )?.toString() || "{}"
      );
      let addressData;
      if (cookieData && typeof cookieData === "object") {
        const finalData = cookieData;
        // if(finalData.guestEmail === userInfo.guestEmail && finalData.guestNumber === userInfo.guestNumber) {
        if (finalData.sessionId === sessionId && finalData.data) {
          addressData = finalData.data;
        }
      }
      return !addressData
        ? null
        : {
            firstName: addressData?.firstName || "" || "",
            lastName: addressData?.lastName || "",
            mobile: addressData?.mobile || "",
            email: addressData?.email || "",
            addressLine1: addressData?.addressLine1 || "",
            addressLine2: addressData?.addressLine2 || "",
            zipCode: addressData?.zipCode || "",
            cityDistrict: addressData?.cityDistrict || "",
            state: addressData?.state || "",
            country: addressData?.country || "",
            addressLabel: addressData?.addressLabel || "",
            landmark: addressData?.landmark || "",
            phoneCode: addressData?.phoneCode || "",
            gender: addressData?.gender || "",
          };
    },
    isChanged(newData: DataType, oldData: DataType) {
      Object.keys(newData).map((d) => {
        if (!(d in oldData) || oldData[d] !== newData[d]) return true;
      });
      return false;
    },
    isChangedV2(newData: DataType, oldData: DataType) {
      const keys = Object.keys(newData).filter(
        (d) => newData[d] !== oldData[d]
      );
      return keys.length ? true : false;
    },
  };
  const logoutHandler = () => {
    sessionStorageHelper.removeItem("isContactLensCheckboxChecked");
    deleteCookie(`clientV1_${pageInfo.country}`);
    setCookie("isLogined", 0);
    setCookie("log_in_status", false);
    deleteCookie("presalesUN");
    deleteCookie("presalesUP");
    setCookie("isPresale", false);
    window.location.href =
      !pageInfo.subdirectoryPath || pageInfo.subdirectoryPath === "NA"
        ? "/"
        : pageInfo.subdirectoryPath;

    //* logout sprinklr
    logoutSprinklrBot();
  };
  const getHeading = (isMobileTopSection: boolean) => {
    // To get the heading of the Mobile Container
    let heading = "";
    if (showAddAddress) {
      if (isMobileTopSection) heading = localeData?.YOUR_PERSONAL_DATA;
      else if (currentEditAddress) heading = localeData?.EDIT_ADDRESS;
      else heading = localeData?.ADD_NEW_ADDRESS;
    } else heading = localeData?.SELECT_ADDRESS;
    return heading;
  };

  useEffect(() => {
    return () => setCurrentEditAddress(null);
  }, []);
  // console.log(addressIndex, "addressIndex");

  const updateAddress = (data?: AddressObjectType) => {
    dispatch(
      updateShippingAddress({
        sessionId: sessionId,
        orderID: orderData?.id || "",
        addressDetail: data
          ? data
          : addressData.filter((address) => address.id === addressIndex)[0],
      })
    );
    setEditAddress && setEditAddress(false);
  };

  const DesktopContainer = () => (
    <PageContainer>
      <NextHead>
        <title>Checkout address</title>
      </NextHead>
      <CartHeader
        appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
        safeText={localeData.SAFE_SECURE}
      />
      <AddressBody>
        <CheckoutWrapper addressPage={true}>
          <CheckoutBase
            activeBreadcrumbId="shipping_address"
            breadcrumbData={breadcrumbData}
            isRTL={pageInfo.isRTL}
          >
            {authInfo?.dualLoginStatus?.isLoggedIn && (
              <LoginInfo>
                <Alert
                  color={AlertColorsENUM.blue}
                  componentSize={ComponentSizeENUM.medium}
                  font={TypographyENUM.lkSansRegular}
                  id="Alert"
                >
                  <Flex>
                    <span>
                      {"Logged in as"}{" "}
                      <LoginUser>
                        {authInfo?.dualLoginStatus?.data?.userName}
                      </LoginUser>
                    </span>
                    {/* <TextButton onClick={() => router.push("/checkout/signin")}> */}
                    <LogOutButton
                      onClick={logoutHandler}
                      // onClick={() =>
                      //   width < 1024
                      //     ? setBottomSheet(!bottomSheet)
                      //     : setshowAuthModal(true)
                      // }
                    >
                      Logout
                    </LogOutButton>
                  </Flex>
                </Alert>
                <Alert
                  color={AlertColorsENUM.blue}
                  componentSize={ComponentSizeENUM.medium}
                  font={TypographyENUM.lkSansRegular}
                  id="Alert"
                >
                  <Flex>
                    <span>
                      {"Logged in as"}{" "}
                      <LoginUser>{userInfo.mobileNumber}</LoginUser>
                    </span>
                    <LogOutButton onClick={logoutHandler}>Logout</LogOutButton>
                  </Flex>
                </Alert>
              </LoginInfo>
            )}
            {!showAddAddress && !userInfo.isGuestFlow ? (
              <>
                <Heading>{localeData.SELECT_ADDRESS}</Heading>
                {hasFrameProduct &&
                  configData?.ENABLE_POWER_WILL_BE_TAKEN_AFTER_CHECKOUT_IN_ADDRESS_TABS && (
                    <PowerCheckout margin="-15px">
                      {" "}
                      <Icons.InfoCircle />
                      {localeData?.POWER_WILL_BE_TAKEN_AFTER_CHECKOUT}
                    </PowerCheckout>
                  )}
                {showDeletedAddressText && (
                  <div style={{ marginBottom: "20px" }}>
                    <Alert
                      boxShadow={true}
                      color={AlertColorsENUM.white}
                      componentSize={ComponentSizeENUM.medium}
                      font={TypographyENUM.lkSansBold}
                    >
                      <span style={{ padding: "10px 0" }}>
                        {localeData.ADDRESS_DELETED}
                      </span>
                    </Alert>
                  </div>
                )}
                <SubHeading>{localeData.SAVED_ADDRESSES}</SubHeading>
              </>
            ) : (
              <>
                <HeadingBackPress
                  arrowAction={
                    !userInfo.isGuestFlow &&
                    userInfo.isLogin &&
                    allAddressData.length > 0
                      ? () => {
                          setShowAddAddress(false);
                          setIsEditAddress(false);
                          setShowPolicy(false);
                        }
                      : undefined
                  }
                  isRTL={pageInfo.isRTL}
                  signInText={localeData?.SAVE_ADDRESS}
                />
                {pageInfo.language !== "en" ? (
                  <div style={{ padding: "0 20px" }}>
                    <AlertMessage>
                      {localeData.CURRENTLY_ACCEPTING_ENTRIES_ENGLISH_ONLY}
                    </AlertMessage>
                  </div>
                ) : null}
              </>
            )}
            {/* <NewAddressForm /> */}
            {/* {formData.map(fd => <div key={fd.id}>{formRender(fd)}</div>)} */}
            {/* {!showAddAddress && (
            <AddNewAddressButton>
              <Button
              
                id="add-new"
                kind={kindENUM.tertiary}
                showChildren={true}
                width="20"
                onClick={toggleAddress}
                font={TypographyENUM.lkSansBold}
              >
                <Icons.AddIcon />
                ADD NEW ADDRESS
              </Button>
            </AddNewAddressButton>
          )} */}
            <div>
              {userInfo.isGuestFlow || userInfo.isLogin ? (
                <>
                  {!showAddAddress &&
                  !userInfo.isGuestFlow &&
                  allAddressData.length > 0 ? (
                    <Fragment>
                      {allAddressData
                        .slice(0, showMoreAddress ? undefined : 2)
                        .map((item: AddressObjectType, index: number) => {
                          return (
                            <CheckoutComponent.AddressTab
                              width="100"
                              {...item}
                              landmark={item?.landmark || ""}
                              submitRef={
                                addressIndex === item.id ? submitRef : null
                              }
                              phoneCode={phoneCode}
                              // selectedAddressIndex={{ id: addressIndex }}
                              key={item.id}
                              checked={addressIndex === item.id}
                              onChange={(id: number) => setAddressIndex(id)}
                              font={TypographyENUM.lkSansBold}
                              deliveryEstimate=""
                              onAdd={addAddressHandler}
                              onEdit={(id: number) => {
                                editAddressHandler(id);
                                setIsEditAddress(true);
                              }}
                              onDelete={(id: number) =>
                                deleteAddressHandler(id)
                              }
                              dataLocale={localeData}
                              gender={item.gender || null}
                              onSubmit={(
                                type: SubmitType,
                                id: number | string,
                                data: AddressObjectType
                              ) => postShippingAddress(type, id, data)}
                            />
                          );
                        })}
                      {allAddressData.length > 2 && (
                        <ShowMore onClick={showMoreHandler}>
                          <ShowMoreText>
                            {showMoreAddress
                              ? localeData.SHOW_LESS
                              : localeData.SHOW_MORE}
                          </ShowMoreText>{" "}
                          <ArrowContainer reverse={showMoreAddress}>
                            <Icons.DownArrow />
                          </ArrowContainer>
                        </ShowMore>
                      )}
                      <NewAddressField
                        onClick={addAddressHandler}
                        isApplied={false}
                        isMobileView={false}
                        isRTL={pageInfo.isRTL}
                      >
                        {localeData.ADD_NEW_ADDRESS}
                      </NewAddressField>
                    </Fragment>
                  ) : (
                    <>
                      <CheckoutComponent.AddAddressForm
                        // dataLocale={{
                        //   ADDRESS_LINE_1: "Address Line 1",
                        //   ADDRESS_LINE_2: "Address Line 2",
                        //   CITY_DISTRICT: "City/District",
                        //   CONTINUE: "CONTINUE",
                        //   COUNTRY: "Country",
                        //   EMAIL: "Email",
                        //   FIRST_NAME: "First Name",
                        //   LAST_NAME: "Last Name",
                        //   MOBILE: "Mobile",
                        //   STATE_PROVINCE: "State/Province",
                        //   VIEW_SAVED_ADDRESS: "VIEW SAVED ADDRESS",
                        //   ZIP_CODE: "Zip/Postal Code",
                        // }}
                        // addressForm={addressForm}
                        width={100}
                        headText={localeData?.ADD_NEW_ADDRESS}
                        InfoText={
                          localeData?.POWER_WILL_BE_TAKEN_AFTER_CHECKOUT
                        }
                        onClick={() => null}
                        showAnimation={false}
                        phoneCode={phoneCode}
                        disableAction={(dis: boolean) => setButtonDisabled(dis)}
                        dataLocale={localeData}
                        font={TypographyENUM.lkSansRegular}
                        userEmail={userInfo.guestEmail || userInfo.email}
                        userNumber={
                          userInfo.guestNumber || userInfo.mobileNumber
                        }
                        id="review-form"
                        initialAddressData={{
                          ...currentEditAddress,
                          firstName: userInfo?.userDetails?.firstName,
                          lastName: userInfo?.userDetails?.lastName,
                          gender: userInfo?.userDetails?.gender,
                        }}
                        onSubmit={(
                          type: SubmitType,
                          id: number | string,
                          data: AddressObjectType
                        ) => postShippingAddress(type, id, data)} // addressStepX 2
                        submitRef={submitRef}
                        onViewSaved={() =>
                          setShowAddAddress((showAddAddress) => !showAddAddress)
                        }
                        getPincodeData={getDeliveryStatus}
                        tempAddressData={temporaryStoreAddressData.get()}
                        updateTempAddressData={(data: DataType) =>
                          temporaryStoreAddressData.add(data)
                        }
                        onPincodeChanged={(pincode: string) =>
                          getDeliveryStatus(pincode)
                        }
                        stateList={{
                          options: countryStateData.states,
                          optionsText: "",
                          optionValue: "",
                        }}
                        countryList={{
                          options:
                            // pageInfo.country === "us"
                            //   ? countryStateData.country.filter(
                            //       (data) =>
                            //         data.country_code === "US" ||
                            //         data.country_code === "CA"
                            //     )
                            //   :
                            countryStateData.country,
                          optionsText: "country_name",
                          optionValue: "country_code",
                        }}
                        isRTL={pageInfo.isRTL}
                        configData={configData}
                        currCountry={pageInfo.country}
                        phoneCodeConfigData={
                          configData?.SUPPORT_MULTIPLE_COUNTRIES &&
                          configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
                          JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
                        }
                        incCountryCodeFont
                        deviceType={deviceType}
                        hasFrameProduct={
                          hasFrameProduct &&
                          configData?.ENABLE_POWER_WILL_BE_TAKEN_AFTER_CHECKOUT
                        }
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <Alert
                    color={AlertColorsENUM.blue}
                    componentSize={ComponentSizeENUM.large}
                    font={TypographyENUM.lkSansRegular}
                    id="Alert"
                  >
                    <CommonLoader
                      wrapperClassName="accordion-loader-wrapper"
                      overlayClassName="accordion-loader-overlay"
                      show={!userInfo.isGuestFlow || !userInfo.isLogin}
                    />
                  </Alert>
                </>
              )}
            </div>
          </CheckoutBase>
        </CheckoutWrapper>
        <CommonLoader
          wrapperClassName="accordion-loader-wrapper"
          overlayClassName="accordion-loader-overlay"
          show={showScreenLoader}
        />
        {!cartData.cartIsLoading ? (
          <RightWrapper padding="60px 0px">
            <StickyDiv>
              <HeadingText styledFont={TypographyENUM.lkSerifNormal}>
                {BILL_DETAILS}
              </HeadingText>
              {/* <NewPayment.PaymentAddress onBtnClick={changeAddressHandler}/> */}
              <NewPriceBreakup
                id="1"
                width="100"
                dataLocale={localeData}
                priceData={cartData.cartTotal}
                onShowCartBtnClick={() => {
                  router.push("/cart");
                }}
                subdirectoryPath={pageInfo.subdirectoryPath}
                showPolicy={pageInfo.country !== "sa" && showPolicy}
                showCart={false}
                policyLinks={
                  configData.POLICY_LINKS
                    ? JSON.parse(configData.POLICY_LINKS)
                    : null
                }
                currencyCode={getCurrency(pageInfo.country)}
                isRTL={pageInfo.isRTL}
                enableTax={configData?.ENABLE_TAX}
              />
              <Button
                id="button"
                showChildren={true}
                width="100"
                font={TypographyENUM.lkSansBold}
                // text={`₹${
                //   cartData?.cartTotal?.[cartData?.cartTotal?.length - 1]?.amount
                // } • ${localeData?.PLACE_ORDER}`}
                disabled={
                  !showAddAddress &&
                  !userInfo.isGuestFlow &&
                  allAddressData.length > 0
                    ? buttonDisabled ||
                      (!showAddAddress &&
                        !addressIndex &&
                        typeof addressIndex === "string")
                    : false
                }
                onClick={(e: any) => {
                  cartData.cartTotal && cartData.cartTotal.length
                    ? submitRef?.current && submitRef?.current.click()
                    : router.push(`/`);
                  !submitRef?.current
                    ? setOpenSelectAddressModal(true)
                    : setOpenSelectAddressModal(false);
                  addShippingInfoGA4(cartData, userInfo?.isLogin, pageInfo);
                }}
              >
                {/* {showScreenLoader  */}
                {/* <Link href={"/checkout"} passHref> */}
                <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                  {cartData.cartTotal && cartData.cartTotal.length ? (
                    <>
                      {localeData.DESKTOP_CHECKOUT_ADDRESS_CTA}
                      {""}
                      <IconContainer isRTL={pageInfo.isRTL} setMargin={false}>
                        <Icons.DardBlueRightIcon />
                      </IconContainer>
                    </>
                  ) : (
                    <>{localeData.CONTINUE_SHOPPING}</>
                  )}
                </ButtonContent>
              </Button>
              {openSelectAddressModal && (
                <ToastMessage
                  message="Please Select an Address First"
                  color="#e74c3c"
                  duration={3000}
                  show={openSelectAddressModal}
                  hideFn={() => setOpenSelectAddressModal(false)}
                />
              )}
            </StickyDiv>
          </RightWrapper>
        ) : (
          <div style={{ padding: "90px 50px" }}>
            <CommonLoader />
          </div>
        )}
      </AddressBody>
    </PageContainer>
  );

  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );

  const MobileContainer = () => (
    <>
      {!showAddAddress && !setEditAddress && (
        <Header
          logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
          showBackBtn={true}
          onClickBack={() => {
            if (showAddAddress) setShowAddAddress(false);
            else history.back();
          }}
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
          pageNumber={2}
          isRTL={pageInfo.isRTL}
        />
      )}
      {!showAddAddress && setEditAddress && (
        <EditAddressHeader
          localeData={localeData}
          setEditAddress={setEditAddress}
        />
      )}
      <PageContainer>
        {showAddAddress && (
          <>
            <NewAddressHeader>
              <AddressHeading>{getHeading(false)}</AddressHeading>
              <Icons.Cross
                onClick={() => {
                  setIsEditAddress(false);
                  allAddressData.length > 0
                    ? setShowAddAddress(!showAddAddress)
                    : router.push("/cart");
                }}
              />
            </NewAddressHeader>
          </>
        )}

        {showAddAddress && <Height></Height>}

        {showAddAddress && pageInfo.language !== "en" ? (
          <div style={{ marginTop: "30px" }}>
            <AlertMessage>
              {localeData.CURRENTLY_ACCEPTING_ENTRIES_ENGLISH_ONLY}
            </AlertMessage>
          </div>
        ) : null}
        {!!setEditAddress ? (
          !showAddAddress && <EmptySpace />
        ) : (
          <CheckoutMobile.TopSection
            heading={getHeading(true)}
            showChildren={true}
            fontSmall={true}
            isAddressPage={localeData?.YOUR_PERSONAL_DATA === getHeading(true)}
            disableTopPadding={pageInfo.language !== "en" ? true : false}
          >
            <div>
              <NeedHelpCta
                isRendered={buyOnChatConfig?.cta?.isShown}
                isBuyOnChat={buyOnChatConfig?.buyonchat}
                localeData={localeData}
                whatsappChatMsg={whatsAppChatMsg}
                phoneNumber={buyOnChatConfig.eyeglasses.tel}
                // onClick={() => {}}
              />
            </div>
          </CheckoutMobile.TopSection>
        )}
        {showDeletedAddressText && !showAddAddress && (
          <div style={{ margin: "0 15px", marginBottom: "20px" }}>
            <Alert
              boxShadow={true}
              color={AlertColorsENUM.white}
              componentSize={ComponentSizeENUM.medium}
              font={TypographyENUM.lkSansBold}
            >
              <span style={{ padding: "5px" }}>
                {localeData.ADDRESS_DELETED}
              </span>
            </Alert>
          </div>
        )}
        {!showAddAddress && (
          <>
            <AddressesContainer>
              {hasFrameProduct &&
                configData?.ENABLE_POWER_WILL_BE_TAKEN_AFTER_CHECKOUT_IN_ADDRESS_TABS && (
                  <PowerCheckoutMsite margin="0 -15px -15px -15px">
                    {" "}
                    <Icons.InfoCircle />
                    {localeData?.POWER_WILL_BE_TAKEN_AFTER_CHECKOUT}
                  </PowerCheckoutMsite>
                )}
              <CheckoutMobile.SavedAddressTiles
                addresses={allAddressData}
                isShowMore={showMoreAddress}
                editAddress={(id: number) => {
                  editAddressHandler(id);
                  setIsEditAddress(true);
                }}
                deleteAddress={(
                  id: number,
                  setLoading: React.Dispatch<React.SetStateAction<boolean>>
                ) => setMsiteDeletePopup({ render: true, id })}
                handleShowMoreClick={showMoreHandler}
                dataLocale={localeData}
                isPostcode={true}
                font={TypographyENUM.lkSansRegular}
                isSelected={addressIndex}
                selectAddress={(id: number) => setAddressIndex(id)}
                configData={configData}
              />
              <CheckoutMobile.DeleteAddressModal
                dataLocale={localeData}
                deleteAddress={(
                  id: number,
                  setLoading: React.Dispatch<React.SetStateAction<boolean>>
                ) => deleteAddressHandler(id, setLoading)}
                font={TypographyENUM.lkSansRegular}
                cancel={() => setMsiteDeletePopup({ render: false, id: null })}
                id={msiteDeletePopup.id}
                show={msiteDeletePopup.render}
                title={localeData?.DELETE_ADDRESS_QUESTION_MARK}
                description={
                  localeData?.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ADDRESS
                }
              />
            </AddressesContainer>

            <AddNewAddressContainer>
              <AddNewAddressCTA
                width={100}
                headText={localeData?.ADD_NEW_ADDRESS}
                font={TypographyENUM.lkSansRegular}
                showAnimation={false}
                onClick={addAddressHandler}
                isRTL={pageInfo.isRTL}
              />
            </AddNewAddressContainer>
            <CheckoutMobile.CheckoutFloatingSheet>
              <Button
                id="floating-sheet-button"
                style={{ paddingTop: "7px", paddingBottom: "7px", height: 46 }}
                font={TypographyENUM.lkSansBold}
                width="100"
                showChildren={true}
                // text={
                //   isReturnRefund || isExchange
                //     ? "Continue"
                //     : placeOrderButtonText
                // }
                // showRightIcon={true}
                // rightIcon={<Icons.IconRightMobile width={20} height={20} />}
                loading={showScreenLoader}
                isRTL={pageInfo.isRTL}
                disabled={
                  isPlaceOrderDisabled ||
                  (!userInfo.isGuestFlow &&
                    allAddressData.length === 0 &&
                    !showAddAddress)
                }
                onClick={() => {
                  addressIndex &&
                    (!!setEditAddress
                      ? updateAddress()
                      : postShippingAddress(
                          SubmitType.read,
                          addressIndex,
                          addressData.filter(
                            (address) => address.id === addressIndex
                          )[0]
                        ));
                  addShippingInfoGA4(cartData, userInfo?.isLogin, pageInfo);
                }}
              >
                <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                  {showScreenLoader ? (
                    ""
                  ) : (
                    <>
                      {isReturnRefund || isExchange || isOrderDetailPage
                        ? localeData.CONTINUE
                        : placeOrderButtonText}
                      <IconContainer isRTL={pageInfo.isRTL}>
                        <Icons.IconRight />
                      </IconContainer>
                    </>
                  )}
                </ButtonContent>
              </Button>
            </CheckoutMobile.CheckoutFloatingSheet>
          </>
        )}
        {showAddAddress && (
          <>
            <AddressFormContainer>
              <CheckoutMobile.AddAddressForm
                phoneCode={phoneCode}
                dataLocale={localeData}
                font={TypographyENUM.lkSansRegular}
                userEmail={userInfo.guestEmail || userInfo.email}
                userNumber={userInfo.guestNumber || userInfo.mobileNumber}
                id="add-address-form"
                localeData={localeData}
                configData={configData}
                currCountry={pageInfo.country}
                onSubmit={(
                  type: SubmitType,
                  id: number | null,
                  data: AddressObjectType
                ) =>
                  !!setEditAddress
                    ? updateAddress(data)
                    : postShippingAddress(type, id as number, data)
                }
                submitRef={submitRef}
                getPincodeData={getDeliveryStatus}
                onPincodeChanged={(pincode: any) => getDeliveryStatus(pincode)}
                stateList={{
                  options: countryStateData.states,
                  optionsText: "",
                  optionValue: "",
                }}
                countryList={{
                  options:
                    // pageInfo.country === "us"
                    //   ? countryStateData.country.filter(
                    //       (data) =>
                    //         data.country_code === "US" ||
                    //         data.country_code === "CA"
                    //     )
                    //   :
                    countryStateData.country,
                  optionsText: "country_name",
                  optionValue: "country_code",
                }}
                initialAddressData={{
                  ...currentEditAddress,
                  firstName: userInfo?.userDetails?.firstName || "",
                  lastName: userInfo?.userDetails?.lastName || "",
                  gender: userInfo?.userDetails?.gender || "",
                }}
                isRTL={pageInfo.isRTL}
                checkoutAsGuest={userInfo.isGuestFlow}
                updateTempAddressData={(data: DataType) =>
                  temporaryStoreAddressData.add(data)
                }
                tempAddressData={temporaryStoreAddressData.get()}
                deviceType={deviceType}
              />
            </AddressFormContainer>
            <CheckoutMobile.CheckoutFloatingSheet>
              <Button
                id="floating-sheet-button"
                style={{ paddingTop: "7px", paddingBottom: "7px", height: 46 }}
                font={TypographyENUM.lkSansBold}
                width="100"
                text={addAddressButtonText}
                showRightIcon={true}
                rightIcon={<Icons.IconRightMobile width={20} height={20} />}
                loading={showScreenLoader}
                disabled={isPlaceOrderDisabled}
                onClick={() => {
                  addShippingInfoGA4(cartData, userInfo?.isLogin, pageInfo);
                  submitRef?.current && submitRef?.current.click();
                }}
              />
            </CheckoutMobile.CheckoutFloatingSheet>
          </>
        )}
      </PageContainer>
    </>
  );

  return (
    <>
      {toast ? (
        DeviceTypes.DESKTOP === deviceType ? (
          <ToastMessage
            message={toast}
            color="orange"
            duration={5000}
            show={!!toast}
            hideFn={() => {
              setToast("");
            }}
            showIcon={false}
          />
        ) : (
          <Toast
            text={toast}
            hideFn={() => {
              setToast("");
            }}
            width={"90%"}
          />
        )
      ) : null}
      {pageInfo?.deviceType === "desktop" && <DesktopContainer />}
      {pageInfo?.deviceType === "mobilesite" && <MobileContainer />}
    </>
  );
};

export default Checkout;

// export const getServerSideProps: GetServerSideProps = async context => {
//   const { req, res } = context;
//   const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });
//   const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
//   const sessionId = `${getCookie(`clientV1_${country}`, { req, res })}`;
//   api.sessionToken = sessionId;
//   api.setHeaders(headerArr);
//   if (!isSessionAvailable) {
//     return {
//       notFound: true,
//     };
//   } else {
//     const { data: countryStateData } =
//       await checkoutFunctions.fetchCountryState(api);
//     const { data: addressData } = await checkoutFunctions.fetchAddress(api);
//     const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`).setHeaders(headerArr).setMethod(APIMethods.GET);
//     const { data: localeData } = await fireBaseFunctions.getConfig(LOCALE, configApi)
//     return {
//       props: {
//         addressData: addressData,
//         countryStateData: countryStateData,
//         sessionId: sessionId,
//         localeData: localeData
//       },
//     };
//   }
// };
