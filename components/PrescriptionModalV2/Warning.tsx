import { TypographyENUM } from "@/types/coreTypes";
import { Icons } from "@lk/ui-library";
import React from "react";
import styled from "styled-components";

const Root = styled.div`
  box-sizing: border-box;

  /* Auto layout */

  display: flex;
  align-items: flex-start;
  padding: 8px 12px;
  gap: 8px;

  width: 500px;
  height: 33px;

  /* Semantic/Alert/Background */

  background: #fff3d9;
  /* Semantic/Alert/Main */

  border: 1px solid #e9ae15;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const Text = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;

  color: #000042;
`;

export default function Warning({ text }: { text: string }) {
  return (
    <Root>
      <div>
        <Icons.InfoIcon />
      </div>
      <Text>{text}</Text>
    </Root>
  );
}
