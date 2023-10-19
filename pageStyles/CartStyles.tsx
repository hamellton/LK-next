import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const CartWrapper = styled.div<{
  isMobileView?: boolean;
  flex: boolean;
  isContactLensConsentEnabled?: boolean;
  isCartEmpty?: boolean;
}>`
  ${(props) => (props.flex ? "display: flex;" : "")}
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  background-color: var(--warm-grey-25);
  ${(props) =>
    props.isMobileView
      ? `
  -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    min-height: calc(100vh - 51px);
    gap: 16px;
    height: fit-content;
    background-color: #f7f2ed;
    ${
      props.isContactLensConsentEnabled
        ? `padding: 10px 20px 115px 20px;`
        : `padding: 10px 20px ${!props.isCartEmpty ? "0px" : "65px"} 20px;`
    }
    overflow-x: hidden;
    position: relative;
    z-index: 99998;
    > div {
      margin-bottom: 20px;
    }
    // /* reset rule */
    // > div > * {
    //   margin-bottom: 10px;
    // }
  `
      : `
    min-height: calc(100vh - 67px);
    // padding: 0 50px;
    padding-top: var(--pd-15);
    min-width: 800px;
    padding-bottom: 150px;
    width:100%;
  `}
  img {
    max-width: 100%;
    height: auto;
    vertical-align: middle;
  }

  /* display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #fbf9f7;
  margin: auto;
  max-width: 1500px;
  min-width: 1200px;
  padding: 0 8.3%;
  gap: 40px; */
`;

export const MainSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* margin: 0 50px; */
  gap: 40px;
  /* @media (min-width: 1024px) {
    flex-direction: row;
    gap: 40px;
    margin-bottom: 150px;
  } */
`;

export const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 55%; */
  min-width: 642px;
  width: 100%;
  @media screen and (max-width: 1200px) {
    min-width: 600px;
  }
  /* @media (min-width: 1024px) {
    width: 70%;
  } */
`;

export const RightWrapper = styled.div<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 360px;
  max-width: 360px;
  margin-top: 15px;
  width: 360px;
  ${(props) =>
    props.padding &&
    `padding: ${props.padding};`} /* @media (min-width: 1024px) {
    margin-top: 0;
    width: 30%;
  }
  @media screen and (max-width: 1240px) {
    width: 86%;
  } */
  @media screen and (max-width: 1200px) {
    min-width: 250px;
  }
`;

export const ButtonPosition = styled.div`
  /* @media (max-width: 1024px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    display: flex;
    align-items: center;
    padding: 10px;
    background: white;
  } */
`;

export const CartCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;

export const HeadingText = styled.div<{
  styledFont: TypographyENUM;
  isMobileView?: boolean;
  fontSize?: string;
}>`
  font-family: "LKSerif-Normal";
  font-style: normal;
  font-weight: 400;
  &.cart-heading {
    margin-top: 20px;
  }
  font-size: ${(props) => (props.fontSize ? props.fontSize : "24")}px;
  color: var(--dark-blue-100);
  ${(props) =>
    props.isMobileView
      ? `
    font-family: ${TypographyENUM.lkSerifNormal};
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    letter-spacing: -.02em;
    color: var(--dark-blue-100);
    margin-bottom: 0px;
  `
      : ""}
`;

export const ButtonContent = styled.div<{
  styledFont: TypographyENUM;
  isRTL?: boolean;
  fontSize?: string;
  fontWeight?: string;
}>`
  font-family: ${(props) => props.styledFont};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "700")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "16px")};
  color: var(--dark-blue-100);
  align-items: center;
  display: flex;
  line-height: 26px;
  letter-spacing: -0.02em;
  gap: 10px;
  text-transform: capitalize;
  span {
    display: flex;
    svg {
      width: 8px;
    }
  }
  @media screen and (max-width: 767px) {
    font-size: 14px;
    font-weight: 500;
  }
  svg {
    transform: ${(props) => (props.isRTL ? "scaleX(-1)" : "")};
    width: 8px;
    @media screen and (max-width: 767px) {
      path {
        stroke: #000;
      }
    }
  }
`;

export const TextButton = styled.span<{ isRTL?: boolean }>`
  ${(props) => (props.isRTL ? "transform: scaleX(-1)" : "")};
  display: flex;
  align-items: center;
  padding: 4px var(--pd-8);
  border: 1px solid #737397;
  border-radius: 100px;
  cursor: pointer;
  margin-left: 10px;
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 7px;
  @media screen and (max-width: 767px) {
    padding-left: 0px;
    padding-right: 0px;
  }
`;

export const StickyDiv = styled.div`
  top: 200px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const Overlay = styled.div<{ isOverlay: boolean }>`
  opacity: ${(props) => (props.isOverlay ? "0.08" : "unset")};
  cursor: pointer;
  // z-index: ${(props) => (props.isOverlay ? "1" : "unset")};
`;

export const OverlayText = styled.div<{
  isOverlay: boolean;
  styledFont: TypographyENUM;
}>`
  display: ${(props) => (props.isOverlay ? "block" : "none")};
  color: var(--dark-blue-100);
  position: absolute;
  font-size: 14px;
  width: 100%;
  margin: 0 !important;
  font-family: ${(props) => props.styledFont};
  z-index: 1;
`;

export const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
`;

export const Text = styled.p<{ isBold?: boolean }>`
  font-family: ${(props) =>
    props.isBold ? "var(--font-lksans-bold)" : "var(--font-lksans-regular)"};
  margin: 0;
`;

export const CrossWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 14px;
  cursor: pointer;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 15px;
  width: 80%;
`;

export const ApplyCouponInput = styled.input<{ isRTL: boolean }>`
  width: 100%;
  height: 60px;
  padding-left: 10px;
  border-right: 0 !important;
  ${(props) => (props.isRTL ? "padding-right: 10px" : "padding-left: 10px")};
  ${(props) =>
    props.isRTL ? "border-left: 0 !important" : "border-right: 0 !important"};
  border-radius: ${(props) =>
    props.isRTL ? "0 12px 12px 0" : "12px 0px 0px 12px"};
  text-transform: uppercase;
  border: 1px solid #cecedf;
  font-size: 16px;
  font-family: ${TypographyENUM.lkSansRegular};
  padding: 20px;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  :focus {
    outline: none;
  }
  user-select: initial;
  &::before,
  &::after {
    user-select: initial;
  }
`;

export const ApplyButton = styled.button<{
  isActive?: boolean;
  isRTL: boolean;
}>`
  font-size: 15px;
  font-family: var(--font-lksans-bold);
  height: 60px;
  border-left: 0 !important;
  background: white;
  /* padding-right: 10px; */
  padding: 20px;
  border-radius: ${(props) =>
    !props.isRTL ? "0 12px 12px 0" : "12px 0px 0px 12px"};
  ${(props) =>
    !props.isRTL ? "border-left: 0 !important" : "border-right: 0 !important"};
  // ${(props) => (props.isRTL ? "padding-left: 10px" : "padding-right: 10px")};
  padding: 20px;
  border: 1px solid #cecedf;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  color: ${(props) =>
    props.isActive ? "var(--vivid-green-100)" : "var(--light-gray-25)"};
`;

export const ManualApplyCoupon = styled.div<{ font: TypographyENUM }>`
  font-family: ${(props) => props.font} !important;
`;

export const Icon = styled.span<{ isRTL: boolean }>`
  ${(props) => (props.isRTL ? "transform: rotate(180deg)" : "")};
`;

export const WhiteBG = styled.div`
  background: #ffffff;
`;
