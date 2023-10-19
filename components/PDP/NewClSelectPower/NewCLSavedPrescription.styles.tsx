import styled from "styled-components";

export const SavedPrescriptionContainer = styled.div`
  background: #ffffff;
`;

export const NoPrescriptionText = styled.div`
  display: flex;
  gap: 18px;
  flex-direction: column;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 1px;
  color: rgba(60, 60, 60, 0.54);

  p {
    margin: 0;
  }
`;

export const SavedPrescriptionWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const SavedPrescriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  padding: 10px;
`;

export const UserDetail = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const UserDetailInitial = styled.div`
  height: 100%;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 1;
  letter-spacing: 0.4px;
  color: #ffffff;
  padding: 0.7em;
  min-width: 2.4em;
  border-radius: 50%;
  background-color: #ffd28f;
  text-transform: uppercase;
  text-align: center;
`;
export const UserDetailText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 400;
  line-height: 120%;
  font-style: normal;
`;

export const UserName = styled.p`
  font-size: 15px;
  letter-spacing: 0.6px;
  color: #3c3c3c;
  margin: 0;
`;

export const UserPrescDate = styled.p`
  font-size: 12px;
  letter-spacing: 0.6px;
  color: rgba(60, 60, 60, 0.38);
  margin: 0;
`;

export const SelectedStatusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  gap: 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #00b9c6;
  border: none;
  background: none;
  height: max-content;
  cursor: pointer;
`;
export const SavedPrescriptionBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 166%;
  letter-spacing: 0.6px;
  width: 100%;
`;

export const SavedPrescriptionPowerType = styled.div`
  background: linear-gradient(
      0deg,
      rgba(191, 238, 239, 0.08),
      rgba(191, 238, 239, 0.08)
    ),
    #ffffff;
  padding: 10px;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  font-size: 15px;
`;

export const PowerTypeList = styled.ul`
  padding: 0;
  margin: 0;
  width: 100%;
`;

export const PowerTypeListitem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding: 10px;
`;

export const PowerTypeTitle = styled.p`
  margin: 0;
`;

export const PowerTypeNumbers = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;

  p {
    min-width: 55px;
    margin: 0;
    text-align: center;
  }
`;

export const NavigationArrowRight = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  transform: matrix(-1, 0, 0, 1, 0, 0);
  padding: 8px 10px;
  width: max-content;
  border-radius: 50%;
  position: absolute;
  top: 44px;
  cursor: pointer;
  left: -24px;

  img {
    height: 1em;
    width: 1em;
  }
`;
export const NavigationArrowLeft = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  transform: matrix(-1, 0, 0, 1, 0, 0);
  padding: 8px 10px;
  width: max-content;
  border-radius: 50%;
  position: absolute;
  top: 44px;
  cursor: pointer;
  right: -24px;

  img {
    height: 1em;
    width: 1em;
  }
`;
