import { Icons } from "@lk/ui-library";
import React, { useState } from "react";
import styled from "styled-components";
import ReturnMethodDetail from "./ReturnMethodDetail";
import { Badge } from "./styles";

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

const Root = styled.div`
  padding: 9px;
  display: flex;
  flex-direction: column;
`;

const Box = styled.div<{ border: boolean }>`
  display: flex;
  flex-direction: row;
  //   justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: ${(props) => (props.border ? "1px solid #ebebeb" : null)};
`;

const InnerBox = styled.div<{ large: boolean }>`
  width: ${(props) => (props.large ? "65%" : "40%")};
`;
const Title = styled.span`
  font-size: 14px;
  line-height: 143%;
  letter-spacing: 0.15px;
  cursor: pointer;
`;

const Img = styled.img`
  cursor: pointer;
  margin: 8px;
  margin-left: 25px;
  margin-right: 20px;
  max-width: 100%;
  vertical-align: middle;
`;

const Ul = styled.ul`
  list-style-type: disc;
  margin-top: 2px;
  margin-bottom: 10px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
`;

const Li = styled.li`
  color: #999999;
  font-size: 10px;
  list-style-type: none;
`;

export default function ReturnOptionType({
  customerWallet,
  modeOfRefund,
  modes,
  returnMethodsUpdated,
  singleItemDetail,
  setIsExpandable,
  setExchangeOpted,
  configData,
  redisData,
  setReturnStepInfo,
}: any) {
  const [selectedInput, setSelectedInput] = useState("");
  const [clicked, setClicked] = useState("");
  const [valueSelected, setValueSelected] = useState("");
  const [exchangeMethod, setExchangeMethod] = useState("");

  const selectedMode = (type: React.SetStateAction<string>) => {
    setClicked(type);
  };

  const handleSubOptionMode = (val: React.SetStateAction<string>) => {
    setSelectedInput(val);
  };

  const handleChange = (id: React.SetStateAction<string>) => {
    // addType(id);
    // let productToReturn = localStorageHelper.getItem('returnProduct') || {};
    // productToReturn = {
    //   ...productToReturn,
    //   returnAction: id,
    // };
    // localStorageHelper.setItem('returnProduct', productToReturn);
    setValueSelected(id);
  };

  return (
    <Root>
      {returnMethodsUpdated &&
        returnMethodsUpdated.length > 0 &&
        returnMethodsUpdated.map((mode: Mode, i: number) => {
          return (
            <div key={mode.id}>
              <Box
                border={i + 1 === returnMethodsUpdated.length ? false : true}
              >
                <InnerBox large={mode.id === "exchange" ? true : false}>
                  <input
                    checked={valueSelected === mode.id}
                    name="return-mode"
                    type="radio"
                    onChange={() => handleChange(mode.id)}
                  />
                  <Img
                    alt="logo"
                    className="margin-8 margin-l25 margin-r20 cursor-pointer"
                    src={mode.src}
                    onClick={() => handleChange(mode.id)}
                  />
                  <Title onClick={() => handleChange(mode.id)}>
                    {mode.title}
                  </Title>
                  {Boolean(mode.badge) && <Badge>{mode.badge}</Badge>}
                </InnerBox>
                {mode.subText && (
                  <>
                    {mode.subText.type === "html" ? (
                      <Ul>
                        {mode.subText.contents.map((content: string, index) => (
                          <Info key={index}>
                            <div>
                              <Icons.Check />
                            </div>
                            <Li
                              key={content}
                              dangerouslySetInnerHTML={{ __html: content }}
                            ></Li>
                          </Info>
                        ))}
                      </Ul>
                    ) : (
                      <Ul>
                        {mode.subText.contents.map((content: string, index) => (
                          <Info key={index}>
                            <div
                              style={{ fontSize: "10px", marginRight: "4px" }}
                            >
                              <Icons.Check />
                            </div>
                            <Li
                              key={content}
                              dangerouslySetInnerHTML={{ __html: content }}
                            ></Li>
                          </Info>
                        ))}
                      </Ul>
                    )}
                  </>
                )}
                {/* {!allModesDisabled && mode.error && (
                  <div className="error">
                    {mode.error.status && (
                      <div className="display-flex align-items-center mr-t8">
                        <img
                          alt="img"
                          src={mode.error.src}
                          style={{
                            width: "16px",
                            height: "16px",
                            flexBasis: "5%",
                          }}
                        />
                        <span
                          className="fsp11 mr-l8 lh-14 text-color_dull_black"
                          dangerouslySetInnerHTML={{
                            __html: mode.error.text,
                          }}
                        ></span>
                      </div>
                    )}
                  </div>
                )} */}
              </Box>
              {/* {valueSelected === "refund" &&
                customerWallet &&
                valueSelected === mode.id && (
                  <div className="display-flex align-items-center justify-content-between margin-t12 margin-b14">
                    <div className="fw-bold green-text-color">
                      {REFUND_WILL_BE_DONE_IN_LKCASH_WALLET}
                    </div>
                    <div>
                      <Button
                        className="margin-r10 text-color-white bg-color-primary no-decoration flex-basis-20 text-center block bora-4 fw700 text-uppercase"
                        style={{ width: "200px" }}
                        onClick={handleContinue}
                      >
                        {CONTINUE}
                      </Button>
                    </div>{" "}
                  </div>
                )} */}
              {valueSelected === mode.id && (
                <ReturnMethodDetail
                  clicked={clicked}
                  customerWallet={customerWallet}
                  //   dataLocale={dataLocale}
                  handleSubOptionMode={handleSubOptionMode}
                  location={location}
                  //   match={match}
                  modeOfRefund={modeOfRefund}
                  modes={valueSelected === "exchange" ? modes : modeOfRefund}
                  //   redisCommonData={redisCommonData}
                  selectedInput={selectedInput}
                  selectedMode={selectedMode}
                  setExchangeMethod={setExchangeMethod}
                  setIsExpandable={setIsExpandable}
                  setExchangeOpted={setExchangeOpted}
                  configData={configData}
                  redisData={redisData}
                  setReturnStepInfo={setReturnStepInfo}
                  //   setFinalStep={setFinalStep}
                  //   setFourthStep={setFourthStep}
                  //   setIsExpandable={setIsExpandable}
                  //   setSelectedSecondaryType={setSelectedSecondaryType}
                  singleItemDetail={singleItemDetail}
                />
              )}
            </div>
          );
        })}
    </Root>
  );
}
