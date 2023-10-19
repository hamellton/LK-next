import { DataType } from "@/types/coreTypes";
import React, { useState } from "react";
import {
  AddCTA,
  AddOnCard,
  AddOnCardContent,
  AddOnsContainer,
  AddOnsFooter,
  AddOnsHeader,
  AddOnsModalWrapper,
  CardPrice,
  FooterAmount,
  FooterCTA,
  FooterPrice,
  FooterSubtext,
  FooterText,
  Heading,
  Text,
  Title,
} from "./AddOnsModal.styles";

const AddOnsModal = (props: {
  addOns: any;
  addToCartWithOptionsHandler: any;
  closeModal: any;
  lensPrice: any;
  packageId: string;
  currencySymbol: string;
  localeData: DataType;
}) => {
  const {
    localeData,
    addOns,
    addToCartWithOptionsHandler,
    closeModal,
    lensPrice,
    packageId,
    currencySymbol,
  } = props;
  const { TOTAL, SYMBOL_COLON, CONTINUE, BACK, SELECT_COATING } = localeData;

  const [addOnStr, setAddOnStr] = useState("");
  const [addOnPrice, setAddOnPrice] = useState(0);

  const toggleAddOnList = (id: string, price: number, title: string) => {
    let addOntext = addOnStr,
      addonamount = addOnPrice;
    if (addOntext?.indexOf(id) > -1) {
      addOntext = addOntext.replace(id + ",", "");
      addonamount -= price;
    } else {
      addOntext += id + ",";
      addonamount += price;
    }
    setAddOnStr(addOntext);
    setAddOnPrice(addonamount);
  };

  return (
    <AddOnsModalWrapper>
      <AddOnsHeader>
        <Text onClick={closeModal}> &lt; {BACK.toLowerCase()}</Text>
        <Heading>{SELECT_COATING}</Heading>
        <Text
          className="coating-skip"
          onClick={() => addToCartWithOptionsHandler(packageId, "")}
        >
          Skip
        </Text>
      </AddOnsHeader>

      <AddOnsContainer>
        {addOns?.map((addOn: any, index: React.Key | null | undefined) => {
          return (
            <AddOnCard
              key={index}
              onClick={() =>
                toggleAddOnList(addOn.id, addOn.price.lkPrice, addOn.title)
              }
            >
              {addOn.imageUrl && (
                <div>
                  <img src={addOn.imageUrl} />
                </div>
              )}
              <AddOnCardContent>
                <div>
                  <Title>{addOn.title} </Title>
                  <CardPrice>
                    {addOn.price.symbol}
                    {addOn.price.lkPrice}
                  </CardPrice>
                </div>
                <AddCTA added={addOnStr?.indexOf(addOn.id) === -1}>
                  {addOnStr?.indexOf(addOn.id) === -1 ? "ADD" : "REMOVE"}
                </AddCTA>
              </AddOnCardContent>
            </AddOnCard>
          );
        })}
      </AddOnsContainer>

      <AddOnsFooter>
        <FooterText>
          <span>
            <FooterPrice>
              {TOTAL}
              {SYMBOL_COLON}
            </FooterPrice>
            <FooterAmount>
              {currencySymbol}
              {lensPrice + addOnPrice}
            </FooterAmount>
          </span>
          <FooterSubtext>
            {`Frame + Lens ${addOnStr ? " + Addons" : ""}`}
          </FooterSubtext>
        </FooterText>

        <FooterCTA
          onClick={() => addToCartWithOptionsHandler(packageId, addOnStr)}
        >
          {CONTINUE}
        </FooterCTA>
      </AddOnsFooter>
    </AddOnsModalWrapper>
  );
};

export default AddOnsModal;
