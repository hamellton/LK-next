import React from "react";
import {
  ColorOptionsWrapper,
  Heading,
  SubHeading,
  Wrapper,
} from "./OOSModal.styles";
import { DataType } from "@/types/coreTypes";
import ColorOptions from "../ColorOptions/ColorOptions";
import { ProductDetailType } from "@/types/productDetails";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import RecentlyViewedProducts from "../RecentlyViewedProducts/RecentlyViewedProducts";

const OOSModal = ({
  localeData,
  productData,
  customHandler,
}: {
  localeData: DataType;
  productData: ProductDetailType;
  customHandler?: () => void;
}) => {
  const { PRODUCT_IS_OUT_OF_STOCK, CHOOSE_OTHER_PRODUCTS_BELOW } =
    localeData || {};
  return (
    <Wrapper>
      <Heading>{PRODUCT_IS_OUT_OF_STOCK || "Product is Out of Stock"}</Heading>
      <SubHeading>
        {CHOOSE_OTHER_PRODUCTS_BELOW || "You can choose other products below"}
      </SubHeading>

      {productData && productData?.colorOptions?.length > 0 && (
        <ColorOptionsWrapper>
          <ColorOptions localeData={localeData} customHandler={customHandler} />
        </ColorOptionsWrapper>
      )}

      {productData?.relatedItems?.length > 0 && (
        <ColorOptionsWrapper>
          <RelatedProducts
            localeData={localeData}
            customHandler={customHandler}
          />
        </ColorOptionsWrapper>
      )}

      <ColorOptionsWrapper>
        <RecentlyViewedProducts
          localeData={localeData}
          customHandler={customHandler}
        />
      </ColorOptionsWrapper>
    </Wrapper>
  );
};

export default OOSModal;
