import { Icons } from "@lk/ui-library";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Carousel } from "@lk/ui-library";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getCookie, setCookie } from "@/helpers/defaultHeaders";
import Router from "next/router";
import {
  getCygnusOverlayImage,
  getDittoProfileImage,
  setTryOnActive,
} from "@/redux/slices/ditto";
import { CommonLoader } from "@lk/ui-library";
import { CreateNew, Cross, CygnusImg, CygnusTitle } from "./ImageGrid.styles";
import { reDirection } from "containers/Base/helper";

const Header = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
`;
const BodyRoot = styled.div`
  width: 90%;
  margin: 20px auto;
`;

export default function DittoTest({ id, sessionId }: any) {
  // const [modal, setmodal] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const { isLogin, mobileNumber, userDetails } = useSelector(
    (state: RootState) => state.userInfo
  );
  const { subdirectoryPath, countryCode } = useSelector(
    (state: RootState) => state.pageInfo
  );

  const {
    // isDittoAuthSet,
    // testTryOn,
    // dittoImageLoading,
    // thumbnailImage,
    // dittoSignatures,
    cygnus,
  } = useSelector((state: RootState) => state.dittoInfo);

  useEffect(() => {
    if (
      (isLogin && userDetails?.cygnus?.cygnusId) ||
      getCookie("dittoGuestId")
    ) {
      const guestId = getCookie("dittoGuestId")?.toString() || "";

      dispatch(
        getCygnusOverlayImage({
          pid: id,
          sessionId: sessionId,
          guestId:
            isLogin && mobileNumber && userDetails?.cygnus?.cygnusId
              ? ""
              : userDetails?.cygnus?.cygnusId || guestId,
          phoneNumber:
            isLogin && mobileNumber && userDetails?.cygnus?.cygnusId
              ? mobileNumber.toString()
              : "",
          phoneCode: countryCode,
        })
      );
    }
  }, [isLogin, userDetails?.cygnus?.cygnusId]);

  // const [Image, setImage] = useState([
  //   <CreateNew key={0} onClick={() => onClickTryOn()}>
  //     Create New
  //   </CreateNew>,
  // ]);

  // useEffect(() => {
  //   if (!dittoImageLoading && Object.keys(thumbnailImage).length && isLogin) {
  //     for (let i = 0; i < Object.keys(thumbnailImage).length; i++) {
  //       setImage((prevBody): any => [
  //         ...prevBody,
  //         <DittoImg key={prevBody.length + 1}>
  //           <img
  //             alt="logo"
  //             src={thumbnailImage[Object.keys(thumbnailImage)[i]]}
  //             // style={{ zIndex: "10" }}
  //             onClick={() => onClickChangeSlide(Object.keys(thumbnailImage)[i])}
  //           />
  //         </DittoImg>,
  //       ]);
  //     }
  //     // setImage(test);
  //   }
  // }, [dittoImageLoading, thumbnailImage]);

  // const renderDittoImage = (
  //   dittoid: string,
  //   productId: any
  //   // isDittoEnabled: any
  // ) => {
  //   if (getCookie("dittoSignature")) {
  //     // if (window.dittoTimeout) {
  //     //   clearTimeout(window.dittoTimeout);
  //     // }
  //     window.dittoTimeout = setTimeout(() => {
  //       let dittoThumbnailEl;
  //       let thumbnailSelectorId = "#all-ditto-thumbnail";
  //       if (!isLogin) {
  //         dittoThumbnailEl = document.getElementById("ditto-thumbnail");
  //         thumbnailSelectorId = "#ditto-thumbnail";
  //       } else {
  //         dittoThumbnailEl = document.getElementById("all-ditto-thumbnail");
  //       }
  //       if (dittoThumbnailEl) {
  //         // dittoThumbnailEl.innerHTML = "";
  //         window.tryOn = new window.Ditto.Overlay(
  //           {
  //             tryOnServer: dittoObj.serverUrl,
  //             partnerId: "lenskart",
  //             domSelector: "#ditto",
  //             thumbnailSelector: thumbnailSelectorId,
  //             scanId: dittoid,
  //             glassesId: productId || undefined,
  //             accessKey: getCookie("dittoAccessID"),
  //             overlaySignature: getCookie("dittoSignature"),
  //           },
  //           {
  //             success: () => {
  //               console.log("success");
  //             },
  //             failure: () => {
  //               console.log("fail");
  //             },
  //           }
  //         );
  //       }
  //     }, 200);
  //   }
  // };

  const onClickTryOn = () => {
    reDirection(subdirectoryPath);
    localStorage.setItem("DittoOn", "true");
  };

  useEffect(() => {
    return () => {
      if (getCookie("dittoGuestId")) {
        setCookie("isDitto", false);
      }
    };
  }, []);

  // useEffect(() => {
  //   if (testTryOn && isDittoAuthSet && !reviewsLoading) {
  //     const DittoId: string = getCookie("isDittoID")?.toString() || "";
  //     setTimeout(() => {
  //       renderDittoImage(DittoId, id);
  //     }, 500);
  //   }
  // }, [testTryOn, id, isDittoAuthSet, reviewsLoading]);

  const close = () => {
    // setCookie("showMeDitto", false);
    setCookie("isDitto", false);
    dispatch(setTryOnActive(false));
    localStorage.setItem("DittoOn", "false");
  };

  // let vals = [];
  // vals.push(<CreateNew onClick={() => onClickTryOn()}>Create New</CreateNew>);
  // vals.push(
  //   <>
  //     <DittoImg className="dittoThumbnails_child" id="ditto-thumbnail" />
  //   </>
  // );
  // const defaultSlide = 1;

  // const onClickChangeSlide = (DittoId: any) => {
  //   console.log(id, DittoId);

  //   setCookie("dittoSignature", dittoSignatures[DittoId].signature);
  //   renderDittoImage(DittoId, id);
  // };

  return (
    <div>
      <Header>
        <div style={{ visibility: "hidden" }}></div>
        <CygnusTitle>3D Try On</CygnusTitle>
        <Cross onClick={() => close()}>
          <Icons.Cross />
        </Cross>
      </Header>
      {!cygnus.isLoading ? (
        <>
          <BodyRoot>
            {cygnus?.cygnusImageData?.[id] ? (
              <CygnusImg src={cygnus.cygnusImageData[id]} alt="cygnusImg" />
            ) : (
              <span>Image not Available</span>
            )}
            {/* <DittoContain>
          <Ditto3d>
            <TestDiv id="ditto" />
          </Ditto3d>
        </DittoContain> */}
          </BodyRoot>
          <div>
            <CreateNew onClick={() => onClickTryOn()}>Create New</CreateNew>
          </div>
        </>
      ) : (
        <div>
          <CygnusImg
            src="https://static.lenskart.com/media/desktop/img/loader-lk.gif"
            alt="logo"
          />
        </div>
      )}
      {/* <Div>
        <Carousel
          slidesToShow={4}
          wrapperClassName="slider-custom"
          ref={carouselRef}
        >
          {isLogin ? (
            Object.keys(thumbnailImage).length ? (
              Image.map((val, index) => {
                return (
                  <Carousel.Slide
                    id={index}
                    currentSlide={defaultSlide}
                    key={index}
                  >
                    {val}
                  </Carousel.Slide>
                );
              })
            ) : (
              <CommonLoader />
            )
          ) : Object.keys(thumbnailImage).length ? (
            vals.map((val, index) => {
              return (
                <Carousel.Slide
                  id={index}
                  currentSlide={defaultSlide}
                  key={index}
                >
                  {val}
                </Carousel.Slide>
              );
            })
          ) : (
            <CommonLoader />
          )}
        </Carousel>
      </Div> */}
      {/* <DittoImg
        // key={10}
        id="all-ditto-thumbnail"
        // style={{ display: "none" }}
      /> */}
      {/* </Modal.Body>
      </Modal> */}
    </div>
  );
}
