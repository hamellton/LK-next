import { CONFIG, COOKIE_NAME, LOCALE } from "../../../constants";
import { APIMethods } from "@/types/apiTypes";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { GetServerSideProps } from "next";
import {
  checkoutFunctions,
  fireBaseFunctions,
  headerFunctions,
  paymentFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { APIService, RequestBody } from "@lk/utils";
import BaseSidebar from "../../../containers/MyAccount/baseSideBar";
import { useRef, useState } from "react";
import {
  AddAddressHeader,
  AddressbookWrapper,
  AddressButtonWrapper,
  AlertMessage,
  ButtonText,
} from "../../../pageStyles/styles";
import {
  Checkout as CheckoutComponent,
  HeadingBackPress,
  ToastMessage,
} from "@lk/ui-library";
import { TypographyENUM } from "@/types/baseTypes";
import {
  AddressObjectBodyType,
  AddressObjectType,
} from "pageStyles/Checkout.types";
import { useDispatch, useSelector } from "react-redux";
import useCustomerState from "hooks/useCustomerState";
import { DataType, LocaleDataType } from "@/types/coreTypes";
import { HeaderType } from "@/types/state/headerDataType";
import { RootState } from "@/redux/store";
import { temporaryStoreAddressData } from "helpers/addressHelper";
import NewAddressField from "containers/Checkout/ApplyCoupon";

export interface AddessBookType {
  localeData: LocaleDataType;
  userData: DataType;
  addressData: any;
  countryStateData: any;
  headerData: HeaderType;
  configData: DataType;
  sessionId: string;
}
enum SubmitType {
  add = "ADD",
  edit = "EDIT",
  read = "READ",
}

const AddressBook = ({
  sessionId,
  headerData,
  localeData,
  userData,
  addressData,
  countryStateData,
  configData,
}: AddessBookType) => {
  const getDeliveryStatus = async (pin: string) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = userData.id;
    api.setHeaders(headerArr);
    try {
      const { data: deliveryStatusData, error } =
        await checkoutFunctions.fetchDeliveryStatus(pin, api);
      return error.isError ? error : deliveryStatusData;
    } catch (err) {
      console.log(err);
    }
  };

  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  const { countryCode, isRTL } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [allAddressData, setAllAddressData] = useState(addressData);
  const [currentEditAddress, setCurrentEditAddress] = useState<DataType | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [addAddressSuccess, setAddAddressSuccess] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [addressIndex, setAddressIndex] = useState(0);
  const dispatch = useDispatch();
  const submitRef = useRef<HTMLFormElement>(null);
  const toggleAddressForm = () => {
    setShowAddAddressForm((showAddAddressForm) => !showAddAddressForm);
  };
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const deleteAddressHandler = async (id: number) => {
    // console.log("deleting..", id);
    setAddAddressSuccess(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setMethod(
      APIMethods.DELETE
    );
    api.sessionToken = userData.id;
    api.setHeaders(headerArr);
    const { data: delAddressData, error } =
      await checkoutFunctions.deleteAddress(id, api);
    if (error.isError) {
      alert("Failed to delete!");
      console.log(error);
    } else {
      api.setMethod(APIMethods.GET);
      const { data: addressData, error } = await checkoutFunctions.fetchAddress(
        api
      );
      if (!error.isError) setAllAddressData(addressData);
      // console.log(addressData);
    }
  };

  const editAddressHandler = (id: number) => {
    setEditAddress(true);
    // console.log("editing..", id);
    setCurrentEditAddress(
      allAddressData.find((add: any) => add.id === id) || null
    );
    toggleAddressForm();
  };
  const onADDNewAddress = () => {
    setCurrentEditAddress(null);
    toggleAddressForm();
    setEditAddress(false);
  };

  const postShippingAddress = async (
    type: SubmitType,
    id: number | null,
    data: AddressObjectType
  ) => {
    if (type === SubmitType.add && data) {
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setMethod(APIMethods.POST);
      api.sessionToken = userData.id;
      api.setHeaders(headerArr);
      const body = new RequestBody<AddressObjectType | null>(data);
      const { data: addAddressData, error: addAddrErr } =
        await checkoutFunctions.addAddress(api, body);
      if (addAddrErr.isError) {
        // console.log(addAddrErr);
        alert(`Error: ${addAddrErr.message}`);
      } else {
        api.setMethod(APIMethods.GET);
        const { data: addressData, error } =
          await checkoutFunctions.fetchAddress(api);
        if (!error.isError) setAllAddressData(addressData);
        toggleAddressForm();
        setAddAddressSuccess(true);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } else if (type === SubmitType.edit && id) {
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setMethod(APIMethods.PUT);
      api.sessionToken = userData.id;
      api.setHeaders(headerArr);
      const addressNew = allAddressData.find((ad: any) => ad.id === id) || null;
      const newAddressData = addressNew
        ? Object.assign(addressNew, data)
        : null; //gender
      if (newAddressData?.updated) delete newAddressData.updated;
      if (newAddressData?.created) delete newAddressData.created;
      const body = new RequestBody<AddressObjectBodyType | null>(
        newAddressData || null
      );
      const { data: editAddressData, error: editAddrErr } =
        await checkoutFunctions.editAddress(id, api, body);
      if (editAddrErr.isError) {
        // console.log(editAddrErr);
        alert(`Error: ${editAddrErr.message}`);
      } else {
        api.setMethod(APIMethods.GET);
        const { data: addressData, error } =
          await checkoutFunctions.fetchAddress(api);
        if (!error.isError) setAllAddressData(addressData);
        toggleAddressForm();
        setAddAddressSuccess(true);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    }
  };
  useCustomerState({
    useMounted: false,
    userData: userData,
  });
  const handleOnCancel = () => {
    toggleAddressForm();
  };
  return (
    <BaseSidebar
      localeData={localeData}
      userData={userData}
      headerData={headerData}
      configData={configData}
    >
      <AddressbookWrapper>
        {!showAddAddressForm && (
          <AddressButtonWrapper>
            <NewAddressField
              onClick={onADDNewAddress}
              isApplied={false}
              isMobileView={false}
              isRTL={pageInfo.isRTL}
            >
              {localeData.ADD_NEW_ADDRESS}
            </NewAddressField>
          </AddressButtonWrapper>
        )}
        <ToastMessage
          message={
            addAddressSuccess
              ? localeData.YOUR_CHANGES_HAS_BEEN_SAVED_SUCCESSFULLY
              : localeData.ADDRESS_HAS_BEEN_DELETED_SUCCESSFULLY
          }
          color={addAddressSuccess ? "green" : "orange"}
          duration={2000}
          show={showToast}
          hideFn={() => {
            setShowToast(false);
          }}
          showIcon={false}
          position="static"
        />
        <AddAddressHeader>
          {showAddAddressForm && !editAddress && (
            <>
              <HeadingBackPress
                arrowAction={
                  allAddressData.length > 0
                    ? () => setShowAddAddressForm(false)
                    : undefined
                }
                signInText={localeData?.ADD_NEW_ADDRESS}
                isRTL={pageInfo.isRTL}
              />
              {pageInfo.language !== "en" ? (
                <div style={{ padding: "0 20px 0 0" }}>
                  <AlertMessage>
                    {localeData.CURRENTLY_ACCEPTING_ENTRIES_ENGLISH_ONLY}
                  </AlertMessage>
                </div>
              ) : null}
            </>
          )}

          {showAddAddressForm && editAddress && (
            <>
              <HeadingBackPress
                arrowAction={
                  allAddressData.length > 0
                    ? () => setShowAddAddressForm(false)
                    : undefined
                }
                signInText={localeData?.EDIT_ADDRESS}
                isRTL={pageInfo.isRTL}
              />
              {pageInfo.language !== "en" ? (
                <div style={{ padding: "0 20px 0 0" }}>
                  <AlertMessage>
                    {localeData.CURRENTLY_ACCEPTING_ENTRIES_ENGLISH_ONLY}
                  </AlertMessage>
                </div>
              ) : null}
            </>
          )}
        </AddAddressHeader>
        {showAddAddressForm && (
          <CheckoutComponent.AddAddressForm
            dataLocale={localeData}
            configData={configData}
            userEmail={userInfo.guestEmail || userInfo.email}
            userNumber={userInfo.guestNumber || userInfo.mobileNumber}
            isRTL={pageInfo.isRTL}
            font={TypographyENUM.defaultBook}
            id="review-form"
            initialAddressData={currentEditAddress}
            onSubmit={(
              type: SubmitType,
              id: number | null,
              data: AddressObjectType
            ) => postShippingAddress(type, id, data)}
            submitRef={submitRef}
            onCancel={handleOnCancel}
            addAddressBtn={true}
            btnVisible={true}
            currCountry={pageInfo.country}
            phoneCode={countryCode}
            getPincodeData={getDeliveryStatus}
            onPincodeChanged={(pincode: any) => getDeliveryStatus(pincode)}
            updateTempAddressData={(data: DataType) =>
              temporaryStoreAddressData.add(data, sessionId, pageInfo.country)
            }
            stateList={{
              options: countryStateData.states,
              optionsText: "",
              optionValue: "",
            }}
            countryList={{
              options: countryStateData.country,
              optionsText: "country_name",
              optionValue: "country_code",
            }}
            phoneCodeConfigData={
              configData?.SUPPORT_MULTIPLE_COUNTRIES &&
              configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
              JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
            }
            incCountryCodeFont
            deviceType={deviceType}
          />
        )}
        {!showAddAddressForm &&
          allAddressData.length > 0 &&
          allAddressData.map((item: any, index: number) => {
            return (
              <CheckoutComponent.AddressTab
                dataLocale={localeData}
                isRTL={pageInfo.isRTL}
                width="100"
                {...item}
                landmark={item?.landmark || ""}
                submitRef={submitRef}
                selectedAddressIndex={{ id: addressIndex }}
                btnVisible={true}
                key={index}
                checked={addressIndex === item.id}
                onChange={(id: number) => setAddressIndex(id)}
                font={TypographyENUM.lkSansBold}
                deliveryEstimate=""
                onEdit={(id: number) => editAddressHandler(id)}
                onDelete={(id: number) => deleteAddressHandler(id)}
                onSubmit={(type: SubmitType, id: number | null, data: any) =>
                  postShippingAddress(type, id, data)
                }
              />
            );
          })}
      </AddressbookWrapper>
    </BaseSidebar>
  );
};

export default AddressBook;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
    headerArr
  );
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });
  if (!isSessionAvailable) {
    api.setMethod(APIMethods.POST);
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      api
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(`clientV1_${country}`, sessionId.sessionId, { req, res });
    api.resetHeaders();
    api.sessionToken = sessionId.sessionId;
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  } else {
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(`clientV1_${country}`, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }
  const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`)
    .setHeaders(headerArr)
    .setMethod(APIMethods.GET);
  const { data: countryStateData } = await checkoutFunctions.fetchCountryState(
    api
  );
  const { data: addressData } = await checkoutFunctions.fetchAddress(api);
  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi, deviceType);
  const { data: localeData, error: loacleError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: configError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);
  if (loacleError.isError || userError.isError || headerDataError.isError) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });


  return {
    props: {
      localeData: { ...localeData },
      userData: userData.customerInfo,
      headerData: headerData,
      addressData: addressData,
      countryStateData: countryStateData,
      configData: configData,
      sessionId: `${getCookie(`clientV1_${country}`, { req, res })}`,
    },
  };
};
