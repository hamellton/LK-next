import React, { useEffect } from "react";
import { Spinner } from "@lk/ui-library";
import { hideSprinklrBot } from "containers/Base/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetServerSideProps } from "next";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { COOKIE_NAME } from "@/constants/index";
import { createAPIInstance } from "@/helpers/apiHelper";
import { APIMethods } from "@/types/apiTypes";
import { sessionFunctions } from "@lk/core-utils";

export default function Retry() {
  const deviceType = useSelector(
    (state: RootState) => state.pageInfo.deviceType
  );
  useEffect(() => {
    hideSprinklrBot(deviceType);
  }, []);
  return <Spinner fullPage={true} />;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable =
    hasCookie(`clientV1_${country}`, { req, res }) &&
    getCookie(COOKIE_NAME, { req, res }) !== "";
  let currentSessionId;
  if (!isSessionAvailable) {
    const sessionAPI = createAPIInstance({ method: APIMethods.POST });
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      sessionAPI
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(COOKIE_NAME, sessionId.sessionId, { req, res });
    currentSessionId = sessionId.sessionId;
  } else {
    currentSessionId = `${getCookie(COOKIE_NAME, { req, res })}`;
  }

  const api = createAPIInstance({ sessionToken: currentSessionId });

  const { error: sessionError } = await sessionFunctions.validateSession(api);

  if (sessionError.isError) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
