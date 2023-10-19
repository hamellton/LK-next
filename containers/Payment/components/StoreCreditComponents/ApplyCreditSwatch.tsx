import { TypographyENUM } from "@/types/coreTypes";
import React from "react";
import styled from "styled-components";

const SwatchBox = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 25px 4px 24px;
  gap: 4px;
  isolation: isolate;
  width: 411px;
  height: 40px;
  margin-bottom: 24px;
  /* Primary/Background */

  background: #f3fffb;
  /* Primary/Dark */

  border: 1px solid #0fbd95;
  border-radius: 99px;
`;
const Code = styled.span`
  width: 137px;
  height: 24px;
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #333368;
`;
const Amount = styled.span`
  width: 33px;
  height: 24px;
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #333368;
`;
const RemoveBtn = styled.button`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 14px;
  line-height: 20px;
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  /* identical to box height, or 143% */

  letter-spacing: -0.02em;
  text-decoration-line: underline;
  text-transform: capitalize;

  /* Text/Dark/Secondary */

  color: #333368;
`;
export default function ApplyCreditSwatch({ code, amount, onRemove }: {code: string, amount: string, onRemove: (code: string) => void}) {
  return (
    <SwatchBox>
      <Code>{code}</Code>
      <Amount>₹{amount}</Amount>
      <RemoveBtn onClick={() => onRemove(code)}>Remove</RemoveBtn>
    </SwatchBox>
  );
}
