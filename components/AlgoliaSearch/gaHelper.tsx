import { QUERY_SUGGESTION_CLICK_FROM, SEARCH_FUNNEL } from "@/constants/index";
import sessionStorageHelper from "helpers/sessionStorageHelper";

const createItemObject = (item_id: any, item_list_id: string, item_list_name: string, item_category5: string) => {
    return {
      item_id,
      item_list_id,
      item_list_name,
      item_category5,
    };
  };

  export const addToSearchFunnel = (productPid: any, flag: string) => {
    const searchArray: any = sessionStorageHelper.getItem(SEARCH_FUNNEL) || {};
    
    const obj = createItemObject(
      productPid,
      flag === "search" ? "search" : "non-search",
      flag === "search" ? localStorage.getItem(QUERY_SUGGESTION_CLICK_FROM) || "" : "",
      flag === "search" ? sessionStorageHelper.getItem("query") || "" : ""
    );
    
    searchArray[productPid] = searchArray[productPid] || { search: [], nonSearch: [] };
    searchArray[productPid][flag === "search" ? "search" : "nonSearch"].unshift(obj);
  
    sessionStorageHelper.setItem(SEARCH_FUNNEL, searchArray);
  };

  
  export const removeFromSearchFunnel = (productPid: any) => {
    const searchArray: any = sessionStorageHelper.getItem(SEARCH_FUNNEL);
    
    if (searchArray && searchArray[productPid]) {
      const { search, nonSearch } = searchArray[productPid];
  
      if (nonSearch.length > 0) {
        nonSearch.shift(); //> Remove the first object from the "nonSearch" array
      } else if (search.length > 0) {
        search.shift(); //> Remove the first object from the "search" array
      }
  
      if (search.length === 0 && nonSearch.length === 0) {
        delete searchArray[productPid]; //> Remove the whole object from the data structure
      }
  
      sessionStorageHelper.setItem(SEARCH_FUNNEL, searchArray);
    }
  };
  