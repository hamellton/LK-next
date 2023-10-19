import { ReactNode } from "react";

interface BreadcrumbDataType {
  text: string;
  onClick: () => void;
  disabled: boolean;
  id: string;
}
export interface CheckoutContainerTypes {
  activeBreadcrumbId: string;
  breadcrumbData: BreadcrumbDataType[];
  children: ReactNode;
  isRTL?: boolean;
  orderId?: string;
}

export interface BreadcrumbType extends BreadcrumbDataType {
  isArrow: boolean;
  isActive: boolean;
  isRTL: boolean;
}
