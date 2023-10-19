import styled from "styled-components";

export const BannerImgRoot = styled.div<{
  aspectRatio: number;
}>`
  width: 100vw;
  height: ${(props) =>
    props.aspectRatio ? `${100 / props.aspectRatio}vw` : "auto"};

  a {
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
    height: 100%;
  }
`;

export const Container = styled.div<{ padding: number }>`
  padding-bottom: ${(props) => props.padding}px;
`;
