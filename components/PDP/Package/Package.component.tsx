//> Default
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

//> Types
import { PackageType } from "./Package.types";
import { PackageENUM, PackageStepsType } from "@/types/productDetails";
import { TypographyENUM } from "@/types/baseTypes";
import { DirectionENUM } from "containers/ProductDetail/ProductDetail.types";

//> Redux
import { saveToCart } from "@/redux/slices/cartInfo";
import {
  fetchPackageData,
  resetPackages,
  updateStepsData,
} from "@/redux/slices/packagesInfo";

//> Packages
import {
  FooterDiv,
  PDP as PDPComponents,
  PackageRadioGroup,
  PackageCard,
  PackagesScreen,
} from "@lk/ui-library";
import { getCookie } from "@/helpers/defaultHeaders";

//> Hooks
import useDimensions from "hooks/useDimensions";

//> Styles
import {
  InlineLoader,
  PackageBtn,
  PackageCardGroup,
  PackageCardTrack,
  // PackageItemGroupContainer,
  PackageListWrapper,
  PackagesList,
  PackagesWrapper,
  VerticalContainer,
} from "./Package.Styles";
import Router from "next/router";
import { ResultPopUp } from "@lk/ui-library";
import { PackageScreenNew } from "@lk/ui-library";
import { PackageItemGroup } from "@lk/ui-library";
import { PackageScreenCard } from "@lk/ui-library";
import { PackageCoating } from "@lk/ui-library";
import { PackageFooter } from "@lk/ui-library";
import { AboutEyePower } from "@lk/ui-library";
import {
  LensDescriptionEvent,
  packageScreenSelectionGA,
  selectLens,
  userProperties,
} from "helpers/userproperties";
import { pageViewEvent } from "helpers/gaFour";
import { extractUtmParams } from "@lk/utils";
import { triggerVirtualPageView } from "helpers/virtualPageView";

// import { ResultPopUp } from "@lk/ui-library";

const PackageSection = ({
  productDetailData,
  id,
  sessionId,
  configData,
  localeData,
  addToCartNoPowerHandler,
  showPowerTypeModal,
  onPowerModalClose,
  isExchangeFlow,
}: PackageType) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    steps,
    packages,
    framePrice,
    id: currPackageId,
    packagesLoading,
    packagesError,
  } = useSelector((state: RootState) => state.packageInfo);
  const { cartIsError, cartIsLoading } = useSelector(
    (state: RootState) => state.cartInfo
  );
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  // const isRTL = true;

  const { subdirectoryPath } = useSelector(
    (state: RootState) => state.pageInfo
  );
  //> Local State
  const [price, setPrice] = useState(0);
  const [selectedPower, setSelectedPower] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentActiveStep, setCurrentActiveStep] = useState<
    PackageStepsType[]
  >([]);
  const [activeAddOn, setActiveAddOn] = useState(false);
  const [cartActive, setcartActive] = useState(false);
  const [showCoating, setShowCoating] = useState(false);
  const [animateRight, setAnimateRight] = useState(true);

  const packageListRef = useRef<HTMLDivElement>(null);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const {
    width,
    height,
    operatedVal: cardWidth,
  } = useDimensions({
    element: packageListRef.current,
    conversionFn: (width: number) => width / 3,
  });
  useEffect(() => {
    if (showPowerTypeModal) {
      const pageName = "lens-type-page";
      userProperties(
        userInfo,
        pageName,
        pageInfo,
        localeData,
        "lens-type-page"
      );
      const utmParameters =
        typeof window !== "undefined" &&
        window &&
        extractUtmParams(window.location.search);
      triggerVirtualPageView(
        userInfo,
        utmParameters,
        pageInfo,
        "Select Power Type"
      );
    }
  }, [showPowerTypeModal]);

  useEffect(() => {
    if (selectedPower) {
      const pageName = "lens-package-page";
      userProperties(
        userInfo,
        pageName,
        pageInfo,
        localeData,
        "lens-package-page"
      );
      const utmParameters =
        typeof window !== "undefined" &&
        window &&
        extractUtmParams(window.location.search);
      triggerVirtualPageView(userInfo, utmParameters, pageInfo, "Lens Package");
    }
  }, [selectedPower]);

  useEffect(() => {
    if (selectedPackage) {
      let framePrice = productDetailData.price.lkPrice;
      let packagePrice = 0;
      packages?.forEach((pkg: any) => {
        if (pkg?.id === selectedPackage) {
          packagePrice += pkg?.price?.lkPrice;
          pkg?.addOns?.forEach((add: any) => {
            if (addOns.includes(add.id)) {
              packagePrice += add?.price?.lkPrice;
            }
          });
        }
      });
      setPrice(framePrice + packagePrice);
    }
  }, [
    selectedPackage,
    addOns,
    addOns.length,
    packages,
    productDetailData.price.lkPrice,
  ]);
  // const userInfo = useSelector((state: RootState) => state.userInfo);

  const backButton = (index: number) => {
    setAnimateRight(false);
    let updatedSteps = [...steps];
    let tempIndex = 0;
    for (let i = 0; i < updatedSteps.length; i++) {
      if (updatedSteps[i].isActive) {
        tempIndex = i;
        break;
      }
    }
    if (index === 0) {
      dispatch(resetPackages());
    }
    if (index < tempIndex) {
      if (index === 1) {
        setShowCoating(false);
      }
      {
        showCoating === false && setSelectedPackage("");
      }
      setCurrentActiveStep([updatedSteps[index]]);
      updatedSteps[tempIndex] = {
        ...updatedSteps[tempIndex],
        selectedText: "",
        isActive: false,
      };
      updatedSteps[index] = {
        ...updatedSteps[index],
        isActive: true,
      };
      if (tempIndex === 2 && index === 0) {
        updatedSteps[tempIndex - 1] = {
          ...updatedSteps[tempIndex - 1],
          selectedText: "",
          isActive: false,
        };
      }
      dispatch(updateStepsData(updatedSteps));
    } else if (index === tempIndex) {
      setCurrentActiveStep([updatedSteps[index]]);
      setSelectedPackage("");
      setAddOns([]);
      setActiveAddOn(false);
      setShowCoating(false);
      // dispatch(updateStepsData(updatedSteps));
    }
  };
  useEffect(() => {
    const updatedSteps = [...steps];
    const active = updatedSteps.filter((currentStep) => currentStep.isActive);
    // console.log(updatedSteps, active, "------------");

    setCurrentActiveStep(active);
    if (active && active[0]?.type === PackageENUM.PACKAGES) {
      const reqObj = {
        pid: parseInt(id),
        powerType:
          productDetailData.type === "Sunglasses"
            ? "sunglasses"
            : selectedPower,
        frameType: productDetailData.frameType,
        classification: productDetailData.classification,
        sessionId: sessionId,
      };
      dispatch(fetchPackageData(reqObj));
    }
  }, [dispatch, id, productDetailData, selectedPower, sessionId, steps]);

  //> handle Selection of Package
  const selectPackageHandler = (
    packageId: string,
    moveToAddons: boolean,
    packageName?: string
  ) => {
    setSelectedPackage(packageId);
    if (steps) {
      const updatedSteps = [...steps];
      let currentIdx = 2;
      updatedSteps.map((step, index) => {
        if (step.isActive) {
          currentIdx = index;
        }
      });
      updatedSteps[currentIdx] = {
        ...updatedSteps[currentIdx],
        isActive: moveToAddons,
        selectedText:
          packageName || updatedSteps[currentIdx].selectedText || "",
      };
      updatedSteps[currentIdx + 1] = {
        ...updatedSteps[currentIdx + 1],
        isActive: !moveToAddons,
      };
      dispatch(updateStepsData(updatedSteps));
      setActiveAddOn(moveToAddons);
      // dispatch();
    }
  };

  //> Handle Selection of Power
  const selectPowerHandler = (id: string, title: string) => {
    setAnimateRight(true);
    setActiveAddOn(false);
    setSelectedPower(id);
    if (steps) {
      const updatedSteps = [...steps];
      let currentIdx = 2;
      updatedSteps.map((step, index) => {
        if (step.isActive) {
          currentIdx = index;
        }
      });
      updatedSteps[currentIdx] = {
        ...updatedSteps[currentIdx],
        isActive: false,
        selectedText: title,
      };
      updatedSteps[currentIdx + 1] = {
        ...updatedSteps[currentIdx + 1],
        isActive: true,
      };
      LensDescriptionEvent({
        event: "lensDescription",
        powerType: id,
      });
      dispatch(updateStepsData(updatedSteps));
    }
  };

  //> Handle Slide in Package Section
  const moveSlideHandler = (num: number) => {
    setCurrentSlide((slide: number) => slide + num);
  };

  //> Add To Cart
  const addToCartWithOptionsHandler = (packageId: string, addOns?: string) => {
    let returnOrderId, returnItemId;
    if (isExchangeFlow) {
      returnOrderId = getCookie("postcheckOrderId") || null;
      returnItemId = getCookie("postcheckItemId") || null;
    }
    const reqObj: {
      powerType: string;
      productId: number;
      packageId: string;
      sessionId: string;
      addOns?: string;
      orderId?: number;
      itemId?: number;
    } = {
      productId: productDetailData.id,
      powerType:
        productDetailData.type === "Sunglasses" ? "sunglasses" : selectedPower,
      sessionId: sessionId,
      packageId: packageId,
      addOns: addOns || "",
    };
    if (returnOrderId)
      reqObj.orderId = parseInt(
        typeof returnOrderId === "string" ? returnOrderId : ""
      );
    if (returnItemId)
      reqObj.itemId = parseInt(
        typeof returnItemId === "string" ? returnItemId : ""
      );
    dispatch(saveToCart(reqObj));
    setcartActive(true);
    closePackageScreenHandler();
    // Router.push("/cart");
    if (typeof window?.fbq !== "undefined") {
      window?.fbq("track", "AddToCart", {
        content_category: productDetailData.classification,
        content_ids: productDetailData.id,
        content_type: "product",
        value: productDetailData.price.lkPrice,
        currency: productDetailData.price.currency,
      });
    }
  };

  useEffect(() => {
    if (cartActive && !cartIsLoading && !cartIsError) {
      setcartActive(false);
      // Router.push("/cart");
    }
  }, [cartIsLoading, cartIsError, cartActive, subdirectoryPath]);

  //> Close Package Screen Modal
  const closePackageScreenHandler = () => {
    setAnimateRight(true);
    onPowerModalClose(false);
    setSelectedPower("");
    setSelectedPackage("");
    setAddOns([]);
    setActiveAddOn(false);
  };

  // console.log(currentActiveStep, 'sjvchsjvcjhvscvksvbkckbckbebkbk');

  const getOfferTextIcon = (iconText: string) => {
    switch (iconText) {
      case "info":
        return "https://static.lenskart.com/media/desktop/img/DesignStudioIcons/RightArrowWithoutLineBig.svg";
      case "applied":
        return "https://static.lenskart.com/media/desktop/img/DesignStudioIcons/Check.svg";
      default:
        return "";
    }
  };

  return (
    <>
      {/* <PackagesScreen
        isRTL={isRTL}
        id="package-screen-modal"
        heading={productDetailData.productName}
        onClosePackages={closePackageScreenHandler}
        sliderImages={productDetailData.gridImages}
        leftSectionId="package-screen-left-section"
        rightSectionId="package-screen-right-section"
        isVisible={showPowerTypeModal}
        sequences={steps}
        backButton={backButton}
      > */}

      <PackageScreenNew
        isRTL={isRTL}
        id="package-screen-modal"
        heading={productDetailData.productName}
        onClosePackages={closePackageScreenHandler}
        sliderImages={productDetailData.gridImages}
        leftSectionId="package-screen-left-section"
        rightSectionId="package-screen-right-section"
        isVisible={showPowerTypeModal}
        sequences={steps}
        backButton={backButton}
        onBackdropClick={closePackageScreenHandler}
        selectedPackage={selectedPackage}
        currentActiveStepType={currentActiveStep[0]?.type || ""}
        localeData={localeData}
      >
        {/* {currentActiveStep.length > 0 &&
          currentActiveStep[0].type === PackageENUM.POWER && (
            <PackageRadioGroup
              isRTL={isRTL}
              radioWidth='100'
              selectedId={selectedPower}
              prescriptionTypeData={productDetailData.prescriptionType}
              id='types'
              onChange={(id: string, title: string) =>
                id === 'frame_only'
                  ? addToCartNoPowerHandler(id)
                  : selectPowerHandler(id, title)
              }
            />
          )} */}
        {currentActiveStep.length > 0 &&
          currentActiveStep[0].type === PackageENUM.POWER && (
            <VerticalContainer animateRight={animateRight}>
              <PackageItemGroup
                isRTL={isRTL}
                selectedId={selectedPower}
                prescriptionTypeData={productDetailData.prescriptionType}
                id="types"
                onChange={(id: string, title: string) => {
                  id === "frame_only"
                    ? addToCartNoPowerHandler(id)
                    : selectPowerHandler(id, title);
                  selectLens(
                    title,
                    userInfo?.mobileNumber?.toString(),
                    userInfo.userDetails?.hasPlacedOrder ? "old" : "new",
                    pageInfo?.country
                  );
                }}
                descriptiveText={
                  localeData?.NOT_SURE_WHAT_TO_SELECT ||
                  "Not sure what to select?"
                }
                localeData={localeData}
                helplineNumber={localeData?.HELPLINE_NUMBER || ""}
              />
              <PackageFooter
                price={productDetailData.price.lkPrice}
                symbol={productDetailData.price.symbol}
                subtotalText=" (Frame)"
                showButton={false}
                isRTL={isRTL}
              />
            </VerticalContainer>
          )}
        {currentActiveStep.length > 0 &&
          currentActiveStep[0].type === PackageENUM.PACKAGES && (
            <>
              {!activeAddOn && !packagesError && (
                <>
                  {packagesLoading && !packages ? (
                    <InlineLoader
                      alt="Loading..."
                      src="//static.lenskart.com/skin/frontend/base/default/images/loader2.gif"
                    />
                  ) : (
                    // <PackageCardGroup>
                    //   {/* {!Boolean(currentSlide <= 0) && (
                    //     <PackageBtn
                    //       type="button"
                    //       data-role="none"
                    //       dir={DirectionENUM.left}
                    //       onClick={() => moveSlideHandler(-1)}
                    //     >
                    //       {" "}
                    //       {localeData.PREVIOUS}{" "}
                    //     </PackageBtn>
                    //   )} */}
                    //   {/* <PackagesList ref={packageListRef}>
                    //     <PackageCardTrack
                    //       width={`${100}`}
                    //       individualWidth={cardWidth}
                    //       activeSlide={currentSlide}
                    //       moveToCenter={packages?.length < 3}
                    //     >
                    //       {packages?.map((pkg: any, index: number) => {
                    //         return (
                    //           <PackageCard
                    //             key={index}
                    //             framePrice={framePrice}
                    //             {...pkg}
                    //             dataLocale={localeData}
                    //             isExchangeFlow={isExchangeFlow}
                    //             productPrices={productDetailData.price}
                    //             width={`${33}`}
                    //             onClick={(packageId: string, addOns?: string) =>
                    //               currPackageId !== 'zero_power'
                    //                 ? selectPackageHandler(
                    //                     packageId,
                    //                     pkg?.addOns?.length > 0,
                    //                     pkg.name
                    //                   )
                    //                 : addToCartWithOptionsHandler(
                    //                     packageId,
                    //                     addOns
                    //                   )
                    //             }
                    //             isSunglasses={
                    //               productDetailData.type === 'Sunglasses'
                    //             }
                    //             blueCutLogo={configData.IMAGE_BLU_CUT}
                    //             font={TypographyENUM.lkSansRegular}
                    //             isRTL={isRTL}
                    //           />
                    //         );
                    //       })}
                    //     </PackageCardTrack>
                    //   </PackagesList> */}

                    <PackageListWrapper>
                      <PackagesWrapper>
                        {packages?.map((pkg: any, index: number) => {
                          return (
                            <PackageScreenCard
                              key={pkg.id}
                              id={pkg.id}
                              videoLink={pkg.videoLink}
                              font={TypographyENUM.lkSansRegular}
                              offerText={pkg.offerText}
                              PlayIcon={pkg.videoLink !== "" ? true : false}
                              title={pkg.label}
                              tags={pkg.tags}
                              specifications={pkg.specifications}
                              pkgImageLink={
                                pkg.packageImageLink || pkg.imageUrl
                              }
                              price={pkg.price}
                              showTaxText={
                                process.env.NEXT_PUBLIC_APP_COUNTRY === "SA"
                                  ? ""
                                  : " +tax"
                              }
                              showOfferRibbon={!!pkg.offerDetails}
                              offerColorCode={pkg?.offerDetails?.colorCode}
                              offerText1={
                                pkg?.offerDetails?.headline1?.includes("%s")
                                  ? pkg?.offerDetails?.headline1?.replace(
                                      "%s",
                                      pkg?.offerDetails?.couponCode
                                    )
                                  : pkg?.offerDetails?.headline1
                              }
                              offerText2={
                                pkg?.offerDetails?.couponCode
                                  ? pkg?.offerDetails?.headline3
                                  : getOfferTextIcon(pkg?.offerDetails?.icon)
                              }
                              offerTextHasIcon={!pkg?.offerDetails?.couponCode}
                              onClick={(packageId: string, addOns?: string) => {
                                currPackageId !== "zero_power"
                                  ? selectPackageHandler(
                                      packageId,
                                      pkg?.addOns?.length > 0,
                                      pkg.name
                                    )
                                  : addToCartWithOptionsHandler(
                                      packageId,
                                      addOns
                                    );
                                packageScreenSelectionGA(pkg?.label);
                              }}
                              deviceType="desktop"
                              isRTL={isRTL}
                              warrantyTxt={pkg?.warrantyTxt}
                              country={pageInfo.country}
                              configData={configData}
                              localeData={localeData}
                            />
                          );
                        })}
                      </PackagesWrapper>
                      <PackageFooter
                        price={productDetailData.price.lkPrice}
                        symbol={productDetailData.price.symbol}
                        subtotalText={
                          selectedPackage
                            ? ` ${localeData.FRAME_PLUS_LENS}`
                            : `(${localeData.FRAME})`
                        }
                        showButton={false}
                        isRTL={isRTL}
                      />
                    </PackageListWrapper>
                    //   {/* {Boolean(packages?.length - 3 > currentSlide) && (
                    //     <PackageBtn
                    //       type="button"
                    //       data-role="none"
                    //       dir={DirectionENUM.right}
                    //       onClick={() => moveSlideHandler(1)}
                    //     >
                    //       {" "}
                    //       {localeData.NEXT}
                    //     </PackageBtn>
                    //   )} */}
                    // {/* </PackageCardGroup> */}
                  )}
                </>
              )}
              {selectedPackage && (
                <VerticalContainer animateRight={animateRight}>
                  {/* <PDPComponents.Coating
                    addOnData={
                      packages.filter(
                        (pkg: any) => pkg.id === selectedPackage
                      )?.[0]?.addOns
                    }
                    dataLocale={localeData}
                    onBackPress={() => {
                      setCurrentActiveStep(
                        steps.filter((st) => st.type === PackageENUM.PACKAGES)
                      );
                      setActiveAddOn(false);
                      setSelectedPackage('');
                    }}
                    skipCoatingAction={() => {
                      setAddOns([]);
                      setActiveAddOn(false);
                      selectPackageHandler(selectedPackage, false);
                    }}
                    onSelectCoating={(id: string) =>
                      addOns.some((ad) => ad === id)
                        ? setAddOns((addons) => [
                          ...addons.filter((ad) => ad !== id),
                        ])
                        : setAddOns((addons) => [...addons, id])
                    }
                    selectedAddOns={addOns}
                  /> */}
                  <PackageCoating
                    addOnData={
                      packages.filter(
                        (pkg: any) => pkg.id === selectedPackage
                      )?.[0]?.addOns
                    }
                    skipCoatingAction={() => {
                      setAddOns([]);
                      setActiveAddOn(false);
                      selectPackageHandler(selectedPackage, false);
                      setAnimateRight(true);
                      setShowCoating(true);
                    }}
                    onSelectCoating={(id: string) =>
                      addOns.some((ad) => ad === id)
                        ? setAddOns((addons) => [
                            ...addons.filter((ad) => ad !== id),
                          ])
                        : setAddOns((addons) => [...addons, id])
                    }
                    selectedAddOns={addOns}
                  />
                  <PackageFooter
                    price={price}
                    symbol={productDetailData.price.symbol}
                    subtotalText={` (Frame + Lens${
                      !!addOns.length ? " + Coating" : ""
                    })`}
                    buttonText={localeData.APPLY_COATING}
                    onClick={() => {
                      setShowCoating(true);
                      selectPackageHandler(selectedPackage, false);
                    }}
                    isDisabled={!Boolean(addOns.length)}
                    showButton={true}
                    isRTL={isRTL}
                  />
                  {/* <FooterDiv
                    dataLocale={localeData}
                    price={price}
                    symbol={productDetailData.price.symbol}
                    buttonText={localeData.APPLY_COATING}
                    onClick={() => selectPackageHandler(selectedPackage, false)}
                    isDisabled={!Boolean(addOns.length)}
                  /> */}
                </VerticalContainer>
              )}
            </>
          )}
        {currentActiveStep.length > 0 &&
          currentActiveStep[0].type === PackageENUM.EYESIGHT && (
            <>
              {/* <PDPComponents.AboutEyePowerBox
                dataLocale={localeData}
                infoSections={[
                  localeData.ABOUT_MY_EYE_POWER_ADDITIONAL_INFO_1,
                  localeData.ABOUT_MY_EYE_POWER_ADDITIONAL_INFO_2,
                ]}
                isRTL={isRTL}
              /> */}
              <AboutEyePower
                dataLocale={localeData}
                infoSections={[
                  localeData.ABOUT_MY_EYE_POWER_ADDITIONAL_INFO_0,
                  localeData.ABOUT_MY_EYE_POWER_ADDITIONAL_INFO_1,
                  localeData.ABOUT_MY_EYE_POWER_ADDITIONAL_INFO_2,
                ]}
              />
              {/* <FooterDiv
                dataLocale={localeData}
                price={price}
                symbol={productDetailData.price.symbol}
                buttonText={localeData.I_AGREE}
                onClick={() =>
                  addToCartWithOptionsHandler(selectedPackage, addOns.join())
                }
                isDisabled={false}
              /> */}
              <PackageFooter
                dataLocale={localeData}
                price={price}
                symbol={productDetailData.price.symbol}
                buttonText={localeData.CONTINUE}
                onClick={() =>
                  addToCartWithOptionsHandler(selectedPackage, addOns.join())
                }
                isDisabled={false}
                showButton={true}
                isRTL={isRTL}
              />
            </>
          )}
        {packagesError && (
          <ResultPopUp
            message={localeData.OOPS_SOMETHING_WENT_WRONG}
            width="80"
          />
        )}
        {/* </PackagesScreen> */}
        {/* <PackageFooter 
          price={price}
          symbol={productDetailData.price.symbol}
          buttonText={localeData.APPLY_COATING}
          onClick={() => selectPackageHandler(selectedPackage, false)}
          isDisabled={!Boolean(addOns.length)}
        /> */}
      </PackageScreenNew>
    </>
  );
};

export default PackageSection;
