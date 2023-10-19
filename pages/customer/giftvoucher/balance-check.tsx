import { CONFIG, COOKIE_NAME, LOCALE } from "../../../constants";
import { APIMethods } from "@/types/apiTypes";
import { BalanceCheckTypes } from "@/types/BalanceCheckTypes";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { GetServerSideProps } from "next";
import {
  fireBaseFunctions,
  headerFunctions,
  sessionFunctions,
} from "@lk/core-utils";
import { APIService } from "@lk/utils";
import BaseSidebar from "../../../containers/MyAccount/baseSideBar";
import { CheckVoucher, Button } from "@lk/ui-library";
import {
  ButtonWrapper,
  CheckBalanceWrapper,
  Div,
  GiftVoucherHeader,
  ModalDataRowVoucher,
} from "../../../pageStyles/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  checkBalance,
  resetCheckBalance,
  updatePayError,
} from "@/redux/slices/checkBalance";
import { Modal } from "@lk/ui-library";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@lk/ui-library";
import {
  ComponentSizeENUM,
  ThemeENUM,
  TypographyENUM,
} from "@/types/baseTypes";
import useCustomerState from "hooks/useCustomerState";
const CheckBalance = ({
  userData,
  localeData,
  headerData,
  configData,
}: BalanceCheckTypes) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: checkBalanceData, errorMessage } = useSelector(
    (state: RootState) => state.checkBalanceInfo
  );
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const onCheckBalance = (params: { query: string }) => {
    if (params.query)
      dispatch(checkBalance({ ...params, sessionId: userData.id }));
  };
  const { isRTL } = useSelector((state: RootState) => state.pageInfo);

  useEffect(() => {
    if (checkBalanceData?.giftVoucherCode) setShowBalanceModal(true);
  }, [checkBalanceData]);

  const toggleBalanceModal = () => {
    if (showBalanceModal) {
      dispatch(resetCheckBalance());
    }
    setShowBalanceModal((showBalanceModal) => !showBalanceModal);
  };
  useCustomerState({
    useMounted: false,
    userData: userData,
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (errorMessage) {
      timeout = setTimeout(() => {
        dispatch(updatePayError({ error: true, errorMessage: "" }));
      }, 1500);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [errorMessage, dispatch]);

  return (
    <>
      <BaseSidebar
        localeData={localeData}
        userData={userData}
        headerData={headerData}
        configData={configData}
      >
        <CheckBalanceWrapper>
          <CheckVoucher
            dataLocale={localeData}
            onCheckBalance={onCheckBalance}
            isRTL={isRTL}
            errorMessage={errorMessage}
          />
        </CheckBalanceWrapper>
      </BaseSidebar>
      <Modal
        show={showBalanceModal}
        onHide={toggleBalanceModal}
        bsSize={"lg"}
        keyboard
        dialogCss={`max-width: 600px;`}
      >
        <Modal.Header
          closeButton={true}
          onHide={toggleBalanceModal}
          voucherModal={true}
          isRTL={pageInfo.isRTL}
        >
          <GiftVoucherHeader>{localeData?.GIFT_VOUCHER_CODE}</GiftVoucherHeader>
        </Modal.Header>
        <Modal.Body>
          <Div
            style={{
              margin: "-15px",
              minHeight: pageInfo.isRTL ? "250px" : "252px",
              background: "white",
              borderRadius: "6px",
            }}
          >
            <ModalDataRowVoucher>
              <Div>{localeData.GIFT_VOUCHER_CODE}</Div>
              <Div isBold>{checkBalanceData?.giftVoucherCode}</Div>
            </ModalDataRowVoucher>
            <ModalDataRowVoucher>
              <Div>{localeData.BALANCE}</Div>
              <Div isBold>{checkBalanceData?.balance}</Div>
            </ModalDataRowVoucher>
            <ModalDataRowVoucher>
              <Div>{localeData.EMAIL_ID}</Div>
              <Div isBold>{checkBalanceData?.email}</Div>
            </ModalDataRowVoucher>
            <ModalDataRowVoucher>
              <Div>{localeData?.EXPIRED_AT}</Div>
              <Div isBold>
                {new Date(checkBalanceData?.expiredAt)
                  ?.toString()
                  ?.slice(0, 15)}
              </Div>
            </ModalDataRowVoucher>

            <ButtonWrapper>
              {/* <PrimaryButton
              disabled={false}
              primaryText="close"
              onBtnClick={toggleBalanceModal}
              id={"primary-button"}
              width={"20%"}
              height="46px"
              theme={ThemeENUM.secondary}
              font={TypographyENUM.defaultBook}
              positionRight={process.env.NEXT_PUBLIC_DIRECTION !== "RTL"}
              style={{
                color: "#333",
                backgroundColor: "#fff",
                borderColor: "#ccc",
                border: "1px solid transparent",
                padding: "6px 12px",
                fontSize: "14px",
                lineHeight: "1.42857143",
                borderRadius: "4px",
              }}
            ></PrimaryButton> */}
              <Button
                font={TypographyENUM.lkSansBold}
                text={localeData?.CLOSE}
                width={100}
                onClick={toggleBalanceModal}
                style={{
                  color: "#333",
                  backgroundColor: "#fff",
                  borderColor: "#ccc",
                  border: "1px solid transparent",
                  padding: "6px 12px",
                  fontSize: "14px",
                  lineHeight: "1.42857143",
                  borderRadius: "4px",
                  width: "60px",
                  height: "34px",
                  float: pageInfo.isRTL ? "left" : "right",
                  margin: "15px",
                }}
              ></Button>
            </ButtonWrapper>
          </Div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CheckBalance;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
    headerArr
  );
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });
  if (!isSessionAvailable) {
    api.setMethod(APIMethods.POST);
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      api
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(`clientV1_${country}`, sessionId.sessionId, { req, res });
    api.resetHeaders();
    api.sessionToken = sessionId.sessionId;
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  } else {
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(`clientV1_${country}`, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }
  const configApi = new APIService(`${process.env.NEXT_PUBLIC_CONFIG_URL}`)
    .setHeaders(headerArr)
    .setMethod(APIMethods.GET);
  const deviceType = process.env.NEXT_PUBLIC_APP_CLIENT;
  const { data: headerData, error: headerDataError } =
    await headerFunctions.getHeaderData(configApi, deviceType);
  const { data: localeData, error: loacleError } =
    await fireBaseFunctions.getConfig(LOCALE, configApi);
  const { data: configData, error: configError } =
    await fireBaseFunctions.getConfig(CONFIG, configApi);
  const { data: userData, error: userError } =
    await sessionFunctions.validateSession(api);
  if (loacleError.isError || userError.isError || headerDataError.isError) {
    return {
      notFound: true,
    };
  }
  setCookie(COOKIE_NAME, userData?.customerInfo.id, { req, res });

  return {
    props: {
      localeData: { ...localeData },
      userData: userData.customerInfo,
      headerData: headerData,
      configData: configData,
    },
  };
};
