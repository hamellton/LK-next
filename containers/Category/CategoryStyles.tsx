import styled from "styled-components";

export const CategoryWrapper = styled.div`
  padding: 0 2vw;
  //   margin-bottom: 0.5rem;
`;

export const MobileCategoryWrapper = styled.div`
  padding: 8px;
  background-color: #eaeff4;
  // height: 80vh;
`;

export const BreadcrumbsWrapper = styled.div<{ isRTL: boolean }>`
  padding: ${(props) => (props.isRTL ? "20px 0" : "20px 0px 15px 0px")};
  // margin: ${(props) => (props.isRTL ? "5px 0 20px" : "5px 15px 20px")};
`;

export const Extra = styled.div<{ padding: boolean }>`
  ${(props) => props.padding && "padding: 10px;"}
  z-index: 11;
  position: sticky;
  top: 146px;
  background-color: white;
`;

export const FlexWrapper = styled.div`
  display: flex;
  flex-flow: row;
  background: #ffffff;
  position: relative;
`;

export const ListingWrapper = styled.div<{
  isRTL: boolean;
  removeMargin?: boolean;
}>`
  display: flex;
  width: 100%;
  margin: 0px;
  // ${(props) => !props.isRTL && "margin-right: 15px"};
  flex-flow: column;
  // height: 41px;
  // position: sticky;
  ${(props) => props.removeMargin && "margin: auto;"}
  top: 0;
  min-height: 100vh;
`;

export const StickyCount = styled.div<{ headerHeight: number }>`
  position: sticky;
  top: ${(props) => props.headerHeight}px;
  z-index: 12;
  background: white;
`;

export const ListingSection = styled.section`
  width: 100%;
`;

export const FlexWrapperNoRes = styled.div<{ removeMargin?: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  padding-bottom: 10px;
  ${(props) => props.removeMargin && "border-bottom: 1px solid #ebebeb;"}
  ${(props) => props.removeMargin && "margin-left: 20px;margin-right: 20px;"}
`;

export const StaticBanner = styled.section<{
  isRTL: boolean;
  productListLoading: boolean;
}>`
  margin: 0;
  overflow: hidden;
  clear: both;
  padding-left: 0;
  padding-right: 0;
  ${(props) => props.productListLoading && "display: none"};
  a.banner-image {
    margin-top: 10px;
  }
`;
export const BannerStaticBanner = styled.div`
  float: left;
  text-align: left;
  width: 100%;
`;
export const BannerImg = styled.img`
  width: 100%;
  display: block;
`;

export const FrameDitto3DGridWrapper = styled.div`
  margin: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  min-height: 45px;
`;

export const FrameWrapper = styled.div`
  min-width: 100px;
`;

export const New3DWrapper = styled.div`
  margin: 0 0 0 5px;
`;

export const IconsWrapper = styled.div<{ isRTL: boolean }>`
  svg {
    width: 20px;
    height: 18px;
    fill: #27394e;
  }
  display: flex;
  // ${(props) => (props.isRTL ? "margin-left: 8px" : "margin-right: 8px")};
`;

export const FilterIconWrapper = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-color: #18cfa8;
  position: fixed;
  z-index: 12;
  bottom: 2%;
  right: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FliterIconSpan = styled.span`
  font-size: 20px;
  margin-bottom: -5px;
  margin-left: -1px;
  color: #fff;
  transform: translate(2px, 5px);
`;

export const PLPVerticalLine = styled.div`
  border-left: 1px solid #e2e2ee;
  min-height: 24px;
  margin: 0 5px;
`;

export const MobileHelperWrapper = styled.div`
  position: sticky;
  top: 48;
  background-color: #eaeff3;
  z-index: 12;
  // padding-bottom: 10px;
  padding-top: 5px;
  #Breadcrumbs {
    margin-bottom: 10px;
  }
  @media screen and (max-width: 767px) {
    margin: 0%;
  }
`;

export const Wrapper = styled.div<{ height?: number }>`
  // ${(props) =>
    props.height ? `height: ${props.height}px` : "height: auto"};
  // ${(props) => (props.height === 1 ? "margin-top: 0" : "margin-top: 20px")};
  height: fit-content;
  // transition: height 500ms ease-out;
`;

export const TotalCount = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: #000042;
  // padding-left: 15px;
`;
export const NotFoundImg = styled.div`
  padding-bottom: 10px;
  padding-left: 16px;
  padding-right: 16px;
  background: -moz-linear-gradient(45deg, #27394e 0%, #008080 100%);
  background: -webkit-gradient(
    linear,
    left bottom,
    right top,
    color-stop(0%, #27394e),
    color-stop(100%, #008080)
  );
  background: -webkit-linear-gradient(45deg, #27394e 0%, #008080 100%);
  background: -o-linear-gradient(45deg, #27394e 0%, #008080 100%);
  background: -ms-linear-gradient(45deg, #27394e 0%, #008080 100%);
  background: linear-gradient(45deg, #27394e 0%, #008080 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#008080', endColorstr='#27394e', GradientType=1);
  margin: 0;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  // position: absolute;
  // left: -8px;
  // right: -8px;
  // top: -1px;
  height: 198px;
  margin: -22px -8px 0;
  padding-top: 144px;
  width: 100vw;
  text-align: left;
  color: #fff;
  font-size: 24px;
  & + div {
    display: none;
  }
  & + div + div {
    display: none;
  }
  & + div + div + div {
    display: none;
  }
`;
export const DescriptionWrapper = styled.div<{ removeMargin?: boolean }>`
  width: 100%;
  padding: 0 35px;
  position: relative;
  color: #494949;
  margin-top: 15px;
  ${(props) => props.removeMargin && "padding: 0 20px;"}
`;
export const DescriptionContent = styled.div<{ removeMargin?: boolean }>`
  border-top: 1px solid #ebebeb;
  ${(props) => props.removeMargin && "border-top: none"}
`;
export const StaticHTMLWrapper = styled.div`
  position: relative;
  padding: 5px 0px 20px;
  p {
    margin-bottom: 10px;
  }
  p,
  a {
    font-size: 11px;
  }
  a {
    color: #329c92;
    &:hover {
      text-decoration: underline;
    }
  }
  h2 {
    font-size: 13px;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  ul {
    list-style: none;
    margin-bottom: 10px;
  }
  li {
    font-size: 13px;
  }
`;
