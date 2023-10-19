import { TypographyENUM } from "@/types/coreTypes";
import styled from "styled-components";

const Spacer = styled.div`
  height: 16px;
  width: 100%;
  display: flex;
`;
const MainHeading = styled.h1`
  font-family: "LKSerif-Normal";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
  color: #000042;
  /* margin-bottom: 32px; */
`;
const PaymentGroupHeading = styled.h2`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #000042;
  margin-top: 24px;
  margin-bottom: 16px;
`;
const HiddenForm = styled.div`
  display: none;
`;

const PresButtonWrapper = styled.div`
  //   margin-top: 50px;
  width: 400px;
  margin: 50px auto;
  button {
    margin: 0 auto;
  }
`;
const TotalSubtitle = styled.div`
  position: absolute;
  bottom: 20px;
  left: 16px;
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: #000042;
`;

const IconWrapper = styled.div<{ isRTL: boolean }>`
  ${(props) => props.isRTL && "transform: rotateY(180deg)"};
`;

export {
  Spacer,
  MainHeading,
  PaymentGroupHeading,
  HiddenForm,
  PresButtonWrapper,
  TotalSubtitle,
  IconWrapper,
};
