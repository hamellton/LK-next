import { ConfigType, LocalType } from "@/types/coreTypes";
import { ProductDetailType } from "@/types/productDetails";

export interface PackageType extends LocalType, ConfigType {
  id: string;
  sessionId: string;
  productDetailData: ProductDetailType;
  addToCartNoPowerHandler: (powerType?: string) => void;
  showPowerTypeModal: boolean;
  onPowerModalClose: (status: boolean) => void;
  isExchangeFlow?: boolean;
  currentSelection?: string;
  showPackageScreen?: boolean;
  setShowPackageScreen?: (props: any) => void;
  showSelectLens?: (props: void) => void;
}
