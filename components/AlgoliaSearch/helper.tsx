import { ALGOLIA_RECENT_SEARCHES } from "@/constants/index";
import { onRecentTrendingClick } from "helpers/userproperties";

export const addToRecentSearch =(hit: any, userInfo?: any) => {
    const recentStorage = JSON.parse(
      localStorage.getItem(ALGOLIA_RECENT_SEARCHES) || "[]"
    );
  
    const index = recentStorage.findIndex(
      (item: any) => item.query === hit.query
    );
  
    if (index === -1) {
      recentStorage.unshift(hit);
      if (recentStorage.length > 3) {
        recentStorage.pop();
      }
    } else {
      recentStorage.splice(index, 1);
      recentStorage.unshift(hit);
    }
  
    localStorage.setItem(ALGOLIA_RECENT_SEARCHES, JSON.stringify(recentStorage));
  
    if (userInfo) {
      const newIndex = index !== -1 ? index + 1 : 1;
      onRecentTrendingClick("recent_search_click", userInfo, hit.query, newIndex);
    }
  };