import { getNearByStore } from "@/redux/slices/orderInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { Checkout } from "@lk/ui-library";
import { Button } from "@lk/ui-library";
import { Icons } from "@lk/ui-library";
import { getCookie } from "@/helpers/defaultHeaders";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

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
  margin-left: 30px;
  flex-direction: row;
  border-bottom: 1px solid #ebebeb;
`;
const ButtonPosition = styled.div`
  position: sticky;
  text-align: center;
  bottom: 15px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const Textinput = styled.input`
  width: 80%;
  padding: 7px;
  outline: none;
  border: 1px solid #999999;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 10px;
  user-select: initial;
	&::before, &::after {
    	user-select: initial;
	}
`;

export default function StoreSideBar({
  stores,
  onClick,
  closeSidebar,
  localeData,
}: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [inputPinCode, setInputPinCode] = useState("");
  const { country } = useSelector((state: RootState) => state.pageInfo);
  const [selectedStore, setselectedStore] = useState({
    code: "-1",
  });

  const handleSelect = (store: any) => {
    setselectedStore(store);
  };

  const search = (event: any) => {
    if (event.keyCode === 13) {
      // console.log("enter hit");
      dispatch(
        getNearByStore({
          address: Number(inputPinCode),
          radius: 20,
          pageSize: 10,
          pageNumber: 0,
          sessionId: `${getCookie(`clientV1_${country}`)}`,
        })
      );
    }
  };

  return (
    <Root>
      <Header>
        <Heading>{localeData.SELECT_NEARBY_STORE}</Heading>
        <Icons.Cross onClick={() => closeSidebar()} />
      </Header>
      <SubHead>{localeData.PICK_A_NEARBY_STORE}</SubHead>
      <Textinput
        type="text"
        onChange={(e) => setInputPinCode(e.target.value)}
        onKeyDown={(event) => search(event)}
      />
      {/* <Heading>Saved Address</Heading> */}
      {stores && stores.length ? (
        <SubHead>
          {stores.length} {localeData.NEARBY_STORES_FOUND}
        </SubHead>
      ) : (
        <SubHead>{localeData.NO_STORES_FOUND_AT_THIS_LOCATION}</SubHead>
      )}
      {stores &&
        stores.map((store: any) => {
          return (
            <Container key={store?.code}>
              <input
                checked={store?.code === selectedStore?.code}
                className="color-theme-blue"
                // id={`radio${userAddress?.id}`}
                name="storeDetail"
                style={{ cursor: "pointer" }}
                type="radio"
                onChange={() => {
                  handleSelect(store);
                }}
              />
              <Checkout.StoreAddress
                storeInfo={store}
                configData={localeData}
              />
            </Container>
          );
        })}
      {selectedStore.code !== "-1" && (
        <ButtonPosition>
          {" "}
          <Button text="Proceed" onClick={() => {}} />
        </ButtonPosition>
      )}
    </Root>
  );
}
