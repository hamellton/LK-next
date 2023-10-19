import { Icons } from "@lk/ui-library";
import { Image } from "./styles";
import React, { useState } from "react";
import { formatDate } from "./helper";
import ReturnProductDetails from "./ReturnProductDetails";
import {
  Body,
  BrandName,
  CardFooter,
  Div,
  Divmr,
  DoubleLeft,
  FontDiv,
  Free,
  Header,
  ImgOuter,
  LKDivider,
  Outer,
  OuterContainer,
  P,
  PadDiv,
  Price,
  ProductId,
  SelectTop,
  Texth4,
  TextTransform,
} from "./styles";

export default function Exchange({
  cartTotal = null,
  cartItem = null,
  items,
  selectedReasonComponent,
  returnItemId,
  returnEligibiliyDetails,
  localeData,
}: any) {
  const {
    options = [],
    productId,
    brandName,
    thumbnail,
    amount,
    productTypeValue,
    modelName,
    contactDisposableType,
    frameColour,
    frameShape,
    frameType,
  } = items || {};

  const [refundMethodRequest, setrefundMethodRequest] = useState(null);
  const [coating, setcoating] = useState(null);
  // const [price, setprice] = useState(0);
  const [retunConfirmPage, setretunConfirmPage] = useState(false);
  const [lensPackage, setlensPackage] = useState("");
  const [hidePrice, sethidePrice] = useState(null);
  const [exchangeItem, setexchangeItem] = useState(null);
  // let lensPackage = "Hydrophobic Anti-Glare";
  let price = 0;
  const currentItemreturnEligibility =
    returnEligibiliyDetails &&
    returnItemId &&
    returnEligibiliyDetails.items &&
    returnEligibiliyDetails.items?.find(
      (item: any) => parseInt(item.id, 10) === parseInt(returnItemId, 10)
    );
  const returnEligibleTillDate =
    currentItemreturnEligibility &&
    currentItemreturnEligibility.returnEligibleTillDate;
  let returnAllowedDate = "";
  const returnAllowedDateTs =
    returnEligibleTillDate && new Date(returnEligibleTillDate).getTime();
  returnAllowedDate =
    returnEligibleTillDate && formatDate(returnAllowedDateTs, "D MMM", "year");
  if (amount) {
    const { total, discounts } = amount;
    const paidPrice = discounts.reduce(
      (totalPrice: any, discount: { type: string; amount: any }) => {
        if (["sc", "exchange"].includes(discount.type)) {
          totalPrice += discount.amount;
          return totalPrice;
        }
        return null;
      },
      0
    );
    price = total + paidPrice;
  }

  const exchangedProduct = retunConfirmPage
    ? exchangeItem && exchangeItem[0]
    : cartItem && cartItem.items[0];

  const isNonZeroPayment = retunConfirmPage
    ? exchangeItem && (exchangeItem[0] as any).amount && (exchangeItem[0] as any).amount.total > 0
    : cartItem && cartItem.totals?.total > 0;

  return (
    <>
      {selectedReasonComponent ? (
        <>
          <SelectTop>
            <Image alt="PRODUCT_IMG" src={thumbnail} width="50%" />
            <Divmr>
              {brandName && <BrandName>{brandName}</BrandName>}
              {lensPackage && <ProductId>+ {lensPackage}</ProductId>}
              {!hidePrice && (
                <Price>
                  {localeData.CURRENCY_SYMBOL}{" "}
                  {(price && Math.round(price)) || 0}
                </Price>
              )}
            </Divmr>
          </SelectTop>
          <CardFooter leftMargin={true}>
            {localeData.ELIGIBLE_FOR_EXCHANGE_RETURN_TILL} {returnAllowedDate}
          </CardFooter>
        </>
      ) : (
        <OuterContainer>
          {!exchangedProduct && (
            <>
              <Header>
                <Texth4>
                  {refundMethodRequest !== null
                    ? localeData.PRODUCT_RETURNED
                    : localeData.PRODUCT_TO_RETURN_EXCHANGE}
                </Texth4>
              </Header>
              <Body>
                <ImgOuter>
                  <div>
                    <Image
                      alt="PRODUCT_IMG"
                      className="margin-t15"
                      src={thumbnail}
                      width="70%"
                    />
                  </div>
                </ImgOuter>
                <div
                  className={`fsp15 inline-block mr-b5${
                    hidePrice ? "" : " w70"
                  }`}
                >
                  {productId && <ProductId>{productId}</ProductId>}
                  {brandName && <BrandName>{brandName}</BrandName>}
                </div>
                {frameColour && frameShape && (
                  <ProductId>
                    {frameColour} {frameShape}
                    {frameType && (
                      <TextTransform>
                        {" "}
                        {frameType.replace("_", " ")}
                      </TextTransform>
                    )}
                  </ProductId>
                )}
                {lensPackage && <ProductId>+ {lensPackage}</ProductId>}
                {/* {coating && (
              <div key="coating" className="fs12 text-color-grey">
                + {coating}
              </div>
            )} */}
                {/* {productTypeValue !== "Eyeglasses" &&
              productTypeValue !== "Sunglasses" &&
              modelName && (
                <div className="fs12 text-color-grey">{modelName}</div>
              )}
            {productTypeValue === "Contact Lens" && contactDisposableType && (
              <div className="fs12 text-color-grey">
                {contactDisposableType}
              </div>
            )} */}
                {/* {children || ""} */}
                {!hidePrice && (
                  <Price>
                    {localeData.CURRENCY_SYMBOL}{" "}
                    {(price && Math.round(price)) || 0}
                  </Price>
                )}
              </Body>
            </>
          )}
          {exchangedProduct && (
            <>
              <Header>
                <Texth4>{localeData.PRODUCT_TO_EXCHANGE}</Texth4>
              </Header>
              {!isNonZeroPayment && (
                <PadDiv>
                  <Free>
                    <FontDiv>
                      <Icons.CheckCircleOutlineOutlined />
                    </FontDiv>
                    <Div>
                      <Texth4>{localeData.FREE}</Texth4>
                    </Div>
                  </Free>
                  <P>{localeData.NO_PRICE_DIFFERENCE}</P>
                </PadDiv>
              )}
              <Outer>
                <>
                  <DoubleLeft>
                    <ReturnProductDetails
                      item={items}
                      returnedProductPrice={price}
                      configTemp={localeData}
                    />
                  </DoubleLeft>
                  <LKDivider />
                  {/* <DividerImg>
                    <CardImg
                      alt="swap-circle"
                      src={SwapHorizontalCircleOutlined}
                    />
                  </DividerImg> */}
                  <DoubleLeft>
                    <div>
                      <ReturnProductDetails
                        exchangewith={true}
                        // dataLocale={dataLocale}
                        item={exchangedProduct}
                        returnedProductPrice={price}
                        configTemp={localeData}
                      />
                    </div>
                  </DoubleLeft>
                </>
              </Outer>
              {/* {isNonZeroPayment && (
                <div className="pd-b55 mr-t10 margin-l12 margin-r12">
                  <PaymentSummery
								exchange
								data={exchangedProduct}
								dataLocale={dataLocale}
								retunConfirmPage={retunConfirmPage}
								totals={exchangedProduct?.amount}
							/>
                </div>
              )} */}
            </>
          )}
        </OuterContainer>
      )}
    </>
  );
}
