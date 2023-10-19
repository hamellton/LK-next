import { RootState } from "@/redux/store";
import { ProductDetailType } from "@/types/productDetails";
import { Components } from "@lk/ui-library";
// import { isRTL } from "pageStyles/constants";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  CarouselContainer,
  CarouselImg,
  CarouselImgContainer,
  CloseButton,
  ModalContainer,
  ZoomedImage,
  ZoomedImageContainer,
} from "./CustomModalStyles";

const { Modal, Carousel } = Components;

interface CustomModalTypes {
  productDetailData: ProductDetailType;
  showImageZoomModal: boolean;
  onHide: () => void;
  selectedSlide: number;
}

export default function CustomModal({
  productDetailData,
  showImageZoomModal,
  onHide,
  selectedSlide,
}: CustomModalTypes) {
  const [currentSlide, setCurrentSlide] = useState(selectedSlide || 0);
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const carouselRef = useRef(null);

  useEffect(() => {
    setCurrentSlide(selectedSlide || 0);
  }, [selectedSlide]);

  return (
    <Modal
      show={showImageZoomModal}
      onHide={() => onHide()}
      keyboard
      bsSize="lg"
      dialogClassName="image-zoom-modal"
    >
      <Modal.Body>
        <ModalContainer>
          <CloseButton onClick={() => onHide()} role="button" tabIndex={-1}>
            <div className="left"></div>
            <div className="right"></div>
          </CloseButton>
          <ZoomedImageContainer>
            <ZoomedImage
              src={productDetailData?.gridImages[currentSlide]?.imageUrl}
              alt=""
            />
          </ZoomedImageContainer>
          <CarouselContainer>
            <Carousel
              carouselConfig={{
                afterChange: (index: number) => setCurrentSlide(index),
              }}
              slidesToShow={6}
              initialSlide={currentSlide}
              wrapperClassName="slider-custom"
              sliderClassName="custom-zoom-image"
              isRTL={isRTL}
              ref={carouselRef}
            >
              {productDetailData.gridImages.map((product, idx) => (
                <Carousel.Slide
                  id={product.id}
                  currentSlide={currentSlide}
                  key={product.id}
                >
                  <CarouselImgContainer
                    currentSlide={currentSlide}
                    idx={idx}
                    onClick={() => setCurrentSlide(idx)}
                  >
                    <CarouselImg src={product.imageUrl} alt="" />
                  </CarouselImgContainer>
                </Carousel.Slide>
              ))}
            </Carousel>
          </CarouselContainer>
        </ModalContainer>
      </Modal.Body>
    </Modal>
  );
}
