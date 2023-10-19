import { RootState } from "@/redux/store";
import { DataType, LocalType } from "@/types/coreTypes";
import { updateImageResolution } from "containers/ProductDetail/helper";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ContentWrapper,
  ProductCard,
  ProductImage,
  RecentlyViewedWrapper,
  Text,
} from "../RecentlyViewedProducts/RecentlyViewedProducts.styles";
import { removeDomainName } from "helpers/utils";

const RelatedProducts = ({
  localeData,
  customHandler,
}: {
  localeData: DataType;
  customHandler?: () => void;
}) => {
  const { SIMILAR_PRODUCTS } = localeData;
  const { productDetailData } = useSelector(
    (state: RootState) => state.productDetailInfo
  );
  const subdirectoryPath = useSelector(
    (state: RootState) => state.pageInfo.subdirectoryPath
  );
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  useEffect(() => {
    if (productDetailData && productDetailData?.relatedItems?.length > 0) {
      setRelatedProducts(productDetailData.relatedItems);
    }
  }, [productDetailData]);

  return (
    <RecentlyViewedWrapper>
      <Text type="primary">{SIMILAR_PRODUCTS}</Text>
      <ContentWrapper>
        {relatedProducts?.length &&
          relatedProducts.map(
            (product: {
              brandName: string;
              id: number;
              imageUrl: string;
              productUrl: string;
              prices: { lkPrice: number; symbol: string };
            }) => (
              <ProductCard
                key={product.id}
                onClick={() => {
                  customHandler && customHandler();
                  Router.push(
                    removeDomainName(
                      product.productUrl,
                      "",
                      "",
                      subdirectoryPath
                    )
                  );
                }}
              >
                <ProductImage
                  src={updateImageResolution(product.imageUrl, "256x123")}
                />
                <Text className="recentPrice">
                  {product.prices.symbol} {product.prices.lkPrice}
                </Text>
                <Text className="recentBrand" color="#99a0a9">
                  {product.brandName}
                </Text>
              </ProductCard>
            )
          )}
      </ContentWrapper>
    </RecentlyViewedWrapper>
  );
};

export default RelatedProducts;
