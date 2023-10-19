import { TypographyENUM } from '@/types/coreTypes';
import React from 'react';
import styled from 'styled-components';

const LoginCartAlertContainer = styled.div<{ isMobileView: boolean; }>`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
padding: 32px 16px;
gap: 15px;
height: 64px;
// background: #FFFFFF;
background: #ffebea;
box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.08);
border-radius: 12px;
cursor: pointer;
border: 1px solid #ffa499;
transition: box-shadow 0.2s ease-in-out;
&:hover {
    box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    z-index: 1;
    width: 100%;
    border-radius: 12px;
}
${props => props.isMobileView ? `
background: #ffebea;
	// border: 1px solid #E2E2EE;
	border: 1px solid #ffa499;
	border-radius: 8px;
	padding: 14px 16px;
	gap: 18px;
	width: 100%;
	height: 78px;
` : ``}
`;

const LoginCartAlertText = styled.div<{ isMobileView: boolean; }>`
font-family: ${TypographyENUM.lkSansBold};
// font-weight: 400;
/* font-weight: 700; */
font-size: 14px;
line-height: 20px;
letter-spacing: -0.02em;
color: #000042;
text-transform: capitalize;
${props => props.isMobileView ? `
font-size: 12px;
	line-height: 18px;
` : ``}
`

const MobileCardBox = ({ isMobileView, message }: { isMobileView: boolean, message: string }) => {
  return (
    <LoginCartAlertContainer isMobileView={isMobileView}>
      <LoginCartAlertText isMobileView={isMobileView}>
        {message}
      </LoginCartAlertText>
    </LoginCartAlertContainer>
  );
};

export default MobileCardBox;
