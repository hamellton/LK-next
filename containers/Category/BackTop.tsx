import { Icons } from "@lk/ui-library";
import React from "react";
import styled from "styled-components";
import { BackTopTypes } from "./Category.types";

const RootBacktop = styled.div<{ scrollPosition: number; isRTL: boolean }>`
  width: 35px;
  height: 35px;
  position: fixed;
  bottom: 91px;
  ${(props) => (!props.isRTL ? `right: 40px;` : `left: 40px;`)}
  display: ${(props) => (props.scrollPosition > 20 ? "inline-block" : "none")};
  background: #329c92;
  cursor: pointer;
  z-index: 1;
  transform: rotate(180deg);
`;

const Arrow = styled.span`
  position: absolute;
  color: white;
  left: 10px;
  top: 10px;
`;

export default function BackTop({
  gotoTop,
  scrollPosition,
  isRTL,
}: BackTopTypes) {
  return (
    <RootBacktop
      onClick={gotoTop}
      scrollPosition={scrollPosition}
      isRTL={isRTL}
    >
      <Arrow>
        <Icons.DownArrow />
      </Arrow>
    </RootBacktop>
  );
}
