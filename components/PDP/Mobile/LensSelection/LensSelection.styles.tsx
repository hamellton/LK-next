import styled from "styled-components";

export const LensSelectionContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #f7f2ed;
  &#lensSelection {
    height: ${(props) => props.height}px;
  }
`;

export const TopHeaderLensSelection = styled.div``;

export const Title = styled.div`
  font-weight: 500;
  font-family: "LKSerif-Book";
  display: flex;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 20px;
  h2 {
    font-size: 21px;
    line-height: 30px;
    color: #000042;
    font-weight: 400;
    font-family: lenskartserif-normal;
  }
`;

export const LensOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -webkit-box-flex: 1;
  flex-grow: 1;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const LensSelectionCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const LensSelectionCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: initial;
  justify-content: space-between;
  background-color: var(--white);
  width: 100%;
  padding: 16px;
  gap: 8px;
  box-shadow: 0px 0px 12px rgba(0, 0, 66, 0.06);
  border-radius: 12px;
`;

export const ImageContainer = styled.div`
  img {
    width: 13.2vw;
  }
`;

export const TextContainer = styled.div`
  width: 64vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Text = styled.div<{ type?: string }>`
  font-size: ${(props) => (props.type === "primary" ? "16px" : "16px")};
  color: ${(props) => (props.type === "primary" ? "#000042" : "#99a0a9")};
  font-weight: ${(props) => (props.type === "primary" ? "700" : "400")};
  font-family: "LKSans-Regular";
  &.pkgTitle {
    font-family: var(--font-lkserif-normal);
  }
  &.frameTitle {
    font-size: 10px;
  }
  & strong {
    color: #27394e;
    font-family: "LKSans-Bold";
  }
`;
export const TextCoolGrey = styled.div<{ type?: string }>`
  font-size: ${(props) => (props.type === "primary" ? "12px" : "12px")};
  color: #66668e;
  font-weight: ${(props) => (props.type === "primary" ? "700" : "400")};
  font-family: "LKSans-Regular";
`;

export const AlertWrapper = styled.div<{ type?: string }>`
  color: rgb(0, 0, 0);
  display: flex;
  border: 1px solid #e2e2ee;
  border-radius: 12px;
  flex-direction: row;
  justify-content: flex-start;
  margin: 8px 0;
  padding: 14px 10px;
  gap: 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 143%;
  letter-spacing: 0.15px;
  align-items: center;
  color: #333368;
`;

export const IconContainer = styled.div`
  font-size: 30px;
  color: #18cfa8;
  font-weight: 700;
`;

export const PriceContainer = styled.div`
  background-color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.16);
  border-radius: 12px 12px 0 0;
  padding: 17px 12px;
  position: relative;
  bottom: 0px;
  left: 0px;
  flex-wrap: wrap;
  margin: 20px -15px -15px -15px;
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
`;
export const BuyNowContainer = styled.div`
  background-color: #11daac;
  color: #000042;
  display: flex;
  flex: 0.6;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  letter-spacing: 1px;
  font-weight: 500;
  font-size: 15px;
  padding: 5px 0;
  font-family: var(--font-lksans-bold);
  line-height: 32px;
  text-transform: uppercase;
`;

export const Img = styled.img``;

export const PowerIcons = styled.div`
  font-size: 39px;
  color: #358d84;
`;

export const Spacer = styled.div`
  display: inline-block;
  width: 4px;
`;

export const TextLink = styled.a`
  color: #000042;
  text-decoration: underline;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  font-family: lenskartsans-bold;
  span {
    margin-right: 4px;
  }
  img {
    padding: 0 5px;
  }
`;

export const BuyOnCallWrapper = styled.div`
  background: #fafafe;
  border: 1px solid #cecedf;
  padding: 10px;
  box-shadow: 0px 0px 12px rgba(0, 0, 66, 0.06);
  border-radius: 12px;
  a {
    border: none;
    margin: 0px;
    padding: 0px;
    display: flex;
    justify-content: space-between;
  }
  div {
    padding: 0px;
    font-family: "LKSans-Regular";
    font-size: 12px;
    line-height: 18px;
    color: #66668e;
  }
  h3 {
    font-size: 16px;
    line-height: 24px;
    font-family: "LKSerif-Book";
    color: #000042;
  }
`;
