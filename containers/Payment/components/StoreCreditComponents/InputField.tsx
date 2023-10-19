// import { ApplyButton } from 'pageStyles/CartStyles'
import { TypographyENUM } from "@/types/coreTypes";
import React from "react";
import styled from "styled-components";
import TextField from "./TextField";

const ComponentRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
// const TextField = styled.input`
//     padding: 0px 16px;
// gap: 12px;
// isolation: isolate;

// background: #FFFFFF;
// border: 1px solid #CECEDF;
// border-radius: 8px;
// flex: 1;
// `
const ApplyButton = styled.button`
  padding: 16px 24px;
  /* width: 222.18px; */
  width: 30%;
  height: 56px;
  background: #11daac;
  border-radius: 100px;
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 16px;
  line-height: 24px;
  border: none;
  margin-left: 26px;
  /* identical to box height, or 150% */
  letter-spacing: -0.02em;
  cursor: pointer;
  /* Text/Dark/Main */
  color: #000042;
  @media screen and (max-width: 1565px) and (min-width: 768px) {
    width: auto;
  }
  &:disabled {
    background-color: #d3d3d3;
  }
`;

const InputField = ({
  value,
  onChange,
  onApply,
  label,
  onKeyPress,
  btnText,
}: {
  value: string;
  onChange: (e: any) => void;
  onApply: () => void;
  label: string;
  onKeyPress: (...args: any) => void;
  btnText: string;
}) => {
  return (
    <ComponentRow>
      <TextField
        onChange={onChange}
        placeholder={label}
        value={value}
        onKeyPress={onKeyPress}
      />
      <ApplyButton onClick={onApply} disabled={!value}>
        {btnText}
      </ApplyButton>
    </ComponentRow>
  );
};

export default InputField;
