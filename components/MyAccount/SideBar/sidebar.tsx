import { DataType } from "@/types/coreTypes";
import Link from "next/link";
import { useRouter } from "next/router";
import { A, LI, SidebarWrapper, UL } from "./styles";

const Sidebar = ({ configData }: { configData?: DataType }) => {
  const location = useRouter();

  //   console.log(configData?.MY_ACCOUNT_DISPLAY, "MY_ACC", location.pathname);
  return (
    <SidebarWrapper
      hide={
        location.pathname.includes("forgotpassword") ||
        location.pathname.includes("resetpassword")
      }
    >
      <UL>
        {configData?.MY_ACCOUNT_DISPLAY?.map(
          (dt: { link: string; text: string; img?: string }) => (
            <LI key={dt.link} isActive={location.pathname === dt.link}>
              <Link href={dt.link}>
                <A img={dt.img}>{dt.text}</A>
              </Link>
            </LI>
          )
        )}
        {/* <LI isActive={location.pathname === '/customer/account'}>
					<Link href="/customer/account/">
						<A>MY ORDERS</A>
					</Link>
				</LI>
				<LI isActive={location.pathname === '/customer/account/edit'}>
					<Link href="/customer/account/edit/">
						<A>ACCOUNT INFORMATION</A>
					</Link>
				</LI>
				<LI isActive={location.pathname === '/customer/manage-notification'}>
					<Link href="/customer/manage-notification">
						<A>MANAGE NOTIFICATIONS</A>
					</Link>
				</LI>
				<LI isActive={location.pathname === '/customer/address'}>
					<Link href="/customer/address/">
						<A>ADDRESS BOOK</A>
					</Link>
				</LI> */}
        {/* <LI isActive={location.pathname === '/customer/prescriptions'}>
					<Link href="/customer/prescriptions/">
						<A>MY PRESCRIPTIONS</A>
					</Link>
				</LI> */}
        {/* <LI isActive={location.pathname === '/customer/saved-cards'}>
					<Link href="/customer/saved-cards/">
						<A>SAVED CARDS</A>
					</Link>
				</LI>
				<LI isActive={location.pathname === '/customer/giftvoucher/balance-check'}>
					<Link href="/customer/giftvoucher/balance-check/">
						<A>CHECK VOUCHER BALANCE</A>
					</Link>
				</LI>
				<LI isActive={location.pathname === '/customer/account/storecredit'}>
					<Link href="/customer/account/storecredit/">
						<A>STORE CREDIT</A>
					</Link>
				</LI> */}
        {/* <LI isActive={location.pathname === '/customer/ditto-profile'}>
					<Link href="/customer/ditto-profile/">
						<A>MY DITTO</A>
					</Link>
				</LI> */}
      </UL>
    </SidebarWrapper>
  );
};

export default Sidebar;
