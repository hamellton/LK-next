import styled from "styled-components";

export const SectionWrapper = styled.section`
  width: 70%;
  /* margin: 10px; */
  position: relative;
`;

export const View360Wrapper = styled.div`
  position: absolute;
  right: 13px;
  top: 0;
  cursor: pointer;
`;

export const View360Image = styled.img`
  width: 100%;
  height: 100%;
`;

export const View360IFrame = styled.iframe`
  border: none;
  width: 100%;
  height: 100%;
`;

export const ModalBody = styled.div`
  width: 100%;
  height: 100vh;
`;

export const CrossWrapper = styled.div`
  display: flex;
  flex-flow: row-reverse;
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 15px;
`;

export const CygnusImg = styled.img`
  width: 100%;
  max-height: 600px;
  object-fit: contain;
`;

export const CygnusTitle = styled.div`
  font-family: rajdhani-regular;
  font-weight: 500;
  text-align: center;
  flex-grow: 1;
  align-self: center;
  color: #414b56;
  font-size: 28px;
`;

export const Cross = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const CreateNew = styled.button`
  color: #00bac6;
  border: 1.5px solid #00bac6;
  width: max-content;
  height: max-content;
  padding: 10px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  letter-spacing: 0.02em;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  margin-bottom: 10px;
`;
