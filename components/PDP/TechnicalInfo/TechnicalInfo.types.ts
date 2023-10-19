import { LocalType } from "@/types/coreTypes";
import { ProductInfo } from "@/types/productDetails";

export interface TechnicalInfoType extends LocalType {
  id: string;
  data: ProductInfo[];
  newGeneralProductInfo: any;
}
