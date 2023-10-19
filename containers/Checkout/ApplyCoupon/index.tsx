import React from "react";
import {
  ApplyCouponWrapper,
  RightWrapper,
  FlexWrapper,
  FlexColWrapper,
  HeadText,
  SubText,
  IconWrapperButton,
} from "./styles";
import { ApplyCouponTypes } from "./ApplyCoupon.types";
import { Icons } from "@lk/ui-library";
import { kindENUM, ThemeENUM } from "@/types/baseTypes";
import { TypographyENUM } from "@/types/coreTypes";
import { Button } from "@lk/ui-library";
// import { RightArrow } from "../../../../Icons";
// import { ThemeENUM, TypographyENUM } from "../../../../Types/general";
// import { kindENUM } from "../../Button/Button.types";
// import { Button } from "../../../..";

/**
 * Default ApplyCoupon Component
 */
const NewAddressField = ({
	id,
	width,
	headText,
	subText,
	onClick,
	onRemoveClick,
	font,
	isApplied,
	children,
	isMobileView,
  isRTL=false
}: ApplyCouponTypes) => {
	return (
		<ApplyCouponWrapper isMobileView={isMobileView} id={id} width={width} onClick={onClick}>
			<FlexWrapper>
				<FlexColWrapper>
					<HeadText styleFont={font}>{headText || children}</HeadText>
					{/* <SubText styleFont={font} isApplied={isApplied}>{subText}</SubText> */}
				</FlexColWrapper>
				<RightWrapper>
					<IconWrapperButton isRTL={isRTL}><Icons.RightArrow/></IconWrapperButton>
				</RightWrapper>
			</FlexWrapper>
		</ApplyCouponWrapper>
	);
};
export default NewAddressField;
