import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const Header = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  text-align: center;
  font-weight: var(--fw-medium);
  color: var(--grayish-blue);
  font-size: var(--fs-28);
  margin-top: -10px;
  font-family: ${TypographyENUM.rajdhaniRegular};
`;

export const ButtonContainer = styled.div``;

export const TechInfoItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 50vh;
  flex-wrap: wrap;
  overflow: scroll;
`;

export const ItemContainer = styled.div`
  width: 50%;
  padding: 0px 15px;
`;

export const Back = styled.div<{ visible: boolean }>`
  visibility: ${(props) => (props.visible ? "none" : "hidden")};
  text-align: left;
  cursor: pointer;
`;
