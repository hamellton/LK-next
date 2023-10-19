import React, { useEffect, useState } from "react";
import {
  AddOnContent,
  AddOnRightSection,
  ButtonQtyContainer,
  CLAddOnCardContainer,
  CLBuyingOptionContainer,
  CLBuyingOptionContent,
  CLBuyingOptionFooter,
  HeaderContent,
  Image,
  ImageContainer,
  IncrementDecrementButton,
  LeftFooterSection,
  OfferLabel,
  RightFooterSection,
  Text,
} from "./CLBuyingOption.styles";
import { Icons, Spinner } from "@lk/ui-library";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { PrimaryButton, Toast } from "@lk/ui-library";
import { TypographyENUM } from "@/types/coreTypes";
import { ComponentSizeENUM, DeviceTypes, ThemeENUM } from "@/types/baseTypes";
import {
  addToCartCLItems,
  addToCartNoPower,
  reqSaveToCLObjType,
  saveToCartCL,
} from "@/redux/slices/cartInfo";
import { getCookie } from "@/helpers/defaultHeaders";
import {
  resetPrescriptionData,
  setPrescriptionPageStatus,
} from "@/redux/slices/prescription";

const CLAddOnCard = ({
  item,
  index,
  firstSolutionOffer,
  symbol,
  handleSelectAddOns,
  quantitySelected,
}: {
  item: {
    id: string;
    thumbnailImage: string;
    fullName: string;
    price: number;
    qty: number;
  };
  index: number;
  firstSolutionOffer: string;
  symbol: string;
  handleSelectAddOns: (id: string, qty: number) => void;
  quantitySelected: number | undefined;
}) => {
  return (
    <CLAddOnCardContainer>
      <ImageContainer url={item.thumbnailImage}>
        {/* <Image src={item.thumbnailImage} alt="thumbnail-image" /> */}
      </ImageContainer>
      <AddOnContent>
        <Text>{item.fullName}</Text>
        {index === 0 && firstSolutionOffer && (
          <Text color="#fd6b0b" fontSize="12px">
            {firstSolutionOffer}
          </Text>
        )}
      </AddOnContent>
      <AddOnRightSection>
        <Text color="#18cfa8" fontSize="16px">
          {symbol} {item.price}
        </Text>
        <ButtonQtyContainer>
          <IncrementDecrementButton
            onClick={() => handleSelectAddOns(item.id, -1)}
            disable={quantitySelected === 0}
          >
            -
          </IncrementDecrementButton>
          <Text>{quantitySelected}</Text>
          <IncrementDecrementButton
            onClick={() => handleSelectAddOns(item.id, 1)}
            disable={quantitySelected === item.qty}
          >
            +
          </IncrementDecrementButton>
        </ButtonQtyContainer>
      </AddOnRightSection>
    </CLAddOnCardContainer>
  );
};

const CLAddOns = ({
  handleOnBackClick,
  configData,
  sessionId,
  productId,
  localeData,
  closeSlider,
  handleShowPrescription,
}: {
  handleOnBackClick: () => void;
  configData: any;
  sessionId: string;
  productId: string | number;
  localeData: any;
  closeSlider: (props: boolean) => void;
  handleShowPrescription: (props: boolean) => void;
}) => {
  const { quantity, eye, prescription } = useSelector(
    (state: RootState) => state.prescriptionInfo.clPrescriptionData
  );
  const { errorMessage } = useSelector(
    (state: RootState) => state.prescriptionInfo
  );
  const { country } = useSelector((state: RootState) => state.pageInfo);
  const { data, isLoading, isError } = useSelector(
    (state: RootState) =>
      state.prescriptionInfo.clPrescriptionData.clSolutionsData
  );
  const cartInfo = useSelector((state: RootState) => state.cartInfo);

  const { symbol, lkPrice } = useSelector(
    (state: RootState) =>
      state?.productDetailInfo?.productDetailData?.price || {
        symbol: "",
        lkPrice: 0,
      }
  );
  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);

  const [addOnsPrice, setAddOnsPrice] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (selectedAddOns) {
      const priceaddons = selectedAddOns?.reduce(
        (acc, item) => acc + item.qty * item.price,
        0
      );
      setAddOnsPrice(priceaddons);
    }
  }, [selectedAddOns]);

  useEffect(() => {
    if (cartInfo?.cartIsError) {
      setShowToast(true);
      const timer = setTimeout(() => {
        closeSlider(false);
        handleShowPrescription(false);
        clearTimeout(timer);
      }, 5000);
    }
  }, [cartInfo?.cartIsError]);

  useEffect(() => {
    let temp = data?.map(
      (item: { id: string; price: number }, index: number) => {
        if (index === 0) return { id: item.id, qty: 1, price: item.price };
        return { id: item.id, qty: 0, price: item.price };
      }
    );
    setSelectedAddOns(temp);
  }, [data]);

  const dispatch = useDispatch<AppDispatch>();
  const { CONTACTS_OFFER } = configData;
  const contactsOffer = (CONTACTS_OFFER && JSON.parse(CONTACTS_OFFER)) || {};
  const buyOptionOffer =
    contactsOffer.buy_option_offer ||
    localeData?.LENS_SOLUTION_FOR_YOUR_CONTACT_LENS;
  const firstSolutionOffer =
    contactsOffer.first_solution_offer || localeData?.RECOMMENDED;

  const handleSelectAddOns = (id: string, qty: number) => {
    const selected = selectedAddOns.find((addon) => addon.id === id);
    selected.qty += qty;

    setSelectedAddOns([
      ...selectedAddOns.filter((addon) => addon.id !== id),
      selected,
    ]);
  };

  const handleSubmit = () => {
    let relatedItems: {
      productId?: string;
      quantity?: number;
    }[] = [];

    selectedAddOns?.forEach((item) => {
      if (item.qty > 0) {
        relatedItems.push({ productId: item.id, quantity: item.qty });
      }
    });
    const reqObj = {
      displayPrice: lkPrice * quantity,
      isBothEye: eye === "both" ? "Y" : "N",
      prescription: prescription,
      productId: productId.toString(),
      quantity: quantity,
      sessionId: `${getCookie(`clientV1_${country}`)}`,
      relatedItems: relatedItems,
    };
    // dispatch(saveToCartCL(reqObj))
    dispatch(addToCartCLItems(reqObj));
    // dispatch(addToCartNoPower(reqObj))
  };

  useEffect(() => {
    if (errorMessage && !data) {
      handleSubmit();
    }
  }, [errorMessage]);

  return (
    <CLBuyingOptionContainer>
      {showToast && (
        <Toast
          text={cartInfo?.cartErrorMessage || "Failed to add product in cart"}
          timeOut={5000}
          hideFn={() => {
            setShowToast(false);
          }}
          width={"90%"}
        />
      )}
      <HeaderContent>
        <Icons.BackArrow onClick={handleOnBackClick} />
        CHOOSE YOUR ADD-ONS
      </HeaderContent>
      <OfferLabel>{buyOptionOffer}</OfferLabel>
      <CLBuyingOptionContent>
        {!errorMessage && data ? (
          data?.map(
            (
              item: {
                id: string;
                thumbnailImage: string;
                fullName: string;
                price: number;
                qty: number;
              },
              index: number
            ) => {
              return (
                <CLAddOnCard
                  key={index}
                  item={item}
                  index={index}
                  firstSolutionOffer={firstSolutionOffer}
                  symbol={symbol}
                  handleSelectAddOns={(id, qty) => handleSelectAddOns(id, qty)}
                  quantitySelected={
                    selectedAddOns?.find((addon) => addon?.id === item?.id)?.qty
                  }
                />
              );
            }
          )
        ) : (
          <Spinner show />
        )}
      </CLBuyingOptionContent>
      <CLBuyingOptionFooter>
        <LeftFooterSection>
          <Text color="#18cfa8" fontSize="16px" text="primary">
            {symbol} {lkPrice * quantity + addOnsPrice}
          </Text>
          <Text color="#99a0a9" fontSize="12px">
            Contact Lens
          </Text>
        </LeftFooterSection>
        <RightFooterSection>
          <PrimaryButton
            primaryText="CONTINUE"
            font={TypographyENUM.serif}
            componentSize={ComponentSizeENUM.medium}
            onBtnClick={handleSubmit}
            id="btn-primary-cl"
            width={"100%"}
            height="35px"
            backgroundColor="#18cfa8"
            theme={ThemeENUM.primary}
          />
        </RightFooterSection>
      </CLBuyingOptionFooter>
    </CLBuyingOptionContainer>
  );
};

export default CLAddOns;
