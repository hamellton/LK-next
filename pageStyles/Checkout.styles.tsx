import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const CheckoutWrapper = styled.div<{ addressPage?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 20px 0px 15px;
  position: relative;
  #review-form {
    padding-left: 0px;
  }
  width: ${(props) => (props.addressPage ? "62%" : "66%")};
  & .paymentHead {
    position: sticky;
    padding-bottom: 25px;
  }
`;

export const PaymentSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding: 20px 0px 90px 0px;
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const Title = styled.span<{ styledFont: TypographyENUM }>`
  font-family: ${(props) => props.styledFont};
`;

export const AddNewAddressButton = styled.div`
  margin-bottom: 20px;
`;

////////////////////////////////-----------------------

export const Heading = styled.h1`
  font-family: ${TypographyENUM.lkSerifNormal}; //need to change to lkserif
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: var(--dark-blue-100);
  margin-bottom: 32px;
`;
export const SubHeading = styled.h2`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #333368;
  margin-bottom: 16px;
`;
