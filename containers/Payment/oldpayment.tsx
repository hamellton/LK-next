import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Tabs,
  Tab,
  Payment as PaymentComponent,
  Icons,
  Accordion,
  Alert,
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
  TypographyENUM,
} from "@/types/baseTypes";
import { Flex } from "../../pageStyles/CartStyles";
import { userProperties } from "helpers/userproperties";
import { APIService } from "@lk/utils";
import { fireBaseFunctions } from "@lk/core-utils";
import { headerArr } from "helpers/defaultHeaders";
import { LOCALE } from "@/constants/index";
import { APIMethods } from "@/types/apiTypes";

const Payment = ({ sessionId, configData }: any) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const paymentData = useSelector((state: RootState) => state.paymentInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);
  const countryCode = useSelector(
    (state: RootState) => state.pageInfo.countryCode
  );

  // const [paymentKey, setPaymentKey] = useState(paymentMethods?.defaultMethodCode)
  const [enabledPaymentMethod, setEnabledPaymentMethod] = useState<Array<any>>(
    []
  );
  const [activeKey, setActiveKey] = useState("cc");
  const [showPayment, setShowpayment] = useState(true);
  const processPaymentForm: React.MutableRefObject<any> = useRef(null);

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
    // const { cartData, login } = this.props;
    // if (cartData.result) {
    //   addPaymentInfoGA4(cartData?.result, paymentType, login);
    // }
    // if (this.props.exchange) {
    //   // ExchangeOnly case
    //   const isExchangeOnly = sessionStorageHelper.getItem('isExchangeOnlyCase');
    //   if (!isExchangeOnly) {
    //     const orderId = getSetCookie.getCookie('exchangeOrderId');
    //     const { createReturn, userAddress } = this.props;
    //     const returnUserAddress = userAddress || sessionStorageHelper.getItem('returnUserAddress');
    //     let returnData;
    //     if (returnUserAddress) {
    //       returnData = createItemReturnData(returnUserAddress);
    //       if (orderId && returnData) {
    //         createReturn(orderId, returnData);
    //         this.setState({ createOrderPaymentParams: { dataObj, paymentType, gatewayId } });
    //       }
    //     } else {
    //       this.createOrderPaymentCall(dataObj, paymentType, gatewayId);
    //     }
    //   } else {
    //     this.createOrderPaymentCall(dataObj, paymentType, gatewayId);
    //   }
    // } else {
    createOrderPaymentCall(dataObj, paymentType, gatewayId);
    // }
  };

  const createOrderPaymentCall = (
    dataObj: any,
    paymentType: any,
    gatewayId: any
  ) => {
    // const { cartData, redisCommonData } = props;
    const data = {
      device: "desktop",
      leadSource: null,
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
      device: "desktop",
      leadSource: null,
      paymentInfo: {
        paymentMethod: paymentType,
      },
    };
    // this.setState({
    //   orderPaymentType: paymentType,
    //   orderGatewayId: gatewayId,
    // });

    // Check contact lens consent
    // if (hasContactLensItems(cartData?.result?.items) && redisCommonData?.CL_DISCLAIMER) {
    //   // timestamp format for consent yyyy-mm-dd hh:mm:ss
    //   const date = new Date();
    //   const timestamp = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${(
    //     '0' + date.getDate()
    //   ).slice(-2)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    //   data.consent = {
    //     type: 'contact-lens',
    //     timestamp,
    //   };
    // }

    // if (props.localeInfo.countryCode !== 'in' && !window.HyperServices)
    //   alert('Error fetching payment method');
    // else if (this.props.exchange)
    //   this.props.orderPayment(paymentType === 'sc' ? scData : data, true);
    // else
    const reqObj = {
      sessionId: "39d9545b-b8fe-4b2c-b3bd-e0f677435f52",
      payDetailObj: paymentType === "sc" ? scData : data,
    };

    dispatch(getOrderPayment(reqObj));
  };

  const filterPaymentMethod = (paymentMethods: any) => {
    setEnabledPaymentMethod([]);
    // Filter enabled payment methods and save gv, lenskartwallet in one and others in one
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
        // setPaymentKey(enabledMethod.groupId)
      }
      // if (enabledMethod.groupEnabled && enabledMethod.groupId === 'gv') {
      //   gvEnabled = true;
      // }
      setEnabledPaymentMethod(enabledPaymentMethod);
    });
    // this.showMoreToggle();
  };

  const getActiveTabs = (event: string) => {
    console.log("e", event);
    setActiveKey(event);
  };

  return (
    <>
      <PaymentModuleWrapper>
        {enabledPaymentMethod.length > 0 ? (
          <Accordion
            title="PAYMENT OPTIONS"
            expand={showPayment}
            handleExpand={() => setShowpayment(!showPayment)}
            src={""}
            // margin,
            subtitle=""
          >
            {/* {(!payZero || isFullSCApplied) && ( */}
            <Tabs
              activeKey={activeKey}
              animation={false}
              //   defaultActiveKey={isSavedCards ? 'savedCards' : defaultPaymentMode}
              id="uncontrolled-tab-example"
              onSelect={(event: any) => getActiveTabs(event)}
              style={{ width: "50%", marginTop: "20px" }}
            >
              {/* {isSavedCards && !payZero && login && (
             <Tab
               key="savedCards"
               className="saved-cards-tab"
               disabled={
                 payZero ||
                 (paymentKey === 'sc' &&
                   sessionStorage.getItem('isValidSC') !== null &&
                   JSON.parse(sessionStorage.getItem('isValidSC')).cartTotal === 0)
               }
               eventKey="savedCards"
               title={
                 <span className="payment-panel">
                   <span className="choose-payment">{SAVED_CARDS}</span>
                   <span>
                    
                     {getDetaultPGateway &&
                       !getDetaultPGateway.offerText &&
                       getDetaultPGateway.prepaidDiscountAmount && (
                         <span>
                           {currencySymbol}
                           {`${getDetaultPGateway.prepaidDiscountAmount} off`}
                         </span>
                       )}
                     {getDetaultPGateway && getDetaultPGateway.offerText && (
                       <span>{getDetaultPGateway.offerText}</span>
                     )}
                   </span>
                 </span>
               }
             >
               <UserSavedCards
                 applyOffer={(paymentData, isRedirection, cvvLength, data, type, order) =>
                   applyOffer(paymentData, true, cvvLength, data, type, '', '', order)
                 }
                 binConfig={binConfig}
                 createOrderPayment={data =>
                   createOrderPayment(data, 'cc', defaultPaymentGateway)
                 }
                 dataLocale={dataLocale}
                 frameProduct={frameProduct}
                 loadingPlaceOrder={loadingPlaceOrder}
                 order="vertical"
                 orderTotal={cartData.result.totals && cartData.result.totals.total}
                 paymentCTA={paymentCTA}
                 usersSavedCardsList={usersSavedCardsList}
               />
             </Tab>
           )} */}
              {enabledPaymentMethod &&
                enabledPaymentMethod?.map((payment: any, index: number) => {
                  if (
                    payment.groupId === "gv" ||
                    payment.groupId === "lenskartwallet" ||
                    payment.groupId === "exchange"
                  ) {
                    return null;
                  }
                  return (
                    <Tab
                      key={index}
                      // disabled={
                      //   payZero ||
                      //   (payment.groupId === 'cod' &&
                      //     cartData.result !== undefined &&
                      //     cartData.result.deliveryOption === 'EXPRESS') ||
                      //   (payment.groupId === 'cod' && !paymentMethods.showCod)
                      //     ? true
                      //     : false ||
                      //       (paymentKey === 'sc' &&
                      //         payment.groupId !== 'sc' &&
                      //         sessionStorage.getItem('isValidSC') !== null &&
                      //         JSON.parse(sessionStorage.getItem('isValidSC')).cartTotal === 0)
                      // }
                      eventKey={payment.groupId}
                      title={
                        <span className="payment-panel">
                          <span className="choose-payment">
                            {payment.groupLabel}
                          </span>
                          {/* {payment.groupId === 'cod' &&
                       cartData.result !== undefined &&
                       cartData.result.deliveryOption === 'EXPRESS' ? (
                         <span className="express-label">{NOT_AVAILABLE_XPRESS_DELIVERY}</span>
                       ) : null}
                       {!payment.groupOfferText && payment.prepaidDiscountAmount && (
                         <span>
                           {payment.groupType === 'wallet' ? `${EXTRA} ` : ''}
                           {currencySymbol}
                           {payment.prepaidDiscountAmount} {OFF}
                         </span>
                       )} */}
                          {payment.groupOfferText && (
                            <span>{payment.groupOfferText}</span>
                          )}
                        </span>
                      }
                    >
                      {(payment.groupId === "cc" || payment.groupId === "dc") &&
                        payment.groupEnabled && (
                          <PaymentComponent.PaymentCard
                            // appliedPaymentOffer={appliedPaymentOffer && cardNumber ? true : ''}
                            // applyOffer={(data, type) => {
                            //   if (applyOffer) {
                            //     return applyOffer(
                            //       { cardNumber: data.paymentCardNum },
                            //       true,
                            //       data.paymentCardCVV.length,
                            //       data,
                            //       type
                            //     );
                            //   }
                            // }}
                            // createOrderPayment={(data, type) =>
                            //   createOrderPayment(data, type, payment.methods[0].gatewayId)
                            // }
                            // dataLocale={dataLocale}
                            // frameProduct={frameProduct}
                            // isApplyOfferEnable={
                            //   payment.methods[0] && payment.methods[0].isDefaultOfferApplicable
                            // }
                            // loadingPlaceOrder={loadingPlaceOrder}
                            // localeInfo={localeInfo}
                            // paymentCTA={paymentCTA}
                            // paymentKey={paymentKey}
                            // removeOfferPopup={removeOfferPopup}
                            createOrderPayment={(data: any, type: string) =>
                              createOrderPayment(
                                data,
                                type,
                                payment.methods[0].gatewayId
                              )
                            }
                            dataLocale={{
                              SECURE: "SECURE",
                              BANK_CARDS: "Bank Cards",
                              PLEASE_ENTER_CARDHOLDER_NAME:
                                "Please enter Cardholder name.",
                              PLEASE_ENTER_VALID_CARD_NUMBER:
                                "Please enter a valid card number.",
                              PLEASE_ENTER_VALID_CVV_NUMBER:
                                "Please enter a valid CVV number",
                              PLEASE_ENTER_VALID_EXPIRY_DATE:
                                "Please enter a valid expiry date.",
                              LEARN_MORE_TEXT: "Learn More",
                              EDIT: "Edit",
                              ENTER_CARD_NUMBER: "Enter Card Number",
                              EXPIRY_DATE: "Expiry Date",
                              MM_YY: "MM/YYYY",
                              HOW_TO_FIND_CVV: "How to find CVV?",
                              CVV: "CVV",
                              CARDHOLDER_NAME: "Cardholder Name",
                              CLEAR_VALUES: "Clear Values",
                              SECURE_CARD:
                                "Secure this card as per RBI guidelines",
                            }}
                            appliedPaymentOffer=""
                            applyOffer={() =>
                              console.log("Apply Code function call")
                            }
                            frameProduct={false}
                            isApplyOfferEnable={false}
                            loadingPlaceOrder={undefined}
                            localeInfo={{ countryCode: "in" }}
                            paymentCTA={{
                              mainText: "Place order",
                              subText: "(Submit Power in the Next Step)",
                            }}
                            paymentKey="cc"
                            removeOfferPopup={() =>
                              console.log("Remove Offer Popup function call")
                            }
                          />
                        )}
                      {payment.groupType === "wallet" &&
                        payment.groupEnabled && (
                          <>
                            {payment.groupId === "wallets" ? (
                              <span>hi</span>
                            ) : (
                              // <Wallets
                              //   applyOffer={(offerId, walletCode, paymentGateway) => {
                              //     if (applyOffer) {
                              //       return applyOffer(
                              //         { offerId },
                              //         true,
                              //         '',
                              //         '',
                              //         'wallets',
                              //         walletCode,
                              //         paymentGateway
                              //       );
                              //     }
                              //   }}
                              //   createOrderPayment={(data, type, gatewayId) =>
                              //     createOrderPayment(data, type, gatewayId)
                              //   }
                              //   dataLocale={dataLocale}
                              //   frameProduct={frameProduct}
                              //   loadingPlaceOrder={loadingPlaceOrder}
                              //   paymentCTA={paymentCTA}
                              //   paymentKey={paymentKey}
                              //   walletsList={payment.methods}
                              // />
                              <>
                                <WalletList
                                  applyOffer={(
                                    offerId: any,
                                    walletCode: any,
                                    paymentGateway: any
                                  ) => {
                                    // if (applyOffer) {
                                    //   return applyOffer(
                                    //     { offerId },
                                    //     true,
                                    //     '',
                                    //     '',
                                    //     'wallets',
                                    //     walletCode,
                                    //     paymentGateway
                                    //   );
                                    // }
                                    console.log(
                                      "Paytm, Gpay",
                                      offerId,
                                      walletCode,
                                      paymentGateway
                                    );
                                  }}
                                  createOrderPayment={(
                                    data: any,
                                    type: any,
                                    gatewayId: any
                                  ) =>
                                    createOrderPayment(data, type, gatewayId)
                                  }
                                  dataLocale={{
                                    YOU_WILL_REDIRECTED_TO_PAYMENT:
                                      "You will be redirected to Payment gateway upon placing the order.",
                                  }}
                                  frameProduct={false}
                                  loadingPlaceOrder={undefined}
                                  paymentCTA={{
                                    mainText: "Place order",
                                    subText: "(Submit Power in the Next Step)",
                                  }}
                                  walletDetails={payment}
                                />
                              </>
                            )}
                          </>
                        )}
                      {payment.groupId === "nb" && payment.groupEnabled && (
                        <PaymentComponent.NetBanking
                          applyOffer={(offerId: any, bankCode: any) => {
                            console.log(offerId, bankCode);
                            // if (applyOffer) {
                            //   return applyOffer({ offerId }, true, '', '', 'nb', bankCode);
                            // }
                          }}
                          banksList={payment.methods[0].banks}
                          createOrderPayment={(data: any, type: string) =>
                            createOrderPayment(data, type, "PU")
                          }
                          dataLocale={{
                            PAY_USING_NETBANKING: "Pay using Netbanking",
                            SHOW_MORE: "Show More",
                          }}
                          frameProduct={false}
                          loadingPlaceOrder={false}
                          isRTL={isRTL}
                          paymentCTA={{
                            mainText: "Place order",
                            subText: "(Submit Power in the Next Step)",
                          }}
                        />
                      )}
                      {/* {payment.groupId === 'cod' && payment.groupEnabled && (
                     <COD
                       createOrderPayment={(data, type) => createOrderPayment(data, type)}
                       dataLocale={dataLocale}
                       frameProduct={frameProduct}
                       loadingPlaceOrder={loadingPlaceOrder}
                       payZero={payZero}
                       payZeroPaymentMethod={payZeroPaymentMethod}
                       paymentCTA={paymentCTA}
                     />
                   )} */}
                      {
                        // login &&
                        payment.groupId === "sc" && (
                          // (payment.groupEnabled || isFullSCApplied) && (
                          <PaymentComponent.StoreCredit
                            // applyCode={applyCode}
                            // cartData={cartData}
                            // createOrderPayment={(data, type) => createOrderPayment(data, type)}
                            // currencyMark={currencyMark}
                            // dataLocale={dataLocale}
                            // frameProduct={frameProduct}
                            // loadingPlaceOrder={loadingPlaceOrder}
                            // payZero={payZero}
                            // paymentCTA={paymentCTA}
                            // scMessage={scMessage}

                            id="store-credit-card"
                            applyCode={() =>
                              console.log("Apply Code function cal")
                            }
                            cartData={cartData}
                            createOrderPayment={() =>
                              console.log("Create Order Payment function call")
                            }
                            currencyMark={{
                              INR: "₹",
                              SGD: "$",
                              AED: "AED",
                              SAR: "SAR",
                              USD: "$",
                            }}
                            dataLocale={{
                              APPLY: "APPLY",
                              APPLY_STORE_CREDIT: "Apply Store Credit",
                              CHECKOUT: "CHECKOUT",
                              ENTER_AMOUNT: "Enter Amount",
                              ENTER_CODE: "Enter Code",
                              PLACE_ORDER: "PLACE ORDER",
                              PLEASE_PAY_REMAINING_AMOUNT:
                                "Please pay remaining amount using other payment option.",
                              REMOVE: "remove",
                            }}
                            frameProduct={false}
                            loadingPlaceOrder={undefined}
                            payZero={null}
                            paymentCTA={{
                              mainText: "Place order",
                              subText: "(Submit Power in the Next Step)",
                            }}
                            scMessage={null}
                          />
                        )
                        // )
                      }
                      {/* {payment.groupId === 'po' && payment.groupEnabled && (
                     <PurchaseOrder
                       createOrderPayment={(data, type) => createOrderPayment(data, type)}
                       dataLocale={dataLocale}
                       frameProduct={frameProduct}
                       loadingPlaceOrder={loadingPlaceOrder}
                       paymentCTA={paymentCTA}
                     />
                   )} */}
                    </Tab>
                  );
                })}
            </Tabs>
            {/* )} */}
            {/* {showMoreToToggle && enabledPaymentMethod.length > showMoreLimit && !payZero && (
         <div className="show-more-payment-options" onClick={() => showMoreToggle('toggled')}>
           <span>
             {SHOW_MORE_OPTIONS} <i aria-hidden="true" className="fa fa-chevron-down"></i>
           </span>
         </div>
       )} */}
            {/* {payZero && !isFullSCApplied && (
         <COD
           createOrderPayment={(data, type) => createOrderPayment(data, type)}
           dataLocale={dataLocale}
           frameProduct={frameProduct}
           loadingPlaceOrder={loadingPlaceOrder}
           payZero={payZero}
           payZeroPaymentMethod={payZeroPaymentMethod}
           paymentCTA={paymentCTA}
         />
       )} */}
          </Accordion>
        ) : (
          <Alert
            color={AlertColorsENUM.blue}
            componentSize={ComponentSizeENUM.large}
            font={TypographyENUM.lkSansRegular}
            id="Alert"
          >
            <Flex>
              <span>PLEASE LOGIN TO CONTINUE PAYMENT</span>
            </Flex>
          </Alert>
        )}

        <TermConditionWrapper styledFont={TypographyENUM.defaultBook}>
          <Paragraph styledFont={TypographyENUM.defaultBook}>
            By placing the order, I have read and agreed to lenskart.sg
          </Paragraph>
          <LinkText
            target="_blank"
            href="https://preprod.lenskart.com/tnc_checkout"
          >
            T&amp;C
          </LinkText>
        </TermConditionWrapper>
        <LenskartAssuranceWrapper>
          <Head>
            <Text styledFont={TypographyENUM.defaultMedium}>
              Lenskart Assurance
            </Text>
            <CancellationPolicy styledFont={TypographyENUM.defaultBook}>
              Cancellation Policy
              <Icons.RightArrow />
            </CancellationPolicy>
          </Head>
          <ImageStrip>
            <Image
              src={
                "https://static1.lenskart.com/media/desktop/img/all-assurance-offering.png"
              }
              alt="assurance"
              width={1200}
              height={150}
            />
          </ImageStrip>
        </LenskartAssuranceWrapper>
      </PaymentModuleWrapper>
      {paymentData?.paymentDetails?.payment?.actionInfo?.redirectUrl && (
        <div className="hidden">
          {/* {window &&
              window.dtm.LenskartRewamp &&
              window.dtm.LenskartRewamp.checkout.load.placeOrderBtnClickSuccess(
                this.state.orderPaymentType
              )} */}
          <form
            ref={processPaymentForm}
            action={
              paymentData?.paymentDetails?.payment?.actionInfo?.redirectUrl
            }
            method="post"
          >
            {Object.keys(
              paymentData?.paymentDetails?.payment?.actionInfo?.requestParams
            ).map((data) => {
              return (
                <p key={"p_" + data}>
                  {data}
                  :
                  <input
                    key={data}
                    readOnly
                    name={data}
                    type="text"
                    value={
                      paymentData?.paymentDetails?.payment?.actionInfo
                        ?.requestParams?.[data]
                    }
                  />
                </p>
              );
            })}
          </form>
        </div>
      )}
    </>
  );
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
