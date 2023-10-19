import styled from "styled-components";

export const ProductImageCarouselWrapper = styled.div`
  width: 80%;
  margin: auto;
  &.categoryLanding {
    width: auto;
    padding-left: 70px;
    padding-right: 70px;
    .custom-zoom-image {
      .slick-slide {
        a {
          display: block;
        }
      }
    }
  }
  .slick-prev.slick-prev.slick-prev.slick-prev.slick-prev.slick-prev.slick-prev,
  .slick-prev:hover {
    width: 50px;
    height: 50px;
    background: none;
    path {
      stroke: rgb(212, 212, 212);
    }
  }
  .slick-prev {
    [dir="rtl"] & {
      left: -25px !important;
      right: auto !important;
    }
  }
  .slick-next.slick-next.slick-next.slick-next.slick-next.slick-next.slick-next,
  .slick-next:hover {
    width: 50px;
    height: 50px;
    background: none;
    path {
      stroke: rgb(212, 212, 212);
    }
  }
  .slick-next {
    [dir="rtl"] & {
      right: -25px !important;
      left: auto !important;
    }
  }
`;

export const CATSLIDERHEADING = styled.div`
  font-size: 26px;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-family: "LKFuturaStd-Medium";
  display: block;
  color: #329c92;
`;

export const CATSLIDERDESC = styled.div`
  max-width: 1000px;
  text-align: center;
  margin: 20px auto;
`;

export const STRONG = styled.strong`
  color: rgb(68, 89, 98);
  font-family: "LKFuturaStd-Heavy";
  font-weight: 400;
`;

export const CATSHORTDESC1 = styled.div`
  font-size: 14px;
  color: #424244;
  letter-spacing: 2px;
`;

export const CATSHORTDESC2 = styled.div`
  font-size: 14px;
  color: rgb(66, 66, 68);
  letter-spacing: 2px;
  font-family: "LKFuturaStd-Heavy";
  margin-top: 3px;
`;

export const CATSHORTDESCSECOND = styled.span`
  font-size: 14px;
  color: #424244;
  letter-spacing: 2px;
  font-family: "LKFuturaStd-Heavy";
`;

export const CATSHORTDESCTHIRD = styled.span`
  color: rgb(40, 159, 149);
`;

export const VIEW_3D_RANGE = styled.div`
  display: flex;
  justify-content: center;
  margin-right: -6.5%;
  border-bottom: 1px solid #d4d4d4;
  margin-left: -6.5%;
`;

export const VIEW_RANGE = styled.a``;

export const VIEW_RANGE_CONTAINER = styled.div`
  background: #3b9f95;
  color: #fff;
  width: 10%;
  min-width: 150px;
  font-family: "LKFuturaStd-Heavy";
  padding: 9px 15px;
  font-size: 14px;
  letter-spacing: 1px;
  text-align: center;
  margin: 2.5% 0.6% 0 0;
  border: 1px solid #289f95;
  display: inline-block;
  text-transform: uppercase;
`;

export const VIEW_3D = styled.a``;

export const VIEW_3D_CONTAINER = styled.div`
  width: 10%;
  min-width: 150px;
  padding: 9px 15px;
  letter-spacing: 1px;
  text-align: center;
  margin: 2.5% 0.6% 0 4%;
  color: #289f95;
  font-size: 14px;
  font-family: "LKFuturaStd-Heavy";
  border: 1px solid #289f95;
  display: inline-block;
  text-transform: uppercase;
`;
