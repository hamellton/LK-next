import styled from "styled-components";

export const JusCheckout = styled.div<{
  isPrimerActive?: boolean;
  isRetry?: boolean;
}>`
  // flex-direction: column;
  // align-items: center;
  // display: flex;
  padding: ${({ isPrimerActive, isRetry }) =>
    isPrimerActive || isRetry ? "0" : "20px 0"};
`;

export const PaymentContent = styled.div`
  margin-bottom: 10px;
  p {
    color: #333;
    font-size: 13px;
    letter-spacing: 1px;
    margin: 3px 0;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DesktopButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
`;

export const W100 = styled.div`
  width: 100%;
  display: flex;
  #juspay-button {
    padding: 15px 20px;
    min-width: 200px;
    span {
      display: flex;
      svg {
        width: 8px;
        path {
          stroke: #000042;
        }
      }
    }
  }
`;
