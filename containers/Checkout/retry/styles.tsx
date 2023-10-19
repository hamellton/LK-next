import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #fbf9f7;
`;

export const IconContainer = styled.div`
  text-align: center;
  svg {
    height: 48px;
    width: 48px;
  }
`;

export const BottomButtonContainer = styled.div`
  margin-bottom: 32px;
  padding-left: 16px;
  padding-right: 16px;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

export const FailureContentWrapper = styled.div`
  padding-top: 25%;
  padding-left: 31px;
  padding-right: 31px;
`;
export const FailureContentWrapperDesktop = styled.div`
  padding-top: 4%;
  padding-left: 31px;
  padding-right: 31px;
`;
export const FailureHeader = styled.div`
  font-weight: 400;
  font-size: 32px;
  line-height: 48px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #000042;
  font-family: ${TypographyENUM.lkSansRegular};
  padding-top: 20px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  @media screen and (max-width: 767px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

export const FailureSubHeader = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #000042;
  padding-top: 10px;
  @media screen and (max-width: 767px) {
    font-size: 12px;
    line-height: 18px;
  }
`;

export const FailureNote = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #333368;
  padding-top: 0px;
  max-width: 315px;
  margin-left: auto;
  margin-right: auto;
  @media screen and (max-width: 767px) {
    font-size: 12px;
    line-height: 18px;
    margin-top: 10px;
  }
`;
