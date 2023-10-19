import { TypographyENUM } from "@/types/coreTypes";
import styled from "styled-components";

export const Scroll = styled.div`
  height: 1200px;
  // width: fit-content;
  // overflow: hidden;
`;

export const FilterWrapper = styled.aside<{
  filterSelected: boolean;
  isRTL: boolean;
  headerHeight: number;
  scrollPosition: number;
}>`
  width: 255px;
  min-width: 255px;
  font-family: "LKFuturaStd-Medium";
  height: ${(props) => `calc(100vh - ${props.headerHeight - 1}px)`};
  // height: 100%;
  // overflow: scroll;
  overflow: ${(props) => (props.scrollPosition > 20 ? "scroll" : "visible")};
  transition: height 2s;

  ${(props) =>
    props.isRTL
      ? "border-left: 2px solid #ededed"
      : "border-right:2px solid #ededed"};

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  .accordion-loader-wrapper {
    position: static;
    width: 100%;
    height: 100%;
    overflow: visible;

    img {
      width: 100%;
      transform: scale(2) translateY(-50%);
      top: 50%;
    }
  }

  .accordion-loader-overlay {
    display: none;
  }
  position: sticky;
  top: ${(props) => props.headerHeight - 1}px;
`;

export const NoFilters = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  text-align: center;
  margin-top: 100px;
  font-size: 18px;
`;
