import { ConfigType, ExchangeType, FontType } from './../../types/coreTypes';
import { LocalType } from "@/types/coreTypes";
import { ProductDetailType } from "@/types/productDetails";
import { CategoryData } from "@/types/categoryTypes";

export interface ReviewCardType extends FontType  {
    id: string;
    title: string;
    desc: string;
    userName: string;
    date: string;
    rating: number;
    images: string[];
}

export interface ProductDetailTypes extends LocalType, ConfigType, ExchangeType {
    productDetailData: ProductDetailType;
    reviewsData?: ReviewCardType;
    id: string;
    sessionId: string;
    wishListData: string[] | null;
    categoryData: CategoryData;
}

export enum DirectionENUM {
    left = "left",
    right = "right",
}

export interface PowerTypeList {
    inputType: string;
    label: string;
    powerDataList: { value: string[]; price: number }[];
    type: string;
}