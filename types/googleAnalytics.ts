export interface triggerDataLayerOnPageViewPropsType {
  ecommerce: any;
  event: string;
  isPlano: boolean;
  clPowerSubmission: any;
  login_status?: string;
  country_code?: string;
  currency_code?: string;
}

export interface categoryType {
	item_id: string | number;
	item_name: string;
	coupon: string;
	affiliation: string;
	currency: string;
	discount: string | number;
	index: number | string;
	item_brand: string;
	item_category: string;
	item_category2: string;
	item_category3: string;
	item_category4: string;
	item_category5: string;
	item_list_id: string;
	item_list_name: string;
	item_variant: string;
	price: string;
	quantity: number | string;
}

export interface categoryGA3Type {
  name: string;
  id: string | number;
  price: string;
  brand: string;
  category: string;
  variant: string;
  list?: string;
  position?: number | string;
}

export interface viewCartGA4ProductType {
  item_id: string | number;
  item_name: string;
  coupon: string;
  alliliation: string;
  currency: string;
  discount: string | number;
  index: number;
  item_brand: number;
  item_category: string;
  item_category2: string;
  item_category3: string;
  item_category4: string;
  item_list_id: string;
  item_list_name: string;
  item_variant: string;
  price: string | number;
  quantity: number;
}

export interface addToWishListGA4Type {
  item_id: number;
  item_name: string;
  affiliation: string;
  coupon: string;
  currency: number;
  discount: number | string;
  index: number;
  item_brand: string;
  item_category: string;
  item_category2: string;
  item_category3: string;
  item_category4: string;
  item_list_id: string;
  item_list_name: string;
  item_variant: string;
  price: number | string;
  quantity: number;
}

export interface addToViewSimilarGA4Type {
  item_id: number;
  item_name: string;
  affiliation: string;
  coupon: string;
  currency: number;
  discount: number | string;
  index: number | string;
  item_brand: string;
  cta_flow_and_page: string;
  cta_name: string;
}

export interface viewPaymentGAType {
  item_id: string | number;
  item_name: string;
  coupon: string;
  alliliation: string;
  currency: string;
  discount: string | number;
  index: number;
  item_brand: number;
  item_category: string;
  item_variant: string;
  price: string | number;
  quantity: number;
  item_list_id: string;
  item_list_name: string;
}
