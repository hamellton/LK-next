import styled from "styled-components";

export const DittoWrapperContainer = styled.div`
  margin: 20px 0px 100px 0px;
`;

export const DittoWrapper = styled.div<{ isDitto: boolean }>`
  background: ${(props) =>
    !props.isDitto
      ? "none"
      : "url(//static.lenskart.com/media/desktop/img/ditto_revamp_bg.svg) no-repeat center center"};
  width: 100vw;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DittoContainer = styled.div`
  width: 55vw;
  max-width: 1200px;
  min-width: 500px;
  margin: 0 auto;
  background-color: var(--white);
  padding: var(--pd-20);
  display: flex;
  flex-direction: row;
  justify-content: var(--space-between);
  align-items: center;
  margin: 80px;
  gap: 20px;
`;

export const ImageSection = styled.div`
  flex: 1;
`;

export const ImageStyle = styled.img`
  vertical-align: middle;
  max-width: 100%;
`;

export const View3DTryOn = styled.div`
  flex: 1;
  margin-left: var(--pd-20);
  text-transform: var(--uppercase);
  /* text-align: center; */
`;

export const HeaderText3D = styled.h3`
  font-size: var(--fs-40);
  margin-top: 0px;
  margin-bottom: 25px;
  text-align: center;
`;

export const SubTextWrapper = styled.div`
  /* counter-reset: counter; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
`;

export const SubText1 = styled.div`
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  justify-content: space-between;
  /* margin-bottom: 25px; */
  flex: 1;
  gap: 10px;
`;

export const SubText2 = styled.div`
  display: flex;
  flex: 1;
  /* align-items: center; */
  justify-content: space-between;
  margin-bottom: 25px;
  gap: 10px;
`;

export const ItemIndex = styled.span`
  width: 2.5rem;
  height: 2.5rem;
  /* margin-right: 1.5rem;
    margin-bottom: 0; */
  border: 1px solid var(--light-black);
  line-height: 2.5rem;
  text-align: center;
  color: var(--light-black);
  background-color: var(--transparent);
  border-radius: 50%;
  font-size: var(--fs-16);
`;

export const Span = styled.span`
  &:before {
    /* counter-increment: counter;
    content: counter(counter);
    position: relative;
    display: inline-block;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 1.5rem;
    margin-bottom: 0;
    border: 1px solid var(--light-black);
    line-height: 2.5rem;
    text-align: center;
    color: var(--light-black);
    background-color: var(--transparent);
    border-radius: 50%;
    font-size: var(--fs-16); */
  }
`;

export const Button = styled.button`
  background-color: #2fbba4;
  min-width: 200px;
  margin: 0 auto;
  padding: var(--pd-10);
  display: block;
  text-align: center;
  color: #fff;
  font-size: 17px;
  border-radius: var(--border-radius-xxs);
  border: 1px solid #2fbba4;
  cursor: var(--pointer);
`;

export const DittoCam = styled.div`
  height: 600px;
  width: 1000px;
  iframe {
    margin: 0px;
  }
`;

export const FaceArea = styled.div`
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 66, 0.7);
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  -webkit-mask-image: radial-gradient(
    ellipse 32% 75%,
    transparent 50%,
    rgba(0, 0, 0, 1) 50%
  );
  mask-image: radial-gradient(
    ellipse 32% 75%,
    transparent 50%,
    rgba(0, 0, 0, 1) 50%
  );
`;

export const FaceBorder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  border: 5px dashed #12d6a3;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  height: 75%;
  width: 32%;
`;

export const CameraContent = styled.div`
  border-radius: 12px;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`;
export const CameraContentMobile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding-top: 6px;
  & .popup-img-mobile {
    width: 38px;
  }
`;

export const CameraContainer = styled.div`
  display: flex;
  width: 100vw;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const CameraClass = styled.div`
  width: 60%;
  //   height: 100%;
  position: relative;
`;

export const BtnContainer = styled.div`
  position: absolute;
  margin: auto;
  width: max-content;
  text-align: center;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 120%);
`;

export const BtnRoot = styled.div`
  cursor: pointer;
  font-family: Lenskart Sans;
  padding: 12px 20px;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #e2e2ee;
  min-width: min-content;
  background-color: #000042;
  border-radius: 100px;
  margin-top: 14px;
  display: flex;
  justify-content: center;
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 12px !important;
  background-color: rgba(0, 0, 66, 0.7);
  transform: scaleX(-1);
`;

export const MobileVideo = styled.video`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  transform: scaleX(-1);
`;

export const SnapShot = styled.img<{ desktop: boolean }>`
  max-width: none;
  object-fit: cover;
  height: ${(props) => (props.desktop ? "auto" : "100vh")} !important;
  width: ${(props) => (props.desktop ? "100%" : "100vw")} !important;
  border-radius: 12px !important;
  transform: scaleX(-1);
`;

export const PopUpMessage = styled.div`
  background-color: #fff;
  padding: 28px 36px;
  min-width: 35%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  letter-spacing: -0.02em;
  font-family: lenskart sans;
`;

export const PopUpMessageMobile = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #000042;
  letter-spacing: -0.02em;
  font-family: lenskart sans;
`;
export const CrossButton = styled.button`
  position: absolute;
  top: 16px;
  right: 18px;
  border: none;
  background-color: transparent;
  height: 1.75em;
  width: 1.75em;
  cursor: pointer;
`;

export const PopUpTitle = styled.p`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #000042;
  margin: 0;
`;

export const PopUpBody = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #333368;
  text-align: center;
`;
export const PopUpBodyMobile = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #333368;
  text-align: center;
  font-family: lenskart sans;
  padding-bottom: 15px;
`;

export const PopUpImage = styled.img`
  border: 2px solid #000042;
  border-radius: 99px;
  width: 96px;
  height: 96px;
  object-fit: cover;
`;

export const CameraTitle = styled.p`
  font-family: lenskart sans;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #000042;
  margin-bottom: 10px;
`;

export const LoaderImg = styled.img`
  height: 28px;
  margin: 14px;
`;

////////// Mobile

export const MobileCameraContainer = styled.div`
  display: flex;
  width: 100vw;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  span {
    svg {
      path {
        stroke: #333;
      }
    }
  }
`;

export const MobileHeaderContent = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px 10px;
`;

export const MobileHeaderAction = styled.button`
  width: max-content;
  background: #ffffff;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 100px;
  padding: 2px 10px;
  border: none;
  margin: 0;
  display: flex;
`;

export const Img = styled.img`
  // height: 2.25em;
  // width: 2.5em;
`;

export const MobileHeaderTitle = styled.p`
  margin: 0;
  font-family: "Lenskart Sans";
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
`;

export const MobileCameraContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
`;

export const MobileFaceArea = styled.div`
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 100vh;
  -webkit-mask-image: radial-gradient(
    ellipse 270px 400px,
    transparent 50%,
    rgba(0, 0, 0, 1) 50%
  );
  mask-image: radial-gradient(
    ellipse 270px 400px,
    transparent 50%,
    rgba(0, 0, 0, 1) 50%
  );
  mask-position: 0 -12vh;
  -webkit-mask-image: 0 -12vh;
`;

export const MobileFaceBorder = styled.div`
  position: absolute;
  top: 38vh;
  left: 50vw;
  border: 5px dashed #12d6a3;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  height: 400px;
  width: 270px;
`;

export const MobileContentText = styled.div`
  width: 100%;
  font-family: "Lenskart Sans";
  font-weight: 700;
  font-size: 15px;
  line-height: 16px;
  text-align: center;
  color: #ffffff;
  &p {
    margin: 0;
  }

  position: fixed;
  bottom: 5vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
`;

export const ButtonOuterCircle = styled.div`
  position: relative;
  border-radius: 50%;
  width: 65px;
  height: 65px;
  border: 1px solid #fff;
`;

export const ButtonInnerCircle = styled.div<{ background: boolean }>`
  position: absolute;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  top: 4px;
  left: 4px;
  background: ${(props) => (props.background ? "#11daac" : "#fff")};
`;

export const CommonButtonContain = styled.div<{ client: boolean }>`
  position: ${(props) => (props.client ? "fixed" : "sticky")};
  bottom: ${(props) => (props.client ? "8vh" : "")};
  left: 0;
  width: ${(props) => (props.client ? "100vw" : "100%")};
  z-index: 110;
  display: flex;
  justify-content: center;
`;

export const Loader = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  &img {
    max-width: 44px;
  }
`;

export const Photo = styled.div<{ desktop: boolean; imageDataUrl: boolean }>`
  display: ${(props) => (props.imageDataUrl ? "block" : "none")};
  ${(props) => !props.desktop && "position: fixed"};
  ${(props) => props.desktop && "height: 100%"};
  ${(props) => !props.desktop && "top: 0px"};
  ${(props) => !props.desktop && "left: 0px"};
  ${(props) => !props.desktop && "right: 0px"};
  ${(props) => !props.desktop && "padding-top: 0"};
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 15px;
`;

export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
`;

export const Canvas = styled.canvas`
  display: none;
`;

//// FitFrame

export const FrameSizeFace = styled.img`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: 100;
  transform: rotateY(180deg);
`;

export const Cross = styled.div<{ dark?: boolean }>`
  top: 15px;
  right: 15px;
  z-index: 102;
  position: absolute;
  color: ${(props) => (props?.dark ? "black" : "white")};
  background: ${(props) => (props?.dark ? "white" : "")};
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

export const ResultRootContainer = styled.div`
  position: relative;
`;

export const ImgContainer = styled.div`
  height: 45vh;
`;

export const ImgStyle = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
`;

export const FrameResultContainer = styled.div`
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 56vh;
  z-index: 11;
  border-radius: 10px 10px 0 0;
`;

export const FrameResult = styled.div`
  padding: 10px;
`;

export const FrameResultTitle = styled.div`
  padding-top: 15px;
  text-align: center;
  font: 12px/1.2857 "Roboto", sans-serif, "Arial", "Helvetica", sans-serif;
  color: #27394e;
  font-size: 18px;
  font-weight: 700;
`;

export const ResultWrapper = styled.div<{ background: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 4px;
  ${(props) => props.background && "background: #F5F5F5"};
  ${(props) => props.background && "border-radius: 10px"};
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px 10px;
  width: 100%;
`;

export const PContain = styled.div`
  text-align: center;
`;

export const ResultStatus = styled.p`
  font: 12px/1.2857 "Roboto", sans-serif, "Arial", "Helvetica", sans-serif;
  color: #27394e;
  font-weight: 700;
  font-size: 15px;
`;

export const ResultTitle = styled.p`
  font-size: 12px;
  padding-bottom: 5px;
  padding-top: 5px;
`;

export const ButtonWrap = styled.div`
  padding: 10px;
`;

export const ImgWrap = styled.img``;
