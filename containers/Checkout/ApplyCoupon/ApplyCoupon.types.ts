import { TypographyENUM } from "@/types/coreTypes";
import React from "react";
// import { TypographyENUM } from "../../../../Types/general";

export interface ApplyCouponTypes {
	id?: string
	width?: number
	headText?: string
	subText?: string
	onClick?: () => void
	onRemoveClick? : () => void
	font?: TypographyENUM
	isApplied: boolean,
	children: React.ReactNode,
	isMobileView: boolean,
	isRTL: boolean;
}
