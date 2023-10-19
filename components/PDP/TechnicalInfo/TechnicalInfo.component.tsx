//> Default
import React, { useState } from "react";

//> Packages
import { PDP as PDPComponents, Modal } from "@lk/ui-library";

//> Types
import { TypographyENUM } from "@/types/baseTypes";
import { TechnicalInfoType } from "./TechnicalInfo.types";

import { CloseButton } from "../../Details/CustomModalStyles";
//> Styles
import {
  Back,
  ButtonContainer,
  Header,
  ItemContainer,
  TechInfoItemsContainer,
  Title,
} from "./TechnicalInfo.styles";
import CMS from "containers/CMS/CMS.component";
import { CMSWrapper } from "containers/ProductDetail/ProductDetail.styles";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { removeDomainName } from "helpers/utils";

export default function TechnicalInfoWrapper({
  id,
  data,
  localeData,
  newGeneralProductInfo,
}: TechnicalInfoType) {
  //> Local State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fetchCms, setFetchCms] = useState<string>("");

  const { productDetailData } = useSelector(
    (state: RootState) => state.productDetailInfo
  );
  const subdirectoryPath = useSelector(
    (state: RootState) => state.pageInfo.subdirectoryPath
  );

  const getClick = (fetchUrl: string) => {
    setFetchCms(fetchUrl);
  };

  const techProductInfo = [
    !!productDetailData?.id
      ? {
          name: localeData.PRODUCT_ID || "PRODUCT_ID",
          value: productDetailData.id,
          showAdditionalInfo: false,
          additionalInfoUrl: "",
        }
      : null,
    ...newGeneralProductInfo.slice(0, 5),
    !!productDetailData?.clLegalreqDetails
      ? {
          name: localeData?.LEGAL_DETAILS,
          value: productDetailData?.clLegalreqDetails,
          showAdditionalInfo: false,
        }
      : null,
  ].filter(Boolean);

  return (
    <>
      <PDPComponents.TechnicalInfo
        id={id}
        data={techProductInfo}
        onShowAllClick={() => setShowModal(true)}
        font={TypographyENUM.sans}
        removeDomainName={removeDomainName}
        subdirectoryPath={subdirectoryPath}
      />
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        keyboard
        dialogClassName="tech-dialog"
        dialogCss={`
          width: 700px;
          margin: auto;
          top: 32%;
          transform: translate(0%, -32%) !important;
        `}
      >
        <Modal.Body className="modal-body-height">
          <Header>
            <Back
              visible={fetchCms ? true : false}
              onClick={() => setFetchCms("")}
            >
              Back
            </Back>
            <Title>{!fetchCms ? localeData.TECHNICAL_INFORMATION : null}</Title>
            <ButtonContainer>
              <CloseButton
                isTechnicalInfoModal
                onClick={() => {
                  setShowModal(false);
                  setFetchCms("");
                }}
              >
                <div className="left"></div>
                <div className="right"></div>
              </CloseButton>
            </ButtonContainer>
          </Header>
          <TechInfoItemsContainer>
            {!fetchCms ? (
              data.map((infoItem, idx) => {
                return (
                  infoItem.value && (
                    <ItemContainer key={idx.toString() + infoItem.name}>
                      <PDPComponents.TechnicalInfoItem
                        index={idx}
                        getClick={getClick}
                        {...infoItem}
                      />
                    </ItemContainer>
                  )
                );
              })
            ) : (
              <CMSWrapper>
                <CMS cmsURL={fetchCms} fetchData={true} />
              </CMSWrapper>
            )}
          </TechInfoItemsContainer>
        </Modal.Body>
      </Modal>
    </>
  );
}
