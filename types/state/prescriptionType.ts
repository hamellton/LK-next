interface updatePrescriptionData {
  prescriptionSavedManual: any;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

interface uploadImageType {
  imageUrl: string;
  error: string;
  pdImageURL: string;
}
export interface prescriptionType {
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  data: any;
  fetchPowerData: any;
  uploadImage: uploadImageType;
  updatePrescriptionDataInfo: updatePrescriptionData;
  prescriptionPage: string;
  prescriptionPageStatus: boolean;
  prevPrescriptionPage: string;
  storeSlots: any;
  bookSlot: any;
  clPrescriptionData: any;
  updatePrescriptionDataAdded: boolean;
  userName?: string;
}
