import { putPrescriptionData } from '@/redux/slices/userPowerInfo';
import { AppDispatch } from '@/redux/store';
import { DataType, LocaleDataType } from '../../types/coreTypes';
import { Modal } from '@lk/ui-library';
import { ModalHeader } from 'pageStyles/styles';
import { useDispatch } from 'react-redux';
import {
	BrandName,
	ContinueButton,
	HeaderContainer,
	HeaderText,
	HeaderTextContainer,
	Image,
	ImageContainer,
	ModalBodyConatiner,
	PreviewPrescriptionView,
	EamilTextMessage,
	EamilSupportIcon,
	EamilIconText,
	EamilSupport,
	EamilTextSupportIconWrapper,
	SupportStrong
} from './styles';

interface PrescriptionEmailType {
	localeData: LocaleDataType;
	selectedOrder: any;
	userData: DataType;
	item: any;
	closePrescriptionEamilModal: () => void;
	openPrecriptionEmailModal: boolean;
}

const PrescriptionEmailModal = ({
	localeData,
	selectedOrder,
	item,
	userData,
	closePrescriptionEamilModal,
	openPrecriptionEmailModal
}: PrescriptionEmailType) => {
	const dispatch = useDispatch<AppDispatch>();
	const { PLEASE_SEND_US_COPY_OF_PRESCRIPTION } = localeData;
	const submitSavedPowerPrescription = () => {
		const data:any = {
		    imageFileName: "",
			userName: selectedOrder.shippingAddress.firstName + selectedOrder.shippingAddress.lastName,
			powerType: item.prescription.powerType,
		    left: {
		        sph: "Call Me/Email Me for Power"
		    },
		    right: {
		        sph: "Call Me/Email Me for Power"
		    }
		}
		dispatch(putPrescriptionData({ sessionId: userData.id, itemID: item?.id, orderID: selectedOrder.id, emailID: userData.customerEmail, prescription: data}));
		closePrescriptionEamilModal();
	};

	return (
		<Modal
			show={openPrecriptionEmailModal}
			onHide={closePrescriptionEamilModal}
			bsSize={'lg'}
			keyboard
			dialogCss={`width: 80vw;`}
		>
			<Modal.Header closeButton={true} onHide={closePrescriptionEamilModal}>
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
			<Modal.Body>
				<ModalBodyConatiner>
					<PreviewPrescriptionView>
						<EamilTextMessage>{PLEASE_SEND_US_COPY_OF_PRESCRIPTION}</EamilTextMessage>
						<EamilTextSupportIconWrapper>
							<EamilIconText>
								<EamilSupportIcon />
								<EamilSupport>
									<SupportStrong>support@lenskart.com</SupportStrong>
								</EamilSupport>
							</EamilIconText>
						</EamilTextSupportIconWrapper>
					</PreviewPrescriptionView>
					<ContinueButton onClick={() => submitSavedPowerPrescription()}>Continue</ContinueButton>
				</ModalBodyConatiner>
			</Modal.Body>
		</Modal>
	);
};

export default PrescriptionEmailModal;
