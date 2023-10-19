import { TypographyENUM } from "@/types/coreTypes";
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Icons, Button } from "@lk/ui-library";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { BottomSheet, FloatingLabelInput } from "@lk/ui-library";
import { kindENUM, ThemeENUM } from "@/types/baseTypes";

export const HeaderSection = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: row;
  align-items: center;
`;

export const CaptchaSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 30px;

  a {
    font-family: "LenskartSans-Regular";
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: -0.02em;
    text-decoration-line: underline;
    text-transform: capitalize;
    color: #000042;
  }
`;

export const ErrorMessage = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: var(--fw-regular);
  font-size: var(--fs-12);
  line-height: var(--fs-20);
  letter-spacing: -0.02em;
  color: #e34934;
`;

export const Margin = styled.div`
  margin-bottom: 20px;
`;

export const Captcha = styled.img`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 16px;
  width: 50%;
  height: 56px;
  background: #ffffff;
  border: 1px solid #cecedf;
  border-radius: 8px;
`;

export const CODBottomSheet = styled.div`
  padding: 16px;
  h2 {
    font-family: "LenskartSans-Regular";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: #000042;
    margin-bottom: 25px;
  }
`;

export const Image = styled.img`
  width: 46px;
  height: 32px;
`;

export const Header = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  ont-weight: 700;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: #333368;
`;

export const SubHeading = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #66668e;
`;

export const AccordianOne = styled.div<{ selected?: boolean }>`
  padding: 16px;
  gap: 16px;
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 25px;

  ${(props) =>
    props.selected &&
    css`
      background-color: #f5f5ff;
      border: 1px solid #000042;
    `}

  ${(props) =>
    !props.selected &&
    css`
      background-color: white;
      border: none;
    `}
`;

export const AccordianTwo = styled.div<{ selected?: boolean }>`
  padding: 16px;
  gap: 16px;
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 25px;

  ${(props) =>
    props.selected &&
    css`
      background-color: #f5f5ff;
      border: 1px solid #000042;
    `}

  ${(props) =>
    !props.selected &&
    css`
      background-color: white;
      border: none;
    `}
`;

export const AccordianBody = styled.div`
  height: 20%;
  transition: all 2s;
  transition: all 0.5s ease-in-out;
`;

export const ButtonContent = styled.div``;

export const ArrowSection = styled.div`
  margin-left: auto;
  font-size: 16px;
`;

export const PaymentType = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #000042;
  margin-bottom: 15px;
`;

export const IconImage = styled.div<{ leftMargin?: boolean }>`
  width: 40px;
  height: 28px;
  border: 1px solid #454545;
  padding: 5px;
  ${(props) => (props.leftMargin ? "" : "margin-top: 6px;")};
  border-radius: 5px;
  opacity: 0.7;
  background: white;

  ${(props) => (props.leftMargin ? "margin-left: 16px;" : "")};

  svg {
    width: 100%;
  }
`;

export const SubSection = styled.div``;

const Accordion = ({
  firstHeading,
  firstSubHeading,
  firstImgURL,
  firstButtonText,
  secondHeading,
  secondSubHeading,
  secondImgURL,
  secondButtonText,
  juspaySubmitHandler,
  totalAmount,
  hideAllExceptGv,
  configData,
  isCartEmpty,
  paymentData,
  loadCaptcha,
  localeData,
  captchaImageUrl,
  captchaValue,
  getSubmitFunction,
  userInfo,
  cartData,
  orderData,
  isRetry,
}: any) => {
  const [selectedPart, setSelectedPart] = useState(null);

  const onSubmit = () => getSubmitFunction("cod")("cod");

  const handlePartClick = (part: any) => {
    if (selectedPart === part) {
      setSelectedPart(null);
    } else {
      setSelectedPart(part);
    }
  };

  const submitHandler = (e: any) => {
    if (isCaptchaEnabled && userCaptcha === captchaValue) {
      // console.log("true");
      setError(false);
      // codSubmitHandler("cod");

      // console.log(e, "e value.....");
      onSubmit();
    } else setError(true);
  };

  function openCODHandler() {
    setOpenCOD(!openCOD);
  }

  const [openCOD, setOpenCOD] = useState(false);
  const [error, setError] = useState(false);
  const [userCaptcha, setUserCaptcha] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const isCaptchaEnabled = true;

  useEffect(() => {
    if (typeof loadCaptcha === "function" && openCOD && isCaptchaEnabled)
      loadCaptcha();
  }, [openCOD, loadCaptcha, isCaptchaEnabled]);

  function handleErrorCaptcha(e: string) {
    if (e.trim() === "") {
      setErrorMessage("This is required");
      setError(true);
    } else {
      setErrorMessage("");
      setError(false);
    }
  }

  const primerInfo = useSelector((state: RootState) => state.primerInfo);

  function debounce(callback: (...a: any) => any, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  const handlePayment = () => {
    // if (isContactLensConsentEnabled) {
    //   if (!isContactLensCheckboxChecked) return;
    // }

    if (!primerInfo.isPrimerActive && !primerInfo.isLoading)
      juspaySubmitHandler("juspay", "JUSPAY");
  };

  const handlePaymentWithDebounce = debounce(handlePayment, 1000);

  return (
    <div>
      {!hideAllExceptGv && configData.IS_JUSPAY_PAYMENT && (
        <>
          <PaymentType>{firstHeading}</PaymentType>
          <AccordianOne selected={selectedPart === 1 ? true : false}>
            <div onClick={() => handlePartClick(1)}>
              <HeaderSection>
                {/* <Image src={firstImgURL} alt="Part 1 Image" /> */}
                <IconImage>
                  <Icons.PayByCard />
                </IconImage>
                <SubSection>
                  <Header>{firstHeading}</Header>
                  <SubHeading>{firstSubHeading}</SubHeading>
                </SubSection>
                <ArrowSection>
                  {selectedPart === 1 ? <Icons.UpArrow /> : <Icons.DownArrow />}
                </ArrowSection>
              </HeaderSection>
            </div>
            {selectedPart === 1 && (
              <AccordianBody>
                <Button
                  style={{
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    height: 48,
                    marginTop: "20px",
                    marginBottom: "20px",
                    fontSize: "16px",
                    fontWeight: "700",
                    lineHeight: "24px",
                    letterSpacing: "-0.02em",
                    color: "#000042",
                  }}
                  font={TypographyENUM.lkSansBold}
                  width="100"
                  text={firstButtonText}
                  showChildren={true}
                  onClick={() => handlePaymentWithDebounce()}
                >
                  <ButtonContent>
                    {`${secondButtonText}
                ${totalAmount}`}
                  </ButtonContent>
                </Button>
              </AccordianBody>
            )}
          </AccordianOne>
        </>
      )}

      {openCOD && (
        <BottomSheet
          closebottomSheet={openCODHandler}
          show={openCOD}
          onBackdropClick={openCODHandler}
        >
          <CODBottomSheet>
            <h2>{localeData?.CASH_ON_DELIVERY}</h2>
            <CaptchaSection>
              <Captcha src={captchaImageUrl} />
              <a onClick={loadCaptcha}>{localeData?.CHANGE_IMAGE}</a>
            </CaptchaSection>
            <FloatingLabelInput
              hasError={error}
              hasErrorIcon={false}
              label={localeData?.ENTER_CODE_SHOWN_ABOVE}
              width="100%"
              font={TypographyENUM.lkSansRegular}
              type="text"
              getInputValue={setUserCaptcha}
              handleError={(e: any) => handleErrorCaptcha(e.target.value)}
              maxLength={10}
            ></FloatingLabelInput>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Margin></Margin>
            <Button
              id={localeData?.VERIFY_AND_PLACE_ORDER}
              text={localeData?.VERIFY_AND_PLACE_ORDER}
              theme={ThemeENUM.primary}
              kind={kindENUM.background}
              font={TypographyENUM.lkSansBold}
              width="100"
              // disabled={props.hasError}
              onClick={submitHandler}
            ></Button>
          </CODBottomSheet>
        </BottomSheet>
      )}

      {(!configData?.IS_JUSPAY_PAYMENT || configData?.SHOW_COD_OPTION) &&
        !isCartEmpty &&
        (!configData?.SUPPORT_MULTIPLE_COUNTRIES ||
          paymentData?.shippingAddress?.customer?.address?.country.toLowerCase() ===
            "ae" ||
          (cartData?.cartPopupError && !userInfo?.userDetails) ||
          orderData?.shippingAddress?.country.toUpperCase() === "AE") && (
          <>
            <PaymentType>{secondHeading}</PaymentType>
            <AccordianTwo selected={selectedPart === 2 ? true : false}>
              <div onClick={() => handlePartClick(2)}>
                <HeaderSection>
                  <Image src={secondImgURL} alt="cod" />
                  <SubSection>
                    <Header>{secondHeading}</Header>
                    <SubHeading>{secondSubHeading}</SubHeading>
                  </SubSection>
                  <ArrowSection>
                    {selectedPart === 2 ? (
                      <Icons.UpArrow />
                    ) : (
                      <Icons.DownArrow />
                    )}
                  </ArrowSection>
                </HeaderSection>
              </div>
              {selectedPart === 2 && (
                <AccordianBody>
                  <Button
                    style={{
                      paddingTop: "7px",
                      paddingBottom: "7px",
                      height: 48,
                      marginTop: "20px",
                      marginBottom: "20px",
                      fontSize: "16px",
                      fontWeight: "700",
                      lineHeight: "24px",
                      letterSpacing: "-0.02em",
                      color: "#000042",
                    }}
                    font={TypographyENUM.lkSansBold}
                    width="100"
                    text={secondButtonText}
                    showChildren={true}
                    onClick={openCODHandler}
                  >
                    <ButtonContent>
                      {`${secondButtonText}
                ${totalAmount}`}
                    </ButtonContent>
                  </Button>
                </AccordianBody>
              )}
            </AccordianTwo>
          </>
        )}
    </div>
  );
};

export default Accordion;
