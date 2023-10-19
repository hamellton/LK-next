import { setCurrentreturnItem } from "@/redux/slices/orderInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { getCookie } from "@/helpers/defaultHeaders";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReturnOptionType from "./ReturnOptionType";
import {
  ChangeButton,
  HeaderLeft,
  HeaderText,
  LeftOuterMost,
  LeftRoot,
  Lightcolor,
  SummaryOuter,
  SummaryOuterMarNeg,
} from "./styles";

const packageTypes = [
  "zero_power",
  "single_vision",
  "bifocal",
  "tinted_sv",
  "contact_lens",
  "sunglasses",
];

export default function ReturnMethod({
  returnConfig,
  returnActionsDetail,
  returnEligibiliyDetails,
  isExpandable,
  setIsExpandable,
  setReturnStepInfo,
  localeData,
  configData,
}: any) {
  const returnItemId: string | undefined =
    getCookie("postcheckItemId")?.toString();
  const dispatch = useDispatch<AppDispatch>();
  const { orderDetailInvResult, eligibilityInfo } = useSelector(
    (state: RootState) => state.orderInfo
  );

  const [customerWallet, setCustomerWallet] = useState(false);
  const [refundMethods, setRefundMethods] = useState("");
  const [currentReturnItem, setCurrentReturnItem] = useState<any>({ item: "" });
  const [exchangeMethods, setExchangeMethods] = useState({});
  const [returnMethodsUpdated, setReturnMethodsUpdated] = useState("");
  const [exchangeOpted, setExchangeOpted] = useState("");

  useEffect(() => {
    const exchange = localStorage.getItem("exchangeMethod") || "";
    setExchangeOpted(exchange);
  }, []);

  const updateRenderModes = () => {
    const { choosePostReturnMode } = returnConfig;
    const {
      item: { isRefundable, isExchangeable },
    } = currentReturnItem;
    const configPostReturnMethods = { ...choosePostReturnMode };
    // const { RECEIVED_BY_LENSKART } = dataLocale;
    const renderMethods = [];
    // const allModesDisabled = !isExchangeable && !isRefundable;
    configPostReturnMethods.exchange.id = "exchange";
    configPostReturnMethods.refund.id = "refund";
    const returnStatus = ""; //getProductReturnStatus();
    if (isExchangeable && isRefundable) {
      renderMethods.push(configPostReturnMethods.exchange);
      renderMethods.push(configPostReturnMethods.refund);
    } else if (isExchangeable || isRefundable) {
      renderMethods.push(
        (isExchangeable && configPostReturnMethods.exchange) ||
          (isRefundable && configPostReturnMethods.refund)
      );
    }

    const returnMethodsUpdated = renderMethods && JSON.parse(JSON.stringify(renderMethods));
    returnMethodsUpdated.forEach((method: { subText: { contents: any[] } }) => {
      if (method?.subText?.contents) {
        method.subText.contents = method.subText.contents.map(
          (content: string) => {
            return content.replace(
              "(pickedupStatus)",
              `<span>${returnStatus || "RECEIVED_BY_LENSKART"}</span>`
            );
          }
        );
      }
    });
    setReturnMethodsUpdated(returnMethodsUpdated);
    // setAllModesDisabled(allModesDisabled);
  };

  useEffect(() => {
    const items =
      orderDetailInvResult &&
      orderDetailInvResult?.orders &&
      orderDetailInvResult?.orders[0]?.items;

    if (eligibilityInfo && items && returnItemId) {
      const returnProductItems = items.filter(
        (item: { id: string }) =>
          parseInt(returnItemId, 10) === parseInt(item.id, 10)
      );
      const currentItemReturnEligibiliyDetails =
        returnEligibiliyDetails.items?.find(
          (item: { id: string }) =>
            parseInt(item.id, 10) === parseInt(returnItemId, 10)
        ) || {};

      setCurrentReturnItem({
        item: {
          ...returnProductItems[0],
          ...currentItemReturnEligibiliyDetails,
        },
      });
      dispatch(
        setCurrentreturnItem({
          ...returnProductItems[0],
          ...currentItemReturnEligibiliyDetails,
        })
      );
    }
  }, [orderDetailInvResult, eligibilityInfo, dispatch, returnItemId, returnEligibiliyDetails.items]);

  const getRefundMethods = () => {
    const { chooseRefundMode: modeOfRefund } = returnConfig;
    let customerWallet = true;
    let renderRefundMethods = "";
    returnEligibiliyDetails?.items?.forEach(
      (item: { id: string; refundMethods: any[] }) => {
        if (parseInt(item.id, 10) === parseInt(returnItemId as string, 10)) {
          renderRefundMethods = item?.refundMethods.reduce(
            (memo: any[], method: { name: any; enabled: any }) => {
              const { name, enabled } = method;
              const refundMethod = modeOfRefund[name]
                ? { ...modeOfRefund[name] }
                : null;
              if (refundMethod) {
                refundMethod.id = name;
                if (!refundMethod.error) refundMethod.error = {};
                refundMethod.error.status = !enabled;
                memo.push(refundMethod);
                if (refundMethod.error.status === false) customerWallet = false;
              }
              return memo;
            },
            []
          );
        }
      }
    );
    setCustomerWallet(customerWallet);
    setRefundMethods(renderRefundMethods);
  };

  const getExchangeMethods = () => {
    const { powerRequired, thumbnail } = currentReturnItem?.item || {};
    let isPowerItem;
    if (powerRequired && powerRequired === "POWER_SUBMITTED") {
      isPowerItem = true;
    }
    const returnActionsDetail = returnEligibiliyDetails?.items?.find(
      (item: { id: string }) =>
        parseInt(item.id, 10) === parseInt(returnItemId as string, 10)
    );
    const { exchangeMethods = [] } =
      returnActionsDetail?.exchangeMethods?.length > 0
        ? returnActionsDetail
        : currentReturnItem?.item;
    let { chooseExchangeMode: modeOfExchange } = returnConfig;
    modeOfExchange =
      (modeOfExchange && modeOfExchange[isPowerItem ? "power" : "nonpower"]) ||
      {};
    const configExchangeMethods = exchangeMethods.reduce(
      (memo: any[], method: { name: any; enabled: any }) => {
        const { name, enabled } = method;
        const exchangeMethod = modeOfExchange[name]
          ? { ...modeOfExchange[name] }
          : null;
        if (exchangeMethod) {
          exchangeMethod.id = name;
          if (name === "SAMEPRODUCT") {
            exchangeMethod.image = thumbnail;
          }
          exchangeMethod.subText = { ...exchangeMethod.subText };
          if (!exchangeMethod.error) exchangeMethod.error = {};
          // if (
          //   (exchangeMethod.subText && exchangeMethod.subText.contents) ||
          //   exchangeMethod.title
          // ) {
          //   const { options, brandName, lensCategory } = item;
          //   let { lensType } = item;
          //   lensType = lensType.toLowerCase();
          //   let lensPackage: any;
          //   let coating: any;
          //   let type;
          //   for (let i = 0, len = options.length; i < len; i++) {
          //     type = options[i].type && options[i].type.toLowerCase();
          //     if (packageTypes.includes(type)) {
          //       lensPackage = options[i].name;
          //     } else if (type === "coating") {
          //       coating = options[i].name;
          //     }
          //   }
          //   const vision =
          //     lensType !== "NORMAL" ? lensType.replace("_", " ") : "";
          //   if (exchangeMethod.title) {
          //     exchangeMethod.title = exchangeMethod.title.replace(
          //       "<type>",
          //       lensCategory.toLowerCase() || ""
          //     );
          //   }
          //   if (exchangeMethod.subText && exchangeMethod.subText.contents) {
          //     exchangeMethod.subText.contents =
          //       exchangeMethod.subText.contents.map((content: string) => {
          //         return content
          //           .replace("<brand>", brandName || "")
          //           .replace("<coating>", (coating && ` + ${coating}`) || "")
          //           .replace(
          //             "<lensPackage>",
          //             (lensPackage && ` + ${lensPackage}`) || ""
          //           )
          //           .replace("<vision>", vision || "")
          //           .replace("<type>", lensCategory.toLowerCase() || "");
          //       });
          //   }
          // }
          exchangeMethod.error.status = !enabled;
          memo.push(exchangeMethod);
        }
        return memo;
      },
      []
    );
    setExchangeMethods(configExchangeMethods);
  };

  useEffect(() => {
    // if (isExchange) setIsExchange(false);
    if (
      ((returnEligibiliyDetails && returnEligibiliyDetails.items) ||
        currentReturnItem?.item.exchangeMethods) &&
      returnConfig &&
      currentReturnItem
    ) {
      getExchangeMethods();
    }
    if (returnEligibiliyDetails && returnEligibiliyDetails.items) {
      getRefundMethods();
    }
    if (currentReturnItem) updateRenderModes();
  }, [currentReturnItem, returnEligibiliyDetails]);

  const getSummary = () => {
    if (exchangeOpted === "SAMEPRODUCT") {
      return localeData.SAME_FRAME_SAME_LENS;
    } else if (exchangeOpted === "NEWPRODUCT") {
      return localeData.DIFFERENT_FRAME_DIFFERENT_LENS;
    } else {
      return localeData.SAME_FRAME_DIFFERENT_LENS;
    }
  };

  return (
    <LeftOuterMost>
      <LeftRoot style={{ marginBottom: 0 }}>
        <HeaderLeft
          background={
            isExpandable !== localeData.EXCHANGE_OR_REFUND ? false : true
          }
        >
          <HeaderText>3. {localeData.WHAT_WOULD_YOU_LIKE_TO_DO}</HeaderText>
          {isExpandable !== localeData.EXCHANGE_OR_REFUND ? (
            <ChangeButton
              onClick={() => setIsExpandable(localeData.EXCHANGE_OR_REFUND)}
            >
              {/* {configData.CHANGE} */}
              CHANGE
            </ChangeButton>
          ) : null}
        </HeaderLeft>
      </LeftRoot>
      {/* {isExpandable === localeData.EXCHANGE_OR_REFUND ? ( */}
        <ReturnOptionType
          customerWallet="customerWallet"
          modeOfRefund={refundMethods}
          modes={exchangeMethods}
          returnMethodsUpdated={returnMethodsUpdated}
          configData={localeData}
          redisData={configData}
          setIsExpandable={setIsExpandable}
          setExchangeOpted={setExchangeOpted}
          setReturnStepInfo={setReturnStepInfo}
          singleItemDetail={
            returnEligibiliyDetails &&
            returnEligibiliyDetails.items &&
            returnEligibiliyDetails.items[0]
          }
        />
      {/* ) : (
        <SummaryOuterMarNeg>
          <span>{localeData.EXCHANGE}: </span>{" "}
          <Lightcolor>{getSummary()}</Lightcolor>
        </SummaryOuterMarNeg>
      )} */}
    </LeftOuterMost>
  );
}
