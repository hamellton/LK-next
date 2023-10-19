import {
  ListingWrapper,
  NoResFound,
  RowWrapper,
  ShowCountContainer,
  NoResultOuter,
  NoResultHeader,
  NoResultBody,
  ButtonSection,
  CategoryButton,
  ButtonContent,
  ListingWrapperContainer,
  CardWrapperParent,
  SimilarFlex,
  // BottomLine,
} from "./ListingStyles";
import {
  PlpSkeleton,
  ProductCardNew,
  CollapsibleSidebar,
  ProductContainerStructure,
  FloatingBuyOnChat,
} from "@lk/ui-library";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { CategoryData, CategoryParams } from "@/types/categoryTypes";
import {
  fetchFilters,
  lazyloadProductList,
  fetchQueryData,
  updateDefaultParams,
} from "@/redux/slices/categoryInfo";
import { useRouter } from "next/router";
import {
  getCygnusOverlayImage,
  getDittoImage,
  setDittoAuth,
  setIsImageLoaded,
  setNonCygnusImageInfo,
} from "@/redux/slices/ditto";
import React from "react";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import {
  deleteOneWishlist,
  saveToWishlist,
  setWishListShow,
} from "@/redux/slices/wishListInfo";
import { addToWishList, userProperties } from "helpers/userproperties";
import {
  viewItemListGA4,
  productImpressionGA,
  addToWishListGA4,
  selectItemGA4,
  ctaClickEvent,
} from "helpers/gaFour";
import {
  ConfigType,
  DataType,
  LocaleDataType,
  LocalType,
} from "@/types/coreTypes";
import useDimensions from "hooks/useDimensions";
import "react-loading-skeleton/dist/skeleton.css";
import { DeviceTypes } from "@/types/baseTypes";
import {
  BannerImg,
  BannerStaticBanner,
  StaticBanner,
} from "containers/Category/CategoryStyles";
import { ProductTypeBasic } from "@/types/productDetails";
import {
  A,
  Invis,
  Li,
  NoResultHeaderDes,
} from "containers/PageError/PageError.styles";
import { dataLocale } from "containers/Base/footerData";
import { updateProductListLoading } from "@/redux/slices/categoryInfo";
import {
  gaBannerImgObserver,
  getCurrency,
  removeDomainName,
} from "helpers/utils";
import { extractUtmParams, localStorageHelper } from "@lk/utils";
import {
  categoryVirtualPageView,
  productVirtualPageView,
} from "helpers/virtualPageView";
import { getUserEventData } from "containers/Base/helper";
import { passUtmData } from "@/redux/slices/userInfo";

interface ListingProps extends LocalType, ConfigType {
  params: CategoryParams[];
  currentItemCount: number;
  totalCount: number;
  isExchangeFlow: boolean;
  switchToTop: boolean;
  setSwitchToTop: (props: boolean) => void;
  setScrollPosition: (props: number) => void;
  setInternalScrollPosition: (props: number) => void;
  query?: string | number;
  initialLoad?: boolean;
  search?: boolean;
  windowHeight: number;
  isGridView: boolean;
  localeData: LocaleDataType;
  categoryData: CategoryData;
  productData: ProductTypeBasic[];
  isScrollTop: boolean;
}
interface CellProps {
  index: number;
  style: CSSProperties;
}

interface DefaultPage {
  pageCount: number;
  pageSize: number;
}

const ListingV2 = ({
  setScrollPosition,
  setInternalScrollPosition,
  switchToTop,
  setSwitchToTop,
  params,
  currentItemCount,
  totalCount,
  localeData,
  configData,
  isExchangeFlow,
  query,
  initialLoad = true,
  search = false,
  windowHeight,
  isGridView = false,
  categoryData,
  productData,
  isScrollTop,
}: ListingProps) => {
  let pageName = "plp-page";
  const dispatch = useDispatch<AppDispatch>();
  const tableRef = useRef<HTMLElement>();
  const router = useRouter();
  const listInnerRef = useRef();
  const [currentProductData, setCurrentProductData] = useState<
    ProductTypeBasic[]
  >(productData || []);
  const [currentCategoryData, setCurrentCategoryData] =
    useState<CategoryData | null>(categoryData);
  const [currentProductLoading, setCurrentProductLoading] =
    useState<boolean>(false);

  const [fireViewListGA, setFireViewListGA] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const {
    productList,
    categoryData: resCatData,
    productListLoading,
    defaultParams,
    isDittoEnabled,
    filterSelected,
    stopPagination,
  } = useSelector((state: RootState) => state.categoryInfo);

  useEffect(() => {
    if (location.search.includes("search=true")) {
      setIsSearch(true);
    }
  }, []);

  useEffect(() => {
    setCurrentCategoryData(resCatData);
    setCurrentProductData(productList || []);
    setCurrentProductLoading(productListLoading);
  }, [productList, resCatData, productListLoading]);

  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { id, deviceType, country, subdirectoryPath } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const cards =
    pageInfo.deviceType === DeviceTypes.MOBILE ? (isGridView ? 2 : 1) : 3;

  const { sessionId } = useSelector((state: RootState) => state.userInfo);
  const { isImageLoaded, cygnus } = useSelector(
    (state: RootState) => state.dittoInfo
  );
  const { productIds: wishlistPIDs } = useSelector(
    (state: RootState) => state.wishListInfo
  );
  const cartData = useSelector((state: RootState) => state.cartInfo);

  const plpRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { width } = useDimensions({
    element: plpRef.current,
    conversionFn: () => {},
  });
  const enableAlgoliaSearch =
    configData?.ENABLE_ALGOLIA_CONFIG && deviceType == DeviceTypes.MOBILE;
  const getCygnusImage = (pid: number) => {
    const guestId = getCookie("dittoGuestId")?.toString() || "";
    dispatch(
      getCygnusOverlayImage({
        pid: pid,
        sessionId: sessionId,
        guestId:
          userInfo.isLogin &&
          userInfo.mobileNumber &&
          userInfo.userDetails?.cygnus?.cygnusId
            ? ""
            : userInfo.userDetails?.cygnus?.cygnusId || guestId,
        phoneNumber:
          userInfo.isLogin &&
          userInfo.mobileNumber &&
          userInfo.userDetails?.cygnus?.cygnusId
            ? userInfo.mobileNumber?.toString()
            : "",
        phoneCode: pageInfo.countryCode,
      })
    );
  };

  const { PAGE_ERROR_LINKS, PAGE_ERROR_URL } = configData;
  const pageErrorLinks = PAGE_ERROR_LINKS ? PAGE_ERROR_LINKS : [];

  useEffect(() => {
    if (
      isDittoEnabled &&
      getCookie("isDitto") &&
      (getCookie("dittoGuestId") || userInfo.userDetails?.cygnus?.cygnusId)
    ) {
      currentProductData.forEach((product) => {
        if (!product?.isDitto) {
          dispatch(setNonCygnusImageInfo(product.id));
        } else if (
          cygnus.cygnusImageData &&
          !cygnus.cygnusImageData[product.id] &&
          cygnus.cygnusImageData[product.id] !== ""
        )
          getCygnusImage(product.id);
      });
    }
  }, [
    isDittoEnabled,
    currentProductData,
    // cygnus.cygnusImageData,
    // getCygnusImage,
    userInfo.userDetails?.cygnus?.cygnusId,
  ]);

  useEffect(() => {
    if (
      getCookie("isDitto") &&
      getCookie("isDittoID") &&
      getCookie("isDittoID") !== "lenskart"
    ) {
      const dittoID = (getCookie("isDittoID") || "").toString();
      dispatch(
        setDittoAuth({
          sessionId: sessionId,
          dittoId: dittoID,
          set: true,
        })
      );
    }
    if (!userInfo.userLoading) {
    }
  }, [
    sessionId,
    userInfo.userLoading,
    pageInfo,
    configData,
    pageName,
    dispatch,
    currentProductData,
    userInfo,
  ]);
  useEffect(() => {
    if (deviceType === DeviceTypes.DESKTOP) {
      let event: string = "view-item-list";
      // viewItemListGA4(
      //   currentProductData,
      //   userInfo.isLogin,
      //   event,
      //   categoryData,
      //   pageInfo
      // );
      // userProperties(
      //   userInfo,
      //   pageName,
      //   pageInfo,
      //   configData,
      //   "product-listing-page"
      // );
      // let event: string = "view-item-list";
      // viewItemListGA4(currentProductData, userInfo.isLogin, event);
      // productImpressionGA(
      //   currentCategoryData,
      //   currentProductData,
      //   userInfo.isLogin
      // );
      // todoproduct listing
      // ProductListing();
    }
    gaBannerImgObserver("0px", window, userInfo, pageInfo);
  }, []);

  useEffect(() => {
    if (fireViewListGA && deviceType === DeviceTypes.DESKTOP) {
      let event: string = "view-item-list";
      viewItemListGA4(
        productList,
        userInfo.isLogin,
        event,
        categoryData,
        pageInfo
      );
      userProperties(
        userInfo,
        pageName,
        pageInfo,
        configData,
        "product-listing-page"
      );
      const utmParameters =
        typeof window !== "undefined" &&
        window &&
        extractUtmParams(window.location.search);
      const categoryID = pageInfo.id;
      const categoryName = categoryData?.categoryName;
      categoryVirtualPageView(
        userInfo,
        utmParameters,
        pageInfo,
        cartData,
        categoryID,
        categoryName
      );
    }
  }, [fireViewListGA]);

  useEffect(() => {
    if (pageInfo.id && !userInfo?.userLoading) {
      setTimeout(() => {
        setFireViewListGA(true);
      }, 0);
    }
  }, [pageInfo, userInfo.userLoading]);

  useEffect(() => {
    if (switchToTop) {
      scrollTop();
      setSwitchToTop(false);
    }
  }, [switchToTop, setSwitchToTop]);

  const offerNameToText = (offerText: string) => {
    return (
      (configData?.PRODUCT_OFFERID_CONFIG_DESKTOP &&
        JSON.parse(configData?.PRODUCT_OFFERID_CONFIG_DESKTOP)?.[offerText]?.new
          ?.text2) ||
      ""
    );
  };

  useEffect(() => {
    if (location.pathname.includes("/search")) {
      window?.fbq("track", "Search", {
        content_type: "product",
        search_string: currentCategoryData?.categoryName,
        success: categoryData?.productCount > 0 ? 1 : 0,
      });
    }
  }, []);

  const onWishListClick = async (product: any, isWishListSelected: boolean) => {
    addToWishList(product, userInfo, pageInfo, categoryData);
    if (isWishListSelected) {
      dispatch(
        deleteOneWishlist({
          productId: product.id,
          sessionId: sessionId,
          subdirectoryPath: subdirectoryPath,
        })
      );
      if (deviceType === DeviceTypes.MOBILE)
        dispatch(
          setWishListShow({ show: true, url: router.asPath, isRemoved: true })
        );
    } else {
      const reqObj: {
        productId: number;
        sessionId: string;
        subdirectoryPath: string;
        url: string;
      } = {
        productId: product.id,
        sessionId: sessionId,
        subdirectoryPath: subdirectoryPath,
        url: router.asPath,
      };
      dispatch(saveToWishlist(reqObj));
    }
  };
  // code for banner
  let categoryBanner;
  const bannerConfig =
    (configData.BANNER_OFFER_CONFIG &&
      JSON.parse(configData.BANNER_OFFER_CONFIG)) ||
    {};
  if (typeof window !== "undefined" && bannerConfig?.plp_banners) {
    categoryBanner = bannerConfig?.plp_banners.find((item: any) =>
      window?.location?.pathname.includes(item.category)
    );
  }
  const mobileBanner = categoryBanner?.mobile || [];
  const desktopBanner = categoryBanner?.desktop || [];
  const newMobileBanner =
    mobileBanner?.map((item: any) => {
      return {
        ...item,
        index:
          item.index === 0
            ? 0
            : item.index % 2 !== 0
            ? item.index + 1
            : item.index,
      };
    }) || [];
  const newDesktopBanner =
    desktopBanner?.map((item: any) => {
      return {
        ...item,
        index:
          item.index === 0
            ? 0
            : item.index % 2 !== 0
            ? item.index + 1
            : item.index,
      };
    }) || [];
  // const showVideoWidget = (BANNER: string, bannerObj: any) => {
  //   return (
  //     <div>
  //       <iframe
  //         allowFullScreen
  //         allow="autoplay; fullscreen; picture-in-picture"
  //         frameBorder="0"
  //         src={`${bannerObj?.video_url}?autoplay=${bannerObj?.video_props?.isAutoplay ? 1 : 0
  //           }&muted=${bannerObj?.video_props?.isMute ? 1 : 0
  //           }&loop=1&autopause=0&showinfo=0&controls=${bannerObj?.video_url.includes('youtube.com') ? 1 : 0
  //           }&title=0&byline=0&portrait=0&sidedock=0`}
  //         style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
  //         title={`${BANNER}-${bannerObj?.index}`}
  //         width="100%"
  //       />
  //     </div>
  //   );
  // };
  const [sideBarHeight, setSideBarHeight] = useState(
    pageInfo.isRTL ? -745 : 745
  );
  const [similarProductsData, setSimilarProductsData] = useState([]);
  const similarProducts = (products: any) => {
    setSimilarProductsData(products);
    setSideBarHeight(0);
  };

  const whatsAppChatMsg =
    localeData.WHATSAPP_CHAT_URL &&
    localeData.BUYONCHAT_HELP_CTA_PLP &&
    `${localeData.WHATSAPP_CHAT_URL}${localeData.BUYONCHAT_HELP_CTA_PLP}`;

  const ENABLE_FLOATING_WHATSAPP_ICON =
    deviceType === DeviceTypes.MOBILE &&
    whatsAppChatMsg &&
    configData?.BUY_ON_CALL_WIDGET &&
    JSON.parse(configData?.BUY_ON_CALL_WIDGET)?.buyonchat;

  const handleOnFloatingBuyOnChat = () => {
    const userEventDataObj = getUserEventData("BUY_ON_CHAT");
    dispatch(
      passUtmData({
        sessionId: getCookie(`clientV1_${pageInfo?.country}`)?.toString(),
        eventObj: userEventDataObj,
      })
    );
  };

  const rowRef: any = useRef();
  const Cell = ({ index, style }: CellProps) => {
    return (
      <>
        <div style={style}>
          {!productListLoading ? (
            currentProductData.slice(index * cards, index * cards + cards)
              .length > 0 && (
              <RowWrapper isRTL={pageInfo.isRTL} ref={rowRef}>
                {currentProductData
                  .slice(index * cards, index * cards + cards)
                  .map((product, idx) => {
                    return (
                      <ProductCardNew
                        key={idx}
                        isSearch={isSearch}
                        showTitle={false}
                        offerText={offerNameToText(product.offerText)}
                        productData={product}
                        dataLocale={localeData}
                        isDitto={isDittoEnabled}
                        isDittoImageLoaded={isImageLoaded}
                        isExchangeFlow={isExchangeFlow}
                        triggerWishlist={(
                          product: any,
                          isWishListSelected: boolean
                        ) => onWishListClick(product, isWishListSelected)}
                        wishlistPIDs={wishlistPIDs}
                        width={width / cards}
                        cygnus={cygnus.cygnusImageData?.[product.id]}
                        isGridView={isGridView}
                        device={deviceType}
                        isRTL={pageInfo.isRTL}
                        subdirectoryPath={subdirectoryPath}
                        router={router}
                        showTax={configData.SHOW_TAX}
                        similarProducts={similarProducts}
                        onClick={() => {
                          let productListingInfo =
                            (localStorageHelper.getItem("productListingInfo") &&
                              JSON.parse(
                                localStorageHelper.getItem("productListingInfo")
                              )) ||
                            {};

                          productListingInfo = {
                            ...productListingInfo,
                            [product?.id]: {
                              item_list_id: pageInfo.id,
                              item_list_name: categoryData?.categoryName,
                              index: (idx + 1) * (index + 1),
                            },
                          };
                          localStorageHelper.setItem(
                            "productListingInfo",
                            JSON.stringify(productListingInfo)
                          );
                          selectItemGA4(
                            product,
                            userInfo.isLogin,
                            pageInfo,
                            pageInfo.id,
                            categoryData?.categoryName,
                            (idx + 1) * (index + 1)
                          );
                        }}
                        triggerCtaGA={(
                          cta_name: string,
                          cta_flow_and_page: string
                        ) => {
                          const eventName = "cta_click";
                          // const cta_name = "color-options";
                          // const cta_flow_and_page = "product-listing-page";
                          ctaClickEvent(
                            eventName,
                            cta_name,
                            cta_flow_and_page,
                            userInfo,
                            pageInfo
                          );
                        }}
                      />
                    );
                  })}
                {/* </> */}
                {ENABLE_FLOATING_WHATSAPP_ICON && (
                  <FloatingBuyOnChat
                    whatsAppChatMsg={whatsAppChatMsg}
                    imgSrc="https://static1.lenskart.com/media/mobile/images/whatsapp-gogreen.png"
                    onClickHandler={handleOnFloatingBuyOnChat}
                  />
                )}
              </RowWrapper>
            )
          ) : (
            <RowWrapper isRTL={false} ref={rowRef}>
              {Array.from({ length: cards }, (_, idx: number) => (
                <PlpSkeleton
                  key={`plpskelton_${idx}_${index}`}
                  width={300 / cards}
                  cards={cards}
                  height={cards !== 2 ? 350 : 150}
                />
              ))}
            </RowWrapper>
          )}
        </div>
      </>
    );
  };

  const isItemLoaded = (index: number) => {
    return !!currentProductData[cards * (index + 1) - 1];
  };

  const scrollTop = () => {
    if (tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
  };

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    // console.log(startIndex, stopIndex, "startIndex: number, stopIndex: number");

    if (currentProductData.length && !location.pathname.includes("/search")) {
      // console.log("in 2");

      // console.log("inin", defaultParams, productList.length);

      const pageSet: DefaultPage = {
        pageCount: defaultParams.pageCount + 1,
        pageSize: defaultParams.pageSize,
      };
      let queryParams = { ...router.query };
      let filter: DataType[] = [];
      // console.log(pageSet);

      dispatch(updateDefaultParams(pageSet));
      if (queryParams["sort"]) {
        filter = [...filter, ...params];
      }
      if (Object.keys(filterSelected).length) {
        Object.keys(filterSelected).forEach((val) => {
          filter.push({
            key: val,
            value: [...filterSelected[val]],
          });
        });
      }
      dispatch(
        fetchFilters({
          id: id,
          sessionId: sessionId,
          defaultFilters: pageSet,
          otherParams: [...filter],
          search: search,
          isLogin: userInfo.isLogin,
          pageInfo,
          categoryData,
          isAlgoliaSearch: enableAlgoliaSearch,
          similarProductId: window.location.search.includes("similarProductId"),
        })
      );
      // viewItemListGA4(
      //   productList,
      //   userInfo.isLogin,
      //   "view-item-list",
      //   categoryData,
      //   pageInfo
      // );

      if (!filter.length && !Object.keys(filterSelected).length) {
        delete queryParams["frame_size_id"];
        queryParams["pageCount"] = (defaultParams.pageCount + 1).toString();
      }

      router.replace({ query: { ...queryParams } }, undefined, {
        shallow: true,
      });
    } else if (
      currentProductData.length &&
      // !initialLoad &&
      location.pathname.includes("/search")
    ) {
      if (
        currentProductData.length <= 15 &&
        deviceType !== DeviceTypes.MOBILE
      ) {
        // scrollTop();
      }

      // if (currentProductData.length >= (defaultParams.pageCount + 1) * 4) {
      let queryParams = { ...router.query };

      const pageSet: DefaultPage = {
        pageCount: defaultParams.pageCount + 1,
        pageSize: defaultParams.pageSize,
      };
      let filters: DataType[] = [];

      if (queryParams["sort"]) {
        filters = [...filters, ...params];
      }

      if (Object.keys(filterSelected).length) {
        Object.keys(filterSelected).forEach((element) => {
          filters.push({ key: element, value: filterSelected[element] });
        });
      }

      dispatch(updateDefaultParams(pageSet));
      dispatch(
        fetchQueryData({
          sessionId: getCookie(`clientV1_${country}`)?.toString() || "",
          query: query?.toString() || "",
          pageSize: defaultParams.pageSize,
          pageNumber: defaultParams.pageCount + 1,
          otherFilters: filters,
          subdirectoryPath: pageInfo.subdirectoryPath,
          isAlgoliaSearch: enableAlgoliaSearch,
          similarProductId: window.location.search.includes("similarProductId"),
        })
      );
      // } else {
      //   dispatch(updateProductListLoading(false));
      // }
    } else {
      dispatch(updateProductListLoading(false));
    }
  };

  const sizeMap: any = useRef({});
  const listRef: any = useRef();
  const setSize = useCallback((index: any, size: any) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);
  const getSize = (index: string | number) => {
    // if (search) return 430;
    // else
    return sizeMap.current[index] !== 0
      ? (sizeMap.current[index] + (isGridView ? 25 : 10) > 310
          ? sizeMap.current[index] + (isGridView ? 25 : 10)
          : 310) || 390
      : 100;
  };
  const [scrollPosition, setScrollPosition2] = useState(0);
  // console.log(heightTemp);

  // Function to update the scroll position state
  const updateScrollPosition = () => {
    const currentPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    setScrollPosition2(currentPosition);
    setScrollPosition(currentPosition);

    setInternalScrollPosition(currentPosition || 0);
  };

  useEffect(() => {
    // Add scroll event listener and update scroll position
    window.addEventListener("scroll", updateScrollPosition);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const scrollExtra = deviceType === DeviceTypes.MOBILE ? 900 : 1500;
      if (
        resCatData?.productCount &&
        scrollPosition + scrollExtra >= tableRef.current.offsetHeight &&
        productList.length < resCatData?.productCount &&
        !productListLoading &&
        !isScrollTop &&
        !stopPagination
      ) {
        dispatch(updateProductListLoading(true));
        loadMoreItems(0, 0);
      }
    }
  }, [scrollPosition]);

  // console.log(scrollPosition);

  //   useEffect(() => {
  //     window?.addEventListener("scroll", onScroll);
  //     return () => window?.removeEventListener("scroll", onScroll);
  //   }, [onScroll]);

  const getNumber =
    deviceType === DeviceTypes.MOBILE
      ? newMobileBanner?.length
      : newDesktopBanner?.length;

  const closeSidebar = () => {
    if (pageInfo.isRTL) setSideBarHeight(-745);
    else setSideBarHeight(745);
  };

  return (
    <>
      <ListingWrapperContainer desktop={deviceType === DeviceTypes.DESKTOP}>
        <CollapsibleSidebar
          height={100}
          overLay={!sideBarHeight}
          title={"Similar Products"}
          id={"Similar_Products"}
          // width={0}
          xPosition={sideBarHeight}
          isRTL={pageInfo.isRTL}
          onClose={closeSidebar}
          mobileView={false}
          backdropClick={closeSidebar}
          hideArrowBackground={true}
          width="745px"
          backgroundColor="#fff"
          backDrop="rgba(0, 0, 0, 0.1)"
        >
          <SimilarFlex>
            {similarProductsData.map((product: any) => {
              return (
                <div key={product.id}>
                  <ProductContainerStructure
                    isTaxable
                    isRTL={pageInfo.isRTL}
                    mobileview={deviceType === DeviceTypes.DESKTOP}
                    product={product}
                    dataLocale={localeData}
                    width="320px"
                    currencyCode={getCurrency(pageInfo.country)}
                    removeDomainName={removeDomainName}
                  />
                </div>
              );
            })}
          </SimilarFlex>
        </CollapsibleSidebar>
        {/* {currentProductData.length > 0 && totalCount > 0 && cards === 3 && (
          <ShowCountContainer>
            {localeData.SHOWING} {currentProductData.length} of{" "}
            {currentCategoryData?.productCount} {localeData.RESULTS}
          </ShowCountContainer>
        )} */}
        <CardWrapperParent ref={tableRef}>
          <div>
            {Array.isArray(currentProductData) &&
              Array.from({
                length:
                  Math.ceil(currentProductData?.length / cards) + getNumber,
              }).map((data: any, index: number) => {
                const bannerObj =
                  deviceType === DeviceTypes.MOBILE
                    ? newMobileBanner.find((item: any) => {
                        return item.index === index * cards;
                      })
                    : newDesktopBanner.find((item: any) => {
                        return item.index === index;
                      });
                return (
                  <>
                    {bannerObj &&
                      bannerObj?.banner_url &&
                      Math.ceil(currentProductData?.length / cards) >=
                        index + 1 && (
                        <StaticBanner
                          isRTL={deviceType === DeviceTypes.MOBILE}
                          productListLoading={productListLoading}
                        >
                          <BannerStaticBanner>
                            <a
                              className="banner-image"
                              href={bannerObj?.banner_url_link}
                            >
                              <BannerImg
                                alt={localeData.BANNER}
                                data-src={bannerObj?.banner_url}
                                src={bannerObj?.banner_url}
                              />
                            </a>
                          </BannerStaticBanner>
                        </StaticBanner>
                      )}
                    {Cell({ index: index, style: {} })}
                  </>
                );
              })}
          </div>

          {!stopPagination &&
            currentProductData.length !== currentCategoryData?.productCount &&
            Array.from({ length: 1 }).map((data: any, index) => {
              return (
                <RowWrapper isRTL={false} key={index}>
                  {Array.from({ length: cards }).map((data: any, index) => {
                    return (
                      <PlpSkeleton
                        key={`plpskelton_${index}`}
                        width={200 / cards}
                        cards={cards}
                        height={cards !== 2 ? 350 : 150}
                      />
                    );
                  })}
                </RowWrapper>
              );
            })}
        </CardWrapperParent>

        {/* 
        <ListingWrapper desktop={deviceType === DeviceTypes.DESKTOP} ref={plpRef}>
          {
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={Math.ceil(
                (currentCategoryData?.productCount || 0) / cards
              )}
              loadMoreItems={!currentProductLoading ? loadMoreItems : () => {}}
              threshold={1}
              minimumBatchSize={3}
            >
              {({ onItemsRendered, ref }) => {
                const setRef = (cusRef: any) => {
                  listRef.current = cusRef;
                  ref(cusRef);
                };
                return (
                  <List
                    itemCount={Math.ceil(
                      (currentCategoryData?.productCount || 0) / cards
                    )}
                    itemSize={
                      getSize
                      // isExchangeFlow
                      //   ? 475
                      //   : deviceType === DeviceTypes.DESKTOP
                      //   ? 425
                      //   : widthTemp
                      //   ? widthTemp *
                      //       ((340 + (widthTemp - 340) / 2) / widthTemp) +
                      //     gap
                      //   : 385
                    }
                    ref={setRef}
                    onItemsRendered={onItemsRendered}
                    width="100%"
                    height={windowHeight}
                    outerRef={tableRef}
                    className="product-list-container"
                  >
                    {Cell}
                  </List>
                );
              }}
            </InfiniteLoader>
          }
        </ListingWrapper>
        */}
        {currentItemCount === 0 &&
          totalCount === 0 &&
          deviceType === DeviceTypes.MOBILE && (
            <NoResultOuter>
              <NoResFound>
                <NoResultHeader>
                  {localeData.OOPS_NO_RESULT_FOUND || "Oops No result found"}
                </NoResultHeader>
                <NoResultBody>
                  {localeData?.CLICK_ANY_LINK_POPULAR_CATEGORIES ||
                    "Click any of the links below to browse our popular categories"}
                </NoResultBody>
                <ButtonSection>
                  {pageErrorLinks?.map((linksInfo: any) => {
                    return (
                      <CategoryButton key={linksInfo.key}>
                        <ButtonContent
                          onClick={() => {
                            window.location.href = `${subdirectoryPath}${linksInfo.additionalUrl}`;
                          }}
                        >
                          {linksInfo.label}
                        </ButtonContent>
                      </CategoryButton>
                    );
                  })}
                </ButtonSection>
              </NoResFound>
            </NoResultOuter>
          )}

        {currentItemCount === 0 &&
          totalCount === 0 &&
          deviceType === DeviceTypes.DESKTOP && (
            <NoResultOuter>
              <NoResFound desktop={true}>
                <NoResultHeaderDes>{localeData?.NO_RESULT}</NoResultHeaderDes>
                {/* <BottomLine /> */}
              </NoResFound>
            </NoResultOuter>
          )}
      </ListingWrapperContainer>
    </>
  );
};

export default ListingV2;
