import {
  ProductImageCarouselWrapper,
  CATSLIDERHEADING,
  CATSLIDERDESC,
  STRONG,
  CATSHORTDESC1,
  CATSHORTDESC2,
  CATSHORTDESCSECOND,
  CATSHORTDESCTHIRD,
  VIEW_3D_RANGE,
  VIEW_RANGE,
  VIEW_RANGE_CONTAINER,
  VIEW_3D,
  VIEW_3D_CONTAINER,
} from "./CategoryCarousel.styles";
import { ProductImageCarousel } from "@lk/ui-library";
import { CategoryCarouselType } from "./CategoryCarousel.types";
import { useEffect, useState } from "react";
import { removeDomainName } from "helpers/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { bannerGA4 } from "helpers/gaFour";

const CategoryCarousel = ({
  categoryData,
  homeJsonCategory,
  style,
  localeData,
  isRTL = false,
  className,
}: CategoryCarouselType) => {
  const subdirectoryPath = useSelector(
    (state: RootState) => state.pageInfo.subdirectoryPath
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const [mappedCategoryData, setmappedCategoryData] = useState([]);
  useEffect(() => {
    if (categoryData) {
      const mappedCategoryData = categoryData?.map((item: { url: string }) => {
        return {
          ...item,
          url: item?.url
            ? subdirectoryPath + removeDomainName(item.url, "", "sa")
            : "",
        };
      });
      setmappedCategoryData(mappedCategoryData);
    }
  }, [categoryData]);
  const triggerSelectPromotion = (data: any) => {
    bannerGA4(
      "select_promotion",
      data.creativeName || "",
      userInfo,
      data.promotionId || "",
      data.promotionName || "",
      data.itemlistId || "",
      data.itemlistName || "",
      pageInfo
    );
  };
  if (!categoryData) {
    return (
      <div
        style={{
          height: "200px",
          background:
            "url(https://static.lenskart.com/media/mobile/images/img-loader.gif) center no-repeat",
        }}
      />
    );
  } else {
    return (
      <>
        {mappedCategoryData.length > 0 && (
          <ProductImageCarouselWrapper className={className}>
            <CATSLIDERDESC>
              {homeJsonCategory && (
                <CATSLIDERHEADING>
                  <STRONG>{homeJsonCategory.heading}</STRONG>{" "}
                  {homeJsonCategory.category}
                </CATSLIDERHEADING>
              )}
              {homeJsonCategory.shortDesc && (
                <CATSHORTDESC1>{homeJsonCategory.shortDesc}</CATSHORTDESC1>
              )}
              {homeJsonCategory.shortDescSecond && (
                <CATSHORTDESC2>
                  <CATSHORTDESCSECOND>
                    {homeJsonCategory.shortDescSecond}
                  </CATSHORTDESCSECOND>
                  <CATSHORTDESCTHIRD>
                    {homeJsonCategory.shortDescThird}
                  </CATSHORTDESCTHIRD>
                </CATSHORTDESC2>
              )}
            </CATSLIDERDESC>
            {console.log("mappedCategoryData", mappedCategoryData)}
            <ProductImageCarousel
              isRTL={isRTL}
              images={mappedCategoryData}
              gaPromotionObj={homeJsonCategory?.gaPromotionObj}
              triggerSelectPromotion={triggerSelectPromotion}
            />
            {homeJsonCategory.viewRange && (
              <VIEW_3D_RANGE style={style}>
                {homeJsonCategory.viewRange && (
                  <VIEW_RANGE
                    href={`${subdirectoryPath}${homeJsonCategory.viewRange}`}
                    onClick={() =>
                      triggerSelectPromotion(homeJsonCategory?.gaPromotionObj)
                    }
                    data-creative-name={
                      homeJsonCategory?.gaPromotionObj?.creativeName
                    }
                    data-promotion-id={
                      homeJsonCategory?.gaPromotionObj?.promotionId
                    }
                    data-promotion-name={
                      homeJsonCategory?.gaPromotionObj?.promotionName
                    }
                    data-itemlist-id={
                      homeJsonCategory?.gaPromotionObj?.itemlistId
                    }
                    data-itemlist-name={
                      homeJsonCategory?.gaPromotionObj?.itemlistName
                    }
                  >
                    <VIEW_RANGE_CONTAINER>
                      {localeData.VIEW_RANGE}
                    </VIEW_RANGE_CONTAINER>
                  </VIEW_RANGE>
                )}
                {homeJsonCategory.threeD && (
                  <VIEW_3D
                    href={`${subdirectoryPath}${homeJsonCategory.threeD}`}
                    onClick={() =>
                      triggerSelectPromotion(homeJsonCategory?.gaPromotionObj)
                    }
                    data-creative-name={
                      homeJsonCategory?.gaPromotionObj?.creativeName
                    }
                    data-promotion-id={
                      homeJsonCategory?.gaPromotionObj?.promotionId
                    }
                    data-promotion-name={
                      homeJsonCategory?.gaPromotionObj?.promotionName
                    }
                    data-itemlist-id={
                      homeJsonCategory?.gaPromotionObj?.itemlistId
                    }
                    data-itemlist-name={
                      homeJsonCategory?.gaPromotionObj?.itemlistName
                    }
                  >
                    <VIEW_3D_CONTAINER>
                      {localeData.VIEW_IN_3D}
                    </VIEW_3D_CONTAINER>
                  </VIEW_3D>
                )}
              </VIEW_3D_RANGE>
            )}
          </ProductImageCarouselWrapper>
        )}
      </>
    );
  }
};

export default CategoryCarousel;
