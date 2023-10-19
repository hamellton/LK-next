import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const PaymentModuleWrapper = styled.div`
  width: 50%;
  margin: auto;
`;
export const TermConditionWrapper = styled.div<{ styledFont: TypographyENUM }>`
  display: flex;
  border-bottom: 1px solid #ebebeb;
  margin-bottom: 20px;
  margin-top: 10px;
  padding-bottom: 20px;
  justify-content: flex-end;
  font-family: ${(props) => props.styledFont};
  font-size: 13px;
  gap: 5px;
`;

export const LinkText = styled.a``;

export const Paragraph = styled.p<{ styledFont: TypographyENUM }>`
  margin: 0;
  font-family: ${(props) => props.styledFont};
  font-size: var(--fs-13);
`;
export const LenskartAssuranceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ImageStrip = styled.div`
  width: 100%;
`;

export const CancellationPolicy = styled.span<{ styledFont: TypographyENUM }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: ${(props) => props.styledFont};
  font-size: 13px;
`;

export const Text = styled.span<{ styledFont: TypographyENUM }>`
  font-family: ${(props) => props.styledFont};
  font-size: 20px;
`;

export const PlaceOrderButton = styled.button`
  color: var(--white);
  background: var(--irish-blue);
  font-size: var(--fs-14);
  display: block;
  border: none;
  padding: var(--pd-12) var(--pd-20);
  letter-spacing: 2px;
  border-radius: var(--border-radius-xxxs);
  min-width: 223px;
  font-weight: var(--fw-bold);
  margin: var(--pd-20) 0;
  text-transform: var(--uppercase);
`;

export const FullScreenWrapper = styled.div<{ show: boolean }>`
  position: fixed;
  z-index: 106;
  inset: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.3s ease opacity;
  display: ${({ show }) => (show ? "flex" : "none")};
  opacity: ${({ show }) => (show ? "1" : "0")};
`;

export const QRCodePaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;
`;
export const QrCodePageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #363636;
  padding: 3px 0;
  width: 100%;
  margin-bottom: 10px;
  img {
    height: 34px;
    cursor: pointer;
  }
`;

export const QRCodeErrorContainer = styled.div`
  text-align: center;
  padding: 10px;
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
  width: 40%;
`;
