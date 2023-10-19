import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes } from "@/types/baseTypes";
import { ConfigType, DataType, LocalType } from "@/types/coreTypes";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  A,
  DamnImage,
  DamnText,
  H1,
  Invis,
  Li,
  LkCategory,
  NoRoute,
  RowDamn,
  TextBox,
} from "./PageError.styles";
import { useEffect } from "react";
import { updateProductListLoading } from "@/redux/slices/categoryInfo";

interface PageError extends ConfigType, LocalType {}

interface PageErrorTypes {
  configData: DataType;
  localeData: DataType;
  deviceType: DeviceTypes;
}

const PageError = ({ configData, localeData, deviceType }: PageErrorTypes) => {
  const { PAGE_ERROR_LINKS, PAGE_ERROR_URL } = configData;
  const {
    DAMN,
    NOT_FOUND,
    SEEMS_LIKE_THE_PAGE_CANNOT_BE_FOUND,
    TO_GO_BACK_TO_THE_HOME_PAGE,
    CLICK_HERE,
  } = localeData;
  const subdirectoryPath = useSelector(
    (state: RootState) => state.pageInfo.subdirectoryPath
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(updateProductListLoading(false));
  }, []);

  const pageErrorLinks = PAGE_ERROR_LINKS ? PAGE_ERROR_LINKS : [];
  const pageErrorUrl = PAGE_ERROR_URL ? PAGE_ERROR_URL : "";

  const mobileDevice = deviceType === "mobilesite" ? true : false;

  return (
    <>
      <NoRoute mobileDevice={mobileDevice}>
        <RowDamn mobileDevice={mobileDevice}>
          <H1 mobileDevice={mobileDevice}>{DAMN}</H1>
          <DamnImage mobileDevice={mobileDevice}>
            <img alt={NOT_FOUND} src={pageErrorUrl} />
          </DamnImage>
        </RowDamn>
        <TextBox>
          <DamnText mobileDevice={mobileDevice}>
            {SEEMS_LIKE_THE_PAGE_CANNOT_BE_FOUND}
          </DamnText>
          <DamnText mobileDevice={mobileDevice}>
            <A
              clickHere
              mobileDevice={mobileDevice}
              href={subdirectoryPath || "/"}
            >
              {CLICK_HERE}
            </A>
            {TO_GO_BACK_TO_THE_HOME_PAGE}
          </DamnText>
        </TextBox>
        <LkCategory mobileDevice={mobileDevice}>
          {pageErrorLinks?.map(
            (linksInfo: any) => {
              // if (linksInfo.label !== "Contact Lenses" || showContactLens) {
              return (
                <Li key={linksInfo.key} mobileDevice={mobileDevice}>
                  <A
                    mobileDevice={mobileDevice}
                    href={`${subdirectoryPath}${linksInfo.additionalUrl}`}
                  >
                    {linksInfo.label}
                    <Invis>&gt;</Invis>
                  </A>
                </Li>
              );
            }
            // }
          )}
        </LkCategory>
      </NoRoute>
    </>
  );
};

export default PageError;
