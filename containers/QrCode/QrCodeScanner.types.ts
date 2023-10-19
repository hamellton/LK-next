import { DataType } from "@/types/coreTypes";

export interface QrScannerTypes {
  onClose: () => void;
  showSearch: boolean;
  sessionId: string;
  localeData: DataType;
}
