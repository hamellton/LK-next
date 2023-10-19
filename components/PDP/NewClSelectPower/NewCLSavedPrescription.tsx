import { RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import React, { useEffect, useState } from "react";
import { Icons } from "@lk/ui-library";
import { useSelector } from "react-redux";
import {
  NavigationArrowLeft,
  NavigationArrowRight,
  NoPrescriptionText,
  PowerTypeList,
  PowerTypeListitem,
  PowerTypeNumbers,
  PowerTypeTitle,
  SavedPrescriptionBody,
  SavedPrescriptionContainer,
  SavedPrescriptionHeader,
  SavedPrescriptionPowerType,
  SavedPrescriptionWrapper,
  SelectedStatusButton,
  UserDetail,
  UserDetailInitial,
  UserDetailText,
  UserName,
  UserPrescDate,
} from "./NewCLSavedPrescription.styles";

const NewCLSavedPrescription = ({
  localeData,
  isJitProduct,
  selectSavedPrescription,
  selectedSavedPrescription,
  showSubError,
  updateShowSubError,
}: {
  localeData: DataType;
  isJitProduct: boolean;
  selectSavedPrescription: any;
  selectedSavedPrescription: any;
  showSubError: boolean;
  updateShowSubError: (value: boolean) => void;
}) => {
  const {
    NO_POWER_SAVED_CURRENTLY,
    SELECT_FROM_AVAILBALE_OPTIONS,
    ADDED_ON,
    SELECTED,
    SELECT,
    RIGHT_EYE,
    LEFT_EYE,
    SPHERICAL_POWER,
    CYLINDRICAL_POWER,
    AXIS_POWER,
    PD_POWER,
  } = localeData;
  const { data } = useSelector((state: RootState) => state.prescriptionInfo);
  const [currentSavedPrescription, setCurrentSavedPrescription] = useState({
    id: 0,
    powerType: "CONTACT_LENS",
    left: {
      sph: "",
      cyl: "",
      axis: "",
      pd: "",
    },
    right: {
      sph: "",
      cyl: "",
      axis: "",
      pd: "",
    },
    userName: "",
    recordedAt: 0,
    showPd: false,
  });
  const [currentSavedPrescriptionIndex, setCurrentSavedPrescriptionIndex] =
    useState(0);

  useEffect(() => {
    if (data && data?.length > 0) {
      setCurrentSavedPrescription(data[0]);
    }
  }, [data]);

  useEffect(() => {
    // setting 1st as default selected
    // console.log("currentSavedPrescription >>>> ", currentSavedPrescription);
    if (!selectedSavedPrescription.id) {
      selectSavedPrescription(currentSavedPrescription);
    }
  }, [currentSavedPrescription]);

  function formatDate(
    time: string | number | Date,
    pattern: string | undefined,
    year = ""
  ) {
    let formattedString = "";
    if (isNaN(time)) return "";
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
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
    const date = new Date(time).getDate();
    const day = new Date(time).getDay();
    const month = new Date(time).getMonth();
    formattedString = pattern?.replace("EEE", days[day].substr(0, 3)) || "";
    formattedString = formattedString.replace(
      "MMM",
      months[month].substr(0, 3)
    );
    // In case of December, Date will replace on second D other than Dec
    if (month === 11 && pattern?.includes("D")) {
      const firstPart = formattedString.substr(0, pattern?.indexOf("D"));
      const lastPart = formattedString.substr(pattern?.indexOf("D") + 1);
      formattedString = firstPart + date + lastPart;
    } else {
      formattedString = formattedString.replace("D", date);
    }
    if (year) {
      formattedString = formattedString.concat(
        " " + new Date(time).getFullYear()
      );
    }
    return formattedString;
  }

  return (
    <SavedPrescriptionContainer>
      {(!data || data?.length === 0) && (
        <NoPrescriptionText>
          <p>{NO_POWER_SAVED_CURRENTLY}</p>
          <p>{SELECT_FROM_AVAILBALE_OPTIONS}</p>
        </NoPrescriptionText>
      )}
      {data && data?.length > 0 && currentSavedPrescription && (
        <SavedPrescriptionWrapper>
          {currentSavedPrescription &&
            currentSavedPrescription?.id !== data[0]?.id && (
              <NavigationArrowRight
                className="navigation-arrow arrow-right"
                onClick={() => {
                  setCurrentSavedPrescription(
                    data[currentSavedPrescriptionIndex - 1]
                  );
                  setCurrentSavedPrescriptionIndex(
                    currentSavedPrescriptionIndex - 1
                  );
                  updateShowSubError(false);
                }}
              >
                <Icons.RightArrow stroke="rgba(0, 0, 0, 0.1)" />
                {/* <img alt="next saved prescription" src={RightIcon} /> */}
              </NavigationArrowRight>
            )}

          {currentSavedPrescription?.id !== data[data?.length - 1]?.id && (
            <NavigationArrowLeft
              className="navigation-arrow arrow-left"
              onClick={() => {
                setCurrentSavedPrescription(
                  data[currentSavedPrescriptionIndex + 1]
                );
                setCurrentSavedPrescriptionIndex(
                  currentSavedPrescriptionIndex + 1
                );
                updateShowSubError(false);
              }}
            >
              <Icons.LeftArrow stroke="rgba(0, 0, 0, 0.1)" />
              {/* <img alt="previous saved prescription" src={LeftIcon} /> */}
            </NavigationArrowLeft>
          )}

          <SavedPrescriptionHeader>
            <UserDetail>
              <UserDetailInitial>
                {currentSavedPrescription?.userName[0]}
              </UserDetailInitial>
              <UserDetailText>
                <UserName>{currentSavedPrescription?.userName}</UserName>
                <UserPrescDate>
                  {ADDED_ON}:{" "}
                  {formatDate(
                    currentSavedPrescription?.recordedAt,
                    "D MMM",
                    "year"
                  )}
                </UserPrescDate>
              </UserDetailText>
            </UserDetail>
            {selectedSavedPrescription?.id === currentSavedPrescription?.id ? (
              <SelectedStatusButton className="selected-status">
                <img
                  alt="prescription selected"
                  src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/CheckFilledBlue.svg"
                />{" "}
                {SELECTED}
              </SelectedStatusButton>
            ) : (
              <SelectedStatusButton
                className="selected-status"
                onClick={() =>
                  selectSavedPrescription(currentSavedPrescription)
                }
              >
                {SELECT}
              </SelectedStatusButton>
            )}
          </SavedPrescriptionHeader>
          <SavedPrescriptionBody className="saved-pres-body">
            <SavedPrescriptionPowerType className="saved-pres-power-type">
              {currentSavedPrescription?.powerType &&
                currentSavedPrescription.powerType.replace(/_/g, " ")}
            </SavedPrescriptionPowerType>
            <PowerTypeList>
              <PowerTypeListitem>
                <PowerTypeTitle></PowerTypeTitle>
                <PowerTypeNumbers>
                  <p>{RIGHT_EYE}</p>
                  <p>{LEFT_EYE}</p>
                </PowerTypeNumbers>
              </PowerTypeListitem>
              <PowerTypeListitem>
                <PowerTypeTitle>{SPHERICAL_POWER}</PowerTypeTitle>
                <PowerTypeNumbers>
                  <p>
                    {currentSavedPrescription.right.sph
                      ? currentSavedPrescription.right.sph
                      : "-"}
                  </p>
                  <p>
                    {currentSavedPrescription.left.sph
                      ? currentSavedPrescription.left.sph
                      : "-"}
                  </p>
                </PowerTypeNumbers>
              </PowerTypeListitem>
              <PowerTypeListitem>
                <PowerTypeTitle>{CYLINDRICAL_POWER}</PowerTypeTitle>
                <PowerTypeNumbers>
                  <p>
                    {currentSavedPrescription.right.cyl
                      ? currentSavedPrescription.right.cyl
                      : "-"}
                  </p>
                  <p>
                    {currentSavedPrescription.left.cyl
                      ? currentSavedPrescription.left.cyl
                      : "-"}
                  </p>
                </PowerTypeNumbers>
              </PowerTypeListitem>
              <PowerTypeListitem>
                <PowerTypeTitle>{AXIS_POWER}</PowerTypeTitle>
                <PowerTypeNumbers>
                  <p>
                    {currentSavedPrescription.right.axis
                      ? currentSavedPrescription.right.axis
                      : "-"}
                  </p>
                  <p>
                    {currentSavedPrescription.left.axis
                      ? currentSavedPrescription.left.axis
                      : "-"}
                  </p>
                </PowerTypeNumbers>
              </PowerTypeListitem>
              {currentSavedPrescription.showPd && (
                <PowerTypeListitem>
                  <PowerTypeTitle>{PD_POWER}</PowerTypeTitle>
                  <PowerTypeNumbers>
                    <p>
                      {currentSavedPrescription.right.pd
                        ? currentSavedPrescription.right.pd
                        : "-"}
                    </p>
                    <p>
                      {currentSavedPrescription.left.pd
                        ? currentSavedPrescription.left.pd
                        : "-"}
                    </p>
                  </PowerTypeNumbers>
                </PowerTypeListitem>
              )}
            </PowerTypeList>
          </SavedPrescriptionBody>
        </SavedPrescriptionWrapper>
      )}
    </SavedPrescriptionContainer>
  );
};

export default NewCLSavedPrescription;
