import React from "react";
import Checkout from "containers/Checkout/address";

const EditAddressComponent = ({
  setEditAddress,
  addressData,
  countryStateData,
  sessionId,
  localeData,
  configData,
  countryCode,
  isOrderDetailPage,
}: {
  setEditAddress: (props: boolean) => void;
  addressData: any;
  countryStateData: any;
  sessionId: string;
  localeData: any;
  configData: any;
  countryCode: string;
  isOrderDetailPage?: boolean;
}) => {
  return (
    <div>
      <Checkout
        addressData={addressData}
        countryStateData={countryStateData}
        sessionId={sessionId}
        localeData={localeData}
        phoneCode={countryCode}
        configData={configData}
        setEditAddress={setEditAddress}
        isOrderDetailPage={isOrderDetailPage}
      />
    </div>
  );
};

export default EditAddressComponent;
