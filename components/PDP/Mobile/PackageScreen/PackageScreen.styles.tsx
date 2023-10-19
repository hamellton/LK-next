import { TypographyENUM } from "@/types/coreTypes";
import styled from "styled-components";

export const PackageScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const PackageScreenCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  margin: 8px 16px;
  flex-grow: 1;
  ::-webkit-scrollbar {
    width: 0px;
    background: none;
  }
  ::-webkit-scrollbar-track {
    width: 0;
    background: none;
  }
`;
export const PackageScreenFooter = styled.div`
  position: relative;
  bottom: 0;
  left: 0;
  background-color: var(--white);
  width: 100%;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.16);
  border-radius: 12px 12px 0px 0px;
  padding: 17px 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;
export const BuyNowCTA = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-radius: 100px;
  border: none;
  background: ${(props) => (props.disabled ? "#dbdbea" : "#11daac")};
  width: 100%;
  font-family: "LKSans-Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: ${(props) => (props.disabled ? "#737397" : "#000042")};
  span {
    img {
      opacity: ${(props) => (props.disabled ? "0.4" : "1")};
    }
  }
`;
export const BuyNowText = styled.div``;

export const BuyNowAction = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
export const PackageScreenHeader = styled.div`
  padding: 20px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NeedHelpText = styled.a`
  font-family: "LKSans-Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: #000042;
  text-decoration: underline;
`;
export const BackButton = styled.div`
  padding: 10px 9px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 100px;
  border: none;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
  svg {
    width: 27px;
  }
`;

export const BottomRow = styled.div<{ font?: TypographyENUM }>`
  font-family: lenskartserif-normal;
  font-style: normal;
  font-weight: 400;
  font-size: 21px;
  line-height: 30px;
  letter-spacing: -0.02em;
  color: #000042;
`;

export const VideoModalWrapper = styled.div`
  padding: 20px 0;
`;

export const PackageErrorMessage = styled.div`
  margin: 20px;
  background-color: var(--white);
  padding: 20px;
  border-radius: 10px;
  font-family: var(--font-lksans-regular);
  color: #000042;
`;

export const WhatAppIcon = styled.span`
  margin-right: 5px;
  margin-left: 5px;

  img {
    margin-bottom: -3px;
  }
`;
