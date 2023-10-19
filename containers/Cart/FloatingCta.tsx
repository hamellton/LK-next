import { DataType, TypographyENUM } from "@/types/coreTypes";
import { Icons } from "@lk/ui-library";
import { Button, ContactLensConsentCheckbox } from "@lk/ui-library";
import { ButtonContent } from "pageStyles/CartStyles";
import React, { ReactNode } from "react";
import styled from "styled-components";

const CtaContainer = styled.div`
  position: relative;
  background-color: #eaeff4;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  // padding: 10px 8px;
`;
const CtaHolder = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  padding: 8px 16px;
  display: flex;
  width: 100vw;
  flex-direction: column;
`;
const FloatingCta = ({
  text,
  onClick,
  isRTL,
  isContactLensConsentEnabled,
  deviceType,
  toggleChecked,
  isContactLensCheckboxChecked,
  localeData,
  configData,
}: {
  text: string | ReactNode;
  onClick: (e: any) => void;
  isRTL: boolean;
  isContactLensConsentEnabled: boolean;
  deviceType?: string;
  toggleChecked: () => void;
  isContactLensCheckboxChecked: boolean;
  localeData: DataType;
  configData: DataType;
}) => {
  return (
    <CtaContainer>
      <CtaHolder>
        {isContactLensConsentEnabled && (
          <ContactLensConsentCheckbox
            deviceType={deviceType}
            toggleChecked={toggleChecked}
            checked={isContactLensCheckboxChecked}
            dataLocale={localeData}
            configData={configData}
          />
        )}
        <Button
          id="button"
          showChildren={true}
          width="100"
          font={TypographyENUM.lkSansBold}
          onClick={onClick}
          disabled={
            isContactLensConsentEnabled && !isContactLensCheckboxChecked
          }
        >
          <ButtonContent styledFont={TypographyENUM.lkSansBold}>
            {text} {isRTL ? <Icons.IconLeft /> : <Icons.IconRight />}
          </ButtonContent>
        </Button>
      </CtaHolder>
    </CtaContainer>
  );
};

export default FloatingCta;
