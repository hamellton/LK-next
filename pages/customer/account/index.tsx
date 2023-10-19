import { useEffect, useState } from "react";
import BaseSidebar from "../../../containers/MyAccount/baseSideBar";
import { MyOrder } from "@lk/ui-library";
import { GetServerSideProps } from "next";
import { APIService } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import {
  deleteCookie,
  getCookie,
  hasCookie,
  setCookie,
} from "@/helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import {
  fireBaseFunctions,
  headerFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { CONFIG, COOKIE_NAME,LAST_PAGE_VISIT_NAME, LOCALE } from "../../../constants";
import { MyOrderWrapper } from "../../../pageStyles/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getWhatsappOptingStatus,
  whatsAppUpdate,
} from "@/redux/slices/userInfo";
import { fetchOrderListingData, putConfirmOrder } from "@/redux/slices/myorder";
import {
  formatDate,
  getPendingStatus,
  onNeedHelpClickHandler,
  filterTrackingStatus,
} from "@/components/Orders/helper";
import { getOrderItemsReturnEligibility } from "@/redux/slices/orderInfo";
import { getPowerManual } from "@/redux/slices/userPowerInfo";
import EnterManualPrescription from "@/components/PrescriptionModal/EnterManualPrescription";
import SavedPrescriptionModal from "@/components/PrescriptionModal/SavedPrescriptionModal";
import UploadImagePrescriptionModal from "@/components/PrescriptionModal/UploadImagePrescriptionModal";
import PrescriptionCallModal from "@/components/PrescriptionModal/PrescriptionCallModal";
import PrescriptionEmailModal from "@/components/PrescriptionModal/PrescriptionEmailModal";
import ImagePrescriptionModal from "@/components/PrescriptionModal/ImagePrecriptionModal";
import { useRouter } from "next/router";
import useCustomerState from "hooks/useCustomerState";
import {
  ConfigDataType,
  DataType,
  LocaleDataType,
} from "../../../types/coreTypes";
import { HeaderType } from "../../../types/state/headerDataType";
import {
  resetPrescriptionData,
  resetUpdatePrescriptionDataAdded,
  setPrescriptionPageStatus,
  updatePrescriptionPage,
  updatePrevPrescriptionPage,
} from "@/redux/slices/prescription";
import Slider, { Backdrop } from "@/components/PrescriptionModalV2/Slider";
import { Pages } from "@/components/PrescriptionModalV2/helper";
import {
  userProperties,
  ctaClickProperties,
  addPowerCtaClick,
  addPowerCtaGA,
} from "helpers/userproperties";
import { removeDomainName } from "helpers/utils";
import { resetPaymentState } from "@/redux/slices/paymentInfo";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { logoutSprinklrBot } from "helpers/chatbot";
import { DeviceTypes } from "@/types/baseTypes";

interface OrderType {
  localeData: LocaleDataType;
  userData: DataType;
  configData: ConfigDataType;
  headerData: HeaderType;
}

const Order = ({ userData, localeData, configData, headerData }: OrderType) => {
  const orderStatusRedis = configData.ORDER_STATUS
    ? JSON.parse(configData.ORDER_STATUS)
    : null;
  const sprinkularBotConfig =
    configData?.SPRINKLR_BOT_CONFIG &&
    JSON.parse(configData.SPRINKLR_BOT_CONFIG);
  const dispatch = useDispatch<AppDispatch>();
  const { whatsAppOptingStatus } = useSelector(
    (state: RootState) => state.userInfo
  );
  const { returnEligibilityDetailsArr: returnEligibilityDetailsArr } =
    useSelector((state: RootState) => state.orderInfo);
  const { powertypeList, prescriptionSavedManual } = useSelector(
    (state: RootState) => state.userPowerInfo
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const { prescriptionPageStatus, updatePrescriptionDataAdded } = useSelector(
    (state: RootState) => state.prescriptionInfo
  );
  const subdirectoryPath = useSelector(
    (state: RootState) => state.pageInfo.subdirectoryPath
  );
  const [whtasappStatus, setWhatsappStatus] = useState(whatsAppOptingStatus);
  const [submitPrescriptionWay, setSubmitPrescriptionWay] = useState({
    manual: false,
    saved: false,
    upload: false,
    callback: false,
    sendviaEmail: false,
  });
  const router = useRouter();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [imageFileName, setImageFileName] = useState("");
  const [item, setItem] = useState<any>({});
  const [selectedOrder, setSelectedOrder] = useState<any>({});
  const [openManualPrescriptionModal, setOpenPrescriptionModal] =
    useState(false);
  const { orderListingData, totalOrderCount, confirmOrderSuccess, isLoading } =
    useSelector((state: RootState) => state.myOrderInfo);
  const [mappedOrderListingData, setmappedOrderListingData] = useState([]);
  const { storeSlots, prevPrescriptionPage, prescriptionPage } = useSelector(
    (state: RootState) => state.prescriptionInfo
  );
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  //const pageNumber = window.localStorage?.getItem("orderActivePage") ? Number(window.sessionStorage.getItem("orderActivePage")) : 0;
  useEffect(() => {
    dispatch(getWhatsappOptingStatus({ sessionId: userData.id }));
    dispatch(
      fetchOrderListingData({
        sessionId: userData.id,
        page: 0,
        itemsPerPage: 5,
      })
    );
  }, []);

  useEffect(() => {
    if (confirmOrderSuccess || prescriptionSavedManual) {
      dispatch(
        fetchOrderListingData({
          sessionId: userData.id,
          page: 0,
          itemsPerPage: 10,
        })
      );
    }
    if (whatsAppOptingStatus === "OPT_OUT") {
      setWhatsappStatus(false);
    } else if (whatsAppOptingStatus === "OPT_IN") {
      setWhatsappStatus(true);
    }
  }, [confirmOrderSuccess, whatsAppOptingStatus, prescriptionSavedManual]);
  useEffect(() => {
    dispatch(
      getOrderItemsReturnEligibility({
        sessionId: userData.id,
        orderList: orderListingData,
        ELIGIBILITY_STATUS_HISTORY: JSON.parse(
          configData.ELIGIBILITY_STATUS_HISTORY || ""
        ),
      })
    );
    if (Array.isArray(orderListingData) && orderListingData?.length) {
      const temp = orderListingData?.map((order: { items: any[] }) => {
        return {
          ...order,
          items: order.items.map((item) => {
            return {
              ...item,
              productUrl:
                pageInfo.subdirectoryPath + removeDomainName(item.productUrl),
            };
          }),
        };
      });
      setmappedOrderListingData(temp);
    }
  }, [orderListingData]);

  const onClickWhatsappToggle = () => {
    dispatch(
      whatsAppUpdate({ optingValue: !whtasappStatus, sessionId: userData.id })
    );
  };
  const handleClickOnPagination = (params: any) => {
    dispatch(
      fetchOrderListingData({
        sessionId: userData.id,
        page: params,
        itemsPerPage: 5,
      })
    );
    //window.localStorage?.setItem("orderActivePage", params);
  };
  const logOutHandlerFunc = () => {
    sessionStorageHelper.removeItem("isContactLensCheckboxChecked");
    deleteCookie(`clientV1_${pageInfo.country}`);
    setCookie("isLogined", 0);
    setCookie("log_in_status", false);
    window.location.href =
      !pageInfo.subdirectoryPath || pageInfo.subdirectoryPath === "NA"
        ? "/"
        : pageInfo.subdirectoryPath;
    // window.location.href = subdirectoryPath;

    //* logout sprinklr
    logoutSprinklrBot();
  };
  const confirmOrder = (params: any) => {
    dispatch(putConfirmOrder({ sessionId: userData.id, id: params }));
  };
  const onNeedHelp = (params: any) => {
    if (sprinkularBotConfig?.desktop_enabled === "ON") {
      onNeedHelpClickHandler(params.id);
    } else {
      const redirectUrl = configData?.NEED_HELP_REDIRECT_URL || "/cms-queries";
      // router.push(redirectUrl);
      window.location.href = `${subdirectoryPath}${redirectUrl}`;
    }
  };

  useEffect(() => {
    setWhatsappStatus(whatsAppOptingStatus);
  }, [whatsAppOptingStatus]);

  let pageName = "order-listing-page";
  useEffect(()=>{
    localStorage.setItem(LAST_PAGE_VISIT_NAME,pageName)
    },[])
  useEffect(() => {
    if (!userInfo.userLoading) {
      userProperties(userInfo, pageName, pageInfo, localeData);
    }
  }, [userInfo.userLoading]);
  const handlePayNow = (params: any) => {
    setCookie("orderId", params.id);
    dispatch(resetPaymentState());
    let cta_name = "order-listing-paynow";
    let cta_flow_and_page = "order-detail-page";
    ctaClickProperties(cta_name, cta_flow_and_page, userInfo.userDetails);
    router.push(
      `/payment?oid=${window.btoa(params.id.toString()) || ""}&eid=${
        window.btoa(params.customerEmail) || ""
      }`
    );
  };
  const handleManuallprescription = (
    productID: string | number,
    powerType: string,
    item: any,
    order: any
  ) => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, manual: true });
    dispatch(
      getPowerManual({
        sessionId: userData.id,
        productID: productID,
        powerType: powerType,
      })
    );
    setOpenPrescriptionModal(true);
    setItem(item);
    setSelectedOrder(order);
  };
  const handleSavedprescription = (item: any, order: any) => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, saved: true });
    setItem(item);
    setSelectedOrder(order);
  };
  const handleUploadprescription = (item: any, order: any) => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, upload: true });
    setItem(item);
    setSelectedOrder(order);
  };
  const handleCallBack = (item: any, order: any) => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, callback: true });
    setItem(item);
    setSelectedOrder(order);
  };
  const handleSendEmail = (item: any, order: any) => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, sendviaEmail: true });
    setItem(item);
    setSelectedOrder(order);
  };
  const closeManualPrescriptionModal = () => {
    setOpenPrescriptionModal(false);
  };
  const closeSavedPrecriptionModal = () => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, saved: false });
  };
  const closeUploadImagePrescriptionModal = () => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, upload: false });
  };
  const closePrescriptionCallModal = () => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, callback: false });
  };
  const closePrescriptionEmailModal = () => {
    setSubmitPrescriptionWay({ ...submitPrescriptionWay, sendviaEmail: false });
  };
  const handleOpenPrescriptionImageModal = (imageFileName: string) => {
    setImageFileName(imageFileName);
    setOpenImageModal(true);
  };
  const closeImagePrescriptionModal = () => {
    setOpenImageModal(false);
  };
  const onOrderDetailClick = (order: any) => {
    router.push({
      pathname: "/customer/account/order-detail/[...orderId]",
      query: { orderId: order.id },
    });
  };
  useCustomerState({
    useMounted: false,
    userData: userData,
  });
  const [orderId, setOrderId] = useState(0);
  const [items, setItems] = useState(null);

  const addPowerClick = (props: any) => {
    setOrderId(props.order.id);
    setItems(props.item);
    dispatch(setPrescriptionPageStatus(true));
  };

  const addPdClick = (props: any) => {
    setOrderId(props.order.id);
    setItems(props.item);
    dispatch(updatePrescriptionPage(Pages.ENTER_PD));
    dispatch(updatePrevPrescriptionPage(Pages.ENTER_PD));
    dispatch(setPrescriptionPageStatus(true));
  };

  //   const [showSlider, setShowSlider] = useState(false);

  const closeSlider = (close: boolean) => {
    if (close) {
      dispatch(resetPrescriptionData());
      dispatch(setPrescriptionPageStatus(false));
    } else {
      if (!prevPrescriptionPage) {
        dispatch(resetPrescriptionData());
        dispatch(setPrescriptionPageStatus(false));
      } else {
        dispatch(updatePrescriptionPage(prevPrescriptionPage));
        dispatch(updatePrevPrescriptionPage(""));
      }
    }
  };

  useEffect(() => {
    if (updatePrescriptionDataAdded) {
      setTimeout(() => {
        handleClickOnPagination(activePage);
        dispatch(resetUpdatePrescriptionDataAdded());
      }, 300);
    }
  }, [updatePrescriptionDataAdded]);

  const handleStudioFlowAppointmentClick = (
    booked: boolean,
    storeCode: string,
    orderId: string | number
  ) => {
    router.push(
      `/studio/bookappointment?orderId=${orderId}&store=${storeCode}`
    );
  };

  return (
    <BaseSidebar
      localeData={localeData}
      userData={userData}
      headerData={headerData}
      configData={configData}
    >
      <>
        {prescriptionPageStatus && <Backdrop show />}
        <Slider
          show={prescriptionPageStatus}
          closeSlider={closeSlider}
          orderId={orderId}
          item={items}
          localeData={localeData}
          configData={configData}
        />
        <MyOrderWrapper>
          {mappedOrderListingData && localeData && (
            <MyOrder
              handleStudioFlowAppointmentClick={
                handleStudioFlowAppointmentClick
              }
              onClickReturnExchange={() => null}
              onAddPowerClick={(data: any) => addPowerClick(data)}
              onPdClick={(data: any) => addPdClick(data)}
              editPowerHandler={(data: any) => console.log(data)}
              dataLocale={localeData}
              redisCommonData={configData}
              configData={configData}
              totalOrderCount={totalOrderCount}
              itemsPerPage={5}
              // pageNumber={0}
              onClickWhatsappToggle={onClickWhatsappToggle}
              whatsAppActive={whtasappStatus}
              clickOnPage={handleClickOnPagination}
              logOutHandler={logOutHandlerFunc}
              orderList={[...mappedOrderListingData]}
              formatDate={formatDate}
              orderStatusRedis={orderStatusRedis}
              getPendingStatus={getPendingStatus}
              filterTrackingStatus={filterTrackingStatus}
              setActivePage={setActivePage}
              activePage={activePage}
              confirmOrder={confirmOrder}
              showingLoader={isLoading}
              onNeedHelp={onNeedHelp}
              handlePayNow={handlePayNow}
              returnEligibilityDetailsArr={
                returnEligibilityDetailsArr?.returnDetails
              }
              returnReason={returnEligibilityDetailsArr?.returnReason}
              handleManuallprescription={handleManuallprescription}
              handleSavedprescription={handleSavedprescription}
              handleUploadprescription={handleUploadprescription}
              handleCallBack={handleCallBack}
              handleSendEmail={handleSendEmail}
              handleOpenPrescriptionImageModal={
                handleOpenPrescriptionImageModal
              }
              onOrderDetailClick={onOrderDetailClick}
              country={pageInfo.country}
              removeDomainName={removeDomainName}
              subdirectoryPath={pageInfo.subdirectoryPath}
              addGAEvent={addPowerCtaClick}
              addPowerCtaGA={addPowerCtaGA}
              mobileView={deviceType === DeviceTypes.MOBILE}
            />
          )}
          {item &&
            Object.keys(item).length > 0 &&
            powertypeList?.powerTypeList?.length > 0 && (
              <EnterManualPrescription
                selectedOrder={selectedOrder}
                userData={userData}
                localeData={localeData}
                closeManualPrescriptionModal={closeManualPrescriptionModal}
                openManualPrescriptionModal={openManualPrescriptionModal}
                powertypeList={powertypeList}
                item={item}
              />
            )}
          {item && Object.keys(item).length > 0 && (
            <SavedPrescriptionModal
              selectedOrder={selectedOrder}
              userData={userData}
              localeData={localeData}
              closeSavedPrecriptionModal={closeSavedPrecriptionModal}
              openSavedPrecriptionModal={submitPrescriptionWay.saved}
              item={item}
            />
          )}
          {item && Object.keys(item).length > 0 && (
            <UploadImagePrescriptionModal
              openUploadImagePrecriptionModal={submitPrescriptionWay.upload}
              closeUploadImagePrescriptionModal={
                closeUploadImagePrescriptionModal
              }
              selectedOrder={selectedOrder}
              userData={userData}
              localeData={localeData}
              item={item}
            />
          )}
          {item && Object.keys(item).length > 0 && (
            <PrescriptionCallModal
              openPrecriptionCallModal={submitPrescriptionWay.callback}
              closePrescriptionCallModal={closePrescriptionCallModal}
              selectedOrder={selectedOrder}
              userData={userData}
              localeData={localeData}
              item={item}
            />
          )}
          {item && Object.keys(item).length > 0 && (
            <PrescriptionEmailModal
              openPrecriptionEmailModal={submitPrescriptionWay.sendviaEmail}
              closePrescriptionEamilModal={closePrescriptionEmailModal}
              selectedOrder={selectedOrder}
              userData={userData}
              localeData={localeData}
              item={item}
            />
          )}
          {
            <ImagePrescriptionModal
              imageFileName={imageFileName}
              userData={userData}
              openImageModal={openImageModal}
              closeImagePrescriptionModal={closeImagePrescriptionModal}
            />
          }
        </MyOrderWrapper>
      </>
    </BaseSidebar>
  );
};

export default Order;

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
  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`)
    .setHeaders(headerArr)
    .setMethod(APIMethods.GET);
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi, deviceType);
  const { data: localeData, error: loacleError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);
  const { data: configData, error: configError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  if (
    loacleError.isError ||
    userError.isError ||
    configError.isError ||
    headerDataError.isError
  ) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });

  return {
    props: {
      localeData: { ...localeData },
      userData: userData?.customerInfo || null,
      configData: { ...configData },
      headerData: headerData,
    },
  };
};
