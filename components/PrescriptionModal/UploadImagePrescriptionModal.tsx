import { Modal } from '@lk/ui-library';
import { ModalHeader } from 'pageStyles/styles';
import {
	BrandName,
	FileContainer,
	HeaderContainer,
	HeaderText,
	HeaderTextContainer,
	Image,
	ImageContainer,
	StyledDropZoneComponent,
	UploadPresTab,
	UploadPresText,
	UploadSuccessMessage,
	UploadErrorMessage
} from './styles';
import { APIService } from '@lk/utils';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { putPrescriptionData } from '@/redux/slices/userPowerInfo';
import { LocaleDataType } from '@/types/coreTypes';

interface UploadImagePrescriptionType {
	localeData: LocaleDataType;
	selectedOrder: any;
	userData: any;
	item: any;
	closeUploadImagePrescriptionModal: () => void;
	openUploadImagePrecriptionModal: boolean;
}

const UploadImagePrescriptionModal = ({
	localeData,
	selectedOrder,
	item,
	userData,
	closeUploadImagePrescriptionModal,
	openUploadImagePrecriptionModal
}: UploadImagePrescriptionType) => {
	// console.log(item);
	const dispatch = useDispatch<AppDispatch>();
	const [ uploadSucessStatus, setUploadSucessStatus ] = useState({ uploadSuccess: '', uploadError: '' });
	const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
	const fileUploadSuccess = (sucess: any, uploadSuccess: any) => {
		// console.log(uploadSuccess, 'uploadSuccess');
		if (uploadSuccess.result.code === 200) {
			const data:any = {
				imageFileName: uploadSuccess.result.filename,
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
			setUploadSucessStatus({ uploadSuccess: uploadSuccess.result.message, uploadError: '' });
			closeUploadImagePrescriptionModal();
		} else {
			setUploadSucessStatus({ uploadSuccess: '', uploadError: uploadSuccess.result.error });
		}
	};
	const componentConfig: any = {
		iconFiletypes: [ '.jpg', '.png', '.gif' ],
		showFiletypeIcon: true,
		postUrl: `${api.envURL}/magento/me/index/uploadprescfile`
	};
	const djsConfig: any = {
		paramName: 'myfile',
		addRemoveLinks: true,
		maxFilesize: 8,
		maxFiles: 1,
		uploadMultiple: false,
		acceptedFiles: 'image/jpeg,image/png,image/gif'
	};
	const eventHandlers: any = {
		success: fileUploadSuccess,
		processingmultiple: null,
		sendingmultiple: null,
		successmultiple: null,
		completemultiple: null,
		canceledmultiple: null
	};
	return (
		<Modal
			show={openUploadImagePrecriptionModal}
			onHide={closeUploadImagePrescriptionModal}
			bsSize={'lg'}
			keyboard
			dialogCss={`width: 80vw;`}
		>
			<Modal.Header closeButton={true} onHide={closeUploadImagePrescriptionModal}>
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
				<UploadPresTab>
					<UploadPresText>{localeData.UPLOAD_YOUR_PRESCRIPTION}</UploadPresText>
					<FileContainer>
						<StyledDropZoneComponent
							config={componentConfig}
							djsConfig={djsConfig}
							eventHandlers={eventHandlers}
						/>
					</FileContainer>
					{uploadSucessStatus.uploadSuccess && <UploadSuccessMessage>
						{uploadSucessStatus.uploadSuccess}
					</UploadSuccessMessage>}
					{uploadSucessStatus.uploadError && <UploadErrorMessage>
						{uploadSucessStatus.uploadError}
					</UploadErrorMessage>}
				</UploadPresTab>
			</Modal.Body>
		</Modal>
	);
};

export default UploadImagePrescriptionModal;
