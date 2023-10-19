import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";

const RadioContainer = styled.div<{ isSelected: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => (props.isSelected ? "#0FBD95" : "#5C5C86")};
  width: 20px;
  height: 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background: ${(props) => (props.isSelected ? "#D0FBF1" : "#FFFFFF")};
  border-radius: 10px;
`;
const RadioInnerCircle = styled.div<{
  isSelected: boolean;
  disabled?: boolean;
}>`
  background: #0b8e6f;
  display: ${(props) => (props.isSelected ? "block" : "none")};
  width: 8px;
  height: 8px;
  border-radius: 50%;
`;

const AnimatedRadioContainer = animated(RadioContainer);

const AnimatedRadioInnerCircle = animated(RadioInnerCircle);

const Radio = ({
  isSelected = false,
  onClick = () => null,
  disabled,
}: {
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const [styles, api] = useSpring(() => ({
    border: "1px solid #5C5C86",
    background: "#FFFFFF",
    opacity: "0",
  }));

  useEffect(() => {
    if (isSelected) {
      api({
        border: "1px solid #0FBD95",
        background: "#D0FBF1",
        opacity: "1",
      });
    } else {
      api({
        border: "1px solid #5C5C86",
        background: "#FFFFFF",
        opacity: "0",
      });
    }
  }, [isSelected]);

  return (
    <AnimatedRadioContainer
      style={{ border: styles.border, background: styles.background }}
      isSelected={isSelected}
      onClick={onClick}
      disabled={disabled}
    >
      <AnimatedRadioInnerCircle
        style={{ opacity: styles.opacity }}
        isSelected={isSelected}
        disabled={disabled}
      />
    </AnimatedRadioContainer>
  );
};

export { Radio };
