import { DataType, LocaleDataType, LocalType } from './coreTypes';
import { HeaderType } from './state/headerDataType';

export interface NotificationType {
	localeData: LocaleDataType;
	userData: DataType;
	headerData: HeaderType;
	configData: DataType
}
