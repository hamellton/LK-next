import React from "react";
import {
  LenskartPromiseItem,
  LenskartPromiseItemText,
  LenskartPromiseWrapper,
  Seperator,
} from "./LenskartPromise.styles";
import { ProductDeliveryMobileType } from "./ProductDeliveryMobile.type";

const LenskartPromise = ({
  localeData,
  configData,
  type,
}: ProductDeliveryMobileType) => {
  const { LENSKART_PROMISE, LENSKART_PROMISE_ICONS } = configData;
  const data = LENSKART_PROMISE_ICONS && JSON.parse(LENSKART_PROMISE_ICONS);
  let conditionalData: any[] = [];
  LENSKART_PROMISE &&
    JSON.parse(LENSKART_PROMISE).forEach(
      (flag: any, index: string | number) => {
        if (flag) {
          conditionalData.push(data[index]);
        }
      }
    );

  const convertHttps = (value: string) => {
    return value && value.replace("http:", "https:");
  };

  return (
    <LenskartPromiseWrapper>
      {conditionalData.map((item, index) => {
        const last = index === conditionalData.length - 1;
        // if (type === "Contact Lens" && item.text1 === "1 Year") return null;
        return (
          <div key={index}>
            <LenskartPromiseItem>
              <LenskartPromiseItemText>
                <img
                  alt={`${item.text1} ${item.text2} ${item.text3}`}
                  src={convertHttps(item.icon)}
                  style={{ height: "29px", marginBottom: "10px" }}
                />
              </LenskartPromiseItemText>
              <LenskartPromiseItemText>{item.text1}</LenskartPromiseItemText>
              <LenskartPromiseItemText>{item.text2}</LenskartPromiseItemText>
              <LenskartPromiseItemText>{item.text3}</LenskartPromiseItemText>
              {!last && <Seperator></Seperator>}
            </LenskartPromiseItem>
          </div>
        );
      })}
    </LenskartPromiseWrapper>
  );
};

export default LenskartPromise;
