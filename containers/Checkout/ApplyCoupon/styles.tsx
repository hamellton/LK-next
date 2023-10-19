import styled from "styled-components";
// import { TypographyENUM } from "../../../../Types/general";
import { TypographyENUM } from "@/types/coreTypes";

export const ApplyCouponWrapper = styled.div<{
  width?: number;
  isMobileView?: boolean;
}>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  gap: var(--spacing-lg);
  background: var(--white);
  // border: 1px solid var(--purple-haze);
  border-radius: var(--border-radius-xs);
  cursor: pointer;
  border: none;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  ${(props) => props.isMobileView && `width: 100%;`}
`;

export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: var(--space-between);
`;

export const FlexColWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  justify-content: var(--space-between);
  gap: var(--spacing-sm);
`;

export const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: var(--space-between);
`;

export const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
`;

export const IconWrapperButton = styled.div<{ isRTL: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px var(--pd-8);
  border: 1px solid var(--dark-blue-50);
  border-radius: 100px;
  cursor: var(--pointer);
  ${(props) => (props.isRTL ? "transform: rotate(180deg)" : "")};
`;

export const SubText = styled.div<{
  styleFont?: TypographyENUM;
  isApplied: boolean;
}>`
  font-weight: var(--fw-regular);
  font-size: var(--fs-14);
  color: ${(props) =>
    props.isApplied ? "var(--turquoise)" : "var(--dark-blue-75)"};
  ${(props) => (props.styleFont ? `font-family: ${props.styleFont}` : ``)};
`;

export const HeadText = styled.div<{ styleFont?: TypographyENUM }>`
  /* font-weight: var(--fw-bold); */
  font-size: var(--fs-14);
  color: var(--dark-blue-100);
  font-family: var(--font-lksans-bold);
`;
