import styled from "styled-components";
import { TypographyENUM } from "@/types/baseTypes";

export const BasicDetailsWrapper = styled.div<{ styleFont: TypographyENUM }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--pd-10);
  font-family: ${(props) => props.styleFont};
`;

export const Title = styled.h1`
  text-transform: capitalize;
  color: var(--dark-gray);
  font-weight: var(--fw-semi-bold);
  font-size: var(--fs-16);
  margin: 0;
  font-family: var(--font-default-heavy);
`;
export const Brand = styled.h2`
  color: var(--whitish-gray);
  font-weight: var(--fw-semi-bold);
  font-size: var(--fs-14);
  margin: 0;
`;

export const Size = styled.p`
  color: var(--whitish-gray);
  font-weight: var(--fw-bold);
  font-size: var(--fs-16);
  margin: 0;
`;
