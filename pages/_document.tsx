import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import Document, { DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { DeviceTypes } from "@/types/baseTypes";
import newrelic from "newrelic";
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      const browserTimingHeader = newrelic.getBrowserTimingHeader({
        hasToRemoveScriptWrapper: true,
      });
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
        browserTimingHeader,
      };
    } finally {
      sheet.seal();
    }
  }
  render(): JSX.Element {
    const dir = process.env.NEXT_PUBLIC_DIRECTION
      ? process.env.NEXT_PUBLIC_DIRECTION.toLowerCase()
      : "ltr";

    const desktopChat =
      process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase() === DeviceTypes.DESKTOP;
    const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_ID;
    const isDesktop =
      process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase() === DeviceTypes.DESKTOP;

    const lang = `${process.env.NEXT_PUBLIC_APP_LANG?.toLowerCase()}-${process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase()}`;

    let isProduction;
    if (process.env.NEXT_PUBLIC_APP_ENV) {
      isProduction = ["prod", "production"].includes(
        process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase?.() as string
      );
    }

    return (
      // <Html dir={lang === "ar" ? "rtl" : "ltr"}>
      <Html dir={dir} lang={lang}>
        <Head>
          {!isProduction && <meta content="noindex,nofollow" name="robots" />}
          {/* <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN"></meta> */}
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `window.postpayAsyncInit = function() {
              postpay.init({
                merchantId: 'id_a09b6ac5a0e44d26bae0b1f4e4954383',
                sandbox: ${["preprod"].includes(
                  process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase?.() as string
                )},
                theme: 'light',
                locale: 'en'
              })
            }`,
            }}
            type="text/javascript"
          />
          <script
            type="text/javascript"
            id="newrelic-script-loader"
            // @ts-ignore
            dangerouslySetInnerHTML={{ __html: this.props.browserTimingHeader }}
          />
          {/* <script
            async
            defer
            src="https://bsdk.api.ditto.com/default/5.1.0/en-in/api.js"
            type="text/javascript"
          /> */}
          {/* <Script
            id="new-arch-dimension"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'arch_type' : 'new_arch'
              });
              `,
            }}
          /> */}
          <Script
            id="google-tag-manager"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js', 'arch_type' : 'new-arch'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window, document, 'Script', 'dataLayer', '${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        </Head>
        <body>
          <noscript>
            <iframe
              height={0}
              id="google-tag-id"
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              style={{ display: "none", visibility: "hidden" }}
              title="GTM noscript"
              width={0}
            />
          </noscript>
          <noscript>
            <img
              alt="img"
              height="1"
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_ID}&ev=PageView&noscript=1`}
              style={{ display: "none" }}
              width="1"
            />
          </noscript>
          <Script
            id="google-analytics"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(e,t,a,n,c,o,s){e.GoogleAnalyticsObject=c,e[c]=e[c]||function(){(e[c].q=e[c].q||[]).push(arguments)},e[c].l=1*new Date,o=t.createElement(a),s=t.getElementsByTagName(a)[0],o.async=1,o.src=n,s.parentNode.insertBefore(o,s)}(window,document,"script","https://www.google-analytics.com/analytics.js","ga"),ga("create","UA-130468609-1","auto")</script><script src="//www.google-analytics.com/analytics.js"></script><script type="text/javascript">function gaTrackEvent(e,t,n){_gaq.push(["_trackEvent",e,t,n])}function crumbleCookie(e){for(var t=document.cookie.split(";"),n={},i=0;i<t.length;i++){var u=t[i].substring(0,t[i].indexOf("=")).trim(),a=t[i].substring(t[i].indexOf("=")+1,t[i].length).trim();n[u]=a}return e?n[e]?n[e]:null:n}function gaCookies(){var e=function(){var e;if(!crumbleCookie("__utma"))return null;e=crumbleCookie("__utma").split(".");var t=e[0],n=e[1],i=e[2],u=e[3],a=e[4],r=e[5];return{cookie:e,domainhash:t,uniqueid:n,ftime:i,ltime:u,stime:a,sessions:r}},t=function(){var e;if(!crumbleCookie("__utmb"))return null;e=crumbleCookie("__utmb").split(".");var t=e[1];return{cookie:e,gifrequest:t}},n=function(){var e;if(!crumbleCookie("__utmv"))return null;e=crumbleCookie("__utmv").split(".");var t=e[1];return{cookie:e,value:t}},i=function(){var e,t,n,i,u,a,r;if(!crumbleCookie("__utmz"))return null;e=crumbleCookie("__utmz").split(".");for(var s=e[4].split("|"),o=0;o<s.length;o++){var c=s[o].substring(0,s[o].indexOf("=")),m=decodeURIComponent(s[o].substring(s[o].indexOf("=")+1,s[o].length));switch(m=m.replace(/^\(|\)$/g,""),c){case"utmcsr":t=m;break;case"utmcmd":n=m;break;case"utmccn":i=m;break;case"utmctr":u=m;break;case"utmcct":a=m;break;case"utmgclid":r=m}}return{cookie:e,source:t,medium:n,name:i,term:u,content:a,gclid:r}};this.getDomainHash=function(){return e()&&e().domainhash?e().domainhash:null},this.getUniqueId=function(){return e()&&e().uniqueid?e().uniqueid:null},this.getInitialVisitTime=function(){return e()&&e().ftime?e().ftime:null},this.getPreviousVisitTime=function(){return e()&&e().ltime?e().ltime:null},this.getCurrentVisitTime=function(){return e()&&e().stime?e().stime:null},this.getSessionCounter=function(){return e()&&e().sessions?e().sessions:null},this.getGifRequests=function(){return t()&&t().gifrequest?t().gifrequest:null},this.getUserDefinedValue=function(){return n()&&n().value?decodeURIComponent(n().value):null},this.getCampaignSource=function(){return i()&&i().source?i().source:null},this.getCampaignMedium=function(){return i()&&i().medium?i().medium:null},this.getCampaignName=function(){return i()&&i().name?i().name:null},this.getCampaignTerm=function(){return i()&&i().term?i().term:null},this.getCampaignContent=function(){return i()&&i().content?i().content:null},this.getGclid=function(){return i()&&i().gclid?i().gclid:null}}var _gaq=_gaq||[],gac=new gaCookies;_gaq.push(["_setAccount","UA-130468609-1"],["_setAllowLinker",!0]),_gaq.push(["_setDomainName","lenskart.com"]),_gaq.push(["ninja._setAccount","UA-130468609-1"],["ninja._setAllowLinker",!0]),_gaq.push(["ninja._setDomainName","lenskart.com"]),_gaq.push(["_initData"]),_gaq.push(function(){var e=_gat._getTrackerByName();UniqueId=gac.getUniqueId(),e._setCustomVar(1,"Visitor",UniqueId,1);var t=_gat._getTrackerByName("ninja");t._setCustomVar(1,"Visitor",UniqueId,1);var n=gac.getSessionCounter(),i=gac.getCampaignSource(),u=gac.getCampaignMedium(),a=gac.getCampaignTerm(),r=gac.getCampaignName(),s=gac.getCampaignContent(),o=gac.getGclid();null!=o&&(i="google",u="cpc"),1==n&&(e._setCustomVar(2,"FT",i+"|"+u+"|"+a+"|"+r+"|"+s,1),t._setCustomVar(2,"FT",i+"|"+u+"|"+a+"|"+r+"|"+s,1))}),_gaq.push(["_setSiteSpeedSampleRate",100],["ninja._setSiteSpeedSampleRate",100]),_gaq.push(["_trackPageview"],["ninja._trackPageview"]),function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src=("https:"==document.location.protocol?"https://":"http://")+"stats.g.doubleclick.net/dc.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}()`,
            }}
          />
          <div id="modal-portal" />
          <Main />
          <NextScript />
          {/* {desktopChat && ( */}
          {(process.env.NEXT_PUBLIC_APP_COUNTRY === "IN" ||
            process.env.NEXT_PUBLIC_APP_COUNTRY === "SG") && (
            <>
              <script
                async
                dangerouslySetInnerHTML={{
                  __html: `
                  window.sprChatSettings = window.sprChatSettings || {};
                  window.sprChatSettings = {
                  "appId": "${process.env.NEXT_PUBLIC_SPRINKLR_ID}",
                  "skin": "MODERN",
                  "landingScreen": "LAST_CONVERSATION",
                  "user": {
                    "id": "",
                    "firstName": "",
                    "lastName": "",
                    "profileImageUrl": "",
                    "phoneNo": "",
                    "email": "",
                    "hash": ""
                  },
                "userContext": {
                  "_c_628fa2a6e10d7d26ffae932e": "",
                  "_c_628fa2e3e10d7d26ffae99c9": "",
                  "_c_628fa30ee10d7d26ffae9d66": "",
                  "_c_629059cde7872557aeec559f": "",
                  "_c_628fa33ae10d7d26ffaea0b0": "${process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase()}",
                  "_c_628fa36be10d7d26ffaea88b": "",
                  "_c_628fa39ae10d7d26ffaead3d": "",
                  "_c_628fa3c5e10d7d26ffaeb1a3": "",
                  "_c_628fa3f7e10d7d26ffaeb7a9": "",
                  "_c_628fa430e10d7d26ffaebb90": "",
                  "_c_628fa46ae10d7d26ffaec0e6": "",
                  "_c_5cc9a7d0e4b01904c8dfc965": "",
                  "_c_62a1a40fd7c1ad35cd4a6323": "",
                  "_c_628fa497e10d7d26ffaec4c9": ""
                }
              }
              window.chatBotParams = {
                orderNo: '',
                emailId: '',
                phoneNumber: '',
                action: '',
                uniqueId: '',
                sessionID: '',
                env: '',
                apiClient: ''
            }
            `,
                }}
              ></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `(function(){var t=window,e=t.sprChat,a=e&&!!e.loaded,n=document,r=function(){r.m(arguments)};r.q=[],r.m=function(t){r.q.push(t)},t.sprChat=a?e:r;var o=function(){var e=n.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://prod4-live-chat.sprinklr.com/api/livechat/handshake/widget/"+t.sprChatSettings.appId,e.onerror=function(){t.sprChat.loaded=!1},e.onload=function(){t.sprChat.loaded=!0};var a=n.getElementsByTagName("script")[0];a.parentNode.insertBefore(e,a)};"function"==typeof e?a?e("update",t.sprChatSettings):o():"loading"!==n.readyState?o():n.addEventListener("DOMContentLoaded",o)})()`,
                }}
              ></script>
            </>
          )}
          {/* )} */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
