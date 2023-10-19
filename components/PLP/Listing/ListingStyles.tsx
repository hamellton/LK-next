import styled from "styled-components";

export const RowWrapper = styled.div<{ isRTL: boolean }>`
  display: flex;
  width: 100%;
  max-width: 1430px;
  ${(props) => (props.isRTL ? "flex-direction: row-reverse" : "")};
  margin: 0 auto;
  // margin-bottom: 10px;
`;

export const NoResFound = styled.div<{ desktop?: boolean }>`
  // position: absolute;
  // top: -845px;
  font-size: 18px;
  font-family: FuturaStd-Book, helvetica neue, Helvetica, Arial, sans-serif;

  ${(props) => (props.desktop ? "left: 40%;" : "")};
`;

export const ShowCountContainer = styled.div`
  font-family: var(--font-default-book);
  font-synthesis: none;
  text-align: center;
  // border-top: 0.2px solid #ededed;
  padding-top: 10px;
  font-size: 13px;
  font-weight: 100;
  letter-spacing: 1.2px;
  color: #333;
`;

export const ListingWrapper = styled.div<{ desktop: boolean }>`
  // padding: ${(props) => (props.desktop ? "0px 0px" : "0px 5px")} 0px 5px;
  margin: 0 2%;
  // margin-left: ${(props) => (props.desktop ? "-60px" : "0px")};
  /* Hide scrollbar for IE, Edge and Firefox */
  .product-list-container {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  /* Hide scrollbar for Chrome, Safari and Opera */
  .product-list-container::-webkit-scrollbar {
    display: none;
  }
`;

// this component fix scroll issue in PLP pages
export const ListingWrapperContainer = styled.div<{ desktop: boolean }>`
  width: ${(props) => (props.desktop ? "100.8%" : "100%")};
  overflow: ${(props) => (props.desktop ? "hidden" : "auto")};
  margin-top: 3px;
`;

export const NoResultOuter = styled.div`
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid #ebebeb;
  margin-left: 20px;
  margin-right: 20px;
  @media screen and (max-width: 767px) {
    padding-top: 24px;
    padding-bottom: 98px;
    border-bottom: none;
    margin-left: 0px;
    margin-right: 0px;
    height: calc(100vh - 255px);
  }
  // height: 70vh;
`;

export const NoResultHeader = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 18px;
  text-transform: capitalize;
`;

export const NoResultBody = styled.div`
  font-size: 14px;
`;

export const ButtonSection = styled.div`
  margin-top: 40px;
  padding: 0 30px;
`;

export const CategoryButton = styled.div`
  background-color: #18cfa8;
  color: white;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const ButtonContent = styled.div``;

export const CardWrapperParent = styled.div<{ isMobile: boolean }>`
  margin: ${(props) => (props.isMobile ? "0" : "0 2%")};
  ${(props) => !props.isMobile && "margin-right: 0;"}
  @media screen and (max-width: 767px) {
    margin: ${(props) => (props.isMobile ? "0" : "0%")};
  }
`;

export const SimilarFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;
