import React, { useEffect } from 'react';
import { BottomSheet } from '@lk/ui-library';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getPrescriptionDataWithPowerType } from '@/redux/slices/prescription';
import EnterPowerMenu from './EnterPowerMenu/EnterPowerMenu';

const ContactLensPower = (props) => {
  const { productData, category, buyWithCallConfig, whatsAppChatMsg, handleShowPrescription } = props;

  const { sessionId, email, mobileNumber, userDetails } = useSelector(
    (state: RootState) => state.userInfo
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      getPrescriptionDataWithPowerType({
        sessionId: sessionId,
        powerType: 'CONTACT_LENS',
      })
    );
  }, []);
  return (
    <>
      <BottomSheet
        show={true}
        borderRadius='0px'
        backgroundColor='#eaeff4'
        padding='0'
      >
        <EnterPowerMenu
          category={category}
          buyWithCallConfig={buyWithCallConfig}
          whatsAppChatMsg={whatsAppChatMsg}
		  handleShowPrescription={handleShowPrescription}
        />
      </BottomSheet>
    </>
  );
};

export default ContactLensPower;
