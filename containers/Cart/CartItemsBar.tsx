import { DataType, TypographyENUM } from "@/types/coreTypes";
import { Flex, HeadingText } from "pageStyles/CartStyles";
import React from "react";
import styled from "styled-components";
interface CartItemsBar {
  text: string;
  showNeedHelp: boolean;
  onNeedHelpClick: () => void;
  needHelpLink: string | null;
  localeData: DataType;
}
const TextLink = styled.a`
  color: #000042;
  text-decoration: underline;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  font-family: "LKSans-Bold";
  span {
    margin-right: 2px;
  }
  img {
    padding: 0 5px;
  }
`;
const CartItemsBar = ({
  text,
  showNeedHelp,
  onNeedHelpClick,
  needHelpLink,
  localeData,
}: CartItemsBar) => {
  return (
    <Flex>
      <HeadingText styledFont={TypographyENUM.lkSansRegular} isMobileView>
        {text}
      </HeadingText>
      {showNeedHelp && (
        <div className="bora-4 text-center need-help-btn">
          <TextLink
            className="fsp14 text-color_topaz"
            href={needHelpLink || undefined}
            onClick={onNeedHelpClick}
          >
            <div>
              <span>
                <img
                  alt={localeData?.PHONE_NUMBER}
                  src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/WhatsappIcon.svg"
                />
              </span>
              {localeData?.NEED_HELP}?
            </div>
          </TextLink>
        </div>
      )}
    </Flex>
  );
};

export default CartItemsBar;
