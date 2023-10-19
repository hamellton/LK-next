import React from "react";

import styled from "styled-components";
import { TypographyENUM } from "@/types/baseTypes";
import { PowerButtonMobile } from "./PowerButtonMobile";

import { Button, Icons } from "@lk/ui-library";
import { ButtonContent } from "pageStyles/CartStyles";
import Router from "next/router";
import { memo } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { IconWrapper } from "./styles";

export const List = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  overflow: auto;

  margin-bottom: 20px;
  h2 {
    margin-bottom: 20px;
    font-size: 14px;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: flex;
    margin-bottom: 10px;
    background-color: white;
    padding: 10px;
  }

  img {
    flex-basis: 48vw;
    min-width: 48vw;
    margin-right: 16px;
    object-fit: contain;
  }

  h3 {
    margin: 0 0 5px 0;
    font-size: 14px;
    color: #18cfa8;
    font-weight: 400;
  }

  p {
    margin: 0;
    font-size: 14px;
    margin-bottom: 4px;
  }
  #payment-redirect-button {
    margin-bottom: 20px;
    div {
      div {
        display: flex;
      }
    }
  }
`;

export interface List {
  id: number;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export interface PostPaymentItemsListTypes {
  items: List[];
}
const PostPaymentItemsList = ({
  items,
  onPdClick,
  onAddPowerClick,
  dataLocale,
  orderList,
  isLogin,
}: any) => {
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const redirectURL = process.env.NEXT_PUBLIC_BASE_ROUTE === 'NA' ? '/' : `/${process.env.NEXT_PUBLIC_BASE_ROUTE}/`

  return (
    <List>
      <h2>{dataLocale.ITEMS_POST}</h2>
      <ul>
        {items?.map((item: any, idx: any) => (
          <>
            {(item.powerRequired === "POWER_REQUIRED" ||
              item.powerRequired === "POWER_SUBMITTED") && (
              <li key={idx}>
                <img src={item.image} alt={item.brandName} />
                <div>
                  <h3>{item.brandName}</h3>
                  <p>
                    {dataLocale.SHAPE_POST}: {item.frameShape}
                  </p>
                  <p>
                    {dataLocale.SIZE_POST}: {item.frameSize}
                  </p>
                  <p>
                    {dataLocale.PRODUCT_ID_POST}: {item.id}
                  </p>
                  <p>
                    {dataLocale.COLOR_POST}: {item.frameColour}
                  </p>
                  <p>
                    {dataLocale.QUANTITY_POST}: {item.quantity}
                  </p>
                  <PowerButtonMobile
                    onPdClick={() => onPdClick?.({ orderList, item })}
                    onAddPowerClick={() =>
                      onAddPowerClick?.({ orderList, item })
                    }
                    dataLocale={dataLocale}
                    mobileView={true}
                    item={item}
                  ></PowerButtonMobile>
                </div>
              </li>
            )}
          </>
        ))}
      </ul>

      <Button
        id="payment-redirect-button"
        showChildren={true}
        width="100"
        font={TypographyENUM.lkSansBold}
        onClick={() => {
          isLogin
            ? (window.location.href = orderList?.id
                ? `${redirectURL}sales/order/history/order-detail/${orderList?.id}`
                : `${redirectURL}sales/order/history`)
            : Router.push("/");
        }}
        hoverShadow={true}
        isRTL={isRTL}
      >
        <ButtonContent styledFont={TypographyENUM.lkSansBold}>
          {isLogin ? dataLocale.BACK_TO_ORDERS : dataLocale.CONTINUE_SHOPPING}{" "}
          <IconWrapper isRTL={isRTL}>
            <Icons.IconRight />
          </IconWrapper>
        </ButtonContent>
      </Button>
    </List>
  );
};

export default memo(PostPaymentItemsList);
