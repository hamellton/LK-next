import styled from "styled-components";

export const CLBuyingOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
  height: 100%;
  /* height: 100vh; */
  background-color: #eaeff4;
  font-family: Sans-serif Arial, Helvetica, sans-serif;
`;
export const HeaderContent = styled.div`
  box-shadow: 0 2px 2px 0px rgb(148 150 159 / 30%);
  background-color: var(--white);
  /* position: fixed; */
  top: 0;
  width: 100vw;
  z-index: 100;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 20px 10px;
`;

export const CLBuyingOptionContent = styled.div`
  padding: 5px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
`;

export const CLBuyingOptionFooter = styled.div`
  background-color: var(--white);
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const LeftFooterSection = styled.div`
  width: 80%;
`;
export const RightFooterSection = styled.div`
  width: 100%;
`;

export const RenderOneTimeOrderContainer = styled.div`
  border: 1px solid #18cfa8;
  padding: 20px 10px;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 5px;
`;

export const OneTimeHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: var(--black);
  font-weight: 700;
  font-size: 14px;
`;

export const SelectIcon = styled.div``;
export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const OneTimeContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const PowerBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

export const PowerBoxHeading = styled.div`
  font-size: 14px;
  text-transform: capitalize;
`;

export const Text = styled.div<{
  color?: string;
  fontSize?: string;
  text?: string;
}>`
  color: ${(props) => props.color || "var(--black)"};
  font-size: ${(props) => props.fontSize || "14px"};
  line-height: 20px;
  font-weight: ${(props) => (props.text === "primary" ? "700" : "400")};
  font-family: "Roboto";
`;

export const PowerIncrementDecrement = styled.div`
  display: flex;
  gap: 5px;
`;
export const IncrementDecrementButton = styled.div<{ disable?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  font-size: 20px;
  border: 1px solid;
  color: ${(props) => (props.disable ? "#eaeff4" : "#27394e")};
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eaeff4;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);
  pointer-events: ${(props) => (props.disable ? "none" : "auto")};
`;

export const SubscriptionInfoWrapper = styled.div`
  padding: 20px 10px;
`;
export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
`;
export const OfferLabel = styled.div`
  background-color: #99a0a9;
  padding: 10px;
  color: var(--white);
  font-size: 12px;
  text-align: center;
`;

export const CLAddOnCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: var(--white);
  padding: 15px 10px;
  border-radius: 5px;
`;

export const Image = styled.img`
  width: 30%;
`;
export const ImageContainer = styled.div<{ url?: string }>`
  background-image: ${(props) => `url(${props.url})`};
  width: 20%;
  height: 100%;
  background-position: 50%;
  background-size: 200%;
  background-repeat: no-repeat;
`;
export const AddOnContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
export const AddOnRightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
export const ButtonQtyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
