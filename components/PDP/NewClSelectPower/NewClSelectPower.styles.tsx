import { TypographyENUM } from "@/types/coreTypes";
import styled, { css } from "styled-components";

export const PowerTabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin: 12px 0;
`;

export const PowerTab = styled.div`
  padding: 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`;

export const PowerTabHeader = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

export const PowerTabHeaderInput = styled.input`
  margin: 0;
  accent-color: #00a4ae;
  transform: scale(1.25);
  cursor: pointer;
  user-select: initial;
  &::before,
  &::after {
    user-select: initial;
  }
`;

export const PowerTabLabel = styled.label`
  margin: 0;
  font-family: FuturaStd-Book, helvetica neue, Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 143%;
  letter-spacing: 1px;
  color: #3c3c3c;
  cursor: pointer;
`;
export const ContactLensInfo = styled.div`
  margin: 0 0 0 5px;
  color: rgba(60, 60, 60, 0.54);
  width: 20px;
  height: 20px;
  display: inline-block;
  text-align: center;
  border-radius: 50%;
  font-family: SourceSansProRegular;
  line-height: 22px;
  border: 1.5px solid rgba(60, 60, 60, 0.54);
`;

export const PowerTabBody = styled.div`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid rgba(60, 60, 60, 0.23);
  select {
    font-family: "LKFuturaStd-Book";
    color: #333;
  }
  div {
    margin-bottom: 0px;
  }
`;

export const SavedPrescTab = styled.div``;
export const ContactLensSignIn = styled.div`
  width: 100%;
  margin-left: 0;
  padding: 16px;
`;

export const ContactLensSignInText = styled.div`
  font-family: FuturaStd-Book, helvetica neue, Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: rgba(60, 60, 60, 0.54);
`;

export const ContactLensSignInButton = styled.div`
  text-align: center;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #00b9c6;
  width: 100%;
  color: #00b9c6;
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 1px;
  text-transform: uppercase;
  background-color: transparent;
`;

export const MainText = styled.div<{ font?: TypographyENUM }>`
  display: flex;
  align-items: center;
  ${(props) =>
    props.font &&
    css`
      font-family: ${props.font};
    `}
  text-transform: capitalize;
`;

export const StyledButton = styled.button`
  background-color: #000000;
  border: 0;
  cursor: var(--pointer);
  color: rgba(80, 213, 43, 0.695);
  text-transform: lowercase;
`;

export const EnterPowerManuallyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const RotateArrow = styled.div`
  display: flex;
  transform: rotate(180deg);
`;

export const QuickLinksContainer = styled.div`
  font-family: ${TypographyENUM.lkSansBold};
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 10px;
  width: 100%;
  p {
    margin-bottom: 15px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(60, 60, 60, 0.54);
    letter-spacing: 0.15px;
  }
`;

export const QuickLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const QuickLink = styled.a`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  margin: 8px 0;
  line-height: 22px;
  letter-spacing: 0.46px;
  text-transform: uppercase;
  color: #00b9c6;
  font-size: 13px;
  img {
    height: 0.75em;
  }
  @media screen and (max-width: 1594px) {
    font-size: 12px;
    gap: 2px;
  }
`;

export const Divider = styled.div`
  border: none;
  height: 1px;
  margin: 0;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.12);
`;

export const CustomGrid = styled.div<{
  columns: number;
  font: TypographyENUM;
  variableSize?: boolean;
}>`
  display: grid;
  width: 95%;
  grid-template-rows: 55px repeat(auto-fill, 50px);
  grid-template-columns: ${(props) =>
    props.columns
      ? `repeat(${props.columns}, ${Math.floor(100 / props.columns)}%)`
      : "auto auto auto"};
  font-family: ${(props) => props.font};
  column-gap: 12px;
  padding-right: 10px;
  row-gap: 10px;

  ${(props) =>
    props.variableSize &&
    css`
      grid-template-columns: 20% 40% 40%;
      column-gap: 10px;
    `}
`;

export const ErrorWrapper = styled.div`
  color: red;
  padding: var(--pd-10) var(--pd-5);
  text-align: left;
  width: 100%;
`;

export const ErrorField = styled.div`
  color: red;
  font-size: 12px;
  padding: 10px 0;
`;

export const SelectPowerText = styled.div`
  font-weight: 500;
  font-size: 17px;
  display: flex;
  align-items: center;
  letter-spacing: 0.15px;
  text-transform: uppercase;
  color: #3c3c3c;
  margin-top: 20px;
`;
