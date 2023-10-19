import styled from "styled-components";

export const AddOnsModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #eaeff4;
  gap: 12px;
`;

export const AddOnsHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 0 15px;
`;

export const Text = styled.div`
  font-size: 14px;
  text-transform: capitalize;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  &.coating-skip {
    text-decoration: underline;
    font-size: 11px;
    text-transform: uppercase;
  }
`;
export const Heading = styled.h2`
  font-weight: 400;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  font-size: 18px;
`;
export const AddOnsContainer = styled.div`
  padding: 0px 15px 0 15px;
`;
export const AddOnCard = styled.div`
  background-color: var(--white);
  padding: 10px;
  img {
    max-width: 100%;
  }
`;
export const AddOnCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const AddCTA = styled.div<{ added?: boolean }>`
  font-size: 14px;
  text-align: center;
  padding: 5px 10px;
  border-radius: 4px;
  color: var(--white);
  background-color: ${(props) => (!props.added ? "#fd6b0b" : "#18cfa8")};
`;
export const Title = styled.div`
  color: #27394e;
  font-weight: 700;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  font-size: 14px;
`;
export const CardPrice = styled.span`
  color: #18cfa8;
`;
export const AddOnsFooter = styled.div`
  padding: 10px;
  background-color: var(--white);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const FooterText = styled.div`
  flex: 0.6;
  display: inline-flex;
  flex-direction: column;
  margin-left: 0px;
  font-size: 16px;
`;
export const FooterPrice = styled.span`
  color: #99a0a9;
  font-weight: 400;
`;
export const FooterAmount = styled.span`
  font-weight: 700;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
`;
export const FooterSubtext = styled.div`
  font-weight: 400;
  font-size: 10px;
  color: #99a0a9;
`;
export const FooterCTA = styled.div`
  background-color: #18cfa8;
  color: var(--white);
  padding: 10px 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border-radius: 4px;
  font-size: 18px;
  font-family: roboto slab, sans-serif, arial, helvetica, sans-serif;
  font-weight: 700;
`;
