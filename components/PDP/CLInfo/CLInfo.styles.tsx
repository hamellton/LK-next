import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const ProductDetailsContainer = styled.div<{
  styleFont: TypographyENUM;
}>`
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  gap: var(--pd-10);
  padding: var(--pd-15) 0px;
  letter-spacing: 1px;
  font-family: ${(props) => props.styleFont};
`;

export const ProductDetailsHeader = styled.div<{ isRTL: boolean }>`
  display: flex;
  gap: var(--spacing-md);
  flex-direction: ${(props) => (props.isRTL ? "row-reverse" : "")};
  text-align: ${(props) => (props.isRTL ? "end" : "")};
`;

export const IconWrapper = styled.span<{ styleSelected: boolean }>`
  height: fit-content;
  font-size: ${(props) =>
    props.styleSelected ? "var(--fs-26)" : "var(--fs-14)"};
  .wishlist-icon {
    cursor: var(--pointer);
    stroke: ${(props) =>
      props.styleSelected ? "var(--wishlist)" : "inherited"};
    &:hover {
      stroke: var(--wishlist);
    }
  }
`;

export const PriceWrapper = styled.div`
  display: flex;
`;
export const InfoSection = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: column;
  justify-content: center;
  margin-left: 1%;
  font-size: var(--fs-16);
`;

export const OrderOnPhoneSection = styled.div`
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
  padding: 10px 0;
  text-align: center;
`;

export const OrderOnPhoneText = styled.div`
  font-weight: 900;
  font-size: 14px;
  text-transform: uppercase;
  font-family: ${TypographyENUM.defaultHeavy};
`;
export const PhoneNumberText = styled.div`
  font-size: 11px;
  text-transform: uppercase;
`;
export const ExchangeText = styled.div`
  font-weight: 500;
  color: #00bac6;
`;
export const CrossShellWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;
export const CrossShellImg = styled.img`
  width: 5%;
  display: block;
  color: #333;
  line-height: 20px;
  font-weight: 600;
  cursor: pointer;
`;
export const CrossShellText = styled.span`
  display: block;
  color: #333;
  line-height: 20px;
  font-weight: 600;
  cursor: pointer;
  padding-left: 10px;
  font-size: 14px;
  font-family: ${TypographyENUM.defaultHeavy};
`;
