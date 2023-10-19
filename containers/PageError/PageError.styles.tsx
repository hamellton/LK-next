import { DeviceTypes } from "@/types/baseTypes";
import styled, { css } from "styled-components";

export const NoRoute = styled.div<{ mobileDevice?: boolean }>`
  /* position: absolute; */
  margin: ${(props) => (props.mobileDevice ? "0px 10% auto 10%" : "4% 25%")};
  width: -webkit-fill-available;
`;
export const RowDamn = styled.div<{ mobileDevice?: boolean }>`
  border-bottom: 2px solid #6e6e6e;
  display: flex;
  justify-content: space-evenly;
  flex-direction: ${(props) => (props.mobileDevice ? "column" : "row")};
  align-items: center;
  ${({ mobileDevice }) =>
    mobileDevice ? "width: fit-content;margin: 0px auto;" : ""}
  ${(props) =>
    props.mobileDevice &&
    css`
      img {
        width: 100%;
        height: 100%;
      }
    `}
`;
export const H1 = styled.h1<{ mobileDevice?: boolean }>`
  color: #329c92;
  margin: ${({ mobileDevice }) =>
    mobileDevice ? "20px 10px 10px 10px" : "25px 10px"};
  font-size: ${(props) => (props.mobileDevice ? "30px" : "6em")};
  ${({ mobileDevice }) =>
    mobileDevice
      ? "font-family: Roboto;font-weight:500;filter: brightness(0.9);"
      : "font-family: Trebuchet MS;font-weight:500;"}
`;
export const DamnImage = styled.div<{ mobileDevice: boolean }>`
  ${({ mobileDevice }) =>
    mobileDevice ? "width: 160px;margin: 0px auto;" : ""}
`;
export const TextBox = styled.div`
  margin-right: -15px;
  margin-left: -15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const DamnText = styled.div<{ mobileDevice?: boolean }>`
  color: #99a0a9;
  font-size: ${(props) => (props.mobileDevice ? "12px" : "18px")};
  margin-top: ${(props) => (props.mobileDevice ? "15px" : "10px")};
  line-height: 16px;
  font-family: var(--font-lksans-regular);
  ${(props) => (props.mobileDevice ? "text-align: center;" : "")};
`;
export const A = styled.a<{ mobileDevice?: boolean; clickHere?: boolean }>`
  color: #18cfa8;
  text-decoration: none;
  cursor: pointer;
  font-family: var(--font-lksans-bold);
  font-size: ${(props) => (props.mobileDevice ? "14px" : "18px")};
  ${({ clickHere, mobileDevice }) =>
    clickHere && mobileDevice ? "font-size:12px;" : "margin-top:5px;"}
  margin-right: 5px;
  :hover {
    text-decoration: underline;
    color: #23527c;
  }
`;
export const LkCategory = styled.ul<{ mobileDevice?: boolean }>`
  text-align: center;
  color: #329c92;
  list-style: none;
  ${({ mobileDevice }) =>
    mobileDevice ? "margin-top: 15px;margin-bottom: 100%;" : "margin-top:60px;"}
  ${(props) =>
    props.mobileDevice &&
    css`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `}
`;
export const Li = styled.li<{ mobileDevice?: boolean }>`
  ${({ mobileDevice }) =>
    mobileDevice
      ? ""
      : "border-right: 1px solid #329c92;&:last-child {border-right: none;}"}
  display: inline-block;
  font-size: ${({ mobileDevice }) => (mobileDevice ? "15px" : "20px")};
  letter-spacing: 1px;
  padding: 0 10px;
`;
export const Invis = styled.span`
  display: none;
`;

export const NoResultHeaderDes = styled.div`
  font-size: 18px;
  text-align: center;
  margin-top: 17px;
  text-transform: capitalize;
`;
