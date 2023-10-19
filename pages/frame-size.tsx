//> Default
import { GetServerSideProps } from "next";

import { fireBaseFunctions, headerFunctions } from "@lk/core-utils";

//> Types
import { ResponseData } from "@/types/apiTypes";

//> Helper
import { createAPIInstance } from "helpers/apiHelper";

//> Constants
import { CONFIG, LOCALE } from "../constants";
import { DeviceTypes } from "@/types/baseTypes";
import FindMyFit from "containers/Ditto/FindMyFit";
import { useEffect } from "react";
import { hideSprinklrBot } from "containers/Base/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const FrameSize = ({ localeData, configData, headerData }: ResponseData) => {
  //> Redux State

  const { deviceType } = useSelector((state: RootState) => state.pageInfo);

  useEffect(() => {
    hideSprinklrBot(deviceType);
  }, []);

  return (
    <>
      {deviceType === DeviceTypes.MOBILE && (
        <FindMyFit
          localeData={localeData}
          configData={configData}
          headerData={headerData}
        />
      )}
    </>
  );
};

export default FrameSize;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const configApi = createAPIInstance({
    url:
      process.env.NEXT_PUBLIC_CONFIG_URL ||
      "https://stage.lenskart.io/api/v1/static/",
  });
  const { data: localeData, error: localeError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: configError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi);
  if (configError.isError || localeError.isError) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      localeData: { ...localeData },
      configData: configData,
      headerData,
    },
  };
};
