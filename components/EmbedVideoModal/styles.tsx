import styled from "styled-components";

export const CloseIconWrapper = styled.div<{ isRTL: boolean }>`
  position: absolute;
  /* top: -4px;
	right: -4px; */
  cursor: pointer;
  background: #fff;
  width: 40px;
  ${(props) => (props.isRTL ? `left: -17px;` : `right: -17px;`)}
  height: 40px;
  display: flex;
  align-items: center;
  top: -17px;
  justify-content: center;
  border-radius: 50%;
  /* right: -17px; */
`;
