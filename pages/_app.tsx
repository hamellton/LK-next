import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { FontStyles, GlobalStyles } from "globalStyles";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalTheme } from "../globalTheme";
import FacebookPixel from "../helpers/facebookPixel";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { LoaderBackdrop } from "pageStyles/styles";
import { switchBackgroundScroll } from "helpers/utils";
import "../components/AlgoliaSearch/search.css";
import { appendScriptToDOM } from "containers/Base/helper";
import {
  getCookie,
  setCookie,
  hasCookie,
  deleteCookie,
} from "@/helpers/defaultHeaders";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const isNewArch = getCookie("newArch");
    if (!isNewArch) setCookie("newArch", true);
  }, []);

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    const lk = { getCookie, setCookie, hasCookie, deleteCookie };
    window.__LK__ = lk;
    if (
      ["prod", "production"].includes(
        process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase() as string
      ) &&
      process.env.NEXT_PUBLIC_TRACKJS_TOKEN &&
      process.env.NEXT_PUBLIC_TRACKJS_APPLICATION
    ) {
      const db = indexedDB.open("test");
      db.onsuccess = () => {
        appendScriptToDOM(
          "https://cdn.trackjs.com/agent/v3/latest/t.js",
          "trackjs",
          true,
          () => {
            window.TrackJS.install({
              token: process.env.NEXT_PUBLIC_TRACKJS_TOKEN,
              application: process.env.NEXT_PUBLIC_TRACKJS_APPLICATION,
              enabled: !(
                window.location.host?.indexOf("localhost") >= 0 ||
                window.location.host?.indexOf("lenskart.com:3000") >= 0
              ),
            });
          }
        );
      };
    }
    setCookie("cameFromNewArch", true);
    NProgress.configure({
      showSpinner: false,
    });
    Router.events.on("routeChangeStart", () => {
      NProgress.start();
      setLoader(true);
      switchBackgroundScroll(true);
    });
    Router.events.on("routeChangeComplete", () => {
      NProgress.done();
      setLoader(false);
      switchBackgroundScroll(false);
    });
    Router.events.on("routeChangeError", () => {
      NProgress.done();
      setLoader(false);
      switchBackgroundScroll(false);
    });
    return () => {
      Router.events.off("routeChangeStart", () => {
        NProgress.start();
        setLoader(true);
        switchBackgroundScroll(true);
      });
      Router.events.off("routeChangeComplete", () => {
        NProgress.done();
        setLoader(false);
        switchBackgroundScroll(false);
      });
      Router.events.off("routeChangeError", () => {
        NProgress.done();
        setLoader(false);
        switchBackgroundScroll(false);
      });
    };
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>

      <Provider store={store}>
        <ThemeProvider theme={GlobalTheme}>
          <FontStyles />
          <GlobalStyles />
          <FacebookPixel />
          <LoaderBackdrop show={loader} />
          <div style={{ visibility: "visible" }}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
