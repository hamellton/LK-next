import { APIMethods } from "@/types/apiTypes";
import { RootState } from "@/redux/store";
import { cmsFunctions } from "@lk/core-utils";
import { CommonLoader } from "@lk/ui-library";
import { APIService } from "@lk/utils";
import { getCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FlexWrapper, MarginBottom } from "pageStyles/styles";
import { DeviceTypes } from "@/types/baseTypes";
import {cmsURL as cmsBasePath} from '../../constants'

interface CSMType {
  cmsURL?: string;
  fetchData?: boolean;
  cmsData?: string;
}
const extraCmsHeaders = [
  { key: "sec-fetch-site", value: "same-origin" },
  { key: "sec-fetch-mode", value: "cors" },
  { key: "sec-fetch-dest", value: "empty" },
  { key: "sec-ch-ua", value: "empty" },
  { key: "email", value: "" },
  { key: "phone", value: "" },
  { key: "Accept", value: "*/*" },
  { key: "Accept-Encoding", value: "*/*" },
  { key: "Host", value: "sa.lenskart.com" },
];
const CMS = ({ cmsURL, fetchData = false, cmsData }: CSMType) => {
  const { country, deviceType } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const [currentCmsData, setCurrentCMSData] = useState(
    cmsData ? cmsData : false
  );
  const [showCMSData, setShowCMSData] = useState(cmsData ? true : false);
  // const {subdirectoryPath} = useSelector((state: RootState) => s)
  const sessionId = getCookie(`clientV1_${country}`)?.toString() || "";
  useEffect(() => {
    const getCMSData = async () => {
      const url = cmsURL
        ?.replace("https://sa.lenskart.com/", "")
        .replace("https://www.lenskart.com/", "");
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setHeaders(headerArr);
      // const cmsApi = new APIService(``);
      const cmsApi = new APIService(`${cmsBasePath}`);
      cmsApi.sessionToken = sessionId;
      // cmsApi.setMethod(APIMethods.GET);
      cmsApi
        .setHeaders([...headerArr, ...extraCmsHeaders])
        .setMethod(APIMethods.GET);
      if (url) {
        const { data, error } = await cmsFunctions.fetchCMSDataWithURL(
          [url],
          api,
          sessionId,
          cmsApi
        );
        if (!error?.isError) {
          setCurrentCMSData(data);
          setShowCMSData(true);
        }
      }
    };
    if (fetchData && cmsURL) {
      getCMSData();
    } else {
      if (cmsData) {
        setCurrentCMSData(cmsData);
        setShowCMSData(true);
      }
    }
  }, [cmsData, cmsURL, fetchData]);

  return (
    <MarginBottom isMobile={deviceType === DeviceTypes.MOBILE}>
      {!showCMSData && <CommonLoader show={!showCMSData} />}
      {showCMSData && (
        <FlexWrapper
          dangerouslySetInnerHTML={{ __html: currentCmsData }}
        ></FlexWrapper>
      )}
    </MarginBottom>
  );
};

export default CMS;
