import { Checkout } from "@lk/ui-library";
import React, { useState } from "react";

const packageTypes = [
  "zero_power",
  "single_vision",
  "bifocal",
  "tinted_sv",
  "contact_lens",
  "sunglasses",
];
function ReturnProductDetails(props: any) {
  const {
    item,
    exchangewith = false,
    returnedProductPrice,
    configTemp,
  } = props;

  const {
    options = [],
    brandName,
    thumbnail,
    productTypeValue,
    modelName,
    contactDisposableType,
    frameColour,
    frameShape,
    frameType,
    amount,
  } = item || {};

  // const [lensPackage, setLensPackage] = useState(null);
  // const [coating, setCoating] = useState(null);
  let lensPackage;
  let coating;
  // const [price, setPrice] = useState(0);
  let price = 0;
  let type;
  for (let i = 0, len = options.length; i < len; i++) {
    type = options[i].type && options[i].type.toLowerCase();
    if (packageTypes.includes(type)) {
      // setLensPackage(options[i].name);
      lensPackage = options[i].name;
    } else if (type === "coating") {
      // setCoating(options[i].name);
      coating = options[i].name;
    }
  }

  if (amount) {
    const { total, discounts } = amount;
    const paidPrice = discounts.reduce((totalPrice: any, discount: any) => {
      if (["sc", "exchange"].includes(discount.type)) {
        totalPrice += discount.amount;
        return totalPrice;
      }
      return null;
    }, 0);
    price = total + paidPrice;
  }

  return (
    <Checkout.ReturnProductDetails
      exchangewith={exchangewith}
      item={item}
      returnedProductPrice={returnedProductPrice}
      lensPackage={lensPackage}
      coating={coating}
      price={price}
      configTemp={configTemp}
    />
  );
}

export default ReturnProductDetails;
