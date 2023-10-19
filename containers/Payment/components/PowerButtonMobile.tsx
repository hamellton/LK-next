import React from "react";
import styled from "styled-components";
import { AddPowerButton } from "./PostCheckoutItemsList";

export const PowerAndPdButton = styled.div`
  font-weight: 600;
  font-size: 11px;
  padding: 12px;

  text-transform: uppercase;
  color: white;

  background: #18cfa8;
  margin-top: 20px;
`;

const PowerButtonMobile = ({
  dataLocale,
  onAddPowerClick,
  // onPdClick,
  item,
  mobileView = true,
}: any) => {
  const {
    flags: { canUpdatePrescription },
    powerRequired,
  } = item;

  return (
    <>
      {/* {powerRequired === "POWER_SUBMITTED" &&
       prescriptionView &&
      prescriptionView?.showPd === true && (
				<PowerAndPdButton onClick={onPdClick}>Add Pd</PowerAndPdButton>
			)}

			{console.log(powerRequired,prescriptionView,prescriptionView.showPd,"ui power identification")} */}

      {canUpdatePrescription &&
        powerRequired === "POWER_REQUIRED" &&
        mobileView && (
          <PowerAndPdButton onClick={onAddPowerClick}>
            {dataLocale.ADD_PRESCRIPTION || "Add Prescription"}
          </PowerAndPdButton>
        )}

      {item?.powerRequired === "POWER_SUBMITTED" && (
        <AddPowerButton button={false}>
          {`✓ ${dataLocale.POWER_SUBMITTED}`}
        </AddPowerButton>
      )}
    </>
  );
};

export { PowerButtonMobile };
