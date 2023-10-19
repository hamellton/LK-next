import { RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import Router from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { NotFound } from "@lk/ui-library";
import styled from "styled-components";

const NotFoundRoot = styled.div`
  margin: auto;
  padding-top: 80px;
`;

interface ErrorCart {
  config: DataType;
}

export default function ErrorCart({ config }: ErrorCart) {
  const { cartErrorMessage, cartStatusCode } = useSelector(
    (state: RootState) => state.cartInfo
  );

  const link = () => {
    Router.push("/");
  };

  return (
    <NotFoundRoot>
      <NotFound
        dataLocale={config}
        cartErrorMessage={cartErrorMessage}
        cartStatusCode={cartStatusCode}
        link={link}
      />
    </NotFoundRoot>
  );
}
