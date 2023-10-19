import styled from "styled-components";

export const ShowFiltersContainer = styled.div<{ isRTL: boolean }>`
  width: 100%;
  z-index: 0;
  background: #fff;
  font-size: 12px;
  text-align: ${(props) => (props.isRTL ? "right" : "left")};
  padding: 5px 10px;
`;

export const CloseFilter = styled.span`
  background: 0 0;
  text-indent: inherit;
  color: #9b9b9b;
  font-size: 12px;
  font-weight: 400;
  font-family: "LKFuturaStd-Medium";
  cursor: pointer;
`;

export const FillLabelHead = styled.span`
  color: #000;
  text-transform: capitalize;
  font-size: 12px;
  letter-spacing: 1px;
`;

export const ResetFilters = styled.span`
  text-decoration: underline;
  color: #329c92;
  cursor: pointer;
  margin-left: 4px;
`;

export const ActiveFiltersContainer = styled.div<{ removeMargin?: boolean }>`
  margin-top: 0;
  text-align: left !important;
  background: #fff;
  direction: initial;
  ${(props) => props.removeMargin && "display:none"}
`;

export const SubTitle = styled.span`
  color: #333;
  font-size: 12px;
  letter-spacing: 1px;
`;
