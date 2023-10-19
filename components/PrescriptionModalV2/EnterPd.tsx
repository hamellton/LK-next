import { getOrderData } from "@/redux/slices/myorder";
import {
  setPrescriptionPageStatus,
  updatePrescriptionData,
  updatePrescriptionPage,
  updateUploadData,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes, ThemeENUM } from "@/types/baseTypes";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import {
  Button,
  PrescriptionModal,
  BottomSheet as BottomSheetUI,
  ToastMessage,
  Toast,
} from "@lk/ui-library";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BottomSheet from "./BottomSheet";
import { downloadUploadedPrescription, Pages } from "./helper";
import SixOverSix from "./SixOverSix";

const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const Img = styled.img`
  width: 100%;
  margin-top: 20px;
`;

interface EnterPdTypes {
  ChangePage: (props: string) => void;
  closeSlider: (props: boolean) => void;
  orderId: number;
  item: any;
  postNeedHelpWhatsappFun: () => void;
  localeData: DataType;
  configData: DataType;
  isRTL: boolean;
}

export default function EnterPd({
  ChangePage,
  closeSlider,
  orderId,
  item,
  postNeedHelpWhatsappFun,
  localeData,
  configData,
  isRTL,
}: EnterPdTypes) {
  const [selected, setSelected] = useState("1");

  const [PdValues, setPdValues] = useState<{
    leftPd: null | number;
    rightPd: null | number;
  }>({
    leftPd: null,
    rightPd: null,
  });
  const [PdError, setPdError] = useState({
    leftPd: "",
    rightPd: "",
  });
  const [disabled, setDisabled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [sixOverSixError, setSixOverSixError] = useState(0);
  const [toast, setToast] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { deviceType } = useSelector((state: RootState) => state.pageInfo);
  const [pdSixOverSix, setPdSixOverSix] = useState(0);
  const { userDetails } = useSelector((state: RootState) => state.userInfo);
  const {
    uploadImage,
    userName,
    updatePrescriptionDataInfo,
    updatePrescriptionDataAdded,
  } = useSelector((state: RootState) => state.prescriptionInfo);

  const { sessionId, email } = useSelector(
    (state: RootState) => state.userInfo
  );

  const handleClick = (selectedOption: string) => {
    setSelected(selectedOption);
  };

  const handlePD = (value: number, side: string) => {
    if (value >= 20 && value <= 40) {
      setPdValues({ ...PdValues, [side]: value });
      setPdError({ ...PdError, [side]: "" });
    } else {
      setPdValues({ ...PdValues, [side]: null });
      setPdError({ ...PdError, [side]: localeData.VALUE_BETWEEN_20_TO_40 });
    }
  };

  useEffect(() => {
    if (
      !PdError.leftPd &&
      !PdError.rightPd &&
      PdValues.leftPd &&
      PdValues.rightPd
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [PdError, PdValues]);

  useEffect(() => {
    if (selected !== "2" && PdValues.leftPd) {
      setPdValues({ leftPd: null, rightPd: null });
    }
  }, [selected]);

  useEffect(() => {
    if (pdSixOverSix > 0) {
      setClicked(false);
      setSelected("2");
      setPdError({ leftPd: "", rightPd: "" });
      setPdValues({ leftPd: pdSixOverSix, rightPd: pdSixOverSix });
      //   handlePD(pdSixOverSix, "leftPd")
    }
  }, [pdSixOverSix]);

  const [clicked, setClicked] = useState(false);
  const [functionCalled, setFunctionCalled] = useState(false);

  useEffect(() => {
    if (sixOverSixError > 2) {
      setToast(localeData?.SIX_OVER_SIX_ERROR);
      setShowToast(true);
    }
  }, [sixOverSixError]);

  const SubmitButton = (selected: string, page?: string) => {
    if (page === "xcam") {
      setClicked(true);
    } else {
      if (selected === "2") {
        let payload = { ...item.prescriptionView };
        payload = {
          ...payload,
          left: {
            ...payload.left,
            pd: PdValues.leftPd,
          },
          right: {
            ...payload.right,
            pd: PdValues.rightPd,
          },
        };

        payload = {
          ...payload,
          recordedAt: Date.now(),
          source: "WEB",
          power_updated_by: email,
          userName:
            userName || `${userDetails?.firstName} ${userDetails?.lastName}`,
        };

        dispatch(
          updatePrescriptionData({
            sessionId: sessionId,
            orderID: orderId,
            itemID: item.id,
            prescription: payload,
            emailID: email,
          })
        );
        setFunctionCalled(true);
        // setSelected("1");
        // dispatch(setPrescriptionPageStatus(false));
      } else if (selected === "1" && uploadImage.imageUrl) {
        let payload = { ...item.prescriptionView };
        payload = {
          ...payload,
          pdImageFileName: uploadImage.imageUrl,
        };
        payload = {
          ...payload,
          recordedAt: Date.now(),
          source: "WEB",
          power_updated_by: email,
          userName: "test--john",
        };
        dispatch(
          updatePrescriptionData({
            sessionId: sessionId,
            orderID: orderId,
            itemID: item.id,
            prescription: payload,
            emailID: email,
          })
        );
        setSelected("1");
        dispatch(setPrescriptionPageStatus(false));
      } else if (selected === "1") {
        dispatch(updatePrescriptionPage(page || ""));
      } else {
        setSelected("1");
        closeSlider(true);
      }
    }
  };

  const removeImage = () => {
    dispatch(updateUploadData({ error: "", imageUrl: "", pdImageURL: "" }));
  };

  const clickedSetSixOverSixError = () => {
    setSixOverSixError((prevBody: number) => prevBody + 1);
  };

  useEffect(() => {
    if (
      updatePrescriptionDataInfo.isError &&
      !updatePrescriptionDataInfo.isLoading
    ) {
      setShowToast(true);
    } else if (
      !updatePrescriptionDataInfo.isError &&
      !updatePrescriptionDataInfo.isLoading &&
      functionCalled
    ) {
      setSelected("1");
      setFunctionCalled(false);
      dispatch(setPrescriptionPageStatus(false));
    }
  }, [updatePrescriptionDataInfo]);

  return (
    <div>
      {showToast &&
        (DeviceTypes.MOBILE !== deviceType ? (
          <ToastMessage
            message={toast ? toast : updatePrescriptionDataInfo.errorMessage}
            color="orange"
            duration={4000}
            show={showToast}
            hideFn={() => {
              setToast("");
              setShowToast(false);
            }}
            showIcon={false}
          />
        ) : (
          <Toast
            timeOut={4000}
            text={
              toast
                ? toast
                : updatePrescriptionDataInfo.errorMessage ?? "Invalid Power"
            }
            hideFn={() => {
              setToast("");
              setShowToast(false);
            }}
            width={"90%"}
          />
        ))}
      <PrescriptionModal.EnterPd
        localeData={localeData}
        deviceType={deviceType}
        selected={selected}
        handleClick={handleClick}
        PdError={PdError}
        handlePD={handlePD}
        setOpenBottomSheet={setOpenBottomSheet}
        imageUrl={uploadImage.pdImageURL}
        PdValues={PdValues}
        item={item}
        postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
        configData={configData}
        isRTL={isRTL}
        removeImage={removeImage}
      />
      {clicked && (
        <SixOverSix
          setPdSixOverSix={setPdSixOverSix}
          setClicked={setClicked}
          deviceType={deviceType}
          clickedSetSixOverSixError={clickedSetSixOverSixError}
          sixOverSixError={sixOverSixError}
        />
      )}
      <BottomSheetUI
        show={openBottomSheet}
        closebottomSheet={() => setOpenBottomSheet(false)}
      >
        {uploadImage.pdImageURL && openBottomSheet && (
          <Img
            src={`${downloadUploadedPrescription}${uploadImage.pdImageURL}`}
            alt="img"
          />
        )}
      </BottomSheetUI>
      <BottomSheet isMobile={deviceType === DeviceTypes.MOBILE}>
        {selected === "1" && !uploadImage.pdImageURL && (
          <ButtonBox>
            <Button
              onClick={() => SubmitButton(selected, Pages.UPLOAD_PHOTO)}
              text={"Select Image"}
              theme={
                deviceType === DeviceTypes.MOBILE
                  ? ThemeENUM.secondary
                  : ThemeENUM.primary
              }
              width={40}
            />
            <Button
              onClick={() => SubmitButton(selected, "xcam")}
              text={"Use Camera"}
              theme={
                deviceType === DeviceTypes.MOBILE
                  ? ThemeENUM.secondary
                  : ThemeENUM.primary
              }
              width={40}
            />
          </ButtonBox>
        )}
        {(selected !== "1" || uploadImage.pdImageURL) && (
          <Button
            onClick={() => SubmitButton(selected)}
            disabled={
              selected === "2" &&
              (PdError.leftPd ||
                PdError.rightPd ||
                !PdValues.leftPd ||
                !PdValues.rightPd)
            }
            theme={
              deviceType === DeviceTypes.MOBILE
                ? ThemeENUM.secondary
                : ThemeENUM.primary
            }
            text={"Continue"}
            width={50}
          />
        )}
      </BottomSheet>
    </div>
  );
}
