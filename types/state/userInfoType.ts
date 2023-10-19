export interface UserInfoType {
  userLoading: boolean;
  userError: boolean;
  userErrorMessage: string;
  sessionId: string;
  isLogin: boolean;
  mobileNumber: number | null;
  email: string;
  cartId: string[];
  cartItemCount: number;
  userDetails?: UserInfoDetailType;
  isGuestFlow: boolean;
  guestEmail: string;
  guestNumber: string | null;
  isWhatsappOptingLoading?: boolean;
  whatsAppOptingStatus?: boolean;
  whatsAppChecked: boolean;
  phoneCapture: {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    phoneCapturedSuccess: boolean;
  };
}

export interface UserInfoDetailType {
  id: number;
  firstName: string;
  lastName: string;
  hasPlacedOrder: boolean;
  isActive: boolean;
  dittos: string[];
  cygnus: any;
  gender: string;
  type: string;
  telephoneVerified: boolean;
  emailVerified: string;
  walletVerified: boolean;
  whatsAppConsent: boolean;
  yearlyLoyaltyCount: number;
  monthlyLoyaltyCount: number;
  marketingEmail: boolean;
  marketingPushNotifications: boolean;
  marketingSMS: boolean;
  marketingWhatsApp: boolean;
  searches?:RecentSearchType[];
  isLoyalty: boolean;
  tierLabel: string;
  loyaltyExpiryDate: number;
  tierName: string;
}


export interface RecentSearchType{
  objectID:any;
label:string;
thumbnailUrl?:string;
query?:string;
}
export interface SignInStatus {
  type: string | null;
  showOPT: boolean;
  optSent: boolean;
  showPassword: boolean;
  passwordEntered: boolean;
  signInStatus: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export interface PhoneCaptureTypes {
  sessionId: string;
  UTM: string;
  created_at: Date;
  device_id: string;
  is_verified: number;
  phone: string;
  phoneCode: string;
  platform: string;
}

export interface abandonedLeadsType {
  cartId: number;
  device: string;
  mobileNumber?: string;
  paymentMethod?: string;
  phoneCode: string;
  step: number;
  sessionId: string;
}
