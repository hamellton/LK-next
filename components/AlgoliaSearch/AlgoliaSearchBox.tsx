import React, { useEffect, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { Icons, Spinner } from "@lk/ui-library";
import { Autocomplete } from "@/components/AlgoliaSearch/AlgoliaAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateUserRecentSearch } from "@/redux/slices/userInfo";
import { ALGOLIA_RECENT_SEARCHES } from "@/constants/index";
import Head from "next/head";
import { onSearchBackIconClick, userProperties } from "helpers/userproperties";

interface AlgoliaType {
  setShowAlgoliaSearchState: (state: boolean) => void;
  userInfo: any;
  configData: any;
}
const AlgoliaSearch = ({
  setShowAlgoliaSearchState,
  userInfo,
  configData,
}: AlgoliaType) => {
  console.log("🚀 ~ file: AlgoliaSearchBox.tsx:22 ~ configData:", configData);
  const isProd = true;
  const algoliaClient = algoliasearch(
    configData?.ALGOLIA_APP_ID,
    configData?.ALGOLIA_KEY
  );
  const sandBoxClient = algoliasearch(
    "testingAUN637Y8I9",
    "568ac891dbe1e3caed42997ff229fe8c"
  );
  const searchData = useSelector((state: RootState) => state.algoliaSearch);
  const dispatch = useDispatch<AppDispatch>();
  const [active, setActive] = useState(false);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  useEffect(() => {
    if (active) {
      userProperties(userInfo, "algolia-search-page", pageInfo, configData);
      const id: any = document.getElementsByClassName("aa-Input");
      id[0]?.focus();
      id[0]?.click();
    }
    setTimeout(() => {
      setActive(true);
    }, 100);
    return () => {
      const recentLocalStorage = JSON.parse(
        localStorage.getItem(ALGOLIA_RECENT_SEARCHES)!
      );
      if (active && userInfo.isLogin && recentLocalStorage) {
        dispatch(
          updateUserRecentSearch({
            sessionId: userInfo.sessionId,
            searches: recentLocalStorage,
          })
        );
      }
    };
  }, [active, searchData, dispatch]);

  const handleClick = () => {
    setShowAlgoliaSearchState(false);
    onSearchBackIconClick(userInfo);
  };
  return (
    <div id="search-page" className="search-page">
      <Head>
        <meta
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui, user-scalable=no"
          name="viewport"
        />
      </Head>
      <div className="aa-input-search-box">
        <div className="aa-input-back-icon" onClick={handleClick}>
          <Icons.SearchBackButton height={32} width={32} />
        </div>
        <Autocomplete
          placeholder="What are you looking for?"
          detachedMediaQuery="none"
          searchClient={isProd ? algoliaClient : sandBoxClient}
          openOnFocus
          autoFocus={true}
          configData={configData}
        />

        {searchData.showResult && (
          <span className="aa-header-submit-icon">
            <Spinner
              isAlgoliaSearch={true}
              show
              fullPage={false}
              padding={"0px"}
            />
          </span>
        )}
      </div>
    </div>
  );
};

export default AlgoliaSearch;
