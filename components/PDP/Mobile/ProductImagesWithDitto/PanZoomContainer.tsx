import { Icons } from "@lk/ui-library";
import { MobileCarousel } from "@lk/ui-library";
import React, { useEffect, useState } from "react";
import {
  CloseButton,
  ContentWrapper,
  Img,
  PanZoomWrapper,
  ScrollContainer,
  ScrollContainerBox,
  ScrollContainerImg,
} from "./PanZoomContainer.styles";
import { PanZoomContainerTypes } from "./PanZoomContainer.types";

const PanZoomContainer = ({
  images,
  onCloseHandler,
}: PanZoomContainerTypes) => {
  // disbale scroll on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const [activeImage, setActiveImage] = useState(images?.[0]);

  return (
    <PanZoomWrapper>
      <CloseButton onClick={onCloseHandler}>
        <Icons.Cross></Icons.Cross>
      </CloseButton>
      <ContentWrapper>
        {/* <MobileCarousel images={images} onClickHandler={() => {}}/> */}
        {/* <MobileCarousel images={images}>
          {images.map((item, index) => (
            <Img alt={item.alt + " " + index} src={item.source} key={index} />
          ))}
        </MobileCarousel> */}
        <div>
          <Img alt={activeImage?.alt} src={activeImage?.source} />
        </div>
        <ScrollContainer>
          {images?.map((item, index) => (
            <ScrollContainerBox
              key={index}
              onClick={() => {
                setActiveImage(item);
              }}
            >
              {/* <div> */}
              <ScrollContainerImg
                alt={item?.alt + " " + index}
                src={item?.source}
                active={activeImage?.source === item?.source}
              />
              {/* </div> */}
            </ScrollContainerBox>
          ))}
        </ScrollContainer>
      </ContentWrapper>
    </PanZoomWrapper>
  );
};

export default PanZoomContainer;
