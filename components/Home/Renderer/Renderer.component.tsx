import BannerStaticHTML from "../Widgets/BannerStaticHTML/BannerStaticHTML.component";
import BannerCarousel from "../Widgets/BannerCarousel/BannerCarousel.component";
import CategoryCarousel from "../Widgets/CategoryCarousel/CategoryCarousel.component";
import CollapsibleTabs from "../Widgets/CollapsibleTabs/CollapsibleTabs.component";
import { RendererType } from "./Renderer.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes } from "@/types/baseTypes";
import {
  BannerCourselWrapper,
  BannerTitle,
  BannerStaticTitle,
  GridWrapper,
  BannerWrapper,
} from "./Renderer.styles";
import GridWidget from "../Widgets/GridWidgets/Grid.component";
import { useEffect, useState } from "react";
import { GridConfigration } from "@lk/ui-library";
import { bannerGA4 } from "helpers/gaFour";
import BannerImg from "../Widgets/BannerImg/BannerImg.component";
import { getUserEventData } from "containers/Base/helper";
import { passUtmData } from "@/redux/slices/userInfo";
import { getCookie } from "@/helpers/defaultHeaders";

const Renderer = ({
  componentData,
  categoryCarouselsData,
  customCSS,
  configData,
  localeData,
  country,
  className = "",
}: RendererType) => {
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );

  const dispatch = useDispatch<AppDispatch>();

  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const mobileView = deviceType === DeviceTypes.MOBILE;
  const [bottomSheetData, setBottomSheetData] = useState([{}]);
  const [categoryCardsType, setCategoryCardsType] = useState<string>("");
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const showCategoryCard = (
    categoryCards: any,
    categoryCardsType: string,
    cardCategory: any
  ) => {
    if (categoryCards) {
      setBottomSheetData([...categoryCards]);
      setShowBottomSheet(true);
    }
    setCategoryCardsType(categoryCardsType);
    setCategory(cardCategory);
  };
  const openBottomSheet = (params: boolean) => {
    setShowBottomSheet(params);
  };
  const buyWithCallConfig =
    configData?.BUY_ON_CALL_WIDGET && JSON.parse(configData.BUY_ON_CALL_WIDGET);

  const {
    WHATSAPP_CHAT_URL = "https://api.whatsapp.com/send/?phone=918929853854&text=",
    BUYONCHAT_LINK_HOME = "Hi Lenskart, help me get started! I am on home page of mobile site",
  } = localeData || {};

  const whatsAppChatMsg =
    WHATSAPP_CHAT_URL &&
    BUYONCHAT_LINK_HOME &&
    `${WHATSAPP_CHAT_URL}${BUYONCHAT_LINK_HOME}`;

  const triggerSelectPromotion = (data: any, isViewPromotion = false) => {
    // console.log("promotion", data);
    bannerGA4(
      isViewPromotion ? "view_promotion" : "select_promotion",
      data?.creativeName || "",
      userInfo,
      data?.promotionId || "",
      data?.promotionName || "",
      data?.itemlistId || "",
      data?.itemlistName || "",
      pageInfo
    );
  };

  const handleOnBuyOnChatClick = () => {
    const userEventDataObj = getUserEventData("BUY_ON_CHAT");
    dispatch(
      passUtmData({
        sessionId: getCookie(`clientV1_${pageInfo?.country}`)?.toString(),
        eventObj: userEventDataObj,
      })
    );
  };

  const desktopRender = (
    <div>
      {deviceType === DeviceTypes.DESKTOP &&
        componentData &&
        componentData?.map((item: any, idx: number) => {
          const style = {
            paddingBottom: item.bottomSpace ? `${item.bottomSpace}px` : "0px",
          };
          return (
            <div key={`section-comp-${idx}`}>
              {item?.data?.map((comp: any, index: number) => {
                if (comp.type === "TYPE_BANNER_CAROUSEL") {
                  return (
                    <BannerCarousel
                      key={`banner-carousel-${index}`}
                      bannerCarouselData={comp.data}
                      courselConfig={{
                        slidesToShow: 1,
                        autoPlay: true,
                        infinite: true,
                        autoplaySpeed:
                          configData?.BANNER_CAROUSEL_AUTOPLAYSPEED || 2000,
                      }}
                      mobileView={mobileView}
                      showCategoryCard={() => null}
                      // className="ga-banner-img-obeserver"
                    />
                  );
                }
                if (
                  comp.type === "TYPE_BANNER" ||
                  comp.type === "TYPE_STATIC_HTML"
                ) {
                  return (
                    <>
                      {comp.data.length > 0 && (
                        <BannerStaticHTML
                          key={`banner-${index}`}
                          bannerData={comp.data}
                          id={`banner-${index}`}
                          style={style}
                          customCSS={customCSS ? customCSS : ""}
                          className="ga-banner-img-obeserver"
                        />
                      )}
                    </>
                  );
                }
                if (comp.type === "TYPE_CATEGORY_CAROUSEL") {
                  return (
                    categoryCarouselsData &&
                    categoryCarouselsData.map((item: any) => {
                      if (Number(item.cat_id) === comp.data.catId) {
                        console.log("comp.data", comp.data);
                        return (
                          <CategoryCarousel
                            key={`category-carousel-${index}`}
                            categoryData={item.products}
                            homeJsonCategory={comp.data}
                            style={style}
                            localeData={localeData}
                            isRTL={isRTL}
                            className={`ga-banner-img-obeserver ${className}`}
                          />
                        );
                      }
                    })
                  );
                }
                if (comp.type === "TYPE_COLLAPSIBLE_TABS") {
                  return (
                    <CollapsibleTabs
                      key={`collapsible-tabs-${index}`}
                      tabsData={comp.data}
                      customCSS={customCSS}
                    />
                  );
                }
                return <div key={index} />;
              })}
            </div>
          );
        })}
    </div>
  );
  const msiteRender = (
    <div>
      {deviceType === DeviceTypes.MOBILE &&
        componentData.map((comp: any, index: number) => {
          if (comp.dataType === "TYPE_CAROUSEL" && comp.slidesPerView > 1) {
            let courselConfig = {
              slidesToShow: comp.slidesPerView ? comp.slidesPerView : 1,
              autoPlay: comp.autoPlay ? true : false,
              autoplaySpeed: comp.autoplaySpeed ? comp.autoplaySpeed : 2000,
              slidesPerView: comp.slidesPerView > 1 ? comp.slidesPerView : 1,
              infinite: comp?.infinite ? true : false,
            };
            return (
              <BannerCourselWrapper
                topSpace={comp.topSpace}
                bottomSpace={comp.bottomSpace}
                key={`banner-carousel-${index}`}
              >
                {comp.title && <BannerTitle>{comp.title}</BannerTitle>}
                <BannerCarousel
                  bannerCarouselData={comp.items}
                  courselConfig={courselConfig}
                  mobileView={true}
                  showCategoryCard={showCategoryCard}
                  hideArrow={comp?.hideArrow}
                  isScrollable={true}
                  className="ga-banner-img-obeserver"
                />
              </BannerCourselWrapper>
            );
          }
          if (comp.dataType === "TYPE_CAROUSEL") {
            let courselConfig = {
              slidesToShow: comp.slidesPerView ? comp.slidesPerView : 1,
              autoPlay: comp.autoPlay ? true : false,
              autoplaySpeed: comp?.autoplaySpeed ? comp?.autoplaySpeed : 2000,
              infinite: comp?.infinite ? true : false,
            };
            return (
              <BannerCourselWrapper
                topSpace={comp?.topSpace}
                bottomSpace={comp?.bottomSpace}
                key={`banner-carousel-${index}`}
              >
                {comp.title && <BannerTitle>{comp.title}</BannerTitle>}
                <BannerCarousel
                  bannerCarouselData={comp.items}
                  courselConfig={courselConfig}
                  mobileView={false}
                  showCategoryCard={() => null}
                  hideArrow={comp?.hideArrow}
                  // className="ga-banner-img-obeserver"
                />
              </BannerCourselWrapper>
            );
          }
          if (comp.dataType === "TYPE_BANNER" && comp?.data) {
            return (
              <BannerWrapper
                topSpace={comp?.topSpace}
                bottomSpace={comp?.bottomSpace}
                key={`banner-${index}`}
              >
                {comp.title && (
                  <BannerStaticTitle>{comp.title}</BannerStaticTitle>
                )}
                <BannerStaticHTML
                  bannerData={comp.data}
                  id={`banner-${index}`}
                  style={{}}
                  customCSS={""}
                  className="ga-banner-img-obeserver"
                />
              </BannerWrapper>
            );
          }
          if (comp.dataType === "TYPE_BANNER") {
            return (
              <BannerImg
                key={`banner-${index}`}
                aspectRatio={comp.aspectRatio}
                bottomSpace={comp.bottomSpace}
                bannerObj={comp.items}
                className="ga-banner-img-obeserver"
              />
            );
          }
          if (comp.dataType === "TYPE_GRID") {
            return (
              <GridWrapper
                key={`grid_${index}`}
                topSpace={comp.topSpace}
                bottomSpace={comp.bottomSpace}
              >
                <GridWidget
                  item={comp}
                  index={index}
                  showCategoryCard={showCategoryCard}
                  style={comp.style}
                  className="ga-banner-img-obeserver"
                />
              </GridWrapper>
            );
          }
          return <div key={index} />;
        })}
      <GridConfigration
        whatsAppChatMsg={whatsAppChatMsg}
        buyWithCallConfig={country !== "sa" && buyWithCallConfig}
        openBottomSheet={openBottomSheet}
        showBottomSheet={showBottomSheet}
        bottomSheetData={bottomSheetData}
        category={category}
        categoryCardsType={categoryCardsType}
        triggerGAPromotion={triggerSelectPromotion}
        handleOnBuyOnChatClick={handleOnBuyOnChatClick}
      />
    </div>
  );
  return (
    <>
      {deviceType === DeviceTypes.DESKTOP && desktopRender}
      {deviceType === DeviceTypes.MOBILE && msiteRender}
    </>
  );
};

export default Renderer;
