import React, { useState } from "react";
import styled from "styled-components";
import { TypographyENUM } from "@/types/baseTypes";
import { DataType } from "@/types/coreTypes";

import { NewPayment } from "@lk/ui-library";
import { CardTypeENUM } from "./helpers";
import StoreCreditNew from "./StoreCreditNew";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export enum TextTypeENUM {
  password = "password",
  text = "text",
  number = "number",
}

const InlineLoader = styled.img`
  display: block;
  width: 80px;
  margin: 0 auto;
`;
export const InfoBox = styled.div<{ isError: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px 100px 4px 8px;
  gap: 10px;
  width: 100%;
  height: 31px;
  margin-bottom: 15px;
  background: ${(props) => (props.isError ? "#FFEBEA" : "#ECFBD3")};
  border: 1px solid ${(props) => (props.isError ? "#E34934" : "#60B527")};
  border-radius: 4px;
`;
export const InfoCircle = styled.div`
  border: 0.666667px solid #8d2d20;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  text-align: center;
  font-size: 10px;
`;
export const InfoText = styled.span<{ isError: boolean }>`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 9px;
  line-height: 12px;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => (props.isError ? "#8D2D20" : "#145607")};
`;
interface StoreCreditFormType {
  isOpen: boolean;
  data: { [name: string]: any };
  disabled?: boolean;
  cardType: CardTypeENUM;
  // onSubmit: (code: string, amount: string, isCheckout?: boolean) => Promise<DataType | undefined>,
  onSubmit: (...args: any) => Promise<DataType | undefined>;
  isRemainingAmount?: boolean;
  message?: string;
  isError?: boolean;
  loaderImage: string;
  appliedCredits?: any[];
  removeStoreCredit: (code: string) => Promise<DataType | undefined>;
  onCheckout: () => void;
  configData: DataType;
}
const StoreCreditHandler = ({
  data,
  disabled,
  cardType,
  isOpen = false,
  onSubmit,
  appliedCredits,
  removeStoreCredit,
  loaderImage,
  onCheckout,
  configData,
}: StoreCreditFormType) => {
  const [state, setState] = useState({
    message: "",
    isError: false,
    btnDisabled: false,
    btnText: "Apply",
    additionalText: "",
    isCheckoutBtn: false,
  });
  const [storeCreditOpen, setStoreCreditOpen] = useState(
    Boolean(appliedCredits?.length)
  );
  const cartInfo = useSelector((state: RootState) => state.cartInfo);

  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const isFullSc =
    cartInfo?.cartTotal &&
    Array.isArray(cartInfo?.cartTotal) &&
    cartInfo?.cartTotal?.find((ct) => ct.type === "total")?.amount === 0 &&
    appliedCredits?.length;

  const [couponAmount, setCouponAmount] = useState("");

  const [showLoader, setShowLoader] = useState(false);
  const [showTextField, setShowTextField] = useState(true);

  const [storeError, setStoreError] = useState("");

  async function removeAllStoreCredits() {
    const promiseArr =
      appliedCredits?.map((ac) => {
        return removeStoreCredit(ac.code);
      }) || [];
    return Promise.all(promiseArr)
      .then((res) => {
        // setStoreCreditOpen(false);
        let allCreditsRemoved = true;
        let errMsg = "";
        if (Array.isArray(res))
          res.forEach((d) => {
            if (d?.isError) {
              allCreditsRemoved = false;
              errMsg = d.message;
            }
          });
        // if(allCreditsRemoved) setStoreCreditOpen(false);
        // setShowLoader(false)
        return {
          isError: !allCreditsRemoved,
          message: allCreditsRemoved
            ? `Failed to remove all store credits`
            : "",
        };
      })
      .catch((err) => {
        return { isError: true, message: err.message };
        // console.log("Store the data in error object(if any) to cart, and show error", err.data, err.message)
      });
  }
  const storeCreditOpenHandler = () => {
    if (storeCreditOpen) {
      setShowLoader(true);
      removeAllStoreCredits()
        .then((res) => {
          if (res.isError) {
            setStoreError(res.message);
            setShowTextField(false);
            setStoreCreditOpen(true);
          } else {
            setStoreError("");
            setStoreCreditOpen(false);
          }
          setShowLoader(false);
        })
        .catch((err) => {
          console.log(err.message);
          setStoreError(err.message || "");
          setShowLoader(false);
          setShowTextField(false);
        });
    } else {
      setStoreCreditOpen(true);
    }
  };

  function submitHandler(code: string, amount: number) {
    setShowLoader(true);
    onSubmit(code, amount)
      .then((d) => {
        if (d?.isError) {
          setStoreError(d.message);
          // setShowTextField(false);
        } else {
          setStoreError("");
          // setShowTextField(false);
        }
        setShowLoader(false);
        // { message: error.message, isError: true, btnDisabled: true, btnText: "Apply", additionalText: "", isCheckoutBtn: false}
      })
      .catch((err) => {
        setStoreError(err.message || "");
        setShowLoader(false);
        // setShowTextField(false);
      });
  }
  function removeStoreCreditHandler(code: string) {
    setShowLoader(true);
    removeStoreCredit(code)
      .then((d) => {
        if (d?.isError) {
          setStoreError(d.message);
          setShowTextField(false);
        } else {
          setStoreError("");
          // setShowTextField(false);
        }
        setShowLoader(false);
        // { message: error.message, isError: true, btnDisabled: true, btnText: "Apply", additionalText: "", isCheckoutBtn: false}
      })
      .catch((err) => {
        setStoreError(err.message || "");
        setShowLoader(false);
        setShowTextField(false);
      });
  }

  return (
    <NewPayment.PaymentCardNew
      isRTL={isRTL}
      data={{
        ...data,
        isChildrenVisible: storeCreditOpen,
        onSelect: storeCreditOpenHandler,
        children: showLoader ? (
          <InlineLoader alt="Loading..." src={loaderImage} />
        ) : (
          <StoreCreditNew
            onSubmit={submitHandler}
            storeError={storeError}
            setStoreError={setStoreError}
            appliedCredits={appliedCredits}
            removeStoreCredit={removeStoreCreditHandler}
            isFullSc={Boolean(isFullSc)}
            onCheckout={onCheckout}
          />
        ),
      }}
      cardType={cardType}
      disabled={disabled}
      configData={configData}
    />
  );
};

export default StoreCreditHandler;
