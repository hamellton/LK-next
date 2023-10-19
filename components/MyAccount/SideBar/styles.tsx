import styled, { css } from "styled-components";

export const SidebarWrapper = styled.div<{ hide: boolean }>`
  overflow: hidden;
  display: inline-block;
  margin-bottom: auto;
  min-width: 297px;
  padding-right: 15px;
  padding-left: 15px;
  ${(props) => props.hide && "display: none;"}
`;

export const UL = styled.ul`
  width: 100%;
`;

export const LI = styled.li<{ isActive: boolean | undefined }>`
  list-style: none;
  cursor: pointer;
  margin-bottom: 1px;
  background-color: #f7f5f5;
  width: 100%;
  color: #333;
  font-size: 12px;
  font-family: "LKSans-Bold";
  letter-spacing: 1.3px;
  font-weight: 500;
  &:hover {
    background-color: #3bb3a9;
    color: white;
    z-index: -1;
    overflow: hidden;
  }
  ${(props) =>
    props.isActive
      ? `
		background-color: #3bb3a9;
		color: white;
	`
      : ""}
`;

export const A = styled.a<{ img?: string }>`
  display: block;
  padding: 0.7rem 1rem;
  &:active {
    background-color: #3bb3a9;
    color: white;
  }
  ${(props) =>
    props.img &&
    css`
      background-image: url(https://static.lenskart.com/media/desktop/img/icon-my-ditto.png);
      background-repeat: no-repeat;
      background-position: right 15px center;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    `}
`;
