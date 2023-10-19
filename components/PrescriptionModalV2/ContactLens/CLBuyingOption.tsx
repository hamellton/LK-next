import React, { useEffect, useState } from "react";
import { Icons } from "@lk/ui-library";
import { PrimaryButton } from "@lk/ui-library";
import {
  CLBuyingOptionContainer,
  CLBuyingOptionContent,
  CLBuyingOptionFooter,
  ContentContainer,
  HeaderContent,
  IncrementDecrementButton,
  LeftFooterSection,
  LeftSection,
  OneTimeContent,
  OneTimeHeading,
  PowerBoxContainer,
  PowerBoxHeading,
  PowerIncrementDecrement,
  RenderOneTimeOrderContainer,
  RightFooterSection,
  SelectIcon,
  SubscriptionInfoWrapper,
  Text,
} from "./CLBuyingOption.styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { PriceType } from "@/types/priceTypes";
import { TypographyENUM } from "@/types/coreTypes";
import { ComponentSizeENUM, ThemeENUM } from "@/types/baseTypes";
import {
  getCLSolutions,
  updateCLPrescription,
  updateCLQuantity,
  updatePrescriptionPage,
} from "@/redux/slices/prescription";
import { Pages } from "../helper";

const renderBoxCount = (
  text: string,
  boxCount: { leftCount: number; rightCount: number },
  handleBoxCount: (text: string, count: number) => void
) => {
  const totalCount = boxCount.rightCount + boxCount.leftCount;
  const disable =
    text === "right"
      ? boxCount.rightCount === 0 || totalCount === 1
      : boxCount.leftCount === 0 || totalCount === 1;
  return (
    <PowerBoxContainer>
      <PowerBoxHeading>{text} eye</PowerBoxHeading>
      <Text>{text === "left" ? boxCount.leftCount : boxCount.rightCount}</Text>
      <Text color="#99a0a9">Boxes</Text>
      <PowerIncrementDecrement>
        <IncrementDecrementButton
          onClick={() => handleBoxCount(text, -1)}
          disable={disable}
        >
          －
        </IncrementDecrementButton>
        <IncrementDecrementButton onClick={() => handleBoxCount(text, 1)}>
          +
        </IncrementDecrementButton>
      </PowerIncrementDecrement>
    </PowerBoxContainer>
  );
};

const renderOneTimeOrder = (
  boxCount: { leftCount: number; rightCount: number },
  price: PriceType,
  handleBoxCount: (side: string, count: number) => void,
  eye: string
) => {
  return (
    <RenderOneTimeOrderContainer>
      <OneTimeHeading>
        <LeftSection>
          <Icons.RadialSelected />
          <Text fontSize="16px">One time order</Text>
        </LeftSection>
        <Text color="#18cfa8">
          {price.symbol} {price.lkPrice} /box
        </Text>
      </OneTimeHeading>
      <OneTimeContent>
        {eye === "both" ? (
          <>
            {renderBoxCount("left", boxCount, handleBoxCount)}
            {renderBoxCount("right", boxCount, handleBoxCount)}
          </>
        ) : (
          renderBoxCount(eye, boxCount, handleBoxCount)
        )}
      </OneTimeContent>
    </RenderOneTimeOrderContainer>
  );
};

const renderSubscription = (subscriptionInfoJsx: any) => {
  return (
    <SubscriptionInfoWrapper>
      {subscriptionInfoJsx &&
        subscriptionInfoJsx.map(
          (info: { title: string; desc: any[] }, index: number) => {
            return (
              <ContentContainer key={index}>
                <Text>{info.title}</Text>
                {info.desc && info.desc.length === 1 && (
                  <Text color="#616161" fontSize="12px">
                    <p>{info.desc[0]}</p>
                  </Text>
                )}
                {info.desc && info.desc.length > 1 && (
                  <ul style={{ marginLeft: "20px" }}>
                    {info.desc.map((desc, index) => {
                      return (
                        <Text color="#616161" fontSize="12px" key={index}>
                          <li>{desc}</li>
                        </Text>
                      );
                    })}
                  </ul>
                )}
              </ContentContainer>
            );
          }
        )}
    </SubscriptionInfoWrapper>
  );
};

const CLBuyingOption = ({
  handleOnBackClick,
  configData,
  sessionId,
  productId,
  productData,
}: {
  handleOnBackClick: () => void;
  configData: any;
  sessionId: string;
  productId: string | number;
  productData?: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const subscriptionConfig = configData?.SUBSCRIPTION_CONFIG
    ? JSON.parse(configData.SUBSCRIPTION_CONFIG)
    : {};
  const subscriptionInfoJsx = subscriptionConfig.subscriptionInfo;
  const [boxCount, setBoxCount] = useState({
    leftCount: 0,
    rightCount: 0,
  });

  // const productDetailData = useSelector(
  //   (state: RootState) => state.productDetailInfo.productDetailData
  // );
  const { prescription, eye } = useSelector(
    (state: RootState) => state.prescriptionInfo.clPrescriptionData
  );

  useEffect(() => {
    //> setting box values on mount
    if (eye === "both") {
      setBoxCount({ ...boxCount, leftCount: 1, rightCount: 1 });
    } else if (eye === "left") {
      setBoxCount({ ...boxCount, leftCount: 1, rightCount: 0 });
    } else {
      setBoxCount({ ...boxCount, leftCount: 0, rightCount: 1 });
    }
  }, []);
  const handleBoxCount = (side: string, action: number) => {
    if (side === "left") {
      setBoxCount({ ...boxCount, leftCount: boxCount.leftCount + action });
    } else if (side === "right") {
      setBoxCount({ ...boxCount, rightCount: boxCount.rightCount + action });
    }
  };

  const handleOnBtnClick = () => {
    dispatch(updateCLQuantity(boxCount.leftCount + boxCount.rightCount));
    dispatch(
      getCLSolutions({
        sessionId: sessionId,
        productId: productId.toString(),
      })
    );
    const left =
      boxCount.leftCount > 0
        ? { ...prescription.left, boxes: boxCount.leftCount }
        : null;
    const right =
      boxCount.rightCount > 0
        ? { ...prescription.right, boxes: boxCount.rightCount }
        : null;

    const tempPrescriptionObj = { ...prescription, left, right };

    if (!tempPrescriptionObj.left) delete tempPrescriptionObj.left;
    if (!tempPrescriptionObj.right) delete tempPrescriptionObj.right;

    // dispatch(updateCLPrescription({ ...prescription, left, right }));
    dispatch(updateCLPrescription(tempPrescriptionObj));
    dispatch(updatePrescriptionPage(Pages.CL_ADDONS));
  };

  return (
    <CLBuyingOptionContainer>
      <HeaderContent>
        <Icons.BackArrow onClick={handleOnBackClick} />
        CHOOSE BUYING OPTION
      </HeaderContent>

      <CLBuyingOptionContent>
        <>
          {renderOneTimeOrder(
            boxCount,
            productData?.price,
            handleBoxCount,
            eye
          )}
          {renderSubscription(subscriptionInfoJsx)}
        </>
      </CLBuyingOptionContent>
      <CLBuyingOptionFooter>
        <LeftFooterSection>
          <Text color="#18cfa8" fontSize="16px" text="primary">
            {productData?.price?.symbol}{" "}
            {productData?.price?.lkPrice *
              (boxCount.leftCount + boxCount.rightCount)}
          </Text>
          <Text color="#99a0a9" fontSize="12px">
            One time order
          </Text>
        </LeftFooterSection>
        <RightFooterSection>
          <PrimaryButton
            primaryText="CONTINUE"
            font={"Roboto"}
            componentSize={ComponentSizeENUM.medium}
            onBtnClick={handleOnBtnClick}
            id="btn-primary-cl"
            width={"100%"}
            height="35px"
            backgroundColor="#18cfa8"
            theme={ThemeENUM.primary}
          />
        </RightFooterSection>
      </CLBuyingOptionFooter>
    </CLBuyingOptionContainer>
  );
};

export default CLBuyingOption;
