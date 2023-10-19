import { HomeWrapper, FooterWrapper, MobilViewWrapper } from "./Home.styles";
import Router from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Renderer from "@/components/Home/Renderer/Renderer.component";
import { DataType, LocaleDataType } from "@/types/coreTypes";
import { userProperties } from "helpers/userproperties";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes } from "@/types/baseTypes";
import {
  ALGOLIA_RECENT_SEARCHES,
  LAST_PAGE_VISIT_NAME,
} from "@/constants/index";
// import { homePageData } from "containers/Base/footerData";
import { PhoneCaptureModal, Modal } from "@lk/ui-library";
import { extractUtmParams, localStorageHelper } from "@lk/utils";
import { phoneCaptureData } from "@/redux/slices/userInfo";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { carouselObserver, gaBannerImgObserver } from "helpers/utils";
import { homeVirtualPageView } from "helpers/virtualPageView";

export interface HomePageDataType {
  homePageData: DataType;
  configData: any;
  userInfo: any;
  pageInfo: any;
  className: string;
  localeData: LocaleDataType;
}

const Home = ({
  configData,
  homePageData,
  userInfo,
  pageInfo,
  className,
  localeData,
}: HomePageDataType) => {
  const dispatch = useDispatch<AppDispatch>();
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const phoneCapture = useSelector(
    (state: RootState) => state.userInfo.phoneCapture
  );
  let componentData =
    deviceType === DeviceTypes.DESKTOP
      ? homePageData?.homePageData?.homeData?.sections
      : homePageData?.result;
  let footers =
    deviceType === DeviceTypes.DESKTOP
      ? homePageData?.homePageData?.homeData?.footers
      : undefined;
  let categoryCarouselsData =
    deviceType === DeviceTypes.DESKTOP
      ? homePageData?.categoryCarouselsData?.data?.result
      : undefined;
  let customCSS =
    deviceType === DeviceTypes.DESKTOP
      ? homePageData?.homePageData?.homeData?.customCSS
      : undefined;
  let pageName: string =
    pageInfo.pageType === "SPECIAL_CATEGORY" ? "l1-page" : "home-page";

  useEffect(() => {
    localStorage.setItem(LAST_PAGE_VISIT_NAME, pageName);
  }, []);

  useEffect(() => {
    if (!userInfo.userLoading)
      userProperties(userInfo, pageName, pageInfo, configData);
    if (userInfo.isLogin) {
      localStorage.setItem(ALGOLIA_RECENT_SEARCHES, JSON.stringify([]));
      if (
        userInfo.userDetails?.searches &&
        userInfo.userDetails?.searches.length > 0
      ) {
        localStorage.setItem(
          ALGOLIA_RECENT_SEARCHES,
          JSON.stringify(userInfo.userDetails?.searches)
        );
      }
      if (userInfo.userDetails?.hasPlacedOrder) {
        sessionStorageHelper.setItem(
          "hasPlacedOrder",
          userInfo.userDetails?.hasPlacedOrder
        );
      }
    }
  }, [userInfo.userLoading, pageInfo]);

  const [inputMobileNumber, setInputMobileNumber] = useState<string>("");
  const [isError, setIsError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [fireViewListGA, setFireViewListGA] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  let showPhoneCapModal = () => {
    if (window.scrollY > 20)
      timeoutId.current = setTimeout(() => {
        setShowModal(!localStorageHelper.getItem("repeatFlowPhoneCapture"));
      }, 3000);
  };

  useEffect(() => {
    window.addEventListener("scroll", showPhoneCapModal, { passive: true });

    setTimeout(() => {
      gaBannerImgObserver("0px", window, userInfo, pageInfo);
      carouselObserver(userInfo, pageInfo);
    }, 200);

    return () => {
      clearTimeout(timeoutId.current);
      window.removeEventListener("scroll", showPhoneCapModal);
    };
  }, []);

  useEffect(() => {
    if (fireViewListGA) {
      const utmParameters =
        typeof window !== "undefined" &&
        window &&
        extractUtmParams(window.location.search);
      homeVirtualPageView(userInfo, utmParameters, pageInfo, cartData);
    }
  }, [fireViewListGA]);

  useEffect(() => {
    if (!userInfo?.userLoading) {
      setTimeout(() => {
        setFireViewListGA(true);
      }, 0);
    }
  }, [pageInfo, userInfo]);

  const handleCloseModal = () => {
    localStorageHelper.setItem("repeatFlowPhoneCapture", true);
    setShowModal(false);
  };

  const handleInputChange = (ev: any) => {
    if (!isNaN(ev.target.value)) {
      setInputMobileNumber(ev.target.value);
      setIsError("");
    }
  };

  useEffect(() => {
    if (phoneCapture.isError) {
      setIsError(phoneCapture.errorMessage);
    }
  }, [phoneCapture]);

  const jsonData = JSON.parse(configData.PHONE_CAPTURE_POP_UP);

  const handleShopNow = () => {
    if (pageInfo.country === "sg") {
      Router.push(jsonData.REDIRECT_URL);
    }
  };

  const handleUnlockButton = () => {
    const objPayload = {
      sessionId: userInfo.sessionId,
      phone: inputMobileNumber,
      created_at: new Date(),
      UTM: window.location.search,
      device_id: pageInfo.platform,
      platform: pageInfo.deviceType,
      is_verified: 0,
      phoneCode: pageInfo.countryCode,
    };
    dispatch(phoneCaptureData(objPayload));
  };

  const desktopHome = (
    <>
      <HomeWrapper>
        <PhoneCaptureModal
          dataLocale={jsonData}
          value={inputMobileNumber}
          showModal={showModal}
          handleSubmit={handleUnlockButton}
          onInputChange={handleInputChange}
          closeModal={handleCloseModal}
          isInvalidNumber={isError}
          deviceType={deviceType}
          offerUnlocked={phoneCapture.phoneCapturedSuccess}
          countryCode={pageInfo.countryCode}
          handleShopNow={handleShopNow}
          isLoading={phoneCapture.isLoading}
          dialogCss={
            "max-width: 900px; width:100%; margin-top:15%;border-radius:6px;"
          }
        />
        {componentData && (
          <Renderer
            localeData={localeData}
            configData={configData}
            componentData={componentData}
            categoryCarouselsData={categoryCarouselsData}
            customCSS={customCSS}
            className={className}
          />
        )}
        {footers && (
          <FooterWrapper>
            <Renderer
              localeData={localeData}
              configData={configData}
              componentData={footers}
              categoryCarouselsData={[]}
              customCSS={customCSS}
              className={className}
            />
          </FooterWrapper>
        )}
      </HomeWrapper>
    </>
  );
  const msiteHome = (
    <MobilViewWrapper>
      <PhoneCaptureModal
        dataLocale={jsonData}
        value={inputMobileNumber}
        showModal={showModal}
        handleSubmit={handleUnlockButton}
        onInputChange={handleInputChange}
        closeModal={handleCloseModal}
        isInvalidNumber={isError}
        deviceTye={deviceType}
        offerUnlocked={phoneCapture.phoneCapturedSuccess}
        countryCode={pageInfo.countryCode}
        handleShopNow={handleShopNow}
        isLoading={phoneCapture.isLoading}
      />
      {componentData && (
        <Renderer
          localeData={localeData}
          configData={configData}
          componentData={componentData}
          categoryCarouselsData={categoryCarouselsData}
          customCSS={customCSS}
          country={pageInfo.country}
          className={className}
        />
      )}
    </MobilViewWrapper>
  );
  return (
    <>
      {deviceType === DeviceTypes.DESKTOP && desktopHome}
      {deviceType === DeviceTypes.MOBILE && msiteHome}
    </>
  );
};

export default Home;
