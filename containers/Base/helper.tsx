import { getCookie } from "@/helpers/defaultHeaders";
import { DeviceTypes } from "@/types/baseTypes";

export const appendScriptToDOM = (
  scriptSrc: string,
  id: string,
  isAsync: any,
  callback: () => void
) => {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = scriptSrc;
  if (id) {
    script.id = id;
  }
  if (isAsync) {
    script.async = true;
  }
  if (callback) {
    //@ts-ignore
    if (script.readyState) {
      //@ts-ignore
      script.onreadystatechange = () => {
        if (
          //@ts-ignore
          script.readyState === "loaded" ||
          //@ts-ignore
          script.readyState === "complete"
        ) {
          //@ts-ignore
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = () => {
        callback();
      };
    }
  }
  document.head.appendChild(script);
};

export const reDirection = (subdirectoryPath: string, home?: boolean) => {
  window.location.href = `${subdirectoryPath}/compare-looks`;
  const page = window.location.pathname.split("/");
  subdirectoryPath ? page.splice(0, 2) : page.splice(0, 1);
  if (page.includes("search")) {
    const query = window.location.search.split("&");
    if (query?.length == 2 && query[1]?.includes("search")) {
      localStorage.setItem(
        "dittoCompare",
        page.join("/") + window.location.search || ""
      );
    } else if (query?.length == 3 && query[2]?.includes("similarProductId")) {
      localStorage.setItem(
        "dittoCompare",
        page.join("/") + window.location.search || ""
      );
    } else
      localStorage.setItem("dittoCompare", page.join("/") + query[0] || "");
  } else if (!home) localStorage.setItem("dittoCompare", page.join("/") || "");
  else localStorage.setItem("dittoCompare", "/ditto/eyeglasses.html");
};

export const getCmsLinks = (country: string, pageName: string) => {
  if (pageName === "TERMS_AND_CONDITIONS") {
    switch (country) {
      case "in":
        return "/terms-conditions";
        break;
      case "sa":
        return "/sa_terms_conditions/";
        break;
      case "us":
        return "/us_terms_conditions/";
        break;
      default:
        return "/terms-conditions";
        break;
    }
  } else if (pageName === "PRIVACY_POLICY") {
    switch (country) {
      case "in":
        return "/privacy-policy";
        break;
      case "sa":
        return "/sa_privacy_policy/";
        break;
      case "us":
        return "/us_privacy_policy/";
        break;
      case "ae":
        return "/ae_privacy_policy/";
      case "sg":
        return "/sg-privacy-policy/";
      default:
        return "/privacy-policy";
        break;
    }
  }
};

export function getLocationApiErrorMessage(error: any) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Error! Location access has earlier been denied, kindly enable it from the browser setting to access the auto detect location.";
    case error.POSITION_UNAVAILABLE:
      return "Error! Please enable your location services or enter your address or pin-code in search bar.";
    case error.TIMEOUT:
      return "Error! The request to get user location timed out.";
    case error.UNKNOWN_ERROR:
      return "Error! An unknown error occurred.";
    default:
      return "Could not determine your location, please try again";
  }
}

export const hideSprinklrBot = (deviceType: string) => {
  if (
    deviceType === DeviceTypes.MOBILE &&
    typeof window !== undefined &&
    window?.sprChat &&
    window.location.pathname?.indexOf("/support") === -1
  ) {
    const botElem = document.createElement("style");
    botElem.setAttribute("id", "sprinklr-bot-hide-custom");
    botElem.innerHTML = "#spr-live-chat-app{display:none}";
    document.body.appendChild(botElem);
  }
};

interface UtmSource {
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
}

export function getUserEventData(eventName: string) {
  const utmSourceJSON = localStorage.getItem("utmSource");
  const utmSource: UtmSource = utmSourceJSON ? JSON.parse(utmSourceJSON) : {};

  const whatsAppOptInId = localStorage.getItem("whatsAppOptInId");
  const gaClientId = getCookie("_ga");
  const data = {
    event: eventName,
    gaClientId: gaClientId || "",
    whatsappOptInId: whatsAppOptInId || "",
    details: {
      utm: {
        utm_campaign: utmSource?.utm_campaign || "(direct)",
        utm_medium: utmSource?.utm_medium || "(none)",
        utm_source: utmSource?.utm_source || "null",
      },
    },
  };
  return data;
}
