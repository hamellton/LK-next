// import "./styles.css";
// import { RootState } from "@/redux/store";
import { TypographyENUM } from "@/types/coreTypes";
import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import styled from "styled-components";
import AddedCredit from "./StoreCreditComponents/AddedCredit";
import ApplyCreditSwatch from "./StoreCreditComponents/ApplyCreditSwatch";
import InputField from "./StoreCreditComponents/InputField";
// import ApplyCreditSwatch from "./components/ApplyCreditSwatch";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 36px;
`;
const TopSection = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  display: flex;
`;
const InfoText = styled.span`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: #66668e;
`;
const AddMoreBtn = styled.button`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  /* identical to box height, or 143% */

  letter-spacing: -0.02em;
  text-decoration-line: underline;
  text-transform: capitalize;

  /* Text/Dark/Secondary */

  color: #333368;
`;
const BottomRowBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
`;
const Flex = styled.div<{ column?: boolean }>`
  display: flex;
  ${(props) => props.column && `flex-direction: column`};
`;
const CheckoutButton = styled.button`
  padding: 16px 24px;
  width: 30%;
  height: 56px;
  background: #11daac;
  border-radius: 100px;
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 16px;
  line-height: 24px;
  border: none;
  margin-left: 26px;
  letter-spacing: -0.02em;
  cursor: pointer;
  color: #000042;
  &:disabled {
    background-color: #d3d3d3;
  }
`;
const ErrorField = styled.span`
  color: #e34934;
  font-family: var(--font-lksans-bold);
  font-style: normal;
  /* font-weight: 700; */
  font-size: 12px;
  line-height: 14px;
  margin-top: 4px;
  /* text-align: center; */
  /* text-transform: uppercase; */
`;
// const appliedCredits = [
//   { code: "smmjkmkxsmas", amount: "100" },
//   { code: "cd", amount: "200" }
// ];
export default function StoreCreditNew({
  onSubmit,
  storeError,
  setStoreError,
  appliedCredits,
  removeStoreCredit,
  onCheckout,
  isFullSc,
}: {
  onSubmit: (code: string, amount: number) => void;
  storeError: string;
  setStoreError: (val: string) => void;
  appliedCredits: any;
  removeStoreCredit: (code: string) => any;
  onCheckout: () => void;
  isFullSc: boolean;
}) {
  const [showTextField, setShowTextField] = useState(true);
  const [currentCreditCode, setCurrentCreditCode] = useState("");
  const [currentCreditAmount, setCurrentCreditAmount] = useState("");
  const [isTempCreditCodeAdded, setIsTempCreditCodeAdded] = useState(false);
  //   const appliedSc = useSelector((state: RootState) => state.cartInfo.appliedSc);
  // console.log({showTextField, isTempCreditCodeAdded, appliedCredits});
  useEffect(() => {
    if (appliedCredits?.length) setShowTextField(false);
    else setShowTextField(true);
    if (!!storeError) setShowTextField(true);
  }, [appliedCredits?.length]);
  const openNewField = () => {
    setShowTextField(true);
    setCurrentCreditCode("");
    setCurrentCreditAmount("");
    setIsTempCreditCodeAdded(false);
  };
  const removeCode = (code: string) => {
    // console.log(code);
    // openNewField();
  };
  // console.log(appliedCredits, "appliedSc")
  //   const isFullSc = cart
  return (
    <MainContainer>
      <TopSection>
        <Flex column>
          {appliedCredits?.map((ac: any) => (
            <ApplyCreditSwatch
              key={ac.code}
              onRemove={(code: string) => removeStoreCredit(code)}
              code={ac.code}
              amount={ac.amount}
            />
          ))}
        </Flex>
        {appliedCredits?.length && !isFullSc ? (
          <AddMoreBtn onClick={openNewField}>Add more</AddMoreBtn>
        ) : null}
      </TopSection>
      {/* {isFullSc ? <CheckoutButton onClick={onCheckout}>Checkout</CheckoutButton> : null} */}
      {showTextField ? (
        <BottomRowBox>
          {isTempCreditCodeAdded ? (
            <AddedCredit code={currentCreditCode} onRemove={openNewField} />
          ) : null}
          <InputField
            btnText={isTempCreditCodeAdded ? "Apply" : "Add credit"}
            value={
              isTempCreditCodeAdded ? currentCreditAmount : currentCreditCode
            }
            onApply={
              isTempCreditCodeAdded
                ? () =>
                    onSubmit(currentCreditCode, parseFloat(currentCreditAmount))
                : () => setIsTempCreditCodeAdded(true)
            }
            label={isTempCreditCodeAdded ? "Amount to use (₹)" : "Credit Code"}
            onChange={(e) => {
              if (isTempCreditCodeAdded) setCurrentCreditAmount(e.target.value);
              else setCurrentCreditCode(e.target.value);
              setStoreError("");
            }}
            onKeyPress={
              isTempCreditCodeAdded
                ? (event: any) => {
                    const keycode = event.which;
                    if (
                      !(
                        event.shiftKey === false &&
                        (keycode === 46 ||
                          keycode === 8 ||
                          keycode === 37 ||
                          keycode === 39 ||
                          (keycode >= 48 && keycode <= 57))
                      )
                    ) {
                      event.preventDefault();
                    }
                  }
                : () => null
            }
          />
          <ErrorField>{storeError}</ErrorField>
        </BottomRowBox>
      ) : !isFullSc ? (
        <InfoText>Use other payment method for remaining amount</InfoText>
      ) : null}
    </MainContainer>
  );
}
