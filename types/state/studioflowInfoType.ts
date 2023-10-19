import { DataType } from "../coreTypes";

export interface StudioFlowInfoType {
  isLoading: boolean;
  stores: Store[];
  searchResults: Store[];
  userInfo: UserInfo;
  error: ErrorType;
  searchValue: string;
  isAvailable: boolean;
  timeSlots: any;
  selectedStore: any;
  isStoreSelected: boolean;
  timeSlotsData: any;
  bookSlotData: any;
  bookAppointment: any;
  updateShippingAddress: {
    isError: boolean;
    errorMsg: string;
  };
}

type ErrorType = {
  isError: boolean;
  message: string;
  status: number;
};

export type Store = {
  code: string;
  storeType: string;
  name: string;
  address: string;
  openingTime: string;
  closingTime: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  telephone: string;
  phoneCode: string;
  longitude: string;
  latitude: string;
  url: string;
  shortUrl: string;
  googleUrl: string;
  pincode: string;
  email: string;
  updatedAt?: number;
  isAvailable: boolean;
  geoDistance: number;
};

type UserInfo = {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  phoneCode: string;
  email: string;
};

const json = {
  phone: "69085502",
  email: "wismaatria@lenskart.sg",
  addressType: "billing",
  addressline1:
    "# B1-15, Wisma Atria, 435 Orchard Road, Orchard Road, Singapore, Singapore, 238877",
  addressline2: "-",
  city: "Singapore",
  country: "SG",
  firstName: "Wisma",
  gender: "",
  state: "Singapore",
  phoneCode: "+65",
  postcode: "238877",
};

const json2 = {
  firstName: "sa",
  lastName: "ty",
  email: "satyam@dua.com",
  phone: "66666666",
  phoneCode: "+65",
};
