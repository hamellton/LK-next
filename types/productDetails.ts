import { SEOType, ThemeENUM } from "./baseTypes";
import { BreadCrumbType } from "./categoryTypes";
import { PriceType } from "./priceTypes";
import { ReviewsType } from "./reviewTypes";

export interface ARModelType {
  android: string | null;
  ios: string | null;
}

export interface imageHoverType {
  url: string;
  frontURL: string;
  hoverURL: string;
}

export interface ColorOptionType {
  id: number;
  color: string;
  colorID: number;
  productURL: string;
  price: PriceType;
  arModel: ARModelType;
  productImage: imageHoverType;
}

export interface PrescriptionType {
  id: string;
  title: string;
  imageUrl: string;
  subText: string;
  isPackageAvailable: boolean;
}

/**
 * TODO - Change Classification to ENUM
 */

export interface ProductTypeBasic {
  id: number;
  size: string;
  productName: string;
  showProductRating: boolean;
  productRating: number;
  showPurchaseCount: boolean;
  purchaseCount: number;
  showWishlistCount: boolean;
  wishListCount: number;
  tags: string;
  isColorOptionExtra: boolean;
  colorOptionExtraCount: number;
  classification: string;
  productURL: string;
  productURLWithoutDomain: string;
  prescriptionType: PrescriptionType[];
  productImage?: imageHoverType;
  price: PriceType;
  colorOptions: ColorOptionType[];
  offerText: string;
  isDitto: boolean;
  sku: string;
}

export interface ProductDetailType extends ProductTypeBasic {
  sku?: string;
  productModelName?: string;
  thumbnail?: string;
  relatedItems: any[];
  isQuickCheckout?: boolean;
  cmsLinkAndroid?: string;
  sellerLabel?: string;
  isCygnusEnabled: boolean;
  frameDetails?: [];
  gridImages: GridImageType[];
  imageUrlDetail: imageUrlDetailType[];
  seo: SEOType;
  clLegalreqDetails?: string;
  breadcrumb: BreadCrumbType[];
  generalProductInfo: ProductInfo[];
  technicalProductInfo: ProductInfo[];
  brandName: string;
  type: string;
  reviews: ReviewsType;
  richContent: string;
  prescriptionType: PrescriptionType[];
  isTryOnEnabled: boolean;
  addToCartButtons: AddToCartButtonType[];
  frameType: string;
  productQuantity?: Number;
  jit: boolean;
  isPlano: boolean;
  isDitto: boolean;
  offerDetails: OfferDetails;
  totalNoOfRatings?: string;
  crossSells: { id: string; text: string }[] | [];
  color?:string
}

export interface OfferDetails {
  offerImage: string;
  stickyOfferImage: string;
  headline1: string;
  headline2: string;
  colorCode: string;
  showTax: boolean;
  shimmer: boolean;
  icon: string;
  offerPrice: number;
}

export enum PackageENUM {
  POWER = "power",
  PACKAGES = "packages",
  EYESIGHT = "eyeSight",
}

export interface PackageStepsType {
  type: PackageENUM;
  selectedText: string;
  heading: string;
  showSection: boolean;
  isActive: boolean;
}

export interface AddToCartButtonType {
  primaryText: string;
  secondaryText?: string;
  onlyLens: boolean;
  withPower: boolean;
}

export interface GridImageType {
  id: number;
  imageUrl: string;
}
export interface imageUrlDetailType {
  label: string;
  imageUrl: string;
}

export interface ProductInfo {
  name: string;
  name_en: string;
  value: string | number;
  showAdditionalInfo: boolean;
  additionalInfoUrl: string | null;
}
