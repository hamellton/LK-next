import { DataType, LocaleDataType } from "@/types/coreTypes";

export interface CategoryCarouselType {
  categoryData: DataType;
  homeJsonCategory: DataType;
  style: {};
  localeData: LocaleDataType;
  isRTL?: boolean;
  className?: string;
}
