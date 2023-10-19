import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getCLSubscriptions,
  getSubscriptionDiscount,
  updateCLPrescription,
  updatePrescriptionData,
  updatePrescriptionPage,
  updatePrevPrescriptionPage,
  updateUploadData,
  uploadImage,
} from "@/redux/slices/prescription";
import { DropzoneComponent } from "react-dropzone-component";
import { DropZoneCss } from "./dropzone";
import { Contain, RootHeader } from "./SubmitPrescriptionRoot";
import { Helper, OrderTitle } from "./SavedPower";
import BottomSheet from "./BottomSheet";
import { Button, PrescriptionModal } from "@lk/ui-library";
import { ComponentSizeENUM, DeviceTypes, ThemeENUM } from "@/types/baseTypes";
import { Pages } from "./helper";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { getOrderData } from "@/redux/slices/myorder";

const LowerBodyContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const LowerBody = styled.div`
  width: 500px;
`;

const Ul = styled.ul`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: #333368;
  padding-left: 23px;
  font-family: "LenskartSans-Regular";
  font-style: normal;
`;

const Li = styled.li`
  margin-bottom: 15px;
`;

const Error = styled.div`
  font-size: 12px;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 10px;
  color: #fd6b0b;
`;

const Change = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #010042;
  text-decoration: underline;
`;

const DropZone = styled.div`
  ${DropZoneCss}
  text-align: center;
  border: 1px dashed #27394e;
  background: #ffffff;
  cursor: pointer;
  .filepicker {
    text-align: center;
    padding: 5px;
    border-radius: 5px;
    min-height: 60px;
    border: 2px dashed #c7c7c7;
    font-family: sans-serif;
    .filepicker-file-icon {
      position: relative;
      display: inline-block;
      margin: 1.5em 0 2.5em 0;
      padding-left: 45px;
      color: black;
      &::before {
        position: absolute;
        top: -7px;
        left: 0;
        width: 29px;
        height: 34px;
        content: "";
        border: solid 2px #7f7f7f;
        border-radius: 2px;
      }
      &::after {
        font-size: 11px;
        line-height: 1.3;
        position: absolute;
        top: 9px;
        left: -4px;
        padding: 0 2px;
        content: "file";
        content: attr(data-filetype);
        text-align: right;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #fff;
        background-color: #000;
      }
      .fileCorner {
        position: absolute;
        top: -7px;
        left: 22px;
        width: 0;
        height: 0;
        border-width: 11px 0 0 11px;
        border-style: solid;
        border-color: white transparent transparent #920035;
      }
    }
    .dropzone {
      text-align: center;
      border: none;
      background: map-get($colorpallete, color_white);
      .dz-preview {
        margin: auto;
        margin-left: 13px;
        margin-bottom: 10px;
      }
      .dz-error-message {
        display: none !important;
      }
    }
    padding: 40px 16px 40px 16px;
  }
`;

const Body = styled.div<{ isMobile: boolean }>`
  ${(props) => props.isMobile && "padding-top: 88px; margin: 0 20px;"}
`;

const ImgWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(props) => props.isMobile && "margin-bottom: 100px;"}

  img {
    max-height: ${(props) => (props.isMobile ? "300px" : "450px")};
    max-width: ${(props) => (props.isMobile ? "300px" : "450px")};
  }
`;

const Img = styled.img``;

let filesT: any = [];

const UploadPrescription = ({
  orderId,
  item,
  closeSlider,
  sessionId,
  email,
  postNeedHelpWhatsappFun,
  localeData,
  configData,
  powerType,
  productData,
  preCheckout,
}: {
  orderId: number;
  closeSlider: (props: boolean) => void;
  item: any;
  sessionId: string;
  email: string;
  postNeedHelpWhatsappFun: () => void;
  localeData: DataType;
  configData: DataType;
  powerType?: string;
  productData?: any;
  preCheckout?: boolean;
}) => {
  const [maxfilesreached, setMaxfilesreached] = useState("");
  const [error, setError] = useState("");
  // const [files, setFiles] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { deviceType } = useSelector((state: RootState) => state.pageInfo);
  const { orderData } = useSelector((state: RootState) => state.myOrderInfo);

  const {
    uploadImage,
    prescriptionPage,
    prevPrescriptionPage,
    updatePrescriptionDataInfo,
    updatePrescriptionDataAdded,
  } = useSelector((state: RootState) => state.prescriptionInfo);

  const { prescription, eye } = useSelector(
    (state: RootState) => state.prescriptionInfo.clPrescriptionData
  );
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);

  const componentConfig = {
    iconFiletypes: [".jpg", ".png", ".gif"],
    showFiletypeIcon: true,
    postUrl: `${process.env.NEXT_PUBLIC_API_URL}/magento/me/index/uploadprescfile`,
  };
  const djsConfig = {
    paramName: "myfile",
    addRemoveLinks: true,
    maxFilesize: 5,
    maxFiles: 1,
    uploadMultiple: false,
    acceptedFiles: "image/jpeg,image/png,image/gif",
    dictDefaultMessage: `${localeData.TAP_HERE_UPLOAD_IMAGE}<br/><span class="text-cool_grey mr-t5 block">(${localeData.MAX_SIZE})</span>`,
  };

  const fileUploadSuccess = (success: any, uploadSuccess: any) => {
    if (uploadSuccess?.result?.code === 200) {
      setError("");
      dispatch(
        updateUploadData({
          error: uploadSuccess?.result?.error || "",
          imageUrl: uploadSuccess?.result?.filename || "",
          pdImageURL: "",
        })
      );
    } else {
    }
  };

  const onFileRemoved = (file: any) => {
    if (!filesT) return;
    const filesTemp = filesT.filter((f) => f.upload.uuid !== file.upload.uuid);
    filesT = filesTemp;
    if (filesTemp.length === 1) {
      setMaxfilesreached("");
      setError("");
    } else if (filesTemp.length === 0) {
      setError("Error");
    }
  };

  const eventHandlers: any = {
    success: fileUploadSuccess,
    processingmultiple: null,
    sendingmultiple: null,
    successmultiple: null,
    completemultiple: null,
    canceledmultiple: null,
    maxfilesreached: (files: any[]) => {
      filesT = files;
      if (files.length > 1) {
        setMaxfilesreached(localeData.UPLOAD_LIMIT_MSG);
      }
    },
    removedfile: onFileRemoved,
  };

  useEffect(() => {
    return () => {
      if (prevPrescriptionPage !== Pages.ENTER_PD) {
        dispatch(
          updateUploadData({
            error: "",
            imageUrl: "",
            pdImageURL: "",
          })
        );
      }
    };
  }, []);

  const submitPower = () => {
    // console.log("submitPower");
    if (preCheckout) {
      dispatch(
        getCLSubscriptions({
          sessionId: sessionId,
          productId: productData.id.toString(),
          isBothEye: eye === "both",
        })
      );

      dispatch(
        getSubscriptionDiscount({
          sessionId: sessionId,
          productId: productData.id.toString(),
          subscriptionsType: "LENS",
        })
      );
      // dispatch(updatePrevPrescriptionPage(prescriptionPage));
      dispatch(updatePrescriptionPage(Pages.CL_BUYING_OPTION));

      dispatch(
        updateCLPrescription({
          ...prescription,
          imageFileName: uploadImage.imageUrl,
        })
      );
      return;
    }
    if (prevPrescriptionPage === Pages.ENTER_PD) {
      dispatch(updatePrescriptionPage(Pages.ENTER_PD));
    } else {
      const prescription = {
        left: {},
        right: {},
        powerType: item?.prescriptionView?.powerType,
        userName: orderData.shippingAddress.firstName,
        imageFileName: uploadImage.imageUrl,
      };
      dispatch(
        updatePrescriptionData({
          sessionId: sessionId,
          orderID: orderId,
          itemID: item.id,
          prescription: prescription,
          emailID: email,
        })
      );
      // window.location.reload();
    }
  };

  useEffect(() => {
    if (
      (!updatePrescriptionDataInfo.isLoading &&
        updatePrescriptionDataInfo.isError) ||
      (!updatePrescriptionDataInfo.isLoading && updatePrescriptionDataAdded)
    ) {
      if (configData?.SHOW_PD && item?.prescription?.powerType === "BIFOCAL") {
        dispatch(updatePrescriptionPage(Pages.ENTER_PD));
        dispatch(updatePrevPrescriptionPage(Pages.ENTER_PD));
      } else {
        closeSlider(true);
        // window.location.reload();
      }
    }
  }, [updatePrescriptionDataInfo]);

  return (
    <>
      {DeviceTypes.MOBILE !== deviceType && (
        <RootHeader isMobile={false} isRTL={isRTL}>
          {localeData.UPLOAD_PRESCRIPTION}
        </RootHeader>
      )}
      <Body isMobile={DeviceTypes.MOBILE === deviceType}>
        <>
          {DeviceTypes.MOBILE === deviceType && (
            <Contain>
              <RootHeader isMobile={true}>
                {localeData.UPLOAD_PRESCRIPTION}
              </RootHeader>
            </Contain>
          )}
          {DeviceTypes.MOBILE !== deviceType && (
            <Helper>
              <OrderTitle>
                {localeData.ORDER_NO} : {orderId}
              </OrderTitle>
              <PrescriptionModal.NeedHelp
                postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
                configData={configData}
                localeData={localeData}
                pId={item.productId}
                isRTL={isRTL}
              />
            </Helper>
          )}
          <LowerBodyContainer>
            <LowerBody>
              <Ul>
                <Li>{localeData.FORMAT_ACCEPTED}</Li>
                <Li>{localeData.FILE_SIZE}</Li>
                <Li>{localeData.RESTRICT_ONE_IMAGE}</Li>
              </Ul>
              {!uploadImage.imageUrl ? (
                <DropZone>
                  <DropzoneComponent
                    config={componentConfig}
                    djsConfig={djsConfig}
                    eventHandlers={eventHandlers}
                  />
                </DropZone>
              ) : (
                <ImgWrapper isMobile={deviceType === DeviceTypes.MOBILE}>
                  <Img
                    alt="Upload Prescription"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/v2/utility/customer/prescriptions/download/${uploadImage.imageUrl}`}
                  />
                  <Change
                    onClick={() => {
                      filesT = [];
                      dispatch(
                        updateUploadData({
                          error: "",
                          imageUrl: "",
                          pdImageURL: "",
                        })
                      );
                    }}
                  >
                    {localeData.CHANGE}
                  </Change>
                </ImgWrapper>
              )}
              <Error>{maxfilesreached}</Error>
            </LowerBody>
          </LowerBodyContainer>
        </>
      </Body>
      <BottomSheet isMobile={deviceType === DeviceTypes.MOBILE}>
        <Button
          onClick={submitPower}
          componentSize={ComponentSizeENUM.medium}
          font={TypographyENUM.lkSansBold}
          text={localeData.CONTINUE_CAPITALIZE}
          width={deviceType === DeviceTypes.MOBILE ? 100 : 50}
          disabled={!uploadImage.imageUrl || maxfilesreached || error}
          theme={ThemeENUM.newSecondary}
        />
      </BottomSheet>
    </>
  );
};

export default UploadPrescription;
