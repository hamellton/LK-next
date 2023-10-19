import { setPrescriptionPageStatus } from '@/redux/slices/prescription';
import { AppDispatch, RootState } from '@/redux/store';
import { ComponentSizeENUM } from '@/types/baseTypes';
import { PrimaryButton } from '@lk/ui-library';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BottomRow,
  ButtonWrapper,
  BuyContactLensContainer,
  Title,
  TopRow,
} from './SelectContactLensEye.styles';
import { SelectContactLensEyeTypes } from './SelectContactLens.types';

const SelectContactLensEye = (props: SelectContactLensEyeTypes) => {
  const { dataLocale, onClickSelectEye } = props;
  const { YOU_WANT_TO_BUY_FOR, BOTH_EYES, RIGHT_EYE, LEFT_EYE } =
    dataLocale || {};
  const { prescriptionPageStatus } = useSelector(
    (state: RootState) => state.prescriptionInfo
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // dispatch()
    dispatch(setPrescriptionPageStatus(true));
  }, []);
  return (
    <BuyContactLensContainer>
      <TopRow>
        <Title>{YOU_WANT_TO_BUY_FOR}</Title>
      </TopRow>
      <div>
        <PrimaryButton
          primaryText={BOTH_EYES}
          onBtnClick={() => onClickSelectEye(1, 'both')}
          backgroundColor='#18cfa8'
          color='var(--white)'
          componentSize={ComponentSizeENUM.small}
          width='100%'
        />
      </div>
      <BottomRow>
        <ButtonWrapper>
          <PrimaryButton
            primaryText={LEFT_EYE}
            onBtnClick={() => onClickSelectEye(1, 'left')}
            backgroundColor='#27394e'
            color='var(--white)'
            componentSize={ComponentSizeENUM.small}
            width='100%'
            borderColor="#27394e"
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <PrimaryButton
            primaryText={RIGHT_EYE}
            onBtnClick={() => onClickSelectEye(1, 'right')}
            backgroundColor='#27394e'
            color='var(--white)'
            componentSize={ComponentSizeENUM.small}
            width='100%'
			borderColor="#27394e"
          />
        </ButtonWrapper>
      </BottomRow>
    </BuyContactLensContainer>
  );
};

export default SelectContactLensEye;
