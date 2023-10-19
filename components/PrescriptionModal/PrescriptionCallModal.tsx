import { putPrescriptionData } from '@/redux/slices/userPowerInfo';
import { AppDispatch } from '@/redux/store';
import { LocaleDataType } from '@/types/coreTypes';
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
	SuccessIcon,
	SuccessAuthText,
	ExecuteMessage
} from './styles';

interface PrescriptionCallType {
	localeData: LocaleDataType;
	selectedOrder: any;
	userData: any;
	item: any;
	closePrescriptionCallModal: () => void;
	openPrecriptionCallModal: boolean;
}

const PrescriptionCallModal = ({
	localeData,
	selectedOrder,
	item,
	userData,
	closePrescriptionCallModal,
	openPrecriptionCallModal
}: PrescriptionCallType) => {
    const dispatch = useDispatch<AppDispatch>();
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
        closePrescriptionCallModal();
    };

	return (
		<Modal
			show={openPrecriptionCallModal}
			onHide={closePrescriptionCallModal}
			bsSize={'lg'}
			keyboard
			dialogCss={`width: 80vw;`}
		>
			<Modal.Header closeButton={true} onHide={closePrescriptionCallModal}>
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
						<SuccessIcon />
						<SuccessAuthText>{localeData.SUCCESFULLY_AUTHENTICATED}</SuccessAuthText>
						<ExecuteMessage>{localeData.EXECUTIVE_GET_IN_TOUCH_FOR_PRESCRIPTION}</ExecuteMessage>
					</PreviewPrescriptionView>
					<ContinueButton onClick={() => submitSavedPowerPrescription()}>Continue</ContinueButton>
				</ModalBodyConatiner>
			</Modal.Body>
		</Modal>
	);
};

export default PrescriptionCallModal;
