import { TypographyENUM } from '@/types/coreTypes'
import React from 'react'
import styled from 'styled-components'

const MainText = styled.span`
    font-family: ${TypographyENUM.lkSansRegular};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: #333368;
    margin-right: 16px;
`
const CreditBox = styled.div`
    margin-bottom: 24px;
`
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
  letter-spacing: -0.02em;
  text-decoration-line: underline;
  text-transform: capitalize;
  color: #333368;
`;
const AddedCredit = ({code, onRemove}: {code: string, onRemove: (code: string) => void}) => {
  return (
    <CreditBox>
        <MainText>{code}</MainText>
        <RemoveBtn onClick={() => onRemove(code)}>Remove</RemoveBtn>
    </CreditBox>
  )
}

export default AddedCredit