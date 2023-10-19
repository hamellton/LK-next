import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import {
  CartHeaderHolder,
  CartHeaderLogo,
  CartHeaderSafeLogo,
  CartHeaderText,
  CartHeaderWrapper,
} from "./CartHeaderStyles";

interface CartHeaderType {
  appLogo: string;
  safeText: string;
}

const CartHeader = ({ appLogo, safeText }: CartHeaderType) => {
  return (
    <CartHeaderHolder className="bookaptHeader">
      <CartHeaderWrapper>
        <CartHeaderLogo>
          <picture>
            <Link href="/">
              <picture>
                <Image
                  alt="lenskart-logo"
                  src={appLogo}
                  width={200}
                  height={61}
                />
              </picture>
            </Link>
          </picture>
        </CartHeaderLogo>
        <CartHeaderSafeLogo>
          <picture>
            <img
              src="https://static.lenskart.com/media/desktop/img/DesignStudioIcons/Shield.svg"
              alt="shield-logo"
            />
          </picture>
          <CartHeaderText>{safeText}</CartHeaderText>
        </CartHeaderSafeLogo>
      </CartHeaderWrapper>
    </CartHeaderHolder>
  );
};

export default CartHeader;
