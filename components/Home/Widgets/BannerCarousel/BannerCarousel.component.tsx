//> Styles
import { CarouselBlock, HomePageLoader } from "./BannerCarousel.styles";

//> Helper
import { processCarouselData } from "../../HomePageHelper";

//> Package
import { ImageCarousel } from "@lk/ui-library";

//> Types
import { BannerCarouselType } from "./BannerCarousel.types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DeviceTypes } from "@/types/baseTypes";
import { BannerClicks, homePageBannerCtaClick } from "helpers/userproperties";
import { bannerGA4 } from "helpers/gaFour";
function bannerDataFilter(item: any) {
  let filteredItem = item.map((data: any) => {
    if (data.showBottomsheet) {
      return {
        source: data.img,
        redirectUrl: data?.url,
        altText: data.componentName,
        categoryCards: data.categoryCards,
        cardCategory: data.cardCategory,
        contentType: data.contentType,
        gaPromotionObj: data.gaPromotionObj,
      };
    }
    return {
      source: data.img,
      redirectUrl: data.url,
      altText: data.componentName,
      gaObj: data.gaObj,
      gaPromotionObj: data.gaPromotionObj,
    };
  });

  return filteredItem;
}

const BannerCarousel = ({
  bannerCarouselData,
  courselConfig,
  mobileView,
  showCategoryCard,
  hideArrow,
  isScrollable = true,
  className,
}: BannerCarouselType) => {
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const carouselData =
    deviceType === DeviceTypes.DESKTOP
      ? processCarouselData(bannerCarouselData)
      : bannerDataFilter(bannerCarouselData);
  if (!bannerCarouselData) {
    return <HomePageLoader />;
  }

  // console.log("bannerCarouselData", bannerCarouselData);
  // console.log("carouselData", carouselData);

  const getGAEvent = (ga: any) => {
    homePageBannerCtaClick(
      "home-page-carousel",
      ga?.label,
      userInfo,
      userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
      pageInfo
    );
    BannerClicks(
      ga?.action,
      ga?.label,
      userInfo,
      userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
      pageInfo,
      ga?.category,
      ga?.event || "cta_click"
    );
  };

  const triggerSelectPromotion = (data: any) => {
    console.log("promotion", data);
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

  const showCategoryCardFunc = (
    categoryCards: any,
    contentType: string,
    cardCategory: string
  ) => {
    showCategoryCard(categoryCards, contentType, cardCategory);
  };
  return (
    <CarouselBlock
      isScroll={courselConfig.slidesToShow > 1 && isScrollable}
      isAutoPlay={courselConfig?.autoPlay || true}
      className={className}
    >
      {bannerCarouselData && carouselData && (
        <ImageCarousel
          isRTL={isRTL}
          deviceType={deviceType}
          id="carousel"
          showCategoryCard={showCategoryCardFunc}
          mobileView={mobileView}
          courselConfig={courselConfig}
          images={carouselData}
          showArrow={!hideArrow}
          getGAEvent={getGAEvent}
          triggerSelectPromotion={triggerSelectPromotion}
        />
      )}
    </CarouselBlock>
  );
};

export default BannerCarousel;
