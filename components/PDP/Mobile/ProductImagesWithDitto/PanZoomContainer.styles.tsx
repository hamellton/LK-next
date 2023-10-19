import styled from "styled-components";

export const PanZoomWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 102;
  width: 100%;
  background-color: var(--white);
  overflow: hidden;
`;

export const CloseButton = styled.div`
  position: relative;
  left: 95vw;
  top: 10px;
`;

export const ContentWrapper = styled.div`
  position: relative;
  top: 47%;
  left: 50%;
  transform: translate(-50%, -50%);

  .slick-track {
    align-items: center;
  }
`;

export const Img = styled.img`
  width: 100%;
  padding-bottom: 100px;
`;

export const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none;
`;

export const ScrollContainerImg = styled.img<{ active?: boolean }>`
  height: 100%;
  padding: 0 20px;
  border: ${(props) =>
    props.active ? "1px solid #fd6b0b" : "1px solid #eaeff3"};
  transition: border 200ms ease-in-out;
`;

export const ScrollContainerBox = styled.div`
  width: 40vw;
  height: 84px;
  border: 5px solid #eaeff3;
  border-right: none;
  &::last-child {
    border-right: 5px solid #eaeff3;
  }
`;
