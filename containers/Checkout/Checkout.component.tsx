import { TypographyENUM } from "@/types/coreTypes";
import { Icons } from "@lk/ui-library";
import { Breadcrumbs } from "@lk/ui-library";
import React from "react";
import styled from "styled-components";
import { BreadcrumbType, CheckoutContainerTypes } from "./Checkout.types";

const BreadCrumbsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 40px 0;
  top: 30px;
`;
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  padding: 0px;
`;
const BreadcrumbText = styled.h4<{ disabled: boolean; isActive: boolean }>`
  font-family: ${(props) =>
    props.isActive ? TypographyENUM.lkSansBold : TypographyENUM.lkSansRegular};
  font-style: normal;
  /* font-weight: ${(props) => (props.isActive ? 700 : 400)}; */
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: ${(props) => (!props.isActive ? "#66668E" : "#000042")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
const BreadcrumbArrow = styled(Icons.IconRight)<{ isRTL: boolean }>`
  margin: 0 24px;
  height: 10px;
`;

const ArrowContainer = styled.span<{ isRTL: boolean }>`
  ${(props) => (props.isRTL ? "transform: rotate(180deg)" : "")};
`;

const BreadCrumb = ({
  id,
  text,
  onClick,
  disabled,
  isArrow,
  isActive,
  isRTL,
}: BreadcrumbType) => {
  return (
    <Breadcrumb id={id}>
      <BreadcrumbText
        disabled={disabled}
        isActive={isActive}
        onClick={!disabled ? onClick : () => null}
      >
        {text}
      </BreadcrumbText>
      {isArrow && (
        <ArrowContainer isRTL={isRTL}>
          <BreadcrumbArrow />
        </ArrowContainer>
      )}
    </Breadcrumb>
  );
};
const CheckoutBase = ({
  isRTL = false,
  activeBreadcrumbId,
  breadcrumbData,
  children,
}: CheckoutContainerTypes) => {
  return (
    <>
      <BreadCrumbsContainer>
        {breadcrumbData.map((b, i) => (
          <BreadCrumb
            key={b.id}
            text={b.text}
            onClick={b.onClick}
            disabled={b.disabled}
            isArrow={i !== breadcrumbData.length - 1}
            id={b.id}
            isActive={b.id === activeBreadcrumbId}
            isRTL={isRTL}
          />
        ))}
      </BreadCrumbsContainer>
      {children}
    </>
  );
};

export default CheckoutBase;
