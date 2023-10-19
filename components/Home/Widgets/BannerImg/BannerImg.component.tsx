import React from "react";
import { BannerImgRoot, Container } from "./BannerImg.styles";
import { useRouter } from "next/router";
import { bannerGA4 } from "helpers/gaFour";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import pageInfo from "@/redux/slices/pageInfo";

export default function BannerImg({
  aspectRatio,
  bottomSpace,
  bannerObj,
  className,
}: {
  aspectRatio: number;
  bottomSpace: number;
  bannerObj: [];
  className: string;
}) {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const triggerSelectPromotion = (userInfo: any, data: any) => {
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

  return (
    <Container padding={bottomSpace}>
      {bannerObj.map((data: any, index: number) => {
        return (
          <BannerImgRoot
            aspectRatio={aspectRatio}
            key={index}
            className={className}
          >
            <a
              data-creative-name={data?.gaPromotionObj?.creativeName}
              data-promotion-id={data?.gaPromotionObj?.promotionId}
              data-promotion-name={data?.gaPromotionObj?.promotionName}
              data-itemlist-id={data?.gaPromotionObj?.itemlistId}
              data-itemlist-name={data?.gaPromotionObj?.itemlistName}
              onClick={() => {
                triggerSelectPromotion(userInfo, data.gaPromotionObj);
                window.location.href = data.url;
              }}
            >
              <img src={data.img} alt="banner" />
            </a>
          </BannerImgRoot>
        );
      })}
    </Container>
  );
}
