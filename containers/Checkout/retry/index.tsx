import { DataType, TypographyENUM } from "@/types/coreTypes";
import { Button } from "@lk/ui-library";
import { Icons } from "@lk/ui-library";
import {
  BottomButtonContainer,
  FailureContentWrapper,
  FailureHeader,
  FailureNote,
  FailureSubHeader,
  PageWrapper,
  IconContainer,
  FailureContentWrapperDesktop,
} from "./styles";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RetryType } from "./Retry.types";
import { DeviceTypes } from "@/types/baseTypes";
import { ButtonContent } from "pageStyles/CartStyles";
import { RightIconWrapper } from "containers/Payment/components/PaymentSummary";
import { useEffect } from "react";
import sessionStorageHelper from "helpers/sessionStorageHelper";

const Retry = ({ oid, eid, localeData, isRTL = false }: RetryType) => {
  const router = useRouter();
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  useEffect(() => {
    sessionStorageHelper.removeItem("isContactLensCheckboxChecked");
  }, []);
  const mobileContainer = (
    <PageWrapper>
      <FailureContentWrapper>
        <IconContainer>
          <Icons.PaymentFailure />
        </IconContainer>
        <FailureHeader>{localeData?.PAYMENT_UNSUCCESSFUL}</FailureHeader>
        <FailureSubHeader>{localeData?.DONT_MISS_INVENTORY}</FailureSubHeader>

        <FailureNote>{localeData?.UNSUCCESSFUL_DESCRIPTION}</FailureNote>
      </FailureContentWrapper>
      <BottomButtonContainer>
        <Button
          style={{
            paddingTop: "7px",
            paddingBottom: "7px",
            height: 46,
          }}
          font={TypographyENUM.lkSansBold}
          width="100"
          text={localeData?.REVIEW_ORDER_AND_RETRY_PAYMENT}
          showChildren={true}
          onClick={() =>
            router.push(`/payment?oid=${oid || ""}&eid=${eid || ""}`)
          }
        >
          <ButtonContent styledFont={TypographyENUM.lkSansBold}>
            {localeData.REVIEW_ORDER_AND_RETRY_PAYMENT}{" "}
            <RightIconWrapper isRTL={isRTL}>
              <Icons.IconRight />
            </RightIconWrapper>
          </ButtonContent>
        </Button>
      </BottomButtonContainer>
    </PageWrapper>
  );
  const desktopContainer = (
    <PageWrapper>
      <FailureContentWrapperDesktop>
        <IconContainer>
          <Icons.PaymentFailure />
        </IconContainer>
        <FailureHeader>{localeData?.PAYMENT_UNSUCCESSFUL}</FailureHeader>
        <FailureSubHeader>{localeData?.DONT_MISS_INVENTORY}</FailureSubHeader>
        <Button
          style={{
            marginTop: "40px",
            marginBottom: "32px",
            paddingTop: "7px",
            paddingBottom: "7px",
            height: 46,
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "432px",
          }}
          font={TypographyENUM.lkSansBold}
          width="100"
          onClick={() =>
            router.push(`/payment?oid=${oid || ""}&eid=${eid || ""}`)
          }
          showChildren={true}
        >
          <ButtonContent styledFont={TypographyENUM.lkSansBold}>
            {localeData.REVIEW_ORDER_AND_RETRY_PAYMENT}{" "}
            <RightIconWrapper isRTL={isRTL}>
              <Icons.IconRight />
            </RightIconWrapper>
          </ButtonContent>
        </Button>
        <FailureNote>{localeData?.UNSUCCESSFUL_DESCRIPTION}</FailureNote>
      </FailureContentWrapperDesktop>
    </PageWrapper>
  );
  return pageInfo?.deviceType === DeviceTypes.DESKTOP
    ? desktopContainer
    : mobileContainer;
};

export default Retry;
