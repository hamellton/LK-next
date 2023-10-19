import { resetcygnus } from "@/redux/slices/ditto";
import { AppDispatch } from "@/redux/store";
import { DeviceTypes } from "@/types/baseTypes";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  BtnContainer,
  BtnRoot,
  ButtonInnerCircle,
  ButtonOuterCircle,
  CameraClass,
  Canvas,
  CommonButtonContain,
  Img,
  Loader,
  LoaderImg,
  MobileVideo,
  Photo,
  SnapShot,
  Video,
} from "./Ditto.styles";

const Camera = ({
  localeData,
  imageFormat,
  photoContent,
  client,
  loading,
  cameraContent,
  cameraBlockedError,
  getImage,
  setCrossButtonClicked,
  setCameraBlockedError,
  crossButtonClicked,
  updateCustomerCygnusError,
  uploadedCygnusData,
  fitMySize,
}: any) => {
  let videoTrack: any = null;
  const dispatch = useDispatch<AppDispatch>();
  const hidden_canvas = useRef<HTMLCanvasElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const [showCta, setshowCta] = useState(false);

  const [imageDataUrl, setImageDataUrl] = useState("");

  // componentDidMount() {
  //   const { client, getRetakeCallback, location } = this.props;
  //   this.setup();
  //   getRetakeCallback(this.retake);
  //   // if (client === 'desktop' && !location?.pathname.includes('compare-looks')) {
  //   //   disableBackgroundScroll();
  //   // }
  //   if (client === 'desktop') {
  //     showElement('header.header', true);
  //   }
  //   if (client === 'mobilesite' && !location?.pathname.includes('compare-looks'))
  //     showElement('header.header', false);
  // }
  // componentWillUnmount() {
  //   if (this.videoTrack) this.videoTrack.stop();
  //   showElement('header.header', true);
  // }
  const _getImage = () => {
    // const { imageFormat } = this.props;
    const canvasCurrent = hidden_canvas.current;
    const videoCurrent = video.current;
    let base64Image = "";
    // Context object for working with the canvas.
    if (videoCurrent && canvasCurrent) {
      const context = canvasCurrent.getContext("2d");
      // Calculating aspect ratio, so that img will not be streched
      const aspectRatio = videoCurrent.videoWidth / videoCurrent.videoHeight;
      const height = 480;
      const width = 480 * aspectRatio;
      // Set Dimensions
      canvasCurrent.width = width;
      canvasCurrent.height = height;
      // Draw a copy
      if (context) context.drawImage(videoCurrent, 0, 0, width, height);
      // Get an image dataURL from the canvas.
      base64Image = canvasCurrent.toDataURL(imageFormat);
    }
    if (videoTrack) videoTrack.stop();
    // return base64Image;
    return base64Image;
  };
  const setup = () => {
    // const { showCameraBlockedError } = this.props;
    const videoCurrent: any = video.current;
    if (videoCurrent) {
      window?.navigator?.mediaDevices
        ?.getUserMedia({
          video: {
            width: { min: 1280, ideal: 1920, max: 2560 },
            height: { min: 720, ideal: 1080, max: 1440 },
            facingMode: "user",
          },
          audio: false,
        })
        .then((stream) => {
          videoCurrent.srcObject = stream;
          videoCurrent.play();
          videoTrack =
            stream && stream.getTracks() ? stream.getTracks()[0] : null;
          setshowCta(true);
        })
        .catch((error) => {
          // console.log("Camera Error :: ", error);
          setCameraBlockedError(true);
        });
      // console.log("setup");
    }
  };

  useEffect(() => {
    return () => {
      if (videoTrack) videoTrack.stop();
    };
  }, []);

  useEffect(() => {
    if (crossButtonClicked) {
      retake();
    } else {
      setup();
    }
  }, [crossButtonClicked]);

  const retake = () => {
    // console.log("retake");
    // setup();
    setImageDataUrl("");
    setCrossButtonClicked(false);
    dispatch(resetcygnus());
    // this.setState({ imageDataURL: null });
    // this.setup();
    // if (
    //   this.props.client === "desktop" &&
    //   !location?.pathname.includes("compare-looks")
    // ) {
    //   showElement("header.header", false);
    //   disableBackgroundScroll();
    // }
  };
  const takePhoto = () => {
    const videoCurrent = video.current;
    const canvasCurrent = hidden_canvas.current;
    if (videoCurrent && canvasCurrent) {
      const width = videoCurrent?.videoWidth;
      const height = videoCurrent?.videoHeight;
      // // Context object for working with the canvas.
      const context = canvasCurrent.getContext("2d");
      // // Set the canvas to the same dimensions as the video.
      canvasCurrent.width = width;
      canvasCurrent.height = height;
      // // Draw a copy of the current frame from the video on the canvas.
      context && context.drawImage(videoCurrent, 0, 0, width, height);
      // // Get an image dataURL from the canvas.
      const imageDataURL = canvasCurrent.toDataURL("image/png");
      // this.setState({ imageDataURL });
      setImageDataUrl(imageDataURL);
      // const { getImage } = this.props;
      if (typeof getImage === "function") {
        //   // Return image to parent
        const image = _getImage();
        getImage(image);
      }
    }
  };
  // console.log(loading, "loading");

  // render() {
  //   const {
  //     cameraContent,
  //     photoContent,
  //     client,
  //     loading,
  //     dataLocale: { TAKE_PHOTO },
  //     location,
  //   } = this.props;
  //   const { imageDataURL, cameraBlockedError } = this.state;
  // const showImage =

  return (
    <>
      {fitMySize ? (
        <CameraClass>
          <div
            className="video"
            style={{ display: !loading && imageDataUrl ? "none" : "block" }}
          >
            <MobileVideo
              ref={video}
              autoPlay
              loop
              muted
              playsInline
            ></MobileVideo>
            {cameraContent}

            <CommonButtonContain client={client === DeviceTypes.MOBILE}>
              <ButtonOuterCircle onClick={() => takePhoto()}>
                <ButtonInnerCircle background={false}></ButtonInnerCircle>
                {loading && (
                  <Loader>
                    <Img
                      alt=""
                      src="https://static.lenskart.com/media/mobile/images/camera-loader1.svg"
                    />
                  </Loader>
                )}
              </ButtonOuterCircle>
            </CommonButtonContain>
          </div>
          <Photo
            imageDataUrl={imageDataUrl ? true : false}
            desktop={client === DeviceTypes.DESKTOP}
          >
            <Canvas ref={hidden_canvas}></Canvas>
            <SnapShot
              desktop={client === DeviceTypes.DESKTOP}
              alt="User"
              src={imageDataUrl}
            />
            {(client !== DeviceTypes.DESKTOP ||
              location?.pathname.includes("compare-looks")) &&
              photoContent}
          </Photo>
        </CameraClass>
      ) : (
        <CameraClass>
          <div
            className="video"
            style={{ display: !loading && imageDataUrl ? "none" : "block" }}
          >
            {!imageDataUrl &&
              (client === DeviceTypes.DESKTOP ? (
                <Video ref={video} autoPlay loop muted playsInline></Video>
              ) : (
                <MobileVideo
                  ref={video}
                  autoPlay
                  loop
                  muted
                  playsInline
                ></MobileVideo>
              ))}
            {cameraContent}
          </div>
          <Photo
            imageDataUrl={imageDataUrl ? true : false}
            desktop={client === DeviceTypes.DESKTOP}
          >
            <Canvas ref={hidden_canvas}></Canvas>
            <SnapShot
              desktop={client === DeviceTypes.DESKTOP}
              alt="User"
              src={imageDataUrl}
            />
            {(client !== DeviceTypes.DESKTOP ||
              location?.pathname.includes("compare-looks")) &&
              photoContent}
          </Photo>
          {!cameraBlockedError &&
            !updateCustomerCygnusError &&
            !uploadedCygnusData && (
              <CommonButtonContain client={client === DeviceTypes.MOBILE}>
                {client === DeviceTypes.DESKTOP ? (
                  <BtnContainer onClick={() => takePhoto()}>
                    {!loading ? (
                      showCta && <BtnRoot>{localeData.TAKE_PHOTO}</BtnRoot>
                    ) : (
                      <LoaderImg
                        alt=""
                        src="https://static.lenskart.com/media/mobile/images/img-loader.gif"
                      />
                    )}
                  </BtnContainer>
                ) : (
                  <ButtonOuterCircle onClick={() => takePhoto()}>
                    <ButtonInnerCircle
                      background={!loading}
                    ></ButtonInnerCircle>
                    {loading && (
                      <Loader>
                        <Img
                          alt=""
                          src="https://static.lenskart.com/media/mobile/images/camera-loader1.svg"
                        />
                      </Loader>
                    )}
                  </ButtonOuterCircle>
                )}
              </CommonButtonContain>
            )}
        </CameraClass>
      )}
    </>
  );
};

export default Camera;
