import { DataType, FontType, LocalType } from "@/types/coreTypes";
import { PowerTypeList } from "containers/ProductDetail/ProductDetail.types";

export interface NewCLSelectPowerType extends LocalType, FontType {
  productId: number;
  powerTypeList: PowerTypeList[] | [];
  isJitProduct: boolean;
  isPlano: boolean;
  sessionId: string;
  productData: any;
  configData: DataType;
}
