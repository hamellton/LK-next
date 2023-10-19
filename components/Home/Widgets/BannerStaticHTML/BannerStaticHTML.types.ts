import { DataType } from "@/types/coreTypes";

export interface BannerStaticHTMLType {
  bannerData: DataType;
  id: string;
  style: {};
  customCSS: string;
  className?: string;
  isRTL?:boolean;
}
