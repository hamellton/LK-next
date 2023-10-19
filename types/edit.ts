import { DataType, LocaleDataType } from './coreTypes';
import { HeaderType } from './state/headerDataType';

export interface AccountInformationType {
	localeData: LocaleDataType;
	userData: DataType;
	headerData: HeaderType;
	configData: DataType;
}
