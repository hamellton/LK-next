import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Icons } from "@lk/ui-library";
import styled from "styled-components";
import { Button, Modal } from "@lk/ui-library";
import Link from "next/link";
import { ButtonContent } from "pageStyles/CartStyles";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { useRouter } from "next/router";
import { Auth } from "@lk/ui-library";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import OTP from "./OTP";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { deleteCookie } from "@/helpers/defaultHeaders";

const PaymentSummaryContainer = styled.div<{ isRTL: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  #payment-redirect-button {
    border: 1.5px solid #737397 !important;
    width: 100%;
    max-width: 500px;
    svg {
      transform: ${(props) => (props.isRTL ? "scaleX(-1)" : "")};
    }
  }
`;
const IconContainer = styled.div<{ success: boolean }>`
  margin-bottom: 10px;
  svg {
    height: ${(props) => (props.success ? "76px !important" : "40px")};
    width: ${(props) => (props.success ? "76px !important" : "40px")};
  }
`;
const PaymentHeading = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 48px;
  text-align: center;
  letter-spacing: -0.02em;
  color: var(--dark-blue-100);
  max-width: 550px;
`;
const SubHead = styled.div`
  margin-top: 8px;
  padding: 0 0 20px;
  font-family: ${TypographyENUM.lkSansRegular};
  color: var(--dark-blue-100);
`;
const MainInfo = styled.p`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: -0.02em;
  color: var(--text);
  padding: 30px 50px;
  margin: 0;
`;
const PrescriptionSection = styled.div`
  margin-bottom: 20px;
`;
const EnterPrescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px 16px;
  width: 500px;
  left: 506px;
  background: var(--white);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  margin-bottom: 20px;
`;
const WhatsNext = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
`;
const BoxHead = styled.h3`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: var(--dark-blue-100);
  width: 296px;
`;
const BoxMainText = styled.div`
  p {
    width: 296px;
    font-family: ${TypographyENUM.lkSansRegular};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: var(--text);
    letter-spacing: -0.02em;
  }
  /* padding-bottom: 16px; */
  /* margin-bottom: 14px; */
  /* border-style: dashed; */
  /* border-color: #d3d3d3; */
  /* border-width: 0 0 1px 0; */
`;

const StoreBookingContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px 16px;
  width: 500px;
  left: 506px;
  background: var(--white);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  margin-bottom: 8px;
`;

const StoreBookingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

export const RightArrowOuter = styled.div<{ isRTL: boolean }>`
  height: 26px;
  width: 38px;
  border-radius: 40px;
  border: 1px solid grey;
  padding-top: 4px;
  text-align: center;
  transform: ${(props) => (props.isRTL ? "scaleX(-1)" : "")};
`;

export const BoxOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`;

export const ViewOrder = styled.span`
  font-family: ${TypographyENUM.lkSansBold};
  text-decoration: underline;
  color: var(--text);
  cursor: pointer;
`;

export const PaymentDeductionText = styled.div`
  margin-top: 32px;
  padding: 0 30px;
  font-family: ${TypographyENUM.lkSansRegular};
  color: var(--text);
  font-size: 14px;
  text-align: center;
  line-height: 20px;
  letter-spacing: 0.4px;
`;

export const RightIconWrapper = styled.div<{ isRTL?: boolean }>`
  transform: ${(props) => (props.isRTL ? "rotate(180deg)" : "")};
  display: flex;
  svg {
    width: 8px;
    path {
      stroke: #000;
    }
  }
`;

interface PaymentSummaryType {
  success: boolean;
  heading: string;
  headingL2?: string;
  subhead?: string;
  mainInfo: string;
  children?: ReactNode;
  orderList?: any;
  orderId?: string;
  VIEW_ORDER?: string;
  isRTL?: boolean;
  dataLocale: DataType;
  configData?: DataType;
  orderData?: any;
  sessionId: string;
}
const PaymentSummary = ({
  success,
  heading,
  headingL2,
  subhead,
  mainInfo,
  children,
  orderList,
  orderId,
  dataLocale,
  configData,
  orderData,
  sessionId,
}: PaymentSummaryType) => {
  const studioStoreCode = orderData?.studioStoreDetails?.code;
  const isStudioFlow = orderData?.studioFlow || false;
  const router = useRouter();
  const navigateToCheckout = (e: any) => {
    e.preventDefault();
    router.push(`/`);
  };

  const paymentData = useSelector((state: RootState) => state.paymentInfo);
  const [step, setStep] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { isRTL } = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [otpPopUp, setOtpPopUp] = useState(
    paymentData?.paymentDetails?.payment?.actionInfo.action === "DONE"
      ? true
      : false
  );

  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const { confirmOrderSuccess } = useSelector(
    (state: RootState) => state.myOrderInfo
  );

  let powerRequired = false;
  powerRequired = orderList?.some((item: any) => {
    if (item?.powerRequired === "POWER_REQUIRED") return true;
    else return false;
  });

  let powerNotRequired = false;
  powerNotRequired = orderList?.some((item: any) => {
    if (item?.powerRequired === "POWER_NOT_REQUIRED") return true;
    else return false;
  });

  let contactLensType = false;
  contactLensType = orderList?.some((item: any) => {
    if (item?.lensType === "CONTACT_LENS") return true;
    else return false;
  });
  // console.log(orderList, "item?.powerRequired......", contactLensType);

  const showOtpPopUp =
    paymentData?.paymentDetails?.payment?.actionInfo.action === "DONE" &&
    orderId &&
    configData?.ACTIVATE_COD_OTP_OPTION;
  // @TODO need to check this logic
  // powerNotRequired;
  // (powerNotRequired || contactLensType);
  useEffect(() => {
    sessionStorageHelper.removeItem("isContactLensCheckboxChecked");
    timerRef.current = setInterval(() => {
      setStep((step) => {
        if (step === 3) {
          clearInterval(timerRef.current);
          return step;
        } else if (success) return step + 1;
        else return 3;
      });
    }, 2000);
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);
  useEffect(() => {
    setOtpPopUp(
      !orderList?.some(
        (item: any) =>
          item?.powerRequired === "POWER_REQUIRED" &&
          item?.lensType !== "CONTACT_LENS"
      )
    );
  }, [orderList]);

  const redirectURL = process.env.NEXT_PUBLIC_BASE_ROUTE === 'NA' ? '/' : `/${process.env.NEXT_PUBLIC_BASE_ROUTE}/`

  return step === 3 ? (
    <PaymentSummaryContainer isRTL={isRTL} id="payment-summary">
      {
        <>
          {showOtpPopUp &&
            !confirmOrderSuccess?.isSuccess &&
            orderData?.otpState === "OTP_SENT" && (
              <OTP
                dataLocale={dataLocale}
                orderId={orderId}
                showOtpModal={otpPopUp}
              />
            )}
          <IconContainer success={success}>
            {success ? <Icons.PaymentSuccess /> : <Icons.PaymentFailure />}
          </IconContainer>
          <PaymentHeading>{heading}</PaymentHeading>
          {headingL2 && <PaymentHeading>{headingL2}</PaymentHeading>}
          {subhead && <SubHead>{subhead}</SubHead>}
          {success && (
            <MainInfo>
              {mainInfo}
              {userInfo.isLogin && (
                <ViewOrder
                  onClick={() =>
                    (window.location.href = orderId
                      ? `${redirectURL}customer/account/order-detail/${orderId}/`
                      : `${redirectURL}customer/account`)
                  }
                >
                  {dataLocale.VIEW_ORDER_POST}
                </ViewOrder>
              )}
            </MainInfo>
          )}

          {!isStudioFlow && success && (
            <PrescriptionSection>
              {powerRequired && (
                <>
                  <EnterPrescriptionBox>
                    <WhatsNext>
                      <BoxHead>{dataLocale.WHATS_NEXT_POST}</BoxHead>
                      {/* <Icons.Cross /> */}
                    </WhatsNext>
                    <BoxMainText>
                      <p>{dataLocale.REQUIRE_PRESCRIPTION_POST}</p>
                    </BoxMainText>
                    {/* <WhatsNext>
                <BoxOuter
                  onClick={() => router.push("/checkout/submitprescription")}
                >
                  <BoxHead>Submit prescription now</BoxHead>

                  <RightArrowOuter isRTL={isRTL}>
                    <Icons.RightArrow />
                  </RightArrowOuter>
                </BoxOuter>
              </WhatsNext> */}
                  </EnterPrescriptionBox>
                  <Button
                    id="prescription-redirect-button"
                    showChildren={true}
                    width="100"
                    font={TypographyENUM.lkSansBold}
                    onClick={() => router.push("/checkout/submitprescription")}
                    hoverShadow={true}
                    isRTL={isRTL}
                  >
                    {/* <Link href="/" passHref> */}
                    <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                      {dataLocale.SUBMIT_PRESCRIPTION_NOW_POST}{" "}
                      <RightIconWrapper isRTL={isRTL}>
                        <Icons.IconRight />
                      </RightIconWrapper>
                    </ButtonContent>
                    {/* </Link> */}
                  </Button>
                </>
              )}
            </PrescriptionSection>
          )}
          {/* studio flow order booking  */}
          {isStudioFlow && (
            <StoreBookingWrapper>
              <StoreBookingContainer>
                <WhatsNext>
                  <BoxHead>{dataLocale.WHATS_NEXT_POST}</BoxHead>
                </WhatsNext>
                <BoxMainText>
                  <p>{dataLocale?.BOOK_APPOINTMENT_POST}</p>
                </BoxMainText>
              </StoreBookingContainer>
              <Button
                id="prescription-redirect-button"
                showChildren={true}
                width="100"
                font={TypographyENUM.lkSansBold}
                // onClick={() => setShowBookAppointment(true)}
                onClick={() =>
                  router.push(
                    `/studio/bookappointment?orderId=${orderId}&store=${studioStoreCode}`
                  )
                }
                hoverShadow={true}
                isRTL={isRTL}
              >
                <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                  {dataLocale?.BOOK_APPOINTMENT_NOW || "Book Appointment Now"}{" "}
                  <RightIconWrapper isRTL={isRTL}>
                    <Icons.IconRight />
                  </RightIconWrapper>
                </ButtonContent>
              </Button>
            </StoreBookingWrapper>
          )}

          <Button
            id="payment-redirect-button"
            showChildren={true}
            width={isRTL ? "100" : "83"}
            font={TypographyENUM.lkSansBold}
            onClick={(e: any) => {
              if (success || !userInfo.isLogin) navigateToCheckout(e);
              else {
                router.push(
                  orderId
                    ? `${redirectURL}customer/account/order-detail/${orderId}/`
                    : `${redirectURL}customer/account`
                );
              }
            }}
            hoverShadow={true}
            isRTL={isRTL}
            kind={powerRequired ? "border" : "background"}
          >
            {/* <Link href="/" passHref> */}
            <ButtonContent styledFont={TypographyENUM.lkSansBold}>
              {success || !userInfo.isLogin
                ? dataLocale.CONTINUE_SHOPPING
                : dataLocale.REVIEW_AND_RETRY_PAYMENT}{" "}
              {!powerRequired && (
                <RightIconWrapper isRTL={isRTL}>
                  <Icons.IconRight />
                </RightIconWrapper>
              )}
            </ButtonContent>
            {/* </Link> */}
          </Button>
          {!success && (
            <PaymentDeductionText>
              <div>{dataLocale.IN_CASE_A_PAYMENT_WAS_DEDUCTED}</div>
              <div>{dataLocale.IT_WILL_BE_CREDITED_BACK}</div>
            </PaymentDeductionText>
          )}
        </>
      }
    </PaymentSummaryContainer>
  ) : step === 2 ? (
    <div
      style={{
        width: "100%",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Auth.AnimatedCheck />
    </div>
  ) : (
    <div>
      <Auth.CircleLoader time={2} dataLocale={dataLocale} />
    </div>
  );
};

export default PaymentSummary;
