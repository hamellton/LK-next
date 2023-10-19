import { DirectionENUM } from "containers/ProductDetail/ProductDetail.types";
import styled, { css, keyframes } from "styled-components";

export const PackageCardGroup = styled.div`
  display: flex;
  max-width: 1130px;
  width: 100%;
  margin: 10px auto;
  padding: 0 30px;
  position: relative;
`;

export const PackageBtn = styled.button<{ dir: DirectionENUM }>`
  display: block;
  height: 50px;
  width: 50px;
  border-radius: 24px;
  background-color: #fff;
  -webkit-box-shadow: 0 4px 4px rgb(0 0 0 / 5%);
  box-shadow: 0 4px 4px rgb(0 0 0 / 5%);
  padding: 20px;
  margin-bottom: 20px;
  background-repeat: no-repeat;
  background-position: center;
  line-height: 0;
  font-size: 0;
  cursor: pointer;
  color: transparent;
  top: 50%;
  transform: translate(0, -50%);
  border: none;
  outline: 0;
  position: absolute;
  z-index: 10;
  ${(props) =>
    props.dir === DirectionENUM.left
      ? `
        background-image: url('https://static.lenskart.com/assets/svg/icon-left.svg');
        left: 0;`
      : `background-image: url('https://static.lenskart.com/assets/svg/icon-right.svg');
        right: 0;`}
`;

export const PackagesList = styled.div`
  display: flex;
  padding: 0;
  width: 100%;
  overflow: hidden;
`;

const animateLeft = keyframes`
	from {
		transform: translate3d(-30%, 0, 0);
	}
	to {
		transform: translate3d(0, 0, 0);
	}
`;

const animateRight = keyframes`
  from {
		transform: translate3d(30%, 0, 0);
	}
	to {
		transform: translate3d(0, 0, 0);
	}
`;

export const PackageListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  gap: 16px;
  flex: 1;
  animation-name: ${animateRight};
  animation-duration: 0.5s;
`;

export const PackagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 46px;
  gap: 16px;
  flex-grow: 1;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const VerticalContainer = styled.div<{ animateRight?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  /* animation-name: ${animateRight}; */
  animation-name: ${(props) =>
    props.animateRight ? animateRight : animateLeft};
  animation-duration: 0.5s;
`;

export const PackageCardTrack = styled.div<{
  width: string;
  individualWidth: number;
  activeSlide: number;
  moveToCenter: boolean;
}>`
  width: ${(props) => (props.width ? props.width : "100")}%;
  opacity: 1;
  display: flex;
  transform: translate3d(
    ${(props) =>
      props.individualWidth && props.activeSlide
        ? `-${props.individualWidth * props.activeSlide}px`
        : "0px"},
    0px,
    0px
  );
  transition: transform 350ms ease-in-out;
  ${(props) =>
    props.moveToCenter &&
    css`
      justify-content: center;
    `}
`;
export const InlineLoader = styled.img`
  display: block;
  width: 80px;
  margin: 0 auto;
`;
