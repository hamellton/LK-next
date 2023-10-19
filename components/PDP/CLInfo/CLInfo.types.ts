import { TypographyENUM } from "@/types/baseTypes";
import { DataType, LocalType } from "@/types/coreTypes";
import { PriceType } from "@/types/priceTypes";
import { OfferDetails } from "@/types/productDetails";

export interface CLInfoType extends LocalType {
  id: string;
  pid: number;
  font: TypographyENUM;
  wishListSelected: boolean;
  productName: string;
  productBrand: string;
  price: PriceType;
  triggerWishlist: (pid: number) => void;
  isRTL: boolean;
  showInfo: boolean;
  onInfoClick: () => void;
  isExchangeFlow?: boolean;
  children?: React.ReactNode;
  configData: DataType;
  taxInclusivePrice?: number | undefined;
  crossShell: { id: string; text: string }[] | [];
  showOfferBanner: boolean;
  offerDetails?: OfferDetails;
  desktopPriceFontBold?: boolean
}
