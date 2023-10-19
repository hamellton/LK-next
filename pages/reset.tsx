import { ComponentSizeENUM, ThemeENUM } from "@/types/baseTypes";
import { TypographyENUM } from "@/types/coreTypes";
import { PrimaryButton } from "@lk/ui-library";
import styled from "styled-components";
import { deleteCookie, setCookie } from "@/helpers/defaultHeaders";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 5%;
  border: 1px solid black;
  margin: 10%;
`;

const ItemWrapper = styled.div`
  font-size: 20px;
  gap: 10px;
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

const Reset = () => {
  const newArchCookie = `${getCookie('newArch')}`;

  const handleReset = () => {
    setCookie(`newArch`, false);
    deleteCookie(`cameFromNewArch`);
    window.location.href = "/";
  };

  return (
    <Wrapper>
      <ItemWrapper>
        <div>Please click below button to access old lenskart website.</div>
        <PrimaryButton
          primaryText={"RESET"}
          font={TypographyENUM.defaultMedium}
          componentSize={ComponentSizeENUM.extraLarge}
          onBtnClick={handleReset}
          id="btn-primary-reset"
          width={"100%"}
          height="45px"
          theme={ThemeENUM.msitePrimary}
        />
      </ItemWrapper>
    </Wrapper>
  );
};

export default Reset;
