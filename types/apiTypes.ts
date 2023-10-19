import { ErrorType, PageTypes } from "./baseTypes";
import { DataType, Exchange } from "./coreTypes";
import { HeaderType } from "./state/headerDataType";

export enum APIMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface ResponseData {
  data: DataType;
  error: ErrorType;
  pageType: PageTypes;
  configData: DataType;
  redisData: DataType;
  localeData: DataType;
  headerData: HeaderType;
  sessionId: string;
  exchangeFlow: Exchange;
  homePageJson: DataType;
  userData: DataType;
  noResultData?:DataType;
}
