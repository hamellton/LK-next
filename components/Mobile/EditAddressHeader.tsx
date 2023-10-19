import React from "react";
import styled from "styled-components";
import { Icons } from "@lk/ui-library";
import { DataType } from "@/types/coreTypes";

const HeaderPanel = styled.div`
  box-shadow: 0 2px 2px 0 rgb(148 150 159 / 30%);
  background-color: #fff;
  width: 100vw;
  display: flex;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;
  justify-content: space-between;
  padding: 20px 10px;
  align-items: center;
`;

const EditAddressHeader = ({
  setEditAddress,
  localeData,
}: {
  setEditAddress: (props: boolean) => void;
  localeData: DataType;
}) => {
  return (
    <div>
      <HeaderPanel>
        <h2>{localeData.WHERE_WOULD_YOU_LIKE_US_TO_DELIVER}</h2>
        <span onClick={() => setEditAddress(false)}>
          <Icons.Cross />
        </span>
      </HeaderPanel>
    </div>
  );
};

export default EditAddressHeader;
