import { addToCartNoPower } from '@/redux/slices/cartInfo';
import { Spinner } from '@lk/ui-library';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  GoldCTA,
  GoldImage,
  GoldOfferContainer,
  Subtext,
  Text,
} from './GoldOfferBottomSheet.styles';
import { GoldOfferBottomsheetTypes } from './GoldOfferBottomSheet.types';

const GoldOfferBottomSheet = (props: GoldOfferBottomsheetTypes) => {
  const { sessionId, goldOfferPopup, configData, cartInfo, handleSection } =
    props;
	const { cartIsLoading } = cartInfo;
  const { backgroundColor, headline1, headline2, popUpText, cta } =
    goldOfferPopup;
  const [ctaProcessing, setCtaProcessing] = useState(false);

  const dispatch = useDispatch();
  const handleOnGoldCta = () => {
    setCtaProcessing(true);
    const loyaltyConfig =
      configData &&
      configData.LOYALTY_CONFIG &&
      JSON.parse(configData.LOYALTY_CONFIG);

    const reqObj: {
      pid?: number;
      sessionId?: string;
    } = {
      pid: cta?.pid || (loyaltyConfig && loyaltyConfig?.goldPid) || '128269',
      sessionId: sessionId,
    };

    if (cartInfo && cartInfo?.items && cartInfo?.items?.length) {
      const isLoyaltyProductAdded = cartInfo?.items?.some(
        (item: { itemClassification: string }) =>
          item.itemClassification === 'loyalty_services'
      );
      if (isLoyaltyProductAdded) {
        // setCtaProcessing(false);
        handleSection('');
      } else {
        dispatch(addToCartNoPower(reqObj));
      }
    } else {
      dispatch(addToCartNoPower(reqObj));
    }
    // add gold to cart with pid
	setCtaProcessing(cartIsLoading);
  };



  useEffect(() => {
	if(ctaProcessing){
		setCtaProcessing(cartIsLoading);
		handleSection('');
	}
  }, [cartIsLoading])
  return (
    <GoldOfferContainer color={backgroundColor}>
      <GoldImage src={headline1}></GoldImage>

      <Text>{headline2}</Text>

      <Subtext>{popUpText}</Subtext>

      <GoldCTA onClick={handleOnGoldCta}>
        {ctaProcessing ? (
          <Spinner show={ctaProcessing} padding='0px' />
        ) : (
          cta?.text
        )}
      </GoldCTA>
    </GoldOfferContainer>
  );
};
export default GoldOfferBottomSheet;
