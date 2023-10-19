import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";
// import { devices } from "@lk/ui-library/src/helper";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fbf9f7;
`;

export const AddressBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #fbf9f7;
  margin: auto;
  max-width: 2000px;
  min-width: 900px;
  padding: 0 15%;
  gap: 40px;
  /* padding-bottom: 200px; */
  @media screen and (max-width: 1300px) {
    padding: 0 5%;
  }
  /* @media screen and (min-width: 1000px) and (max-width: 1600px) {
    margin: 0 5vw;
  } */
  /* @media screen and (max-width: 1240px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.9em;
  } */
`;

export const AddNewAddressContainer = styled.div`
  padding: 0 16px 120px;
`;

export const AddressesContainer = styled.div`
  padding: 0 16px 29px;
`;

export const AddressFormContainer = styled.div`
  padding: 0px 16px 120px;
  & #add-address-form {
    div:empty {
      display: none;
    }
    div.radioBtn {
      display: block;
    }
  }
`;

export const IconContainer = styled.span<{
  isRTL: boolean;
  setMargin?: boolean;
}>`
  ${(props) => (props.isRTL ? "transform : rotate(180deg)" : "")};
  ${(props) => (props.setMargin ? "margin-bottom: -3px;" : "")};
`;
export const IconContainerStudio = styled.span<{ isRTL: boolean }>`
  ${(props) => (props.isRTL ? "transform : rotate(180deg)" : "")};
  svg {
    path {
      stroke: #fff;
    }
  }
`;

export const NewAddressHeader = styled.div`
  background-color: white;
  height: 60px;

  display: flex;
  justify-content: space-between;
  padding: 20px;
  position: fixed;
  align-items: center;
  width: 100vw;
  z-index: 100;
  border-bottom: 1px solid #eee;
  svg {
    width: 14px;
    height: 14px;
    path {
      stroke: #27394e;
    }
  }
`;

export const AddressHeading = styled.div`
  font-family: ${TypographyENUM.lkSerifNormal};
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  color: #333368;
`;

export const Height = styled.div`
  height: 50px;
`;

export const EmptySpace = styled.div`
  padding: 50px;
`;

export const PowerCheckout = styled.label<{ margin: string }>`
  background: #f7f1de;
  border: 1px solid #ffe092;
  border-radius: 4px;
  padding: 16px;
  margin-top: ${(props) => props.margin};
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: #000042;
  display: flex;
  align-items: center;
  font-family: ${TypographyENUM.lkSansBold};
  svg {
    margin-right: 12px;
    path {
      stroke: #000042;
    }
  }
`;
