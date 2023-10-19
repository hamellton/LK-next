import { AppDispatch, RootState } from "@/redux/store";
import { Auth } from "@lk/ui-library";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { dualLogin } from "@/redux/slices/auth";
import { useRouter } from "next/router";
import { DataType } from "@/types/coreTypes";
import { deleteCookie, setCookie } from "@/helpers/defaultHeaders";
import CryptoJs from "crypto-js";
import sessionStorageHelper from "helpers/sessionStorageHelper";
import { logoutSprinklrBot } from "helpers/chatbot";

const Root = styled.div`
  max-width: 600px;
  min-height: 300px;
  margin: 30px auto 0;
  border: 1px solid #efefef;
  padding: 20px 80px 30px;
  box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
  border-radius: 12px;
`;

interface PresaleType {
  sessionId: string;
  localeData: DataType;
}

export default function Presale({ sessionId, localeData }: PresaleType) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const dualLoginStatus = useSelector(
    (state: RootState) => state.authInfo.dualLoginStatus
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);

  // useEffect(() => {
  //   if (dualLoginStatus.isLoggedIn) {
  //     router.replace("/checkout/address");
  //   }
  // }, [dualLoginStatus.isLoggedIn, router]);

  // useEffect(() => {
  //   if (!userInfo.isLogin && !userInfo.userLoading) {
  //     router.back();
  //   }
  // }, [userInfo.isLogin, userInfo.userLoading]);

  const dualLoginFunction = (username: string, password: string) => {
    const encryptedUsername = CryptoJs.AES.encrypt(
      username,
      "secret-key"
    ).toString();
    const encryptedPassword = CryptoJs.AES.encrypt(
      password,
      "secret-key"
    ).toString();

    setCookie("presalesUN", encryptedUsername);
    setCookie("presalesUP", encryptedPassword);

    dispatch(
      dualLogin({
        password: password,
        username: username,
        sessionId: sessionId,
        pageInfo,
      })
    );
  };

  const handlePresalesLogOut = () => {
    sessionStorageHelper.removeItem("isContactLensCheckboxChecked");
    deleteCookie(`clientV1_${pageInfo.country}`);

    deleteCookie("presalesUN");
    deleteCookie("presalesUP");
    setCookie("isLogined", 0);
    setCookie("log_in_status", false);
    setCookie("isPresale", false);
    window.location.href =
      !pageInfo.subdirectoryPath || pageInfo.subdirectoryPath === "NA"
        ? "/"
        : pageInfo.subdirectoryPath;

    //* logout sprinklr
    logoutSprinklrBot();
  };

  const handlePresalesContinue = () => {
    router.push("/checkout/address");
  };

  return (
    <Root>
      <Auth.PresalesLogin
        dualLoginFunction={dualLoginFunction}
        errorStatus={dualLoginStatus.isError}
        errorMessageStatus={dualLoginStatus.errorMessage}
        isLoggedIn={dualLoginStatus.isLoggedIn}
        localeData={localeData}
        userName={dualLoginStatus?.data?.userName}
        handlePresalesLogOut={handlePresalesLogOut}
        isLoading={dualLoginStatus?.isLoading}
        handlePresalesContinue={handlePresalesContinue}
      />
    </Root>
  );
}
