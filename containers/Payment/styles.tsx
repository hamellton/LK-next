import { TypographyENUM } from "@/types/coreTypes";
import styled from "styled-components";

export const PaymentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0px 90px 0px;
  width: 62%;
  position: relative;
`;

export const PaymentWrapperMobile = styled.div<{ isPrimerActive: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0px var(--pd-16) var(--pd-110);
  position: relative;
  padding-bottom: ${({ isPrimerActive }) =>
    isPrimerActive ? "235px" : "100px"};

  i {
    font-style: normal;
  }
`;

export const RetryBillContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 12px rgb(0 0 66 / 6%);
  border-radius: 12px;
  padding: 16px 16px 16px !important;
  font-family: ${TypographyENUM.lkSansRegular};

  @media screen and (max-width: 767px) {
    margin-top: 20px;
  }

  & > div {
    border-bottom: 2px dashed #e2e2ee;
    padding-top: var(--fs-16);
    padding-bottom: var(--fs-16);
    & > div {
      padding-bottom: var(--fs-16);
    }
    & > div:last-child {
      /* padding-top: var(--fs-16); */
      padding-bottom: 0;
    }
  }
  & > div:first-child {
    padding-top: unset;
  }
  & > div:last-child {
    border-bottom: none;
    padding-bottom: unset;
  }
`;

export const BillLabel = styled.span<{
  fontSize?: string;
  color?: string;
  lineHeight?: string;
}>`
  color: ${(props) => (props.color ? props.color : "#333368")};
  font-weight: 400;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "18px")};
  margin-right: 0;
`;

export const BillLabelSubHead = styled.span`
  font-family: ${TypographyENUM.lkSansBold};
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: #333368;
`;

export const BillFinal = styled.span<{
  fontSize?: string;
  color?: string;
  lineHeight?: string;
}>`
  font-family: ${TypographyENUM.lkSansBold};
  font-weight: 700;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "14px")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "20px")};
  letter-spacing: -0.02em;
  color: ${(props) => (props.color ? props.color : "#333368")};
  text-transform: capitalize;
`;

export const BillPrice = styled.span<{
  fontSize?: string;
  color?: string;
  lineHeight?: string;
}>`
  color: ${(props) => (props.color ? props.color : "#333368")};
  font-weight: 700;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "18px")};
  margin-right: 0;
  font-family: ${TypographyENUM.lkSansBold};
`;

export const JustifySpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const BillPriceGreen = styled.span<{
  fontSize?: string;
  color?: string;
  lineHeight?: string;
}>`
  font-weight: 700;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "18px")};
  text-align: right;
  letter-spacing: -0.02em;
  color: ${(props) => (props.color ? props.color : "#0fbd95")};
  font-family: ${TypographyENUM.lkSansBold};
`;

export const FragmentMarginTop = styled.div`
  margin-top: 24px;
`;

export const PowerCheckout = styled.label<{ margin: string }>`
  background: #f7f1de;
  border: 1px solid #ffe092;
  border-radius: 4px;
  padding: 16px;
  margin-top: ${(props) => props.margin};
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: #000042;
  display: flex;
  align-items: center;
  font-family: ${TypographyENUM.lkSansBold};
  svg {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    path {
      stroke: #000042;
    }

    @media screen and (max-width: 500px) {
      width: 40px;
      height: 40px;
    }
  }
`;
