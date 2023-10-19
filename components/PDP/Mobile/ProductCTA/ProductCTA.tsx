import { Pages } from "@/components/PrescriptionModalV2/helper";
import Slider from "@/components/PrescriptionModalV2/Slider";
import { addToCartNoPower } from "@/redux/slices/cartInfo";
import {
  resetPrescriptionData,
  setPrescriptionPageStatus,
  updateCLEye,
  updateCLPrescription,
  updatePrescriptionPage,
  updatePrevPrescriptionPage,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import { ComponentSizeENUM } from "@/types/baseTypes";
import { ProductDetailType } from "@/types/productDetails";
import { BottomSheet, Toast } from "@lk/ui-library";
// import { LensSelection } from '@lk/ui-library';
import { PrimaryButton } from "@lk/ui-library";
import { getAppUrl, getBuyOnAppUrl } from "containers/ProductDetail/helper";
import { PowerTypeList } from "containers/ProductDetail/ProductDetail.types";
import { getCookie } from "@/helpers/defaultHeaders";
import { selectLensPres, userProperties } from "helpers/userproperties";
import usePrevious from "hooks/usePrevious";
import Router from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContactLensPower from "../BuyContactLens/ContactLensPower";
import SelectContactLensEye from "../BuyContactLens/SelectContactLensEye";
import LensSelection from "../LensSelection/LensSelection";
import PackageScreen from "../PackageScreen/PackageScreen";
import {
  ButtonContainer,
  BuyNowButtonsWrapper,
  ProductCTAWrapper,
  RedirectButtons,
} from "./ProductCTA.styles";
import OOSModal from "../OOSModal/OOSModal";
import { ctaClickEvent } from "helpers/gaFour";
import router from "next/router";
import { getUserEventData } from "containers/Base/helper";
import { passUtmData } from "@/redux/slices/userInfo";

const ProductCTA = (props: {
  configData: any;
  productData: ProductDetailType;
  powerOption: string | undefined;
  productLensTypeDesc: any;
  localeData: any;
  sessionId: string;
  addToCartNoPowerHandler: (powerType?: string) => void;
  isExchangeFlow?: boolean;
  powerTypeList: PowerTypeList[] | [];
  isJitProduct: boolean;
  isPlano: boolean;
  isContactLens?: boolean;
}) => {
  const {
    configData,
    localeData,
    productData,
    powerOption,
    productLensTypeDesc,
    sessionId,
    addToCartNoPowerHandler,
    isExchangeFlow,
    powerTypeList,
    isJitProduct,
    isPlano,
    isContactLens,
  } = props;

  const {
    prescriptionPage,
    prescriptionPageStatus,
    prevPrescriptionPage,
    storeSlots,
    clPrescriptionData,
  } = useSelector((state: RootState) => state.prescriptionInfo);
  const { searchBar } = useSelector((state: RootState) => state.authInfo);
  const { WHATSAPP_CHAT_URL } = localeData;
  const {
    PDP_CTA_CONFIG,
    lensPackageTextConfig,
    BUY_ON_CALL_WIDGET,
    SHOW_BUY_ON_CHAT,
  } = configData;
  const dispatch = useDispatch<AppDispatch>();
  const [bottom, setBottom] = useState(true);
  const [section, setSection] = useState("");
  const [showPackageScreen, setShowPackageScreen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [windowYOffSet, setWindowYOffSet] = useState(0);
  const { productQuantity, classification, prescriptionType, id } = productData;
  const { country } = useSelector((state: RootState) => state.pageInfo);
  const { inViewPort } = useSelector((state: RootState) => state.authInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);

  const packageTextConfig =
    lensPackageTextConfig && JSON.parse(lensPackageTextConfig);
  const buyWithCallConfig =
    BUY_ON_CALL_WIDGET && JSON.parse(BUY_ON_CALL_WIDGET);
  const buyOnChatDetails = SHOW_BUY_ON_CHAT ? JSON.parse(SHOW_BUY_ON_CHAT) : {};
  const BUYONCHAT_HELP_CTA_PDP = buyOnChatDetails.content;
  const whatsAppChatMsg =
    WHATSAPP_CHAT_URL &&
    buyOnChatDetails &&
    `${WHATSAPP_CHAT_URL}${BUYONCHAT_HELP_CTA_PDP}${id}`.replace(
      "<phoneNumber>",
      buyOnChatDetails.number
    );

  // > setting position of CTA fixed until scrolled to bottom

  // > disable background scoll if bottomsheet opens
  useEffect(() => {
    section && (document.body.style.overflow = "hidden");
    !section && (document.body.style.overflow = "unset");
  }, [section]);

  useEffect(() => {
    updatePrescriptionPage(Pages.SUBMIT_PRESCRIPTION);
  }, []);

  // > config data for button text and which buttons to show
  let showPdpConfig: { buttonName?: [] } = {},
    buyNowButton = [],
    buyOnCallBtn,
    nearByStoreBtn = [],
    buyOnApp = [];
  if (PDP_CTA_CONFIG) {
    const msitePdpCTAConfig = JSON.parse(PDP_CTA_CONFIG);
    showPdpConfig = msitePdpCTAConfig && msitePdpCTAConfig[0];
    const allCtaConfig: any =
      (showPdpConfig && showPdpConfig?.buttonName) || {};

    buyNowButton = msitePdpCTAConfig[1].buyNowCTA[0];
    buyOnCallBtn = allCtaConfig[0];
    nearByStoreBtn = allCtaConfig[1];
    buyOnApp = allCtaConfig[2];
  }

  const conditionalButton =
    configData.PDP_CTA_CONDITIONAL &&
    JSON.parse(configData.PDP_CTA_CONDITIONAL);
  const { buyOnAppEnable, eyeWearExpertEnable, freeEyeTestEnable } =
    conditionalButton || {};

  const onBtnClick = () => {
    console.log("try home");
    router.push(`/try-at-home`);
    const eventName = "cta_click";
    const cta_name = "try-at-home";
    const cta_flow_and_page = "product-detail-page";
    ctaClickEvent(eventName, cta_name, cta_flow_and_page, userInfo, pageInfo);
  };

  // > fixed Cta top row buttons - home try on/buy on app/ whatsapp expert
  const showReserveAtStore = (btnType: {
    CTA: string;
    img: string;
    title: string;
  }) => {
    if (btnType && btnType.CTA) {
      return (
        <ButtonContainer>
          <PrimaryButton
            primaryText={btnType.CTA}
            backgroundColor={"var(--white)"}
            color="#18cfa8"
            icon={btnType.img || ""}
            onBtnClick={onBtnClick}
            componentSize={ComponentSizeENUM.small}
            width="100%"
            fontStyle={"LKFuturaStd-Heavy,Arial,sans-serif"}
          ></PrimaryButton>
        </ButtonContainer>
      );
    }
  };
  const showBuyonAppButton = (flexButton: {
    CTA: any;
    title: any;
    img: string;
    CTAType?: string;
  }) => {
    const appLink = getAppUrl("MSITE_PDP", null);
    const buyOnAppLink = getBuyOnAppUrl(id);
    if (flexButton && flexButton.CTA) {
      return (
        <ButtonContainer>
          <PrimaryButton
            primaryText={flexButton.CTA}
            backgroundColor={
              flexButton.CTAType === "primary" ? "var(--white)" : "var(--white)"
            }
            color={flexButton.CTAType === "primary" ? "#18cfa8" : "#18cfa8"}
            icon={flexButton.img}
            componentSize={ComponentSizeENUM.small}
            onBtnClick={() => {
              const eventName = "cta_click";
              const cta_name = flexButton.CTA;
              const cta_flow_and_page = "product-detail-page";
              ctaClickEvent(
                eventName,
                cta_name,
                cta_flow_and_page,
                userInfo,
                pageInfo
              );
              Router.push(`${buyOnAppLink}`);
            }}
            // width='100%'
            width={freeEyeTestEnable || eyeWearExpertEnable ? "" : "100%"}
            padding={"var(--pd-8) var(--pd-10)"}
          ></PrimaryButton>
        </ButtonContainer>
      );
    }
  };

  // > functions to set section state based on product type
  const showSelectEyeBottomSheet = () => {
    //> trigger relevant gtm here
    setSection("showSelectEyeModal");
  };

  const showSelectLensTypeBottomSheet = () => {
    setSection("showSelectLensTypeModal");
  };

  const showOOSBottomsheet = () => {
    setSection("showOOSModal");
  };

  const handleBuyNow = () => {
    //> we'll show buy on app or try alternative product if qty = 0
    if (!productQuantity) {
      showOOSBottomsheet();
      return;
    }

    //> contact lens
    if (classification === "contact_lens") {
      if (isPlano) {
        const addToCartJSON: {
          pid: number;
          powerType?: string;
          sessionId: string;
        } = {
          pid: productData.id,
          sessionId: sessionId,
        };
        dispatch(addToCartNoPower(addToCartJSON));
        // Router.push("/cart");
        //> add to cart directly - zero power contact lens
        ctaClickEvent(
          "cta_click",
          "add-to-cart",
          "product-detail-page",
          userInfo,
          pageInfo
        );
      } else {
        //> select eye and power
        showSelectEyeBottomSheet();
      }
    } else if (
      (["eyeframe", "sunglasses"]?.indexOf(classification) > -1 &&
        prescriptionType.length > 1) ||
      (prescriptionType.length === 1 &&
        ["frame_only", "without_power"]?.indexOf(prescriptionType[0].id) === -1)
    ) {
      //> power product other than contact lens, show lens type bottomsheet
      showSelectLensTypeBottomSheet();
      ctaClickEvent(
        "cta_click",
        "select-lenses",
        "product-detail-page",
        userInfo,
        pageInfo
      );
    } else {
      //> frame only product - add to cart
      const addToCartJSON: {
        pid: number;
        powerType?: string;
        sessionId: string;
      } = {
        pid: productData.id,
        sessionId: sessionId,
      };
      if (
        powerOption &&
        ["Frame Only", "Without Power"]?.indexOf(powerOption) > -1
      ) {
        addToCartJSON.powerType = powerOption;
      }
      dispatch(addToCartNoPower(addToCartJSON));
      // Router.push("/cart");
      ctaClickEvent(
        "cta_click",
        "add-to-cart",
        "product-detail-page",
        userInfo,
        pageInfo
      );
    }
  };

  useEffect(() => {
    if (!cartData?.cartIsLoading && cartData?.cartPopupError) {
      setShowToast(true);
    }
  }, [cartData?.cartIsLoading, cartData?.cartPopupError]);

  const handleOnSelectLens = (
    type: string,
    id: string,
    setCartActive: (arg0: boolean) => void
  ) => {
    // console.log("inside select lens ... ");
    // console.log(type, id);
    setSection("");
    setCurrentSelection(id);
    if (
      ["Frame Only", "Without Power"]?.indexOf(type) > -1 ||
      ["frame_only", "without_power"]?.indexOf(id) > -1
    ) {
      // console.log("inside frame only...");
      const reqObj = {
        pid: productData.id,
        sessionId: `${getCookie(`clientV1_${country}`)}`,
      };
      dispatch(addToCartNoPower(reqObj));
      LensSelection;
      console.log("lens select");
      // setCartActive(true); // ! => check this at last
      if (typeof window?.fbq !== "undefined") {
        window?.fbq("track", "AddToCart", {
          content_category: productData.classification,
          content_ids: productData.id,
          content_type: "product",
          value: productData.price.lkPrice,
          currency: productData.price.currency,
        });
      }
      ctaClickEvent(
        "cta_click",
        "add-to-cart",
        "product-detail-page",
        userInfo,
        pageInfo
      );
      // Router.push("/cart");
      return;
    }
    setShowPackageScreen(true);
    // selectLens(
    //   type,
    //   userInfo?.mobileNumber?.toString(),
    //   userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
    //   pageInfo?.country
    // );
    const eventName = "cta_click";
    const cta_flow_and_page = `${productData.type?.toLowerCase()}-${"power-type-screen"}`;

    selectLensPres(
      eventName,
      cta_flow_and_page,
      type,
      userInfo?.mobileNumber?.toString(),
      userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
      pageInfo?.country
    );
    // const pageName = "lens-type-page";
    // userProperties(userInfo, pageName, pageInfo, localeData, "lens-type-page");
  };

  updatePrescriptionPage(Pages.SUBMIT_PRESCRIPTION);
  // console.log("productData", productData);
  const [showPrescription, setShowPrescription] = useState(false);

  const onClickSelectEye = (qty: number, eye: string) => {
    setSection("");
    dispatch(updateCLEye(eye));
    dispatch(
      updateCLPrescription({
        ...clPrescriptionData.prescription,
        powerType: "CONTACT_LENS",
      })
    );
    setShowPrescription(true);
  };

  const handleShowPrescription = (flag: boolean) => {
    setShowPrescription(flag);
  };

  const closeSlider = (close: boolean) => {
    if (close) {
      dispatch(resetPrescriptionData());
      dispatch(setPrescriptionPageStatus(false));
    } else {
      if (!prevPrescriptionPage) {
        dispatch(resetPrescriptionData());
        dispatch(setPrescriptionPageStatus(false));
        setShowPrescription(false);
      } else {
        dispatch(updatePrescriptionPage(prevPrescriptionPage));
        dispatch(updatePrevPrescriptionPage(""));
      }
    }
  };

  useEffect(() => {
    dispatch(resetPrescriptionData());
  }, []);

  useEffect(() => {
    if (showPackageScreen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPackageScreen]);

  const closeLensSelection = () => {
    setSection("");
  };

  const triggerUtmDetails = () => {
    const userEventDataObj = getUserEventData("BUY_ON_CHAT");
    dispatch(
      passUtmData({
        sessionId: getCookie(`clientV1_${pageInfo?.country}`)?.toString(),
        eventObj: userEventDataObj,
      })
    );
  };

  return (
    <ProductCTAWrapper
      bottom={bottom}
      searchBar={searchBar}
      isFlexRow={configData.PRODUCT_CTA_DIRECTION_ROW || false}
    >
      {showToast && (
        <Toast
          timeOut={4000}
          text={cartData?.cartErrorMessage}
          hideFn={() => {
            setShowToast(false);
          }}
          width={"90%"}
        />
      )}
      {showPrescription && (
        <Slider
          show={showPrescription}
          localeData={localeData}
          configData={configData}
          closeSlider={closeSlider}
          productData={productData}
          powerType="CONTACT_LENS"
          preCheckout={true}
          handleShowPrescription={handleShowPrescription}
        />
      )}
      {showPackageScreen && (
        <PackageScreen
          currentSelection={currentSelection}
          productDetailData={productData}
          id={productData.id}
          sessionId={sessionId}
          configData={configData}
          localeData={localeData}
          addToCartNoPowerHandler={addToCartNoPowerHandler}
          setShowPackageScreen={setShowPackageScreen}
          showPackageScreen={showPackageScreen}
          isExchangeFlow={isExchangeFlow}
          showSelectLens={showSelectLensTypeBottomSheet}
        />
      )}

      <BottomSheet
        show={section}
        closebottomSheet={() => setSection("")}
        onBackdropClick={() => setSection("")}
        backgroundColor={productQuantity ? "#f7f2ed" : "#eaeff4"}
        borderRadius="0"
        showCrossIcon={productQuantity ? false : true}
      >
        {
          {
            showSelectLensTypeModal: (
              <>
                <LensSelection
                  title={localeData.CHOOSE_POWER_TYPE || "Select Power Type"}
                  prescriptionType={productData.prescriptionType}
                  packageTextConfig={packageTextConfig}
                  productLensTypeDesc={productLensTypeDesc}
                  category={productData?.type}
                  buyWithCallConfig={buyWithCallConfig}
                  whatsAppChatMsg={whatsAppChatMsg}
                  price={productData?.price}
                  onClickHandler={handleOnSelectLens}
                  localeData={localeData}
                  country={country}
                  configData={configData}
                  closeLensSelection={closeLensSelection}
                />
              </>
            ),
            showSelectEyeModal: (
              <>
                <SelectContactLensEye
                  dataLocale={localeData}
                  onClickSelectEye={onClickSelectEye}
                />
              </>
            ),
            showOOSModal: (
              <>
                <OOSModal
                  localeData={localeData}
                  productData={productData}
                  customHandler={() => {
                    setSection("");
                  }}
                />
              </>
            ),
          }[section]
        }
      </BottomSheet>
      {!isExchangeFlow && (
        <RedirectButtons
          isWidthFull={configData.PRODUCT_CTA_DIRECTION_ROW || false}
        >
          {buyOnCallBtn && buyOnCallBtn.CTA && eyeWearExpertEnable && (
            <ButtonContainer>
              <PrimaryButton
                primaryText={buyOnCallBtn && buyOnCallBtn.CTA}
                icon={buyOnCallBtn.img}
                backgroundColor={"var(--white)"}
                color="#18cfa8"
                componentSize={ComponentSizeENUM.small}
                padding={"var(--pd-8) var(--pd-10)"}
                onBtnClick={() => {
                  const eventName = "cta_click";
                  const cta_name = "eyewear expert";
                  const cta_flow_and_page = "product-detail-page";
                  ctaClickEvent(
                    eventName,
                    cta_name,
                    cta_flow_and_page,
                    userInfo,
                    pageInfo
                  );
                  triggerUtmDetails();
                  router.push(whatsAppChatMsg);
                }}
                // width='100%'
              ></PrimaryButton>
            </ButtonContainer>
          )}
          {!isContactLens && freeEyeTestEnable && showReserveAtStore(nearByStoreBtn)}
          {buyOnAppEnable && showBuyonAppButton(buyOnApp)}
        </RedirectButtons>
      )}
      <BuyNowButtonsWrapper>
        <PrimaryButton
          primaryText={
            productQuantity
              ? (buyNowButton && buyNowButton[classification]) ||
                buyNowButton.default
              : localeData?.TRY_ALTERNATE_PRODUCTS || "TRY ALTERNATE PRODUCTS"
          }
          width="100%"
          backgroundColor="#18cfa8"
          padding="var(--pd-15) var(--pd-10)"
          onBtnClick={handleBuyNow}
          componentSize={
            configData.PRODUCT_CTA_DIRECTION_ROW && ComponentSizeENUM.small
          }
        />
      </BuyNowButtonsWrapper>
    </ProductCTAWrapper>
  );
};
export default ProductCTA;
