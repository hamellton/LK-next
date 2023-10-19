//> Default
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Router, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

//> Packages

//> Components
import Listing from "@/components/PLP/Listing/Listing";
import FilterSection from "@/components/PLP/FilterSection/FilterSection";
import TryOnSection from "@/components/PLP/TryOnSection/TryOnSection";
//> Types
import {
  ComponentSizeENUM,
  DeviceTypes,
  ThemeENUM,
  TypographyENUM,
} from "@/types/baseTypes";
import { CategoryParams } from "@/types/categoryTypes";
import { FilterItemType, FilterOption } from "@/types/filterTypes";
import { DataType } from "@/types/coreTypes";

//> Redux
import { AppDispatch, RootState } from "@/redux/store";
import {
  deleteSelectedfilter,
  fetchFilterData,
  fetchFilters,
  fillFilterSelected,
  resetFilterSelected,
  setDittoEnabled,
  setMapFilterKeyValue,
  updateDefaultParams,
  updateFilterData,
  updateMobileSizeFilter,
  updateSelectedFilter,
} from "@/redux/slices/categoryInfo";

//> Styles
import {
  BannerImg,
  BannerStaticBanner,
  BreadcrumbsWrapper,
  CategoryWrapper,
  FlexWrapper,
  ListingSection,
  ListingWrapper,
  MobileCategoryWrapper,
  StaticBanner,
  FrameDitto3DGridWrapper,
  FrameWrapper,
  New3DWrapper,
  FilterIconWrapper,
  FliterIconSpan,
  PLPVerticalLine,
  IconsWrapper,
  Wrapper,
  TotalCount,
  StaticHTMLWrapper,
  DescriptionWrapper,
  DescriptionContent,
  Extra,
  MobileHelperWrapper,
  StickyCount,
  FlexWrapperNoRes,
  NotFoundImg,
} from "./CategoryStyles";

import { CategoryType, DefaultPage } from "./Category.types";
import SelectedFilters from "@/components/PLP/SelectedFilterSection/SelectedFilters";

import { CMSWrapper } from "containers/ProductDetail/ProductDetail.styles";
import CMS from "containers/CMS/CMS.component";
import usePrevious from "hooks/usePrevious";
import { deleteCookie, getCookie, setCookie } from "@/helpers/defaultHeaders";
import { resetFrameSize } from "@/redux/slices/ditto";
import { reDirection } from "containers/Base/helper";
import BackTop from "./BackTop";

import {
  FilterSortContainer,
  Breadcrumbs,
  Button,
  ToggleButton,
  FilterComponent,
  Icons,
} from "@lk/ui-library";
import {
  AllSizeEvent,
  ctaClicktry_3d_on,
  FilterClickEvent,
  findMyFit,
  new3dButtonClick,
  searchPageLoad,
  SortByEvent,
  // SortByEvent,
  tryOnEvent,
  userProperties,
} from "helpers/userproperties";
import {
  bannerGA4,
  productImpressionGA,
  viewItemListGA4,
} from "helpers/gaFour";
import { PageInfoType } from "@/types/state/pageInfoType";
import { UserInfoType } from "@/types/state/userInfoType";
import ListingV2 from "@/components/PLP/Listing/ListingV2";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import {
  LAST_PAGE_VISIT_NAME,
  QUERY_SUGGESTION_CLICK_FROM,
} from "@/constants/index";
import {
  NoResultHeader,
  ShowCountContainer,
} from "@/components/PLP/Listing/ListingStyles";
import { updatePageLoaded } from "@/redux/slices/pageInfo";
import { categoryVirtualPageView } from "helpers/virtualPageView";
import { extractUtmParams } from "@lk/utils";
import { getBreadcrumbSchema, getCategorySchema } from "helpers/schemaHelper";
import Head from "next/head";

const pageSet: DefaultPage = {
  pageCount: 0,
  pageSize: 15,
};
function throttle(fn: Function) {
  let timer: ReturnType<typeof setTimeout>;
  let timerRunning = false;
  let firstRun = true;
  return () => {
    if (!timerRunning) {
      if (!firstRun) fn();
      else firstRun = false;
      timerRunning = true;
      timer = setTimeout(() => {
        timerRunning = false;
        clearTimeout(timer);
      }, 1000);
    }
  };
}

const Category = ({
  categoryData,
  productData,
  configData,
  localeData,
  exchangeFlow,
  pageSize,
  pageCount,
  search = false,
  windowHeight,
  userData,
}: CategoryType) => {
  const { isExchangeFlow, returnOrderId, returnItemId } = exchangeFlow;
  const dispatch = useDispatch<AppDispatch>();
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { cygnus } = useSelector((state: RootState) => state.dittoInfo);
  const productListData =
    useSelector((state: RootState) => state.categoryInfo.productList) || [];
  const productListLoading = useSelector(
    (state: RootState) => state.categoryInfo.productListLoading
  );

  // console.log(categoryData, productData, "productData......");

  const router = useRouter();

  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [internalScrollPos, setInternalScrollPos] = useState<number>(0);
  const [highestScrollPos, setHighestScrollPos] = useState<number>(0);
  const [isScrollTop, setIsScrollTop] = useState<boolean>(true);
  const [switchToTop, setSwitchToTop] = useState<boolean>(false);
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // const [hideBanner, setHideBanner] = useState(false);
  // const [hideBannerHeight, setHideBannerHeight] = useState(0);

  const [fireViewListGA, setFireViewListGA] = useState(false);
  const [toggleCount, setToggleCount] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);

    // > making toggle section sticky on scroll
    // const header = document.getElementById("header");
    // const height = header?.offsetHeight || 200;
    // const tryOnSection = document.getElementById("try-on-section");
    // if (position) {
    //   if (position >= height) {
    //     if (tryOnSection) {
    //       tryOnSection.style.position = "fixed";
    //       tryOnSection.style.top = `${height}px` || "150px";
    //       tryOnSection.style.zIndex = "101";
    //     }
    //   } else {
    //     if (tryOnSection) {
    //       tryOnSection.style.position = "unset";
    //       tryOnSection.style.top = "unset";
    //       tryOnSection.style.zIndex = "unset";
    //     }
    //   }
    // }
  };
  const prevScrollPosVal = usePrevious(internalScrollPos);

  // useEffect(() => {
  //   if (deviceType === DeviceTypes.MOBILE) {
  //     userProperties(
  //       userInfo,
  //       productData.length == 0 && categoryData.productCount == 0
  //         ? "search-no-result-found"
  //         : "search-suggestion-page",
  //       pageInfo,
  //       localeData
  //     );
  //   }
  // }, [productData.length, categoryData.productCount]);

  useEffect(() => {
    if (scrollPosition > highestScrollPos) {
      setHighestScrollPos(scrollPosition);
    }
    const pageName = "plp-page";
    if (productData.length > 0 && location.search.includes("search=true")) {
      const searchType =
        localStorage.getItem(QUERY_SUGGESTION_CLICK_FROM) ?? "";
      searchPageLoad(
        userData,
        searchType,
        sessionStorageHelper.getItem("query"),
        "successful"
      );
      localStorage.setItem(LAST_PAGE_VISIT_NAME, pageName);
    }
  }, []);

  useEffect(() => {
    if (internalScrollPos > highestScrollPos) {
      setHighestScrollPos(internalScrollPos);
      setIsScrollTop(false);
    } else {
      setHighestScrollPos(scrollPosition);
      setIsScrollTop(true);
    }
  }, [scrollPosition]);

  const moveWindowUp = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   setHideBannerHeight(document?.getElementById("wrapper")?.offsetHeight || 0);
  // }, []);

  // useEffect(() => {
  //   if (prevScrollPosVal === undefined || prevScrollPosVal < 100) {
  //     setHideBanner(false);
  //   } else {
  //     setHideBanner(true);
  //   }
  // }, [internalScrollPos, prevScrollPosVal]);

  const throtteledGoToTop = useMemo(
    () => throttle(moveWindowUp),
    [moveWindowUp]
  );
  useEffect(() => {
    throtteledGoToTop();
  }, []);

  useEffect(() => {
    if (prevScrollPosVal && internalScrollPos) {
      if (prevScrollPosVal > internalScrollPos) {
        // throtteledGoToTop();
      }
    }
  }, [prevScrollPosVal, internalScrollPos, throtteledGoToTop]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const gotoTop = () => {
    setSwitchToTop(true);
    window.scrollTo(0, 0);
  };

  //> Redux Selectors
  const { id, deviceType } = useSelector((state: RootState) => state.pageInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const { sessionId, userDetails } = useSelector(
    (state: RootState) => state.userInfo
  );

  const {
    filters,
    filtersLoading,
    filterSelected,
    filterMapping,
    isDittoEnabled,
    categoryData: currentCategoryData,
  } = useSelector((state: RootState) => state.categoryInfo);

  //> Local State Variables
  const enableAlgoliaSearch =
    configData?.ENABLE_ALGOLIA_CONFIG && deviceType == DeviceTypes.MOBILE;
  const [initialLoad, setinitialLoad] = useState<boolean>(true);
  const [dropdown, setDropdown] = useState<string>("best_sellers");

  const [params, setParams] = useState<CategoryParams[]>(
    returnOrderId && returnItemId && isExchangeFlow
      ? [
          { key: "dir", value: ["desc"] },
          { key: "gan_data", value: ["true"] },
          {
            key: "orderId",
            value: [typeof returnOrderId === "string" ? returnOrderId : ""],
          },
          {
            key: "itemId",
            value: [typeof returnItemId === "string" ? returnItemId : ""],
          },
        ]
      : [
          { key: "dir", value: ["desc"] },
          { key: "gan_data", value: ["true"] },
        ]
  );
  const [activeFilters, setActiveFilters] = useState({});
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (id && pageInfo.pageLoaded && !filters) {
      const reqObj: {
        filterId: number | string;
        sessionId: string;
        search: boolean;
        selectedFilter: DataType;
        isAlgoliaSearch: boolean;
        similarProductId: boolean;
      } = {
        filterId: id,
        sessionId: sessionId,
        search: search,
        selectedFilter: { ...filterSelected },
        isAlgoliaSearch: enableAlgoliaSearch,
        similarProductId: window.location.search.includes("similarProductId"),
      };

      dispatch(fetchFilterData(reqObj));
    }
  }, [id, sessionId, pageInfo.pageLoaded]);

  const [active, setactive] = useState(false);

  useEffect(() => {
    if (filters && !active) {
      let queryParams = { ...router.query };
      // queryParams["pageCount"] = pageSet.pageCount.toString();
      // console.log(queryParams, "queryParams");

      let filterActive: any[] = [];
      let filterSet: DataType = {};
      let filterMapping: DataType = {};

      Object.keys(queryParams).forEach((key: string) => {
        if (
          key !== "redisId" &&
          key !== "pageCount" &&
          key !== "pageSize" &&
          key !== "q" &&
          key !== "sort" &&
          key !== "gan_data" &&
          key !== "dir" &&
          key !== "search" &&
          key !== "similarProductId"
        ) {
          let params =
            queryParams?.[key] && typeof queryParams[key] === "string"
              ? (queryParams[key] as string)?.split(",")
              : queryParams?.[key] && Array.isArray(queryParams[key])
              ? ((queryParams[key]?.toString() || "") as string)?.split(",")
              : [];
          dispatch(
            updateSelectedFilter({
              id: key,
              value: [...params],
            })
          );

          filterActive = [...filterActive, { key: key, value: [...params] }];
          filterSet = { ...filterSet, [key]: [...params] };
        }
      });

      filters.filters.map((_filter: any) => {
        filterMapping = {
          ...filterMapping,
          [_filter.id]: _filter.name.toLowerCase(),
        };
        if (Object.keys(filterSet).includes(_filter.id)) {
          setActiveFilters((prevBody: any) => {
            const r = _filter.options.filter((value: any) =>
              filterSet[_filter.id].includes(value.id)
            );
            return { ...prevBody, [_filter.id]: r };
          });
        }
      });

      if (queryParams["sort"]) {
        setParams([...params, { key: "sort", value: queryParams["sort"] }]);
        setParams((prevParams: any) => {
          const temp = [
            ...prevParams.filter((param: any) => param.key !== "sort"),
            { key: "sort", value: [queryParams["sort"]?.toString()] },
          ];
          return [...temp];
        });
        setDropdown(queryParams["sort"].toString());
      }

      // if (queryParams["pageCount"]) {
      //   delete queryParams["pageCount"];
      // }

      router.replace({ query: { ...queryParams } }, undefined, {
        shallow: true,
      });
      // const _params = params.map((val) => ({ key: val.key, value: val.value }));
      const tempPageSet = { ...pageSet };
      tempPageSet["pageCount"] = queryParams.pageCount
        ? Number(queryParams.pageCount)
        : 0;
      dispatch(updateDefaultParams(tempPageSet));
      if (filterActive.length && !productData.length) {
        dispatch(
          fetchFilters({
            id: id,
            sessionId: sessionId,
            defaultFilters: pageSet,
            otherParams: [...filterActive, ...params],
            search,
            isAlgoliaSearch: enableAlgoliaSearch,
            similarProductId:
              window.location.search.includes("similarProductId"),
          })
        );
      } else if (!productData.length) {
        dispatch(
          fetchFilters({
            id: id,
            sessionId: sessionId,
            defaultFilters: pageSet,
            otherParams: [],
            search,
            isAlgoliaSearch: enableAlgoliaSearch,
            similarProductId:
              window.location.search.includes("similarProductId"),
          })
        );
      }

      // if (filterSet?.["sort"]) {
      //   setDropdown(() => filterSet["sort"]);
      // }
      dispatch(fillFilterSelected(filterSet));
      dispatch(setMapFilterKeyValue(filterMapping));
    }
    if (filters && !active) {
      setactive(true);
    }
  }, [filters]);

  // useEffect(() => {
  //   if (Object.keys(filterSelected).length) {
  //     let queryParams = { ...router.query };
  //     Object.keys(queryParams).forEach((key) => {
  //       if (key !== "redisId" && key !== "pageCount" && key !== "pageSize") {
  //         delete queryParams[key];
  //       }
  //     });
  //     queryParams["pageCount"] = pageSet.pageCount.toString();

  //     const filter: DataType[] = [];
  //     Object.keys(filterSelected).forEach((val) => {
  //       if (filterSelected[val].length) {
  //         filter.push({ key: val, value: [...filterSelected[val]] });
  //         queryParams[val] = filterSelected[val].toString();
  //       }
  //     });

  //     router.replace({ query: { ...queryParams } }, undefined, {
  //       shallow: true,
  //     });
  //     // const _params = params.map((val) => ({ id: val.key, value: val.value }));

  //     dispatch(updateDefaultParams(pageSet));

  //     dispatch(
  //       fetchFilters({
  //         id: id,
  //         sessionId: sessionId,
  //         defaultFilters: pageSet,
  //         otherParams: [...filter, ...params],
  //         search,
  //       })
  //     );
  //   } else if (filterDeleted) {
  //     let queryParams = { ...router.query };
  //     Object.keys(queryParams).forEach((key) => {
  //       if (key !== "redisId" && key !== "pageCount" && key !== "pageSize") {
  //         delete queryParams[key];
  //       }
  //     });
  //     queryParams["pageCount"] = pageSet.pageCount.toString();
  //     router.replace({ query: { ...queryParams } }, undefined, {
  //       shallow: true,
  //     });

  //     dispatch(updateDefaultParams(pageSet));
  //     dispatch(
  //       applySorting({
  //         id,
  //         sessionId,
  //         defaultParams: pageSet,
  //         params,
  //       })
  //     );
  //   }
  // }, [filterSelected, filterDeleted]);

  useEffect(() => {
    if (deviceType === DeviceTypes.MOBILE) {
      let event: string = "view-item-list";
      // viewItemListGA4(
      //   productData,
      //   userInfo.isLogin,
      //   event,
      //   categoryData,
      //   pageInfo
      // );
      // userProperties(
      //   userInfo,
      //   "plp-page",
      //   pageInfo,
      //   configData,
      //   "product-listing-page"
      // );
      // let event: string = "view-item-list";
      // viewItemListGA4(currentProductData, userInfo.isLogin, event);
      // productImpressionGA(categoryData, productData, userInfo.isLogin);
      // todoproduct listing
      // ProductListing();
    }
    const headerEl = document.getElementById("header");
    const headerHeight = headerEl?.offsetHeight;
    setHeaderHeight(headerHeight || 154);
    return () => {
      dispatch(updatePageLoaded(false));
    };
  }, []);

  useEffect(() => {
    if (fireViewListGA && deviceType === DeviceTypes.MOBILE) {
      let event: string = "view-item-list";
      const searchType =
        localStorage.getItem(QUERY_SUGGESTION_CLICK_FROM) ?? "";
      const query: any = sessionStorageHelper.getItem("query");
      if (location.search.includes("search=true"))
        viewItemListGA4(
          productData,
          userInfo.isLogin,
          event,
          categoryData,
          pageInfo,
          query,
          "search",
          searchType
        );
      else
        viewItemListGA4(
          productData,
          userInfo.isLogin,
          event,
          categoryData,
          pageInfo
        );
      userProperties(
        userInfo,
        "plp-page",
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

  // * recently viewed categories
  useEffect(() => {
    let recentlyViewedCategories = localStorage.getItem(
      `recentlyViewedCategories_${pageInfo?.country}`
    )
      ? JSON.parse(
          localStorage.getItem(
            `recentlyViewedCategories_${pageInfo?.country}`
          ) || ""
        )
      : [];

    if (typeof pageInfo?.id === "number") {
      if (!recentlyViewedCategories.includes(pageInfo?.id)) {
        recentlyViewedCategories.push(pageInfo?.id);
      }
    }
    localStorage.setItem(
      `recentlyViewedCategories_${pageInfo?.country}`,
      JSON.stringify(recentlyViewedCategories)
    );
  }, [pageInfo?.id]);

  useEffect(() => {
    if (pageInfo.id && !userInfo.userLoading) {
      setFireViewListGA(true);
    }
  }, [pageInfo, userInfo]);

  const handleFilters = (item: DataType, selectedOption: DataType) => {
    if (
      filterSelected[item.id] &&
      filterSelected[item.id].includes(item.selectedOption[0])
    ) {
      dispatch(
        deleteSelectedfilter({
          id: item.id,
          value: item.selectedOption,
        })
      );
      setActiveFilters((prevBody: any) => {
        return {
          ...prevBody,
          [item.id]: prevBody[item.id].filter(
            (filters: any) => filters.id != selectedOption.id
          ),
        };
      });
    } else {
      selectedOption = { ...selectedOption, name: item.name };
      dispatch(
        updateSelectedFilter({
          id: item.id,
          value: item.selectedOption,
        })
      );
      setActiveFilters((prevBody: any) => {
        return {
          ...prevBody,
          [item.id]: prevBody?.[item.id]
            ? [...prevBody[item.id], selectedOption]
            : [selectedOption],
        };
      });
    }
  };

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setinitialLoad(false);
    gotoTop();
    dispatch(updateDefaultParams({ pageCount: 0, pageSize: 15 }));
    let filters: DataType[] = [];
    let queryParams = { ...router.query };

    if (Object.keys(filterSelected).length) {
      Object.keys(filterSelected).forEach((element) => {
        filters.push({ key: element, value: filterSelected[element] });
      });
    }
    setParams((prevParams) => {
      let temp;
      if (deviceType === DeviceTypes.MOBILE) {
        temp = [
          ...prevParams.filter((param) => param.key !== "sort"),
          { key: "sort", value: [sortBy] },
        ];
      } else {
        temp = [
          ...prevParams.filter((param) => param.key !== "sort"),
          { key: "sort", value: [event.target.value] },
        ];
      }
      // console.log(queryParams);
      if (queryParams["pageCount"]) {
        delete queryParams["pageCount"];
      }
      dispatch(
        fetchFilters({
          id: id,
          sessionId: sessionId,
          defaultFilters: pageSet,
          otherParams: [...filters, ...temp],
          search,
          isAlgoliaSearch: enableAlgoliaSearch,
          similarProductId: window.location.search.includes("similarProductId"),
        })
      );
      return temp;
    });

    // dispatch(
    //   fetchFilters({
    //     id: id,
    //     sessionId: sessionId,
    //     defaultFilters: pageSet,
    //     otherParams: [...params, { key: "sort", value: [event.target.value] }],
    //     search,
    //   })
    // );
    router.replace(
      {
        query: {
          ...queryParams,
          sort: deviceType === DeviceTypes.MOBILE ? sortBy : event.target.value,
          [params[0].key]: [params[0].value[0]],
          [params[1].key]: [params[1].value[0]],
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  useEffect(() => {
    if (active) {
      let filters: DataType[] = [];
      let queryParams = { ...router.query };

      if (dropdown !== "best_sellers" && deviceType === DeviceTypes.DESKTOP) {
        filters.push(...params);
      }
      if (queryParams["sort"] && deviceType === DeviceTypes.MOBILE) {
        filters.push(...params);
      }
      if (Object.keys(filterSelected).length) {
        Object.keys(filterSelected).forEach((element) => {
          filters.push({ key: element, value: filterSelected[element] });
        });
      }
      Object.keys(queryParams).forEach((key) => {
        if (
          key !== "redisId" &&
          key !== "q" &&
          key !== "search" &&
          key !== "similarProductId"
        ) {
          delete queryParams[key];
        }
      });
      // queryParams["pageCount"] = "0";
      filters.forEach((element) => {
        queryParams = { ...queryParams, [element.key]: element.value };
      });
      if (deviceType === DeviceTypes.DESKTOP) {
        router.replace({ query: { ...queryParams } }, undefined, {
          shallow: true,
        });
        // router.push(window.location.pathname +
        //   "#" +
        //   `frametype_id=${queryParams["frametype_id"]}`)

        dispatch(updateDefaultParams({ pageCount: 0, pageSize: 15 }));
        gotoTop();
        dispatch(
          fetchFilterData({
            filterId: id || "",
            sessionId: sessionId,
            search: search,
            selectedFilter: { ...filterSelected },
            isAlgoliaSearch: enableAlgoliaSearch,
            similarProductId:
              window.location.search.includes("similarProductId"),
          })
        );
        dispatch(
          fetchFilters({
            id: id,
            sessionId: sessionId,
            defaultFilters: pageSet,
            otherParams: [...filters],
            search,
            isAlgoliaSearch: enableAlgoliaSearch,
            similarProductId:
              window.location.search.includes("similarProductId"),
          })
        );
      }
      if (
        deviceType === DeviceTypes.MOBILE //&&
        // Object.keys(filterSelected).length > 0
      ) {
        dispatch(
          fetchFilterData({
            filterId: id || "",
            sessionId: sessionId,
            search: search,
            selectedFilter: { ...filterSelected },
            isAlgoliaSearch: enableAlgoliaSearch,
            similarProductId:
              window.location.search.includes("similarProductId"),
          })
        );
        if (tempData.filterName) {
          dispatch(
            fetchFilters({
              id: id,
              sessionId: sessionId,
              defaultFilters: pageSet,
              otherParams: [...filters],
              search,
              isAlgoliaSearch: enableAlgoliaSearch,
              similarProductId:
                window.location.search.includes("similarProductId"),
            })
          );
        }
        // if (queryParams["pageCount"]) {
        //   delete queryParams["pageCount"];
        // }
        router.replace({ query: { ...queryParams } }, undefined, {
          shallow: true,
        });
        // alert("1");
        // console.log(filters, "active");
      }
      // if (queryParams["pageCount"]) {
      //   delete queryParams["pageCount"];
      // }
      // router.replace({ query: { ...queryParams } }, undefined, {
      //   shallow: true,
      // });
    }
    if (deviceType === DeviceTypes.MOBILE) {
      setSelectedSize(filterSelected["frame_size_id"] || []);
      tempData["filterData"] = filterSelected["frame_size_id"] || [];
      if (filterSelected?.["frame_size_id"]?.length) {
        tempData["filterName"] = filterIndex?.options
          .filter((i: any) => i.id == tempData["filterData"][0])
          .map((item: any) => item.title)[0];
      }
      setTempData(tempData);
    }
  }, [filterSelected]);

  const resetFilter = () => {
    dispatch(updateDefaultParams({ pageCount: 0, pageSize: 15 }));

    let queryParams = { ...router.query };

    setDropdown("best_sellers");

    const pageSet: DefaultPage = {
      pageCount: 0,
      pageSize: 15,
    };
    dispatch(
      fetchFilters({
        id: id,
        sessionId: sessionId,
        defaultFilters: pageSet,
        otherParams: [],
        search: search,
        isAlgoliaSearch: enableAlgoliaSearch,
        similarProductId: window.location.search.includes("similarProductId"),
      })
    );
    dispatch(updateDefaultParams(pageSet));
    setActiveFilters({});
    Object.keys(queryParams).forEach((key) => {
      if (
        key !== "redisId" &&
        key !== "pageSize" &&
        key !== "q" &&
        key !== "sort" &&
        key !== "search" &&
        key !== "similarProductId"
      ) {
        delete queryParams[key];
      }
    });
    // queryParams["pageCount"] = "0";

    router.replace({ query: { ...queryParams } }, undefined, {
      shallow: true,
    });
    dispatch(resetFilterSelected());

    setinitialLoad(false);
    gotoTop();
  };

  const resetSort = () => {
    let filters: DataType[] = [];
    let queryParams = { ...router.query };
    if (Object.keys(filterSelected).length) {
      Object.keys(filterSelected).forEach((element) => {
        filters.push({ key: element, value: filterSelected[element] });
      });
    }
    // queryParams["pageCount"] = "0";
    filters.forEach((element) => {
      queryParams = { ...queryParams, [element.key]: element.value };
    });
    dispatch(updateDefaultParams({ pageCount: 0, pageSize: 15 }));
    const pageSet: DefaultPage = {
      pageCount: 0,
      pageSize: 15,
    };
    dispatch(
      fetchFilters({
        id: id,
        sessionId: sessionId,
        defaultFilters: pageSet,
        otherParams: [...filters],
        search: search,
        isAlgoliaSearch: enableAlgoliaSearch,
        similarProductId: window.location.search.includes("similarProductId"),
      })
    );
    dispatch(updateDefaultParams(pageSet));
    Object.keys(queryParams).forEach((key) => {
      if (key === "sort" || key === "pageCount") {
        delete queryParams[key];
      }
    });
    // Object.keys(queryParams).forEach((key) => {
    //   if (key !== "redisId" && key !== "q" && key !== "sort") {
    //     delete queryParams[key];
    //   }
    // });

    router.replace({ query: { ...queryParams } }, undefined, {
      shallow: true,
    });
    setinitialLoad(false);
    gotoTop();
  };

  // if (deviceType === "mobilesite") {
  //   return <div>mobile dmbf</div>;
  // }

  const [intialOptions, setOptions] = useState(filters?.filters[0]?.options);

  const sortData: any = [
    { key: "Best Sellers", value: "best_sellers" },
    { key: "Price: Low to High", value: "low_price" },
    { key: "Price: High to Low", value: "high_price" },
    { key: "New", value: "created" },
    { key: "Biggest Saving", value: "saving" },
    { key: "Most viewed", value: "popular" },
  ];
  const [defaultSelection, setDefaultSelectedOption] = useState(
    filters?.filters[0]?.id
  );

  // useEffect(() => {
  //   if (filters?.filters[0]?.options) {
  //     setOptions(filters?.filters[0]?.options);
  //   }
  // }, [filters?.filters]);

  // useEffect(() => {
  //   if (filters?.filters[0]?.options) {
  //     const opt = filters?.filters?.filter(
  //       (value) => value.id === defaultSelection
  //     );
  //     setOptions(opt[0]?.options);
  //   }
  // }, [filters?.filters[0]?.options]);

  useEffect(() => {
    if (filters?.filters[0]?.options) {
      if (defaultSelection && defaultSelection !== filters.filters[0].id) {
        const opt = filters.filters.filter(
          (value) => value.id === defaultSelection
        );
        setOptions(opt[0]?.options);
      } else {
        setOptions(filters.filters[0].options);
      }
    }
  }, [defaultSelection, filters?.filters]);

  const showClickFilter = (id: string) => {
    const filterIndex: any = filters?.filters.find((i) => i.id == id);
    setOptions(filterIndex.options);
    setDefaultSelectedOption(id);
  };

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheetData, setBottomSheetData] = useState({});
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [msiteFilterTypeID, setMsiteFilterTypeID] = useState<
    number | undefined
  >(undefined);
  const [sortBy, setSortBy] = useState("");
  const [filterPageOpen, setFilterPageOpen] = useState(false);
  const closeBottomSheet = () => {
    setShowBottomSheet(false);
    setMsiteFilterTypeID(undefined);
  };

  const onClickFindMyFit = () => {
    dispatch(resetFrameSize());
    localStorage.setItem("findMyFit", router.asPath);
    Router.push("/frame-size");
    findMyFit(userInfo, pageInfo);
    // setfetchCMS("cms-page-2");
  };
  const onClickNew3D = () => {
    // localStorage.setItem("dittoCompare", window.location.pathname);
    // Router.push("/compare-looks");
    new3dButtonClick(userInfo, pageInfo);
    reDirection(pageInfo?.subdirectoryPath);
  };

  useEffect(() => {
    // if (getCookie("isDitto") === true) {
    dispatch(setDittoEnabled(getCookie("isDitto") === true ? true : false));
    //  ? dispatch(setDittoEnabled(true)) : dispatch(setDittoEnabled(false));
    // }
  }, []);

  // useEffect(() => {
  //   const pageName = "find-frame-size-from-scan-or-past-orders-page";
  //   if (!userInfo.userLoading && isDittoEnabled) {
  //     userProperties(userInfo, pageName, pageInfo, configData);
  //   }
  // }, [isDittoEnabled, userInfo.userLoading]);

  const [mounted, setMounted] = useState(false);
  const [toggleValue, setToggleValue] = useState<boolean>(false);
  const onRightSide = () => {
    if (
      !getCookie("dittoGuestId") &&
      !userInfo.userDetails?.cygnus?.cygnusId &&
      !userData?.cygnus?.cygnusId
    ) {
      reDirection(pageInfo?.subdirectoryPath);
    }
  };

  useEffect(() => {
    if (mounted) {
      if (toggleValue) {
        if (
          !userData?.isLoggedIn ||
          (userInfo.userDetails && !userInfo?.userDetails?.cygnus?.cygnusId)
        ) {
          onRightSide();
        }
        dispatch(setDittoEnabled(true));
      } else {
        dispatch(setDittoEnabled(false));
        setCookie("isDitto", false);
      }
    }
  }, [toggleValue, dispatch, userInfo.userDetails?.cygnus?.cygnusId]);

  useEffect(() => {
    if (mounted) {
      if (getCookie("isDitto") === true) {
        setToggleValue(true);
      } else {
        setToggleValue(false);
      }
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    if (!getCookie("dittoGuestId") && !getCookie("cygnus")) {
      setCookie("isDitto", false);
      dispatch(setDittoEnabled(false));
    }
    if (getCookie("cygnus")) {
      deleteCookie("cygnus");
    }
  }, []);

  useEffect(() => {
    if (cygnus.cygnusId && mounted) {
      setToggleValue(true);
    }
  }, [cygnus?.cygnusId, mounted]);

  useEffect(() => {
    if (mounted) {
      getToggleValue(getCookie("isDitto") === true ? true : false);
    }
  }, [mounted]);

  const getToggleValue = (val: boolean) => {
    if (mounted && getCookie("dittoGuestId")) {
      setCookie("isDitto", val);
      setToggleValue(val);
    }
    if (mounted && !getCookie("dittoGuestId") && val) {
      reDirection(pageInfo?.subdirectoryPath);
    }
  };

  useEffect(() => {
    if (deviceType === DeviceTypes.MOBILE) {
      // const data = {
      //   event: "cta_click",
      //   ctaname: "try_3d_on",
      //   ctasection: "try_3d_on_listing",
      // };

      setToggleCount((prev) => prev + 1);
      if (toggleCount !== 0) {
        setTimeout(() => {
          // ctaClicktry_3d_on(data);
          tryOnEvent(toggleValue, userInfo, pageInfo);
        }, 0);
      }
    }
  }, [toggleValue]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!productListLoading) {
      setLoaded(true);
    }
  }, [productListLoading]);

  useEffect(() => {
    if (loaded) {
      // userProperties(userInfo, "page_load", pageInfo, configData, "page_load");
      if (search) {
        if (productListData.length === 0) {
          userProperties(
            userInfo,
            "search-no-result-found",
            pageInfo,
            configData,
            "search-no-result-found"
          );
        } else {
          userProperties(
            userInfo,
            "search results page",
            pageInfo,
            configData,
            "search results page"
          );
        }
      }
    }
  }, [loaded]);

  const showGridListView = () => {
    setIsGridView(!isGridView);
  };
  const [fetchCMS, setfetchCMS] = useState("");
  const filterIndex: any = filters?.filters.find(
    (i) => i.id == "frame_size_id"
  );
  const onSizeTitleClick = (id: any) => {
    if (selectedSize.includes(id)) {
      const temp = selectedSize.filter((i) => i != id);
      tempData["sortDataId"] = temp;
      setSelectedSize(temp);
    } else {
      tempData["sortDataId"] = [...selectedSize, id];
      setSelectedSize((selectedSize: string[] | []) => [...selectedSize, id]);
    }
    tempData["filterName"] = filterIndex?.options
      .filter((i: any) => i.id == tempData["sortDataId"][0])
      .map((item: any) => item.title)[0];
  };

  const onSortClick = (value: any) => {
    setSortBy(value);
  };
  let temp: any = {};
  let x: any = { sortData: "", filterData: [], filterName: "" };
  const [tempData, setTempData] = useState(x);
  const openBottomSheet = (id: any) => {
    setMsiteFilterTypeID(id);
    if (id == 0) {
      temp = {
        title: "Frame Size",
        data: filterIndex?.options,
        type: "checkbox",
      };
      setBottomSheetData(temp);
      setShowBottomSheet((prev) => !prev);
    } else if (id == 1) {
      temp = {
        title: "Sort By",
        data: sortData,
        type: "radio",
      };
      setBottomSheetData(temp);
      setShowBottomSheet((prev) => !prev);
    } else {
      setFilterPageOpen(true);
    }
  };
  const onClearClick = () => {
    if (msiteFilterTypeID == 0) {
      tempData["filterData"] = [];
      tempData["filterName"] = "";
      // resetFilter();
      dispatch(
        updateMobileSizeFilter({
          id: "frame_size_id",
          value: [],
        })
      );
      setTempData({ ...tempData, filterName: "", filterData: [] });
      setSelectedSize([]);
      dispatch(updateDefaultParams({ pageCount: 0, pageSize: 15 }));
      let queryParams = { ...router.query };
      if (queryParams["frame_size_id"] || queryParams["pageCount"]) {
        delete queryParams?.["frame_size_id"];
        delete queryParams?.["pageCount"];
      }
      router.replace({ query: { ...queryParams } }, undefined, {
        shallow: true,
      });
    } else if (msiteFilterTypeID == 1) {
      tempData["sortData"] = "";
      tempData["sortDataId"] = [];
      resetSort();
      setSortBy("");
    }
    gotoTop();
    setShowBottomSheet((prev) => !prev);
  };

  const onApplyFilterMiste = (filterSelectedTemp: any) => {
    let filters: DataType[] = [];
    let queryParams = { ...router.query };

    FilterClickEvent({
      event: "filterApplied",
      filterCount: 1,
      // [item.id]: selectedOption?.title,
    });

    if (queryParams["sort"]) {
      filters.push(...params);
    }

    if (Object.keys(filterSelectedTemp).length) {
      Object.keys(filterSelectedTemp).forEach((element) => {
        filters.push({ key: element, value: filterSelectedTemp[element] });
      });
    }
    Object.keys(queryParams).forEach((key) => {
      if (
        key !== "redisId" &&
        key !== "q" &&
        key !== "search" &&
        key !== "similarProductId"
      ) {
        delete queryParams[key];
      }
    });
    // queryParams["pageCount"] = "0";
    filters.forEach((element) => {
      queryParams = { ...queryParams, [element.key]: element.value };
    });
    router.replace({ query: { ...queryParams } }, undefined, {
      shallow: true,
    });
    dispatch(updateDefaultParams({ pageCount: 0, pageSize: 15 }));
    gotoTop();
    dispatch(
      fetchFilters({
        id: id,
        sessionId: sessionId,
        defaultFilters: pageSet,
        otherParams: [...filters],
        search,
        isAlgoliaSearch: enableAlgoliaSearch,
        similarProductId: window.location.search.includes("similarProductId"),
      })
    );
    setFilterPageOpen(false);
  };

  const onFilterClick = (item: DataType, selectedOption: DataType) => {
    if (
      filterSelected[item.id] &&
      filterSelected[item.id].includes(item.selectedOption[0])
    ) {
      dispatch(
        deleteSelectedfilter({
          id: item.id,
          value: item.selectedOption,
        })
      );
    } else {
      selectedOption = { ...selectedOption, name: item.name };
      dispatch(
        updateSelectedFilter({
          id: item.id,
          value: item.selectedOption,
        })
      );
    }
  };

  const onFilterClickMsite = (filterObj: any) => {
    if (filterObj && Object.keys(filterObj).length) {
      let filterSelectedObj = {};
      Object.keys(filterObj).map((data) => {
        if (filterObj[data].selectedOption?.length > 0) {
          filterSelectedObj = {
            ...filterSelectedObj,
            [data]: filterObj[data]?.selectedOption,
          };
        }
      });

      dispatch(fillFilterSelected(filterSelectedObj));
      onApplyFilterMiste(filterSelectedObj);
    } else {
      resetFilter();
      setFilterPageOpen(false);
    }
  };

  const fetFilterDataMsite = (filterSelected: any) => {
    dispatch(
      fetchFilterData({
        filterId: id || "",
        sessionId: sessionId,
        search: search,
        selectedFilter: { ...filterSelected },
        isAlgoliaSearch: enableAlgoliaSearch,
        similarProductId: window.location.search.includes("similarProductId"),
      })
    );
  };

  const onApplyClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
    AllSizeEvent({
      event: "filterApplied",
      frame_size_id:
        selectedSize.length > 0
          ? selectedSize.length > 1
            ? selectedSize.join(",")
            : selectedSize[0]
          : "",
    });
    if (msiteFilterTypeID === 0) {
      tempData["filterData"] = selectedSize;
      setTempData(tempData);

      dispatch(
        updateMobileSizeFilter({
          id: "frame_size_id",
          value: [...selectedSize],
        })
      );

      closeBottomSheet();
    }
    if (msiteFilterTypeID === 1) {
      if ("sortData" in tempData) {
        tempData["sortData"] = sortBy;
      } else {
        tempData["sortData"] = sortBy;
      }
      setTempData(tempData);
      handleSort(event);
      setShowBottomSheet((prev) => !prev);
      closeBottomSheet();
    }
    dispatch(updateDefaultParams({ pageCount: 0, pageSize: 15 }));
    gotoTop();
  };
  const showFilterComponent = () => {
    setFilterPageOpen(true);
  };
  const modBreadcrumbData = useMemo(() => {
    return categoryData?.breadcrumb?.map((ctg) => {
      if (!!ctg.link) {
        if (ctg?.link?.indexOf("www.lenskart.com") === -1) {
          return {
            ...ctg,
            link: `${
              pageInfo.subdirectoryPath
                ? `${pageInfo.subdirectoryPath?.substring(1)}/`
                : ""
            }${ctg?.link}`,
          };
        } else
          return {
            ...ctg,
            link: `${
              pageInfo.subdirectoryPath
                ? `${pageInfo.subdirectoryPath?.substring(1)}/`
                : ""
            }${ctg?.link}`,
          };
      } else return ctg;
    });
  }, [categoryData.breadcrumb, pageInfo.subdirectoryPath]);
  // console.log(defaultSelection, "defaultSelection", intialOptions);
  const schema = {
    ...getCategorySchema(
      productData,
      configData?.DOMAIN,
      categoryData?.seo?.description,
      categoryData?.seo.title,
      `${configData.DOMAIN}/${categoryData.urlPath}`,
      categoryData?.categoryName
    ),
  };

  const breadcrumbSchema = {
    ...getBreadcrumbSchema(categoryData?.breadcrumb, configData?.DOMAIN),
  };

  const MobileCategory = (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {categoryData?.breadcrumb.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
            }}
          />
        )}
      </Head>
      {fetchCMS ? (
        <CMSWrapper>
          <CMS cmsURL={fetchCMS} fetchData={true} />
        </CMSWrapper>
      ) : (
        <>
          <FilterComponent
            defaultSelection={defaultSelection as string}
            options={intialOptions as FilterOption[]}
            initialType={filters?.filters[0]?.id as string}
            showClickFilter={showClickFilter}
            closeFilter={() => setFilterPageOpen(false)}
            show={filterPageOpen}
            onFilterClick={onFilterClickMsite}
            onFilterClickPerItem={onFilterClick}
            allFiltersData={filters?.filters as FilterItemType[]}
            selectedFilterData={filterSelected}
            applyFilter={onApplyFilterMiste}
            clearFilter={() => {
              resetFilter();
              // setFilterPageOpen(false);
            }}
            dataLocale={localeData}
            // innerHeight={window?.innerHeight}
            fetFilterDataMsite={fetFilterDataMsite}
          />

          <MobileCategoryWrapper>
            <MobileHelperWrapper>
              <Breadcrumbs
                font={TypographyENUM.defaultBook}
                componentSize={ComponentSizeENUM.small}
                id="Breadcrumbs"
                productID=""
                isRTL={pageInfo.isRTL}
                contactLensPowerFromUrl=""
                helplineNo=""
                dataLocale={localeData}
                breadcrumbData={modBreadcrumbData}
                deviceType={deviceType as string}
                subDirectory={
                  process?.env?.NEXT_PUBLIC_BASE_ROUTE?.toLowerCase() !== "na"
                    ? process.env.NEXT_PUBLIC_BASE_ROUTE
                    : null
                }
              />
              <FrameDitto3DGridWrapper>
                {categoryData?.categoryType !== "Contact Lens" &&
                  categoryData?.categoryType !== "Accessories" &&
                  enableAlgoliaSearch && (
                    <>
                      <FrameWrapper>
                        <Button
                          font={TypographyENUM.lkSansBold}
                          text={localeData.FIND_MY_FIT}
                          width={"100"}
                          theme={ThemeENUM.msitePrimary}
                          onClick={onClickFindMyFit}
                          styleSize={ComponentSizeENUM.small}
                        ></Button>
                      </FrameWrapper>
                      <PLPVerticalLine></PLPVerticalLine>
                      <FrameWrapper>
                        <Button
                          font={TypographyENUM.lkSansBold}
                          text={localeData.NEW_3D}
                          width={"100"}
                          theme={ThemeENUM.msitePrimary}
                          onClick={onClickNew3D}
                          styleSize={ComponentSizeENUM.small}
                        ></Button>
                      </FrameWrapper>
                      <New3DWrapper>
                        {mounted && (
                          <ToggleButton
                            text={localeData.TEXT_3D}
                            checked={isDittoEnabled}
                            clickOnToggle={() =>
                              getToggleValue(!isDittoEnabled)
                            }
                            innerHeight={20}
                            innerWidth={20}
                            outerWidth={44}
                            outerHeight={24}
                            innerColor={""}
                            outerColor={"#8e9bad"}
                          />
                        )}
                      </New3DWrapper>
                    </>
                  )}
                {(categoryData?.categoryType === "Contact Lens" || !enableAlgoliaSearch||
                  categoryData?.categoryType === "Accessories") &&  (
                  <>
                    {categoryData.productCount === 0 &&
                      productData.length === 0 && (
                        <NotFoundImg>{categoryData?.categoryName}</NotFoundImg>
                      )}
                    <TotalCount>
                      {`${localeData?.SHOWING} ${productListData?.length} ${localeData?.RESULTS}`}
                    </TotalCount>
                  </>
                )}
                <PLPVerticalLine></PLPVerticalLine>
                {categoryData.productCount > 0 && productData.length > 0 && (
                  <IconsWrapper isRTL={pageInfo.isRTL}>
                    {isGridView ? (
                      <Icons.MobileGridPlpToggle
                        onClick={() => showGridListView()}
                      />
                    ) : (
                      <Icons.MobileGridPlp onClick={() => showGridListView()} />
                    )}
                  </IconsWrapper>
                )}
              </FrameDitto3DGridWrapper>
              {!(categoryData?.categoryType === "Accessories") &&
                categoryData?.productCount > 1 &&
                !isScrollTop && (
                  <FilterIconWrapper>
                    <FliterIconSpan>
                      <Icons.FilterIcon
                        onClick={() => showFilterComponent()}
                        style={{
                          fill: "white",
                          transform: "scaleX(-1)",
                          marginBottom: "4px",
                          marginRight: "3px",
                        }}
                      />
                    </FliterIconSpan>
                  </FilterIconWrapper>
                )}
            </MobileHelperWrapper>
            <div>
              <ListingV2
                setScrollPosition={setScrollPosition}
                setInternalScrollPosition={setInternalScrollPos}
                switchToTop={switchToTop}
                setSwitchToTop={setSwitchToTop}
                params={params}
                currentItemCount={productData.length}
                totalCount={categoryData.productCount}
                configData={configData}
                localeData={localeData}
                isExchangeFlow={isExchangeFlow}
                query={id || ""}
                initialLoad={initialLoad}
                search={search}
                windowHeight={windowHeight}
                isGridView={isGridView}
                productData={productData}
                isScrollTop={isScrollTop}
                categoryData={categoryData}
              />
            </div>
          </MobileCategoryWrapper>

          {isScrollTop &&
            categoryData.productCount > 1 &&
            productData.length > 1 && (
              <FilterSortContainer
                bottomSheetData={bottomSheetData}
                showBottomSheet={showBottomSheet}
                closeBottomSheet={closeBottomSheet}
                openBottomSheet={openBottomSheet}
                onSizeTitleClick={onSizeTitleClick}
                selectedSize={selectedSize}
                onSortClick={onSortClick}
                sortBy={sortBy}
                onClearClick={onClearClick}
                onApplyClick={onApplyClick}
                dataLocale={localeData}
                isFilterApply={Object.keys(filterSelected).length > 0}
                tempData={tempData}
                isRTL={pageInfo.isRTL}
                isContactLens={
                  categoryData?.categoryType === "Contact Lens" ? true : false
                }
                isAccessories={categoryData?.categoryType === "Accessories"}
                search={search}
              />
            )}

          {!productListLoading && categoryData.description && (
            <div
              style={{ padding: "5%" }}
              dangerouslySetInnerHTML={{
                __html: categoryData.description,
              }}
            ></div>
          )}
        </>
      )}
    </>
  );

  const desktopCategory = (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {categoryData?.breadcrumb.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
            }}
          />
        )}
      </Head>
      <CategoryWrapper>
        {/* //> Breadcrumb Section */}
        {/* {modBreadcrumbData && modBreadcrumbData?.length > 0 && ( */}

        <Wrapper
          id="wrapper"
          // height={hideBanner ? 1 : hideBannerHeight && hideBannerHeight}
        >
          <BreadcrumbsWrapper isRTL={pageInfo.isRTL}>
            <Breadcrumbs
              font={TypographyENUM.defaultBook}
              componentSize={ComponentSizeENUM.small}
              id="Breadcrumbs"
              productID=""
              isRTL={pageInfo.isRTL}
              deviceType={pageInfo.deviceType}
              contactLensPowerFromUrl=""
              helplineNo={
                pageInfo.country === "sa" ? "" : localeData.CONTACT_NUMBER
              }
              dataLocale={localeData}
              breadcrumbData={modBreadcrumbData}
              color={configData?.HELPLINE_COLOR}
              subDirectory={
                process?.env?.NEXT_PUBLIC_BASE_ROUTE?.toLowerCase() !== "na"
                  ? process.env.NEXT_PUBLIC_BASE_ROUTE
                  : null
              }
            />
          </BreadcrumbsWrapper>
          {/* )} */}
          {/* //> Category Image */}
          {categoryData.categoryImage && (
            <>
              <StaticBanner productListLoading={false} isRTL={pageInfo.isRTL}>
                <BannerStaticBanner>
                  <BannerImg
                    src={categoryData.categoryImage}
                    alt="offer banner"
                    title="offer banner"
                    className="ga-banner-img-obeserver"
                    onClick={() =>
                      bannerGA4(
                        "select_promotion",
                        "TYPE_BANNER",
                        userInfo,
                        "",
                        "",
                        "",
                        "",
                        pageInfo
                      )
                    }
                  />
                </BannerStaticBanner>
              </StaticBanner>
            </>
          )}
        </Wrapper>

        <FlexWrapper ref={wrapperRef}>
          {/* //> Filter Section - Left Side */}
          {filters?.filters?.length === 0 ? null : (
            <FilterSection
              setinitialLoad={setinitialLoad}
              onFilterClick={(item: FilterItemType, selectedOption: DataType) =>
                handleFilters(item, selectedOption)
              }
              localeData={localeData}
              headerHeight={headerHeight}
            />
          )}
          {/* //> PLP - Right Side */}
          <ListingWrapper
            isRTL={pageInfo.isRTL}
            removeMargin={!!(filters?.filters?.length === 0)}
          >
            {/*//> 3D Try On Bar */}
            <TryOnSection
              categoryTitle={categoryData.categoryName}
              configData={localeData}
              handleSort={handleSort}
              dropdown={dropdown}
              setDropdown={setDropdown}
              userData={userData}
              categoryType={categoryData?.categoryType}
              categoryName={categoryData?.categoryName}
              filters={filters === null ? false : true}
              headerHeight={headerHeight}
              isDitto={categoryData?.isDitto}
            />
            {/*//> Selected Filters Section */}
            {/* {categoryData.productCount && Object.keys(filterMapping).length ? ( */}
            <div>
              <StickyCount headerHeight={headerHeight + 41}>
                <SelectedFilters
                  activeFilters={!search ? activeFilters : filterSelected}
                  filterSelected={filterSelected}
                  isFilterLoading={filtersLoading}
                  filters={filters}
                  filterMapping={filterMapping}
                  resetFilter={resetFilter}
                  handleFilters={handleFilters}
                  searchPage={search}
                />
                {productListData.length > 0 &&
                currentCategoryData &&
                currentCategoryData?.productCount > 0 ? (
                  <ShowCountContainer>
                    <span>{localeData.SHOWING} </span>
                    <span>{productListData.length} </span>
                    <span>{localeData.OF} </span>
                    <span>{currentCategoryData?.productCount} </span>
                    <span>{localeData.RESULTS}</span>
                    {/* {localeData.SHOWING} {productListData.length} of{" "}
                    {currentCategoryData?.productCount} {localeData.RESULTS} */}
                  </ShowCountContainer>
                ) : (
                  !productListLoading &&
                  productListData.length === 0 &&
                  currentCategoryData?.productCount > 0 && (
                    <FlexWrapperNoRes
                      removeMargin={!!(filters?.filters?.length === 0)}
                    >
                      <NoResultHeader>
                        {localeData.OOPS_NO_RESULT_FOUND}
                      </NoResultHeader>
                    </FlexWrapperNoRes>
                  )
                )}
              </StickyCount>
              <ListingSection>
                <ListingV2
                  setScrollPosition={setScrollPosition}
                  setInternalScrollPosition={setInternalScrollPos}
                  switchToTop={switchToTop}
                  setSwitchToTop={setSwitchToTop}
                  params={params}
                  currentItemCount={productData.length}
                  totalCount={categoryData.productCount}
                  configData={configData}
                  localeData={localeData}
                  isExchangeFlow={isExchangeFlow}
                  query={id || ""}
                  isScrollTop={isScrollTop}
                  initialLoad={initialLoad}
                  search={search}
                  windowHeight={windowHeight}
                  isGridView={false}
                  categoryData={categoryData}
                  productData={productData}
                />
              </ListingSection>
            </div>
            {/* //> Product Listing Section */}
            {configData?.PLP_FOOTER_DATA_SHOW &&
              categoryData?.description?.length > 0 && (
                <DescriptionWrapper
                  removeMargin={!!(filters?.filters?.length === 0)}
                >
                  <DescriptionContent
                    removeMargin={!!(filters?.filters?.length === 0)}
                  >
                    <StaticHTMLWrapper
                      dangerouslySetInnerHTML={{
                        __html: categoryData.description,
                      }}
                      key={"description"}
                    />
                  </DescriptionContent>
                </DescriptionWrapper>
              )}
          </ListingWrapper>
        </FlexWrapper>
        <BackTop
          gotoTop={gotoTop}
          scrollPosition={scrollPosition}
          isRTL={pageInfo.isRTL}
        />
      </CategoryWrapper>
    </>
  );
  return (
    <>
      {deviceType === DeviceTypes.MOBILE && MobileCategory}
      {deviceType === DeviceTypes.DESKTOP && desktopCategory}
    </>
  );
};

export default Category;
