import { getOrderData } from "@/redux/slices/myorder";
import { getNearByStore } from "@/redux/slices/orderInfo";
import {
  bookSlots,
  getStoreSlotes,
  setStoreLocatorPage,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes, ThemeENUM } from "@/types/baseTypes";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { Button, Modal, Spinner, Icons } from "@lk/ui-library";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BottomSheet from "./BottomSheet";
import GoogleAutoComplete from "./GoogleAutoComplete";
import { getTime, openMaps, tConv24 } from "./helper";
import { Body, RootHeader } from "./SubmitPrescriptionRoot";

const Title = styled.div<{ error: boolean }>`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 16px;
  margin-top: 12px;
  font-family: ${TypographyENUM.lkSansRegular};
  ${(props) => props.error && "color: #E34934"};
`;

const SearchContainer = styled.div`
  position: relative;
`;

const GoogleInputWrapper = styled.div`
  border: 1px solid #cecedf;
  border-radius: 12px;
  height: 56px;
  padding: 6px 8px;
  display: flex;
  background-color: #ffffff;
`;

const Contain = styled.div`
  padding-bottom: 0;
`;

const Input = styled.input`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  user-select: initial;
  &::before,
  &::after {
    user-select: initial;
  }
`;

const LocationButton = styled.button`
  width: 100%;
  border: 1px solid #a2a2b8;
  border-radius: 100px;
  background: #ffffff;
  line-height: 24px;
  padding: 12px 20px;
  margin-top: 16px;
  color: #000042;
`;

export const Img = styled.img<{ margin?: boolean }>`
  ${(props) => props.margin && "margin-right: 5px"};
  max-width: 100%;
  height: auto;
  vertical-align: middle;
`;

const ButtonSpan = styled.span`
  font-size: 16px;
  padding-left: 12px;
`;

const SearchResult = styled.div`
  padding-bottom: 110px;
  margin-top: 16px;
`;

const CardOuter = styled.div<{ isSelected: boolean }>`
  ${(props) => props.isSelected && "border: 1px solid #737397"};
  box-shadow: 0px 0px 12px rgb(0 0 66 / 6%);
  border-radius: 12px;
  padding: 10px;
  background-color: ${(props) => (props.isSelected ? "#f5f5f5" : "#fff")};
  margin: 8px 0px;
`;

const InputCard = styled.input`
  &[type="radio"] {
    display: none;
  }
  &[type="radio"]:checked + label:after {
    transform: scale(1);
  }
  user-select: initial;
  &::before,
  &::after {
    user-select: initial;
  }
`;

const Label = styled.label`
  height: auto;
  padding: 0 22px;
  margin-bottom: 0;
  cursor: pointer;
  vertical-align: bottom;
  font-size: 12px;

  &::before {
    left: unset;
    right: 0px;
    top: 3px;
    width: 12px;
    height: 12px;
    border: 1px solid #ccc;
    box-sizing: content-box;
    position: absolute;
    content: "";
    border-radius: 50%;
  }

  &::after {
    background: #000042;
    transform: scale(0);
    left: unset;
    right: 2px;
    top: 5px;
    width: 10px;
    height: 10px;
    position: absolute;
    content: "";
    border-radius: 50%;
    transition: all 0.3s ease;
  }
`;

const CardInfo = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-size: 12px;
  color: #000042;
`;

const CardTitle = styled.div`
  line-height: 20px;
  font-size: 12px;
  color: #000042;
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 700;
`;

const CardDistance = styled.div`
  text-transform: lowercase;
  margin-top: 4px;
  margin-bottom: 10px;
  color: #333368;
`;

const Capitalize = styled.span`
  text-transform: capitalize;
`;

const CallContainer = styled.div`
  font-weight: 700;
`;

const A = styled.a`
  font-family: ${TypographyENUM.lkSansRegular};
  line-height: 20px;
  text-decoration: underline;
  color: #000042;
  outline: none;
`;

const ViewMap = styled.span`
  text-decoration: underline;
  text-align: center;
  margin-left: 8px;
  color: #000042;
`;

const Container = styled.div`
  display: flex;
  position: relative;
`;

const StoreTitleContainer = styled.div`
line-height: 20px;
font-weight: 700;
font-size: 12px;
margin-bottom: 10px;
padding-top: 10px;
padding-left: 5px
display: flex;
color: #000042;
`;

const StoreAdrress = styled.span`
  margin-left: 5px;
  font-family: ${TypographyENUM.lkSansRegular};
  color: #000042;
`;

const SlotContainer = styled.div`
  margin: 10px 0;
`;

const DateTitle = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-top: 4px;
  margin-bottom: 6px;
`;

const ScrollableContainer = styled.div<{ isLoading: boolean }>`
  display: flex;
  flex-direction: row;
  overflow: scroll;
  ${(props) => props.isLoading && "justify-content: center"};

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const SlotsContainer = styled.div<{ isSelected: boolean }>`
  min-width: 80px !important;
  height: 72px;
  background: ${(props) => (props.isSelected ? "#f5f5f5" : "#fff")};
  display: flex;
  border: 1px solid
    ${(props) => (props.isSelected ? "#000042" : "rgba(60, 60, 60, 0.23)")};
  border-radius: 8px;
  justify-content: center;
  padding: 8px 12px;
  margin: 5px 10px;
  margin-left: 0;
  overflow: hidden;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: ${TypographyENUM.lkSansRegular};
  color: #000042;
  font-size: 14px;
  opacity: 0.8;
  letter-spacing: 0.15px;
`;
const TimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 30px;
  justify-content: space-around;
`;
const SlotTime = styled.div<{ isAvailable: boolean; isSelected: boolean }>`
  height: 40px;
  background: ${(props) => (props.isSelected ? "#f5f5f5" : "#fff")};
  border: 1px solid ${(props) => (props.isSelected ? "#000042" : "#cecedf")};
  border-radius: 100px;
  width: 151px;
  text-transform: lowercase;
  display: ${(props) => (props.isAvailable ? "flex" : "none")};
  flex-direction: row;
  min-width: 132px !important;
  justify-content: center;
  padding: 8px 12px;
  margin: 4px;
  text-align: center;
  color: #3c3c3c;
  font-family: ${TypographyENUM.lkSansRegular};
  font-size: 14px;
  align-items: center;
`;

const AppointmentConfirmed = styled.div`
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  padding: 16px;
  margin-top: 10px;
  display: flex;
  background-color: #ffffff;
  font-family: ${TypographyENUM.lkSansRegular};
`;

const IconWrapper = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ecfbd3;
  padding: 5px;
  font-size: 16px;
  color: #489b1c;
`;

const TickImg = styled.img`
  padding-bottom: 8px;
  font-size: 16px;
  color: #489b1c;
`;

const ConfirmedTitleWrap = styled.div`
  line-height: 24px;
  font-weight: 700;
  font-size: 14px;
  text-align: left;
  margin-left: 10px;
  color: #489b1c;
`;

const DateTime = styled.div`
  line-height: 20px;
  font-size: 12px;
  color: #333368;
  font-family: ${TypographyENUM.lkSansRegular};
`;

const AppointmentLowerContainer = styled.div`
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 16px;
  margin-top: 4px;
  margin-bottom: 10px;
  background-color: #ffffff;
  font-family: ${TypographyENUM.lkSansRegular};
`;

const AppointmentLowerContainerTop = styled.div`
  border-bottom: 1px dashed #e2e2ee;
  padding-top: 8px;
  align-items: center;
  display: flex;
  margin-bottom: 10px;
`;

const AppointmentLowerContainerBottom = styled.div`
  font-weight: 700;
  margin-bottom: 15px;
  margin-top: 20px;
  display: flex;
  gap: 20px;

  a,
  span {
    padding: 6px 12px;
    border: 1px solid #a2a2b8;
    border-radius: 100px;
    line-height: 20px;
    font-size: 12px;
    color: #000042;
    font-family: ${TypographyENUM.lkSansRegular};
  }
`;

const CalendarIconContainer = styled.span`
  margin-bottom: auto;
  font-size: 16px;
  color: #999999;
`;

const DateTimeContainer = styled.div`
  margin-bottom: 10px;
  margin-left: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;

  span {
    font-family: ${TypographyENUM.lkSansRegular};
    font-size: 12px;
    line-height: 20px;
    color: #66668e;
    font-weight: 700;

    &:first-child {
      color: #000042;
    }
  }
`;

const localeData = {
  NEARBY_LENSKART_STORES: "Nearby Lenskart Stores",
  NO_STORES_FOUND_AT_THIS_LOCATION: "No stores found at this location",
  USE_MY_CURRENT_LOCATION: "Use my current location",
  AWAY: "away",
  HOURS: "Hours",
  SYMBOL_COLON: ":",
  HYPHEN: "-",
  CALL_STORE: "Call Store",
  VIEW_ON_MAP: "View on Map",
};

export default function StoreEyeTest({
  orderId,
  itemId,
  deviceType,
  sessionId,
  selectedPage,
  setSelectedPage,
}: {
  orderId: number;
  itemId: number;
  deviceType: any;
  sessionId: string;
  selectedPage: string;
  setSelectedPage: (props: any) => any;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const { storeList } = useSelector((state: RootState) => state.orderInfo);
  const { orderData, isLoading } = useSelector(
    (state: RootState) => state.myOrderInfo
  );
  const { storeSlots, bookSlot } = useSelector(
    (state: RootState) => state.prescriptionInfo
  );
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<any>(null);
  const [slotSelected, setSlotSelected] = useState<any>({
    slotId: 0,
    date: "",
  });
  const [isGetCurrentLocation, setIsGetCurrentLocation] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showMapModal, setShowMap] = useState(false);

  useEffect(() => {
    if (storeSlots && storeSlots?.data?.data) {
      setSelectedTimeSlots(storeSlots?.data?.data[0]);
    }
  }, [storeSlots]);

  useEffect(() => {
    if (sessionId && Object.keys(orderData).length) {
      dispatch(
        getNearByStore({
          address: orderData.shippingAddress.postcode,
          radius: 20,
          pageSize: 10,
          pageNumber: 0,
          sessionId: sessionId,
        })
      );
    }

    if (sessionId && !Object.keys(orderData).length && !isLoading) {
      dispatch(
        getOrderData({
          sessionId: sessionId,
          orderID: orderId,
        })
      );
    }
  }, [sessionId, orderData]);

  const stores = ["a"];

  const submitButton = () => {
    if (storeSlots.storePage === "2") {
      dispatch(
        bookSlots({
          sessionId: sessionId,
          orderId: orderId,
          itemId: itemId,
          appointmentType: 1,
          countryCode: "+1", //orderData.shippingAddress.phoneCode,
          customerName: orderData.shippingAddress.firstName,
          customerNumber: "9999999994", //orderData.shippingAddress.phone,
          date: slotSelected.date,
          slotId: slotSelected.slotId,
          storeCode: selectedStore.code,
        })
      );
      dispatch(setStoreLocatorPage("3"));
    } else if (storeSlots.storePage === "1") {
      dispatch(setStoreLocatorPage("2"));
    } else {
      dispatch(setStoreLocatorPage("1"));
    }
  };

  useEffect(() => {
    if (storeSlots.storePage === "2") {
      dispatch(
        getStoreSlotes({
          sessionId: sessionId,
          classification: 1,
          duration: 30,
          skipCurrentDate: 0,
          storeCode: selectedStore.code,
        })
      );
    } else if (storeSlots.storePage === "1" && slotSelected.slotId) {
      setSlotSelected({
        slotId: 0,
        date: "",
      });
    }
  }, [storeSlots.storePage]);

  const SelectedTimeAndDate = (slotId: number) => {
    setSlotSelected({ slotId: slotId, date: selectedTimeSlots.date });
  };

  useEffect(() => {
    if (selectedAddress) {
      if (sessionId) {
        dispatch(
          getNearByStore({
            address: selectedAddress,
            radius: 20,
            pageSize: 10,
            pageNumber: 0,
            sessionId: sessionId,
          })
        );
      }
    }
  }, [selectedAddress]);

  const showMapBottomSheet = () => {
    let mapUrl;
    const embed = "&output=embed";
    let lat = selectedStore?.latitude || storeList.storeList.origin.lat;
    let lng = selectedStore?.longitude || storeList.storeList.origin.lng;
    let googleUrl = selectedStore?.googleUrl || "";
    if (googleUrl) mapUrl = googleUrl;
    else if (lat && lng) mapUrl = `https://maps.google.com/?q=${lat},${lng}`;

    return mapUrl?.includes("https://maps.google.com") ? (
      <>
        <div
          className="mr-r10 fsp18"
          style={{ float: "right" }}
          onClick={() => setShowMap(false)}
        >
          x
        </div>
        <div
          className="mr-t5 pd-4 bg-pale_grey"
          style={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            paddingTop: "56.25%",
            height: "600px",
          }}
        >
          <iframe
            allowFullScreen={false}
            aria-hidden="false"
            frameBorder="0"
            height="600"
            loading="lazy"
            scrolling="no"
            src={mapUrl + embed}
            style={{ border: 0, position: "absolute", top: "0", width: "100%" }}
            title={lat}
          />
        </div>
      </>
    ) : (
      <div className="mr-t5 text-color_brick_red">{"NOT_ABLE_TO_SHOW_MAP"}</div>
    );
  };

  return (
    <>
      <Body isMobile={DeviceTypes.MOBILE === deviceType}>
        <>
          {DeviceTypes.MOBILE === deviceType && (
            <Contain>
              <RootHeader isMobile={true}>
                {"Book a store appointment"}
              </RootHeader>
            </Contain>
          )}
          {storeSlots.storePage === "1" && (
            <>
              {stores && stores.length && !storeList.isError ? (
                <Title error={false}>{localeData.NEARBY_LENSKART_STORES}</Title>
              ) : (
                <>
                  <Title error>
                    {localeData.NO_STORES_FOUND_AT_THIS_LOCATION}
                  </Title>
                  {/* {loadingNearByStore || !values.customerAddress */}
                  {/* ? ''
                        : NO_STORES_FOUND_AT_THIS_LOCATION} */}
                </>
              )}
              <SearchContainer>
                {/* <GoogleInputWrapper>
                  <span>
                    <Icons.Search />
                  </span>
                  <Input type="text" />
                </GoogleInputWrapper> */}

                <GoogleAutoComplete
                  setSelectedAddress={setSelectedAddress}
                  setIsGetCurrentLocation={setIsGetCurrentLocation}
                  isGetCurrentLocation={isGetCurrentLocation}
                />
                <LocationButton onClick={() => setIsGetCurrentLocation(true)}>
                  <Img
                    alt=""
                    className="cursor-pointer"
                    src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/CurrentLocation.svg"
                  />
                  <ButtonSpan>{localeData.USE_MY_CURRENT_LOCATION}</ButtonSpan>
                </LocationButton>
              </SearchContainer>
              <SearchResult>
                {!storeList.isLoading ? (
                  Boolean(
                    storeList.storeList.stores &&
                      storeList.storeList.stores.length
                  ) ? (
                    storeList.storeList.stores.map(
                      (storeDetails: any, key: number) => {
                        return (
                          <CardOuter
                            key={key}
                            isSelected={Boolean(
                              selectedStore &&
                                selectedStore?.code &&
                                storeDetails.code === selectedStore.code
                            )}
                          >
                            <Container>
                              <InputCard
                                checked={Boolean(
                                  selectedStore &&
                                    selectedStore?.code &&
                                    storeDetails.code === selectedStore.code
                                )}
                                id={`reason-${key}`}
                                name="reason"
                                type="radio"
                                value={key}
                                onChange={() => setSelectedStore(storeDetails)}
                              />
                              <Label
                                htmlFor={`reason-${key}`}
                                title={key.toString()}
                              >
                                <CardInfo>
                                  <CardTitle>{storeDetails.name}</CardTitle>
                                  <CardDistance>
                                    {storeDetails.distance?.humanReadable}{" "}
                                    {localeData.AWAY} •{" "}
                                    {
                                      <Capitalize>
                                        {/* {TIMINGS} */}
                                        {localeData.HOURS}
                                        {localeData.SYMBOL_COLON}{" "}
                                      </Capitalize>
                                    }
                                    {getTime(storeDetails.openingTime)}
                                    {"AM"} {localeData.HYPHEN}{" "}
                                    {getTime(storeDetails.closingTime)}
                                    {"PM"}
                                  </CardDistance>
                                  {Boolean(
                                    selectedStore &&
                                      storeDetails.code === selectedStore.code
                                  ) && (
                                    <CallContainer>
                                      <A
                                        aria-label={`Call Store At ${storeDetails.phoneCode}${storeDetails.telephone}`}
                                        href={`tel:${storeDetails.phoneCode}-${storeDetails.telephone}`}
                                      >
                                        {localeData.CALL_STORE}
                                      </A>
                                      <ViewMap
                                        onClick={(ev) => {
                                          openMaps(
                                            ev,
                                            {},
                                            storeDetails.googleUrl,
                                            storeDetails.latitude,
                                            storeDetails.longitude,
                                            setShowMap
                                          );
                                        }}
                                      >
                                        {localeData.VIEW_ON_MAP}
                                      </ViewMap>
                                    </CallContainer>
                                  )}
                                </CardInfo>
                              </Label>
                            </Container>
                          </CardOuter>
                        );
                      }
                    )
                  ) : (
                    <>
                      <Title error={false}>
                        Please choose a new location to search for stores or go
                        back and select a different method
                      </Title>
                    </>
                  )
                ) : (
                  <Spinner show fullPage={false} />
                )}
              </SearchResult>
            </>
          )}

          {selectedStore && storeSlots.storePage === "2" && (
            <>
              <StoreTitleContainer>
                <Img
                  src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/TickDarkblueIcon.svg"
                  alt="tick"
                />
                <StoreAdrress>{selectedStore.address}</StoreAdrress>
              </StoreTitleContainer>
              <SlotContainer>
                {!storeSlots.isError && <DateTitle>Date</DateTitle>}
                <ScrollableContainer isLoading={storeSlots.isLoading}>
                  {!storeSlots.isLoading ? (
                    !storeSlots.isError && storeSlots.data ? (
                      storeSlots.data.data.map((slots: any, index: number) => {
                        const date = new Date(slots.date);
                        const dateData = date.toUTCString().split(" ");
                        return (
                          <SlotsContainer
                            key={index}
                            onClick={() => {
                              setSelectedTimeSlots(slots);
                              setSlotSelected({
                                slotId: slots.slotId,
                                date: "",
                              });
                            }}
                            isSelected={
                              slots.date === selectedTimeSlots?.date
                                ? true
                                : false
                            }
                          >
                            <DateContainer>
                              <div>{dateData[0]}</div>
                              <div>{dateData[1] + " " + dateData[2]}</div>
                            </DateContainer>
                          </SlotsContainer>
                        );
                      })
                    ) : (
                      <>
                        <div>{storeSlots.errorMessage}</div>
                      </>
                    )
                  ) : (
                    <>
                      <Spinner show fullPage={false} />
                    </>
                  )}
                </ScrollableContainer>
              </SlotContainer>
              <SlotContainer>
                {!storeSlots.isError && <DateTitle>Time</DateTitle>}
                <TimeContainer>
                  {!storeSlots.isLoading ? (
                    selectedTimeSlots &&
                    selectedTimeSlots.timeSlot.map(
                      (slot: any, index: number) => {
                        const startTime = tConv24(slot?.startTime).split(" ");
                        const endTime = tConv24(slot?.endTime).split(" ");
                        return (
                          <SlotTime
                            key={index}
                            isAvailable={slot.isAvailable}
                            isSelected={
                              slotSelected.slotId === slot.slotId &&
                              slotSelected.date === selectedTimeSlots.date
                            }
                            onClick={() => SelectedTimeAndDate(slot.slotId)}
                          >
                            <div>{startTime[0]}</div>
                            <div>{" - "}</div>
                            <div>
                              {endTime[0]} {endTime[1]}
                            </div>
                          </SlotTime>
                        );
                      }
                    )
                  ) : (
                    <>
                      <Spinner show fullPage={false} />
                    </>
                  )}
                </TimeContainer>
              </SlotContainer>
            </>
          )}

          {storeSlots.storePage === "3" &&
            (bookSlot.isLoading ? (
              <>
                <Spinner show fullPage={false} />
              </>
            ) : !bookSlot.isError && bookSlot.data ? (
              <>
                <AppointmentConfirmed>
                  <IconWrapper>
                    <TickImg
                      src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/TickIcon.svg"
                      alt="tick"
                    />
                  </IconWrapper>
                  <ConfirmedTitleWrap>
                    {"Appointment Confirmed"}
                    <DateTime>
                      {"Booked on"} {bookSlot.data.bookingDate}
                    </DateTime>
                  </ConfirmedTitleWrap>
                </AppointmentConfirmed>
                <AppointmentLowerContainer>
                  <AppointmentLowerContainerTop>
                    <CalendarIconContainer>
                      <Img
                        src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/CalendarIcon.svg"
                        alt="icon"
                      />
                    </CalendarIconContainer>
                    <DateTimeContainer>
                      <span>{bookSlot.data.date}</span>
                      <span>{bookSlot.data.time}</span>
                    </DateTimeContainer>
                  </AppointmentLowerContainerTop>

                  <AppointmentLowerContainerTop>
                    <CalendarIconContainer>
                      <Img
                        src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/StoreFront.svg"
                        alt="icon"
                      />
                    </CalendarIconContainer>
                    <DateTimeContainer>
                      <span>{bookSlot.data.address}</span>
                    </DateTimeContainer>
                  </AppointmentLowerContainerTop>
                  <AppointmentLowerContainerBottom>
                    <a
                      href={`tel:${bookSlot?.data?.country_code}-${bookSlot?.data?.phone}`}
                    >
                      <Img
                        margin
                        src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/PhoneIcon.svg"
                      />
                      {"Call Store"}
                    </a>
                    <span onClick={() => setShowMap(true)}>
                      <Img
                        margin
                        src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/MapIcon.svg"
                      />
                      {"View on Map"}
                    </span>
                  </AppointmentLowerContainerBottom>
                </AppointmentLowerContainer>
              </>
            ) : (
              <>
                <div>error</div>
              </>
            ))}
        </>
      </Body>
      <BottomSheet isMobile={deviceType === DeviceTypes.MOBILE}>
        <Button
          onClick={() => submitButton()}
          theme={ThemeENUM.secondary}
          text={
            storeSlots.storePage === "1"
              ? "Proceed Date & Time"
              : storeSlots.storePage === "2"
              ? "Book Appointment"
              : "Continue Shopping"
          }
          width={deviceType === DeviceTypes.MOBILE ? 100 : 50}
          disabled={
            (storeSlots.storePage === "1" && !selectedStore) ||
            (storeSlots.storePage === "2" && !slotSelected.date)
          }
        />
      </BottomSheet>
      <Modal
        show={showMapModal}
        onHide={() => setShowMap(false)}
        bsSize={"lg"}
        keyboard
        dialogCss={`width: 95vw; .modal-body{height: auto}`}
      >
        {/* <Modal.Header closeButton={true} onHide={() => setShowMap(false)} /> */}
        <Modal.Body>
          {storeList?.storeList.origin && showMapBottomSheet()}
        </Modal.Body>
      </Modal>
      {/* {showMapModal && showMapBottomSheet()} */}
    </>
  );
}
