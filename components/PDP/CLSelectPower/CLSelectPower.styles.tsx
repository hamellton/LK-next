import styled, { css } from "styled-components";
import { TypographyENUM } from "@/types/coreTypes";

export const MainText = styled.div<{ font?: TypographyENUM }>`
  display: flex;
  align-items: center;
  ${(props) =>
    props.font &&
    css`
      font-family: ${props.font};
    `}
  text-transform: capitalize;
  font-size: 13px;
  margin-top: -10px;
  color: #333;
`;
export const SelectPowerHead = styled.div<{ font?: TypographyENUM }>`
  font-size: 17px;
  font-weight: 500;
`;

export const CustomGrid = styled.div<{ columns: number; font: TypographyENUM }>`
  display: grid;
  width: 95%;
  grid-template-rows: 40px repeat(auto-fill, 50px);
  grid-template-columns: ${(props) =>
    props.columns
      ? `repeat(${props.columns}, ${Math.floor(100 / props.columns)}%)`
      : "auto auto auto"};
  font-family: ${(props) => props.font};
  column-gap: 12px;
  margin-top: 10px;
`;
export const ErrorField = styled.div`
  color: red;
  font-size: 12px;
  padding: 10px 0;
`;
