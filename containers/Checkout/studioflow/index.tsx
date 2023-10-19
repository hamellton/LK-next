import { useCallback, useEffect, useRef, useState } from "react";
import { APIMethods } from "@/types/apiTypes";
import { DataType } from "@/types/coreTypes";
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
  IconContainerStudio,
} from "../address/styles";
import {
  TypographyENUM,
  ComponentSizeENUM,
  AlertColorsENUM,
  ThemeENUM,
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
  StudioFlow as StudioFlowComponent,
  ToastMessage,
  Toast,
} from "@lk/ui-library";
import { APIService, RequestBody } from "@lk/utils";
import { deleteCookie, getCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { CommonLoader } from "@lk/ui-library";
import NextHead from "next/head";
import { addShippingInfoGA4 } from "helpers/gaFour";
import { CheckoutMobile, NeedHelpCta } from "@lk/ui-library";
import Header from "../../Cart/MobileCartHeader";
import "react-loading-skeleton/dist/skeleton.css";

import { CheckoutWrapper, Heading } from "../../../pageStyles/Checkout.styles";
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
import { fetchCarts } from "@/redux/slices/cartInfo";
import { Router, useRouter } from "next/router";
import { updateShippingAndDeliveryData } from "@/redux/slices/paymentInfo";
import { userProperties } from "helpers/userproperties";
import styled from "styled-components";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import CheckoutBase from "containers/Checkout/Checkout.component";
import { getCurrency, isValidMobile } from "helpers/utils";
import {
  fetchStores,
  updateSelectedStore,
  updateShippingAddress,
  isStoreSelectedReducer,
  resetUpdateShippingAddressError,
} from "@/redux/slices/studioflow";
import { Store } from "@/types/state/studioflowInfoType";
import {
  AddressInputContainer,
  MsiteFormContainer,
  MsitePageContainer,
  MsiteStores,
  NoResultsContainer,
  SectionHeading,
} from "./Studioflow.styles";
import { FormData } from "./Studioflow.types";
import useGeoLocation from "hooks/useGeoLocation";
import Skeleton from "react-loading-skeleton";
import { fetchWishlist, saveToWishlist } from "@/redux/slices/wishListInfo";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { logoutSprinklrBot } from "helpers/chatbot";

const LoginInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;
const LoginUser = styled.span`
  color: #445962;
  font-family: ${TypographyENUM.lkSansBold};
`;
const LogOutButton = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  color: #e34934;
  text-decoration: underline;
`;
enum SubmitType {
  add = "ADD",
  edit = "EDIT",
  read = "READ",
}
const CheckoutStudioFlow = ({
  addressData,
  countryStateData,
  sessionId,
  localeData,
  phoneCode,
  configData,
  isReturnRefund,
  isExchange,
}: CheckoutType) => {
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const [allAddressData, setAllAddressData] = useState(addressData);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
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
  const [selectedBreadcrumb, setSelectedBreadCrumb] = useState("select_store");
  const [contactDetails, setContactDetails] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "male",
    email: "",
    phone: "",
    phoneCode: pageInfo.countryCode,
  });
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { location, error: locationError } = useGeoLocation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const submitRef = useRef<HTMLFormElement>(null);
  const userDetailsFormRef = useRef<HTMLFormElement>(null);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const authInfo = useSelector((state: RootState) => state.authInfo);
  const wishlistInfo = useSelector((state: RootState) => state.wishListInfo);
  const [phoneNum, setPhoneNum] = useState("");
  const studioFlowInfo = useSelector(
    (state: RootState) => state.studioFlowInfo
  );
  const [locationProvided, setLocationProvided] = useState(false);
  const getHeader = () => {
    return locationProvided
      ? localeData.NEARBY_LENSKART_STORES
      : localeData?.STORES || "Stores";
  };

  // const isGuestFlow = useSelector((state: RootState) => state.userInfo.isGuestFlow);
  const { isError, errorMessage } = useSelector(
    (state: RootState) => state.paymentInfo
  );
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [fireGA, setFireGA] = useState(false);

  // const placeOrderButtonText = `${
  //   cartData?.cartTotal?.length
  //     ? "₹" +
  //       cartData?.cartTotal?.[cartData?.cartTotal?.length - 1]?.amount +
  //       " • "
  //     : ""
  // }${localeData?.PLACE_ORDER}`;

  // const isPlaceOrderDisabled =
  //   !showAddAddress && !userInfo.isGuestFlow && allAddressData.length > 0
  //     ? buttonDisabled ||
  //       (!showAddAddress && !addressIndex && typeof addressIndex === "string")
  //     : false;

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
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (studioFlowInfo.updateShippingAddress.isError) {
      setToast(studioFlowInfo.updateShippingAddress.errorMsg);
      dispatch(resetUpdateShippingAddressError());
    }
  }, [studioFlowInfo.updateShippingAddress.isError]);

  useEffect(() => {
    userProperties(
      userInfo,
      pageName,
      pageInfo,
      localeData,
      "add-address-page"
    );
  }, [fireGA]);

  useEffect(() => {
    if (selectedBreadcrumb === "user_details" && !userInfo.userLoading)
      setTimeout(() => {
        setFireGA(true);
      }, 0);
  }, [userInfo.userLoading, pageInfo, selectedBreadcrumb]);

  useEffect(() => {
    setPhoneNum(
      isValidMobile(
        userInfo?.mobileNumber?.toString() ?? "",
        process.env.NEXT_PUBLIC_APP_COUNTRY ?? ""
      )
        ? userInfo.mobileNumber
        : ""
    );
  }, []);

  useEffect(() => {
    if (studioFlowInfo.isStoreSelected) {
      setSelectedBreadCrumb(
        pageInfo.deviceType === DeviceTypes.MOBILE
          ? "contact_details"
          : "user_details"
      );
    }
  });

  useEffect(() => {
    dispatch(
      fetchWishlist({
        sessionId: sessionId,
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  }, [dispatch, sessionId, pageInfo.subdirectoryPath]);

  // useEffect(() => {
  //   if (cartData) addShippingInfoGA4(cartData, userInfo.isLogin);
  // }, [cartData]);
  const [showScreenLoader, setShowScreenLoader] = useState(false);
  //   getDeliveryOptions
  const postShippingAddress = async (
    type: SubmitType,
    id: number | string,
    data: AddressObjectType
  ) => {
    setShowScreenLoader(true);
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
        alert(`Error: ${userErr.message}`);
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
          alert(`Error: ${addAddrErr.message}`);
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
            alert(`Error: ${error.message}`);
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
          alert(`Error: ${error.message}`);
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
        alert(`Error: ${editAddrErr.message}`);
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
          alert(`Error: ${error.message}`);
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
        alert(`Error: ${error.message}`);
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
  };

  const toggleAddress = () => {
    setShowAddAddress((showAddAddress) => !showAddAddress);
    setShowPolicy((showPolicy) => !showPolicy);
  };

  useEffect(() => {
    const longitude = location?.coords?.longitude || "";
    const latitude = location?.coords?.latitude || "";
    const reqObjStores: { sessionId: string; params: string } = {
      sessionId: sessionId,
      params: `?longitude=${longitude}&latitude=${latitude}`,
    };
    sessionId && dispatch(fetchStores(reqObjStores));
    const reqObjCarts: { sessionId: string } = {
      sessionId: sessionId,
    };
    if (sessionId) {
      if (longitude && latitude) {
        setLocationProvided(true);
        dispatch(fetchStores(reqObjStores));
      } else if (locationError) {
        setLocationProvided(false);
      }
      dispatch(fetchCarts(reqObjCarts));
    }
  }, [sessionId, dispatch, location?.coords, location, locationError]);

  useEffect(() => {
    if (studioFlowInfo.stores.length)
      setSelectedStore(studioFlowInfo.stores[0]);
    else {
      setSelectedStore(null);
    }
  }, [studioFlowInfo?.stores]);

  useEffect(() => {
    if (selectedStore) {
      dispatch(updateSelectedStore(selectedStore));
      localStorage.setItem("selectedStore", JSON.stringify(selectedStore));
    }
  }, [selectedStore]);

  useEffect(() => {
    if (
      !(allAddressData.length > 0) &&
      !userInfo.isGuestFlow &&
      !userInfo.isLogin &&
      !userInfo.userLoading
    )
      router.push("/checkout/signin"); //
  }, [
    userInfo.isGuestFlow,
    userInfo.isLogin,
    userInfo.userLoading,
    allAddressData?.length,
    router,
    pageInfo.subdirectoryPath,
  ]);

  useEffect(() => {
    if (contactDetails.email && contactDetails.phone) {
      sessionStorageHelper.setItem("checkoutUserPhone", contactDetails.phone);
      sessionStorageHelper.setItem("checkoutUserEmail", contactDetails.email);
      sessionStorageHelper.setItem(
        "checkoutUserName",
        contactDetails.firstName
      );
    } else {
      sessionStorageHelper.removeItem("checkoutUserPhone");
      sessionStorageHelper.removeItem("checkoutUserEmail");
      sessionStorageHelper.removeItem("checkoutUserName");
    }
  }, [contactDetails]);

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
      console.log(error);
    } else {
      // dispatch(fetchCarts({sessionId: sessionId}));
      api.setMethod(APIMethods.GET);
      const { data: addressData, error } = await checkoutFunctions.fetchAddress(
        api
      );
      if (!error.isError) setAllAddressData(addressData);
      // alert("Successfully deleted!")
    }
  };
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
      onClick: () => router.push("/checkout/signin"),
      disabled: !(
        (userInfo.isGuestFlow &&
          (userInfo.guestNumber || userInfo.guestEmail) &&
          !userInfo.isLogin) ||
        false
      ),
      id: "account_verification",
    },
    {
      text: "Select Store",
      onClick: () => setSelectedBreadCrumb("select_store"),
      disabled: false,
      id: "select_store",
    },
    {
      text: "User Details",
      onClick: () => setSelectedBreadCrumb("user_details"),
      disabled: selectedBreadcrumb === "select_store" ? true : false,
      id: "user_details",
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
    window.location.href =
      !pageInfo.subdirectoryPath || pageInfo.subdirectoryPath === "NA"
        ? "/"
        : pageInfo.subdirectoryPath;

    //* logout sprinklr
    logoutSprinklrBot();
  };
  const getHeading = () => {
    // To get the heading of the Mobile Container
    let heading = "";
    if (selectedBreadcrumb === "select_store") {
      heading = localeData?.SELECT_A_STORE;
    } else heading = localeData?.CONTACT_DETAILS;
    return heading;
  };

  const handleStudioFlowSubmit = (cdState: FormData) => {
    dispatch(
      updateShippingAddress({
        sessionId,
        address: selectedStore as Store,
        contactDetails: cdState,
        studioStoreDetails: {
          code: selectedStore?.code,
          name: selectedStore?.name,
        },
        router,
      })
    );
  };

  const handleSearch = useCallback(
    (searchValue: string) => {
      setSearchValue(searchValue);
      if (searchValue)
        setSearchResults(
          studioFlowInfo.stores.filter(
            (store) =>
              store.name
                .toLowerCase()
                .indexOf(searchValue.trim().toLowerCase()) !== -1
          )
        );
      else setSearchResults([]);
    },
    [studioFlowInfo.stores]
  );

  const goBack = () => {
    if (selectedBreadcrumb === "select_store") router.back();
    else setSelectedBreadCrumb("select_store");
  };

  const desktopContainer = (
    <PageContainer>
      <NextHead>
        <title>Checkout address</title>
      </NextHead>
      <CartHeader
        appLogo={localeData.LENSKART_LOGO}
        safeText={localeData.SAFE_SECURE}
      />
      {toast && (
        <ToastMessage
          message={toast}
          color="orange"
          duration={2000}
          show={!!toast}
          hideFn={() => {
            setToast("");
          }}
          showIcon={false}
        />
      )}

      <AddressBody>
        <CheckoutWrapper>
          <CheckoutBase
            activeBreadcrumbId={selectedBreadcrumb}
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
                      {localeData.LOGGED_IN_AS as string}{" "}
                      <LoginUser>
                        {authInfo?.dualLoginStatus?.data?.userName}
                      </LoginUser>
                    </span>
                    <LogOutButton onClick={logoutHandler}>
                      {localeData.LOGOUT as string}
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
                      {localeData.LOGGED_IN_AS as string}{" "}
                      <LoginUser>{userInfo.mobileNumber}</LoginUser>
                    </span>
                    <LogOutButton onClick={logoutHandler}>
                      {localeData.LOGOUT as string}
                    </LogOutButton>
                  </Flex>
                </Alert>
              </LoginInfo>
            )}
            {/* Get Selected Store info from user in studioflow - START */}
            {selectedBreadcrumb === "select_store" && (
              <>
                <Heading>{localeData.SELECT_STORE_ADDRESS}</Heading>
                {!studioFlowInfo.isLoading && !studioFlowInfo.stores.length && (
                  <NoResultsContainer>
                    <StudioFlowComponent.NoResults localeData={localeData} />
                  </NoResultsContainer>
                )}
                {!studioFlowInfo.isLoading &&
                  !!studioFlowInfo.stores.length && (
                    <>
                      <StudioFlowComponent.Note>
                        {localeData.NOTE_STUDIOFLOW_DESKTOP as string}
                      </StudioFlowComponent.Note>
                      <AddressInputContainer>
                        <StudioFlowComponent.SearchBox
                          dataLocale={localeData}
                          value={searchValue}
                          onSearch={handleSearch}
                          isRTL={pageInfo.isRTL}
                        />
                      </AddressInputContainer>
                      {!!studioFlowInfo.stores.length && !searchValue && (
                        <>
                          {locationProvided && (
                            <>
                              <SectionHeading>
                                {getHeader() as string}
                              </SectionHeading>
                              <StudioFlowComponent.NearestStore
                                store={studioFlowInfo.stores[0]}
                                isSelected={
                                  selectedStore?.code ===
                                  studioFlowInfo.stores[0].code
                                }
                                onClick={(store: Store) => {
                                  setSelectedStore(store);
                                  // setSelectedBreadCrumb("user_details");
                                }}
                                localeData={localeData}
                              />
                            </>
                          )}

                          {studioFlowInfo.stores.some(
                            (store) => store?.isAvailable
                          ) ? (
                            <>
                              {!!studioFlowInfo.stores
                                .slice(
                                  Number(`${locationProvided ? 1 : 0}`),
                                  -1
                                )
                                .filter((store) => store?.isAvailable)
                                .length && (
                                <SectionHeading>
                                  {localeData.STORES || ("Stores" as string)}
                                </SectionHeading>
                              )}
                              <StudioFlowComponent.OtherStores
                                stores={studioFlowInfo.stores
                                  .slice(
                                    Number(`${locationProvided ? 1 : 0}`),
                                    -1
                                  )
                                  .filter((store) => store?.isAvailable)}
                                selected={selectedStore}
                                onClick={(store: Store) => {
                                  setSelectedStore(store);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <SectionHeading>
                                {localeData.STORES || ("Stores" as string)}
                              </SectionHeading>
                              <StudioFlowComponent.OtherStores
                                stores={studioFlowInfo.stores.slice(
                                  Number(`${locationProvided ? 1 : 0}`),
                                  -1
                                )}
                                selected={selectedStore}
                                onClick={(store: Store) => {
                                  setSelectedStore(store);
                                }}
                              />
                            </>
                          )}
                        </>
                      )}
                      {!!studioFlowInfo.stores.length && searchValue && (
                        <>
                          <SectionHeading>
                            {localeData.SEARCH_RESULTS as string}
                          </SectionHeading>
                          <StudioFlowComponent.OtherStores
                            stores={searchResults}
                            selected={selectedStore}
                            onClick={(store: Store) => {
                              setSelectedStore(store);
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
              </>
            )}
            {/* Get Selected Store info from user in studioflow - END */}

            {/* Get user details in studioflow - START */}
            {selectedBreadcrumb === "user_details" && (
              <>
                <Heading>{localeData.CONTACT_DETAILS}</Heading>
                <StudioFlowComponent.UserDetailsForm
                  submitCallback={(formData: FormData) => {
                    setContactDetails(formData);
                    if (cartData?.cartTotal && cartData?.cartTotal.length)
                      handleStudioFlowSubmit(formData);
                    else router.push(`/`);
                  }}
                  ref={userDetailsFormRef}
                  localeData={localeData}
                  initialFormState={{
                    firstName: userInfo.userDetails?.firstName ?? "",
                    lastName: userInfo.userDetails?.lastName ?? "",
                    email: userInfo.email ?? userInfo.guestEmail ?? "",
                    gender: userInfo.userDetails?.gender ?? "male",
                    phone: isValidMobile(
                      userInfo.mobileNumber?.toString() ?? "",
                      process.env.NEXT_PUBLIC_APP_COUNTRY ?? ""
                    )
                      ? userInfo.mobileNumber
                      : "",
                    phoneCode: pageInfo.countryCode,
                  }}
                  isRTL={pageInfo.isRTL}
                  genderConfig={configData?.GENDER_CONFIG}
                />
              </>
            )}
            {/* Get user details in studioflow - END */}
          </CheckoutBase>
        </CheckoutWrapper>
        <CommonLoader
          wrapperClassName="accordion-loader-wrapper"
          overlayClassName="accordion-loader-overlay"
          show={showScreenLoader || studioFlowInfo.isLoading}
        />
        {!cartData?.cartIsLoading && !studioFlowInfo.isLoading ? (
          <RightWrapper padding="60px 0px">
            <StickyDiv>
              <HeadingText styledFont={TypographyENUM.lkSansRegular}>
                {BILL_DETAILS}
              </HeadingText>
              {/* <NewPayment.PaymentAddress onBtnClick={changeAddressHandler}/> */}
              <NewPriceBreakup
                id="1"
                width="100"
                dataLocale={localeData}
                priceData={cartData?.cartTotal}
                onShowCartBtnClick={() => {
                  router.push("/cart");
                }}
                showPolicy={pageInfo.country !== "sa" && showPolicy}
                showCart={true}
                policyLinks={
                  configData.POLICY_LINKS
                    ? JSON.parse(configData.POLICY_LINKS)
                    : null
                }
                subdirectoryPath={pageInfo.subdirectoryPath}
                currencyCode={getCurrency(pageInfo.country)}
                isRTL={pageInfo.isRTL}
                enableTax={configData?.ENABLE_TAX}
              />
              {selectedBreadcrumb === "user_details" &&
                configData.ENABLE_STUDIOFLOW && (
                  <Button
                    id="button"
                    showChildren={true}
                    width="100"
                    font={TypographyENUM.lkSansBold}
                    // text={`₹${
                    //   cartData?.cartTotal?.[cartData?.cartTotal?.length - 1]?.amount
                    // } • ${localeData?.PLACE_ORDER}`}
                    disabled={false}
                    onClick={(e: any) => {
                      userDetailsFormRef.current?.click();
                      addShippingInfoGA4(cartData, userInfo?.isLogin, pageInfo);
                    }}
                  >
                    {/* {showScreenLoader  */}
                    {/* <Link href={"/checkout"} passHref> */}
                    <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                      {cartData?.cartTotal && cartData?.cartTotal.length ? (
                        <>
                          {(localeData.PROCEED_TO_PAY as string) + " "}
                          <IconContainer isRTL={pageInfo.isRTL}>
                            <Icons.DardBlueRightIcon />
                          </IconContainer>
                        </>
                      ) : (
                        <>{localeData.CONTINUE_SHOPPING}</>
                      )}
                    </ButtonContent>
                  </Button>
                )}
              {selectedBreadcrumb === "select_store" &&
                configData.ENABLE_STUDIOFLOW && (
                  <Button
                    id="button"
                    showChildren={true}
                    width="100"
                    font={TypographyENUM.lkSansBold}
                    // text={`₹${
                    //   cartData?.cartTotal?.[cartData?.cartTotal?.length - 1]?.amount
                    // } • ${localeData?.PLACE_ORDER}`}
                    disabled={!selectedStore && !studioFlowInfo.isAvailable}
                    onClick={(e: any) => setSelectedBreadCrumb("user_details")}
                    theme={ThemeENUM.secondary}
                  >
                    {/* {showScreenLoader  */}
                    {/* <Link href={"/checkout"} passHref> */}
                    <ButtonContent
                      style={{ color: "var(--white)" }}
                      styledFont={TypographyENUM.lkSansBold}
                    >
                      {cartData?.cartTotal && cartData?.cartTotal.length ? (
                        <>
                          {(localeData.SELECT_STORE_AND_PROCEED as string) +
                            " "}
                          <IconContainerStudio isRTL={pageInfo.isRTL}>
                            <Icons.IconRight />
                          </IconContainerStudio>
                        </>
                      ) : (
                        <>{localeData.CONTINUE_SHOPPING}</>
                      )}
                    </ButtonContent>
                  </Button>
                )}
              {!configData.ENABLE_STUDIOFLOW && (
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
                  onClick={(e: any) =>
                    cartData?.cartTotal && cartData?.cartTotal.length
                      ? submitRef?.current && submitRef?.current.click()
                      : router.push(`/`)
                  }
                >
                  {/* {showScreenLoader  */}
                  {/* <Link href={"/checkout"} passHref> */}
                  <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                    {cartData?.cartTotal && cartData?.cartTotal.length ? (
                      <>
                        {localeData.CONFIRM}{" "}
                        <IconContainer isRTL={pageInfo.isRTL}>
                          <Icons.IconRight />
                        </IconContainer>
                      </>
                    ) : (
                      <>{localeData.CONTINUE_SHOPPING}</>
                    )}
                  </ButtonContent>
                </Button>
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

  const mobileContainer = (
    <>
      <Header
        logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
        showBackBtn={true}
        onClickBack={() => {
          if (showAddAddress) setShowAddAddress(false);
          else if (selectedBreadcrumb === "contact_details")
            setSelectedBreadCrumb("select_store");
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
      {toast && (
        <Toast
          text={toast}
          hideFn={() => {
            setToast("");
          }}
          width={"90%"}
        />
      )}
      <MsitePageContainer>
        <StudioFlowComponent.TopSection
          title={getHeading()}
          goBack={() => goBack()}
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
        </StudioFlowComponent.TopSection>
        {studioFlowInfo.isLoading && (
          <MsiteStores>
            <StudioFlowComponent.StudioFlowSkeleton />
          </MsiteStores>
        )}
        {
          // below contion is for when no stores in API response
          !studioFlowInfo.isLoading &&
            selectedBreadcrumb === "select_store" &&
            !studioFlowInfo.stores.length && (
              <>
                <StudioFlowComponent.MsiteNoResults
                  localeData={localeData}
                  items={cartItems}
                  wishlistedProductIds={wishlistInfo.productIds}
                  saveToWishlist={(pid: number) =>
                    dispatch(
                      saveToWishlist({
                        productId: pid,
                        sessionId,
                        subdirectoryPath: pageInfo.subdirectoryPath,
                        url: router.asPath,
                      })
                    )
                  }
                />
                <StudioFlowComponent.MsiteFloatingWindow
                  onClick={() => history.back()}
                  localeData={localeData}
                  disabled={!!studioFlowInfo.stores.length}
                  buttonText={
                    localeData?.VIEW_SIMILAR_ITEMS || "VIEW SIMILAR ITEMS"
                  }
                />
              </>
            )
        }
        {
          //Below condition is to show store when studioFlowInfo.isAvailable is false and studioFlowInfo.stores is not empty in API response
          selectedBreadcrumb === "select_store" &&
            !studioFlowInfo.isLoading &&
            !!studioFlowInfo.stores.length &&
            studioFlowInfo.isAvailable === false && (
              <>
                <StudioFlowComponent.MsiteSearch
                  stores={studioFlowInfo.stores}
                  onSelect={(store: Store) => {
                    setSelectedStore(store);
                    setSelectedBreadCrumb("contact_details");
                  }}
                  storeAvailable={locationProvided}
                  localeData={localeData}
                />
                <MsiteStores>
                  {studioFlowInfo.stores.map((store, idx) => (
                    <StudioFlowComponent.RadioStore
                      key={store.code}
                      store={store}
                      selected={store.code === selectedStore?.code}
                      onClick={setSelectedStore}
                      localeData={localeData}
                    />
                  ))}
                </MsiteStores>
                <StudioFlowComponent.MsiteFloatingWindow
                  onClick={() => setSelectedBreadCrumb("contact_details")}
                  localeData={localeData}
                  disabled={!selectedStore}
                />
              </>
            )
        }

        {
          //Below condition is to show store when studioFlowInfo.isAvailable is true
          selectedBreadcrumb === "select_store" &&
            !studioFlowInfo.isLoading &&
            !!studioFlowInfo.stores.length &&
            studioFlowInfo.stores.some((store) => store?.isAvailable) && (
              <>
                <StudioFlowComponent.MsiteSearch
                  stores={studioFlowInfo.stores.filter(
                    (store) => store?.isAvailable
                  )}
                  onSelect={(store: Store) => {
                    setSelectedStore(store);
                    setSelectedBreadCrumb("contact_details");
                  }}
                  storeAvailable={locationProvided}
                  localeData={localeData}
                />
                <MsiteStores>
                  {studioFlowInfo.stores.map((store, idx) => {
                    return (
                      store?.isAvailable && (
                        <StudioFlowComponent.RadioStore
                          key={store.code}
                          store={store}
                          selected={store.code === selectedStore?.code}
                          onClick={setSelectedStore}
                          localeData={localeData}
                          resetIsSelectedStore={() =>
                            dispatch(isStoreSelectedReducer(false))
                          }
                        />
                      )
                    );
                  })}
                </MsiteStores>
                <StudioFlowComponent.MsiteFloatingWindow
                  onClick={() => {
                    if (studioFlowInfo.selectedStore)
                      dispatch(isStoreSelectedReducer(true));
                    setSelectedBreadCrumb("contact_details");
                  }}
                  localeData={localeData}
                  disabled={!selectedStore}
                />
              </>
            )
        }
        {selectedBreadcrumb === "contact_details" && (
          <>
            <MsiteFormContainer>
              <StudioFlowComponent.MsiteUserDetailsForm
                submitCallback={(formData: FormData) => {
                  setContactDetails(formData);
                  if (cartData?.cartTotal && cartData?.cartTotal.length)
                    handleStudioFlowSubmit(formData);
                  else router.push(`/`);
                }}
                ref={userDetailsFormRef}
                initialFormState={{
                  firstName: userInfo.userDetails?.firstName ?? "",
                  lastName: userInfo.userDetails?.lastName ?? "",
                  email: userInfo.email ?? userInfo.guestEmail ?? "",
                  gender: userInfo.userDetails?.gender ?? "male",
                  phone: phoneNum ?? "",
                  phoneCode: pageInfo.countryCode,
                }}
                isRTL={pageInfo.isRTL}
                localeData={localeData}
                tNCLink="https://lenskart.com" // TODO: Replace it with relevant link to Contact Lens Terms and Conditions
                isCLProduct={false} // TODO: Replace this with whther a CL product is in cart or not
                genderConfig={configData?.GENDER_CONFIG}
              />
            </MsiteFormContainer>
            <StudioFlowComponent.MsiteFloatingWindow
              onClick={(e: any) => {
                userDetailsFormRef.current?.click();
                addShippingInfoGA4(cartData, userInfo?.isLogin, pageInfo);
              }}
              localeData={localeData}
              disabled={false}
              buttonText={localeData?.CONFIRM_DETAILS}
            />
          </>
        )}
      </MsitePageContainer>
    </>
  );

  return pageInfo?.deviceType === "desktop"
    ? desktopContainer
    : mobileContainer;
};

export default CheckoutStudioFlow;
