import { Modal, Auth, Button, getNumberLengthFromCode } from "@lk/ui-library";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataType } from "@/types/coreTypes";
import { AppDispatch, RootState } from "@/redux/store";
import styled from "styled-components";
import { TypographyENUM } from "@/types/baseTypes";
import { validateCodOtp } from "@/redux/slices/paymentInfo";

export const ModalContent = styled.div<{ imp?: boolean }>`
  font-size: 16px;
  text-align: center;
  color: #445962;
  text-transform: none;
  text-transform: initial;
  margin: 0 auto;

  ${(props) => (props.imp ? "" : "margin-top: 30px;")};
`;

export const ImpSpacer = styled.div`
  height: 15px;
`;

export const Important = styled.div`
  color: #f21;
  font-size: 20px;
  text-align: center;
`;

export const Spacer = styled.div`
  height: 30px;
`;

export const ErrorMessage = styled.div`
  color: #e20202;
`;

export const TextFieldOuter = styled.div`
  margin-right: auto;
  max-width: 431px;
  margin-left: auto;
  @media screen and (max-width: 1200px) {
    margin-left: auto;
  }

  @media screen and (max-width: 1090px) {
    margin-left: auto;
  }
`;

interface OTPTypes {
  dataLocale: DataType;
  orderId: number | string;
  showOtpModal: boolean;
}

const OTP = ({ dataLocale, orderId, showOtpModal }: OTPTypes) => {
  const paymentData = useSelector((state: RootState) => state.paymentInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch<AppDispatch>();
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );

  // const [otpPopUp, setOtpPopUp] = useState(
  //   paymentData?.paymentDetails?.payment?.actionInfo.action === "DONE"
  //     ? true
  //     : false
  // );
  const [otpval, setOtpVal] = useState(null);
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const [showImpMessage, setShowImpMessage] = useState(false);
  const [otpModal, setOtpModal] = useState(showOtpModal);

  useEffect(() => {
    if (
      paymentData.validateCodOtpInfo.successData &&
      paymentData.validateCodOtpInfo.successData?.result === true
    ) {
      setShowImpMessage(true);
      setOtpModal(false);
    }
  }, [
    paymentData.validateCodOtpInfo.successData,
    paymentData.validateCodOtpInfo.successData?.result,
  ]);

  // useEffect(() => {
  //   if (otpval === null && clickedAut) {
  //     setOtpErrorMessage(
  //       "Please Enter OTP code SMS sent to your mobile number."
  //     );
  //   }
  // }, [otpval, clickedAut]);

  const clickHandler = () => {
    // console.log(otpval);
    // otpval === null
    //   ? setOtpErrorMessage(
    //       "Please Enter OTP code SMS sent to your mobile number."
    //     )
    //   : "";

    const payload = {
      otp: otpval,
      email: userInfo?.email,
    };

    if (otpval !== null) {
      // console.log("dispatched");
      dispatch(
        validateCodOtp({
          sessionId: userInfo.sessionId,
          orderId: orderId,
          email: payload.email,
          otp: payload.otp,
        })
      );
    }

    paymentData.validateCodOtpInfo.isError &&
    paymentData.validateCodOtpInfo.isError?.isError &&
    otpval !== null
      ? setOtpErrorMessage(paymentData.validateCodOtpInfo.isError?.message)
      : setOtpErrorMessage("");

    otpval === null &&
      setOtpErrorMessage(
        dataLocale?.PLEASE_ENTER_OTP_CODE_SMS_SENT_MESSAGE ||
          "Please Enter OTP code SMS sent to your mobile number."
      );
  };

  useEffect(() => {
    setOtpErrorMessage(paymentData.validateCodOtpInfo.isError?.message);
  }, [
    paymentData.validateCodOtpInfo.isError,
    paymentData.validateCodOtpInfo.isError?.isError,
    paymentData.validateCodOtpInfo.isError?.message,
  ]);

  const closeHandler = () => {
    setShowImpMessage(false);
    setOtpModal(false);
  };

  return (
    <>
      {!showImpMessage && otpModal && (
        <Modal
          show={otpModal}
          onHide={() => {
            setOtpModal(false);
            setShowImpMessage(true);
          }}
          bsSize={"lg"}
          keyboard
          dialogCss={`
          max-width: 980px;
          width: 100%;
        .modal-header{
          background-color: "#f4f4f4";
        }
        // .modal-content{
        //   height: 58vh;
        // }
      `}
        >
          <Modal.Header
            closeButton={true}
            onHide={() => setOtpModal(false)}
            voucherModal={true}
            isRTL={pageInfo.isRTL}
          />
          <Modal.Body height="50vh">
            <ModalContent>
              {dataLocale?.ENTER_OTP_CODE_TO_CONFIRM_YOUR_ORDER ||
                "Enter OTP Code to confirm your Order."}
            </ModalContent>
            <Spacer />
            <TextFieldOuter>
              <Auth.InputFieldContainer isFullWidth={false}>
                <Auth.TextField
                  isRTL={pageInfo?.isRTL}
                  value={
                    paymentData?.shippingAddress?.customer?.address?.phone ||
                    userInfo?.mobileNumber
                  }
                  type="text"
                  onChange={() => null}
                  placeholder={dataLocale?.MOBILE}
                  name="phoneNumber"
                  maxLength={getNumberLengthFromCode(countryCode)}
                >
                  {countryCode}
                </Auth.TextField>
              </Auth.InputFieldContainer>

              <Auth.InputFieldContainer isFullWidth={false}>
                <Auth.TextField
                  isRTL={pageInfo?.isRTL}
                  value={otpval}
                  type="text"
                  onChange={(e: any) => {
                    setOtpVal(e.target.value);
                  }}
                  placeholder={
                    dataLocale?.PLEASE_ENTER_OTP || "Please enter OTP"
                  }
                  name="otp"
                  maxLength={6}
                ></Auth.TextField>
              </Auth.InputFieldContainer>
              <ErrorMessage>{otpErrorMessage}</ErrorMessage>
            </TextFieldOuter>

            <Button
              style={{
                background: "#1cbbb4",
                padding: "15px 30px 11px",
                borderRadius: "5px",
                fontSize: "16px",
                boxShadow: "0 3px 0 #19a8a2",
                margin: "20px auto auto",
                color: "#fff",
                textDecoration: "none",
                borderColor: "transparent",
                width: "30%",
                textTransform: "uppercase",
                marginBottom: "30px",
              }}
              font={TypographyENUM.lkSansBold}
              width="100"
              text={dataLocale?.AUTHENTICATE || "Authenticate"}
              onClick={clickHandler}
            />
          </Modal.Body>
        </Modal>
      )}

      {showImpMessage && (
        <Modal
          show={showImpMessage}
          onHide={() => {
            setShowImpMessage(false);
            setOtpModal(false);
          }}
          bsSize={"lg"}
          keyboard
          dialogCss={`
          max-width: 980px;
          width: 100%;
        .modal-header{
          font-size: 20px;
        }
        .modal-content{
          height: 28vh;
        }
      `}
        >
          <Modal.Header
            closeButton={true}
            onHide={() => setShowImpMessage(false)}
            voucherModal={true}
            isRTL={pageInfo.isRTL}
          >
            {dataLocale?.THANK_YOU_FOR_PLACING_AN_ORDER_WITH_US ||
              "Thank You for placing an order with us."}
          </Modal.Header>
          <Modal.Body height="50vh">
            <Important>{dataLocale?.IMPORTANT || "Important:"}</Important>
            <ImpSpacer />
            <ModalContent imp={true}>
              {dataLocale?.IMPORTANT_MESSAGE_AFTER_OTP ||
                "You will receive an automated call shortly for order confirmation, Please press 1 to confirm your order."}
            </ModalContent>
            <ImpSpacer />

            <Button
              style={{
                background: "#329c92",
                color: "#fff",
                border: "none",
                padding: "7px 25px",
                width: "20%",
                margin: "0 auto",
                borderRadius: "0",
              }}
              font={TypographyENUM.lkSansBold}
              width="100"
              text={dataLocale?.OK_GOT_IT || "Okay, Got it"}
              onClick={closeHandler}
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default OTP;
