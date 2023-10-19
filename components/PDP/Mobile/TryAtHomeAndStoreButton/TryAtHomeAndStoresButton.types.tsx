import { DataType } from "@/types/coreTypes";
import { ProductDetailType } from "@/types/productDetails";

export interface TryAtHomeAndStoresButtonTypes  {
	localeData: DataType,
	isDittoEnabled: boolean
	type: string,
	configData: any,
	isContactLens?: boolean
}