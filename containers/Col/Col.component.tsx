import Renderer from "@/components/Home/Renderer/Renderer.component";
import { DataType } from "@/types/coreTypes";
import { MobilViewWrapper } from "containers/Home/Home.styles";
import React from "react";

const Col = ({
  jsonData,
  configData,
  localeData,
}: {
  jsonData: DataType[];
  configData: DataType;
  localeData: DataType;
}) => {
  return (
    <MobilViewWrapper>
      {jsonData ? (
        <Renderer
          localeData={localeData}
          configData={configData}
          componentData={jsonData}
          categoryCarouselsData={[{}]}
          customCSS={""}
        />
      ) : null}
    </MobilViewWrapper>
  );
};

export default Col;
