import { DataType } from "../coreTypes";

export interface CartInfoType {
  cartIsLoading?: boolean;
  cartIsError?: boolean;
  cartErrorMessage?: string;
  cartPopupError?: boolean;
  isGvApplied?: boolean;
  taxMessage: string;
  applicableGvs: Array<applicableGvObject>;
  cartCount: number;
  cartQty: number; //need to change this to data required in future only
  cartItems?: CartItemType[];
  cartTotal?: CartTotalType[];
  cartSubTotal?: number;
  currencyCode: string;
  appliedSc: DataType[];
  offerDetails: OfferDetails | string;
  offerBanner: {
    offerUrl: string;
    offerId: string;
    title?: string;
    image?: string;
  } | null;
  cartItemsCount?: number;
  cartItemsQty?: number;
  isLoading?: boolean | string;
  isError?: boolean | string;
  errorMessage?: string;
  cartStatusCode?: number;
  couponError: boolean;
  appliedGv: {
    code: string;
    amount: number;
  };
  hasOnlyCLProduct: boolean;
  lkCash: {
    applicableAmount: number;
    isApplicable: boolean;
    moneySaved: number;
    totalWalletAmount: number;
  };
  hasBogoLimitExceeded: boolean;
  bogoNotAppliedMessage: string;
  payLaterAllowed: boolean;
  cartId: number;
  studioFlow: boolean;
}

interface OfferDetails {
  offerImage: string;
  stickyOfferImage: string;
  headline1: string;
  headline2?: string;
  headline3: string;
  colorCode: string;
  showTax: boolean;
  shimmer: boolean;
  pid?: string;
  icon: string;
  offerPrice: number;
  ctaLink?: string;
  ctaText?: string;
}
export interface CartTotalType {
  label: string;
  amount: number;
  type: CartAmountType;
}

export enum CartAmountType {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  FREE = "free",
  TOTAL = "total",
  SUBTOTAL = "subtotal",
}

export interface CartItemType {
  price: any;
  classification: string;
  id: number | string;
  itemType: string;
  itemId: number;
  itemUrl: string;
  itemImg: string;
  itemModel: string;
  itemClassification: string;
  itemQty: number;
  itemPowerRequired: string;
  itemPrescriptionView: CartPrescriptionType;
  itemFrameType: string;
  itemLensType: string;
  itemLensCategory: string;
  showRibbon: boolean;
  ribbonMessage: string;
  showOfferMessage: boolean;
  offerMessage: string;
  itemPriceObj: CartItemPriceType;
  addOnPriceObj: CartItemPriceType | null;
  extraDetails: any;
}

export interface CartItemPriceType {
  showStrikeOffPrice: boolean;
  strikeOffPrice: number;
  itemPrice: number;
  itemName: string;
}

export interface CartPrescriptionType {
  showPd: boolean;
  pdConfigAvailable: boolean;
  powerType?: string;
  left?: PrescriptionViewType;
  right?: PrescriptionViewType;
  notes?: string;
  gender?: string;
  dob?: string;
  labels?: DataType;
}
export interface PrescriptionViewType {
  sph: string;
  boxes: number;
}

export interface applicableGvObject {
  paymentOffer?: boolean;
  code: string;
  priority: number;
  description: string;
  termsAndConditions: string;
  autoApplicable: boolean;
  heading: string;
}

export interface DiscountObject {
  label: string;
  type: string;
  amount: number;
}

export interface TaxObject {
  name: string;
  amount: number;
}
