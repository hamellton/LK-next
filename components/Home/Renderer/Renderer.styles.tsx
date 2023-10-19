import styled from "styled-components";

export const BannerCourselWrapper = styled.div<{
  topSpace: string;
  bottomSpace: string;
}>`
  text-align: left;
  font-size: 20px;
  line-height: 32px;
  //margin: 0px 0px 8px 0px;
  background-color: #f6f6f6;
  padding-bottom: ${(props) =>
    props?.bottomSpace ? props.bottomSpace : "10"}px;
  padding-top: ${(props) => (props?.topSpace ? props.topSpace : "0")}px;
`;

export const BannerTitle = styled.strong`
  text-align: left;
  font-size: 16px;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  margin-bottom: 8px;
  padding-left: 8px;
  padding-right: 8px;
`;

export const BannerStaticTitle = styled.h4`
  text-align: left;
  font-size: 16px;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  margin: 0px 0px 18px 0px;
  padding-left: 8px;
  padding-right: 8px;
`;

export const GridWrapper = styled.div<{
  topSpace: string;
  bottomSpace: string;
}>`
  -webkit-tap-highlight-color: transparent;
  padding-bottom: ${(props) =>
    props?.bottomSpace ? props.bottomSpace : "0"}px;
  padding-top: ${(props) => (props?.topSpace ? props.topSpace : "0")}px;
  & [cols="3"] {
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export const BannerWrapper = styled.div<{
  topSpace: string;
  bottomSpace: string;
}>`
  padding-bottom: ${(props) =>
    props?.bottomSpace ? props.bottomSpace : "0"}px;
  padding-top: ${(props) => (props?.topSpace ? props.topSpace : "0")}px;
`;
