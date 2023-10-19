import { DataType, LocaleDataType } from './coreTypes';
import { HeaderType } from './state/headerDataType';

export interface PrescriptionTypes {
	localeData: LocaleDataType;
	userData: DataType;
	headerData: HeaderType;
	configData: DataType;
}
