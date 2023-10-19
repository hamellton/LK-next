import { TrendingItem } from "@lk/ui-library";
import {
  ALGOLIA_TRENDING_SEARCHES,
  QUERY_SUGGESTION_CLICK_FROM,
} from "@/constants/index";
import { Fragment, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { disableFunc } from "./recentPlugin";
import { fetchQueryData } from "@/redux/slices/categoryInfo";
import { getCookie } from "@/helpers/defaultHeaders";
import { updateSearchState } from "@/redux/slices/algoliaSearch";
import { onRecentTrendingClick } from "helpers/userproperties";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { addToRecentSearch } from "../helper";

export const useTrendingPlugin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { country } = useSelector((state: RootState) => state.pageInfo);
  const trendingData =
    JSON.parse(localStorage.getItem(ALGOLIA_TRENDING_SEARCHES)!) || [];

  const redirection = async (hit: any) => {
    localStorage.setItem(QUERY_SUGGESTION_CLICK_FROM, "trending-search");
    sessionStorageHelper.setItem("query", hit.query);
    dispatch(updateSearchState({ isSelected: true }));

    const sessionId = getCookie(`clientV1_${country}`)?.toString() || "";
    const requestData = {
      sessionId,
      query: hit.objectID?.toString() || "",
      pageSize: 15,
      pageNumber: 0,
      isAlgoliaSearch: true,
    };

    try {
      const data: any = await dispatch(fetchQueryData(requestData));
      const webUrl = data.payload?.webUrl;
      if (webUrl) {
        window.location.href = `${webUrl}?search=true`;
      } else {
        window.location.href = `/search?q=${hit.objectID}&search=true`;
      }
    } catch (error) {
      console.error("An error occurred during redirection:", error);
    }
  };

  const trendingGa = (trendingList: any, hit: any, userInfo: any) => {
    const queryPosition = trendingList.findIndex(
      (i: any) => i.query == hit.query
    );
    onRecentTrendingClick(
      "trending_search_click",
      userInfo,
      hit.query,
      queryPosition + 1
    );
  };

  const handleClick = (hit:any) => {
    redirection(hit);
    disableFunc();
    addToRecentSearch(hit);
  };

  return {
    getSources() {
      return [
        {
          sourceId: "useNewTrendingPlugin",
          getItems({ query }: any) {
            if (query.trim() == "") return trendingData;
            else return [];
          },

          templates: {
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">
                    Trending at Lenskart
                  </span>
                </Fragment>
              );
            },
            item({ item }: any) {
              return (
                <TrendingItem
                  handleClick={() => {
                    handleClick(item);
                    trendingGa(trendingData, item, userInfo);
                  }}
                  hit={item}
                  />
              );
            },
          },
        },
      ];
    },
  };
};

// export function TrendingItem({
//   hit,
//   redirection,
//   userInfo,
//   trendingList,
// }: any) {
//   const [index, setIndex] = useState(-1);
//   const handleClick = (event: any) => {
//     redirection(hit);
//     disableFunc();
//     setIndex(1);
//     addToRecentSearch(hit);
//     trendingGa(trendingList, hit, userInfo);
//     event.stopPropagation();
//   };
//   return (
//     <>
//       <CardItemTileWrapper onClick={handleClick} selected={index !== -1}>
//         <CardItemContent>
//           <CardImageWrapper
//             selected={index != -1}
//             src={hit.thumbnailUrl}
//             height={40}
//             width={40}
//             enableBorder={false}
//           ></CardImageWrapper>
//           <CardItemTitle>{hit.query}</CardItemTitle>
//         </CardItemContent>
//         <CardItemAction>
//           {index == -1 && <Icons.FillUp height={"12"} width={"12"} />}
//           <TypingLoader show={index != -1} />
//         </CardItemAction>
//       </CardItemTileWrapper>
//       <CardItemSeperator className="aa-item-seperator" />
//     </>
//   );
// }
