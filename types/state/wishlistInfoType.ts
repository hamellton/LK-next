export interface WishlistInfoType {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  numberOfProducts: number;
  productIds: Array<string>;
  productList: Array<object> | any;
  showWishList: boolean;
  isRemoved: boolean;
  calledUrl: string;
}
