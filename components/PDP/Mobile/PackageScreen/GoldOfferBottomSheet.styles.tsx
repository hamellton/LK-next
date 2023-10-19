import { TypographyENUM } from "@/types/coreTypes";
import styled from "styled-components";

export const GoldOfferContainer = styled.div<{color?: string}>`
	background-color: ${props => props.color || 'var(--white)'};
	padding: 15px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	color: var(--dark-blue-100);
	font-family: ${TypographyENUM.lkSansRegular};
	letter-spacing: -0.02em;

`

export const GoldImage = styled.img`
	width: 55%;
	margin: 10px 0 8px;
`
export const Text = styled.p`
	font-size: 40px;
	line-height: 48px;
	font-weight: 100;
`
export const Subtext = styled.p`
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	word-wrap: normal;
`

export const GoldCTA = styled.button`
	margin: 10px 0;
    border: 1px solid var(--dark-blue-100);
    border-radius: 100px;
    padding: 15px;
    background-color: transparent;
    font-size: 14px;
    font-weight: 400;
`