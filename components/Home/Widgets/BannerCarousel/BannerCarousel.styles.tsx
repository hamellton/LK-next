import styled from "styled-components";

export const BannerCarouselLoader = styled.div`
  height: "200px";
  background: "url(https://static.lenskart.com/media/mobile/images/img-loader.gif) center no-repeat";
`;

export const CarouselBlock = styled.div<{
  isScroll: boolean;
  isAutoPlay?: boolean;
}>`
  overflow: hidden;
  .slick-track {
    display: flex !important;
    ${({ isScroll, isAutoPlay }) =>
      isScroll && !isAutoPlay
        ? "transform: translate3d(0, 0, 0) !important;"
        : ""}
  }
  .slick-prev {
    left: 2% !important;
    z-index: 10;
  }
  .slick-next {
    right: 2% !important;
    [dir="rtl"] & {
      left: auto !important;
    }
  }
  .slick-list {
    overflow: ${(props) => (props.isScroll ? "scroll" : "hidden")};
    ::-webkit-scrollbar {
      width: 0px;
      background: none;
    }
    ::-webkit-scrollbar-track {
      width: 0;
      background: none;
    }
  }
`;

export const HomePageLoader = styled.div`
  height: "200px";
  background: "url(https://static.lenskart.com/media/mobile/images/img-loader.gif) center no-repeat";
`;
