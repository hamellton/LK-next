import React from 'react';
import { Payment as PaymentComponent } from "@lk/ui-library";
import { Paragraph, PlaceOrderButton } from '../../pageStyles/paymentStyles';
import { TypographyENUM } from '@/types/baseTypes';
// import PlaceOrderText from './PlaceOrderText';
// import QRCode from './QRCode';
// import BankOffer from './../BankList/BankOffer';
// import InfoBar from '../../../../CommonComponents/InfoBar';

const WalletList = (props: any) => {
  const {
    walletDetails,
    createOrderPayment,
    loadingPlaceOrder,
    paymentCTA,
    frameProduct,
    applyOffer,
    dataLocale,
  } = props;
  const method = walletDetails.methods[0];
  const { YOU_WILL_REDIRECTED_TO_PAYMENT } = dataLocale;
  if (walletDetails.groupId === 'qrcode_payu') {
    return (
      <PaymentComponent.QRCode
        createOrderPayment={createOrderPayment}
        dataLocale={dataLocale}
        frameProduct={frameProduct}
        loadingPlaceOrder={loadingPlaceOrder}
        paymentCTA={paymentCTA}
        walletDetails={method}
      />
    );
  } else if (method.offers[0]) {
    return <PaymentComponent.BankOffer walletOffer applyOffer={applyOffer} bankOffer={method}></PaymentComponent.BankOffer>;
  }
  return (
    <div>
      <div className="payment-content">
        {/* <h3>Please Select Wallet Type <span className="str">*</span></h3> */}
        {walletDetails.logoImageUrl && (
          <img alt="logoImageUrl" className="margin-b10" src={walletDetails.logoImageUrl} />
        )}
        {walletDetails.offerBannerImageUrl && (
          <img alt="offerBannerImageUrl" src={walletDetails.offerBannerImageUrl} />
        )}
        <Paragraph styledFont={TypographyENUM.defaultBook}>{YOU_WILL_REDIRECTED_TO_PAYMENT}</Paragraph>
      </div>
      {/* {frameProduct && <InfoBar frameProduct={frameProduct} paymentCTA={paymentCTA} />} */}
      <PlaceOrderButton
        className="payment-continue-button margin-t20"
        style={{ pointerEvents: loadingPlaceOrder && 'none' }}
        type="button"
        onClick={() => {
          createOrderPayment('', method.code, method.gatewayId);
        }}
      >
        <PaymentComponent.PlaceOrderText
          frameProduct={frameProduct}
          loadingPlaceOrder={loadingPlaceOrder}
          paymentCTA={paymentCTA}
        />
      </PlaceOrderButton>
    </div>
  );
};

export default WalletList;
