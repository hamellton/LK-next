import { RecentItem } from "@lk/ui-library";
import {
  ALGOLIA_RECENT_SEARCHES,
  QUERY_SUGGESTION_CLICK_FROM,
} from "@/constants/index";
import { Fragment, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueryData } from "@/redux/slices/categoryInfo";
import { getCookie } from "@/helpers/defaultHeaders";
import { updateSearchState } from "@/redux/slices/algoliaSearch";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { addToRecentSearch } from "../helper";

export const disableFunc = () => {
  const inputElement: HTMLInputElement = document.querySelector(".aa-Input")!;
  if (inputElement) inputElement.disabled = true;
  const elements = document.querySelectorAll("[aria-selected]");
  elements.forEach((element) => {
    if (element.getAttribute("aria-selected") !== "true") {
      element.classList.add("aa-Item-overlay");
    }
  });
};

export const useRecentPlugin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { country } = useSelector((state: RootState) => state.pageInfo);
  const redirection = async (hit: any, isProductSearch?: boolean) => {
    localStorage.setItem(QUERY_SUGGESTION_CLICK_FROM, "recent-search");
    sessionStorageHelper.setItem("query", hit.query);

    dispatch(updateSearchState({ isSelected: true }));

    const sessionId = getCookie(`clientV1_${country}`)?.toString() || "";
    if (isProductSearch) window.location.href = `/${hit?.webUrl}?search=true`;
    else {
      try {
        const data: any = await dispatch(
          fetchQueryData({
            sessionId,
            query: hit.objectID?.toString() || "",
            pageSize: 15,
            pageNumber: 0,
            isAlgoliaSearch: true,
          })
        );

        const webUrl = data.payload?.webUrl;

        if (webUrl) {
          window.location.href = `${webUrl}?search=true`;
        } else {
          window.location.href = `/search?q=${hit.objectID}&search=true`;
        }
      } catch (error) {
        console.error("An error occurred during redirection:", error);
      }
    }
  };

  const handleClick = (hit: any) => {
    if (hit?.webUrl) redirection(hit, true);
    else redirection(hit);
    disableFunc();
    addToRecentSearch(hit, userInfo);
  };

  return {
    getSources() {
      return [
        {
          sourceId: "recentPlugin",
          getItems({ query }: any) {
            if (query.trim() == "")
              return (
                JSON.parse(localStorage.getItem(ALGOLIA_RECENT_SEARCHES)!) || []
              );
            else return [];
          },
          templates: {
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Recent Search</span>
                </Fragment>
              );
            },
            item({ item }: any) {
              return (
                <RecentItem
                  handleClick={() => handleClick(item)}
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

// export const RecentItem = ({ hit, redirection, userInfo }: any) => {
//   const [index, setIndex] = useState(-1);

//   return (
//     <>
//       <CardItemTileWrapper onClick={handleClick} selected={index !== -1}>
//         <CardItemContent>
//           {!hit.derivedName ? (
//             <CardIconWrapper>
//               <Icons.Recent height={"20"} width={"20"} />
//             </CardIconWrapper>
//           ) : (
//             <CardImageWrapper
//               selected={index != -1}
//               src={
//                 hit.thumbnailUrl ??
//                 "https://static1.lenskart.com/media/desktop/img/jul23/result/nores_svg.svg"
//               }
//               height={40}
//               width={40}
//               enableBorder={true}
//               onError={(e: any) => {
//                 e.target.style.content =
//                   "url('https://static1.lenskart.com/media/desktop/img/jul23/result/nores_svg.svg')";
//               }}
//             ></CardImageWrapper>
//           )}
//           {!hit.derivedName ? (
//             <CardItemTitle>{hit.query}</CardItemTitle>
//           ) : (
//             <ProductContentWrapper>
//               <ProductId>{hit.query}</ProductId>
//               <ProductDetail>{hit.derivedName}</ProductDetail>
//             </ProductContentWrapper>
//           )}
//         </CardItemContent>
//         <CardItemAction>
//           {index == -1 && <Icons.FillUp height={"12"} width={"12"} />}
//           <TypingLoader show={index != -1} />
//         </CardItemAction>
//       </CardItemTileWrapper>
//       <CardItemSeperator className="aa-item-seperator" />
//     </>
//   );
// };
