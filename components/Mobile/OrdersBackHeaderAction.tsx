import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Container = styled.div<{
  padding?: string;
  borderBottom?: string;
  margin?: string;
}>`
  padding: ${(props) => props.padding || "12px 10px 10px 10px"};
  border-bottom: ${(props) => props.borderBottom || "1px solid #c4c1c1"};
  background: #fff;
  display: flex;
  align-items: center;
  font-family: var(--font-lksans-medium);
  h1 {
    font-size: 12px;
    margin: ${(props) => props.margin || "0 11px"};
    text-transform: uppercase;
    color: #333333;
    font-weight: normal;
  }
`;
const CircularBack = styled.span<{ isRTL?: boolean }>`
  background-color: #18cfa8;
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: 25px;
  transform: scaleX(${(props) => (props.isRTL ? -1 : 1)});
  font-size: 17px;
  padding-bottom: 4px;
  // margin-left: -8px;
`;

const OrdersBackHeaderAction = ({
  onBackClick,
  text,
  padding,
  borderBottom,
  margin,
}: {
  onBackClick: () => void;
  text: string;
  padding?: string;
  borderBottom?: string;
  margin?: string;
}) => {
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  return (
    <Container padding={padding} borderBottom={borderBottom} margin={margin}>
      <CircularBack onClick={onBackClick} isRTL={pageInfo.isRTL}>
        &#8592;
      </CircularBack>
      <h1>{text}</h1>
    </Container>
  );
};

export default OrdersBackHeaderAction;
