import { RootState } from "@/redux/store";
import { DataType, LocalType } from "@/types/coreTypes";
import { updateImageResolution } from "containers/ProductDetail/helper";
import { addToViewSimilarGA4 as addToViewSimilarGA4 } from "helpers/gaFour";
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

const ColorOptions = ({
  localeData,
  customHandler,
}: {
  localeData: DataType;
  customHandler?: () => void;
}) => {
  const { VIEW_OTHER_COLOR_OPTIONS } = localeData || {};
  const { isLogin } = useSelector((state: RootState) => state.userInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const { productDetailData } = useSelector(
    (state: RootState) => state.productDetailInfo
  );
  const [colorOptions, setColorOptions] = useState<any[]>([]);
  useEffect(() => {
    if (productDetailData && productDetailData?.colorOptions?.length > 0) {
      setColorOptions(productDetailData.colorOptions);
      // addToViewSimilarGA4(productDetailData);
    }
  }, [productDetailData]);

  return (
    <RecentlyViewedWrapper id="available-color-options">
      <Text type="primary">{VIEW_OTHER_COLOR_OPTIONS}</Text>
      <ContentWrapper>
        {/* {colorOptions.map((product: {brandName: string, id: number, imageUrl: string, productUrl: string,  prices: { lkPrice: number, symbol: string }}) => (
					<ProductCard key={product.id} onClick={() => Router.push(product.productUrl)}>
						<ProductImage src={updateImageResolution(product?.productImage.url, '256x123')} />
						<Text>
							{product.prices.symbol} {product.prices.lkPrice}
						</Text>
						<Text color="#99a0a9">
							{product.brandName}
						</Text>
					</ProductCard>
				))} */}
        {colorOptions.map((option) => (
          <ProductCard
            key={option.id}
            onClick={() => {
              customHandler && customHandler();
              Router.push(option.productURL);
            }}
          >
            <ProductImage
              src={updateImageResolution(option.productImage.url, "256x123")}
            />
            <Text className="recentPrice">
              {option.price.symbol} {option.price.lkPrice}
            </Text>
            <Text className="recentBrand" color="#99a0a9">
              {productDetailData?.brandName}
            </Text>
          </ProductCard>
        ))}
      </ContentWrapper>
    </RecentlyViewedWrapper>
  );
};

export default ColorOptions;
