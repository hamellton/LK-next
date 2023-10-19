import { DataType } from "@/types/coreTypes";

export type RetryType = {
  oid?: string;
  eid?: string;
  localeData: DataType;
  isRTL?: boolean;
};
