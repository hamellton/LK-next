import styled from "styled-components";

export const ProductImagesWithDittoWrapper = styled.div`
  background-color: var(--white);
  position: relative;
  padding-top: 10px;
`;
export const TopContent = styled.div`
  margin: 0 10px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const BottomContentWrapper = styled.div`
  margin-top: -64px;
  position: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-image: linear-gradient(0deg, #aeabab, transparent);
  display: flex;
  justify-content: space-between;
  /* justify-content: center; */
`;
export const LeftContent = styled.div`
  position: relative;
  bottom: 10px;
  /* left: 10px; */
  /* z-index: 2; */
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  @media screen and (max-width: 767px) {
    bottom: 2px;
  }
`;
export const Image = styled.img`
  max-width: 22px;
`;
export const Text = styled.div`
  color: var(--white);
`;
