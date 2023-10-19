import React from "react";
import styled from "styled-components";

const Root = styled.div<{ isMobile: boolean; higherZIndex?: boolean }>`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.isMobile ? "center" : "center")};
  align-items: center;
  padding: 16px 16px 32px;
  width: ${(props) => (props.isMobile ? "100%" : "750px")};
  height: 100px;
  background: #ffffff;

  box-shadow: 0px -4px 20px rgba(0, 0, 66, 0.1);
  border-radius: 16px 16px 0px 0px;

  ${(props) => (props.higherZIndex ? "z-index: 4;" : "")};
`;

export default function BottomSheet({
  children,
  isMobile,
  higherZIndex = false,
}: any) {
  return (
    <Root higherZIndex={higherZIndex} isMobile={isMobile}>
      {children}
    </Root>
  );
}
