import { DataType } from "@/types/coreTypes";
import { Modal } from "@lk/ui-library";
import { CenterImg, PrescriptionImage } from "./styles";

interface ImagePrecriptionModalType {
  closeImagePrescriptionModal: () => void;
  openImageModal: boolean;
  imageFileName: string;
  userData: DataType;
}

const ImagePrescriptionModal = ({
  openImageModal,
  imageFileName,
  userData,
  closeImagePrescriptionModal,
}: ImagePrecriptionModalType) => {
  return (
    <Modal
      show={openImageModal}
      onHide={closeImagePrescriptionModal}
      bsSize={"lg"}
      keyboard
      dialogCss={`width: 50vw; .modal-body { min-height: auto; } .close {
        position: absolute;
        right: -16px;
        z-index: 200;
        top: -16px;
        background: #fff;
        border: 2px solid #535c60;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        opacity: 1;
        font-size: 26px;
        margin-top: -2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        line-height: 1;
        color: #000;
        text-shadow: 0 1px 0 #fff;
      }
      .modal-content{
        height:auto;
      }
      .modal-header {
        min-height: 0;
        padding: 0;
        border: none;
      }`}
      height={"auto"}
    >
      <Modal.Header closeButton={true} onHide={closeImagePrescriptionModal} />
      <Modal.Body className={"fullheight"}>
        <CenterImg>
          <PrescriptionImage
            src={`${process.env.NEXT_PUBLIC_API_URL}/v2/utility/customer/prescriptions/download/${imageFileName}`}
            alt="image file name"
          />
        </CenterImg>
      </Modal.Body>
    </Modal>
  );
};

export default ImagePrescriptionModal;
