import { CheckoutTypes } from "@/types/baseTypes";
import { DataType } from "@/types/coreTypes";

export interface AddressObjectType {
  addressline1: string;
  addressline2: string;
  city: string;
  country: string;
  firstName: string;
  landmark: string;
  lastName: string;
  phone: string;
  postcode: string;
  phoneCode: string;
  state: string;
  id: number;
  addressLabel: string;
  updated?: number;
  created?: number;
  defaultAddress?: boolean;
  floor?: number;
  liftAvailable?: boolean;
  gender?: string | null;
  addressType?: string;
}

export interface CartObjectType {
  address: {
    addressline1: string;
    addressline2: string;
    city: string;
    country: string;
    firstName: string;
    landmark: string;
    lastName: string;
    phone: string;
    postcode: string;
    state: string;
    id: number;
    updated?: number;
    created?: number;
    defaultAddress?: boolean;
    floor?: number;
    liftAvailable?: boolean;
  };
  giftMessage: string | null;
}
export interface AddressObjectBodyType {
  addressline1: string;
  addressline2: string;
  city: string;
  country: string;
  firstName: string;
  landmark: string;
  lastName: string;
  phone: string;
  postcode: string;
  state: string;
  id: number;
  defaultAddress?: boolean;
  floor?: number;
  liftAvailable?: boolean;
}
export interface CartAddressObjectType {
  addressline1: string;
  addressline2: string;
  city: string;
  country: string;
  firstName: string;
  landmark: string;
  lastName: string;
  phone: string;
  postcode: string;
  state: string;
  id: number;
  defaultAddress?: boolean;
  floor?: number;
  liftAvailable?: boolean;
}

export interface CheckoutType {
  addressData: Array<AddressObjectType>;
  countryStateData: {
    country: Array<{ country_name: string; country_code: string }>;
    states: Array<string>;
  };
  sessionId: string;
  localeData: DataType;
  configData: DataType;
  step?: CheckoutTypes;
  userData?: DataType;
  phoneCode: string;
  isReturnRefund?: boolean;
  isExchange?: boolean;
  oid?: string;
  eid?: string;
  setEditAddress?: (props: boolean) => void;
  isOrderDetailPage?: boolean;
}
