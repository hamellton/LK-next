import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const ProductDetailWrapper = styled.div`
  padding: 0 33px;
`;

export const ProductDetailMobileWrapper = styled.div`
  background-color: #eaeff4;
`;

export const BreadcrumbsWrapper = styled.div<{ isMobile?: boolean }>`
  /* margin: 20px auto; */
  margin: ${(props) => (props.isMobile ? "0" : "0 auto 10px")};
  padding: ${(props) => (props?.isMobile ? "8px" : "20px 0 5px 0")};
`;

export const BannerWrapper = styled.div`
  img {
    width: 100%;
  }
`;

export const ProductImagesWithDittoWrapper = styled.div``;

export const ProductDetailsWrapper = styled.div<{ marginNeeded?: boolean }>`
  padding: 10px;
  ${(props) => props?.marginNeeded && "margin: 10px 0px 0px 0px;"}
  background-color: var(--white);
`;

export const ContactLensCarouselContainer = styled.div``;

export const RecentlyViewedWrapper = styled.div``;

export const Title = styled.h2`
  color: #18cfa8;
  font-size: 15px;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  font-weight: 400;
`;
export const PDPWrapper = styled.div<{ showPowerTypeModal: boolean }>`
  display: flex;
  // height: ${(props) => (props.showPowerTypeModal ? "0vh" : "")};
  overflow: ${(props) => (props.showPowerTypeModal ? "hidden" : "")};
  .image-zoom-modal {
    position: absolute;
    left: 50%;
    top: 45%;
    -webkit-transform: translate(-50%, -50%) !important;
    transform: translate(-50%, -50%) !important;
  }
`;

export const AsideWrapper = styled.aside<{ isRTL?: boolean }>`
  width: 30%;
  ${(props) => (props.isRTL ? "margin-right: 20px;" : "margin-left: 20px;")}
  & .accTitle {
    font-size: var(--fs-15);
    letter-spacing: 2px;
    color: #333;
  }
`;

export const ReviewButtonWrapper = styled.div<{
  isRowWise: boolean;
}>`
  display: flex;
  justify-content: space-between;
  flex-direction: ${(props) => (props.isRowWise ? "row" : "column")};
  button {
    text-transform: uppercase;
  }
`;

export const RichContentWrapper = styled.div<{ mobileView?: boolean }>`
  box-sizing: border-box;
  margin-top: 10px;

  img {
    display: block;
    width: 100%;
    margin-bottom: ${(props) => (!props.mobileView ? "20px" : "")};
  }
`;

export const OutOfStockWrapper = styled.div`
  padding: 0px 0px 20px 5px;
`;

export const PackageWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding: 0 2%;
`;

export const PackageItem = styled.div`
  width: 33%;
`;

export const CMSWrapper = styled.div`
  max-height: 700px;
  /* overflow: scroll; */
  overflow-y: auto;
  height: 100%;
  margin: 1%;
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 15px;
  right: 5px;
  display: flex;
  flex-direction: column;
  width: 20px;
  height: 20px;
  cursor: pointer;

  .left,
  .right {
    height: 2px;
    width: 100%;
    background-color: var(--black);
  }

  .left {
    transform: rotate(45deg) translateY(1px);
  }

  .right {
    transform: rotate(-45deg) translateY(-1px);
  }
`;
export const WhiteBG = styled.div`
  background: #ffffff;
`;

export const DeliveryText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 2px;
  background: rgba(0, 185, 198, 0.12);
  border-radius: 4px;
  color: #3c3c3c;
  width: 150px;
  margin-top: 10px;
`;

export const ProductAndOfferWrapper = styled.div`
  margin-bottom: 10px;
`;
