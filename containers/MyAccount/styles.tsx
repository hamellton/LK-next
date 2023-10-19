import styled from "styled-components";

export const BaseSidebarWrapper = styled.div<{ hide?: boolean }>`
  display: flex;
  width: 100%;
  ${(props) => !props.hide && "min-height: 580px;"}
  max-width: 1188px;
  ${(props) => !props.hide && "margin: 10px auto;"}
`;
