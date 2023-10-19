import styled from "styled-components";

export const ConfirmDetailRoot = styled.div`
  margin-top: 20px;
  background: #fff;
`;

export const ConfirmDetailHeader = styled.div`
  border-bottom: 1px solid #eaeff4;
  line-height: 16px;
  font-size: 14px;
  text-transform: capitalize;
  padding: 15px;
  font-weight: 500;
`;

export const ExchangeBtnWrapper = styled.div`
  position: fixed;
  left: 10px;
  right: 10px;
  bottom: 0;
  margin: auto -10px;
  padding: 10px;
  border: 1px solid #eaeff4;
  background: #fff;
  font-weight: var(--fw-bold);
  button[disabled] {
    background-color: #ccc;
    pointer-events: none;
    border: 1px solid #ccc;
  }
  button {
    text-transform: uppercase;
  }
`;

export const SourceInfo = styled.div`
  border-bottom: 1px solid #eaeff4;
  border-top: 1px solid #eaeff4;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SourceText = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const SourceQues = styled.div`
  font-size: 12px;
  color: #999999;
`;

export const StoreContainer = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eaeff4;
`;

export const StoreContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  letter-spacing: 0.25px;
`;

export const StoreContainerHeaderLeft = styled.div`
  font-size: 12px;
  color: #999999;
`;

export const StoreContainerHeaderRight = styled.div`
  font-size: 12px;
  color: #18cfa8;
  font-weight: 500;
  cursor: pointer;
`;

export const ExchangeInfo = styled.div`
  padding: 10px 15px;
`;

export const FlexBox = styled.div`
  display: flex;
  padding-top: 4px;
`;

export const ExchangeInfoPara = styled.span`
  font-size: 14px;
  margin-left: 8px;
  margin-top: 4px;
  color: #666666;
`;

export const Img = styled.img``;
