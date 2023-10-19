export interface AuthInfoType {
  isSignIn: boolean;
  isSignUp: boolean;
  signInStatus: SignInStatusType;
  signUpStatus: any;
  dualLoginStatus: any;
  searchBar: boolean;
  openSignInModal: boolean;
  inViewPort: boolean;
}

export enum SignInType {
  EMAIL = "email",
  PHONE = "phone",
}
export interface SignInStatusType {
  type: SignInType;
  showLogin: boolean;
  showOTP: boolean;
  sendOTP: boolean;
  showPassword: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  otpSent: boolean;
  isCaptchaRequired: boolean;
  isCaptchaVerified: boolean;
  captchaResponse: string | null;
  isRedirectToSignup: boolean;
}
