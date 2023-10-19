import styled from "styled-components";

export const BannerAndStaticHTMLLoader = styled.div`
  height: "200px";
  background: "url(https://static.lenskart.com/media/mobile/images/img-loader.gif) center no-repeat";
`;

export const BannerAndStaticHTMWrapper = styled.div`
  box-sizing: border-box;
  img {
    display: block;
    width: 100%;
    margin-bottom: 10px;
  }
  .widget-title {
    padding-bottom: 6px;
    font-size: 15px;
    padding-top: 0px;
    color: #8a8888;
    font-family: "LKFuturaStd-Medium";
    letter-spacing: 0.5px;
  }
  .dropbtn {
    padding: 0;
    margin: 8px 10px 0;
  }
`;

export const Section = styled.section<{
  id: string;
  isRTL?: boolean;
  style: {};
}>`
  -webkit-tap-highlight-color: transparent;
  padding-bottom: ${(props) =>
    props.style.paddingBottom ? props.style.paddingBottom : ""};
  padding-left: 0 !important;
  padding-right: 0 !important;
  .dropdown {
    width: 16.3%;
  }
  .dropdown:hover .dropdown-content.menumargin .widget-title {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  &#idf_banner-0[style="padding-bottom: 15px;"] {
    background: #f5f5f5;
    margin-top: 0px !important;
    padding-top: 5px;
    // margin-bottom: -7px;
  }
  .dropdown:hover .dropdown-content.menumargin {
    top: 8px;
  }
  .trendtitle {
    margin-bottom: 0px;
    font-family: "LKFuturaStd-Medium";
    font-size:18px;
  }
  .wear-the-trend-sect{
    .arrow-holder-left-big1,.arrow-holder-left-big2{
      background: url(https://static.lenskart.com/media/desktop/img/menu/icon-arrow-right.svg) left center no-repeat;
      background-size: 50px;
      width: 50px;
      height: 100%;
      div{
        display:none;
      }
    }
    .arrow-holder-right-big1,.arrow-holder-right-big2{
      background: url(https://static.lenskart.com/media/desktop/img/menu/icon-arrow-right.svg) left center no-repeat;
      background-size: 50px;
      width: 50px;
      height: 100%;
      div{
        display:none;
      }
    }
  }
  .wearTrend {
    font-family: "Rajdhani-SemiBold";
    padding-left: 20px;
    div:first-child{
      font-family: "Rajdhani-SemiBold"; 
    }
    .TrendyTag{
      font-family: "LKFuturaStd-Medium";
      font-size: 16px;
      line-height: 41px;
    }
  }

  .leftarrow1,
  .leftarrow2 {
    // background: url(https://static.lenskart.com/media/desktop/img/menu/icon-arrow-left.svg)
    //   left center no-repeat;
    background:url(${(props) =>
      props.isRTL
        ? "https://static.lenskart.com/media/desktop/img/menu/icon-arrow-right.svg"
        : "https://static.lenskart.com/media/desktop/img/menu/icon-arrow-left.svg"});
    background-size: 50px;
    width: 50px;
    text-indent: -9999px;
    background-position:center center;
    background-repeat:no-repeat;
  }
  .rightarrow1,
  .rightarrow2 {
    background:url(${(props) =>
      props.isRTL
        ? "https://static.lenskart.com/media/desktop/img/menu/icon-arrow-left.svg"
        : "https://static.lenskart.com/media/desktop/img/menu/icon-arrow-right.svg"});
      right center no-repeat;
    background-size: 50px;
    width: 50px;
    text-indent: -9999px;
    background-position:center center;
    background-repeat:no-repeat;
  }
  center {
    a {
      img {
        margin-bottom: 0px;
      }
    }
    .menuitem div:first-child {
      font-family: "LKFuturaStd-Heavy";
    }
    .menuitem1 div:last-child {
      font-family: "LKFuturaStd-Heavy";
    }
    .dropdown-content.menumargin {
      z-index: 9;
    }
  }
  /* background: #f5f5f5; */
  .font-head,
  h4 {
    font-family: "LKFuturaStd-Medium";
    letter-spacing: 0.5px;
    font-size: 30px;
    margin-top: 80px;
    margin-bottom: 35px;
    text-transform: uppercase;
  }
  h4 + div {
    margin-top: 0px;
  }
  .prod-row-right {
    a {
      color: #329c92;
    }
  }
`;
