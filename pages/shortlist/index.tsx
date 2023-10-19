//> Default
import type { GetServerSideProps } from "next";
import Image from "next/image";
import { CommonLoader, Toast } from "@lk/ui-library";
import RecentlyViewedProducts from "../../components/PDP/Mobile/RecentlyViewedProducts/RecentlyViewedProducts";
import Slider from "@/components/PrescriptionModalV2/Slider";
import {
  resetPrescriptionData,
  setPrescriptionPageStatus,
  updatePrescriptionPage,
  updatePrevPrescriptionPage,
  updateCLEye,
  updateCLPrescription,
  setStoreLocatorPage,
} from "@/redux/slices/prescription";

//> Packages
import {
  fireBaseFunctions,
  headerFunctions,
  pdpFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { Wishlist, BottomSheet, SocialShare, Icons } from "@lk/ui-library";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import NextHead from "next/head";

//> Redux
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllWishlist,
  deleteOneWishlist,
  fetchWishlist,
} from "@/redux/slices/wishListInfo";

//> Types
import { APIMethods } from "@/types/apiTypes";
import { DataType, TypographyENUM } from "@/types/coreTypes";

//> Components
import Base from "containers/Base/Base.component";

//> Helpers
import { headerArr } from "helpers/defaultHeaders";
import { createAPIInstance } from "helpers/apiHelper";

//> Constants
import { COOKIE_NAME, LOCALE, CONFIG } from "../../constants";
import { DeviceTypes } from "@/types/baseTypes";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";

import styled from "styled-components";
import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useCustomerState from "hooks/useCustomerState";
import { APIService } from "@lk/utils";
import { modifyProductData } from "containers/ProductDetail/helper";
import LensSelection from "@/components/PDP/Mobile/LensSelection/LensSelection";
import { addToCartNoPower } from "@/redux/slices/cartInfo";
import PackageScreen from "@/components/PDP/Mobile/PackageScreen/PackageScreen";
import SelectContactLensEye from "@/components/PDP/Mobile/BuyContactLens/SelectContactLensEye";
import { updateProductDetailData } from "@/redux/slices/productDetailInfo";
import { selectLens, userProperties } from "helpers/userproperties";
import { Pages } from "@/components/PrescriptionModalV2/helper";

//> Styles
export interface ShortlistDataType {
  data: DataType;
}

export const ShortlistHeader = styled.div<{ isRTL?: boolean }>`
  display: flex;
  justify-content: space-between;
  ${(props) => (props.isRTL ? "margin-left: 10px" : "margin-right: 10px")};
  h1 {
    text-transform: uppercase;
    font-size: 16px;
    padding: 20px;
    font-family: ${TypographyENUM.defaultMedium};
    display: inline-block;
  }
  div {
    display: flex;
    gap: 5px;
    margin-top: auto;
    font-family: ${TypographyENUM.serif};
    span {
      color: var(--topaz);
      font-size: 18px;
      &:first-child {
        font-size: 13px;
        text-transform: uppercase;
      }
    }
  }
`;

const ShortlistContainer = styled.div`
  padding: 10px;
  font-family: ${TypographyENUM.lkSansRegular};
  -webkit-tap-highlight-color: transparent;
`;

const ShortlistCard = styled.a`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #fff;
  position: relative;
`;

const ProductHeader = styled.div<{ isRTL?: boolean }>`
  display: flex;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  span {
    &:first-child {
      width: 20px;
      height: 20px;
      text-align: center;
      position: relative;
      color: white;
      z-index: 0;
      svg {
        position: relative;
        z-index: -1;
        font-size: 23px;
        fill: #27394e;
      }
      span {
        position: absolute;
        font-size: 11px;
        ${(props) => (props.isRTL ? "right: 1.5px" : "left: 1.5px")};
        top: 4px;
      }
    }
  }
`;

const CrossSpan = styled.span`
  display: block;
  width: 20px;
  height: 20px;
  text-align: center;
  position: relative;
  color: white;
  z-index: 0;
  font-size: 11px;
  font-weight: 900;
  line-height: 20px;
  &::before {
    left: 0;
    top: 0;
    right: 0;
    content: "";
    background-color: #18cfa8;
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 100%;
    z-index: -1;
  }
`;

const ProductInfo = styled.div<{ productQty: number }>`
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  margin-bottom: 10px;
  font-family: ${TypographyENUM.lkSansBold};
  font-size: 14px;
  ${(props) => props?.productQty === 0 && "opacity: 0.4;"}
  span {
    &:last-child {
      font-family: ${TypographyENUM.lkSansHairline};
      color: #27394e;
      display: block;
      margin-top: 4px;
      font-size: 12px;
    }
  }
`;

const ProductImage = styled.img`
  width: 100%;
  margin-bottom: 10px;
`;

const ProductBottom = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 13px;
  span {
    font-family: ${TypographyENUM.lkSansBold};
  }
  div {
    background-color: #18cfa8;
    color: #fff;
    padding: 8px 10px;
    text-transform: uppercase;
    border-radius: 4px;
    font-size: 11px;
  }
`;

const EmptyData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: ${TypographyENUM.defaultMedium};
  font-size: 13px;
  margin-top: 30px;
  margin-bottom: 50px;
  img {
    margin-bottom: 20px;
  }
  span {
    &:first-child {
    }
    &:last-child {
      font-family: ${TypographyENUM.lkSansHairline};
      font-size: 11px;
    }
  }
`;

const OutOfStock = styled.div`
  position: absolute;
  top: 50%;
  color: #fff;
  right: 50%;
  background-color: #27394e;
  padding: 8px 16px;
  transform: translate(50%, -50%);
  font-family: "Roboto";
`;

const AddToCartButton = styled.div<{ backgroundColor: string }>`
  ${(props) =>
    props?.backgroundColor &&
    `background-color: ${props?.backgroundColor} !important;`}
`;

const Shortlist = ({ data }: ShortlistDataType) => {
  // const [productDetail, setProductDetail] = useState<undefined | object>(undefined);
  const [productDetail, setProductDetail] = useState<any>();
  const [section, setSection] = useState("");
  const [currentSelection, setCurrentSelection] = useState("");
  const [showPackageScreen, setShowPackageScreen] = useState(false);
  const [showPowerTypeModal, setShowPowerTypeModal] = useState(false);
  const [showShareBottomSheet, setShowShareBottomSheet] = useState(false);
  const [showListBottomSheet, setShowListBottomSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [fireGA, setFireGA] = useState(false);
  const Router = useRouter();
  const { userData, headerData, localeData, configData } = data;
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);

  // console.log(productDetail, "productDetail");

  const {
    // PDP_CTA_CONFIG,
    lensPackageTextConfig,
    BUY_ON_CALL_WIDGET,
    SHOW_BUY_ON_CHAT,
    SOCIAL_SHARE_CONFIG,
  } = configData;

  const { WHATSAPP_CHAT_URL } = localeData;
  const buyOnChatDetails = SHOW_BUY_ON_CHAT ? JSON.parse(SHOW_BUY_ON_CHAT) : {};
  const BUYONCHAT_HELP_CTA_PDP = buyOnChatDetails.content;

  const packageTextConfig =
    lensPackageTextConfig && JSON.parse(lensPackageTextConfig);
  const buyWithCallConfig =
    BUY_ON_CALL_WIDGET && JSON.parse(BUY_ON_CALL_WIDGET);

  //> Redux State
  const dispatch = useDispatch<AppDispatch>();
  const wishListInfo = useSelector((state: RootState) => state.wishListInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const { productDetailData } = useSelector(
    (state: RootState) => state.productDetailInfo
  );
  // console.log(productDetailData, "productDetailData");

  //> Delete single product from wishlist popup
  const onDeleteWishListItem = (id: number) => {
    dispatch(
      deleteOneWishlist({
        sessionId: userData.id,
        productId: id,
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  };
  //> Clear all items from wishlist popup
  const onClearWishList = () => {
    dispatch(
      deleteAllWishlist({
        sessionId: userData.id,
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
  };

  // > functions to set section state based on product type
  const showSelectEyeBottomSheet = () => {
    //> trigger relevant gtm here
    setSection("showSelectEyeModal");
  };

  const showSelectLensTypeBottomSheet = () => {
    setSection("showSelectLensTypeModal");
  };

  const handleOnSelectLens = (
    type: string,
    id: string
    // setCartActive: (arg0: boolean) => void,
  ) => {
    // console.log(type, id);
    setSection("");
    setCurrentSelection(id);
    if (["Frame Only", "Without Power"]?.indexOf(type) > -1) {
      const reqObj = {
        pid: productDetail.id,
        sessionId: `${getCookie(COOKIE_NAME)}`,
      };
      dispatch(addToCartNoPower(reqObj));
      //   setCartActive(true);
      // Router.push("/cart");
      return;
    }
    setShowPackageScreen(true);
    selectLens(
      type,
      userInfo?.mobileNumber?.toString(),
      userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
      pageInfo?.country
    );
  };

  useEffect(() => {
    dispatch(
      fetchWishlist({
        sessionId: userData.id,
        subdirectoryPath: pageInfo.subdirectoryPath,
      })
    );
    setProductDetail(undefined);
  }, []);

  useCustomerState({
    useMounted: false,
    userData: userData,
  });

  function addToCartHandler(pid: string) {
    (async () => {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
        .setHeaders([...headerArr])
        .setMethod(APIMethods.GET);
      api.sessionToken = getCookie(COOKIE_NAME) as string;
      const { data: prodDetail, error: err } =
        await pdpFunctions.getProductDetails(parseInt(pid), api);
      // console.log(prodDetail.detailData);
      setProductDetail(prodDetail.detailData);
    })();
  }

  useEffect(() => {
    if (productDetail?.classification === "sunglasses") {
      const reqObj = {
        pid: productDetail.id,
        sessionId: `${getCookie(COOKIE_NAME)}`,
      };
      dispatch(addToCartNoPower(reqObj));
      // Router.push("/cart");
    }
  }, [productDetail]);

  useEffect(() => {
    if (!cartData?.cartIsLoading && cartData?.cartPopupError) {
      setShowToast(true);
    }
  }, [cartData?.cartIsLoading, cartData?.cartPopupError]);

  // let suitedFor: any,
  //   lenskartPrice: any,
  //   powerOption: any,
  //   gender: any,
  //   productLensTypeDesc: any;
  // let productQuantity: any,
  //   classification: any,
  //   isPlano: any,
  //   prescriptionType: any,
  //   id: any;

  // const [suitedFor, setSuitedFor] = useState<any>(undefined);
  // const [lenskartPrice, setLenskartPrice] = useState<any>(undefined);
  // const [gender, setGender] = useState<any>(undefined);
  const [powerOption, setPowerOption] = useState<any>(undefined);
  const [productLensTypeDesc, setProductLensTypeDesc] =
    useState<any>(undefined);
  const [productQuantity, setProductQuantity] = useState<any>(undefined);
  const [classification, setClassification] = useState<any>(undefined);
  const [isPlano, setIsPlano] = useState<any>(undefined);
  const [prescriptionType, setPrescriptionType] = useState<any>(undefined);
  const [id, setId] = useState<any>(undefined);

  const [showPrescription, setShowPrescription] = useState(false);
  const {
    prevPrescriptionPage,
    clPrescriptionData,
    prescriptionPage,
    prescriptionPageStatus,
    storeSlots,
  } = useSelector((state: RootState) => state.prescriptionInfo);

  useEffect(() => {
    if (productDetail) {
      const {
        suitedFor,
        lenskartPrice,
        powerOption,
        gender,
        productLensTypeDesc,
      } = modifyProductData(productDetail);
      const { productQuantity, classification, isPlano, prescriptionType, id } =
        productDetail;
      setPowerOption(powerOption);
      setProductLensTypeDesc(productLensTypeDesc);
      setProductQuantity(productQuantity);
      setIsPlano(isPlano);
      setClassification(classification);
      setPrescriptionType(prescriptionType);
      setId(id);
    }
  }, [productDetail]);

  useEffect(() => {
    if (id) {
      handleBuyNow();
    }
  }, [
    powerOption,
    productLensTypeDesc,
    productQuantity,
    isPlano,
    classification,
    prescriptionType,
    id,
  ]);

  const whatsAppChatMsg =
    WHATSAPP_CHAT_URL &&
    buyOnChatDetails &&
    `${WHATSAPP_CHAT_URL}${BUYONCHAT_HELP_CTA_PDP}${id}`.replace(
      "<phoneNumber>",
      buyOnChatDetails.number
    );

  function handleBuyNow() {
    //> we'll show buy on app or try alternative product if qty = 0
    if (!productQuantity) return;

    //> contact lens
    if (classification === "contact_lens") {
      if (isPlano) {
        //> add to cart directly - zero power contact lens
      } else {
        //> select eye and power
        showSelectEyeBottomSheet();
      }
    } else if (
      (["eyeframe", "sunglasses"]?.indexOf(classification) > -1 &&
        prescriptionType.length > 1) ||
      (prescriptionType.length === 1 &&
        ["frame_only", "without_power"]?.indexOf(prescriptionType[0].id) === -1)
    ) {
      //> power product other than contact lens, show lens type bottomsheet
      showSelectLensTypeBottomSheet();
    } else {
      //> frame only product - add to cart
      const addToCartJSON: { productId: number; powerType?: string } = {
        productId: id,
      };
      if (
        powerOption &&
        ["Frame Only", "Without Power"]?.indexOf(powerOption) > -1
      ) {
        addToCartJSON.powerType = powerOption;
      }
    }
  }

  //> Add to Cart - Only Lens
  const addToCartNoPowerHandler = (powerType?: string) => {
    if (powerType) {
      const reqObj: {
        pid: number;
        sessionId: string;
        powerType: string;
        orderId?: number;
        itemId?: number;
      } = {
        pid: productDetail.id,
        powerType: powerType,
        sessionId: userData.id,
      };
      //     if (isExchangeFlow) setExchangeCookies();
      //     if (returnOrderId) reqObj.orderId = returnOrderId;
      //     if (returnItemId) reqObj.itemId = returnItemId;
      dispatch(addToCartNoPower(reqObj));
      // setShowPowerTypeModal(false);
    } else {
      const reqObj: {
        pid: number;
        sessionId: string;
        orderId?: number;
        itemId?: number;
      } = {
        pid: productDetail.id,
        sessionId: userData.id,
      };
      //     if (isExchangeFlow) setExchangeCookies();
      //     if (returnOrderId) reqObj.orderId = returnOrderId;
      //     if (returnItemId) reqObj.itemId = returnItemId;
      dispatch(addToCartNoPower(reqObj));
      // Router.push("/cart");
    }
    // Router.push("/cart");
  };

  const [product, setProduct] = useState();

  const domain: string = configData?.DOMAIN;
  // console.log(configData.DOMAIN);

  const [shareUri, setShareUri] = useState("");
  const shareText =
    "Check out my personal saved list of glasses on Lenskart.com";

  //   useEffect(() => {}, [wishListInfo.productIds]);

  function handleOnShareClick(
    e: MouseEvent,
    product: { id: string; productUrl: string }
  ) {
    setShareUri(`${domain}/shortlist?pIds=${product.id}`);
    e.preventDefault();
    setShowShareBottomSheet(true);
    setProduct(product);
  }

  function handleOnListShareClick() {
    if (wishListInfo.productIds) {
      setShareUri(
        `${domain}/shortlist?pIds=${wishListInfo.productIds
          .join(",")
          .toString()}`
      );
    }
    setShowShareBottomSheet(true);
  }

  function closeBottomSheet() {
    setShowShareBottomSheet(false);
  }

  function closeListBottomSheet() {
    setShowListBottomSheet(false);
  }

  function handleShareMedium(type: string) {
    if (typeof window !== undefined) {
      if (type === "whatsapp") {
        window.location.href = `https://api.whatsapp.com/send?text=${shareUri}`;
      } else if (type === "facebook") {
        window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUri}`;
      } else if (type === "twitter") {
        window.location.href = `https://twitter.com/intent/tweet?url=${shareUri}&text=${localeData.PERSONAL_SAVED_LIST_ON_LENSKART_COM}&via=lenskart_com&hashtags=specsy,lenskart`;
      }
    }
  }

  function handleListShareMedium(type: string) {
    if (typeof window !== undefined) {
      if (type === "whatsapp") {
        window.location.href = `https://api.whatsapp.com/send?text=${product?.productURL}`;
      } else if (type === "facebook") {
        window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${product?.productURL}`;
      } else if (type === "twitter") {
        window.location.href = `https://twitter.com/intent/tweet?url=${product?.productURL}&text=${productDetail?.fullName}&via=lenskart_com&hashtags=specsy,lenskart`;
      }
    }
  }

  const closeSlider = (close: boolean) => {
    if (close) {
      dispatch(resetPrescriptionData());
      dispatch(setPrescriptionPageStatus(false));
    } else {
      if (
        prescriptionPage === Pages.STORE_VISIT &&
        storeSlots?.storePage !== "1"
      ) {
        if (storeSlots?.storePage === "2") {
          dispatch(setStoreLocatorPage("1"));
        } else if (storeSlots?.storePage === "3") {
          dispatch(setStoreLocatorPage("2"));
        }
      } else if (
        !prevPrescriptionPage ||
        prevPrescriptionPage === prescriptionPage
      ) {
        dispatch(resetPrescriptionData());
        dispatch(setPrescriptionPageStatus(false));
        setShowPrescription(false);
      } else {
        dispatch(updatePrescriptionPage(prevPrescriptionPage));
        // dispatch(updatePrevPrescriptionPage(""));
      }
    }
  };

  const onClickSelectEye = (qty: number, eye: string) => {
    setSection("");
    dispatch(updateCLEye(eye));
    dispatch(
      updateCLPrescription({
        ...clPrescriptionData.prescription,
        powerType: "CONTACT_LENS",
      })
    );
    setShowPrescription(true);
  };

  //   function handleShareMediuList(type: string) {
  //     if (typeof window !== undefined) {
  //         if (type === "whatsapp") {
  //             window.location.href = `whatsapp://send?text=${product?.productUrl}`;
  //         } else if (type === "facebook") {
  //             window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${product.productURL}`;
  //         } else if (type === "twitter") {
  //             window.location.href = `https://twitter.com/intent/tweet?url=${product.productURL}&text=${productDetail?.fullName}&via=lenskart_com&hashtags=specsy,lenskart`;
  //         }
  //     }
  // }
  useEffect(() => {
    if (fireGA) {
      const pageName = "shortlist";
      userProperties(userInfo, pageName, pageInfo, configData, "shortlist");
    }
  }, [fireGA]);

  useEffect(() => {
    if (!userInfo?.userLoading) {
      setTimeout(() => {
        setFireGA(true);
      }, 0);
    }
  }, [userInfo.userLoading]);

  return (
    <>
      <ErrorBoundary>
        <Base
          headerData={headerData}
          sessionId={userData?.id}
          isExchangeFlow={false}
          configData={configData}
          localeData={localeData}
          trendingMenus={configData?.TRENDING_MENUS}
          languageSwitchData={configData?.LANGUAGE_SWITCH_DATA}
        >
          <NextHead>
            <title>Shortlist</title>
          </NextHead>
          <div
            style={{
              backgroundColor: "#eaeff4",
              minHeight: "calc(100vh - (288.3px))",
            }}
          >
            {wishListInfo.numberOfProducts > 0 && (
              <ShortlistHeader isRTL={pageInfo.isRTL}>
                <h1>{localeData.MY_SAVED_LIST}</h1>
                <div onClick={handleOnListShareClick}>
                  <span>{localeData.SHARE_LIST}</span>
                  <span>
                    <Icons.ShareMobile />
                  </span>
                </div>
              </ShortlistHeader>
            )}
            {showToast && (
              <Toast
                timeOut={4000}
                text={cartData?.cartErrorMessage}
                hideFn={() => {
                  setShowToast(false);
                }}
                width={"90%"}
              />
            )}
            <ShortlistContainer>
              <CommonLoader show={wishListInfo.isLoading} />
              {wishListInfo?.productList?.length > 0 ? (
                <>
                  {wishListInfo?.productList?.map(
                    (product: any, index: number) => {
                      console.log(product, "wishListInfo?.productList");
                      return (
                        <ShortlistCard
                          key={index + "shortlist"}
                          href={`${product.productUrl}`}
                        >
                          <ProductHeader isRTL={pageInfo.isRTL}>
                            <span>
                              <span>{index + 1}</span>
                              <Icons.Certificate />
                            </span>
                            <div>
                              <Icons.ShareMobile
                                onClick={(e: MouseEvent) =>
                                  handleOnShareClick(e, product)
                                }
                              />
                              <CrossSpan
                                onClick={(e) => {
                                  e.preventDefault(); //> to stop href from triggering
                                  onDeleteWishListItem(product.id);
                                }}
                              >
                                X
                              </CrossSpan>
                            </div>
                          </ProductHeader>
                          <ProductInfo productQty={product.productQty}>
                            <ProductImage src={product?.frontImage} />
                            <span>{product?.brandName}</span>
                            <span>{product?.productName}</span>
                          </ProductInfo>
                          <ProductBottom>
                            <span>
                              {product?.prices?.symbol}
                              {product?.prices?.lkPrice}
                            </span>
                            <AddToCartButton
                              onClick={(e) => {
                                e.preventDefault(); //> to stop href from triggering
                                addToCartHandler(product.id);
                              }}
                              backgroundColor={
                                product?.productQty === 0 ? "#99a0a9" : ""
                              }
                            >
                              Add to cart
                            </AddToCartButton>
                          </ProductBottom>
                          {product.productQty === 0 && (
                            <OutOfStock>{localeData?.OUT_OF_STOCK}</OutOfStock>
                          )}
                        </ShortlistCard>
                      );
                    }
                  )}
                </>
              ) : wishListInfo.isLoading ? (
                <></>
              ) : (
                <EmptyData>
                  <img
                    src="https://static.lenskart.com/media/mobile/universal/assets/shortlist-empty.png"
                    alt=""
                  />
                  <span>
                    {localeData.DANG_YOUR_SHORTLIST_IS_EMPTY ||
                      "Dang Your shortlist is empty."}
                  </span>
                  <span>
                    {localeData.TIME_TO_PICK_YOUR_FAVOURITES ||
                      "Time to pick your favourites."}
                  </span>
                </EmptyData>
              )}
            </ShortlistContainer>
            <RecentlyViewedProducts shortlist={true} localeData={localeData} />
          </div>
          {showPrescription && (
            <Slider
              show={showPrescription}
              localeData={localeData}
              configData={configData}
              closeSlider={closeSlider}
              productData={productDetail}
              powerType="CONTACT_LENS"
              preCheckout={true}
            />
          )}
          {showPackageScreen && (
            <PackageScreen
              currentSelection={currentSelection}
              productDetailData={productDetail}
              id={productDetail.id}
              sessionId={userData?.id}
              configData={configData}
              localeData={localeData}
              addToCartNoPowerHandler={addToCartNoPowerHandler}
              setShowPackageScreen={setShowPackageScreen}
              showPackageScreen={showPackageScreen}
              isExchangeFlow={false}
              showSelectLens={showSelectLensTypeBottomSheet}
            />
          )}
          <BottomSheet
            show={section}
            closebottomSheet={() => setSection("")}
            onBackdropClick={() => setSection("")}
            backgroundColor="#F7F2ED"
            borderRadius="0"
          >
            {productDetail &&
              {
                showSelectLensTypeModal: (
                  <>
                    <LensSelection
                      title={
                        localeData.CHOOSE_POWER_TYPE || "Choose Power Type"
                      }
                      prescriptionType={productDetail.prescriptionType}
                      packageTextConfig={packageTextConfig}
                      productLensTypeDesc={productLensTypeDesc}
                      category={productDetail?.type}
                      buyWithCallConfig={buyWithCallConfig}
                      whatsAppChatMsg={whatsAppChatMsg}
                      price={productDetail?.price}
                      onClickHandler={handleOnSelectLens}
                      localeData={localeData}
                      country={pageInfo.country}
                    />
                  </>
                ),
                showSelectEyeModal: (
                  <>
                    <SelectContactLensEye
                      dataLocale={localeData}
                      onClickSelectEye={onClickSelectEye}
                    />
                  </>
                ),
              }[section]}
          </BottomSheet>
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
              config={SOCIAL_SHARE_CONFIG}
            />
          </BottomSheet>
          <BottomSheet
            show={showListBottomSheet}
            closebottomSheet={closeListBottomSheet}
            backgroundColor="#eaeff4"
            borderRadius="0"
            onBackdropClick={closeListBottomSheet}
          >
            <SocialShare
              handleClick={(type: string) => handleListShareMedium(type)}
              dataLocale={localeData}
              config={SOCIAL_SHARE_CONFIG}
            />
          </BottomSheet>
        </Base>
      </ErrorBoundary>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const api = createAPIInstance({});

  const isSessionAvailable = hasCookie(COOKIE_NAME, { req, res });
  if (!isSessionAvailable) {
    api.setMethod(APIMethods.POST);
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      api
    );
    if (error.isError) {
      console.log("error");
      return {
        notFound: true,
      };
    }
    setCookie(COOKIE_NAME, sessionId.sessionId, { req, res });
    api.resetHeaders();
    api.sessionToken = sessionId.sessionId;
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  } else {
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(COOKIE_NAME, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }

  const configApi = createAPIInstance({
    url:
      process.env.NEXT_PUBLIC_CONFIG_URL ||
      "https://stage.lenskart.io/api/v1/static/",
  });

  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi);
  const { data: localeData, error: localeDataError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: configError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);
  if (
    headerDataError.isError ||
    localeDataError.isError ||
    userError.isError ||
    configError.isError
  ) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });

  return {
    props: {
      data: {
        userData: userData?.customerInfo || null,
        headerData,
        localeData,
        configData,
      },
    },
  };
};

export default Shortlist;
