import { PowerTypeList } from 'containers/ProductDetail/ProductDetail.types';
import { FontType, LocalType } from './../../../types/coreTypes';

export interface CLSelectPowerType extends LocalType, FontType {
    productId: number;
    powerTypeList: PowerTypeList[] | []
    isJitProduct: boolean;
    isPlano: boolean;
    sessionId: string;
}