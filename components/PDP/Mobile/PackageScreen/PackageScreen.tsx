import { postNeedHelpWhatsapp } from "@/redux/slices/auth";
import { saveToCart } from "@/redux/slices/cartInfo";
import { fetchPackageData } from "@/redux/slices/packagesInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { TypographyENUM } from "@/types/baseTypes";
import { PriceType } from "@/types/priceTypes";
import { Spinner } from "@lk/ui-library";
import { Icons } from "@lk/ui-library";
import { PackageScreenCard } from "@lk/ui-library";
import { BottomSheet } from "@lk/ui-library";
import { getCookie } from "@/helpers/defaultHeaders";
import { ctaClickEvent } from "helpers/gaFour";
import {
  packageScreenSelectionGA,
  // selectLens,
  userProperties,
} from "helpers/userproperties";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PackageType } from "../../Package/Package.types";
import AddOnsModal from "./AddOnsModal";
import GoldOfferBottomSheet from "./GoldOfferBottomSheet";
import {
  BackButton,
  BottomRow,
  BuyNowAction,
  BuyNowCTA,
  BuyNowText,
  NeedHelpText,
  PackageErrorMessage,
  PackageScreenCardContainer,
  PackageScreenFooter,
  PackageScreenHeader,
  PackageScreenWrapper,
  TopRow,
  VideoModalWrapper,
  WhatAppIcon,
} from "./PackageScreen.styles";

const PackageScreen = ({
  productDetailData,
  id,
  sessionId,
  configData,
  localeData,
  isExchangeFlow = false,
  currentSelection,
  showPackageScreen,
  setShowPackageScreen,
  showSelectLens,
}: PackageType) => {
  const dispatch = useDispatch<AppDispatch>();
  const [modalHeight, setModalHeight] = useState("100vh");
  const {
    packages,
    framePrice,
    id: currPackageId,
    packagesLoading,
    packagesError,
  } = useSelector((state: RootState) => state.packageInfo);
  const { cartInfo } = useSelector((state: RootState) => state);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [Id, setId] = useState("");
  const { NEED_HELP, CHOOSE_LENS_PACKAGE, PROCEED } = localeData;

  // > disable background scoll if bottomsheet opens
  useEffect(() => {
    showPackageScreen && (document.body.style.overflow = "hidden");
    !showPackageScreen && (document.body.style.overflow = "unset");
  }, [showPackageScreen]);

  //> Local State
  const [totalPrice, setTotalPrice] = useState(
    productDetailData?.price?.lkPrice
  );
  const [goldOfferPopup, setGoldOfferPopup] = useState();
  // const [selectedPower, setSelectedPower] = useState('');
  const [lensPackageSelected, setLensPackageSelected] = useState<{
    id: string;
    price: PriceType;
    addOns: any;
    name: string;
  }>();
  const [addOns, setAddOns] = useState<any>();
  const [section, setSection] = useState("");
  const [videoLink, setVideoLink] = useState<string>("");
  let pageName = "eyeglasses-package-screen";
  useEffect(() => {
    if (!userInfo.userLoading) {
      userProperties(userInfo, pageName, pageInfo, configData);
    }
  }, [userInfo.userLoading]);

  useEffect(() => {
    const reqObj = {
      pid: parseInt(id),
      powerType:
        productDetailData.type === "Sunglasses"
          ? "sunglasses"
          : currentSelection,
      frameType: productDetailData.frameType,
      classification: productDetailData.classification,
      sessionId: sessionId,
    };

    dispatch(fetchPackageData(reqObj));

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setModalHeight(`${window.innerHeight}px`);
  };

  const callShowAddOnModal = () => {
    setSection("showAddOnModal");
  };

  const addToCartWithOptionsHandler = (packageId: string, addOns?: string) => {
    let returnOrderId, returnItemId;
    if (isExchangeFlow) {
      returnOrderId = getCookie("postcheckOrderId") || null;
      returnItemId = getCookie("postcheckItemId") || null;
    }
    const reqObj: {
      powerType: string;
      productId: number;
      packageId: string;
      sessionId: string;
      addOns?: string;
      orderId?: number;
      itemId?: number;
    } = {
      productId: productDetailData.id?.toString(),
      powerType:
        productDetailData.type === "Sunglasses"
          ? "sunglasses"
          : currentSelection || "",
      sessionId: sessionId,
      packageId: packageId,
      addOns: addOns || "",
    };
    if (returnOrderId)
      reqObj.orderId = parseInt(
        typeof returnOrderId === "string" ? returnOrderId : ""
      );
    if (returnItemId)
      reqObj.itemId = parseInt(
        typeof returnItemId === "string" ? returnItemId : ""
      );
    dispatch(saveToCart(reqObj));
    if (isExchangeFlow && returnOrderId && returnItemId)
      Router.push(
        `/sales/my/order/exchange/${returnOrderId}/${returnItemId}/exchange-details`
      );
  };
  const handleButtonClick = () => {
    if(lensPackageSelected && lensPackageSelected?.id) {
      let showAddOnModal = false;
      setAddOns("");
      if (lensPackageSelected?.addOns && lensPackageSelected?.addOns?.length) {
        setAddOns(lensPackageSelected.addOns);
        showAddOnModal = true;
      }
      if (showAddOnModal) {
        callShowAddOnModal();
      } else {
        addToCartWithOptionsHandler(lensPackageSelected?.id, addOns);
        // Router.push('/cart');
      }

      if (typeof window?.fbq !== "undefined") {
        window?.fbq("track", "AddToCart", {
          content_category: productDetailData.classification,
          content_ids: productDetailData.id,
          content_type: "product",
          value: productDetailData.price.lkPrice,
          currency: productDetailData.price.currency,
        });
      }
    }
  };

  const onLensCardClick = (
    pkg: React.SetStateAction<any>,
    totalPrice: React.SetStateAction<number>
  ) => {
    setLensPackageSelected(pkg);
    packageScreenSelectionGA(pkg?.label);
    setTotalPrice(totalPrice);
    const eventName = "cta_click";
    const cta_name = pkg?.label;
    const cta_flow_and_page = `${productDetailData.type?.toLowerCase()}-${"lens-type-screen"}`;
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };

  const handleOnVideoClick = (videoLink?: string) => {
    setVideoLink(videoLink || "");
    setSection("showVideoModal");
  };

  const getOfferTextIcon = (iconText: string) => {
    switch (iconText) {
      case "info":
        return "https://static.lenskart.com/media/desktop/img/DesignStudioIcons/RightArrowWithoutLineBig.svg";
      case "applied":
        return "https://static.lenskart.com/media/desktop/img/DesignStudioIcons/Check.svg";
      default:
        return "";
    }
  };

  const handleSection = (flag: string) => {
    setSection(flag);
  };

  const whatsAppChatMsg =
    (localeData.WHATSAPP_CHAT_URL && localeData.BUY_ON_CHAT_HELP_CTA_CART) ||
    (localeData.BUYONCHAT_HELP_CTA_CART &&
      `${localeData.WHATSAPP_CHAT_URL}${
        localeData.BUY_ON_CHAT_HELP_CTA_CART ||
        localeData.BUYONCHAT_HELP_CTA_CART
      }`
        .replace("<pageName>", "Package")
        .replace("<pid-no>", id));

  const buyWithCallConfig =
    configData &&
    configData?.BUY_ON_CALL_WIDGET &&
    JSON.parse(configData?.BUY_ON_CALL_WIDGET);
  const {
    eyeglasses: { tel },
    // cta: { isShown /* whatsappIconGreen, iconGreen, text */ },
  } = buyWithCallConfig;

  const postNeedHelpWhatsappFun = () => {
    if (userInfo?.mobileNumber) {
      dispatch(
        postNeedHelpWhatsapp({
          phone: userInfo?.mobileNumber,
          sessionId: sessionId,
        })
      );
    }
  };

  const isBuyOnChat = buyWithCallConfig && buyWithCallConfig.buyonchat;
  return (
    <>
      <BottomSheet
        show={showPackageScreen}
        closebottomSheet={() =>
          setShowPackageScreen && setShowPackageScreen(false)
        }
        onBackdropClick={() =>
          setShowPackageScreen && setShowPackageScreen(false)
        }
        backgroundColor="#f7f2ed"
        top="0px"
        borderRadius="0px"
        showCrossIcon={false}
        padding="0px"
      >
        <BottomSheet
          show={section}
          borderRadius="0px"
          closebottomSheet={() => setSection("")}
          onBackdropClick={() => setSection("")}
          showCrossIcon={section === "showVideoModal" ? true : false}
          padding={section !== "showVideoModal" ? "0px" : ""}
        >
          {
            {
              showAddOnModal: (
                <AddOnsModal
                  addOns={addOns}
                  addToCartWithOptionsHandler={addToCartWithOptionsHandler}
                  closeModal={() => setSection("")}
                  lensPrice={totalPrice}
                  packageId={lensPackageSelected?.id}
                  currencySymbol={productDetailData.price.symbol}
                  localeData={localeData}
                />
              ),
              showVideoModal: (
                <VideoModalWrapper>
                  <iframe
                    allow="autoplay; encrypted-media"
                    src={`https://www.youtube.com/embed/${videoLink}?autoplay=1&controls=0`}
                    title={videoLink}
                    width="100%"
                    height="300px"
                  />
                </VideoModalWrapper>
              ),
              showGoldOfferModal: (
                <GoldOfferBottomSheet
                  goldOfferPopup={goldOfferPopup}
                  sessionId={sessionId}
                  configData={configData}
                  cartInfo={cartInfo}
                  handleSection={handleSection}
                />
              ),
            }[section]
          }
        </BottomSheet>

        {/* {cartIsLoading && <Spinner show fullPage />} */}
        <PackageScreenWrapper
          id="package-screen-wrapper"
          style={{ height: modalHeight }}
        >
          {packagesLoading && <Spinner show fullPage />}
          <PackageScreenHeader>
            <TopRow>
              <BackButton
                onClick={() => {
                  {
                    setShowPackageScreen && setShowPackageScreen(false);
                  }
                  {
                    showSelectLens && showSelectLens();
                  }
                }}
              >
                {pageInfo.isRTL ? <Icons.RightArrow /> : <Icons.BackArrow />}
              </BackButton>
              {configData?.CART_NEED_HELP && (
                <NeedHelpText
                  href={isBuyOnChat ? whatsAppChatMsg : `tel:${tel}`}
                  onClick={() => postNeedHelpWhatsappFun()}
                >
                  {configData?.SHOW_WHATS_APP_ICON_PAC_SCREEN && (
                    <WhatAppIcon>
                      <img
                        alt={localeData?.PHONE_NUMBER}
                        src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/WhatsappIcon.svg"
                      />
                    </WhatAppIcon>
                  )}
                  {NEED_HELP}?
                </NeedHelpText>
              )}
            </TopRow>
            <BottomRow font={TypographyENUM.lkSansRegular}>
              {CHOOSE_LENS_PACKAGE}
            </BottomRow>
          </PackageScreenHeader>

          {packagesError && (
            <PackageErrorMessage>No Packages Found!</PackageErrorMessage>
          )}
          {!packagesError && !packagesLoading && (
            <PackageScreenCardContainer>
              {packages?.map(
                (item: {
                  offerDetails: any;
                  tags: Array<string>;
                  videoLink?: string;
                  name: string | undefined;
                  addOns: any;
                  id: React.Key | null | undefined;
                  packageTitle: string;
                  specifications: any;
                  offerText: string;
                  label: string;
                  imageUrl: string;
                  price: PriceType;
                }) => {
                  return (
                    <div key={item.id}>
                      <PackageScreenCard
                        id={item.id}
                        font={TypographyENUM.lkSansRegular}
                        offerText={item.offerText}
                        PlayIcon={item.videoLink !== "" ? true : false}
                        videoLink={videoLink}
                        title={item.label}
                        tags={item.tags}
                        specifications={item.specifications}
                        pkgImageLink={item.imageUrl}
                        price={item.price}
                        showTaxText=" +tax"
                        showOfferRibbon={!!item.offerDetails}
                        offerColorCode={item?.offerDetails?.colorCode}
                        offerText1={
                          item?.offerDetails?.headline1?.includes("%s")
                            ? item?.offerDetails?.headline1?.replace(
                                "%s",
                                item?.offerDetails?.couponCode
                              )
                            : item?.offerDetails?.headline1
                        }
                        offerText2={
                          item?.offerDetails?.couponCode
                            ? item?.offerDetails?.headline3
                            : getOfferTextIcon(item?.offerDetails?.icon)
                        }
                        offerTextHasIcon={!item?.offerDetails?.couponCode}
                        selected={lensPackageSelected?.id == item?.id}
                        isRTL={pageInfo.isRTL}
                        onClickVideo={() => handleOnVideoClick(item.videoLink)}
                        onClick={(packageId: string, addOns?: string) => {
                          setId(packageId);
                          onLensCardClick(
                            item,
                            item.price.lkPrice + productDetailData.price.lkPrice
                          );
                        }}
                        onInfoIconClick={() => {
                          if (item?.offerDetails?.icon === "info") {
                            setGoldOfferPopup(item?.offerDetails?.popUp);
                            setSection("showGoldOfferModal");
                          }
                        }}
                        productPrices={item.price}
                        isExchangeFlow={isExchangeFlow}
                        country={pageInfo.country}
                        configData={configData}
                        localeData={localeData}
                      />
                    </div>
                  );
                }
              )}
            </PackageScreenCardContainer>
          )}
          {!packagesError && (
            <PackageScreenFooter>
              <BuyNowCTA
                disabled={lensPackageSelected && lensPackageSelected?.id ? false : true}
                onClick={handleButtonClick}
              >
                <BuyNowText>
                  {lensPackageSelected?.id
                    ? localeData?.FRAME_PLUS_LENS
                    : localeData?.FRAME_ONLY}
                  &nbsp;:&nbsp;
                  {lensPackageSelected?.price?.symbol ||
                    (packages &&
                      packages.length > 0 &&
                      packages[0]?.price?.symbol) ||
                    ""}
                  {totalPrice}
                </BuyNowText>
                <BuyNowAction>
                  <span>{PROCEED}</span>
                  <span
                    style={{
                      transform: pageInfo.isRTL ? "rotate(180deg)" : "",
                      marginBottom: pageInfo.isRTL ? "" : "-7px",
                      marginRight: pageInfo.isRTL ? "12px" : "",
                      marginLeft: pageInfo.isRTL ? "" : "12px",
                      marginTop: pageInfo.isRTL ? "-4px" : "",
                    }}
                  >
                    <img src="https://static.lenskart.com/media/desktop/img/DesignStudioIcons/RightArrowWithoutLineBig.svg" />{" "}
                  </span>
                </BuyNowAction>
              </BuyNowCTA>
            </PackageScreenFooter>
          )}
        </PackageScreenWrapper>
      </BottomSheet>
    </>
  );
};

export default PackageScreen;
