import Sidebar from "@/components/MyAccount/SideBar/sidebar";
import { ReactNode } from "react";
import { BaseSidebarWrapper } from "./styles";
import Base from "containers/Base/Base.component";
import { HeaderType } from "@/types/state/headerDataType";
import { DataType, LocaleDataType, LocalType } from "@/types/coreTypes";
import { useRouter } from "next/router";

interface BaseSidebarType {
  children: ReactNode;
  headerData: HeaderType;
  userData: DataType;
  localeData: LocaleDataType;
  configData?: DataType;
}

const BaseSidebar = ({
  children,
  headerData,
  userData,
  localeData,
  configData,
}: BaseSidebarType) => {
  const location = useRouter();
  return (
    <Base
      languageSwitchData={configData?.LANGUAGE_SWITCH_DATA}
      trendingMenus={configData?.TRENDING_MENUS}
      configData={configData || {}}
      headerData={headerData}
      sessionId={userData.id}
      isExchangeFlow={false}
      localeData={localeData}
    >
      <BaseSidebarWrapper
        hide={
          location.pathname.includes("forgotpassword") ||
          location.pathname.includes("resetpassword")
        }
      >
        <Sidebar configData={configData} />
        {children}
      </BaseSidebarWrapper>
    </Base>
  );
};

export default BaseSidebar;
