import { AppDispatch, RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import { useDispatch, useSelector } from "react-redux";
import { localStorageHelper } from "@lk/utils";
import { getCategoryCarouselData } from "@/redux/slices/categoryInfo";
import { useEffect, useState } from "react";
import { getCookie } from "@/helpers/defaultHeaders";
import {
  RecentlyViewedWrapper,
  Text,
  ContentWrapper,
  ProductCard,
  ProductImage,
} from "../RecentlyViewedProducts/RecentlyViewedProducts.styles";
import Router from "next/router";
import { updateImageResolution } from "containers/ProductDetail/helper";
import { getCurrency } from "helpers/utils";

const RecommendedProducts = ({
  localeData,
  productDetailData,
  customHandler,
}: {
  localeData: DataType;
  productDetailData: any;
  customHandler?: () => void;
}) => {
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const categoryCarouselData = useSelector(
    (state: RootState) => state.categoryInfo.categoryCarouselData
  );

  const sessionId = `${getCookie(`clientV1_${pageInfo.country}`)}`;

  let recommendedProductsArray: any = [];
  const addedPids: any[] = [];
  const rVIds: any[] = [];
  const rVItems =
    localStorageHelper.getItem(`recentViewProducts_${pageInfo.country}`) || [];
  rVItems.forEach((prod: { id: any }) => rVIds.push(prod.id));

  useEffect(() => {
    const recommendedCats = localStorageHelper.getItem(
      `recentlyViewedCategories_${pageInfo?.country}`
    );
    if (sessionId && recommendedCats && recommendedCats?.length > 0) {
      dispatch(
        getCategoryCarouselData({
          sessionId: sessionId,
          catIds: recommendedCats.join(","),
        })
      );
    }
  }, [sessionId]);

  useEffect(() => {
    if (
      categoryCarouselData &&
      categoryCarouselData?.data &&
      categoryCarouselData.data.length
    ) {
      categoryCarouselData.data.forEach((cD) => {
        const prodList = cD.products || [];
        let addedCount = 0;
        prodList.forEach((prod: { id: number }) => {
          if (
            addedPids?.indexOf(prod.id) === -1 &&
            rVIds?.indexOf(prod.id) === -1 &&
            addedCount < 5 &&
            productDetailData.id !== prod.id
          ) {
            recommendedProductsArray.push(prod);
            addedPids.push(prod.id);
            addedCount += 1;
          }
        });
      });
      setRecommendedProducts(recommendedProductsArray);
    }
  }, [categoryCarouselData]);

  if (recommendedProducts && recommendedProducts?.length === 0) return null;

  return (
    <RecentlyViewedWrapper>
      <Text type="primary">Recommended For You</Text>
      <ContentWrapper>
        {recommendedProducts.map(
          (product: {
            title: string;
            id: number;
            image: string;
            url: string;
            lenskart_price: number;
            market_price: number;
            frame_color: string;
            // prices: { lkPrice: number; symbol: string };
          }) => (
            <ProductCard
              key={product.id}
              onClick={() => {
                customHandler && customHandler();
                Router.push(product.url);
              }}
            >
              <ProductImage
                src={updateImageResolution(product.image, "256x123")}
              />
              <Text className="recentPrice">
                {getCurrency(pageInfo.country)}{" "}
                {product?.lenskart_price || product?.market_price}
              </Text>
              <Text className="recentBrand" color="#99a0a9">
                {product.frame_color}
              </Text>
            </ProductCard>
          )
        )}
      </ContentWrapper>
    </RecentlyViewedWrapper>
  );
};

export default RecommendedProducts;
