import { RootState } from "@/redux/store";
import { bannerGA4 } from "helpers/gaFour";
import { BannerClicks, homePageGridCtaClick } from "helpers/userproperties";
import { useSelector } from "react-redux";
import { GridSection, GridImage, ImageSection } from "./Grid.styles";

const triggerDTM = (
  unit: any,
  verticalPosition: number,
  horizontalPosition: number = 0
) => {
  if (unit && unit.dtmObj) {
    if (unit.dtmObj.icid === true) {
      unit.dtmObj.icid =
        unit.page +
        ":-row-" +
        verticalPosition +
        "_column-" +
        (horizontalPosition || 1) +
        ":" +
        unit.componentName;
    }
    //setWindowDtm(unit.dtmObj);
  }
};

const triggerSelectPromotion = (userInfo: any, data: any, pageInfo: any) => {
  console.log("promotion", data);
  bannerGA4(
    "select_promotion",
    data?.creativeName || "",
    userInfo,
    data?.promotionId || "",
    data?.promotionName || "",
    data?.itemlistId || "",
    data?.itemlistName || "",
    pageInfo
  );
};

interface GridWidgetType {
  item: any;
  index: number;
  showCategoryCard: (
    categoryCards: any,
    contentType: string,
    cardCategory: string
  ) => void;
  style: any;
  className?: string;
}

const GridWidget = ({
  item,
  index,
  showCategoryCard,
  style,
  className,
}: GridWidgetType) => {
  const gridGap = item.gridGap || "8px";
  const itemStyle = item.style || {};
  const gridImgStyle = item.gridImgStyle || {};
  let gridStyle = {};
  if (item.subType !== "ribbon") {
    gridStyle = { padding: `0 ${gridGap}`, gridGap, ...itemStyle };
  }
  const checkWhatsAppUrl = (url: string) => {
    const wpUrl = "https://api.whatsapp.com/send";
    if (url?.indexOf(wpUrl) > -1) {
      return true;
    }
  };
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const gridData = item.items;
  return (
    <GridSection
      cols={item.cols}
      gridGap={item.gridGap}
      background={style?.background}
      className={className || ""}
    >
      {gridData &&
        gridData.map((unit: any, i: number) => {
          const hasWhatsAppUrl = checkWhatsAppUrl(unit.url || "");
          return (
            <GridImage
              key={`grid-child-${i}`}
              padding={gridImgStyle?.padding}
              style={gridImgStyle}
              onClick={() => {
                triggerDTM(unit, index + 1);
                if (hasWhatsAppUrl) {
                  //whatsappCapturePhoneNumber();
                  //sendDataOnCT();
                }
                triggerSelectPromotion(userInfo, unit.gaPromotionObj, pageInfo);
              }}
            >
              {unit && !unit.categoryCards ? (
                <a
                  key={`link-${i}`}
                  href={unit.url}
                  data-creative-name={unit?.gaPromotionObj?.creativeName}
                  data-promotion-id={unit?.gaPromotionObj?.promotionId}
                  data-promotion-name={unit?.gaPromotionObj?.promotionName}
                  data-itemlist-id={unit?.gaPromotionObj?.itemlistId}
                  data-itemlist-name={unit?.gaPromotionObj?.itemlistName}
                >
                  <ImageSection alt={"Image"} src={unit.img} />
                </a>
              ) : (
                <a
                  key={`link-${i}`}
                  onClick={() => {
                    showCategoryCard(
                      unit.categoryCards,
                      unit.contentType,
                      unit.cardCategory
                    );
                    // console.log("banner clicks in use.");
                    BannerClicks(
                      unit?.gaObj?.action,
                      unit?.gaObj?.label,
                      userInfo,
                      userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
                      pageInfo,
                      unit?.gaObj?.category,
                      unit?.gaObj?.event || "cta_click"
                    );
                    homePageGridCtaClick(
                      unit?.gaObj?.label,
                      userInfo,
                      pageInfo,
                      userInfo.userDetails?.hasPlacedOrder ? "old" : "new"
                    );
                  }}
                  data-creative-name={unit?.gaPromotionObj?.creativeName}
                  data-promotion-id={unit?.gaPromotionObj?.promotionId}
                  data-promotion-name={unit?.gaPromotionObj?.promotionName}
                  data-itemlist-id={unit?.gaPromotionObj?.itemlistId}
                  data-itemlist-name={unit?.gaPromotionObj?.itemlistName}
                >
                  <ImageSection alt={"image"} src={unit.img} />
                </a>
              )}
            </GridImage>
          );
        })}
    </GridSection>
  );
};

export default GridWidget;
