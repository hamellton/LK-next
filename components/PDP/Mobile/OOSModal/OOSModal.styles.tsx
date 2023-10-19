import styled from "styled-components";

export const Wrapper = styled.div`
	background-color: #eaeff4;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
`;

export const Heading = styled.h2`
	color: var(--red);
	font-weight: var(--fw-bold);
`;

export const SubHeading = styled.p`
	font-size: var(--fs-13);
	font-weight: var(--fw-medium);
`;

export const ColorOptionsWrapper = styled.div`
	width: 100%;
	//* to hide scroll bars
	::-webkit-scrollbar {
    width: 0px;
    background: none;
  }
  ::-webkit-scrollbar-track {
    width: 0;
    background: none;
  }
`