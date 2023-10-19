import React from "react";
import { createElement, Fragment, useEffect, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";
import { BaseItem } from "@algolia/autocomplete-core";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateSearchState } from "@/redux/slices/algoliaSearch";
import {
  Icons,
  NoQuerySuggestionItem,
  ProductSearchComponent,
  TypingLoader,
} from "@lk/ui-library";
import { QUERY_SUGGESTION_CLICK_FROM } from "@/constants/index";
import { useRecentPlugin } from "./plugins/recentPlugin";
import { useTrendingPlugin } from "./plugins/trendingPlugin";
import { fetchQueryData } from "@/redux/slices/categoryInfo";
import { getCookie } from "@/helpers/defaultHeaders";
// import TypingLoader from "./Loader/TypingLoader";
import {
  onClearIconClick,
  onCustomQueryClick,
  onQuerySuggestionClick,
  onSearchBarTyping,
} from "helpers/userproperties";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { addToRecentSearch } from "./helper";
// import ProductSearchComponent from "./ProductSearch/ProductSearch.component";
import aa from "search-insights";
// import { NoQuerySuggestionItem } from "./NoQuerySuggestionItem/NoQuerySuggestionItem";
type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
  className?: string;
  searchClient?: any;
  configData: any;
};

export function Autocomplete({
  searchClient,
  className,
  configData,
  ...autocompleteProps
}: AutocompleteProps) {
  const autocompleteContainer = useRef<HTMLDivElement>(null);
  const panelRootRef = useRef<any>(null);
  const rootRef = useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { country } = useSelector((state: RootState) => state.pageInfo);
  const recentSearchesPlugin = useRecentPlugin();
  const trendingPlugin = useTrendingPlugin();
  const { defaultParams } = useSelector(
    (state: RootState) => state.categoryInfo
  );
  const handleResize = () => {
    const element: any = document.querySelector(".aa-PanelLayout");
    if (element) element.style.height = `${window.innerHeight - 65}px`;
  };
  const userInfo = useSelector((state: RootState) => state.userInfo);
  let selected = -1;
  const minPidLength = configData?.ALGOLIA_MIN_KEYSTROKE_LENGTH_PID;

  //> Redirection Handler - When user click on query
  const redirection = (
    objectID: any,
    webUrl?: any,
    isViewSimilar?: boolean
  ) => {
    dispatch(updateSearchState({ isSelected: true }));
    //> In case View Similar is true for Product Search
    if (isViewSimilar) {
      window.location.href = `/search?q=${objectID}&search=true&similarProductId=${objectID}`;
    }
    //> In case webUrl is present for Product Search
    else if (webUrl) window.location.href = `/${webUrl}?search=true`;
    //> For query suggestion redirection
    else {
      try {
        dispatch(
          fetchQueryData({
            sessionId: getCookie(`clientV1_${country}`)?.toString() || "",
            query: objectID?.toString() || "",
            pageSize: defaultParams.pageSize,
            pageNumber: defaultParams.pageCount,
            isAlgoliaSearch: true,
          })
        ).then((data: any) => {
          if (data.payload?.webUrl)
            window.location.href = `${data.payload?.webUrl}?search=true`;
          else {
            window.location.href = `/search?q=${objectID}&search=true`;
            // Router.push(`/search?q=${query}`);
          }
        });
      } catch (error) {
        console.error("An error occurred during redirection:", error);
      }
    }
  };

  //> Function to disable other suggestions when user clicked on a query
  const disableFunc = () => {
    const id = document.querySelector(".aa-List")!;
    if (id) id.classList.add("aa-Item-disable");
    const inputElement: HTMLInputElement = document.querySelector(".aa-Input")!;
    if (inputElement) inputElement.disabled = true;
    const clearButton: HTMLDivElement | null = document.querySelector(
      ".aa-InputWrapperSuffix"
    );
    if (clearButton) {
      clearButton.style.display = "none";
    }
  };

  //> Function to handle the synonyms query
  const handleQueryText = (params: any) => {
    const listItems = document.querySelectorAll(".aa-Item");
    const index = Number(params?.item?.__autocomplete_id || 0);
    const titleDiv = listItems[index].querySelector(".aa-ItemContentTitle");
    const titleValue: any = titleDiv?.textContent;
    listItems[index]?.classList.add("aa-Item-enable");
    return titleValue;
  };

  const onNoQuerySuggestionClick = (hit: { query: string }) => {
    redirection(hit.query);
    disableFunc();
    localStorage.setItem(QUERY_SUGGESTION_CLICK_FROM, "no_qs_search");
    addToRecentSearch({
      query: hit.query,
      objectID: hit.query,
    });
    handleQueryText(hit);
    onQuerySuggestionClick(userInfo, hit.query, hit.query, 1, 1);
    sessionStorageHelper.setItem("query", hit.query);
  };

  //> Function to handle the debouncing of queries
  const createDebounceFunction =
    (timeIdRef: NodeJS.Timeout | null) =>
    async (value: string): Promise<string> => {
      if (timeIdRef) {
        clearTimeout(timeIdRef);
      }
      return new Promise((resolve) => {
        timeIdRef = setTimeout(() => {
          resolve(value);
        }, configData?.ALGOLIA_QUERY_DELAY_TIME ?? 250); //> Delaying the value by 250 milliseconds
      });
    };

  //> Usage with different timeId variables and dynamic values
  let timeId: NodeJS.Timeout | null = null;
  let timeId2: NodeJS.Timeout | null = null;

  const debounce = createDebounceFunction(timeId);
  const debounce2 = createDebounceFunction(timeId2);

  //> Algolia search client configuration for query search
  const querySearchClient = {
    ...searchClient,
    async search(requests: any) {
      const query = await debounce(requests[0]?.query.trim());
      const isNumericQuery = !isNaN(Number(query));
      const isQueryLongEnough =
        query.length <= configData?.ALGOLIA_MIN_KEYSTROKE_LENGTH;
      const isPidLongEnough = query.length >= minPidLength;
      if (
        query == "" ||
        isQueryLongEnough ||
        (isNumericQuery && isPidLongEnough)
      ) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
            hitsPerPage: 0,
            exhaustiveNbHits: false,
            query: "",
            params: "",
          })),
        });
      }
      return searchClient.search(requests);
    },
  };

  //> Algolia search client configuration for product search
  const productSearchClient = {
    ...searchClient,
    async search(requests: any) {
      const query = await debounce2(requests[0]?.query.trim());
      const isNumericQuery = !isNaN(Number(query));
      const isPidLongEnough = query.length >= minPidLength;
      if (query != "" && isNumericQuery && isPidLongEnough) {
        return searchClient.search(requests);
      }
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: "",
          params: "",
        })),
      });
    },
  };

  //> Plugins configuration

  const plugins = useMemo(() => {
    //> Setting user token for Algolia Analytics
    if (userInfo.isLogin) aa("setUserToken", userInfo?.mobileNumber!);
    else aa("setUserToken", "0000000000");

    //> Query Suggestion Plugin
    const querySuggestions = createQuerySuggestionsPlugin({
      searchClient: querySearchClient,
      indexName:
        configData?.ALGOLIA_SEARCH_QUERY_SUGGESTIONS ||
        "preprod_product_index_IN_query_suggestions_external",

      getSearchParams({ state }) {
        return {
          hitsPerPage: !state.query ? 0 : 10,
          clickAnalytics: true,
        };
      },

      transformSource({ source }: any) {
        return {
          ...source,
          sourceId: "querySuggestionsPlugin",

          onSelect({ setIsOpen }) {
            setIsOpen(true);
          },
          onActive(params) {
            setTimeout(() => {
              redirection(params.item.objectID);
            }, 0);
            localStorage.setItem(QUERY_SUGGESTION_CLICK_FROM, "query-search");
            selected = params.state.activeItemId!;
            params.item.query = handleQueryText(params);
            addToRecentSearch(params.item);
            disableFunc();
            onQuerySuggestionClick(
              userInfo,
              params.state.query,
              params.item.query,
              Number(params.item.__autocomplete_id) + 1,
              params.state.collections[0]?.items?.length
            );
            sessionStorageHelper.setItem("query", params.item.query);
          },
          getItemInputValue(item) {
            return item.state.query;
          },
          templates: {
            ...source.templates,
            header({ state }) {
              if (state.query) {
                return null;
              }
            },
            item(params) {
              const { item } = params;
              return (
                <>
                  <div className={"aa-ItemLink"}>
                    <div className="aa-Item-Icon">
                      <Icons.SearchQuery height={"20"} width={"20"} />
                    </div>
                    {source.templates.item(params).props.children}
                    <div className="aa-fill-up-icon">
                      {selected != Number(item.__autocomplete_id) && (
                        <Icons.FillUp height={"12"} width={"12"} />
                      )}
                      <TypingLoader
                        show={selected == Number(item.__autocomplete_id)}
                      />
                    </div>
                  </div>
                  <span className="aa-item-seperator" />
                </>
              );
            },
            noResults({ state }) {
              return (
                <div className="aa-List">
                  <NoQuerySuggestionItem
                    hit={state}
                    handleClick={() => onNoQuerySuggestionClick(state)}
                  />
                </div>
              );
            },
          },
        };
      },
    });

    //> PID Search -> Product Suggestions

    const productSuggestions = createQuerySuggestionsPlugin({
      searchClient: productSearchClient,
      indexName:
        configData?.ALGOLIA_SEARCH_PRODUCT_INDEX ||
        "prod_product_model_index_for_qs_IN",
      getSearchParams({ state }) {
        return {
          hitsPerPage: !state.query ? 0 : 10,
          restrictSearchableAttributes: ["productId"],
          clickAnalytics: true,
        };
      },

      transformSource({ source }: any) {
        return {
          ...source,
          sourceId: "productSuggestionsPlugin",

          onSelect({ setIsOpen }) {
            setIsOpen(true);
          },
          onActive(params: any) {
            const addToRecentSearchAndRedirect = () => {
              setTimeout(() => {
                redirection(params?.item?.objectID, params?.item?.webUrl);
              }, 200);
              addToRecentSearch({
                query: params.item.objectID,
                objectID: params.item.objectID,
                derivedName: brandProduct,
                thumbnailUrl: params.item.imageUrl,
                webUrl: params?.item?.webUrl || "",
              });
              disableFunc();
              handleQueryText(params);
            };
            localStorage.setItem(QUERY_SUGGESTION_CLICK_FROM, "pid-search");
            selected = params.state.activeItemId!;
            const classification = params?.item?.classification
              .toString()
              .toLowerCase();
            const productType = params?.item?.product_type
              .toString()
              .toLowerCase();
            const validTypes = ["eyeglasses", "sunglasses", "eyeframe"];
            const brandProduct =
              validTypes.includes(classification) ||
              validTypes.includes(productType)
                ? `${params?.item?.brand_name} - ${
                    params?.item?.searchProductName ?? ""
                  }`
                : params?.item?.searchProductName ?? "";

            const inStock = params?.item?.flags?.MOBILESITE?.inStock;
            const isAvailableStore =
              params?.item?.flags?.MOBILESITE?.onlyAvailableAtStore;
            const isViewSimilar =
              params?.item?.flags?.MOBILESITE?.showViewSimilar;
            if (inStock && !isAvailableStore && isViewSimilar) {
              addToRecentSearchAndRedirect();
            } else if (inStock && !isAvailableStore && !isViewSimilar) {
              addToRecentSearchAndRedirect();
            } else if (
              (!inStock && !isAvailableStore && !isViewSimilar) ||
              (inStock && isAvailableStore && !isViewSimilar) ||
              (!inStock && isAvailableStore && !isViewSimilar)
            ) {
              selected = -1;
            } else {
              localStorage.setItem(QUERY_SUGGESTION_CLICK_FROM, "view-similar");
              setTimeout(() => {
                redirection(
                  params?.item?.objectID,
                  params?.item?.webUrl,
                  params.item?.flags?.MOBILESITE?.showViewSimilar
                );
              }, 200);
              disableFunc();
              handleQueryText(params);
            }
            onQuerySuggestionClick(
              userInfo,
              params.state.query,
              params.item.productId.toString(),
              Number(params.item.__autocomplete_id) + 1,
              params.state.collections[0]?.items?.length
            );
            sessionStorageHelper.setItem("query", params.item.productId);
          },
          getItemInputValue(item) {
            return item.state.query;
          },
          templates: {
            ...source.templates,
            header({ items }) {
              if (items.length == 0) {
                return null;
              }

              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">
                    {configData?.ALGOLIA_PRODUCT_HEADER}
                  </span>
                </Fragment>
              );
            },
            item(params) {
              const { item }: any = params;
              const inStock = item?.flags?.MOBILESITE?.inStock;
              const isAvailableStore =
                item?.flags?.MOBILESITE?.onlyAvailableAtStore;
              const isViewSimilar = item?.flags?.MOBILESITE?.showViewSimilar;
              return (
                <ProductSearchComponent
                  inStock={inStock}
                  isAvailableStore={isAvailableStore}
                  isViewSimilar={isViewSimilar}
                  item={item}
                  selected={selected}
                />
              );
            },
            noResults({ state }) {
              return (
                <div className="aa-List">
                  <NoQuerySuggestionItem
                    hit={state}
                    handleClick={() => onNoQuerySuggestionClick(state)}
                  />
                </div>
              );
            },
          },
        };
      },
    });
    return [
      querySuggestions,
      productSuggestions,
      recentSearchesPlugin,
      trendingPlugin,
    ];
  }, []);

  useEffect(() => {
    if (!autocompleteContainer.current) {
      return;
    }

    //> Search InputBox Handling -> AutoComplete Widget
    const autocompleteInstance = autocomplete({
      ...autocompleteProps,
      container: autocompleteContainer.current,
      insights: true,
      onReset({ state }) {
        onClearIconClick(userInfo, state.query.trim());
        dispatch(updateSearchState({ showResult: false }));
        selected = -1;
      },
      onSubmit({ state, refresh }) {
        localStorage.setItem(QUERY_SUGGESTION_CLICK_FROM, "custom-search");
        if (state.query.trim().length > 0) {
          onCustomQueryClick(
            userInfo,
            state.query.trim(),
            state.collections[0]?.items?.length
          );
          onSearchBarTyping(userInfo);
          addToRecentSearch({ query: state.query, objectID: state.query });
          redirection(state.query);
          dispatch(updateSearchState({ showResult: true }));
          sessionStorageHelper.setItem("query", state.query.trim());
          const listElement = document.querySelector(".aa-List")!;
          if (listElement) listElement.classList.add("aa-Item-disable");
          const formElement = document.querySelector(".aa-Form")!;
          if (formElement) formElement.classList.add("aa-input-submit");
          setTimeout(() => {
            const inputElement: HTMLInputElement =
              document.querySelector(".aa-Input")!;
            if (inputElement) inputElement.disabled = true;
          }, 500);
        } else {
          refresh();
        }
      },

      onStateChange({ prevState, state }) {
        if (prevState.query.trim() !== state.query.trim()) {
          selected = -1;
          const id = document.querySelector(".aa-List")!;
          if (id) id.classList.remove("aa-Item-disable");
          handleResize();
          window.addEventListener("resize", handleResize, { passive: true });
          document.body.style.overflow = "hidden";
        }
      },

      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;
          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef?.current?.render(children);
      },

      plugins,
      reshape({ sourcesBySourceId, state }: any) {
        const {
          querySuggestionsPlugin: querySuggestions,
          recentSearchesPlugin: recentSearches,
          trendingPlugin: trending,
          productSuggestionsPlugin: productSuggestions,
          ...rest
        } = sourcesBySourceId;
        return [
          state.query.trim().length == 0 && recentSearches,
          state.query.trim().length == 0 && trending,
          !(
            !isNaN(Number(state.query.trim())) &&
            state.query.trim().length >= minPidLength
          ) &&
            state.query.trim().length > 0 &&
            querySuggestions,
          !isNaN(Number(state.query.trim())) &&
            state.query.trim().length >= minPidLength &&
            productSuggestions,
          state.query.trim().length == 1 && onSearchBarTyping(userInfo),
          ...Object.values(rest),
        ];
      },
    });

    return () => autocompleteInstance.destroy();
  }, [plugins]);

  return <div className={className} ref={autocompleteContainer}></div>;
}
