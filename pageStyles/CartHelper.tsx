import { DiscountObject } from "@/types/state/cartInfoType";

export const findGvCode = (
  cartTotal: Array<DiscountObject>,
  applicableGvs: any
) => {
  try {
    const obj = cartTotal?.find((item) => item.label === "Gift Voucher") || null;
    if (obj) {
      return applicableGvs?.[0]?.code;
    }
    return null;
  } catch(err){
    return null;
  }
};

export const findGvAmount = (cartTotal: Array<DiscountObject>) => {
  try{
    const obj = cartTotal?.find((item) => item?.label === "Gift Voucher");
    return obj?.amount;
  } catch(err){
    return null;
  }
};
