import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Tabs,
  Tab,
  Payment as PaymentComponent,
  Icons,
  Accordion,
  Alert,
  Auth,
} from "@lk/ui-library";
import WalletList from "../../components/Wallet/WalletList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getDeliveryOptions,
  getOrderPayment,
  getPayMethods,
  getShippingAddress,
} from "@/redux/slices/paymentInfo";
import { GetServerSideProps } from "next";
import { getCookie, hasCookie } from "@/helpers/defaultHeaders";
import {
  CancellationPolicy,
  Head,
  ImageStrip,
  LenskartAssuranceWrapper,
  LinkText,
  Paragraph,
  PaymentModuleWrapper,
  TermConditionWrapper,
  Text,
} from "../../pageStyles/paymentStyles";
import Image from "next/image";
import {
  AlertColorsENUM,
  ComponentSizeENUM,
  DeviceTypes,
  TypographyENUM,
} from "@/types/baseTypes";
import {
  ButtonContent,
  Flex,
  HeadingText,
  RightWrapper,
  StickyDiv,
} from "../../pageStyles/CartStyles";
import { userProperties } from "helpers/userproperties";
import { APIService } from "@lk/utils";
import { fireBaseFunctions } from "@lk/core-utils";
import { headerArr } from "helpers/defaultHeaders";
import { LOCALE } from "@/constants/index";
import { APIMethods } from "@/types/apiTypes";
import { CheckoutWrapper, Heading } from "pageStyles/Checkout.styles";
import { NewPriceBreakup } from "@lk/ui-library";
import { Button } from "@lk/ui-library";
import { CommonLoader } from "@lk/ui-library";
import PaymentCard from "../../containers/Payment/components/PaymentScreen";
import PaymentLoader from "../../containers/Payment/components/PaymentLoader";
import PaymentSummary from "../../containers/Payment/components/PaymentSummary";
import CartHeader from "pageStyles/CartHeader/CartHeader";
import { getCurrency } from "helpers/utils";

const Payment = ({ sessionId, configData }: any) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const paymentData = useSelector((state: RootState) => state.paymentInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const isRTL = pageInfo.isRTL;
  const [enabledPaymentMethod, setEnabledPaymentMethod] = useState<Array<any>>(
    []
  );
  const [activeKey, setActiveKey] = useState("cc");
  const [showPayment, setShowpayment] = useState(true);
  const processPaymentForm: React.MutableRefObject<any> = useRef(null);
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );

  let pageName = "shipping-page";
  let platform = "desktop";
  useEffect(() => {
    if (!userInfo.userLoading)
      userProperties(userInfo, pageName, platform, configData);
  }, [userInfo.userLoading]);

  useEffect(() => {
    // Line 24-59 will be shifted to shippingaddress checkout page when session token issue is resolved
    let message = "Hi";
    let senderName = "SK";
    let receiverName = "AV";
    let senderPhone = 9110086006;
    const shippingAddressObj = {
      sessionId: sessionId,
      address: {
        addressType: "billing",
        addressline1: "10 Harris Street",
        addressline2: "Port Louis",
        alternatePhone: "",
        city: "Bangalore",
        country: "IN",
        email: "el-djabir@hotmail.com",
        firstName: "El Djabir",
        floor: 0,
        gender: "male",
        landmark: null,
        lastName: " Kodabaccus",
        liftAvailable: false,
        locality: null,
        phone: "9999999999",
        phoneCode: { countryCode },
        postcode: "560095",
        state: "KARNATAKA",
      },
      giftMessage: message
        ? {
            from: senderName,
            message,
            to: receiverName,
            mobileNumber: senderPhone,
          }
        : null,
    };
    dispatch(getShippingAddress(shippingAddressObj));
    dispatch(
      getDeliveryOptions({
        sessionId: sessionId,
        postcode: "560095",
        country: "IN",
      })
    );
    dispatch(
      getPayMethods({ sessionId: sessionId, orderId: "", isExchange: false })
    );
  }, [dispatch, sessionId]);

  useEffect(() => {
    let processOrder = paymentData.paymentDetails.order;
    let processPayment = paymentData.paymentDetails.payment.actionInfo;
    if (processOrder.id) {
      if (processPayment && processPayment.action) {
        if (processPayment.action === "DONE") {
          // console.log("DONE");
          router.push("/checkout/success");
          // history.push(pathname);
        } else if (processPayment.action === "GENERATE_QR_CODE") {
          // console.log("Generate QR Code");
          router.push(`/checkout/payment/qr/${btoa(processOrder.id)}`);
        } else {
          processPaymentForm.current.submit();
        }
      } else {
        processPaymentForm.current.submit();
      }
    }
  }, [paymentData, router]);

  useEffect(() => {
    if (paymentData.payment && paymentData.payment.paymentMethods)
      filterPaymentMethod(paymentData?.payment?.paymentMethods);
  }, [paymentData.payment]);

  const createOrderPayment = (
    dataObj: any,
    paymentType: string,
    gatewayId: string
  ) => {
    // console.log(dataObj, paymentType, gatewayId);
    createOrderPaymentCall(dataObj, paymentType, gatewayId);
  };

  const createOrderPaymentCall = (
    dataObj: any,
    paymentType: any,
    gatewayId: any
  ) => {
    const data = {
      device:
        process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase() ===
        DeviceTypes.DESKTOP
          ? DeviceTypes.DESKTOP
          : DeviceTypes.MOBILE,
      leadSource: null,
      isWebNewArch: true,
      nonFranchiseOrder: false,
      orderId: "1930480038",
      paymentInfo: {
        card: {
          cardBrand: null,
          cardMode: null,
          cardToken: dataObj?.cardToken,
          cardType: dataObj?.cardType,
          cvv: dataObj?.paymentCardCVV,
          expired: null,
          expiryMonth:
            dataObj?.paymentCardExpiry &&
            dataObj.paymentCardExpiry.substring(0, 2),
          expiryYear:
            dataObj?.paymentCardExpiry && dataObj.paymentCardExpiry.slice(-4),
          nameOnCard: dataObj?.paymentCardName,
          number: dataObj?.paymentCardNum,
          oneClick: false,
          oneClickToken: null,
          storeCard: dataObj?.savecard,
        },
        gatewayId,
        netbanking: {
          bankCode: dataObj?.netBankingBank,
        },
        partialPaymentInfo: {
          partialPayment: false,
          partialPaymentAmount: 0,
          partialPaymentMethod: null,
        },
        paymentMethod: paymentType,
        poNumber: dataObj?.value !== "" ? dataObj?.value : null,
        subscriptionOrderId: null,
      },
    };
    const scData = {
      device:
        process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase() ===
        DeviceTypes.DESKTOP
          ? DeviceTypes.DESKTOP
          : DeviceTypes.MOBILE,
      leadSource: null,
      isWebNewArch: true,
      paymentInfo: {
        paymentMethod: paymentType,
      },
    };
    const reqObj = {
      sessionId: "39d9545b-b8fe-4b2c-b3bd-e0f677435f52",
      payDetailObj: paymentType === "sc" ? scData : data,
    };

    dispatch(getOrderPayment(reqObj));
  };

  const filterPaymentMethod = (paymentMethods: any) => {
    setEnabledPaymentMethod([]);
    paymentMethods?.forEach((enabledMethod: any) => {
      if (
        enabledMethod.groupEnabled &&
        enabledMethod.groupId !== "gv" &&
        enabledMethod.groupId !== "lenskartwallet"
      ) {
        enabledPaymentMethod.push(enabledMethod);
      }
      if (!enabledMethod.groupEnabled && enabledMethod.groupId === "sc") {
        enabledPaymentMethod.push(enabledMethod);
      }
      setEnabledPaymentMethod(enabledPaymentMethod);
    });
  };

  const getActiveTabs = (event: string) => {
    // console.log("e", event);
    setActiveKey(event);
  };
  const [showAddAddress, setShowAddAddress] = useState(false);
  const submitRef = useRef<HTMLFormElement>(null);

  return (
    <div style={{ height: "100vh", backgroundColor: "#FBF9F7" }}>
      <CartHeader
        appLogo="https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg"
        safeText={configData.SAFE_SECURE}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: "#FBF9F7",
          margin: "auto",
          maxWidth: "1500px",
        }}
      >
        <CheckoutWrapper>
          {!showAddAddress ? (
            <>
              <Heading>{configData.SELECT_ADDRESS}</Heading>
            </>
          ) : (
            <Heading>{configData.SAVE_ADDRESS}</Heading>
          )}
          <div>
            <PaymentCard />
          </div>
          <PaymentSummary
            success={false}
            heading={configData.ORDER_CONFIRMED_AND_THANK_YOU_MESSAGE}
            mainInfo={configData.YOU_WILL_RECEIVE_AN_ORDER_AND_VIEW_ORDER}
            dataLocale={configData}
          />
          {/* <PaymentLoader /> */}
          <div
            style={{
              width: "100%",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Auth.AnimatedCheck />
          </div>
        </CheckoutWrapper>
        {cartData.cartItems && cartData.cartItems.length > 0 ? (
          <RightWrapper padding="30px">
            <StickyDiv>
              <HeadingText styledFont={TypographyENUM.lkSansRegular}>
                {configData.BILL_DETAILS}
              </HeadingText>
              <NewPriceBreakup
                id="1"
                width="100"
                dataLocale={configData}
                priceData={cartData.cartTotal}
                showPolicy={pageInfo.country !== "sa"}
                showCart={false}
                isRTL={isRTL}
                currencyCode={getCurrency(pageInfo.country)}
                enableTax={configData?.ENABLE_TAX}
              />
              <Button
                id="button"
                showChildren={true}
                width="100%"
                font={TypographyENUM.lkSansBold}
                onClick={(e: any) =>
                  submitRef?.current && submitRef?.current.click()
                }
              >
                {/* <Link href={"/checkout"} passHref> */}
                <ButtonContent styledFont={TypographyENUM.lkSansBold}>
                  {configData.SAVE_AND_PROCEED} <Icons.IconRight />
                </ButtonContent>
                {/* </Link> */}
              </Button>
            </StickyDiv>
          </RightWrapper>
        ) : (
          <div style={{ padding: "50px" }}>
            <CommonLoader />
          </div>
        )}
      </div>
    </div>
  );
  // return (
  //   <>
  //     <PaymentModuleWrapper>
  //       {enabledPaymentMethod.length > 0 ? (
  //         <Accordion
  //           title="PAYMENT OPTIONS"
  //           expand={showPayment}
  //           handleExpand={() => setShowpayment(!showPayment)}
  //           src={""}
  //           subtitle=""
  //         >
  //           <Tabs
  //             activeKey={activeKey}
  //             animation={false}
  //             //   defaultActiveKey={isSavedCards ? 'savedCards' : defaultPaymentMode}
  //             id="uncontrolled-tab-example"
  //             onSelect={(event: any) => getActiveTabs(event)}
  //             style={{ width: "50%", marginTop: "20px" }}
  //           >
  //             {enabledPaymentMethod &&
  //               enabledPaymentMethod?.map((payment: any, index: number) => {
  //                 if (
  //                   payment.groupId === "gv" ||
  //                   payment.groupId === "lenskartwallet" ||
  //                   payment.groupId === "exchange"
  //                 ) {
  //                   return null;
  //                 }
  //                 return (
  //                   <Tab
  //                     key={index}
  //                     eventKey={payment.groupId}
  //                     title={
  //                       <span className="payment-panel">
  //                         <span className="choose-payment">
  //                           {payment.groupLabel}
  //                         </span>
  //                         {payment.groupOfferText && (
  //                           <span>{payment.groupOfferText}</span>
  //                         )}
  //                       </span>
  //                     }
  //                   >
  //                     {(payment.groupId === "cc" || payment.groupId === "dc") &&
  //                       payment.groupEnabled && (
  //                         <PaymentComponent.PaymentCard
  //                           createOrderPayment={(data: any, type: string) =>
  //                             createOrderPayment(
  //                               data,
  //                               type,
  //                               payment.methods[0].gatewayId
  //                             )
  //                           }
  //                           dataLocale={{
  //                             SECURE: "SECURE",
  //                             BANK_CARDS: "Bank Cards",
  //                             PLEASE_ENTER_CARDHOLDER_NAME:
  //                               "Please enter Cardholder name.",
  //                             PLEASE_ENTER_VALID_CARD_NUMBER:
  //                               "Please enter a valid card number.",
  //                             PLEASE_ENTER_VALID_CVV_NUMBER:
  //                               "Please enter a valid CVV number",
  //                             PLEASE_ENTER_VALID_EXPIRY_DATE:
  //                               "Please enter a valid expiry date.",
  //                             LEARN_MORE_TEXT: "Learn More",
  //                             EDIT: "Edit",
  //                             ENTER_CARD_NUMBER: "Enter Card Number",
  //                             EXPIRY_DATE: "Expiry Date",
  //                             MM_YY: "MM/YYYY",
  //                             HOW_TO_FIND_CVV: "How to find CVV?",
  //                             CVV: "CVV",
  //                             CARDHOLDER_NAME: "Cardholder Name",
  //                             CLEAR_VALUES: "Clear Values",
  //                             SECURE_CARD:
  //                               "Secure this card as per RBI guidelines",
  //                           }}
  //                           appliedPaymentOffer=""
  //                           applyOffer={() =>
  //                             console.log("Apply Code function call")
  //                           }
  //                           frameProduct={false}
  //                           isApplyOfferEnable={false}
  //                           loadingPlaceOrder={undefined}
  //                           localeInfo={{ countryCode: "in" }}
  //                           paymentCTA={{
  //                             mainText: "Place order",
  //                             subText: "(Submit Power in the Next Step)",
  //                           }}
  //                           paymentKey="cc"
  //                           removeOfferPopup={() =>
  //                             console.log("Remove Offer Popup function call")
  //                           }
  //                         />
  //                       )}
  //                     {payment.groupType === "wallet" && payment.groupEnabled && (
  //                       <>
  //                         {payment.groupId === "wallets" ? (
  //                           <span>hi</span>
  //                         ) : (
  //                           <>
  //                             <WalletList
  //                               applyOffer={(
  //                                 offerId: any,
  //                                 walletCode: any,
  //                                 paymentGateway: any
  //                               ) => {
  //                                 console.log(
  //                                   "Paytm, Gpay",
  //                                   offerId,
  //                                   walletCode,
  //                                   paymentGateway
  //                                 );
  //                               }}
  //                               createOrderPayment={(
  //                                 data: any,
  //                                 type: any,
  //                                 gatewayId: any
  //                               ) => createOrderPayment(data, type, gatewayId)}
  //                               dataLocale={{
  //                                 YOU_WILL_REDIRECTED_TO_PAYMENT:
  //                                   "You will be redirected to Payment gateway upon placing the order.",
  //                               }}
  //                               frameProduct={false}
  //                               loadingPlaceOrder={undefined}
  //                               paymentCTA={{
  //                                 mainText: "Place order",
  //                                 subText: "(Submit Power in the Next Step)",
  //                               }}
  //                               walletDetails={payment}
  //                             />
  //                           </>
  //                         )}
  //                       </>
  //                     )}
  //                     {payment.groupId === "nb" && payment.groupEnabled && (
  //                       <PaymentComponent.NetBanking
  //                         applyOffer={(offerId: any, bankCode: any) => {
  //                           console.log(offerId, bankCode);
  //                         }}
  //                         banksList={payment.methods[0].banks}
  //                         createOrderPayment={(data: any, type: string) =>
  //                           createOrderPayment(data, type, "PU")
  //                         }
  //                         dataLocale={{
  //                           PAY_USING_NETBANKING: "Pay using Netbanking",
  //                           SHOW_MORE: "Show More",
  //                         }}
  //                         frameProduct={false}
  //                         loadingPlaceOrder={false}
  //                         paymentCTA={{
  //                           mainText: "Place order",
  //                           subText: "(Submit Power in the Next Step)",
  //                         }}
  //                       />
  //                     )}
  //                     {
  //                       payment.groupId === "sc" && (
  //                         <PaymentComponent.StoreCredit
  //                           id="store-credit-card"
  //                           applyCode={() =>
  //                             console.log("Apply Code function cal")
  //                           }
  //                           cartData={cartData}
  //                           createOrderPayment={() =>
  //                             console.log("Create Order Payment function call")
  //                           }
  //                           currencyMark={{
  //                             INR: "₹",
  //                             SGD: "$",
  //                             AED: "AED",
  //                             SAR: "SAR",
  //                             USD: "$",
  //                           }}
  //                           dataLocale={{
  //                             APPLY: "APPLY",
  //                             APPLY_STORE_CREDIT: "Apply Store Credit",
  //                             CHECKOUT: "CHECKOUT",
  //                             ENTER_AMOUNT: "Enter Amount",
  //                             ENTER_CODE: "Enter Code",
  //                             PLACE_ORDER: "PLACE ORDER",
  //                             PLEASE_PAY_REMAINING_AMOUNT:
  //                               "Please pay remaining amount using other payment option.",
  //                             REMOVE: "remove",
  //                           }}
  //                           frameProduct={false}
  //                           loadingPlaceOrder={undefined}
  //                           payZero={null}
  //                           paymentCTA={{
  //                             mainText: "Place order",
  //                             subText: "(Submit Power in the Next Step)",
  //                           }}
  //                           scMessage={null}
  //                         />
  //                       )
  //                     }
  //                   </Tab>
  //                 );
  //               })}
  //           </Tabs>
  //         </Accordion>
  //       ) : (
  //         <Alert
  //           color={AlertColorsENUM.blue}
  //           componentSize={ComponentSizeENUM.large}
  //           font={TypographyENUM.lkSansRegular}
  //           id="Alert"
  //         >
  //           <Flex>
  //             <span>PLEASE LOGIN TO CONTINUE PAYMENT</span>
  //           </Flex>
  //         </Alert>
  //       )}

  //       <TermConditionWrapper styledFont={TypographyENUM.defaultBook}>
  //         <Paragraph styledFont={TypographyENUM.defaultBook}>
  //           By placing the order, I have read and agreed to lenskart.sg
  //         </Paragraph>
  //         <LinkText
  //           target="_blank"
  //           href="https://preprod.lenskart.com/tnc_checkout"
  //         >
  //           T&amp;C
  //         </LinkText>
  //       </TermConditionWrapper>
  //       <LenskartAssuranceWrapper>
  //         <Head>
  //           <Text styledFont={TypographyENUM.defaultMedium}>
  //             Lenskart Assurance
  //           </Text>
  //           <CancellationPolicy styledFont={TypographyENUM.defaultBook}>
  //             Cancellation Policy
  //             <Icons.RightArrow />
  //           </CancellationPolicy>
  //         </Head>
  //         <ImageStrip>
  //           <Image
  //             src={
  //               "https://static1.lenskart.com/media/desktop/img/all-assurance-offering.png"
  //             }
  //             alt="assurance"
  //             width={1200}
  //             height={150}
  //           />
  //         </ImageStrip>
  //       </LenskartAssuranceWrapper>
  //     </PaymentModuleWrapper>
  //     {paymentData?.paymentDetails?.payment?.actionInfo?.redirectUrl && (
  //       <div className="hidden">
  //         <form
  //           ref={processPaymentForm}
  //           action={
  //             paymentData?.paymentDetails?.payment?.actionInfo?.redirectUrl
  //           }
  //           method="post"
  //         >
  //           {Object.keys(
  //             paymentData?.paymentDetails?.payment?.actionInfo?.requestParams
  //           ).map(data => {
  //             return (
  //               <p key={"p_" + data}>
  //                 {data}
  //                 :
  //                 <input
  //                   key={data}
  //                   readOnly
  //                   name={data}
  //                   type="text"
  //                   value={
  //                     paymentData?.paymentDetails?.payment?.actionInfo
  //                       ?.requestParams?.[data]
  //                   }
  //                 />
  //               </p>
  //             );
  //           })}
  //         </form>
  //       </div>
  //     )}
  //   </>
  // );
};

export default Payment;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });
  const configApi = new APIService(`${process.env.FIREBASE_URL}`)
    .setHeaders(headerArr)
    .setMethod(APIMethods.GET);
  const { data: configData } = await fireBaseFunctions.getConfig(
    LOCALE,
    configApi
  );
  if (!isSessionAvailable) {
    return {
      notFound: true,
    };
  } else {
    const sessionId = `${getCookie(`clientV1_${country}`, { req, res })}`;
    return {
      props: {
        sessionId,
        configData: configData,
      },
    };
  }
};
