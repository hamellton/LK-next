import styled from "styled-components";

export const GridSection = styled.section<{
  gridGap: string | number;
  background: string;
  cols: number;
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols}, 1fr);
  grid-gap: ${(props) => (props.gridGap ? props.gridGap : "8")}px;
  //padding: 0 8px;
  background-color: ${(props) =>
    props.background ? props.background : props.background};
`;

export const GridImage = styled.div<{ padding: string }>`
  padding: ${(props) => (props.padding ? props.padding : "0px")};
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const ImageSection = styled.img`
  width: 100%;
  height: 100%;
`;
