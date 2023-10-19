import { DataType, LocaleDataType } from "@/types/coreTypes";

export interface RendererType {
  componentData: {}[];
  categoryCarouselsData: {}[];
  customCSS: string;
  configData: DataType;
  localeData: LocaleDataType;
  country?: string;
  className:string;
}
