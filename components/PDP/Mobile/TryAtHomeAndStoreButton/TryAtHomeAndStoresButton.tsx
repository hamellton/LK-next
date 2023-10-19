import { RootState } from "@/redux/store";
import { ComponentSizeENUM, ThemeENUM } from "@/types/baseTypes";
import { TypographyENUM } from "@/types/coreTypes";
import { PrimaryButton } from "@lk/ui-library";
import { reDirection } from "containers/Base/helper";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import Router from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import { ButtonsWrapper, TryOnButton } from "./TryAtHomeAndStoresButton.styles";
import { TryAtHomeAndStoresButtonTypes } from "./TryAtHomeAndStoresButton.types";

const TryAtHomeAndStoresButton = ({
  type,
  localeData,
  isDittoEnabled,
  isContactLens,
  configData,
}: TryAtHomeAndStoresButtonTypes) => {
  const { CREATE_NEW_3D, TRY_IN_THREE_D, FREE_HOME_TRIAL, HUNDREDS_OF_STORES } =
    localeData || {};
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  // const getPrimaryText = () => {
  //   const dittoId: string = getCookie('isDittoID')?.toString() || '';
  //   if (dittoId) {
  //     return CREATE_NEW_3D;
  //   } else {
  //     return TRY_IN_THREE_D;
  //   }
  // };

  const handleCompareLooks = () => {
    // > add gtm events here...

    setCookie("lastVisitedUrlForCompareLooks", window.location.href);
    reDirection(pageInfo?.subdirectoryPath);
  };

  return (
    <ButtonsWrapper>
      {isDittoEnabled && (type === "Eyeglasses" || type === "Sunglasses") && (
        <TryOnButton>
          <PrimaryButton
            primaryText={
              getCookie("isDittoID")?.toString() !== ""
                ? TRY_IN_THREE_D
                : CREATE_NEW_3D
            }
            font={"Roboto"}
            componentSize={ComponentSizeENUM.medium}
            onBtnClick={handleCompareLooks}
            id="btn-primary-cl"
            height="35px"
            width="100%"
            backgroundColor={"var(--white)"}
            color="#18cfa8"
            theme={ThemeENUM.primary}
            weight={700}
            borderColor="#ccc"
            borderRadius="xxxs"
          />
        </TryOnButton>
      )}

      {!isContactLens && configData?.storeHomeTrial && (
        <PrimaryButton
          primaryText={FREE_HOME_TRIAL}
          font={"Roboto"}
          componentSize={ComponentSizeENUM.medium}
          onBtnClick={() => Router.push("/try-at-home")}
          id="btn-primary-cl"
          height="35px"
          width="32%"
          theme={ThemeENUM.primary}
          backgroundColor={"var(--white)"}
          color="#18cfa8"
          weight={700}
          borderColor="#ccc"
          borderRadius="xxxs"
        />
      )}
      {configData?.thirteenHundredStores && (
        <PrimaryButton
          primaryText={HUNDREDS_OF_STORES}
          font={"Roboto"}
          componentSize={ComponentSizeENUM.small}
          onBtnClick={() => {
            Router.push("/optical-store/");
          }}
          id="btn-primary-cl"
          height="35px"
          width="32%"
          theme={ThemeENUM.secondary}
          backgroundColor={"var(--white)"}
          color="#18cfa8"
          weight={700}
          borderColor="#ccc"
          borderRadius="xxxs"
        />
      )}
    </ButtonsWrapper>
  );
};

export default TryAtHomeAndStoresButton;
