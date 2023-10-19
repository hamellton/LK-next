import { DataType } from "@/types/coreTypes";
import { convertHttps } from "containers/ProductDetail/helper";
import React from "react";
import {
  Heading,
  InformationWrapper,
  SubText1,
  SubText2,
  SubText3,
  TextContainer,
} from "./Information.styles";
import { getUserEventData } from "containers/Base/helper";
import { passUtmData } from "@/redux/slices/userInfo";
import { getCookie } from "@/helpers/defaultHeaders";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

interface InfoType {
  info: DataType;
  showTryOn?: boolean;
  country: string;
}

const Information = ({ info, showTryOn = true, country }: InfoType) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOnInformationClick = () => {
    const userEventDataObj = getUserEventData("BUY_ON_CALL");
    dispatch(
      passUtmData({
        sessionId: getCookie(`clientV1_${country}`)?.toString(),
        eventObj: userEventDataObj,
      })
    );
  };

  return (
    <InformationWrapper onClick={handleOnInformationClick}>
      {showTryOn && (
        <TextContainer>
          {info.heading && <Heading>{info.heading}</Heading>}
          {info.sub_text_1 && <SubText1>{info.sub_text_1}</SubText1>}
          {info.sub_text_2 && <SubText2>{info.sub_text_2}</SubText2>}
          {info.sub_text_3 && (
            <SubText3
              dangerouslySetInnerHTML={{ __html: info.sub_text_3 }}
            ></SubText3>
          )}
        </TextContainer>
      )}
      {info.logo && showTryOn && (
        <img
          alt={info.sub_text_2 ? info.sub_text_2 : info.heading}
          src={convertHttps(info.logo)}
        />
      )}
    </InformationWrapper>
  );
};

export default Information;
