import { Icons, /* Components, */ Modal } from "@lk/ui-library";
import EmbedVideo from "../EmbedVideo";
import { CloseIconWrapper } from "./styles";

const EmbedVideoModal = ({
  videoId,
  setVideoModal,
  openVideoModal,
  isRTL,
}: any) => {
  const oncloseVideoModal = () => {
    setVideoModal(false);
  };
  return (
    <Modal
      show={openVideoModal}
      onHide={oncloseVideoModal}
      bsSize={"lg"}
      keyboard
      dialogCss={`width: 95vw;`}
    >
      {/* <Modal.Body className={'fullheight'} style={{}}> */}
      <CloseIconWrapper isRTL={isRTL}>
        <Icons.Cross onClick={() => oncloseVideoModal()} />
      </CloseIconWrapper>
      <EmbedVideo videoId={videoId} />
      {/* </Modal.Body> */}
    </Modal>
  );
};

export default EmbedVideoModal;
