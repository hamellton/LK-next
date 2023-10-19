import { getSavedPrescriptionData } from '@/redux/slices/prescription';
import { AppDispatch, RootState } from '@/redux/store';
import { Modal } from '@lk/ui-library';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	BrandName,
	HeaderContainer,
	HeaderTextContainer,
	Image,
	ImageContainer,
	HeaderText,
	PrescriptionWrapper,
    PreviewPrescriptionView,
    SuccessIcon,
    PreviewText,
    ContinueButton,
    BackButton
} from './styles';
import { MyPrescription } from '@lk/ui-library';
import { ModalHeader } from 'pageStyles/styles';
import PrescriptionTable from './PrescriptionTable';
import { putPrescriptionData } from '@/redux/slices/userPowerInfo';
import { LocaleDataType } from '@/types/coreTypes';
// import { PowerDetailMobile } from '@lk/ui-library';

interface SavedPrescriptionType {
	localeData: LocaleDataType;
	openSavedPrecriptionModal: boolean;
	closeSavedPrecriptionModal: () => void;
	selectedOrder: any;
	userData: any;
	item: any;
}

const SavedPrescriptionModal = ({
	userData,
	openSavedPrecriptionModal,
	closeSavedPrecriptionModal,
	localeData,
	item,
    selectedOrder
}: SavedPrescriptionType) => {
	const dispatch = useDispatch<AppDispatch>();
	const prescriptionList = useSelector((state: RootState) => state.prescriptionInfo.data);
	const [ savedPrecriptionObject, setSavedPrescriptionObject ] = useState({});
	useEffect(() => {
		dispatch(getSavedPrescriptionData({ sessionId: userData.id }));
	}, []);
	const selectSavedPrescription = (prescription: any) => {
		setSavedPrescriptionObject({ ...prescription });
	};
    const submitSavedPowerPrescription = () => {
		dispatch(putPrescriptionData({ sessionId: userData.id, itemID: item?.id, orderID: selectedOrder.id, emailID: userData.customerEmail, prescription: savedPrecriptionObject}));
		closeSavedPrecriptionModal();
    }
    const handleBack = () => {
        setSavedPrescriptionObject({});
    }
	return (
		<Modal
			show={openSavedPrecriptionModal}
			onHide={closeSavedPrecriptionModal}
			bsSize={'lg'}
			keyboard
			dialogCss={`width: 80vw;`}
		>
			<Modal.Header closeButton={true} onHide={closeSavedPrecriptionModal}>
				<ModalHeader>
					<HeaderContainer>
						<ImageContainer>
							<Image src={item.image} alt="" />
						</ImageContainer>
						<HeaderTextContainer>
							<HeaderText>{item.name}</HeaderText>
							<BrandName>{item.brandName}</BrandName>
						</HeaderTextContainer>
					</HeaderContainer>
				</ModalHeader>
			</Modal.Header>
			<Modal.Body className={"fullheight"}>
				{prescriptionList.length && !Object.keys(savedPrecriptionObject).length && (
					<PrescriptionWrapper>
						<MyPrescription
							showpowerType={false}
							showDate={false}
							showSelectedButton={true}
							dataLocale={localeData}
							prescriptionList={prescriptionList}
							selectSavedPrescription={selectSavedPrescription}
						/>
					</PrescriptionWrapper>
				)}
                {
                    Object.keys(savedPrecriptionObject).length && <><PreviewPrescriptionView>
                    <SuccessIcon></SuccessIcon>
                    <PreviewText>Please review your prescription before submitting</PreviewText>
                </PreviewPrescriptionView>
                <PrescriptionTable dataLocale={localeData} powerDetails={savedPrecriptionObject} ></PrescriptionTable>
				{/* <PowerDetailMobile dataLocale={localeData} powerDetails={savedPrecriptionObject} /> */}
                <ContinueButton onClick={() => submitSavedPowerPrescription()}>Continue</ContinueButton>
                <BackButton onClick={() => handleBack()}>Back</BackButton>
                </>
                }
			</Modal.Body>
		</Modal>
	);
};

export default SavedPrescriptionModal;
