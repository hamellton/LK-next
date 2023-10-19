import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";
import { IconImage } from "./MsiteAccordianPaymentAE";
import { Radio } from "./SelectField";
import { Icons } from "@lk/ui-library";

const CardContainer = styled.div<{
  bankoffer?: boolean;
  dottedBtmBorder?: boolean;
  dottedTopBorder?: boolean;
  isOpen?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: ${(props) =>
    props.bankoffer || props.isOpen ? "flex-start" : "center"};
  justify-content: space-between;
  padding: 16px;
  flex-direction: ${(props) =>
    props.bankoffer || props.isOpen ? "column" : "row"};
  gap: 16px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  background: ${(props) =>
    props.isOpen ? "#fff" : props.disabled ? "#D3D3D3" : "var(--white)"};
  ${(props) =>
    props.dottedTopBorder
      ? `
      border-top: 1px dashed #d3d3d3;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `
      : ""}
  ${(props) =>
    props.dottedBtmBorder
      ? `
      border-bottom: 1px dashed #d3d3d3;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    `
      : ""}
			&.payLaterCard {
    border-bottom: none;
    padding-bottom: 22px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    display: block;
  }
  &.payLaterCard + .payLaterCard {
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    margin-top: -7px;
    padding-bottom: 16px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      right: 0px;
      bottom: 100%;
      background: #fff;
      height: 8px;
      margin-bottom: 1px;
    }
  }
  ${(props) => (props.isOpen ? "background-color: #F5F5FF;" : "")};
`;
const PayLaterButtonWrapper = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: right;
  flex-direction: column;
  button {
    margin-top: 0px;
  }
`;
const PayLaterInnerButton = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: right;
  gap: 15px;
  button {
    margin-top: 0px;
  }
`;

const Flex = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  margin: -16px;
  padding: 16px;
  width: 100%;
  height: 100%;
  :hover {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }
`;
// const LeftSection = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     justify-content: space-between;
// `;

const PrimerCradContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: 35px;
`;
const CardHeading = styled.h3<{ isMain?: boolean }>`
  font-family: ${(props) =>
    props.isMain ? TypographyENUM.lkSansBold : TypographyENUM.lkSansRegular};
  font-style: normal;
  font-size: 14px;
  display: block;
  margin-left: 16px;
  letter-spacing: -0.02em;
  color: var(--text);
  flex: none;
  ${(props) =>
    props.isMain
      ? `
      line-height: 38px;
    `
      : `
    line-height: 20px;
    `}
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const CardInfoText = styled.p<{ isWallet?: boolean }>`
  font-family: ${(props) =>
    props.isWallet ? TypographyENUM.lkSansBold : TypographyENUM.lkSansRegular};
  font-style: normal;
  /* font-weight: ${(props) => (props.isWallet ? 700 : 400)}; */
  font-size: 12px;
  line-height: ${(props) => (props.isWallet ? "20px" : "18px")};
  letter-spacing: -0.02em;
  color: ${(props) => (props.isWallet ? "#489B1C" : "#66668E")};

  margin-left: 16px;
  margin-top: 5px;
`;
// const RightSection = styled.div`
//   display: flex;
// `;
// const RightSectionText = styled.span`
//   margin-right: 10px;
//   font-family: ${TypographyENUM.lkSansRegular};
//   font-style: normal;
//   font-size: 12px;
//   line-height: 18px;
//   letter-spacing: -0.02em;
//   color: #333368;
// `;
const UL = styled.ul`
  margin-left: 1em;
  margin-top: 4px;
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: #66668e;
  min-height: 32px;
`;
const Underline = styled.span`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  text-decoration-line: underline;
  color: #000042;
`;
const HeadContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
`;

const ContactLensConatiner = styled.div`
  display: flex;
  flex-direction: column;
`;
export const PayNowBtn = styled.button<{
  font: TypographyENUM;
  checked: boolean;
  isContactLensConsentEnabled?: boolean;
}>`
  margin-top: 20px;
  padding: 12px 20px;
  width: 250px;
  height: 48px;
  border-radius: 100px;
  background: ${(props) =>
    props.isContactLensConsentEnabled
      ? props.checked
        ? "var(--vivid-green-100)"
        : "#E4E4E4"
      : "#11DAAC"};
  color: #000042;
  cursor: pointer;
  font-family: ${(props) => props.font};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.02em;
  outline: none;
  border: none;
  &:disabled,
  &.disabled {
    color: #9999b3;
    background: #dbdbea;
    pointer-events: none;
    cursor: disabled;
  }
  span {
    display: inline-flex;
    margin-right: 10px;
    svg {
      width: 6px;
      height: 12px;
      path {
        stroke: #000042;
      }
    }
  }
  .disable {
    pointer-events: none;
  }
`;

export const Children = styled.div`
  width: 60%;
  margin-left: auto;
`;

export const Image = styled.img`
  margin-left: 15px;
  margin-right: 10px;
`;

const RadioModal = ({ data, disabled, logoImageUrl }: any) => {
  return (
    <CardContainer
      id="card-container--ae"
      isOpen={data.isChildrenVisible}
      disabled={disabled}
    >
      <Flex onClick={disabled ? () => null : data.onSelect} disabled={disabled}>
        <Radio isSelected={data.isChildrenVisible} disabled={disabled} />
        <IconImage leftMargin>
          <Icons.PayByCard />
        </IconImage>
        {!data.text ? (
          <CardHeading isMain>{data.head}</CardHeading>
        ) : (
          <HeadContainer>
            <CardHeading>{data.head}</CardHeading>
            <CardInfoText>{data.text}</CardInfoText>
          </HeadContainer>
        )}
      </Flex>
      <Children>{data.isChildrenVisible ? data.children : null}</Children>
      {/* <StoreCreditForm isOpen={data.isChildrenVisible} onSubmit={data.onSubmit} isRemainingAmount={data.isRemainingAmount} message={data.message} isError={data.isError} /> */}
    </CardContainer>
  );
};

export default RadioModal;
