import { DEFAULT_PAGE_COUNT } from "@/constants/index";
import { updateDefaultParams } from "@/redux/slices/categoryInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import router from "next/router";
// import { isRTL } from "pageStyles/constants";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ActiveFiltersContainer,
  CloseFilter,
  FillLabelHead,
  ResetFilters,
  ShowFiltersContainer,
  SubTitle,
} from "./SelectedFiltersStyles";

interface SelectedFilterTypes {
  isFilterLoading: boolean;
  filterSelected: DataType;
  activeFilters: DataType;
  filters: DataType | null;
  filterMapping: DataType;
  resetFilter: () => void;
  handleFilters: (item: {}, selectionOption: {}) => void;
  searchPage?: boolean;
}

const SelectedFilters = ({
  activeFilters,
  filterSelected,
  isFilterLoading,
  filters,
  filterMapping,
  resetFilter,
  handleFilters,
  searchPage = false,
}: SelectedFilterTypes) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFilterValue, setIsFilterValue] = useState<boolean>(false);
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);

  const removeFilter = async (activeFilterId: string, id: string) => {
    const item = {
      id: activeFilterId,
      selectedOption: [id],
    };
    const selectedOption = {
      id,
    };

    handleFilters(item, selectedOption);
  };

  // console.log(searchPage);

  return (
    <>
      <ActiveFiltersContainer removeMargin={!!(filters?.filters?.length === 0)}>
        {Object.keys(activeFilters).length > 0 &&
          Object.keys(filterSelected).length > 0 && (
            <ShowFiltersContainer isRTL={isRTL}>
              {Object.keys(activeFilters).map((activeFilter) => (
                <span key={activeFilter}>
                  {activeFilters[activeFilter].length ? (
                    <FillLabelHead>
                      <b>{filterMapping[activeFilter]} &nbsp;:&nbsp;</b>
                    </FillLabelHead>
                  ) : null}

                  {!searchPage && activeFilters[activeFilter].length
                    ? activeFilters[activeFilter].map(
                        (acf: {
                          id: string;
                          title:
                            | string
                            | number
                            | boolean
                            | ReactElement<string | JSXElementConstructor<any>>
                            | ReactFragment
                            | ReactPortal
                            | null
                            | undefined;
                        }) => (
                          <SubTitle key={acf.id}>
                            {acf.title}{" "}
                            <CloseFilter
                              key={acf.id}
                              onClick={() => removeFilter(activeFilter, acf.id)}
                            >
                              x
                            </CloseFilter>{" "}
                            &nbsp;
                          </SubTitle>
                        )
                      )
                    : null}
                  {searchPage && activeFilters[activeFilter].length
                    ? activeFilters[activeFilter].map((acf: string) => (
                        <span key={acf}>
                          {acf}{" "}
                          <CloseFilter
                            key={acf}
                            onClick={() => removeFilter(activeFilter, acf)}
                          >
                            x
                          </CloseFilter>{" "}
                          &nbsp;
                        </span>
                      ))
                    : null}
                  {!isFilterValue && activeFilters[activeFilter].length
                    ? setIsFilterValue(true)
                    : null}
                  {activeFilters[activeFilter].length ? (
                    <span>|&nbsp;</span>
                  ) : null}
                </span>
              ))}
              {/* <span>&nbsp;</span> */}
              {Object.keys(filterSelected).length ? (
                <ResetFilters
                  onClick={() => {
                    resetFilter();
                    setIsFilterValue(false);
                  }}
                >
                  Reset Filters
                </ResetFilters>
              ) : null}
            </ShowFiltersContainer>
          )}
      </ActiveFiltersContainer>
    </>
  );
};

export default SelectedFilters;
