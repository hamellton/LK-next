import { setDittoEnabled, setDittoUrl } from "@/redux/slices/categoryInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import { ComponentSizeENUM, TypographyENUM } from "@/types/baseTypes";
import { Dropdown, SwitchButton } from "@lk/ui-library";
import { deleteCookie, getCookie, setCookie } from "@/helpers/defaultHeaders";
// import {Router} from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Title, TitleWrapper, TryOnWrapperSection } from "./TryOnSectionStyles";
import { reDirection } from "containers/Base/helper";
import { ctaClicktry_3d_on, SortByEvent } from "helpers/userproperties";
import { ctaClickEvent } from "helpers/gaFour";

interface TryOnSectionType {
  categoryTitle: string;
  configData: DataType;
  handleSort: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dropdown: string;
  setDropdown: (props: string) => void;
  userData: DataType;
  categoryType: string;
  categoryName: string;
  filters: boolean;
  headerHeight: number;
  isDitto: boolean;
}

const TryOnSection = ({
  categoryTitle,
  configData,
  handleSort,
  dropdown,
  setDropdown,
  userData,
  categoryType,
  categoryName,
  filters,
  headerHeight,
  isDitto,
}: TryOnSectionType) => {
  const dispatch = useDispatch<AppDispatch>();
  const { setDittoImage, dittoImageLoading, cygnus } = useSelector(
    (state: RootState) => state.dittoInfo
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const [toggleValue, setToggleValue] = React.useState<boolean>(false);

  const _handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    SortByEvent({ event: "sortApplied", sortSelected: event.target.value });
    setDropdown(event.target.value);
    handleSort(event);
  };

  useEffect(() => {
    if (toggleValue && !dittoImageLoading) {
      dispatch(setDittoUrl({ dittoUrl: setDittoImage }));
    }
  }, [toggleValue, dittoImageLoading, dispatch, setDittoImage]);

  const onRightSide = () => {
    if (
      !getCookie("dittoGuestId") &&
      !userInfo.userDetails?.cygnus?.cygnusId &&
      !userData?.cygnus?.cygnusId
    ) {
      // alert(`$Ro`);
      reDirection(pageInfo?.subdirectoryPath);
    }
  };
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const data = {
      event: "cta_click",
      ctaname: "try_3d_on",
      ctasection: "try_3d_on_listing",
    };
    if (!userInfo.userLoading) {
      ctaClicktry_3d_on(data);
      const eventName = "cta_click";
      const cta_name = toggleValue ? "toggle-3d-on" : "toggle-3d-off";
      const cta_flow_and_page = "product-listing-page";
      ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
    }
  }, [toggleValue]);

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
        // alert("in 74");
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

  const categoryTitleWithType =
    categoryType == "Eyeglasses" &&
    !categoryTitle.toLowerCase().includes("eyeglasses")
      ? `${categoryTitle} ${categoryType}`
      : categoryTitle;

  return (
    <TryOnWrapperSection
      id="try-on-section"
      sticky={filters}
      headerHeight={headerHeight}
    >
      <TitleWrapper>
        <Title>{categoryTitleWithType}</Title>
      </TitleWrapper>
      {mounted &&
        isDitto &&
        categoryType?.toLowerCase() !== "accessories" &&
        categoryType?.toLowerCase() !== "contact lens" &&
        categoryTitle?.toLowerCase() !== "reading eyeglasses" && (
          <SwitchButton
            name="button"
            id="button-id"
            leftText={configData.VIEW_FRAMES}
            rightText={configData.VIEW_3D_TRY_ON}
            currentStatus={!getCookie("isDitto")}
            getToggleValue={getToggleValue}
            size={ComponentSizeENUM.small}
            isRTL={pageInfo.isRTL}
          />
        )}
      <Dropdown
        id="sort-by"
        value={dropdown}
        componentSize={ComponentSizeENUM.small}
        font={TypographyENUM.defaultBook}
        options={[
          { key: configData.BEST_SELLERS, value: "best_sellers" },
          { key: configData.LOW_TO_HIGH, value: "low_price" },
          { key: configData.HIGH_TO_LOW, value: "high_price" },
          { key: configData.NEW, value: "created" },
          { key: configData.BIGGEST_SAVING, value: "saving" },
          { key: configData.MOST_VIEWED, value: "popular" },
        ]}
        dataLocale={configData}
        handleChange={_handleSort}
      />
    </TryOnWrapperSection>
  );
};

export default TryOnSection;
