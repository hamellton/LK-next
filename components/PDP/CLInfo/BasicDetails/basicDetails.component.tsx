import React from "react";
import { BasicDetailsWrapper, Brand, Size, Title } from "./basicDetails.styles";
import { BasicDetailsType } from "./basicDetails.types";

const BasicDetails = ({
  brandName,
  productName,
  size,
  font,
}: BasicDetailsType) => {
  return (
    <BasicDetailsWrapper styleFont={font}>
      <Brand>{brandName}</Brand>
      <Title>{productName}</Title>
      <Size>{size}</Size>
    </BasicDetailsWrapper>
  );
};

export default BasicDetails;
