import { RootState } from "@/redux/store";
import { bannerGA4 } from "helpers/gaFour";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BannerAndStaticHTMLLoader,
  BannerAndStaticHTMWrapper,
  Section,
} from "./BannerStaticHTML.style";
import { BannerStaticHTMLType } from "./BannerStaticHTML.types";

const BannerStaticHTML = ({
  bannerData,
  id,
  style,
  customCSS,
  className,
}: BannerStaticHTMLType) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);

  useEffect(() => {
    if (bannerData && bannerData[0]?.html && bannerData[0]?.script) {
      createScriptTag(id, bannerData[0].script);
    }
    return () => {
      const scriptEl = document.querySelector(
        id ? `#${id}` : "#bannerAndStaticHTML"
      );
      if (scriptEl) {
        document.body.removeChild(scriptEl);
      }
    };
  }, []);

  if (!bannerData) {
    return <BannerAndStaticHTMLLoader />;
  }

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

  const createScriptTag = (id = "bannerAndStaticHTML", scriptToAppend: any) => {
    const script = document.createElement("script");
    script.id = id;
    script.innerHTML = scriptToAppend;
    document.body.appendChild(script);
  };

  const cssId = id ? `idf_${id}` : "";
  return (
    <Section id={cssId} style={style} className={className || ""} isRTL={isRTL}>
      {bannerData &&
        bannerData.map((data: any, index: number) => {
          let htmlString: string = "";
          if (data?.html) {
            const css = data.css ? data.css : "";
            htmlString = data.html + css;
          } else if (data.url && data.src) {
            htmlString = `<div><a href="${data.url}" title="${data.title}" /></a></div>`;
          } else if (data.src) {
            htmlString = `<div><img src="${data.src}" alt="${data.title}" title="${data.title}" /></div>`;
          }
          return (
            htmlString && (
              <BannerAndStaticHTMWrapper
                dangerouslySetInnerHTML={{ __html: htmlString + customCSS }}
                key={`banner-item-${index}`}
                onClick={(e) => {
                  const gaPromotionObj = {
                    creativeName:
                      e.target.parentElement.getAttribute("data-creative-name"),
                    promotionId:
                      e.target.parentElement.getAttribute("data-promotion-id"),
                    promotionName: e.target.parentElement.getAttribute(
                      "data-promotion-name"
                    ),
                    itemlistId:
                      e.target.parentElement.getAttribute("data-itemlist-id"),
                    itemlistName:
                      e.target.parentElement.getAttribute("data-itemlist-name"),
                  };
                  triggerSelectPromotion(gaPromotionObj);
                }}
              />
            )
          );
        })}
    </Section>
  );
};

export default BannerStaticHTML;
