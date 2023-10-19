import { ComponentSizeENUM, ThemeENUM } from "@/types/baseTypes";
import { Price, Icons, OfferDisplay } from "@lk/ui-library";
import BasicDetails from "@/components/PDP/CLInfo/BasicDetails/basicDetails.component";
import {
  CrossShellImg,
  CrossShellText,
  CrossShellWrapper,
  ExchangeText,
  IconWrapper,
  InfoSection,
  OrderOnPhoneSection,
  OrderOnPhoneText,
  PhoneNumberText,
  PriceWrapper,
  ProductDetailsContainer,
  ProductDetailsHeader,
} from "./CLInfo.styles";
import { CLInfoType } from "./CLInfo.types";

const CLInfo = ({
  id,
  pid,
  productBrand,
  productName,
  wishListSelected,
  triggerWishlist,
  font,
  isRTL = false,
  price,
  showInfo,
  onInfoClick,
  isExchangeFlow,
  children,
  localeData,
  showOfferBanner,
  configData,
  taxInclusivePrice,
  crossShell,
  offerDetails,
  desktopPriceFontBold,
}: CLInfoType) => {
  return (
    <ProductDetailsContainer id={id} styleFont={font}>
      <ProductDetailsHeader isRTL={false}>
        <BasicDetails
          font={font}
          brandName={productBrand}
          productName={productName}
          size=""
        />
        <IconWrapper styleSelected={wishListSelected}>
          {wishListSelected ? (
            <Icons.HeartFilled
              fill="red"
              onClick={() => triggerWishlist(pid)}
            />
          ) : (
            <Icons.Heart
              onClick={() => triggerWishlist(pid)}
              width="1.8em"
              height="1.8em"
              className="wishlist-icon"
            />
          )}
        </IconWrapper>
      </ProductDetailsHeader>
      <PriceWrapper>
        <Price
          id="cl-price"
          isDiscountPriceBigger={true}
          finalPriceColor="var(--turquoise)"
          actualPrice={price.basePrice}
          finalPrice={price.lkPrice}
          hasSpecialPrice={
            price.lkPrice === 0 || price.lkPrice === price.basePrice
              ? false
              : true
          }
          componentSize={ComponentSizeENUM.large}
          font={font}
          strikeThroughColor="var(--serene-gray)"
          actualPriceColor="var(--serene-gray)"
          styleTheme={ThemeENUM.primary}
          currencyCode={price.symbol}
          isRTL={isRTL}
          dataLocale={localeData}
          taxInclusivePrice={taxInclusivePrice}
          desktopPriceFontBold={desktopPriceFontBold}
        ></Price>
        {showInfo && (
          <InfoSection onClick={onInfoClick}>
            <Icons.Info />
          </InfoSection>
        )}
      </PriceWrapper>
      {showOfferBanner && Object.keys(offerDetails || {}).length > 0 && (
        <OfferDisplay
          headline1={offerDetails.headline1}
          headline2={offerDetails.headline2}
          icon={offerDetails.icon}
        />
      )}
      <CrossShellWrapper>
        <CrossShellImg
          src="https://static.lenskart.com/media/desktop/img/pdp/additional_item.png"
          alt={localeData.ADDITIONAL_ITEM}
        />
        <CrossShellText>
          {crossShell[0] !== undefined ? crossShell[0]?.title : ""}
        </CrossShellText>
      </CrossShellWrapper>
      {isExchangeFlow && (
        <ExchangeText>{localeData.EXCHANGE_TEXT}</ExchangeText>
      )}
      {configData?.SHOW_PHONE_SECTION_CONTACT_LENS_PDP && (
        <OrderOnPhoneSection>
          <OrderOnPhoneText>{localeData.ORDER_ON_PHONE}</OrderOnPhoneText>
          <PhoneNumberText>{localeData.MISSED_CALL_TEXT}</PhoneNumberText>
        </OrderOnPhoneSection>
      )}
      {children}
    </ProductDetailsContainer>
  );
};

export default CLInfo;
