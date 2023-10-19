import styled from "styled-components";

export const DeliveryDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  margin: 10px 0;
  padding: 10px 10px 5px 10px;
  background-color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
`;

export const DeliveryDetailsContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Text = styled.span<{
  type?: string;
  link?: boolean;
  size?: string;
}>`
  font-size: ${({ size }) => size ?? "var(--fs-12)"};
  font-weight: ${(props) =>
    props.type !== "regular" ? "var(--fw-medium)" : "400"};
  color: ${(props) => (props.link ? "#18cfa8" : "")};
  &.deliveryDetails {
    font-weight: 600;
  }
`;

export const DeliveryDetails = styled.div`
  font-family: roboto, sans-serif, arial, helvetica, sans-serif;
  strong {
    font-weight: 500;
  }
`;
