import styled from "styled-components";

export const ButtonsWrapper = styled.div`
  display: flex;
  background-color: var(--white);
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 8px 8px;
  gap: 5px;
  button {
    width: 100%;
  }
  #btn-primary-cl {
    p {
      font-size: 11px;
      font-family: roboto, sans-serif, arial, helvetica, sans-serif !important;
      letter-spacing: 0px;
    }
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  background-color: var(--white);
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  gap: 5px;
`;

export const TryOnButton = styled.div`
  width: 100%;
`;
