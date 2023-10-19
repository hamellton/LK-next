import { LocaleDataType } from "@/types/coreTypes";
import { DataType } from "@/types/coreTypes";
import { ProductDetailType } from "@/types/productDetails";

export interface ProductDeliveryMobileType {
  localeData: LocaleDataType;
  type?: string;
  configData: DataType;
  pid?: number;
}
