import { DataType, LocalType } from "@/types/coreTypes";
import { HeaderType } from "@/types/state/headerDataType";
import { ReactNode } from "react";

export interface BaseType extends LocalType {
  children: ReactNode;
  sessionId: string;
  headerData: HeaderType;
  isExchangeFlow: boolean;
  hideFooter?: boolean;
  // footerDataMobile: any,
  baseContainerStyles?: DataType;
  sprinkularBotConfig?: () => void;
  trendingMenus: Array<{ text: string; link: string }>;
  languageSwitchData: { link: string; text: string; enable?: boolean };
  topLinks: {left: {label: string, url: string}, right: {label: string, url: string}},
  configData: DataType;
  pageType: string;
}
