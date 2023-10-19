import { TypographyENUM } from "@/types/coreTypes";
import styled from "styled-components";

export const RecentlyViewedWrapper = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  //* to hide scroll bars
  ::-webkit-scrollbar {
    width: 0px;
    background: none;
  }
  ::-webkit-scrollbar-track {
    width: 0;
    background: none;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: scroll;
`;

export const ProductCard = styled.div`
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

export const ProductImage = styled.img`
  max-height: 17vh;
`;

export const Text = styled.div<{ color?: string; type?: string }>`
  color: ${(props) => props.color || "var(--dark-gray)"};
  font-weight: ${(props) => (props.type === "primary" ? 700 : 400)};
  margin-top: 5px;
  font-size: var(--fs-16);
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  &.recentPrice,
  &.recentBrand {
    font-family: roboto, sans-serif, arial, helvetica, sans-serif;
  }
  &.recentBrand {
    font-size: 14px;
  }
`;
