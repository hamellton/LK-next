import { ConfigType, DataType } from "../../../types/coreTypes";
import { GridImageType } from "@/types/productDetails";

export interface ImageGridType extends ConfigType {
  gridImages: GridImageType[];
  id: string;
  sessionId: string;
  dataLocale: DataType;
  altText?:string
}
