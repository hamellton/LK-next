import { RootState } from "@/redux/store";
import { DataType, LocalType } from "@/types/coreTypes";
import { updateImageResolution } from "containers/ProductDetail/helper";
import { removeDomainName } from "helpers/utils";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ContentWrapper,
  ProductCard,
  ProductImage,
  RecentlyViewedWrapper,
  Text,
} from "./RecentlyViewedProducts.styles";

interface RecentlyViewedProductsTypes {
  localeData: DataType;
  shortlist?: boolean;
  customHandler?: () => void;
}

const RecentlyViewedProducts = ({
  localeData,
  shortlist,
  customHandler,
}: RecentlyViewedProductsTypes) => {
  const { RECENTLY_VIEWED_PRODUCTS } = localeData;
  const { productDetailData } = useSelector(
    (state: RootState) => state.productDetailInfo
  );
  const wishListInfo = useSelector((state: RootState) => state.wishListInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const [recentProducts, setRecentProducts] = useState([]);
  useEffect(() => {
    if (
      productDetailData &&
      Object.keys(productDetailData).length > 0 &&
      !shortlist
    ) {
      const viewedProduct = {
        productUrl: `${pageInfo.subdirectoryPath}${removeDomainName(
          productDetailData.productURL || "",
          "",
          "",
          pageInfo.subdirectoryPath
        )}`,
        prices: productDetailData.price,
        brandName: productDetailData.brandName,
        id: productDetailData.id,
        imageUrl: productDetailData?.imageUrlDetail?.[0]?.imageUrl,
      };
      const recentlyViewedProducts = localStorage.getItem(
        `recentViewProducts_${pageInfo.country}`
      )
        ? JSON.parse(
            localStorage.getItem(`recentViewProducts_${pageInfo.country}`) || ""
          )
        : [];

      const matchIndex = recentlyViewedProducts?.findIndex(
        (obj: any) => obj.id === productDetailData?.id
      );

      if (matchIndex !== -1) {
        recentlyViewedProducts.splice(matchIndex, 1);
      }
      const copyJSONData = recentlyViewedProducts.concat(viewedProduct);
      localStorage.setItem(
        `recentViewProducts_${pageInfo.country}`,
        JSON.stringify(copyJSONData)
      );

      setRecentProducts(recentlyViewedProducts);
    }
  }, [productDetailData]);

  useEffect(() => {
    if (shortlist) {
      const recentlyViewedProducts = localStorage.getItem(
        `recentViewProducts_${pageInfo.country}`
      )
        ? JSON.parse(
            localStorage.getItem(`recentViewProducts_${pageInfo.country}`) || ""
          )
        : [];

      wishListInfo?.productIds?.forEach((wishID) => {
        let matchIndex = recentlyViewedProducts?.findIndex(
          (obj: any) => obj.id == wishID
        );
        if (matchIndex !== -1) {
          recentlyViewedProducts.splice(matchIndex, 1);
        }
      });

      setRecentProducts(recentlyViewedProducts);
    }
  }, [wishListInfo.productIds, shortlist, pageInfo.country]);

  if (recentProducts.length === 0) return null;

  return (
    <RecentlyViewedWrapper>
      <Text type="primary">{RECENTLY_VIEWED_PRODUCTS}</Text>

      <ContentWrapper>
        {recentProducts.map(
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
                Router.push(product.productUrl);
              }}
            >
              <ProductImage
                src={updateImageResolution(product.imageUrl, "256x123")}
              />

              <Text className="recentPrice">
                {product?.prices?.symbol} {product?.prices?.lkPrice}
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

export default RecentlyViewedProducts;
