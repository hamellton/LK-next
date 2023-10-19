import { DeviceTypes } from "@/types/baseTypes";
import styled from "styled-components";

export const ModalWrapper = styled.div`
  .modal {
    width: 798px;
    overflow: hidden;
    margin: auto;
    margin-top: 1.5rem;
  }
`;

export const AuthWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const BtnClose = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--blashish-gray);
  font-size: var(--fs-14);
`;

//----------Exchange styles -------------------//

export const ExchangeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 16px 24px;
  // border-bottom: 1px solid rgba(0, 0, 0, .12);
`;
export const ExchangeMainContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const ExchangeHead = styled.div<{ deviceType?: string }>`
  font-weight: 500;
  font-size: ${(props) =>
    props.deviceType === DeviceTypes.DESKTOP ? "20px" : "14px"};
`;
export const ExchangeText = styled.div`
  color: rgba(60, 60, 60, 0.54);
  font-size: 14px;
`;
export const ExchangeIconContainer = styled.div<{ deviceType?: string }>`
  margin-right: 20px;
  cursor: pointer;
  background-color: ${(props) =>
    props.deviceType === DeviceTypes.MOBILE ? "#18cfa8" : ""};
  border-radius: ${(props) =>
    props.deviceType === DeviceTypes.MOBILE ? "50%" : ""};
  color: ${(props) =>
    props.deviceType === DeviceTypes.MOBILE ? "var(--white)" : ""};
`;
export const HeaderWrapper = styled.div<{
  deviceType?: string;
  isTopBarActive?: boolean;
  topLinks: boolean;
}>`
  display: ${(props) =>
    props.deviceType === DeviceTypes.MOBILE ? "inline-flex" : ""};
  flex-direction: ${(props) =>
    props.deviceType === DeviceTypes.MOBILE ? "column" : ""};
  width: ${(props) => (props.deviceType === DeviceTypes.MOBILE ? "100%" : "")};
  padding-top: ${(props) =>
    props.deviceType === DeviceTypes.MOBILE ? "49px" : ""};
  height: ${(props) =>
    props.deviceType === DeviceTypes.MOBILE
      ? ""
      : props.isTopBarActive
      ? "146px"
      : props.topLinks
      ? "155px"
      : "118px"};
`;

export const DividerLine = styled.hr<{ isExchangeFlow: boolean }>`
  border: none;
  height: 1px;
  margin-bottom: ${(props) => (props.isExchangeFlow ? "16px" : "")};
  -ms-flex-negative: 0;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.12);
`;
