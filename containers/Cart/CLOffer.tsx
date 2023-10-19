import { TypographyENUM } from '@/types/coreTypes'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

const OfferContainer = styled.div`
    font-family: ${TypographyENUM.lkSansRegular};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #000042;

    padding: 16px;
    background: #f7f1de;
    // border: 1px solid #E2E2EE;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`
const CLOffer = ({ children }: { children: ReactNode }) => {
  return (
    <OfferContainer>{children}</OfferContainer>
  )
}

export default CLOffer