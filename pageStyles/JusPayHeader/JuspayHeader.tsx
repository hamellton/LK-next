import Image from "next/image";
import Link from "next/link";
import { PaymentHeaderWrapper } from "./JuspayHeaderStyles";

interface JuspayHeaderType {
  appLogo: string;
}

const JuspayHeader = ({ appLogo }: JuspayHeaderType) => {
  return (
    <PaymentHeaderWrapper>
      <picture>
        <Link href="/">
          <picture>
            <img alt="Lenskart Logo" src={appLogo} width="110" height="34" />
          </picture>
        </Link>
      </picture>
    </PaymentHeaderWrapper>
  );
};

export default JuspayHeader;
