import { RootState } from "@/redux/store";
import { Checkout } from "@lk/ui-library";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { returnConfig } from "./returnConfig";
import ReturnMode from "./ReturnMode";

export default function ReturnAdd({
  returnAddress,
  OpenSidebar,
  setStoreSidebar,
  isExpandable,
  setIsExpandable,
  setReturnStepInfo,
  localeData,
}: any) {
  const [nearByAddress, setNearByAddress] = useState("");

  const { returnMethods, storeList } = useSelector(
    (state: RootState) => state.orderInfo
  );
  const [renderMethods, setRenderMethods] = useState([]);

  useEffect(() => {
    if (storeList && storeList.stores) {
      const storeDetails = storeList.stores[0];
      const { distance } = storeDetails;
      const nearestStoreDistance = distance && distance.humanReadable;

      if (
        returnMethods &&
        returnMethods.length
      ) {
        let address = "";
        if (returnAddress) {
          if (returnAddress.addressline1)
            address += `${returnAddress.addressline1}, `;
          if (returnAddress.addressline2)
            address += `${returnAddress.addressline2}, `;
          if (returnAddress.city) address += `${returnAddress.city}, `;
          if (returnAddress.state) address += `${returnAddress.state}, `;
          if (returnAddress.postcode) address += returnAddress.postcode;
        }
        updateMethods(nearestStoreDistance);
        setNearByAddress(address);
      }
    }
  }, [storeList, returnMethods]);

  const updateMethods = (nearestStoreDistance: string) => {
    // const { returnMethods = [] } = returnMethods;
    let modeOfReturn: {
      [x: string]: any;
      store_return?: {
        src: string;
        title: string;
        badge: string;
        subText: { type: string; contents: string[] };
        error: { status: boolean; src: string; text: string };
      };
      schedule_pickup?: {
        src: string;
        title: string;
        badge: string;
        subText: { type: string; contents: string[] };
        error: { status: boolean; src: string; text: string };
      };
      warehouse_return?: {
        src: string;
        title: string;
        badge: string;
        subText: { type: string; contents: string[] };
        error: { status: boolean; src: string; text: string };
      };
    };
    if (returnConfig) {
      modeOfReturn = returnConfig.chooseModeOfReturn;
    }
    let allModesDisabled = true;

    const isWarehouseReturnDenied = returnMethods.some(
      (method: { name: string; enabled: any }) => {
        return (
          ["store_return", "schedule_pickup"].includes(method.name) &&
          method.enabled
        );
      }
    );

    const renderReturnMethods =
      renderMethods &&
      returnMethods.reduce(
        (memo: any[], method: { name: any; enabled: any }) => {
          const { name, enabled } = method;
          const returnMode = modeOfReturn[name]
            ? { ...modeOfReturn[name] }
            : null; // to avoid change original object
          if (returnMode) {
            if (name === "warehouse_return" && isWarehouseReturnDenied) {
              return memo;
            }
            if (enabled && allModesDisabled) {
              allModesDisabled = false;
            }
            returnMode.id = name;
            returnMode.error = returnMode.error || {};
            returnMode.error.status = !enabled;
            returnMode.subText = { ...returnMode.subText };
            if (!enabled) {
              returnMode.badge = "";
              if (name === "store_return") {
                returnMode.subText = null;
              }
            }
            if (
              name === "store_return" &&
              enabled &&
              nearestStoreDistance &&
              returnMode.subText &&
              returnMode.subText.contents &&
              returnMode.subText.contents.length
            ) {
              returnMode.subText.contents = returnMode.subText.contents.map(
                (content: string) => {
                  return content.replace(
                    "a few km",
                    `<span class="text-color_grey_black fw700">${nearestStoreDistance}</span>`
                  );
                }
              );
            }
            memo.push(returnMode);
          }
          return memo;
        },
        []
      );

    setRenderMethods(renderReturnMethods);
  };

  return (
    <Checkout.ReturnAdd
      nearByAddress={nearByAddress}
      returnAddress={returnAddress}
      OpenSidebar={OpenSidebar}
      isExpandable={isExpandable}
      setIsExpandable={setIsExpandable}
    >
      <ReturnMode
        modes={renderMethods}
        setStoreSidebar={setStoreSidebar}
        setIsExpandable={setIsExpandable}
        setReturnStepInfo={setReturnStepInfo}
        localeData={localeData}
      />
    </Checkout.ReturnAdd>
  );
}
