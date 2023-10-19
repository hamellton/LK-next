import { CONFIG, COOKIE_NAME, LOCALE } from "@/constants/index";
import { AppDispatch, RootState } from "@/redux/store";
import { APIMethods } from "@/types/apiTypes";
import { DeviceTypes } from "@/types/baseTypes";
import {
  fireBaseFunctions,
  headerFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { createAPIInstance } from "helpers/apiHelper";
import { headerArr } from "helpers/defaultHeaders";
import { GetServerSideProps } from "next";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NextHead from "next/head";
import MobileCartHeader from "containers/Cart/MobileCartHeader";
import { getOrderData, getV2OrderData } from "@/redux/slices/myorder";
import { fetchUserDetails } from "@/redux/slices/userInfo";
import {
  DesktopWrapper,
  MobileWrapper,
} from "../../../pageStyles/BookAppointmentStyles";
import { useRouter } from "next/router";
import {
  bookAppointment,
  bookSlot,
  getTimeSlots,
  resetBookingData,
  resetBookingError,
} from "@/redux/slices/studioflow";
import {
  Spinner,
  BookAppointmentDesktop,
  BookAppointmentMobile,
} from "@lk/ui-library";
import { resetPaymentState } from "@/redux/slices/paymentInfo";
import sessionStorageHelper from "helpers/sessionStorageHelper";

const BookAppointment = ({ data }: any) => {
  const { userData, headerData, configData, localeData } = data || {};
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  let queryParams = { ...router.query };
  const { orderId, store } = queryParams;
  const sessionId = (userData && userData?.customerInfo?.id) || "";

  //* reducer data
  const { deviceType } = useSelector((state: RootState) => state.pageInfo);
  let { loading, timeSlotData } = useSelector(
    (state: RootState) => state.studioFlowInfo.timeSlots
  );
  let { bookSlotLoading, bookSlotData } = useSelector(
    (state: RootState) => state.studioFlowInfo.bookSlotData
  );

  let { email, mobileNumber, userDetails, isLogin } = useSelector(
    (state: RootState) => state.userInfo
  );
  let { bookAppointmentData } = useSelector(
    (state: RootState) => state.studioFlowInfo.bookAppointment
  );
  let { countryCode } = useSelector((state: RootState) => state.pageInfo);
  let { orderData = {} } = useSelector((state: RootState) => state.myOrderInfo);
  const { firstName } = userDetails || {};
  const { storeData } = timeSlotData?.result?.result || {};
  const { error } = timeSlotData || {};
  const { altStoreNameCatch, addressFull } = storeData || {};
  const bookAppointmentResult =
    (bookAppointmentData && bookAppointmentData?.result) || {};

  //* component states
  const [isReschedule, setIsReschedule] = useState(false);
  const [refinedDateData, setRefinedDateData] = useState<{
    [key: string]: any[];
  }>();
  const [selectedDate, setSelectedDate] = useState<{
    date: string;
  } | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    startTime: string | number;
    endTime: string | number;
    slotId: string | number;
  } | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [bookedTime, setBookedTime] = useState<{
    day: string;
    date: number;
    month: string;
    year: number;
    time: string;
  }>({
    day: "",
    date: 0,
    month: "",
    year: 0,
    time: "",
  });
  const [bookingCaptureDate, setBookingCaptureDate] = useState<{
    day: string;
    date: number;
    month: string;
    year: number;
  }>({
    day: "",
    date: 0,
    month: "",
    year: 0,
  });
  const [bookingInfo, setBookingInfo] = useState<{
    date: string;
    bookingDate: string;
    time: string;
    createdAt: string;
  }>({
    date: "",
    bookingDate: "",
    time: "",
    createdAt: "",
  });

  //* locale and configs

  const { SAFE_SECURE, BOOK_APPOINTMENT } = localeData;

  const getDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getMonth = [
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

  //* useEffect's

  //* on mount, fetch time slots using session and store id
  //* reset booking data in redux on unmount
  useEffect(() => {
    setShowSuccessPage(false);
    if (store) {
      const reqObj: { sessionId: string; body: any } = {
        sessionId: sessionId,
        body: {
          startDate: new Date(new Date().setDate(new Date().getDate() + 2))
            .toISOString()
            .split("T")[0],
          endDate: new Date(new Date().setDate(new Date().getDate() + 14))
            .toISOString()
            .split("T")[0],
          duration: 30,
          classification: 1,
          skipCurrentData: 1,
          storeCode: store,
        },
      };
      dispatch(getTimeSlots(reqObj));
    }

    //* reset redux booking data on unmount
    return () => {
      dispatch(resetBookingData());
    };
  }, [dispatch, sessionId, store]);

  //* fetch user details on for session id - for email/phone details.
  useEffect(() => {
    if (sessionId) {
      dispatch(fetchUserDetails({ sessionId: sessionId }));
    }
  }, [dispatch, sessionId]);

  //* get order details from inventory order api for payment info - pending or done || booking order first time.
  useEffect(() => {
    dispatch(
      // getOrderData({
      //   sessionId: sessionId,
      //   orderID: orderId || 0,
      // })
      getV2OrderData({
        sessionId: sessionId,
        orderID:
          (orderId &&
            parseInt(Array.isArray(orderId) ? orderId[0] : orderId)) ||
          "",
        email:
          email ||
          sessionStorageHelper.getItem("checkoutUserEmail") ||
          undefined,
      })
    );
  }, [dispatch, orderId, sessionId]);

  //* set order info in local state when we have order info, - payment pending || first time booking appointment or not.
  useEffect(() => {
    if ("studioBookingDetails" in orderData) {
      setIsReschedule(true);
    } else {
      setIsReschedule(false);
    }

    if (orderData?.status?.trackingStatus === "PAYMENT_NOT_INITIATED") {
      setPaymentPending(true);
    } else {
      setPaymentPending(false);
    }
  }, [orderData]);

  //* once we have time slots, we parse it in custom usable format
  useEffect(() => {
    if (timeSlotData.result) {
      const refinedData = getRefinedData(timeSlotData?.result?.result?.data);
      setRefinedDateData(refinedData);
    }
  }, [timeSlotData]);

  //* set selected date, once we have custom formatted slots data
  useEffect(() => {
    const keys = Object.keys(refinedDateData || {});
    if (refinedDateData && keys.length > 0 && refinedDateData[keys[0]]?.[0]) {
      const timeSlot = refinedDateData[keys[0]][0];
      setSelectedDate(timeSlot);
    }
  }, [refinedDateData]);

  //* reset redux error state to default after 2 sec, so api error message dissapear after 2 sec
  useEffect(() => {
    if (bookSlotData?.error?.isError || bookAppointmentData?.error?.isError) {
      setTimeout(() => {
        dispatch(resetBookingError());
      }, 2000);
    }
  }, [bookSlotData, bookAppointmentData]);

  // * dispatch bookAppointment call after successfull slot validation call(on cta click)
  useEffect(() => {
    if (bookSlotData && bookSlotData?.result?.status === 200) {
      const selectedItem = orderData?.items?.find(
        (item: { appointmentDetails: any }) => item?.appointmentDetails
      );
      const reqObj: {
        sessionId: string;
        body: any;
        orderId: number | "" | undefined;
        reschedule?: boolean;
      } = {
        sessionId: sessionId,
        orderId:
          orderId && parseInt(Array.isArray(orderId) ? orderId[0] : orderId),
        reschedule: isReschedule,
        body: {
          ...(isReschedule && {
            appointmentId: selectedItem
              ? selectedItem?.appointmentDetails?.appointmentId
              : "",
          }),
          appointmentType: 2,
          countryCode: countryCode || "+65",
          customerEmail:
            sessionStorageHelper.getItem("checkoutUserEmail") || email,
          customerName:
            sessionStorageHelper.getItem("checkoutUserName") || firstName,
          customerNumber:
            sessionStorageHelper.getItem("checkoutUserPhone") || mobileNumber,
          date: selectedDate?.date,
          slotId: selectedTime?.slotId,
          source: "sg_web",
          storeCode: store,
        },
      };
      dispatch(bookAppointment(reqObj));
    }
  }, [bookSlotData]);

  // * on successfull book appointment / reschedule, set show success page as true
  useEffect(() => {
    if (bookAppointmentData && bookAppointmentData?.result) {
      if (bookAppointmentData?.result?.result?.status === 200) {
        setShowSuccessPage(true);
        setBookingInfo(bookAppointmentData?.result?.result?.data);
      }
    }
  }, [bookAppointmentData]);

  //* set booking date and booked time on success booking / reschedule for success screen
  useEffect(() => {
    if (bookingInfo?.bookingDate) {
      let d = new Date(bookingInfo?.bookingDate);
      let obj = {
        day: getDay[d.getDay()],
        month: getMonth[d.getMonth()],
        date: d.getDate(),
        year: d.getFullYear(),
        time: `${d.getHours()}:${d.getMinutes()}`,
      };
      setBookedTime(obj);
    }

    if (bookingInfo?.createdAt) {
      let d = new Date(bookingInfo?.createdAt);
      let obj = {
        day: getDay[d.getDay()],
        month: getMonth[d.getMonth()],
        date: d.getDate(),
        year: d.getFullYear(),
      };
      setBookingCaptureDate(obj);
    }
  }, [bookingInfo]);

  // ! ****** useEffects ends here *********

  //* custom handler methods

  //* hit book appointment / reschedule appointment (slot validation) api on CTA click
  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      const reqObj: {
        sessionId: string;
        body: any;
        orderId: number | "" | undefined;
      } = {
        sessionId: sessionId,
        orderId:
          orderId && parseInt(Array.isArray(orderId) ? orderId[0] : orderId),
        body: {
          date: selectedDate?.date,
          startTime: selectedTime?.startTime,
          endTime: selectedTime?.endTime,
          slotId: selectedTime?.slotId,
          storeAddress: addressFull,
          storeCode: store,
        },
      };
      dispatch(bookSlot(reqObj));
    }
  };

  // * if payment pending, redirect to payment url with hashed order id and email on "Pay Now" cta click
  const handlePayNow = () => {
    setCookie("orderId", orderData.id);
    dispatch(resetPaymentState());
    router.push(
      `/payment?oid=${window.btoa(orderData.id.toString()) || ""}&eid=${
        window.btoa(email) || ""
      }`
    );
  };

  const handleContinueShopping = () => {
    sessionStorageHelper.removeItem("checkoutUserPhone");
    sessionStorageHelper.removeItem("checkoutUserEmail");
    sessionStorageHelper.removeItem("checkoutUserName");
    router.push("/");
  };

  const handleSelectedTime = (val: any) => {
    setSelectedTime(val);
  };
  const handleSelectedDate = (val: any) => {
    setSelectedDate(val);
  };

  const groupBy = (data = [], key: string) => {
    return (
      data?.reduce(function (r, a) {
        r[a[key]] = r[a[key]] || [];
        r[a[key]].push(a);
        return r;
      }, Object.create(null)) || {}
    );
  };

  const getRefinedData = (inputArr: any) => {
    const arr = inputArr;
    const result: { [key: number]: any } = {};
    arr &&
      arr?.forEach((item: any) => {
        const temp = new Date(item.date);
        const slots = { ...item };
        slots.timeSlot = groupBy(slots?.timeSlot || [], "slotGroup");
        if (temp.getMonth() in result) {
          result[temp.getMonth()] = [...result[temp.getMonth()], slots];
        } else {
          result[temp.getMonth()] = [slots];
        }
      });
    return result;
  };

  // * render JSX on mobile & desktop respectively

  const mobileView = (
    <>
      <NextHead>
        <title>{BOOK_APPOINTMENT?.toLowerCase() || "Book Appointment"}</title>
      </NextHead>
      <MobileWrapper>
        <MobileCartHeader
          isRTL={false}
          logo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
          showBackBtn={false}
          onClickBack={() => null}
          dontShowlogo={false}
          isClickable={true}
          configData={configData}
          hasOnlyCLProduct={false}
          pageNumber={1}
          noNumber={true}
          isHelper={true}
          localeData={localeData}
        />
        <BookAppointmentMobile
          sessionId={sessionId}
          configData={configData}
          localeData={localeData}
          showSuccessPage={showSuccessPage}
          bookingCaptureDate={bookingCaptureDate}
          bookedTime={bookedTime}
          bookingInfo={bookingInfo}
          altStoreNameCatch={altStoreNameCatch}
          addressFull={addressFull}
          paymentPending={paymentPending}
          handlePayNow={handlePayNow}
          handleContinueShopping={handleContinueShopping}
          isReschedule={isReschedule}
          error={error}
          refinedDateData={refinedDateData}
          getMonth={getMonth}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          bookSlotLoading={bookSlotLoading}
          handleBookAppointment={handleBookAppointment}
          bookAppointmentData={bookAppointmentData}
          bookSlotData={bookSlotData}
          handleSelectedTime={handleSelectedTime}
          handleSelectedDate={handleSelectedDate}
        />
      </MobileWrapper>
    </>
  );

  const desktopView = (
    <>
      <NextHead>
        <title>{BOOK_APPOINTMENT?.toLowerCase() || "Book Appointment"}</title>
      </NextHead>
      <DesktopWrapper className="booAptWrapper">
        <CartHeader
          appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
          safeText={SAFE_SECURE}
        />
      </DesktopWrapper>
      <BookAppointmentDesktop
        sessionId={sessionId}
        configData={configData}
        localeData={localeData}
        showSuccessPage={showSuccessPage}
        bookingCaptureDate={bookingCaptureDate}
        bookedTime={bookedTime}
        bookingInfo={bookingInfo}
        altStoreNameCatch={altStoreNameCatch}
        addressFull={addressFull}
        paymentPending={paymentPending}
        handlePayNow={handlePayNow}
        handleContinueShopping={handleContinueShopping}
        isReschedule={isReschedule}
        error={error}
        refinedDateData={refinedDateData}
        getMonth={getMonth}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        bookSlotLoading={bookSlotLoading}
        handleBookAppointment={handleBookAppointment}
        bookAppointmentData={bookAppointmentData}
        bookSlotData={bookSlotData}
        handleSelectedTime={handleSelectedTime}
        handleSelectedDate={handleSelectedDate}
      />
    </>
  );

  if (loading) {
    return (
      <div>
        <Spinner show fullPage />
      </div>
    );
  }

  // * returning JSX based on device type.
  return deviceType === DeviceTypes.MOBILE ? mobileView : desktopView;
};

export default BookAppointment;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;
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
    api.setHeaders(headerArr);
  } else {
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(`clientV1_${country}`, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }

  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);
  const configApi = createAPIInstance({
    url: process.env.NEXT_PUBLIC_CONFIG_URL,
  });
  const { data: localeData, error: configError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: redisConfigError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi);
  // console.log(localeData, userData, configData, headerData);
  // console.log(
  //   configError,
  //   redisConfigError,
  //   headerDataError,
  //   "-----------------=====>"
  // );
  if (
    configError.isError ||
    redisConfigError.isError ||
    headerDataError.isError
  ) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });
  return {
    props: {
      data: {
        userData,
        localeData,
        configData,
        headerData,
      },
      error: userError,
    },
  };
};
