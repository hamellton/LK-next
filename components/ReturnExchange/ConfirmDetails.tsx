import { RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import { HeaderType } from "@/types/state/headerDataType";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReturnItemCard, PrimaryButton, SelectStoreCard } from "@lk/ui-library";
import { getCurrency } from "helpers/utils";
import {
  ConfirmDetailHeader,
  ConfirmDetailRoot,
  ExchangeBtnWrapper,
  ExchangeInfo,
  ExchangeInfoPara,
  FlexBox,
  Img,
  SourceInfo,
  SourceQues,
  SourceText,
  StoreContainer,
  StoreContainerHeader,
  StoreContainerHeaderLeft,
  StoreContainerHeaderRight,
} from "./styles";
import {
  ComponentSizeENUM,
  ThemeENUM,
  TypographyENUM,
} from "@/types/baseTypes";
import sessionStorageHelper from "helpers/sessionStorageHelper";

interface ReturnPageType {
  orderId: number;
  classification: string;
  sessionId: string;
  userData: DataType;
  headerData: HeaderType;
  localeData: DataType;
  configData: DataType;
  itemId: string;
}
export default function ConfirmDetails({
  orderId,
  itemId,
  classification,
  sessionId,
  userData,
  headerData,
  localeData,
  configData,
}: ReturnPageType) {
  const [store, setStore] = useState(null);

  const { orderDetailInvResult, storeList, returnMethods } = useSelector(
    (state: RootState) => state.orderInfo
  );
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const currentOrder = orderDetailInvResult?.orders?.[0];
  const currentItem = currentOrder?.items?.find(
    (it: DataType) => it?.id === parseInt(itemId)
  );
  const router = useRouter();
  const {
    productId,
    brandName,
    thumbnail,
    frameColour,
    frameType,
    frameShape,
    frameSize,
    options,
    amount,
    price,
  } = currentItem || {};

  const packageTypes = [
    "zero_power",
    "single_vision",
    "bifocal",
    "tinted_sv",
    "contact_lens",
    "sunglasses",
  ];

  useEffect(() => {
    setStore(sessionStorageHelper.getItem("returnStore"));
  }, []);

  return (
    <ConfirmDetailRoot>
      <ConfirmDetailHeader>Product to Return</ConfirmDetailHeader>
      <ReturnItemCard
        thumbnail={thumbnail}
        itemId={itemId}
        productId={productId}
        // image={image}
        frameColour={frameColour}
        frameType={frameType}
        frameShape={frameShape}
        frameSize={frameSize}
        lensPackage={
          (Array.isArray(options) &&
            [...options]
              ?.reverse()
              ?.find((op) => packageTypes?.includes(op?.type?.toLowerCase()))
              ?.name) ||
          ""
        }
        productName={brandName}
        packageText="Xyz"
        currencySymbol={getCurrency(pageInfo.country)}
        price={amount?.total || price?.value}
        // heading="Product to Return"
        // prescription={prescription}
        exchangeOrRefund={true}
        border={false}
      />
      <SourceInfo>
        <SourceQues>How are you sending product back to lenskart</SourceQues>
        <SourceText>Visit Nearby Store</SourceText>
      </SourceInfo>

      {store && (
        <StoreContainer>
          <StoreContainerHeader>
            <StoreContainerHeaderLeft>Store Address</StoreContainerHeaderLeft>
            <StoreContainerHeaderRight
              onClick={() => {
                router.push(
                  `/sales/my/order/return/store-return/${orderId}/${itemId}`
                );
              }}
            >
              Change
            </StoreContainerHeaderRight>
          </StoreContainerHeader>
          <SelectStoreCard store={store} />
        </StoreContainer>
      )}

      <ExchangeInfo>
        <SourceText>Exchange / Refund Details</SourceText>
        <FlexBox>
          <Img
            alt="rupees"
            src="https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg"
            width="12%"
          />
          <ExchangeInfoPara>
            Once you visit Lenskart Store, we will inspect the product and if
            accepted you can exchange with a new product at store or take refund
            as per policy
          </ExchangeInfoPara>
        </FlexBox>
      </ExchangeInfo>

      <ExchangeBtnWrapper>
        <PrimaryButton
          onBtnClick={() => console.log("clicked")}
          theme={ThemeENUM.primary}
          font={TypographyENUM.lkSansBold}
          componentSize={ComponentSizeENUM.medium}
          id="btn-continue"
          width="100%"
          height="40px"
          primaryText={"confirm Details"}
        />
      </ExchangeBtnWrapper>
    </ConfirmDetailRoot>
  );
}
