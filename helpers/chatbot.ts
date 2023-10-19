import { DataType } from "@/types/coreTypes";
import CryptoJs from "crypto-js";

interface userInfoTypes {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  orderNo?: string | number;
  configData?: DataType;
  platform?: string;
  sessionID?: string;
  env?: string;
  apiClient?: string;
  uniqueId?: string;
}

export function generateHash(userInfo: userInfoTypes, configData: DataType) {
  if (userInfo && Object.keys(userInfo).length === 0) return "";
  const { firstName, lastName, email, phoneNumber } = userInfo || {};
  var key =
    (configData && configData.SPRINKLR_HASH_KEY) ||
    "e3647512-219c-46ab-8f2b-3a1068a15c14"; // default india
  var userDetails = `${phoneNumber || ""}_${firstName || ""}_${
    lastName || ""
  }__${phoneNumber || ""}_${email || ""}`;
  var hash = CryptoJs.HmacSHA256(userDetails, key).toString(CryptoJs.enc.Hex);
  return hash;
}

export function updateChatBotParams(
  userInfo: userInfoTypes,
  platform: string,
  configData: DataType
) {
  const {
    firstName,
    lastName,
    email,
    countryCode,
    orderNo = "",
    phoneNumber,
  } = userInfo || {};
  window &&
    window.sprChat &&
    window.sprChat("updateUserSettings", {
      user: {
        id: phoneNumber || "", //mandatory
        firstName: firstName || "", //optional, can send empty
        lastName: lastName || "", //optional, can send empty
        profileImageUrl: "", //optional, can send empty
        phoneNo: phoneNumber || "", //optional
        email: email || "", //optional
        hash: generateHash(userInfo, configData || {}), //mandatory → you need to generate your own
      },
      userContext: {
        _c_628fa2a6e10d7d26ffae932e: orderNo || "", // order_no
        _c_628fa2e3e10d7d26ffae99c9: "", // unique_id
        _c_628fa30ee10d7d26ffae9d66: "", // action
        _c_629059cde7872557aeec559f: "", // customer_id
        _c_628fa33ae10d7d26ffaea0b0:
          process.env.BUILD_ENV === "development" ? "preprod" : "prod", // env
        _c_628fa36be10d7d26ffaea88b: "", // username
        _c_628fa39ae10d7d26ffaead3d: "", // External_Conversation_ID
        _c_628fa3c5e10d7d26ffaeb1a3: "", // External_Customer_ID
        _c_628fa3f7e10d7d26ffaeb7a9: "", // auth_id
        _c_628fa430e10d7d26ffaebb90: "", // pincode
        _c_628fa46ae10d7d26ffaec0e6: "", // auth_code
        _c_5cc9a7d0e4b01904c8dfc965: "", // language
        _c_62a1a40fd7c1ad35cd4a6323: platform || "", // device
        _c_628fa497e10d7d26ffaec4c9: countryCode || "", // country
      },
    });
}
export const logoutSprinklrBot = () => {
  return window && window?.sprChat && window.sprChat("updateUserSettings", {});
};
export function initSprinklrChatBot(
  userInfo: userInfoTypes,
  device: boolean,
  loginStatus: boolean,
  configData: DataType
) {
  const {
    firstName,
    lastName,
    email,
    orderNo,
    countryCode,
    platform,
    phoneNumber,
  } = userInfo;
  window.sprChatSettings = window.sprChatSettings || {};
  window.sprChatSettings = {
    appId:
      process.env.NEXT_PUBLIC_SPRINKLR_ID ||
      "626fcf8563ac4521314470a6_app_600019149",
    skin: "MODERN",
    landingScreen: "LAST_CONVERSATION",
    ...(device && { device: "MOBILE" }),
    ...(loginStatus && {
      user: {
        id: phoneNumber || "", //mandatory - can send phone number
        firstName: firstName || "", //optional, can send empty
        lastName: lastName || "", //optional, can send empty
        profileImageUrl: "", //optional, can send empty
        phoneNo: phoneNumber || "", //optional
        email: email || "", //optional
        hash: generateHash(userInfo, configData), //mandatory - you need to generate your own
      },
    }),
    ...(loginStatus && {
      userContext: {
        _c_628fa2a6e10d7d26ffae932e: orderNo || "", // order_no
        _c_628fa2e3e10d7d26ffae99c9: "", // unique_id
        _c_628fa30ee10d7d26ffae9d66: "", // action
        _c_629059cde7872557aeec559f: "", // customer_id
        _c_628fa33ae10d7d26ffaea0b0: ["preprod"].includes(
          process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase?.() as string
        )
          ? "preprod"
          : "prod", // env
        // "_c_628fa33ae10d7d26ffaea0b0": "", // env
        _c_628fa36be10d7d26ffaea88b: "", // username
        _c_628fa39ae10d7d26ffaead3d: "", // External_Conversation_ID
        _c_628fa3c5e10d7d26ffaeb1a3: "", // External_Customer_ID
        _c_628fa3f7e10d7d26ffaeb7a9: "", // auth_id
        _c_628fa430e10d7d26ffaebb90: "", // pincode
        _c_628fa46ae10d7d26ffaec0e6: "", // auth_code
        _c_5cc9a7d0e4b01904c8dfc965: "", // language
        _c_62a1a40fd7c1ad35cd4a6323: platform || "", // device
        _c_628fa497e10d7d26ffaec4c9: countryCode || "", // country
        // "_c_628fa497e10d7d26ffaec4c9": ""  // country
      },
    }),
  };
  (function () {
    var t = window,
      e = t.sprChat,
      a = e && !!e.loaded,
      n = document,
      r = function () {
        r.m(arguments);
      };
    (r.q = []),
      (r.m = function (t) {
        r.q.push(t);
      }),
      (t.sprChat = a ? e : r);
    var o = function () {
      var e = n.createElement("script");
      (e.type = "text/javascript"),
        (e.async = !0),
        (e.src =
          "https://prod4-live-chat.sprinklr.com/api/livechat/handshake/widget/" +
          t.sprChatSettings.appId),
        (e.onerror = function () {
          t.sprChat.loaded = !1;
        }),
        (e.onload = function () {
          t.sprChat.loaded = !0;
        });
      var a = n.getElementsByTagName("script")[0];
      a.parentNode.insertBefore(e, a);
    };
    "function" == typeof e
      ? a
        ? e("update", t.sprChatSettings)
        : o()
      : "loading" !== n.readyState
      ? o()
      : n.addEventListener("DOMContentLoaded", o);
  })();
}
