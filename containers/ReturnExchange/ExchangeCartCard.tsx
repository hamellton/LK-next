import { DataType, TypographyENUM } from "@/types/coreTypes";
import React from "react";
import styled from "styled-components";

const ProductStylesContainer = styled.div<{ new: boolean }>`
  .new-product-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background-color: #ffffff;
    background: #ffffff;
    -webkit-box-shadow: 0px 0px 8px rgb(0 0 0 / 10%);
    box-shadow: 0px 0px 8px rgb(0 0 0 / 10%);
    border-radius: 12px;
    padding: 16px;
    gap: 16px;
  }
  .amount-diff-content {
    display: flex;
    flex-direction: column;
    .diff-amount {
      font-family: ${TypographyENUM.lkSansBold};
      font-style: normal;
      /* font-weight: 700; */
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.02em;
      color: #000042;
    }
    .diff-amount-text {
      font-family: ${TypographyENUM.lkSansRegular};
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: -0.02em;
      color: #333368;
    }
  }
  .new-amount-difference-section {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    gap: 10px;
  }
  .zero-amount-diff {
    font-family: "LenskartSans-Regular";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: -0.02em;
    color: #000042;
  }
  .exchange-item-sep {
    border: 1px solid #e2e2ee;
    height: 0px;
  }
  .item-sep-return-flow {
    width: 100%;
    margin: 0;
    border-bottom: 1px dashed #cecedf;
    border-top: none;
    border-right: none;
    border-left: none;
    overflow: hidden;
  }
  .new-products-difference-section {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    gap: 20px;
  }
  .return-item-product-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    gap: 20px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .return-item-product-image {
    height: 45px;
    display: block;
    img {
      max-width: 100px;
    }
  }
  .return-item-description {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    gap: 2px;
  }
  .return-product-tag {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    padding: 4px 6px;
    width: 34px;
    height: 20px;
    border-radius: 4px;
    font-family: "LenskartSans-Bold";
    font-style: normal;
    font-weight: 700;
    font-size: 9px;
    line-height: 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #333368;
    background: ${(props) => (props.new ? "#BEF5E5" : "#F5F5FF;")};
  }
  .description-name {
    font-family: "LenskartSans-Bold";
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: -0.02em;
    color: #000042;
  }
  .item-sub-content {
    font-family: "LenskartSans-Regular";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: -0.02em;
    color: #333368;
    opacity: 0.6;
  }
  .text-capitalize {
    text-transform: capitalize;
  }
`;

const ExchangeCartCard = ({
  cartTotalAmount,
  currencySymbol,
  dataLocale,
}: {
  cartTotalAmount: number;
  currencySymbol: string;
  dataLocale: DataType;
}) => {
  const { TO_BE_PAID } = dataLocale;
  return (
    <ProductStylesContainer new>
      <div className="new-product-container">
        <div className="new-amount-difference-section">
          {cartTotalAmount && cartTotalAmount !== 0 ? (
            <>
              <div className="amount-diff-image">
                <img
                  alt="rupees"
                  src="https://static.lenskart.com/media/desktop/img/DesignStudioIcons/MoneyGold.svg"
                />
              </div>
              <div className="amount-diff-content">
                <div className="diff-amount">
                  <span>{currencySymbol}</span>
                  {cartTotalAmount} {TO_BE_PAID}
                </div>
                <div className="diff-amount-text">
                  Price difference between old &amp; new product
                </div>
              </div>
            </>
          ) : (
            <div className="zero-amount-diff">
              You dont need to pay anything for this Exchange
            </div>
          )}
        </div>
        <div className="exchange-item-sep"></div>
        <div className="new-products-difference-section">
          <div>
            <div className="return-item-product-container">
              <div className="return-item-product-image">
                <img
                  alt="product-img"
                  src="https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/628x301/9df78eab33525d08d6e5fb8d27136e95//v/i/vincent-chase-vc-e11259-c1-eyeglasses_vincent-chase-vc-e11259-c1-eyeglasses_g_0232_4.jpg"
                />
              </div>
              <div className="return-item-description">
                <div className="return-product-tag product_old">old</div>
                <div className="description-name">Vincent Chase</div>
                <div>
                  <div className="item-sub-content">Size: Narrow</div>
                </div>
                <div className="item-sub-content">
                  Black Round<span className="text-capitalize"> full rim</span>
                </div>
                <div className="item-sub-content">
                  with Hydrophobic Anti-Glare
                </div>
              </div>
            </div>
          </div>
          <div className="item-sep-return-flow"></div>
          <div className="exchange-product-item">
            <div className="return-item-product-container">
              <div className="return-item-product-image">
                <img
                  alt="product-img"
                  src="https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/628x301/9df78eab33525d08d6e5fb8d27136e95//v/i/vincent-chase-vc-e11259-c1-eyeglasses_vincent-chase-vc-e11259-c1-eyeglasses_g_0232_4.jpg"
                />
              </div>
              <div className="return-item-description">
                <div className="return-product-tag product_new">new</div>
                <div className="description-name">Vincent Chase</div>
                <div>
                  <div className="item-sub-content">Size: Narrow</div>
                </div>
                <div className="item-sub-content">
                  Black Round<span className="text-capitalize"> full rim</span>
                </div>
                <div className="item-sub-content">
                  with Hydrophobic Anti-Glare
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProductStylesContainer>
  );
};

export default ExchangeCartCard;
