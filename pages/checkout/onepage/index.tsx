import { useRouter } from "next/router";
import { useEffect } from "react";
export default function RetryPayment() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/checkout/address`);
  }, [router]);
  return null;
}
