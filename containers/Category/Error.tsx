import { ComponentSizeENUM, kindENUM, ThemeENUM } from "@/types/baseTypes";
import { TypographyENUM } from "@/types/coreTypes";
import { PrimaryButton } from "@lk/ui-library";
import React from "react";
import styled from "styled-components";

const Root = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  background-color: #fff;
  min-width: 240px;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 4px;
`;

const Container = styled.div`
  padding: 30px 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
  font: 12px/1.2857 "Roboto", sans-serif, "Arial", "Helvetica", sans-serif;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default function Error({
  reset,
  errorMessage,
}: {
  reset: () => void;
  errorMessage: string;
}) {
  return (
    <Root>
      <Container>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <ButtonContainer>
          <PrimaryButton
            primaryText={"RETRY"}
            font={TypographyENUM.serif}
            componentSize={ComponentSizeENUM.medium}
            onBtnClick={reset}
            id="btn-primary-cl"
            width={"190px"}
            height="35px"
            theme={ThemeENUM.primary}
          />
        </ButtonContainer>
      </Container>
    </Root>
  );
}
