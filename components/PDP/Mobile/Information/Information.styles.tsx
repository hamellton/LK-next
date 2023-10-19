import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const InformationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 10px;
  //   background-color: var(--white);
  margin: 8px;
  border-top: 1px solid #ddd;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-family: roboto, sans-serif, arial, helvetica, sans-serif;
  font-size: 24px;
`;

export const Heading = styled.div`
  font-size: 14px;
  font-family: roboto, sans-serif, arial, helvetica, sans-serif;
  color: #27394e;
`;

export const SubText1 = styled.div`
  font-weight: 300;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  line-height: 28px;
`;

export const SubText2 = styled.div`
  font-weight: 700;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
`;
export const SubText3 = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #27394e;
  a {
    color: #18cfa8;
  }
`;
