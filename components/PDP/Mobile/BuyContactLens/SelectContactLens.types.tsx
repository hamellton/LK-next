import { DataType } from "@/types/coreTypes";

export interface SelectContactLensEyeTypes {
	dataLocale?: DataType
	onClickSelectEye: (qty: number, eye: string) => void
}