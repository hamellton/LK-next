import { TypographyENUM } from "@/types/coreTypes";
import styled from "styled-components";
import { NeedHelpCta } from "@lk/ui-library";
import { Button, Icons } from "@lk/ui-library";
import { ButtonContent } from "pageStyles/CartStyles";
import { PresButtonWrapper } from "./styles";
import Router from "next/router";
import { addPowerCtaClick, addPowerCtaGA } from "helpers/userproperties";

export const Header = styled.div`
  font-family: ${TypographyENUM.serif};
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;
  letter-spacing: -0.02em;
  color: #000042;
`;

export const CartSection = styled.div`
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px 60px;

  display: flex;
  align-items: center;

  gap: 50px;

  margin-bottom: 20px;

  width: 750px;
  height: 225px;

  margin-top: 30px;
`;

export const ImageSection = styled.div`
  vertical-align: middle;
`;

export const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const OrderNo = styled.div`
  font-family: ${TypographyENUM.lkSansBold};
  font-style: normal;
  /* font-weight: 700; */
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #000042;
`;

export const BrandName = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: #333368;
`;

export const Content = styled.div`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #333368;
`;

export const AddPowerButton = styled.div<{ button: boolean }>`
  padding: 12px 20px;
  background: #000042;
  border-radius: 100px;

  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #e2e2ee;
  text-align: center;

  cursor: pointer;
  ${(props) =>
    !props.button && "background: none; color: rgb(17, 218, 172); cursor:auto;"}
`;

export const DottedLine = styled.div`
  border: 1px dashed #e2e2ee;
  width: 100%;
  margin: 10px 0;
`;

export const Wrapper = styled.div`
  padding: 40px 0px;
  position: relative;
  width: 70%;
`;
export const WrapperFullWidth = styled.div`
  padding: 40px 0px;
  position: relative;
  width: 100%;
`;
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15%;
`;

export const ImgWrap = styled.img`
  object-fit: contain;
`;

export interface PostCheckoutItemsListTypes {
  orderData: any;
  onAddPowerClick: (props: any) => void;
  orderList: any;
  configData: any;
  localeData: any;
  cartData: any;
  onPdClick: (props: any) => void;
  dataLocale?: any;
  isRTL: boolean;
  isLogin: boolean;
}

const PostCheckoutItemsList = ({
  orderData,
  onAddPowerClick,
  orderList,
  configData,
  localeData,
  cartData,
  onPdClick,
  dataLocale,
  isRTL,
  isLogin,
}: PostCheckoutItemsListTypes) => {
  const buyOnChatConfig =
    configData?.BUY_ON_CALL_WIDGET &&
    JSON.parse(configData?.BUY_ON_CALL_WIDGET);

  const { cartItems = [] } = cartData || {};
  const pIds = cartItems ? cartItems.map((item: any) => item.itemId) : [];

  const whatsAppChatMsg =
    localeData.BUY_ON_CHAT_HELP_CTA_CART ||
    (localeData.BUYONCHAT_HELP_CTA_CART &&
      (
        localeData.BUY_ON_CHAT_HELP_CTA_CART ||
        localeData.BUYONCHAT_HELP_CTA_CART
      )
        .replace("<pageName>", "Post Checkout Items List Page")
        .replace("<pid-no>", pIds.join(",")));

  const redirectURL = process.env.NEXT_PUBLIC_BASE_ROUTE === 'NA' ? '/' : `/${process.env.NEXT_PUBLIC_BASE_ROUTE}/`

  return (
    <>
      <HeaderSection>
        <Header>
          {localeData.SUBMIT_PRESCRIPTION || "Submit prescription"}
        </Header>
        <NeedHelpCta
          isRendered={buyOnChatConfig?.cta?.isShown}
          isBuyOnChat={buyOnChatConfig?.buyonchat}
          localeData={localeData}
          whatsappChatMsg={whatsAppChatMsg}
          phoneNumber={buyOnChatConfig.eyeglasses.tel}
          // onClick={() => {}}
        />
      </HeaderSection>
      {/* {console.log(orderData, cartItems)} */}

      {orderData &&
        Array.isArray(orderData) &&
        orderData?.map((item: any, idx: any) => (
          <>
            {(item.powerRequired === "POWER_REQUIRED" ||
              item.powerRequired === "POWER_SUBMITTED") && (
              <CartSection key={idx}>
                <ImageSection>
                  <ImgWrap
                    src={item?.image}
                    alt={item?.name}
                    height="128px"
                    width="236px"
                  ></ImgWrap>
                </ImageSection>
                <ContentSection>
                  <OrderNo>Order No : {orderList?.id}</OrderNo>
                  <BrandName>
                    {item?.brandName}({item?.frameSize})
                  </BrandName>
                  <Content>{item?.name}</Content>
                  {item?.flags?.canUpdatePrescription &&
                    item?.powerRequired === "POWER_REQUIRED" && <DottedLine />}
                  {item?.flags?.canUpdatePrescription &&
                    item?.powerRequired === "POWER_REQUIRED" && (
                      <AddPowerButton
                        button
                        onClick={() => {
                          onAddPowerClick({
                            orderList: orderList,
                            item: item,
                          });
                          addPowerCtaClick(true);
                          addPowerCtaGA(
                            "post-purchase-order-listing",
                            "add-power",
                            item?.id,
                            item?.lensType
                          );
                        }}
                      >
                        {localeData.ADD_POWER}
                      </AddPowerButton>
                    )}
                  {item?.powerRequired === "POWER_SUBMITTED" && (
                    <AddPowerButton button={false}>
                      {`✓ ${localeData.POWER_SUBMITTED}`}
                    </AddPowerButton>
                  )}

                  {/* {item?.powerRequired === "POWER_SUBMITTED" &&
                item?.prescriptionView &&
                item?.prescriptionView?.showPd === true && (
                  <AddPowerButton
                    onClick={() =>
                      onPdClick({ orderList: orderList, item: item })
                    }
                  >
                    Add Pd
                  </AddPowerButton>
                )} */}
                </ContentSection>
              </CartSection>
            )}
          </>
        ))}

      <PresButtonWrapper>
        <Button
          id="payment-redirect-button"
          showChildren={true}
          width="100"
          font={TypographyENUM.lkSansBold}
          onClick={() => {
            isLogin
              ? (window.location.href = orderList?.id
                  ? `${redirectURL}customer/account/order-detail/${orderList?.id}`
                  : `${redirectURL}customer/account`)
              : Router.push("/");
          }}
          hoverShadow={true}
          isRTL={isRTL}
        >
          <ButtonContent styledFont={TypographyENUM.lkSansBold} isRTL={isRTL}>
            {isLogin ? localeData.BACK_TO_ORDERS : localeData.CONTINUE_SHOPPING}{" "}
            <Icons.IconRight />
          </ButtonContent>
        </Button>
      </PresButtonWrapper>
    </>
  );
};

export default PostCheckoutItemsList;
