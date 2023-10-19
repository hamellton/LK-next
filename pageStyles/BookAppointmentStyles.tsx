import styled from "styled-components";

export const MobileWrapper = styled.div`
  height: 100vh;
`;

export const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  &.booAptWrapper {
    height: auto;
    flex-direction: row;
  }
  & .bookaptHeader {
    width: 100%;
  }
`;
