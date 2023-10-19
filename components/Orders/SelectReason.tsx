import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Exchange from "./Exchange";

import { getCookie } from "@/helpers/defaultHeaders";
import { Checkout } from "@lk/ui-library";
import { DataType } from "@/types/coreTypes";

export default function SelectReason({
  eligibility,
  isExpandable,
  setIsExpandable,
  localeData
}: any) {
  const { returnResponseResult, orderDetailInvResult, secondaryReasons } =
    useSelector((state: RootState) => state.orderInfo);
  const [dropdown, setDropdown] = React.useState<number>(0);
  const [dropdownSecondary, setDropdownSecondary] = React.useState<number>(0);
  const [primaryReason, setPrimaryReason] = React.useState<string>("");
  const [secondaryReason, setSecondaryReason] = React.useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("returnStep")) {
      const getReturnStep = JSON.parse(
        localStorage.getItem("returnStep") || ""
      );

      if (returnResponseResult) {
        setDropdown(() => {
          const getDropdown = returnResponseResult.filter(
            (response: DataType) => response.key === getReturnStep.primaryReason
          );
          // console.log(getDropdown);

          return getDropdown[0].value;
        });
      }
      setPrimaryReason(getReturnStep.primaryReason || "");
      setSecondaryReason(getReturnStep.secondaryReason || "");
    }
  }, [returnResponseResult]);

  const _handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDropdown(parseInt(event.target.value));
    const _primaryReason = returnResponseResult.filter(
      (val: DataType) => val.value === Number(event.target.value)
    );
    setPrimaryReason(_primaryReason[0].key);
  };

  const _handleSortSecondary = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDropdownSecondary(parseInt(event.target.value));
    const _secondaryReason = secondaryReasons[dropdown].filter(
      (val: DataType) => val.value === Number(event.target.value)
    );
    setSecondaryReason(_secondaryReason[0].key);
  };

  const clickContinue = () => {
    let getReturnStep = null;
    if (localStorage.getItem("returnStep")) {
      getReturnStep = JSON.parse(localStorage.getItem("returnStep") || "");
    }
    let returnStep: any;
    if (getReturnStep) {
      returnStep = {
        ...getReturnStep,
        primaryReason: primaryReason,
        secondaryReason: secondaryReason,
      };
      setIsExpandable(getReturnStep.isExpandable);
    } else {
      returnStep = {
        setStoreAddress: false,
        primaryReason: primaryReason,
        secondaryReason: secondaryReason,
        isExpandable: "RETURN_ADD",
        secondStep: true,
      };
      setIsExpandable("RETURN_ADD");
    }
    const returnReasons: any = {
      primaryReasonId: dropdown,
      secondaryReasonId: Number(dropdownSecondary),
    };
    localStorage.setItem("returnStep", JSON.stringify(returnStep));
    localStorage.setItem("returnReasons", JSON.stringify(returnReasons));
  };

  return (
    <Checkout.SelectReason
      isExpandable={isExpandable}
      setIsExpandable={setIsExpandable}
      returnResponseResult={returnResponseResult}
      _handleSort={_handleSort}
      primaryReason={primaryReason}
      _handleSortSecondary={_handleSortSecondary}
      secondaryReasons={secondaryReasons}
      dropdown={dropdown}
      secondaryReason={secondaryReason}
      clickContinue={clickContinue}
    >
      <Exchange
        selectedReasonComponent={true}
        items={orderDetailInvResult?.orders[0].items[0]}
        returnEligibiliyDetails={eligibility}
        returnItemId={getCookie("postcheckItemId")}
        localeData={localeData}
      />
    </Checkout.SelectReason>
  );
}
