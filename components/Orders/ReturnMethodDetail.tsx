import { addToCartNoPower } from "@/redux/slices/cartInfo";
import { cartData } from "@/redux/slices/orderInfo";
import { fetchPackageSteps } from "@/redux/slices/packagesInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { APIMethods } from "@/types/apiTypes";
import {
  ComponentSizeENUM,
  ThemeENUM,
  TypographyENUM,
} from "@/types/baseTypes";
import { ProductDetailType } from "@/types/productDetails";
import { pdpFunctions } from "@lk/core-utils";
import { PrimaryButton } from "@lk/ui-library";
import { APIService } from "@lk/utils";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import { exchangeHeaders, headerArr } from "helpers/defaultHeaders";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import PackageSection from "../PDP/Package/Package.component";
import CollectionPage from "./CollectionPage/CollectionPage";
import CollectionPageSideBar from "./CollectionPage/CollectionPage";
import { returnConfig } from "./returnConfig";
import { BackdropContainer, Badge } from "./styles";

interface Mode {
  id: string;
  src: string | undefined;
  title:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
  badge:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
  subText: { type: string; contents: any[] };
  error: { status: any; src: string | undefined; text: any };
}

const SubOption = styled.div`
  margin: 8px;
  padding-left: 48px;
  diplay: flex;
`;

const Box = styled.div<{ border: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: ${(props) => (props.border ? "1px solid #ebebeb" : null)};
`;

const Label = styled.label`
  width: 65%;
  display: flex;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 700;
  /* } */
`;
const InputOuter = styled.div`
  align-items: center;
  display: flex;
  margin-right: 20px;
`;
const Img = styled.img<{ error: boolean }>`
  margin-right: 16px;
  cursor: ${(props) => (props.error ? "" : "pointer")};
`;
const DivError = styled.div<{ error: boolean }>`
  cursor: ${(props) => (props.error ? "" : "pointer")};
`;
const DivFlex = styled.div`
  display: flex;
  align-items: center;
`;
const Title = styled.span<{ error: boolean }>`
  color: ${(props) => (props.error ? "#999999" : "")};
  font-weight: 500;
`;
const ErrorSpan = styled.span`
  color: #f00;
`;

const SubText = styled.p`
  font-weight: 500;
  color: #999999;
  font-size: 12px;
  margin: 0 0 10px;
`;

const ErrorDiv = styled.div`
  width: 35%;
`;
export default function ReturnMethodDetail({
  modes,
  // modeOfRefund,
  // clicked,
  // customerWallet,
  // handleSubOptionMode,
  // singleItemDetail,
  // selectedInput,
  // selectedMode,
  setExchangeMethod,
  setIsExpandable,
  setExchangeOpted,
  setReturnStepInfo,
  configData,
  redisData,
}: any) {
  const dispatch = useDispatch<AppDispatch>();

  const [value, setValue] = useState("");
  const [collectionUrl, setCollectionUrl] = useState<string>();
  const [sideBar, setSideBar] = useState<boolean>(false);
  const [showPackageScreen, setShowPackageScreen] = useState(false);
  const [productDetail, setProductDetail] = useState<any>(null);

  const { currentReturnItem } = useSelector(
    (state: RootState) => state.orderInfo
  );
  const { subdirectoryPath, country } = useSelector(
    (state: RootState) => state.pageInfo
  );

  const closeSidebar = () => {
    setSideBar(false);
  };

  useEffect(() => {
    const pid = currentReturnItem.productId;
    const returnOrderId = getCookie("postcheckOrderId") || null;
    const returnItemId = getCookie("postcheckItemId") || null;
    const postcheckParams = [];
    if (returnOrderId) {
      postcheckParams.push({
        key: "orderId",
        value: [typeof returnOrderId === "string" ? returnOrderId : ""],
      });
    }
    if (returnItemId) {
      postcheckParams.push({
        key: "itemId",
        value: [typeof returnItemId === "string" ? returnItemId : ""],
      });
    }
    (async () => {
      const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`)
        .setHeaders([...headerArr, ...exchangeHeaders])
        .setMethod(APIMethods.GET);
      api.sessionToken = `${getCookie(`clientV1_${country}`)}`;
      const { data: prodDetail, error: err } =
        await pdpFunctions.getProductDetails(
          pid,
          api,
          subdirectoryPath,
          postcheckParams
        );
      setProductDetail(prodDetail.detailData || null);
    })();
    return () => {};
  }, [setProductDetail, currentReturnItem.productId, subdirectoryPath]);

  const addToCartNoPowerHandler = (powerType?: string) => {
    if (powerType) {
      const reqObj: {
        pid: number;
        sessionId: string;
        powerType: string;
        orderId?: number;
        itemId?: number;
      } = {
        pid: productDetail.id,
        powerType: powerType,
        sessionId: `${getCookie(`clientV1_${country}`)}`,
      };
      let returnOrderId, returnItemId;
      // if(isExchangeFlow){
      returnOrderId = getCookie("postcheckOrderId") || null;
      returnItemId = getCookie("postcheckItemId") || null;
      // }
      if (returnOrderId)
        reqObj.orderId = parseInt(
          typeof returnOrderId === "string" ? returnOrderId : ""
        );
      if (returnItemId)
        reqObj.itemId = parseInt(
          typeof returnItemId === "string" ? returnItemId : ""
        );
      dispatch(addToCartNoPower(reqObj));
      setShowPackageScreen(false);
    } else {
      const reqObj: {
        pid: number;
        sessionId: string;
        orderId?: number;
        itemId?: number;
      } = {
        pid: productDetail.id,
        sessionId: `${getCookie(`clientV1_${country}`)}`,
      };
      let returnOrderId, returnItemId;
      // if(isExchangeFlow){
      returnOrderId = getCookie("postcheckOrderId") || null;
      returnItemId = getCookie("postcheckItemId") || null;
      // }
      if (returnOrderId)
        reqObj.orderId = parseInt(
          typeof returnOrderId === "string" ? returnOrderId : ""
        );
      if (returnItemId)
        reqObj.itemId = parseInt(
          typeof returnItemId === "string" ? returnItemId : ""
        );
      dispatch(addToCartNoPower(reqObj));
    }
  };

  const handleSelectType = (id: any) => {
    setValue(id);
    // let productToReturn = localStorageHelper.getItem('returnProduct') || {};
    // productToReturn = {
    //   ...productToReturn,
    //   returnMethod: id,
    // };
    // localStorageHelper.setItem('returnProduct', productToReturn);
  };

  const handleContinue = () => {
    // let returnStep = {};
    // console.log(value);

    if (value === "CHANGELENS") {
      const reqObj = {
        classification: productDetail.classification,
      };
      dispatch(fetchPackageSteps(reqObj));
      setShowPackageScreen(true);
    } else if (value === "NEWPRODUCT") {
      // console.log("in");

      setCookie("exchangeMethod", value);
      localStorage.setItem("exchangeNP", "true");
      setExchangeMethod(configData.DIFFERENT_FRAME_DIFFERENT_LENS);
      const returnStep = JSON.parse(localStorage.getItem("returnStep") || "");
      let _returnStep = {
        ...returnStep,
        exchangeMethod: value,
        isExpandable: "Shipping Address",
        exchangeMethodText: configData.DIFFERENT_FRAME_DIFFERENT_LENS,
        fifthStep: false,
        fourthStep: true,
        finalStep: "",
      };
      localStorage.removeItem("refundMethod");
      localStorage.setItem(
        "exchangeMethod",
        configData.DIFFERENT_FRAME_DIFFERENT_LENS
      );
      setSideBar(true);
      setExchangeOpted(configData.DIFFERENT_FRAME_DIFFERENT_LENS);
      localStorage.setItem("returnStep", JSON.stringify(_returnStep));

      // For making collection url same as msite
      let brandType;
      const exchangeCatalog = returnConfig?.exchangeCatalog;
      let productTypeValue =
        currentReturnItem &&
        currentReturnItem.item &&
        currentReturnItem.item.productTypeValue;
      const brandName =
        currentReturnItem &&
        currentReturnItem.item &&
        currentReturnItem.item.brandName;
      //   if (exchangeCatalog) {
      //     productTypeValue = productTypeValue.toLowerCase();
      //     const productTypeConfig = exchangeCatalog[productTypeValue];
      //     if (productTypeConfig) {
      //       const keys = Object.keys(productTypeConfig);
      //       let key;
      //       for (let i = 0, len = keys.length; i < len; i++) {
      //         key = keys[i];
      //         if (productTypeConfig[key].includes(brandName)) {
      //           brandType = key;
      //           break;
      //         }
      //       }
      //     }
      //   }
      //   setCollectionUrl(
      //     `exchange-${brandType}-${productTypeValue.replace(" ", "-")}`
      //   );
    } else {
      dispatch(
        cartData({
          sessionId: `${getCookie(`clientV1_${country}`)}`,
          exchangeMethod: "SAMEPRODUCT",
          itemId: Number(getCookie("postcheckItemId")),
          orderId: Number(getCookie("postcheckOrderId")),
        })
      );
      localStorage.setItem("exchangeMethod", "SAMEPRODUCT");
      const returnStep = JSON.parse(localStorage.getItem("returnStep") || "");
      const _returnStep = {
        ...returnStep,
        exchangeMethod: "SAMEPRODUCT",
        exchangeMethodText: configData.SAME_FRAME_SAME_LENS,
        fourthStep: true,
        isExpandable: "Shipping Address",
      };
      setReturnStepInfo(_returnStep);
      localStorage.setItem("returnStep", JSON.stringify(_returnStep));
      setExchangeOpted("SAMEPRODUCT");
      setIsExpandable("Shipping Address");
    }
  };

  const renderContinueBtn = (id: any) => {
    let buttonText = "";
    if (value === id) {
      if (value === "CHANGELENS") buttonText = "CHOOSE LENS";
      else if (value === "NEWPRODUCT") buttonText = "CHOOSE FRAME & LENS";
      else buttonText = "CONTINUE";
      return (
        <div>
          {/* <Button onClick={handleContinue} text={buttonText} width={100} /> */}
          <PrimaryButton
            primaryText={buttonText}
            font={TypographyENUM.serif}
            componentSize={ComponentSizeENUM.medium}
            onBtnClick={handleContinue}
            id="btn-primary-cl"
            width={"80%"}
            height="35px"
            theme={ThemeENUM.primary}
          />
        </div>
      );
    }
  };

  return (
    <div>
      <SubOption>
        {modes &&
          modes.map((mode: Mode, i: number) => {
            return (
              <Box key={mode.id} border={i === modes.length ? false : true}>
                <Label htmlFor={mode.id} title={mode.id}>
                  <InputOuter>
                    {!mode.error.status ? (
                      <input
                        checked={value === mode.id}
                        type="radio"
                        value={mode.id}
                        onChange={() => handleSelectType(mode.id)}
                      />
                    ) : (
                      <input disabled type="radio" />
                    )}
                  </InputOuter>
                  {/* <div className="success display-flex"> */}
                  <DivFlex>
                    <Img
                      error={mode.error.status ? true : false}
                      src={mode.src}
                      onClick={
                        mode.error.status
                          ? () => {}
                          : () => handleSelectType(mode.id)
                      }
                    />
                    <DivError
                      error={mode.error.status ? true : false}
                      onClick={
                        mode.error.status
                          ? () => {}
                          : () => handleSelectType(mode.id)
                      }
                    >
                      <DivFlex>
                        <Title error={mode.error.status ? true : false}>
                          {mode.title}
                        </Title>
                        <div>
                          {Boolean(mode.badge) && <Badge>{mode.badge}</Badge>}
                        </div>
                      </DivFlex>
                      <div>
                        {mode.subText.contents && !mode.error.status && (
                          <SubText>
                            {mode.subText.contents[0]}
                            <br />
                            {mode.subText.contents[1] &&
                              mode.subText.contents[1]}
                          </SubText>
                        )}
                        {/* {!allModesDisabled && mode.error && ( */}
                        {mode.error && (
                          <div>
                            {mode.error.status && (
                              <DivFlex>
                                <ErrorSpan
                                  dangerouslySetInnerHTML={{
                                    __html: mode.error.text,
                                  }}
                                ></ErrorSpan>
                              </DivFlex>
                            )}
                          </div>
                        )}
                      </div>
                    </DivError>
                    {/* <div className="display-flex flex-direction-column mr-l15"></div> */}
                  </DivFlex>
                </Label>
                <ErrorDiv>
                  {!mode.error.status && renderContinueBtn(mode.id)}
                </ErrorDiv>
              </Box>
            );
          })}
        {productDetail && (
          <PackageSection
            configData={configData}
            localeData={redisData}
            id={productDetail.id}
            isExchangeFlow={true}
            sessionId={`${getCookie(`clientV1_${country}`)}`}
            productDetailData={productDetail}
            addToCartNoPowerHandler={addToCartNoPowerHandler}
            showPowerTypeModal={showPackageScreen}
            onPowerModalClose={(status: boolean) =>
              setShowPackageScreen(status)
            }
          />
        )}
      </SubOption>
      <BackdropContainer disabled={sideBar} />
      {sideBar ? (
        <CollectionPage closeSidebar={closeSidebar} configData={configData} />
      ) : null}
    </div>
  );
}
