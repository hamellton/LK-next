import {
  ComponentSizeENUM,
  ThemeENUM,
  TypographyENUM,
} from "@/types/baseTypes";
import { PrimaryButton } from "@lk/ui-library";
import React, { useState } from "react";
import {
  Badge,
  BorderBottom,
  Icon,
  Info,
  LeftMarDiv,
  List,
  OuterInput,
  ReturnType,
} from "./styles";

export default function ReturnMode({
  modes,
  setStoreSidebar,
  setIsExpandable,
  setReturnStepInfo,
  localeData,
}: any) {
  const [valueSelected, setValueSelected] = useState("");
  const handleReturnMode = (id: any) => {
    setValueSelected(id);
  };

  const handleContinue = () => {
    // console.log("clicked", valueSelected);
    if (valueSelected === "store_return") {
      setStoreSidebar(true);
    } else if (valueSelected === "schedule_pickup") {
      const getReturnStep = JSON.parse(
        localStorage.getItem("returnStep") || ""
      );
      let returnStep;

      if (getReturnStep.isExpandable === "RETURN_ADD") {
        returnStep = {
          ...getReturnStep,
          thirdStep: true,
          returnMode: localeData.PICKUP_SCHEDULED,
          isExpandable: localeData.EXCHANGE_OR_REFUND,
          returnModeid: valueSelected,
          finalStep: "",
        };
        setIsExpandable(localeData.EXCHANGE_OR_REFUND);
      } else {
        returnStep = {
          ...getReturnStep,
          returnModeid: valueSelected,
        };
        setIsExpandable(getReturnStep.isExpandable);
      }
      setReturnStepInfo(returnStep);

      localStorage.setItem("returnStep", JSON.stringify(returnStep));
    }
  };

  const renderContinueBtn = (id: string, title = "CONTINUE") => {
    if (valueSelected === id) {
      return (
        <PrimaryButton
          primaryText={title}
          font={TypographyENUM.serif}
          componentSize={ComponentSizeENUM.medium}
          onBtnClick={handleContinue}
          id="btn-primary-cl"
          width={"130px"}
          height="35px"
          theme={ThemeENUM.primary}
        />
      );
    }
  };

  return (
    <LeftMarDiv>
      {modes &&
        modes.map((mode: any, i: any) => {
          const disable = Boolean(
            mode.error && mode.error.status === false ? 0 : 1
          );
          return (
            <BorderBottom
              isBottom={i + 1 === modes.length ? false : true}
              key={mode.id}
            >
              <OuterInput disable={disable} key={mode.id}>
                <input
                  checked={valueSelected === mode.id}
                  disabled={disable}
                  type="radio"
                  value={mode.id}
                  onChange={() => handleReturnMode(mode.id)}
                />
                <Icon
                  disable={disable}
                  alt="return-mode"
                  src={mode.src}
                  width="5%"
                  onClick={disable ? () => {} : () => handleReturnMode(mode.id)}
                />
                <Info
                  disable={disable}
                  onClick={disable ? () => {} : () => handleReturnMode(mode.id)}
                >
                  <ReturnType>{mode.title}</ReturnType>
                  {mode.badge && <Badge>{mode.badge}</Badge>}
                  {mode.subText && mode.subText.contents && !disable && (
                    <ul>
                      {mode.subText.contents.map((content: any) => (
                        <List
                          key={content}
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ))}
                    </ul>
                  )}
                  {/* {!allModesDisable && mode.error && (
                    <div className="error margin-b9">
                      {mode.error.status && (
                        <div className="display-flex align-items-center mr-t8 margin-l38 margin-t1">
                          <span
                            className={` ${
                              disable ? "text-red" : "text-color_dull_black"
                            } fsp11 mr-l8 lh-14 fs12`}
                            dangerouslySetInnerHTML={{
                              __html: mode.error.text,
                            }}
                          ></span>
                        </div>
                      )}
                    </div>
                  )} */}
                </Info>
                {renderContinueBtn(mode.id)}
              </OuterInput>
            </BorderBottom>
          );
        })}
    </LeftMarDiv>
  );
}
