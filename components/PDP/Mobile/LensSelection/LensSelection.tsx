import { postNeedHelpWhatsapp } from "@/redux/slices/auth";
import { AppDispatch, RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import { PriceType } from "@/types/priceTypes";
import { PrescriptionType } from "@/types/productDetails";
import { BuyOnCallWidget, Icons } from "@lk/ui-library";
import { useDispatch, useSelector } from "react-redux";
import {
  BackButton,
  NeedHelpText,
  TopRow,
  WhatAppIcon,
} from "../PackageScreen/PackageScreen.styles";
import {
  BuyNowContainer,
  // IconContainer,
  ImageContainer,
  Img,
  LeftSection,
  LensOptionsContainer,
  LensSelectionCard,
  LensSelectionContainer,
  PriceContainer,
  Text,
  TextContainer,
  Title,
  TextCoolGrey,
  PowerIcons,
  Spacer,
  AlertWrapper,
  LensSelectionCardContainer,
  BuyOnCallWrapper,
  TopHeaderLensSelection,
} from "./LensSelection.styles";
import { useEffect, useState } from "react";
import { userProperties } from "helpers/userproperties";
import { passUtmData } from "@/redux/slices/userInfo";
import { getCookie } from "@/helpers/defaultHeaders";
import { getUserEventData } from "containers/Base/helper";

const LensSelection = (props: {
  title: string;
  prescriptionType: PrescriptionType;
  packageTextConfig: any;
  productLensTypeDesc: any;
  category: string;
  buyWithCallConfig: any;
  whatsAppChatMsg: string;
  price: PriceType;
  onClickHandler: any;
  localeData: DataType;
  country?: string;
  showNeedHelp?: string;
  onNeedHelpClick: () => void;
  needHelpLink: string | null;
  configData?: any;
  id: string;
  sessionId: string;
  closeLensSelection: () => void;
}) => {
  const {
    title,
    prescriptionType,
    packageTextConfig,
    productLensTypeDesc,
    category,
    price,
    onClickHandler,
    localeData,
    configData,
    country,
    sessionId,
    buyWithCallConfig,
    whatsAppChatMsg,
    closeLensSelection,
  } = props;

  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: RootState) => state.userInfo);

  const { TOTAL, SYMBOL_COLON, FRAME, NEED_HELP } = localeData;

  const {
    eyeglasses: { tel },
    // cta: { isShown /* whatsappIconGreen, iconGreen, text */ },
  } = buyWithCallConfig;
  const postNeedHelpWhatsappFun = () => {
    if (userInfo?.mobileNumber) {
      dispatch(
        postNeedHelpWhatsapp({
          phone: userInfo?.mobileNumber,
          sessionId: sessionId,
        })
      );
    }
  };

  const isBuyOnChat = buyWithCallConfig && buyWithCallConfig.buyonchat;
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const [innerHeight, setInnerHeight] = useState(0);
  // const height =

  const handleResizePres = () => {
    setInnerHeight(window?.innerHeight - 30);
  };

  useEffect(() => {
    const pageName = "power-type-page";
    userProperties(userInfo, pageName, pageInfo, localeData, "lens-type-page");
    handleResizePres();
    window.addEventListener("resize", handleResizePres, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResizePres);
    };
  }, []);

  const handleOnBuyOnCallClick = () => {
    const userEventDataObj = getUserEventData("BUY_ON_CHAT");
    dispatch(
      passUtmData({
        sessionId: getCookie(`clientV1_${pageInfo.country}`)?.toString(),
        eventObj: userEventDataObj,
      })
    );
  };

  return (
    <LensSelectionContainer id="lensSelection" height={innerHeight}>
      <TopHeaderLensSelection>
        <TopRow>
          <BackButton onClick={() => closeLensSelection()}>
            {pageInfo.isRTL ? <Icons.RightArrow /> : <Icons.BackArrow />}
          </BackButton>
          {configData?.CART_NEED_HELP && (
            <NeedHelpText
              href={isBuyOnChat ? whatsAppChatMsg : `tel:${tel}`}
              onClick={() => postNeedHelpWhatsappFun()}
            >
              {configData?.SHOW_WHATS_APP_ICON_PAC_SCREEN && (
                <WhatAppIcon>
                  <img
                    alt={localeData?.PHONE_NUMBER}
                    src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/WhatsappIcon.svg"
                  />
                </WhatAppIcon>
              )}
              {NEED_HELP}?
            </NeedHelpText>
          )}
        </TopRow>
        <Title>
          <h2>{title}</h2>
        </Title>
      </TopHeaderLensSelection>
      <LensOptionsContainer>
        {prescriptionType?.map(
          (
            lensType: { title: any; id: string | number },
            index: React.Key | null | undefined
          ) => {
            const powerType = lensType?.title;
            const powerTypeId = lensType.id;
            const packageTitle =
              (packageTextConfig && packageTextConfig[lensType.id]?.title) ||
              powerType;
            const packageImg =
              packageTextConfig &&
              packageTextConfig[lensType.id]?.Power_img_url;

            const packageDesc =
              (packageTextConfig && packageTextConfig[lensType.id]?.subtitle) ||
              productLensTypeDesc[powerType]?.desc;
            const alert =
              packageTextConfig && packageTextConfig[lensType.id]?.alert;

            return (
              <LensSelectionCardContainer key={index}>
                <LensSelectionCard
                  key={index}
                  onClick={() => onClickHandler(powerType, powerTypeId)}
                >
                  <TextContainer>
                    <Text type="primary" className="pkgTitle">
                      {packageTitle}
                    </Text>
                    <TextCoolGrey
                      dangerouslySetInnerHTML={{ __html: packageDesc }}
                    ></TextCoolGrey>
                  </TextContainer>
                  <PowerIcons>
                    {powerTypeId === "without_power" && (
                      <Icons.SunglassesWithoutPower />
                    )}

                    {powerTypeId === "sunglasses" && (
                      <Icons.SunglassesWithPower />
                    )}
                  </PowerIcons>
                  {!["frame_only", "without_power", "sunglasses"].includes(
                    powerTypeId
                  ) && (
                    <ImageContainer>
                      <Img src={packageImg} />
                    </ImageContainer>
                  )}
                  {/* {powerTypeId === "frame_only" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      fill="#358D84"
                      width="50px"
                    >
                      <path d="M574.1 280.37L528.75 98.66c-5.91-23.7-21.59-44.05-43-55.81-21.44-11.73-46.97-14.11-70.19-6.33l-15.25 5.08c-8.39 2.79-12.92 11.86-10.12 20.24l5.06 15.18c2.79 8.38 11.85 12.91 20.23 10.12l13.18-4.39c10.87-3.62 23-3.57 33.16 1.73 10.29 5.37 17.57 14.56 20.37 25.82l38.46 153.82c-22.19-6.81-49.79-12.46-81.2-12.46-34.77 0-73.98 7.02-114.85 26.74h-73.18c-40.87-19.74-80.08-26.75-114.86-26.75-31.42 0-59.02 5.65-81.21 12.46l38.46-153.83c2.79-11.25 10.09-20.45 20.38-25.81 10.16-5.3 22.28-5.35 33.15-1.73l13.17 4.39c8.38 2.79 17.44-1.74 20.23-10.12l5.06-15.18c2.8-8.38-1.73-17.45-10.12-20.24l-15.25-5.08c-23.22-7.78-48.75-5.41-70.19 6.33-21.41 11.77-37.09 32.11-43 55.8L1.9 280.37A64.218 64.218 0 0 0 0 295.86v70.25C0 429.01 51.58 480 115.2 480h37.12c60.28 0 110.37-45.94 114.88-105.37l2.93-38.63h35.75l2.93 38.63C313.31 434.06 363.4 480 423.68 480h37.12c63.62 0 115.2-50.99 115.2-113.88v-70.25c0-5.23-.64-10.43-1.9-15.5zm-370.72 89.42c-1.97 25.91-24.4 46.21-51.06 46.21H115.2C86.97 416 64 393.62 64 366.11v-37.54c18.12-6.49 43.42-12.92 72.58-12.92 23.86 0 47.26 4.33 69.93 12.92l-3.13 41.22zM512 366.12c0 27.51-22.97 49.88-51.2 49.88h-37.12c-26.67 0-49.1-20.3-51.06-46.21l-3.13-41.22c22.67-8.59 46.08-12.92 69.95-12.92 29.12 0 54.43 6.44 72.55 12.93v37.54z" />
                    </svg>
                  )} */}
                  {/* <IconContainer>&#x27e9;</IconContainer> */}
                </LensSelectionCard>
                {alert && (
                  <AlertWrapper>
                    <img
                      alt="alert-icon"
                      src="https://static1.lenskart.com/media/desktop/img/DesignStudioIcons/InfoIcon.svg"
                      width="12"
                      height="12"
                    />
                    {alert}
                  </AlertWrapper>
                )}
              </LensSelectionCardContainer>
            );
          }
        )}

        {buyWithCallConfig &&
          buyWithCallConfig.enabled &&
          country?.toLowerCase() !== "sa" && (
            <BuyOnCallWrapper>
              <BuyOnCallWidget
                buyWithCallConfig={buyWithCallConfig}
                category={category}
                whatsAppChatMsg={whatsAppChatMsg}
                onClickHandler={handleOnBuyOnCallClick}
              />
            </BuyOnCallWrapper>
          )}
      </LensOptionsContainer>

      {/* <PriceContainer>
        <LeftSection>
          <Text>
            {TOTAL}
            <Spacer />
            {SYMBOL_COLON}
            <Spacer />
            <strong>
              {price?.symbol} {price?.lkPrice}
            </strong>
          </Text>
          <Text className="frameTitle">{FRAME}</Text>
        </LeftSection> */}
      {/* <BuyNowContainer>{BUY_THIS}</BuyNowContainer> */}
      {/* </PriceContainer> */}
    </LensSelectionContainer>
  );
};

export default LensSelection;
