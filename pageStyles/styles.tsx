import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const NotificationWrapper = styled.div`
  width: 100%;
`;

export const AccountInformationWrapper = styled.div`
  width: 100%;
`;

export const SavedCardWrapper = styled.div`
  width: 75%;
`;

export const CheckBalanceWrapper = styled.div`
  width: 75%;
`;

export const PrescriptionWrapper = styled.div`
  width: 75%;
`;

export const CrossWrapper = styled.div`
  display: flex;
  flex-flow: row-reverse;
  cursor: pointer;
`;

export const ModalDataRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: top;
  border-top: 1px solid #ddd;
  padding: 15px !important;
  margin: 0;
  line-height: normal;
`;

export const ButtonWrapper = styled.div`
  text-align: right;
`;

export const StoreCreditWrapper = styled.div`
  width: 75%;
`;

export const StoreOrderListingWrapper = styled.div``;

export const Table = styled.table`
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  border-color: grey;
  font-size: 14px;
`;

export const TableHead = styled.thead`
  font-weight: bold;
`;

export const TableRow = styled.tr``;

export const TableHeading = styled.th`
  padding: 8px;
  line-height: 1.42857143;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
`;

export const TableBody = styled.tbody`
  tr:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
`;

export const TableData = styled.td`
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border-top: 1px solid #ddd;
`;

export const ModalHeader = styled.div``;

export const Div = styled.div<{ isBold?: boolean }>`
  width: ${(props) => (props.isBold ? "40%" : "")};
  font-weight: ${(props) => (props.isBold ? "900" : "")};
`;

export const AddressbookWrapper = styled.div`
  width: 75%;
`;

export const AddressButtonWrapper = styled.div`
  cursor: pointer;
  margin-bottom: 22px;
  margin-top: 10px;
`;

export const ButtonText = styled.span`
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  color: rgb(0, 185, 198);
`;

export const MyDittoWarpper = styled.div`
  width: 75%;
`;

export const MyOrderWrapper = styled.div<{ isMobileview?: boolean }>`
  // width: 75%;
  width: ${(props) => (props.isMobileview ? "" : "75%")};
`;

export const CheckoutSignInWrapper = styled.div`
  padding: var(--pd-25);
`;

export const AddAddressHeader = styled.div`
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 5px;
`;

export const GiftVoucherHeader = styled.div`
  font-size: 18px;
  font-family: FuturaStd-Book, helvetica neue, Helvetica, Arial, sans-serif;
  letter-spacing: 1px;
`;

export const ModalDataRowVoucher = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: top;
  border-top: 1px solid #ddd;
  padding: 15px !important;
  margin: 0;
  line-height: normal;
  font-family: FuturaStd-Book, helvetica neue, Helvetica, Arial, sans-serif;
  letter-spacing: 1px;
  font-size: 13px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

export const AlertMessage = styled.div<{
  isError?: boolean;
  isRTL?: boolean;
}>`
  color: ${(props) => (props.isError ? "#a94442" : "#000")};
  background-color: ${(props) => (props.isError ? "#f2dede" : "#E9AE15")};
  border-color: ${(props) => (props.isError ? "#ebccd1" : "#faebcc")};
  ${(props) =>
    props.isError
      ? `
    font-size: 13px;
`
      : ""}
  padding: 15px;
  font-family: ${TypographyENUM.lkSansRegular};
  direction: ${(props) => (props.isRTL ? "rtl" : "ltr")};
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  width: 100%;
`;

export const CartError = styled.div`
  display: flex;
  align-items: center;
  margin-top: 60%;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

export const FlexWrapper = styled.div`
  /* display: flex; */
`;

export const MarginBottom = styled.div<{ isMobile?: boolean }>`
  min-height: calc(100vh - 490px);
  @media screen and (max-width: 767px) {
    min-height: calc(100vh - 306px);
    ${(props) => !props?.isMobile && "padding: 16px 16px 16px 22px;"}
    p {
      margin-bottom: 16px;
    }
  }
  a,
  .mobile center > a {
    display: inherit !important;
  }
  a.kl-btn,
  #maindiv1 a,
  .mobile a {
    display: inline-block !important;
  }
  .talignleft .hyper,
  .talignleft b u {
    font-family: "Rajdhani-SemiBold";
  }
  #hip-hop {
    a {
      display: inline-block !important;
    }
    .desk {
      a {
        display: block !important;
      }
    }
  }
  img {
    margin-bottom: -4px;
    max-width: 100%;
  }
  #maincontainerdesktop,
  #maincontainermobile {
    img {
      margin-bottom: -6px;
    }
  }
`;

export const LoaderBackdrop = styled.div<{ show: boolean }>`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 106;
  transition: opacity 0.3s ease;
  opacity: ${({ show }) => (show ? "1" : "0")};
  transform: scale(${({ show }) => (show ? "1" : "0")});
`;

export const Profile3DRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  flex-direction: column;
  width: 100%;
`;

export const CygnusCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8e8e8;
  padding: 15px 10px;
  border-radius: 16px;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #cecedf;
  max-width: 350px;
`;

export const CygnusImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
`;

export const CygnusDelete = styled.span`
  color: #000042;
  text-decoration: underline;
  text-decoration-style: dotted;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
  background: white;
`;

export const DeletePopupContainer = styled.div`
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-size: 16px;
  width: 700px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
`;

export const ConfirmationHeader = styled.div`
  font-family: ${TypographyENUM.defaultHeavy};
  font-size: 18px;
  line-height: 36px;
  letter-spacing: -0.02em;
  color: #333;
`;

export const ConfirmationText = styled.h4`
  font-family: ${TypographyENUM.defaultBook};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #333368;
`;

export const ConfirmBtnRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const PopupDeleteBtn = styled.button`
  outline: none;
  border: none;
  border-radius: 8px;
  padding: 5px 16px;
  background-color: #000042;
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
`;

export const PopupCancelBtn = styled.button`
  background-color: #fff;
  border: 1px solid #000042;
  color: #000042;
  text-transform: uppercase;
  font-size: 16px;
  outline: none;
  border-radius: 8px;
  padding: 5px 16px;
  cursor: pointer;
`;

export const CygnusContainer = styled.div`
  display: flex;
  padding: 20px;
  gap: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CygnusWarningHead = styled.div`
  font-size: 18px;
`;

export const CygnusButton = styled.div`
  color: #000042;
  border: 1px solid #000042;
  background-color: #fff;
  font-family: ${TypographyENUM.defaultHeavy};
  border-radius: 10px;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
`;
