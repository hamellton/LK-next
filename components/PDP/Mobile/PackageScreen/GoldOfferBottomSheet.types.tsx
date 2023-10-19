import { CartInfoType } from "@/types/state/cartInfoType";

export interface GoldOfferBottomsheetTypes {
  sessionId?: string;
  configData?: any;
  cartInfo?: CartInfoType
  handleSection?: any;
  goldOfferPopup: {
    backgroundColor?: string;
    headline1?: string;
    headline2?: string;
    popUpText?: string;
    cta?: {
      text?: string;
      pid?: string;
    };
  };
}
