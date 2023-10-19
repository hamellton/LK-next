import styled from "styled-components";

export const LenskartPromiseWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  & > div {
    border-right: 1px solid #eaeff4;
    flex-grow: 1;
  }
  & > div:last-child {
    border-right: none;
  }
`;
export const LenskartPromiseItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
`;
export const LenskartPromiseItemText = styled.span`
  font-size: 11px;
  font-family: "Roboto";
  line-height: 15px;
  img {
    margin-bottom: 10px;
  }
`;
export const Seperator = styled.div`
  display: block;
  width: 1px;
  background: #eaeff7;
`;
