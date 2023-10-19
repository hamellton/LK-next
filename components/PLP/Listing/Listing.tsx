import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
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
  // BottomLine,
} from "./ListingStyles";
import { PlpSkeleton, ProductCardNew } from "@lk/ui-library";
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
import {
  LAST_PAGE_VISIT_NAME,
  QUERY_SUGGESTION_CLICK_FROM,
} from "@/constants/index";

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
}
interface CellProps {
  index: number;
  style: CSSProperties;
}

interface DefaultPage {
  pageCount: number;
  pageSize: number;
}

const Listing = ({
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
}: ListingProps) => {
  let pageName = "plp-page";
  const dispatch = useDispatch<AppDispatch>();
  const tableRef = useRef<HTMLElement>();
  const router = useRouter();
  const [currentProductData, setCurrentProductData] =
    useState<ProductTypeBasic[]>(productData);
  const [currentCategoryData, setCurrentCategoryData] =
    useState<CategoryData | null>(categoryData);
  const [currentProductLoading, setCurrentProductLoading] =
    useState<boolean>(false);
  const [isSearch, setIsSearch] = useState(false);
  const {
    productList,
    categoryData: resCatData,
    productListLoading,
    defaultParams,
    isDittoEnabled,
    filterSelected,
  } = useSelector((state: RootState) => state.categoryInfo);

  useEffect(() => {
    if (location.search.includes("search=true")) setIsSearch(true);

  }, []);

  useEffect(() => {
    setCurrentCategoryData(resCatData);
    setCurrentProductData(productList);
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

  const plpRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions({
    element: plpRef.current,
    conversionFn: () => {},
  });

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
    if (getCookie("isDittoID") && getCookie("isDittoID") !== "lenskart") {
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
      // Need to enable for Mobile as well
     
      viewItemListGA4(
        currentProductData,
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
      // let event: string = "view-item-list";
      // viewItemListGA4(currentProductData, userInfo.isLogin, event);
      // productImpressionGA(
      //   currentCategoryData,
      //   currentProductData,
      //   userInfo.isLogin
      // );
      // todoproduct listing
      // ProductListing();
  }}, []);

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
  const newMobileBanner = mobileBanner?.map((item: any) => {
    return {
      ...item,
      index:
        item.index === 0
          ? 0
          : item.index % 2 !== 0
          ? item.index + 1
          : item.index,
    };
  });
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
  const rowRef: any = useRef();
  const Cell = useCallback(
    ({ index, style }: CellProps) => {
      const bannerObj = newMobileBanner.find((item: any) => {
        return item.index === index;
      });
      //eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        setSize(
          index,
          deviceType === DeviceTypes.MOBILE &&
            bannerObj !== null &&
            bannerObj !== undefined &&
            Object.keys(bannerObj)
            ? 0
            : rowRef?.current?.getBoundingClientRect().height || 350
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [setSize, index, currentProductLoading, isGridView]);

      return (
        <>
          <div style={style}>
            {deviceType === DeviceTypes.MOBILE &&
            bannerObj &&
            bannerObj?.banner_url ? (
              <StaticBanner isRTL={deviceType === DeviceTypes.MOBILE}>
                <BannerStaticBanner>
                  <a className="banner-image" href={bannerObj?.banner_url_link}>
                    <BannerImg
                      alt={localeData.BANNER}
                      data-src={bannerObj?.banner_url}
                      src={bannerObj?.banner_url}
                    />
                  </a>
                </BannerStaticBanner>
              </StaticBanner>
            ) : !currentProductLoading ? (
              <RowWrapper isRTL={pageInfo.isRTL} ref={rowRef}>
                {/* <> */}
                {/* {
                  bannerObj && bannerObj?.banner_url ? (
                    <StaticBanner>
                      <BannerStaticBanner>
                        <a className="banner-image" href={bannerObj?.banner_url_link}>
                          <BannerImg alt={localeData.BANNER}
                            data-src={bannerObj?.banner_url}
                            src={
                              bannerObj?.banner_url
                            }
                          />
                        </a>
                      </BannerStaticBanner>
                    </StaticBanner>
                  ) : null}
                {bannerObj?.video_url ? (
                  <>
                    {bannerObj?.video_url_link ? (
                      <StaticBanner>
                        <BannerStaticBanner>
                          <a className="banner-video" href={bannerObj?.video_url_link}>
                            {showVideoWidget(localeData.BANNER, bannerObj)}
                          </a>
                        </BannerStaticBanner>
                      </StaticBanner>
                    ) : (
                      <StaticBanner>
                        <BannerStaticBanner>
                          {showVideoWidget(localeData.BANNER, bannerObj)}
                        </BannerStaticBanner>
                      </StaticBanner>
                    )}
                  </>
                ) : null
                } */}
                {currentProductData
                  .slice(index * cards, index * cards + cards)
                  .map((product, idx) => (
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
                      triggerCtaGA={(
                        cta_name: string,
                        cta_flow_and_page: string
                      ) => {
                        const eventName = "cta_click";
                        // const cta_name = "color-options";
                        // const cta_flow_and_page = "product-detail-page";
                        ctaClickEvent(
                          eventName,
                          cta_name,
                          cta_flow_and_page,
                          userInfo,
                          pageInfo
                        );
                      }}
                    />
                  ))}
                {/* </> */}
              </RowWrapper>
            ) : (
              <RowWrapper isRTL={false} ref={rowRef}>
                {Array.from({ length: cards }, (_, idx: number) => (
                  <PlpSkeleton
                    key={`plpskelton_${idx}_${index}`}
                    width={width / cards}
                    cards={cards}
                    height={cards !== 2 ? 350 : 150}
                  />
                ))}
              </RowWrapper>
            )}
          </div>
        </>
      );
    },
    [
      currentProductData,
      isDittoEnabled,
      cygnus,
      isGridView,
      wishlistPIDs,
      currentProductLoading,
      width,
      offerNameToText,
    ]
  );

  const isItemLoaded = (index: number) => {
    return !!currentProductData[cards * (index + 1) - 1];
  };

  const scrollTop = () => {
    if (tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
  };

  const handleScroll = useCallback(() => {
    const position = tableRef?.current?.scrollTop;
    setScrollPosition(Number(position) || 0);
    setInternalScrollPosition(parseInt((position || 0).toString()) || 0);
  }, [setScrollPosition, setInternalScrollPosition]);

  useEffect(() => {
    const element = tableRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    // console.log(startIndex, stopIndex, "startIndex: number, stopIndex: number");
    // console.log("in");

    if (currentProductData.length && !location.pathname.includes("/search")) {
      if (
        currentProductData.length <= 15 &&
        deviceType !== DeviceTypes.MOBILE
      ) {
        // scrollTop();
      }
      // console.log("in 2");
      if (
        currentProductData.length >=
        (defaultParams.pageCount + 1) * defaultParams.pageSize
      ) {
        // console.log("inin", defaultParams, productList.length);

        const pageSet: DefaultPage = {
          pageCount: defaultParams.pageCount + 1,
          pageSize: defaultParams.pageSize,
        };
        let queryParams = { ...router.query };
        let filter: DataType[] = [];
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
          })
        );
        if (!filter.length) {
          queryParams["pageCount"] = (defaultParams.pageCount + 1).toString();
        }

        router.replace({ query: { ...queryParams } }, undefined, {
          shallow: true,
        });
      }
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

      if (currentProductData.length >= (defaultParams.pageCount + 1) * 9) {
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
            subdirectoryPath,
            otherFilters: filters,
          })
        );
      }
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

  return (
    <ListingWrapperContainer desktop={deviceType === DeviceTypes.DESKTOP}>
      {currentProductData.length > 0 && totalCount > 0 && cards === 3 && (
        <ShowCountContainer>
          <span>{localeData.SHOWING} </span>
          <span>{currentProductData.length} </span>
          <span>of </span>
          <span>{currentCategoryData?.productCount} </span>
          <span>{localeData.RESULTS}</span>
          {/* {localeData.SHOWING} {currentProductData.length} of{" "}
          {currentCategoryData?.productCount} {localeData.RESULTS} */}
        </ShowCountContainer>
      )}

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

      {/* </> */}
      {currentItemCount == 0 &&
        totalCount == 0 &&
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

      {currentItemCount == 0 &&
        totalCount == 0 &&
        deviceType === DeviceTypes.DESKTOP && (
          <NoResultOuter>
            <NoResFound desktop={true}>
              <NoResultHeaderDes>{localeData?.NO_RESULT}</NoResultHeaderDes>
              {/* <BottomLine /> */}
            </NoResFound>
          </NoResultOuter>
        )}
    </ListingWrapperContainer>
  );
};

export default Listing;
