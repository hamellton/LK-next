import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Container = styled.div`
  width: 18%;
  position: fixed;
  background: white;
  left: 40%;
  bottom: -500px;
  border-radius: 4px 4px 0 0;
  -webkit-transition: 0.7s all;
  transition: 0.7s all;
  bottom: 0px;
  z-index: 999;
  animation: slide-up 0.7s ease;
`;

const HeaderBox = styled.div`
  background: #333;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
`;
const A = styled.a`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;

const Wishlist = styled.div`
  position: relative;
  overflow: auto;
  -webkit-box-shadow: 0 0 3px #888;
  box-shadow: 0 0 3px #888;
  max-height: 225px;
  overflow-y: auto;
`;
const Product = styled.div`
  padding: 10px 0px;
  position: relative;
  border-bottom: 1px solid #eee;
`;
const Cross = styled.span`
  background-position: -1200px -60px;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 0;
  border-radius: 0;
  display: block;
`;
const Info = styled.a`
  color: #329c92;
  text-decoration: none;
  cursor: pointer;
  width: 100%;
`;
const ImageBox = styled.div`
  display: inline-block;
  width: 30%;
  vertical-align: bottom;
  text-align: center;
  line-height: 35px;
`;
const RightBox = styled.div`
  display: inline-block;

  width: 70%;
`;
const BrandName = styled.h5`
  margin-top: 0px;
  margin-bottom: 2px;
  font-family: 'LKFuturaStd-Medium';
  font-weight: 400 !important;
`;
const Price = styled.span`
  color: #000;
`;

const ViewAll = styled.div`
  background: #eee;
  overflow: hidden;
  padding: 15px;
  cursor: pointer;
  -webkit-box-shadow: 0 0 3px #888;
  box-shadow: 0 0 3px #888;
  position: relative;
`;

const Clear = styled.a`
  background: #329c92;
  padding: 3px 10px 3px 10px;
  font-size: 14px;
  color: #fff;
  float: left;
  text-shadow: none;
  border-radius: 5px;
  text-transform: uppercase;
`;

const Img = styled.img`
  width: 100%;
  padding-left: 2px;
`;

interface Shortlist {
  setShowShortList: (props: any) => void;
  deleteSingleWishlist: (props: any) => void;
  deleteAllWishList: () => void;
  showShortlist: boolean;
}

export default function Shortlist({
  setShowShortList,
  deleteSingleWishlist,
  deleteAllWishList,
  showShortlist,
}: Shortlist) {
  const { productList } = useSelector((state: RootState) => state.wishListInfo);

  return (
    <Container>
      <HeaderBox onClick={() => setShowShortList(false)}>
        <A>PRODUCTS ({productList.length})</A>
      </HeaderBox>
      <Wishlist>
        {productList.length &&
          productList.map((product: any) => {
            return (
              <div key={product.id}>
                <Product>
                  <Cross
                    onClick={() => deleteSingleWishlist(Number(product.id))}
                  >
                    X
                  </Cross>
                  <Info>
                    <ImageBox>
                      <Img src={product.productImageUrl} alt="logo" />
                    </ImageBox>
                    <RightBox>
                      <BrandName>{product.brandName}</BrandName>
                      <Price>
                        {product.prices.symbol} {product.prices.lkPrice}
                      </Price>
                    </RightBox>
                  </Info>
                </Product>
              </div>
            );
          })}
      </Wishlist>
      <ViewAll>
        <Clear onClick={deleteAllWishList}>Clear List</Clear>
      </ViewAll>
    </Container>
  );
}
