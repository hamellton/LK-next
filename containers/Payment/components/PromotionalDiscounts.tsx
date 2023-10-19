import { DataType, TypographyENUM } from "@/types/coreTypes";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { NewPayment, ApplyCouponBar, Icons } from "@lk/ui-library";
import { CollapsibleSidebar } from "@lk/ui-library";
import { applyRemoveGv, updateCouponError } from "@/redux/slices/cartInfo";
import { AppDispatch, RootState } from "@/redux/store";
import {
  ApplyButton,
  ApplyCouponInput,
  ManualApplyCoupon,
} from "pageStyles/CartStyles";
import { Coupon } from "@lk/ui-library";
import { Alert } from "@lk/ui-library";
import {
  AlertColorsENUM,
  ComponentSizeENUM,
  DeviceTypes,
} from "@/types/baseTypes";
import { useDispatch, useSelector } from "react-redux";

const CardContainer = styled.div<{
  bankoffer?: boolean;
  dottedBtmBorder?: boolean;
  dottedTopBorder?: boolean;
  isOpen?: boolean;
}>`
  display: flex;
  align-items: ${(props) =>
    props.bankoffer || props.isOpen ? "flex-start" : "center"};
  justify-content: space-between;
  padding: 16px;
  flex-direction: ${(props) =>
    props.bankoffer || props.isOpen ? "column" : "row"};
  gap: 16px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  cursor: pointer;
  ${(props) =>
    props.dottedTopBorder
      ? `
      border-top: 1px dashed #d3d3d3;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `
      : ``}
  ${(props) =>
    props.dottedBtmBorder
      ? `
      border-bottom: 1px dashed #d3d3d3;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    `
      : ``}
    background: ${(props) => (props.isOpen ? "#F5F5FF" : "var(--white)")};
`;
const Flex = styled.div<{ justify?: boolean }>`
  display: flex;
  align-items: center;
  ${(props) =>
    props.justify &&
    `
    justify-content: space-between; 
    width: 100%;`}
`;
const RemoveButton = styled.button`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  text-decoration-line: underline;
  text-transform: capitalize;
  color: #000042;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  z-index: 100;
`;
const ORText = styled.div`
  position: absolute;
  left: 50%;
  transform: translateY(-50%);
  font-family: ${TypographyENUM.lkSansBold};
  opacity: 1;
  background: #fff;
  /* z-index: 1000; */
  padding: 0 10px;
  /* font-weight: 700; */
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #333368;
`;
const DiscountsContainer = styled.div`
  position: relative;
`;
// const LeftSection = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     justify-content: space-between;
// `;
const CardHeading = styled.h3<{ isMain?: boolean }>`
  font-family: ${(props) =>
    props.isMain ? TypographyENUM.lkSansBold : TypographyENUM.lkSansRegular};
  font-style: normal;
  font-size: 14px;
  display: block;
  letter-spacing: -0.02em;
  color: var(--text);
  flex: none;
  ${(props) =>
    props.isMain
      ? `
      line-height: 38px;
    `
      : `
    line-height: 20px;
    `}
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
const CardInfoText = styled.p<{ isWallet?: boolean }>`
  font-family: ${(props) =>
    props.isWallet ? TypographyENUM.lkSansBold : TypographyENUM.lkSansRegular};
  font-style: normal;
  /* font-weight: ${(props) => (props.isWallet ? 700 : 400)}; */
  font-size: 12px;
  line-height: ${(props) => (props.isWallet ? "20px" : "18px")};
  letter-spacing: -0.02em;
  color: ${(props) => (props.isWallet ? "#489B1C" : "#66668E")};
  // margin-left: 16px;
`;
// const RightSection = styled.div`
//   display: flex;
// `;
// const RightSectionText = styled.span`
//   margin-right: 10px;
//   font-family: ${TypographyENUM.lkSansRegular};
//   font-style: normal;
//   font-size: 12px;
//   line-height: 18px;
//   letter-spacing: -0.02em;
//   color: #333368;
// `;
const UL = styled.ul`
  margin-left: 1em;
  margin-top: 4px;
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: #66668e;
  min-height: 32px;
`;
const Underline = styled.span`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  text-decoration-line: underline;
  color: #000042;
`;
const HeadContainer = styled.div<{ isRTL?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  margin: ${(props) => (props.isRTL ? "0 16px 0 0px" : "0 0 0 16px")};
`;
const ErrorMessage = styled.div`
  color: red;
  margin: 0 3px;
  font-size: 0.8em;
  padding: 22px 0 8px 0;
`;
export const TextButton = styled.span<{ isRTL?: boolean }>`
  ${(props) => (props.isRTL ? "transform: scaleX(-1)" : "")};
  display: flex;
  align-items: center;
  padding: 4px var(--pd-8);
  cursor: pointer;
  margin-left: 10px;
`;
interface PromotionalDiscountType {
  sessionId: string;
  localeData: DataType;
  applyWalletHandler: (applyArg?: boolean) => void;
  showProceedBtnHandler?: () => void;
  gvCheckoutHandler?: (paymentMtd: string) => void;
  configData: DataType;
  isRetry?: boolean;
}
const PromotionalDiscounts = ({
  sessionId,
  localeData,
  applyWalletHandler,
  showProceedBtnHandler,
  gvCheckoutHandler,
  configData,
  // orderData,
  isRetry,
}: PromotionalDiscountType) => {
  useEffect(() => {
    if (applyWalletHandler && typeof applyWalletHandler === "function")
      applyWalletHandler();
  }, [applyWalletHandler]);

  const dispatch = useDispatch<AppDispatch>();
  const cartData = useSelector((state: RootState) => state.cartInfo);
  const { isRTL, deviceType } = useSelector(
    (state: RootState) => state.pageInfo
  );
  const [isLKCashApplied, setIsLKCashApplied] = useState(false);
  useEffect(() => {
    if (cartData.lkCash.moneySaved > 0) setIsLKCashApplied(true);
    else setIsLKCashApplied(false);
  }, [cartData?.lkCash?.moneySaved]);
  // const walletAmount = cartData.wallets
  //     ? cartData.wallets.reduce(
  //         (accumulator: any, currentValue: any) => accumulator + currentValue.applicableAmount,
  //         0
  //     )
  //     : 0;
  // const isCartEmpty =
  //   useSelector((state: RootState) => state.cartInfo.cartTotal)?.find(
  //     (ct) => ct.type === "total"
  //   )?.amount === 0;

  const shouldRenderWhole =
    cartData.lkCash.totalWalletAmount ||
    cartData?.applicableGvs?.length > 0 ||
    configData?.APPLY_COUPON_ON;
  // || redisCommonData.APPLY_COUPON_ON);

  const shouldRenderLKCash = cartData.lkCash?.isApplicable;
  // walletAmount && cartData.wallets && cartData.wallets.length;

  // cartData.wallets?.length &&
  //     cartData.wallets[0].type === 'lenskart' &&
  //     cartData.wallets[0].applicableAmount !== 0 &&
  //     cartData.applicableGvs?.length === 0;
  // console.log(showApplyCoupon, "showApplyCoupon")
  //  || redisCommonData.APPLY_COUPON_ON;

  // const showOrLine =
  //   cartData.lkCash?.isApplicable &&
  //   cartData.lkCash?.totalWalletAmount &&
  //   cartData.lkCash?.applicableAmount !== 0 &&
  //   cartData.applicableGvs?.length !== 0;
  const showOrLine = (cartData?.lkCash?.applicableAmount > 0)   ? true : false;
  // cartData.wallets?.length &&
  //     cartData.wallets[0].type === 'lenskart' &&
  //     cartData.wallets[0].applicableAmount !== 0 &&
  //     cartData.applicableGvs?.length === 0;
  const showApplyCoupon =
    !isRetry &&
    !!(
      configData?.APPLY_COUPON_ON ||
      (cartData.applicableGvs && cartData.applicableGvs.length)
    );
  // console.log(showApplyCoupon, "showApplyCoupon")
  //  || redisCommonData.APPLY_COUPON_ON;

  /**
   * 1. onLKCashClick => call cart api with ?applyWallet=true
   * 2. onApplyCouponClick => show sidebar for applyCoupon
   */
  // const isLKCashApplied = false;
  const isCouponApplied = false;
  const disabledCoupon = false;
  const disabledLKCash = false;
  const onLKCashClick = () => {
    // console.log("LK cash selected");
    // if(isLKCashApplied) applyWalletHandler(false);
    // else applyWalletHandler(true);
    if (!isLKCashApplied) {
      applyWalletHandler(true);
      cartData.isGvApplied && applyGv(cartData.appliedGv.code, "remove");
    }
    // setIsLKCashApplied(true);
  };

  const newCartOfferDesign = configData?.NEW_CART_OFFER_DESIGN || false;
  const [bestOffers, setBestOffers] = useState([]);
  const [bankOffers, setBankOffers] = useState([]);

  useEffect(() => {
    if (!newCartOfferDesign || cartData?.applicableGvs?.length === 0) return;

    const [bestOffers, bankOffers] = cartData?.applicableGvs.reduce(
      ([a, b], currentGv) => {
        if (!currentGv.paymentOffer) a.push(currentGv);
        else b.push(currentGv);
        return [a, b];
      },
      [[], []]
    );
    setBestOffers(bestOffers);
    setBankOffers(bankOffers);
  }, [cartData]);

  const onApplyCouponClick = () => {
    console.log("Apply coupon selected");
  };
  const [showSidebar, setShowSidebar] = useState(false);
  const [xPosition, setXPosition] = useState(500);
  const [errMsg, setErrorMsg] = useState("");
  const [coupon, setCoupon] = useState("");
  const handleChange = (e: any) => {
    const event = e.target;
    setCoupon(event.value);
    setErrorMsg("");
    const re = /\}/g;
    if (re.test(event.value)) {
      setErrorMsg("Please enter a valid Coupon");
    }
  };
  const applyGv = (code: string, flag: string) => {
    // console.log(code, flag);

    if (flag === "apply") {
      toggleSideBar();
    }
    const reqObj: {
      code: string;
      sessionId: string;
      flag: string;
    } = {
      code: code,
      sessionId: sessionId,
      flag: flag,
    };
    if (flag === "remove") {
      dispatch(applyRemoveGv(reqObj));
    }
  };
  const toggleSideBar = () => {
    setShowSidebar((showSidebar) => !showSidebar);
    if (xPosition === 500) {
      setXPosition(0);
      setCoupon("");
    } else {
      setXPosition(500);
      setCoupon("");
    }
    setErrorMsg("");
  };
  const {
    YOUR_SHOPPING_CART_IS_EMPTY,
    SORRY_NO_COUPON,
    CART,
    WISHLIST_TO_USE_LATER,
    MOVE_WISHLIST,
    LOGIN_TO_SEE_EXISTING,
    BILL_DETAILS,
    REMOVE_ITEM_FROM_CART,
    SAFE_SECURE,
    REMOVE,
    DUPLICATE,
  } = localeData;

  const applyGvHandler = (code: string, flag: string) => {
    // console.log(code, flag);

    if (flag === "apply" && !(deviceType === DeviceTypes.MOBILE)) {
      toggleSideBar();
    }
    setErrorMsg("");
    const reqObj: {
      code: string;
      sessionId: string;
      flag: string;
    } = {
      code: code,
      sessionId: sessionId,
      flag: flag,
    };
    dispatch(applyRemoveGv(reqObj));
  };
  // useEffect(() => {
  //   if(isCartEmpty && (cartData.isGvApplied || isLKCashApplied)) {
  //     showProceedBtnHandler(true, gvCheckoutHandler);
  //   } else if(!isCartEmpty) {
  //     showProceedBtnHandler(false);
  //   }
  // }, [cartData.isGvApplied, isLKCashApplied, isCartEmpty, gvCheckoutHandler, showProceedBtnHandler]);
  useEffect(() => {
    if (cartData.couponError) {
      toggleSideBar();
      setErrorMsg(localeData.YOU_HAVE_ENTERED_INV_COUPON);
      dispatch(updateCouponError({ error: false }));
    }
  }, [cartData.couponError]);
  return shouldRenderWhole ? (
    <DiscountsContainer>
      {/* {shouldRenderLKCash && <div>LKCash</div>}
        {showOrLine && <div>------OR--------</div>}
        {showApplyCoupon && <div>Apply Coupon</div>} */}
      {shouldRenderLKCash ? (
        <CardContainer
          dottedBtmBorder={Boolean(showOrLine)}
          dottedTopBorder={false}
          isOpen={false}
          onClick={
            disabledLKCash
              ? (e) => {
                  e.stopPropagation();
                }
              : (e) => {
                  e.stopPropagation();
                  onLKCashClick();
                }
          }
        >
          <Flex justify>
            <Flex>
              <NewPayment.Radio
                isSelected={isLKCashApplied}
                // onClick={disabledLKCash ? () => null : onLKCashClick}
                disabled={disabledLKCash}
              />
              {/* <NewPayment.CardImage src={data.img} alt="" isSelected={data.isChildrenVisible} /> */}
              {false ? (
                <CardHeading isMain>
                  {localeData.LK_CASH}{" "}
                  {isLKCashApplied ? localeData.APPLIED : ""}
                </CardHeading>
              ) : (
                <HeadContainer>
                  <CardHeading isMain={true}>
                    {localeData.LK_CASH}{" "}
                    {isLKCashApplied ? localeData.APPLIED : ""}
                  </CardHeading>
                  <CardInfoText isWallet={isLKCashApplied}>
                    {isLKCashApplied
                      ? `✓ ${localeData.SAVING} '${localeData.CURRENCY_SYMBOL}${cartData.lkCash.moneySaved}' ${localeData.ON_BILL}`
                      : `${localeData.SAVE} ${localeData.CURRENCY_SYMBOL}${cartData.lkCash.applicableAmount} ${localeData.ON_BILL}`}
                  </CardInfoText>
                </HeadContainer>
              )}
            </Flex>
            {/* {errMsg && <ErrorMessage>{errMsg}</ErrorMessage>} */}
            {/* </ManualApplyCoupon> */}
            {isLKCashApplied ? (
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  applyWalletHandler(false);
                }}
              >
                {localeData.REMOVE}
              </RemoveButton>
            ) : (
              <Icons.ChevronRight />
            )}

            {/* {cartData.applicableGvs && cartData.applicableGvs.length > 0 ? (
              cartData.applicableGvs.map((item, key) => {
                return (
                  <Coupon
                    id={`Coupon-${key}`}
                    width="100"
                    headText={item.code}
                    subText={item.heading}
                    descText={item.description}
                    termsAndCondition={item.termsAndConditions}
                    onClick={() => applyGv(item.code, "apply")}
                    font={TypographyENUM.defaultBook}
                    key={key}
                  />
                );
              })
            ) : (
              <Alert
                color={AlertColorsENUM.golden}
                componentSize={ComponentSizeENUM.large}
                font={TypographyENUM.lkSansRegular}
                id="Alert"
              >
                <Flex>
                  <span>{SORRY_NO_COUPON}</span>
                </Flex>
              </Alert>
            )} */}
          </Flex>
          {/* {data.isChildrenVisible ? data.children : null} */}
        </CardContainer>
      ) : null}
      {shouldRenderLKCash && showApplyCoupon ? <ORText>OR</ORText> : null}
      {showApplyCoupon ? (
        <CardContainer
          dottedBtmBorder={false}
          dottedTopBorder={Boolean(showOrLine)}
          isOpen={false}
          onClick={
            disabledCoupon || cartData.appliedGv.code
              ? (e) => e.stopPropagation()
              : toggleSideBar
          }
        >
          <Flex justify>
            <Flex>
              <NewPayment.Radio
                isSelected={cartData.isGvApplied || showSidebar}
                disabled={disabledCoupon}
                // onClick={disabledCoupon ? () => null : toggleSideBar}
              />
              {/* <NewPayment.CardImage src={data.img} alt="" isSelected={data.isChildrenVisible} /> */}
              {false ? (
                <CardHeading isMain>
                  {cartData.isGvApplied
                    ? `${localeData.USING} '${cartData.appliedGv.code}' ${localeData.COUPON}`
                    : localeData.APPLY_COUPON}
                </CardHeading>
              ) : (
                <HeadContainer isRTL={isRTL}>
                  <CardHeading isMain={true}>
                    {cartData.isGvApplied
                      ? `${localeData.USING} '${cartData.appliedGv.code}' ${localeData.COUPON}`
                      : localeData.APPLY_COUPON}
                  </CardHeading>
                  <CardInfoText isWallet={cartData.isGvApplied}>
                    {cartData.isGvApplied
                      ? `✓ ${localeData.SAVING} '${localeData.CURRENCY_SYMBOL}${
                          cartData.appliedGv?.amount || 0
                        }' ${localeData.ON_BILL}`
                      : localeData.SEE_AVAILABLE_OFFERS}
                  </CardInfoText>
                </HeadContainer>
              )}
            </Flex>
            {cartData.isGvApplied ? (
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  applyGv(cartData.appliedGv.code, "remove");
                }}
              >
                {localeData.REMOVE}
              </RemoveButton>
            ) : (
              <TextButton isRTL={isRTL}>
                <Icons.ChevronRight />
              </TextButton>
            )}
          </Flex>
          {/* {data.isChildrenVisible ? data.children : null} */}
        </CardContainer>
      ) : null}
      {/* <ApplyCoupon
                        id="ApplyCoupon"
                        width="100"
                        headText={
                          couponCode ? `${couponCode} applied` : "Apply Coupon"
                        }
                        subText={
                          couponAmount ? (
                            <span>
                              <Icons.Tick />{" "}
                              {configData.YOU_ARE_SAVING ||
                                config.YOU_ARE_SAVING}{" "}
                              {getCurrency(country) || "₹"}
                              {couponAmount}
                            </span>
                          ) : (
                            configData.CHECK_AVAILABLE_OFFERS ||
                            config.CHECK_AVAILABLE_OFFERS
                          )
                        }
                        isApplied={couponCode.length > 0}
                        onClick={
                          userInfo.isLogin
                            ? () => toggleSideBar()
                            : () =>
                                width > 1024
                                  ? setshowAuthModal(true)
                                  : setBottomSheet(!bottomSheet)
                        }
                        onRemoveClick={() =>
                          applyGvHandler(couponCode, "remove")
                        }
                        font={TypographyENUM.lkSansRegular}
                        isRTL={pageInfo.isRTL}
                      /> */}
      <ApplyCouponBar
        mobileView={deviceType === DeviceTypes.MOBILE}
        applyGvHandler={applyGvHandler}
        appliedCoupon={cartData.appliedGv.code || ""}
        applicableGvs={cartData.applicableGvs}
        sorryNoCoupon={localeData.SORRY_NO_COUPON}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        errMsg={errMsg}
        isRTL={isRTL}
        setErrorMsg={setErrorMsg}
        dataLocale={localeData}
        newCartOfferDesign={newCartOfferDesign}
        bestOffers={bestOffers}
        bankOffers={bankOffers}
      />
      {/* <CollapsibleSidebar
        id="collapsible"
        // height={showSidebar ? "100" : "0"}
        height={100}
        overLay={showSidebar}
        xPosition={xPosition}
        title="Apply Coupon"
        onClose={() => toggleSideBar()}
      >
        <ManualApplyCoupon font={TypographyENUM.lkSansRegular}>
          <Flex>
            <ApplyCouponInput
              name="coupon"
              placeholder="Enter Coupon Code"
              type="text"
              value={coupon}
              onChange={(e) => handleChange(e)}
              isRTL={isRTL}
            />
            <ApplyButton
              isRTL={isRTL}
              onClick={
                coupon.length && !errMsg.length
                  ? () => applyGv(coupon.toUpperCase(), "apply")
                  : () => {}
              }
              isActive={(coupon.length && !errMsg.length) || false}
            >
              APPLY
            </ApplyButton>
          </Flex>
          {errMsg && <span className="errorMsg">{errMsg}</span>}
        </ManualApplyCoupon>

        {cartData.applicableGvs && cartData.applicableGvs.length > 0 ? (
          cartData.applicableGvs.map((item, key) => {
            return (
              <Coupon
                id={`Coupon-${key}`}
                width="100"
                headText={item.code}
                subText={item.heading}
                descText={item.description}
                termsAndCondition={item.termsAndConditions}
                onClick={() => applyGv(item.code, "apply")}
                font={TypographyENUM.defaultBook}
                key={key}
              />
            );
          })
        ) : (
          <Alert
            color={AlertColorsENUM.golden}
            componentSize={ComponentSizeENUM.large}
            font={TypographyENUM.lkSansRegular}
            id="Alert"
          >
            <Flex>
              <span>{SORRY_NO_COUPON}</span>
            </Flex>
          </Alert>
        )}
      </CollapsibleSidebar> */}
    </DiscountsContainer>
  ) : null;
};

export default PromotionalDiscounts;
