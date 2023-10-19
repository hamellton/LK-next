import { TypographyENUM } from "@/types/coreTypes";
import styled from "styled-components";

export const MsitePageContainer = styled.div`
  min-height: calc(100vh - 55px);
  background-color: #fbf9f7;
`;

export const SectionHeading = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: var(--fs-16);
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #000042;
  padding: 32px 0 16px 0;
`;

export const AddressInputContainer = styled.div`
  padding-top: var(--pd-32);
`;

export const MsiteStores = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--pd-16);
  padding: var(--pd-20) var(--pd-16) var(--pd-150);
`;

export const MsiteFormContainer = styled.div`
  padding: var(--pd-30) var(--pd-16) var(--pd-150);
`;

export const NoResultsContainer = styled.div`
  padding-top: var(--pd-40);
`;
