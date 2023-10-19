import styled from "styled-components";

export const ModalContainer = styled.div`
  padding: 0 60px;
  position: relative;
`;

export const CloseButton = styled.div<{ isTechnicalInfoModal?: boolean }>`
  position: absolute;
  top: ${({ isTechnicalInfoModal }) =>
    isTechnicalInfoModal ? "25px" : "15px"};
  right: 15px;
  display: flex;
  font-size: 20px;
  flex-direction: column;
  width: 20px;
  height: 20px;
  cursor: pointer;

  .left,
  .right {
    height: 2px;
    width: 100%;
    background-color: var(--black);
  }

  .left {
    transform: rotate(45deg) translateY(1px);
  }

  .right {
    transform: rotate(-45deg) translateY(-1px);
  }
`;

export const CarouselContainer = styled.div`
  margin-top: 30px;
  padding-bottom: 30px;

  .slick-prev {
    margin-left: -35px;
    background-image: url("	https://static.lenskart.com/assets/svg/icon-left.svg") !important;

    &:hover {
      background-image: url("	https://static.lenskart.com/assets/svg/icon-left.svg") !important;
    }
  }

  .slick-next {
    margin-right: -35px;
    background-image: url("https://static.lenskart.com/assets/svg/icon-right.svg") !important;

    &:hover {
      background-image: url("https://static.lenskart.com/assets/svg/icon-right.svg") !important;
    }
  }
`;

export const CarouselImgContainer = styled.div<{
  currentSlide: number;
  idx: number;
}>`
  cursor: pointer;
  padding: 15px;
  border: 1px solid
    ${({ idx, currentSlide }) =>
      idx === currentSlide ? "var(--blashish-gray)" : "var(--whitish-grey)"};
  border-radius: 12px;
  margin: 0 10px;
`;

export const CarouselImg = styled.img`
  width: 100%;
`;

export const ZoomedImageContainer = styled.div`
  padding-top: 30px;
  min-height: 350px;
  text-align: center;
`;

export const ZoomedImage = styled.img`
  width: 100%;
  max-width: 350px;
  max-height: 100%;
`;
