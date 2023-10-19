import styled from "styled-components";

export const TryOnWrapperSection = styled.section<{
  sticky: boolean;
  headerHeight: number;
}>`
  display: flex;
  justify-content: space-between;
  width: -webkit-fill-available;
  padding: 6px 10px;
  background-color: #ededed;
  ${(props) =>
    props.sticky && `position: sticky; top: ${props.headerHeight - 1}px;`}
  z-index: 12;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

export const Title = styled.h1`
  font-family: "LKFuturaStd-Medium", sans-serif;
  font-size: 12px;
  color: #6d6e71;
  margin: 0;
  line-height: 30px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 2px;
`;
