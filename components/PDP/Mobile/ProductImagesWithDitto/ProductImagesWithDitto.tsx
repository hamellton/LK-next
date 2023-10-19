import { AppDispatch, RootState } from "@/redux/store";
import { MobileCarousel } from "@lk/ui-library";
import { updateImageResolution } from "containers/ProductDetail/helper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PanZoomContainer from "./PanZoomContainer";
import { Icons } from "@lk/ui-library";
import {
  BottomContentWrapper,
  Image,
  LeftContent,
  ProductImagesWithDittoWrapper,
  Text,
  TopContent,
} from "./ProductImagesWithDittoWrapper.styles";
import { BottomSheet } from "@lk/ui-library";
import { SocialShare } from "@lk/ui-library";
import { DataType } from "@/types/coreTypes";
import { TryOnButton } from "@lk/ui-library";
import Router from "next/router";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import { getCygnusOverlayImage } from "@/redux/slices/ditto";
import { reDirection } from "containers/Base/helper";
import { tryOnEvent } from "helpers/userproperties";
import { ctaClickEvent } from "helpers/gaFour";

const ProductImagesWithDitto = ({
  localeData,
  isExchangeFlow,
  configData,
  productDetailData,
}: DataType) => {
  const dispatch = useDispatch<AppDispatch>();
  const colorOptions = productDetailData?.colorOptions?.length || 0;
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const { isLogin, mobileNumber, userDetails, sessionId, userLoading } =
    useSelector((state: RootState) => state.userInfo);
  const { cygnus } = useSelector((state: RootState) => state.dittoInfo);

  const [showShareBottomSheet, setShowShareBottomSheet] = useState(false);
  const [loadZoom, setLoadZoom] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [TryOn, setTryOn] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const isCygnusOn = getCookie("isDitto");
    if (isCygnusOn && mounted && !isLogin && !userLoading) {
      getCygnusImage();
    } else if (
      isCygnusOn &&
      mounted &&
      userInfo?.userDetails?.cygnus.cygnusId &&
      !userLoading
    ) {
      getCygnusImage();
    }
  }, [mounted, userInfo?.userDetails, userLoading]);

  const getCygnusImage = () => {
    if (
      (isLogin && !!userInfo.userDetails?.cygnus?.cygnusId) ||
      getCookie("dittoGuestId")
    ) {
      setTryOn(true);
      setCookie("isDitto", true);
      const guestId = getCookie("dittoGuestId")?.toString() || "";
      if (productDetailData?.id && productDetailData?.isDitto) {
        dispatch(
          getCygnusOverlayImage({
            pid: productDetailData?.id,
            sessionId: sessionId,
            guestId:
              isLogin && mobileNumber && userDetails?.cygnus?.cygnusId
                ? ""
                : userDetails?.cygnus?.cygnusId || guestId,
            phoneNumber:
              isLogin && mobileNumber && userDetails?.cygnus?.cygnusId
                ? mobileNumber.toString()
                : "",
            phoneCode: pageInfo.countryCode,
          })
        );
      }
    } else {
      reDirection(pageInfo?.subdirectoryPath);
    }
  };

  const onClickColorOptions = () => {
    const eventName = "cta_click";
    const cta_name = "color-options";
    const cta_flow_and_page = "product-detail-page";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
    window &&
      window?.scrollTo({
        behavior: "smooth",
        top:
          (document &&
            document?.getElementById("available-color-options")?.offsetTop -
              60) ||
          0,
      });
  };

  const handleOnShareClick = () => {
    if (window.navigator && window.navigator.share) {
      setShowShareBottomSheet(false);
      window.navigator
        .share({
          // title: "",
          text: productDetailData?.fullName,
          url: productDetailData?.productURL,
        })
        .then(() => {
          console.log("Successful share", productDetailData?.productURL);
        })
        .catch((error) => {
          console.log("Error sharing", error);
        });
      return null;
    } else {
      setShowShareBottomSheet(true);
      const eventName = "cta_click";
      const cta_name = "share";
      const cta_flow_and_page = "product-detail-page";
      ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
    }
  };

  const closeBottomSheet = () => {
    setShowShareBottomSheet(false);
  };

  const handleShareMedium = (type: string) => {
    if (typeof window !== undefined) {
      if (type === "whatsapp") {
        window.location.href = `https://api.whatsapp.com/send?text=${productDetailData?.productURL}`;
      } else if (type === "facebook") {
        window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${productDetailData?.productURL}`;
      } else if (type === "twitter") {
        window.location.href = `https://twitter.com/intent/tweet?url=${productDetailData?.productURL}&text=${productDetailData?.fullName}&via=lenskart_com&hashtags=specsy,lenskart`;
      }
    }
  };

  const handleOnDittoClick = () => {
    if (!TryOn) {
      getCygnusImage();
    } else {
      setCookie("isDitto", false);
      setTryOn(false);
    }

    tryOnEvent(!TryOn, userInfo, pageInfo);
  };

  return (
    <>
      <BottomSheet
        show={showShareBottomSheet}
        closebottomSheet={closeBottomSheet}
        backgroundColor="#eaeff4"
        borderRadius="0"
        onBackdropClick={closeBottomSheet}
      >
        <SocialShare
          handleClick={(type: string) => handleShareMedium(type)}
          dataLocale={localeData}
          config={configData.SOCIAL_SHARE_CONFIG}
        />
      </BottomSheet>
      <ProductImagesWithDittoWrapper>
        {!isExchangeFlow && (
          <TopContent>
            <Icons.ShareMobile onClick={handleOnShareClick} />
          </TopContent>
        )}

        {productDetailData?.id && (
          <MobileCarousel
            images={
              !TryOn
                ? productDetailData.mobileImageUrl
                : cygnus?.cygnusImageData?.[productDetailData?.id]
                ? [
                    {
                      imageUrl:
                        cygnus?.cygnusImageData?.[productDetailData?.id],
                      label: "cygnus",
                      source: cygnus?.cygnusImageData?.[productDetailData?.id],
                    },
                  ]
                : productDetailData.mobileImageUrl
            }
            onClickHandler={(index: number) =>
              !TryOn ? setLoadZoom(true) : null
            }
          />
        )}

        {loadZoom && (
          <PanZoomContainer
            images={productDetailData.mobileImageUrl}
            onCloseHandler={() => {
              setLoadZoom(false);
            }}
          />
        )}
        <BottomContentWrapper>
          <>
            {colorOptions > 0 ? (
              <LeftContent onClick={onClickColorOptions}>
                <Image
                  alt="color_options"
                  src="https://static.lenskart.com/media/mobile/images/ic_color_pdp.png"
                ></Image>
                <Text>{colorOptions} Color</Text>
              </LeftContent>
            ) : (
              <div></div>
            )}
            {productDetailData?.classification !== "loyalty_services" &&
              productDetailData?.isDitto && (
                <div>
                  <TryOnButton
                    width={!TryOn ? "119px" : "160px"}
                    height="34px"
                    tryOnImageURL="https://static.lenskart.com/media/desktop/img/desktop_pdp_model.png"
                    onBtnClick={handleOnDittoClick}
                    borderColor="#18CFA8"
                    text={!TryOn ? "Try On" : "Close Try On"}
                    backgroundColor={!TryOn ? "white" : "#1CCFA8"}
                  />
                </div>
              )}
          </>
        </BottomContentWrapper>
      </ProductImagesWithDittoWrapper>
    </>
  );
};

export default ProductImagesWithDitto;
