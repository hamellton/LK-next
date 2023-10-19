import { TypographyENUM } from "@/types/baseTypes";
import { Checkout } from "@lk/ui-library";
import { Icons } from "@lk/ui-library";
import React, { useState } from "react";
import styled from "styled-components";

export default function SideBar({
  userInfo,
  onClick,
  closeSidebar,
  localeData,
}: any) {
  const Root = styled.div`
    margin: 25px;
  `;
  const Header = styled.div`
    display: flex;
    justify-content: space-between;
  `;
  const Heading = styled.div`
    font-weight: 500;
    font-size: 20px;
  `;
  const SubHead = styled.div`
    color: #999999;
    font-size: 14px;
    font-weight: 400;
    margin-top: 2px;
    margin-bottom: 6px;
  `;
  const Container = styled.div`
    display: flex;
    flex-direction: row;
  `;
  const Saved = styled.div`
    font-size: 15px;
    margin-bottom: 10px;
    margin-top: 15px;
    color: rgba(60, 60, 60, 0.54);
    font-weight: 800;
  `;

  const AddNew = styled.div`
    margin: 22px;
    font-size: 13px;
    color: #00b9c6;
  `;

  const FontSpan = styled.span`
    font-size: 20px;
  `;

  const [selectedAddressIndex, setSelectedAddressIndex] = useState({ id: -1 });
  const handleSelect = (userAddress: any) => {
    setSelectedAddressIndex(userAddress);
  };
  return (
    <Root>
      <Header>
        <Heading>{localeData.SELECT_PICKUP_ADDRESS}</Heading>
        <Icons.Cross onClick={() => closeSidebar()} />
      </Header>
      <SubHead>{localeData.ADD_OR_SELECT_ADDRESS}</SubHead>
      <Saved>{localeData.SAVED_ADDRESS}</Saved>
      <AddNew>
        <FontSpan>+</FontSpan> {localeData.ADD_NEW_ADDRESS}
      </AddNew>
      {userInfo &&
        Object.keys(userInfo).length &&
        userInfo.map((userAddress: any) => {
          return (
            <Container key={userAddress.id}>
              <input
                checked={userAddress?.id === selectedAddressIndex?.id}
                className="color-theme-blue"
                id={`radio${userAddress?.id}`}
                name="address"
                style={{ cursor: "pointer" }}
                type="radio"
                onChange={() => {
                  handleSelect(userAddress);
                }}
              />
              <Checkout.NewAddressTab
                userInfo={userAddress}
                selectedAddressIndex={selectedAddressIndex}
                onClick={() => onClick(userAddress)}
                onEdit={() => {}}
                onDelete={() => {}}
                font={TypographyENUM.sans}
              />
            </Container>
          );
        })}
    </Root>
  );
}
