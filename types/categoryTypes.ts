import { ErrorType, SEOType } from './baseTypes';

export interface defaultCategoryParams {
	pageCount: number;
	pageSize: number;
}

export interface CategoryParams {
  key: string;
  value: string[] | string;
}

export interface BreadCrumbType {
	label: string;
	link: string;
}

export interface CategoryData extends ErrorType {
	breadcrumb: BreadCrumbType[];
	productCount: number;
	categoryOffer: string;
	categoryName: string;
	categoryType: string;
	subCategories: string;
	showCategoryImage: boolean;
	categoryImage: string;
	isDitto: boolean;
	ageGroup: string;
	seo: SEOType;
	categoryPowerUrl: [];
	urlKey: string;
	urlPath: string;
	categorySubType: string;
	isPersonalization: boolean;
	parentHashtagList: string;
	description:string;
}
