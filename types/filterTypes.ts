export enum FilterViewTypes {
  CHECKBOX = "CHECKBOX",
  IMAGE_SELECTION = "IMAGE_SELECTION",
}

export interface FilterOption {
  title: string;
  id: string;
  productsCount: number;
  imageUrl?: string;
  colorCode?: string;
}

export interface FilterItemType {
  title: any;
  name: string;
  id: string;
  type: FilterViewTypes;
  options: FilterOption[];
  canCollapse: boolean;
  showBorderTop: boolean;
  selectedOption: string[];
}

export interface FilterType {
  categoryInfo: string;
  productCount: number;
  filters: FilterItemType[];
}
