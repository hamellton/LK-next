import styled from "styled-components";

export const ProductCTAWrapper = styled.div<{
  bottom?: boolean;
  searchBar?: boolean;
  isFlexRow: boolean;
}>`
  position: sticky;
  bottom: 0;
  background-color: var(--white);
  padding: 5px;
  width: 100vw;
  display: flex;
  flex-direction: ${(props) => (props.isFlexRow ? "row" : "column")};
  gap: 8px;
  z-index: 99;
  ${(props) => props.searchBar && "visibility: hidden"};
`;
export const RedirectButtons = styled.div<{ isWidthFull: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* padding: 8px; */
  gap: 8px;
  ${(props) => props.isWidthFull && "width: 100%"};
`;

export const BuyNowButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  @media screen and (max-width: 767px) {
    button {
      p {
        font-size: 14px;
      }
    }
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  @media screen and (min-width: 375px) and (max-width: 1199px) {
    button {
      width: 100%;
    }
  }
  @media screen and (max-width: 767px) {
    button {
      height: 46px;
      font-family: Roboto;
      font-weight: 700;
      text-align: left;
      img {
        height: auto;
      }
      p {
        font-size: 12px;
      }
    }
  }
`;
