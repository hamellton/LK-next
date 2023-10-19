export enum CurrencySymbol {
	INR = "₹",
	SGD = "$",
	AED = "AED",
	SAR = "SAR",
	USD = "$",
}

export enum CurrencyType {
	INR = "INR",
	SGD = "SGD",
	AED = "AED",
	SAR = "SAR",
	USD = "USD",
}

export interface PriceType {
	symbol: CurrencySymbol;
	currency: CurrencyType;
	basePrice: number;
	lkPrice: number;
	firstFrameFreePrice: number;
}
