import { DataType } from "@/types/coreTypes";
import React from "react";
import styled from "styled-components";
import { Icons, NeedHelpCta } from "@lk/ui-library";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
interface CartHeaderType {
  logo: string;
  showBackBtn: boolean;
  onClickBack: () => void;
  dontShowlogo: boolean;
  isClickable: boolean;
  configData: DataType;
  hasOnlyCLProduct: boolean;
  pageNumber: number;
  noNumber?: boolean;
  isRTL: boolean;
  localeData: DataType;
  isHelper: boolean;
}
const HeaderSpacer = styled.div`
  padding-bottom: 51px;
  border-bottom: 1px solid #0000001f;
`;
const HeaderPanel = styled.div`
  box-shadow: 0 2px 2px 0 rgb(148 150 159 / 30%);
  background-color: #fff;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 9999;
`;
const InnerPanel = styled.div`
  min-height: 51px;
  margin-right: 8px;
  padding-left: 8px;
  align-items: center;
  display: flex;
`;
const MainContent = styled.div`
  width: 100%;
  height: 30px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-content: space-between;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: flex;
`;
const StyledLink = styled.a`
  text-decoration: none;
  color: #18cfa8;
  outline: none;
  border: 0;
  background: 0 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  img {
    width: 100px;
    max-width: 100%;
    height: auto;
    vertical-align: middle;
  }
`;
const NumberLink = styled(StyledLink)`
  font-weight: 700;
  white-space: nowrap;
  margin-left: 5px;
  color: #000;
  img {
    width: 80px;
  }
`;

export const Img = styled.img`
  width: 100px;
`;
const OnClInfoText = styled.span<{ isRTL?: boolean }>`
  ${(props) => (props.isRTL ? "" : `margin-left: auto`)};
  display: inline-block;
  text-decoration: uppercase;
  direction: ltr;
`;
const BackBtnContainer = styled.div<{ isRTL?: boolean }>`
  width: 19px;
  height: 19px;
  display: flex;
  align-items: center;
  font-size: 19px;
  svg {
    path {
      stroke-width: 2;
    }
  }

  ${(props) => (props.isRTL ? "transform: rotate(180deg)" : "")}
`;
const MobileCartHeader = ({
  logo,
  showBackBtn,
  onClickBack,
  dontShowlogo,
  isClickable,
  configData,
  hasOnlyCLProduct,
  pageNumber,
  noNumber = false,
  isRTL,
  localeData,
  isHelper = false,
}: CartHeaderType) => {
  const showTollNumber =
    (typeof configData.SHOW_TOLL_NUMBER === "string"
      ? JSON.parse(configData.SHOW_TOLL_NUMBER)
      : configData.SHOW_TOLL_NUMBER) || {};
  const buyOnChatConfig =
    configData?.BUY_ON_CALL_WIDGET &&
    JSON.parse(configData?.BUY_ON_CALL_WIDGET);
  const whatsAppChatMsg = localeData?.WHATSAPP_HELP;
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  return (
    <HeaderSpacer>
      <HeaderPanel>
        <InnerPanel>
          {showBackBtn && (
            <BackBtnContainer onClick={() => onClickBack()} isRTL={isRTL}>
              <Icons.LeftArrow />
            </BackBtnContainer>
          )}
          <MainContent>
            {!dontShowlogo && (
              <React.Fragment>
                <Link
                  aria-label="go to home page"
                  href={
                    // isClickable &&
                    // pageInfo.subdirectoryPath
                    //   ? pageInfo.subdirectoryPath
                    //   :
                    "/"
                  }
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <StyledLink>
                    <Img
                      alt="Lenskart Logo"
                      aria-label="app logo"
                      // className="width100"
                      src={logo}
                    />
                  </StyledLink>
                </Link>
                {showTollNumber.enable && (
                  <NumberLink
                    aria-label="toll free number"
                    href={`tel:${showTollNumber.number}`}
                    onClick={(event) => {
                      //   fireGAAndCT();
                      event.preventDefault();
                      window.location.href = `tel:${showTollNumber.number}`;
                    }}
                  >
                    <img
                      alt="Toll Free Number"
                      className="width80"
                      src={showTollNumber.image}
                    />
                  </NumberLink>
                )}
                {isHelper && (
                  <NeedHelpCta
                    isRendered={buyOnChatConfig?.cta?.isShown}
                    isBuyOnChat={buyOnChatConfig?.buyonchat}
                    localeData={localeData}
                    whatsappChatMsg={whatsAppChatMsg}
                    phoneNumber={buyOnChatConfig.eyeglasses.tel}
                    // onClick={() => {}}
                    // sessionId={sessionId}
                    // savedCards={savedCards}
                    // availableOffers={availableOffers}
                    // cartData={cartData}
                    // showProceedBtnHandler={showProceedBtnHandler}
                    configData={configData}
                    dataLocale={localeData}
                  />
                )}
              </React.Fragment>
            )}
            {!noNumber && (
              <OnClInfoText isRTL={isRTL}>
                {hasOnlyCLProduct
                  ? `${pageNumber ?? 1} of 3`
                  : `${pageNumber ?? 1} of 4`}
              </OnClInfoText>
            )}
          </MainContent>
        </InnerPanel>
      </HeaderPanel>
    </HeaderSpacer>
  );
};

export default MobileCartHeader;
