import { CategoryData } from "@/types/categoryTypes";
import {
  ConfigType,
  DataType,
  Exchange,
  ExchangeType,
  LocalType,
} from "@/types/coreTypes";
import { ProductTypeBasic } from "@/types/productDetails";

export interface CategoryType extends ConfigType, LocalType, ExchangeType {
  categoryData: CategoryData;
  productData: ProductTypeBasic[];
  configData: DataType;
  pageSize: number;
  pageCount: number;
  search?: boolean;
  windowHeight: number;
  isExchangeFlow?: boolean;
  returnOrderId?: number;
  returnItemId?: number;
  exchangeFlow: Exchange;
  userData: DataType;
}

type applyFiltersAttr = {
  item: DataType;
  selectedOption: DataType;
};

export interface DefaultPage {
  pageCount: number;
  pageSize: number;
}

export interface BackTopTypes {
  gotoTop: () => void;
  scrollPosition: number;
  isRTL: boolean;
}
