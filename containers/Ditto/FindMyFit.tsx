import { authToken } from "../../constants/index";
import { CalculateImage, resetFrameSize } from "@/redux/slices/ditto";
import { AppDispatch, RootState } from "@/redux/store";
import { ComponentSizeENUM, ThemeENUM } from "@/types/baseTypes";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { PrimaryButton } from "@lk/ui-library";
import { Icons } from "@lk/ui-library";
import Error from "containers/Category/Error";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Camera from "./Camera";
import {
  ButtonWrap,
  Cross,
  FrameResult,
  FrameResultContainer,
  FrameResultTitle,
  FrameSizeFace,
  ImgContainer,
  ImgStyle,
  ImgWrap,
  MobileCameraContent,
  PContain,
  ResultRootContainer,
  ResultStatus,
  ResultTitle,
  ResultWrapper,
  Wrapper,
} from "./Ditto.styles";
import { userProperties } from "helpers/userproperties";
import MobileCartHeader from "containers/Cart/MobileCartHeader";
import Base from "containers/Base/Base.component";

export default function FindMyFit({ localeData, configData, headerData }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { deviceType, subdirectoryPath } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const { frameSize } = useSelector((state: RootState) => state.dittoInfo);
  const { filters, categoryData } = useSelector(
    (state: RootState) => state.categoryInfo
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  const [cameraBlockedError, setCameraBlockedError] = useState(false);
  const [retakeCB, setretakeCB] = useState(null);
  const [crossButtonClicked, setCrossButtonClicked] = useState(false);
  const [recommendedFaceShape, setRecommendedFaceShape] = useState("");
  const [frameSizeFilterString, setFrameSizeFilterString] = useState("");
  const [frameSizeType, setframeSizeType] = useState("Heart");
  const [frameShapeId, setFrameShapeId] = useState("");
  const [frameSizeFilterSearch, setFrameSizeFilterSearch] = useState<any>([]);

  const Back = () => {
    // console.log("back");
    Router.back();
  };

  const getImage = (image: any) => {
    // console.log("line 53");

    dispatch(
      CalculateImage({
        image: image,
        authToken: configData?.FRAME_SIZE_AUTH_TOKEN
          ? configData.FRAME_SIZE_AUTH_TOKEN
          : authToken,
      })
    );
  };

  const getFaceShapeRecommendList = (faceShapeRecommd: any) => {
    // console.log("line 64");

    const faceShapeRecommdList =
      faceShapeRecommd && faceShapeRecommd.length
        ? faceShapeRecommd.reduce(
            (acc: any, item: { name: string }, index: number) => {
              acc += index > 0 ? ", " + item.name : item.name;
              return acc;
            },
            ""
          )
        : "";
    return faceShapeRecommdList;
  };
  const isDevelopment = ["preprod"].includes(
    process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase?.() as string
  );

  const frameSizeId = {
    medium: isDevelopment ? "11341" : "11341",
    extraNarrow: isDevelopment ? "23559" : "24072",
    narrow: isDevelopment ? "23557" : "24070",
    wide: isDevelopment ? "23555" : "24069",
    extraWide: isDevelopment ? "23553" : "24071",
  };

  const frameSizeFilterMap: DataType = {
    medium: frameSizeId.medium,
    extraNarrow: frameSizeId.extraNarrow,
    narrow: frameSizeId.narrow,
    wide: frameSizeId.wide,
    extraWide: frameSizeId.extraWide,
  };

  useEffect(() => {
    const pageName = "frame-size-initiated";
    if (!userInfo.userLoading) {
      userProperties(userInfo, pageName, pageInfo, configData);
    }
  }, [userInfo.userLoading]);

  useEffect(() => {
    const pageName = "frame-size-results";
    if (frameSize.result) {
      getUserFaceData();
      userProperties(userInfo, pageName, pageInfo, configData);
    }
  }, [frameSize.result]);

  useEffect(() => {
    const link =
      localStorage.getItem("findMyFit") ||
      "/eyeglasses/marketing/vc-air-bestseller-eyeglasses.html";
   
    if (frameSizeFilterString) {
      let eyeFrameSizeType = getFrameSizeType("eyeframe");
      let sunFrameSizeType = getFrameSizeType("sunglass");
      setframeSizeType(eyeFrameSizeType);
      const frameSizeType =
        categoryData?.categoryType === "sunglasses"
          ? sunFrameSizeType
          : eyeFrameSizeType;
      const frameSizeId: string = frameSizeFilterMap[frameSizeType];
      let frameSizeString =
        frameSizeId && frameSizeFilterString?.indexOf(frameSizeId) > -1
          ? `&frame_size_id=${frameSizeId}`
          : "";
      localStorage.setItem(
        "prefSize_IN",
        JSON.stringify({
          eyeglasses: eyeFrameSizeType,
          reading: eyeFrameSizeType,
          sunglasses: sunFrameSizeType,
        })
      );
      setFrameShapeId(frameSizeString);
    }
   
  }, [frameSizeFilterString]);

  useEffect(()=>{
    if (frameSizeFilterSearch.length > 0) {
      getFindMyFitForSearch();
    }
  },[frameSizeFilterSearch])

  const onClickShow = () => {
    const link =
      localStorage.getItem("findMyFit") ||
      "/eyeglasses/marketing/vc-air-bestseller-eyeglasses.html";
    console.log(link, `${subdirectoryPath}${link}${frameShapeId}`);
    if (link.includes("search=true") || link.includes("similarProductId")) {
      window.location.href = `${subdirectoryPath}${link}${frameShapeId}`;
      console.log(`findMyFitLink${subdirectoryPath}${link}${frameShapeId}`);
    } else {
      const path = link.split("?")[0];
      window.location.href = `${subdirectoryPath}${path}?${frameShapeId}`;
    }
  };

  const getFrameSizeType = (type: string) => {
    const link =
      localStorage.getItem("findMyFit") ||
      "/eyeglasses/marketing/vc-air-bestseller-eyeglasses.html";
    // console.log("line 142");

    const frameSizeConfig = configData?.frameSizeConfig
      ? JSON.parse(configData?.frameSizeConfig)
      : {};

    const { resultConfig } = frameSizeConfig;
    const glassConfig = resultConfig[type] || {};
    const {
      extraNarrowFaceWidth = 130,
      narrowFaceWidth = 133,
      mediumFaceWidth = 137,
      wideFaceWidth = 141,
    } = glassConfig;
    // console.log("line 156");

    const faceWidth = Math.round(frameSize?.result?.result?.faceWidth) || 0;
    console.log("faceWidth", faceWidth);

    if (link.includes("search=true") || link.includes("similarProductId")) {
   
      if (faceWidth <= extraNarrowFaceWidth) return "Extra Narrow";
      if (faceWidth <= narrowFaceWidth) return "Narrow";
      if (faceWidth <= mediumFaceWidth) return "Medium";
      if (faceWidth <= wideFaceWidth) return "Wide";
      return "Extra Wide";
    } else {
      if (faceWidth <= extraNarrowFaceWidth) return "extraNarrow";
      if (faceWidth <= narrowFaceWidth) return "narrow";
      if (faceWidth <= mediumFaceWidth) return "medium";
      if (faceWidth <= wideFaceWidth) return "wide";
      return "extraWide";
    }
  };
  const getFindMyFitForSearch = () => {
    let eyeFrameSizeType = getFrameSizeType("eyeframe");
    setframeSizeType(eyeFrameSizeType);
   
    if (frameSizeFilterSearch.includes(eyeFrameSizeType)) {
      localStorage.setItem(
        "prefSize_IN",
        JSON.stringify({
          eyeglasses: eyeFrameSizeType,
          reading: eyeFrameSizeType,
          sunglasses: eyeFrameSizeType,
        })
      );
      setFrameShapeId(`&frame_size=${eyeFrameSizeType}`);
      // console.log(`&frame_size=${eyeFrameSizeType}`);
    }
  };
  const getUserFaceData = () => {
    const link =
      localStorage.getItem("findMyFit") ||
      "/eyeglasses/marketing/vc-air-bestseller-eyeglasses.html";
    // console.log("line 167");

    const frameAnalysis = configData?.FACE_ANALYSIS
      ? JSON.parse(configData?.FACE_ANALYSIS)
      : {};

    const faceShapes = frameAnalysis?.faceShapes || {};
    const faceShape = frameSize.result?.result?.faceShape?.shape;
    const faceShapeRecommdList =
      getFaceShapeRecommendList(faceShapes[faceShape]) || localeData.ALL_SHAPES;
    setRecommendedFaceShape(faceShapeRecommdList);
    // console.log("line 178");
    // {

    // }
    // else{
    if (filters?.filters) {
      if (link.includes("search=true") || link.includes("similarProductId")) {
        const frameSizeFilters: any =
          filters.filters
            .find((filter) => filter.id === "frame_size")
            ?.options.map((i) => i.id) || {};
        setFrameSizeFilterSearch(frameSizeFilters);
      } else {
        const frameSizeFilters: any =
          filters.filters.find((filter) => filter.id === "frame_size_id") || {};
        setFrameSizeFilterString(
          frameSizeFilters.options
            ? frameSizeFilters.options.reduce(
                (acc: any, item: { id: string }, index: number) => {
                  acc += index > 0 ? ", " + item.id : item.id;
                  return acc;
                },
                ""
              )
            : ""
        );
      }
    }
    // }
  };

  const resetFrame = () => {
    dispatch(resetFrameSize());
    setCrossButtonClicked(true);
  };

  const FaceSvg =
    "https://static1.lenskart.com/media/mobile/img/icon-face-width.svg";
  const FrameSize =
    "https://static1.lenskart.com/media/mobile/img/icon-frame-width.svg";

  return (
    <div>
      {frameSize.errorMessage && !frameSize.isLoading && (
        <Error reset={resetFrame} errorMessage={frameSize.errorMessage} />
      )}
      {!frameSize?.result?.result?.imageUrl ? (
        <Camera
          localeData={localeData}
          cameraContent={
            <MobileCameraContent>
              <Cross onClick={Back}>
                <Icons.Cross />
              </Cross>
              {!cameraBlockedError && (
                <FrameSizeFace
                  src="https://static.lenskart.com/media/desktop/img/15-July-19/boundary_overlay.png"
                  alt="logo"
                />
              )}
            </MobileCameraContent>
          }
          client={deviceType}
          getImage={getImage}
          getRetakeCallback={(retakeCB: any) => {
            setretakeCB(retakeCB);
          }}
          imageFormat="image/jpeg"
          loading={frameSize.isLoading}
          crossButtonClicked={crossButtonClicked}
          updateCustomerCygnusError={false}
          setCrossButtonClicked={setCrossButtonClicked}
          uploadedCygnusData={""}
          photoContent={<div></div>}
          setCameraBlockedError={setCameraBlockedError}
          cameraBlockedError={cameraBlockedError}
          fitMySize={true}
        />
      ) : (
        <>
          <Base
            sessionId={userInfo?.sessionId}
            headerData={headerData}
            configData={configData}
            isExchangeFlow={false}
            localeData={localeData}
            hideFooter
            trendingMenus={configData?.TRENDING_MENUS}
            sprinkularBotConfig={
              configData?.SPRINKLR_BOT_CONFIG &&
              JSON.parse(configData.SPRINKLR_BOT_CONFIG)
            }
            languageSwitchData={configData?.LANGUAGE_SWITCH_DATA}
          >
            <ResultRootContainer>
              <Cross dark={true} onClick={() => Router.push("/")}>
                <Icons.Cross />
              </Cross>
              <ImgContainer>
                <ImgStyle src={frameSize?.result?.result?.imageUrl} alt="img" />
              </ImgContainer>

              <FrameResultContainer>
                <FrameResult>
                  <FrameResultTitle>
                    {localeData?.YOUR_FACE_ANALYSIS}
                  </FrameResultTitle>
                  <ResultWrapper background={false}>
                    <Wrapper>
                      <ImgWrap src={FaceSvg} alt="svg" />
                      <ResultTitle>{localeData?.MY_FACE_WIDTH}</ResultTitle>
                      <ResultStatus>
                        {Math.round(frameSize?.result?.result?.faceWidth)} mm
                      </ResultStatus>
                    </Wrapper>
                    <Wrapper>
                      <ImgWrap src={FrameSize} alt="svg" />
                      <ResultTitle>{localeData?.FRAME_SIZE}</ResultTitle>
                      <ResultStatus>{frameSizeType}</ResultStatus>
                    </Wrapper>
                  </ResultWrapper>
                  <ResultWrapper background={true}>
                    <Wrapper>
                      <PContain>
                        <ResultTitle>{localeData?.YOUR}</ResultTitle>
                        <ResultTitle>{localeData?.FACE_SHAPE}</ResultTitle>
                      </PContain>
                      <ResultStatus>
                        {frameSize?.result?.result?.faceShape?.shape}
                      </ResultStatus>
                    </Wrapper>
                    <Wrapper>
                      <PContain>
                        <ResultTitle>{localeData?.RECOMMENDED}</ResultTitle>
                        <ResultTitle>{localeData?.FACE_SHAPES}</ResultTitle>
                      </PContain>
                      <ResultStatus>{recommendedFaceShape}</ResultStatus>
                    </Wrapper>
                  </ResultWrapper>
                </FrameResult>
                <ButtonWrap>
                  <PrimaryButton
                    primaryText={`Show me frames in my size (${frameSizeType})`}
                    font={TypographyENUM.serif}
                    componentSize={ComponentSizeENUM.medium}
                    onBtnClick={onClickShow}
                    id="btn-primary-cl"
                    width={"100%"}
                    height="35px"
                    theme={ThemeENUM.primary}
                  />
                </ButtonWrap>
              </FrameResultContainer>
            </ResultRootContainer>
          </Base>
        </>
      )}
    </div>
  );
}
