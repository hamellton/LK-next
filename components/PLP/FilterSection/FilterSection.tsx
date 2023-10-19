import { RootState } from "@/redux/store";
import { TypographyENUM } from "@/types/baseTypes";
import { DataType } from "@/types/coreTypes";
import { FilterItemType } from "@/types/filterTypes";
import { Accordions, Skeleton as Loader } from "@lk/ui-library";
import { FilterClickEvent } from "helpers/userproperties";
import { useEffect, useState } from "react";
// import { isRTL } from "pageStyles/constants";
import { useSelector } from "react-redux";
import { FilterWrapper, NoFilters } from "./FilterSectionStyles";

interface handleClickAttrs {
  item: FilterItemType;
  selectedOption: FilterItemType;
  event: string;
}

interface FilterSectionType {
  onFilterClick: (item: FilterItemType, selectedOption: any) => void;
  setinitialLoad: (props: boolean) => void;
  localeData?: DataType;
  headerHeight: number;
}

const FilterSection = ({
  onFilterClick,
  setinitialLoad,
  localeData,
  headerHeight,
}: FilterSectionType) => {
  const { filters, filtersLoading, filterSelected } = useSelector(
    (state: RootState) => state.categoryInfo
  );
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);

  const onAccordionClick = ({
    event,
    item,
    selectedOption,
  }: handleClickAttrs) => {
    //   This function handles the updating of filters state in redux.
    //   This function also appends the filters to the query params
    item = { ...item };
    selectedOption = { ...selectedOption };

    item.selectedOption = [selectedOption.id];
    setinitialLoad(true);
    onFilterClick(item, selectedOption);
    FilterClickEvent({
      event: "filterApplied",
      filterCount: 1,
      [item.id]: selectedOption?.title,
    });
    return null;
  };

  const [showNoResults, setShowNoResults] = useState(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position - 150);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (filters && filters?.filters) {
      setShowNoResults(false);
    } else {
      setTimeout(() => {
        setShowNoResults(true);
      }, 1000);
    }
  }, [filters?.filters, filters]);

  return (
    <>
      {filters?.filters ? (
        // <Scroll>
        <FilterWrapper
          isRTL={isRTL}
          filterSelected={Object.keys(filterSelected).length > 0}
          headerHeight={headerHeight}
          scrollPosition={scrollPosition}
        >
          <Accordions
            isRTL={isRTL}
            id="filters"
            font={TypographyENUM.defaultBook}
            filters={filters.filters}
            onClick={onAccordionClick}
            filterSelected={filterSelected}
            defaultExpand={1}
          />
        </FilterWrapper>
      ) : (
        // </Scroll>
        <FilterWrapper filterSelected={false} isRTL={isRTL}>
          {!showNoResults && (
            <>
              <Loader.FilterSkeleton />
              <Loader.FilterSkeleton />
            </>
          )}
          {showNoResults && (
            <NoFilters>
              {localeData?.NO_FILTERS_FOUND || "No filters Found"}
            </NoFilters>
          )}
          <div style={{ height: "100vh" }}></div>
        </FilterWrapper>
      )}
    </>
  );
};

export default FilterSection;
