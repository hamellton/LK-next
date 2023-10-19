import { putPrescriptionData } from "@/redux/slices/userPowerInfo";
import { AppDispatch } from "@/redux/store";
import { LocaleDataType } from "@/types/coreTypes";
import { Modal } from "@lk/ui-library";
import { ModalHeader } from "pageStyles/styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import DropDown from "./DropDown";
import PrescriptionTable from "./PrescriptionTable";
import {
  Image,
  HeaderContainer,
  HeaderText,
  ImageContainer,
  HeaderTextContainer,
  BrandName,
  ModalBodyConatiner,
  AddPowerheader,
  AddPowerText,
  ReadInstruction,
  PowerDetailsWrapper,
  AddPowerTable,
  PowerHead,
  PowerHeading,
  PowerTableBlock,
  PowerTableList,
  PowerItemList,
  DropDownConatiner,
  SpanData,
  UpArrow,
  DownArrow,
  IhaveCylTextContainer,
  IhaveCylLabel,
  IhaveCylInput,
  SubmitEyePowerConatiner,
  PreviewPrescriptionView,
  SuccessIcon,
  PreviewText,
  ContinueButton,
  BackButton,
} from "./styles";

interface EnterManualPrescriptionType {
  openManualPrescriptionModal: boolean;
  closeManualPrescriptionModal: () => void;
  powertypeList: any;
  item: any;
  localeData: LocaleDataType;
  userData: any;
  selectedOrder: any;
}

enum direction {
  right = "right",
  left = "left",
}

const EnterManualPrescription = ({
  openManualPrescriptionModal,
  closeManualPrescriptionModal,
  powertypeList,
  item,
  localeData,
  userData,
  selectedOrder,
}: EnterManualPrescriptionType) => {
  const [openList, setOpenList] = useState("");
  const [openDirection, setOpenDirection] = useState("");
  const [iHaveCylPow, setIHaveCylPow] = useState(false);
  const [selectedPwerPrescription, setSelectedPowerPrescription] =
    useState<any>({ imageFileName: "" });
  const [submitPower, setSubmitPower] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleOpenDropDown = (id: string, direction: direction) => {
    setOpenList(id);
    setOpenDirection(direction);
  };
  const slectedPowerFn = (
    value: string | number,
    direction: string,
    type: string
  ) => {
    let prescriptionObj = selectedPwerPrescription && JSON.parse(JSON.stringify(selectedPwerPrescription));
    let obj: any = {
      [direction]: {
        [type]: value,
      },
    };
    if (!prescriptionObj?.[direction]) {
      Object.assign(prescriptionObj, obj);
    } else {
      prescriptionObj = {
        ...prescriptionObj,
        [direction]: { ...prescriptionObj[direction], ...obj[direction] },
      };
    }
    setSelectedPowerPrescription({ ...prescriptionObj });
  };
  const axisList: any = [];
  if (iHaveCylPow) {
    let i: number = 0;
    while (i <= 180) {
      axisList.push(i);
      i += 1;
    }
  }
  const handleSubmitPower = () => {
    setSubmitPower(true);
  };
  const handleBack = () => {
    setSubmitPower(false);
  };
  const submitPowerManual = () => {
    const data: any = {
      left: {
        sph: selectedPwerPrescription?.left?.sph || "-",
        cyl: selectedPwerPrescription?.left.cyl || "",
        axis: selectedPwerPrescription?.left.axis || "",
        ap: selectedPwerPrescription?.left.ap || "",
        pd: selectedPwerPrescription?.left.pd || "",
      },
      right: {
        sph: selectedPwerPrescription?.right?.sph || "-",
        cyl: selectedPwerPrescription?.right.cyl || "",
        axis: selectedPwerPrescription?.right.axis || "",
        ap: selectedPwerPrescription?.right.ap || "",
        pd: selectedPwerPrescription?.right.pd || "",
      },
      imageFileName: "",
      userName:
        selectedOrder.shippingAddress.firstName +
        selectedOrder.shippingAddress.lastName,
      powerType: item.prescription.powerType,
    };
    dispatch(
      putPrescriptionData({
        sessionId: userData.id,
        itemID: item?.id,
        orderID: selectedOrder.id,
        emailID: userData.customerEmail,
        prescription: data,
      })
    );
    setOpenList("");
  };
  return (
    <Modal
      show={openManualPrescriptionModal}
      onHide={closeManualPrescriptionModal}
      bsSize={"lg"}
      keyboard
      dialogCss={`width: 80vw;`}
    >
      <Modal.Header closeButton={true} onHide={closeManualPrescriptionModal}>
        <ModalHeader>
          <HeaderContainer>
            <ImageContainer>
              <Image src={item.image} alt="" />
            </ImageContainer>
            <HeaderTextContainer>
              <HeaderText>{item.name}</HeaderText>
              <BrandName>{item.brandName}</BrandName>
            </HeaderTextContainer>
          </HeaderContainer>
        </ModalHeader>
      </Modal.Header>
      <Modal.Body className={"fullheight"}>
        <ModalBodyConatiner>
          {!submitPower && (
            <>
              <AddPowerheader>
                <AddPowerText>{localeData.ADD_POWER_DETAILS}</AddPowerText>
                <ReadInstruction>
                  {localeData.LEARN_READ_PRESCRIPTION}
                </ReadInstruction>
              </AddPowerheader>
              <PowerDetailsWrapper>
                <AddPowerTable>
                  <PowerHead>
                    <PowerHeading>{localeData.EYE}</PowerHeading>
                    <PowerHeading>{localeData.RIGHT_EYE}</PowerHeading>
                    <PowerHeading>{localeData.LEFT_EYE}</PowerHeading>
                  </PowerHead>
                </AddPowerTable>
                <PowerTableBlock>
                  {powertypeList?.powerTypeList?.map(
                    (power: any, key: number) => {
                      if (power.type === "sph" || power.type === "ap") {
                        return (
                          <PowerTableList key={`${power.type}`}>
                            <PowerHeading>{power.label}</PowerHeading>
                            {power.inputType === "drop_down" && (
                              <PowerItemList>
                                <DropDownConatiner
                                  onClick={() =>
                                    handleOpenDropDown(
                                      power.type,
                                      direction.left
                                    )
                                  }
                                >
                                  <SpanData>
                                    {selectedPwerPrescription[direction.left]?.[
                                      power.type
                                    ] || "select"}
                                  </SpanData>
                                  {openList === power.type &&
                                  openDirection === direction.left ? (
                                    <DownArrow />
                                  ) : (
                                    <UpArrow />
                                  )}
                                </DropDownConatiner>
                                {openList === power.type &&
                                  openDirection === direction.left && (
                                    <DropDown
                                      slectedPower={slectedPowerFn}
                                      type={power.type}
                                      direction={direction.left}
                                      list={power.powerDataList[0].value}
                                      setOpenList={setOpenList}
                                    />
                                  )}
                              </PowerItemList>
                            )}
                            {power.inputType === "drop_down" && (
                              <PowerItemList>
                                <DropDownConatiner
                                  onClick={() =>
                                    handleOpenDropDown(
                                      power.type,
                                      direction.right
                                    )
                                  }
                                >
                                  <SpanData>
                                    {selectedPwerPrescription[
                                      direction.right
                                    ]?.[power.type] || "select"}
                                  </SpanData>
                                  {openList === power.type &&
                                  openDirection === direction.right ? (
                                    <DownArrow />
                                  ) : (
                                    <UpArrow />
                                  )}
                                </DropDownConatiner>
                                {openList === power.type &&
                                  openDirection === direction.right && (
                                    <DropDown
                                      slectedPower={slectedPowerFn}
                                      type={power.type}
                                      direction={direction.right}
                                      list={power.powerDataList[0].value}
                                      setOpenList={setOpenList}
                                    />
                                  )}
                              </PowerItemList>
                            )}
                          </PowerTableList>
                        );
                      }
                      if (power.type === "cyl" && iHaveCylPow) {
                        return (
                          <PowerTableList key={`${power.type}`}>
                            <PowerHeading>{power.label}</PowerHeading>
                            {power.inputType === "drop_down" && (
                              <PowerItemList>
                                <DropDownConatiner
                                  onClick={() =>
                                    handleOpenDropDown(
                                      power.type,
                                      direction.left
                                    )
                                  }
                                >
                                  <SpanData>
                                    {selectedPwerPrescription[direction.left]?.[
                                      power.type
                                    ] || "select"}
                                  </SpanData>
                                  {openList === power.type &&
                                  openDirection === direction.left ? (
                                    <DownArrow />
                                  ) : (
                                    <UpArrow />
                                  )}
                                </DropDownConatiner>
                                {openList === power.type &&
                                  openDirection === direction.left && (
                                    <DropDown
                                      slectedPower={slectedPowerFn}
                                      type={power.type}
                                      direction={direction.left}
                                      list={power.powerDataList[0].value}
                                      setOpenList={setOpenList}
                                    />
                                  )}
                              </PowerItemList>
                            )}
                            {power.inputType === "drop_down" && (
                              <PowerItemList>
                                <DropDownConatiner
                                  onClick={() =>
                                    handleOpenDropDown(
                                      power.type,
                                      direction.right
                                    )
                                  }
                                >
                                  <SpanData>
                                    {selectedPwerPrescription[
                                      direction.right
                                    ]?.[power.type] || "select"}
                                  </SpanData>
                                  {openList === power.type &&
                                  openDirection === direction.right ? (
                                    <DownArrow />
                                  ) : (
                                    <UpArrow />
                                  )}
                                </DropDownConatiner>
                                {openList === power.type &&
                                  openDirection === direction.right && (
                                    <DropDown
                                      slectedPower={slectedPowerFn}
                                      type={power.type}
                                      direction={direction.right}
                                      list={power.powerDataList[0].value}
                                      setOpenList={setOpenList}
                                    />
                                  )}
                              </PowerItemList>
                            )}
                          </PowerTableList>
                        );
                      }
                      if (power.type === "axis" && iHaveCylPow) {
                        return (
                          <PowerTableList key={`${power.type}`}>
                            <PowerHeading>{power.label}</PowerHeading>
                            {power.inputType === "field" && (
                              <PowerItemList>
                                <DropDownConatiner
                                  onClick={() =>
                                    handleOpenDropDown(
                                      power.type,
                                      direction.left
                                    )
                                  }
                                >
                                  <SpanData>
                                    {selectedPwerPrescription[direction.left]?.[
                                      power.type
                                    ] || "select"}
                                  </SpanData>
                                  {openList === power.type &&
                                  openDirection === direction.left ? (
                                    <DownArrow />
                                  ) : (
                                    <UpArrow />
                                  )}
                                </DropDownConatiner>
                                {openList === power.type &&
                                  openDirection === direction.left && (
                                    <DropDown
                                      slectedPower={slectedPowerFn}
                                      type={power.type}
                                      direction={direction.left}
                                      list={axisList}
                                      setOpenList={setOpenList}
                                    />
                                  )}
                              </PowerItemList>
                            )}
                            {power.inputType === "field" && (
                              <PowerItemList>
                                <DropDownConatiner
                                  onClick={() =>
                                    handleOpenDropDown(
                                      power.type,
                                      direction.right
                                    )
                                  }
                                >
                                  <SpanData>
                                    {selectedPwerPrescription[
                                      direction.right
                                    ]?.[power.type] || "select"}
                                  </SpanData>
                                  {openList === power.type &&
                                  openDirection === direction.right ? (
                                    <DownArrow />
                                  ) : (
                                    <UpArrow />
                                  )}
                                </DropDownConatiner>
                                {openList === power.type &&
                                  openDirection === direction.right && (
                                    <DropDown
                                      slectedPower={slectedPowerFn}
                                      type={power.type}
                                      direction={direction.right}
                                      list={axisList}
                                      setOpenList={setOpenList}
                                    />
                                  )}
                              </PowerItemList>
                            )}
                          </PowerTableList>
                        );
                      }
                    }
                  )}
                </PowerTableBlock>
              </PowerDetailsWrapper>
              <IhaveCylTextContainer>
                <IhaveCylInput
                  type="checkbox"
                  checked={iHaveCylPow}
                  onClick={() => {
                    setIHaveCylPow(!iHaveCylPow);
                    setOpenList("");
                  }}
                  id="cylAxis"
                />
                <IhaveCylLabel htmlFor="cylAxis">
                  I Have Cylindrical (CYL) Power
                </IhaveCylLabel>
              </IhaveCylTextContainer>
              <SubmitEyePowerConatiner
                onClick={() => handleSubmitPower()}
                disable={
                  Object.keys(selectedPwerPrescription).length > 0
                    ? false
                    : true
                }
              >
                Submit EYE Power
              </SubmitEyePowerConatiner>
            </>
          )}
          {submitPower && (
            <>
              <PreviewPrescriptionView>
                <SuccessIcon></SuccessIcon>
                <PreviewText>
                  Please review your prescription before submitting
                </PreviewText>
              </PreviewPrescriptionView>
              <PrescriptionTable
                dataLocale={localeData}
                powerDetails={selectedPwerPrescription}
              ></PrescriptionTable>
              <ContinueButton onClick={() => submitPowerManual()}>
                Continue
              </ContinueButton>
              <BackButton onClick={() => handleBack()}>Back</BackButton>
            </>
          )}
        </ModalBodyConatiner>
      </Modal.Body>
    </Modal>
  );
};

export default EnterManualPrescription;
