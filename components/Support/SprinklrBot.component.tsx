import React, { useEffect, useRef } from "react";
import { ChatBotBackground } from "@lk/ui-library";
import { DataType } from "@/types/coreTypes";
import { initSprinklrChatBot, updateChatBotParams } from "helpers/chatbot";
import { DeviceTypes } from "@/types/baseTypes";

const SprinklrBot = ({
  localeData,
  email,
  mobile,
  order,
  configData,
  userInfo,
  sessionId,
  countryCode,
  deviceType,
}: {
  localeData: DataType;
  email: string | string[];
  mobile: string | string[];
  order: string;
  configData: DataType;
  userInfo: any;
  sessionId: string;
  countryCode: string;
  deviceType: string;
}) => {
  const timeLimit =
    (configData?.SPRINKLR_BOT_CONFIG &&
      JSON.parse(configData.SPRINKLR_BOT_CONFIG).timeOut) ||
    5000;
  const sprinklrEnabled_msite = JSON.parse(
    configData?.SPRINKLR_BOT_CONFIG
  )?.msite_enabled;
  let chatBotParams: any;
  let showBotWidgetTimer = useRef<number>();

  function showBot() {
    const botElems = document.querySelectorAll("#sprinklr-bot-hide-custom");
    botElems.forEach((elem) => {
      document.body.removeChild(elem);
    });
  }

  function loadSprinklrBot(chatBotParams: any) {
    if (chatBotParams.phoneNumber) {
      if (chatBotParams?.orderNo) {
        window &&
          window.sprChat &&
          window.sprChat("openNewConversation", {
            conversationContext: {
              _c_6216101a55e837709d0a6190: [chatBotParams?.orderNo], // order ID from each need help button
              _c_62a1a4e3d7c1ad35cd4ae0d8: ["TRUE"], // triggeredByOrderButton
            },
            initialMessages: [{ message: "Need Help", isSentByUser: true }],
            id: chatBotParams?.orderNo, // MANDATORY, order ID from each need help button
            //  autoInitiateConversation: true
          });
      } else {
        window &&
          window.sprChat &&
          window.sprChat("openNewConversation", {
            conversationContext: {
              "_c_62a329b623cadb2fbf33b21f ": [chatBotParams.phoneNumber], // unique ID from contact us/chat with us, maybe phone number
              _c_62a32a2c23cadb2fbf33f020: ["TRUE"], // triggeredByChatwithUs
            },
            id: chatBotParams.phoneNumber, // MANDATORY, maybe phone number
          });
      }
    } else {
      if (typeof window !== "undefined") {
        window?.sprChat && window?.sprChat("open", {});
      }
    }
  }

  useEffect(() => {
    chatBotParams =
      typeof window !== "undefined" && window.chatBotParams
        ? window.chatBotParams
        : {};
    if (chatBotParams) {
      chatBotParams.firstName =
        (userInfo?.userDetails && userInfo?.userDetails?.firstName) || "";
      chatBotParams.lastName =
        (userInfo?.userDetails && userInfo?.userDetails?.lastName) || "";
      chatBotParams.phoneNumber = mobile || userInfo?.mobileNumber || "";
      chatBotParams.email = email || userInfo?.email || "";
      chatBotParams.orderNo = order || "";
      chatBotParams.sessionID = sessionId || "";
      chatBotParams.env = ["preprod"].includes(
        process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase() as string
      )
        ? "preprod"
        : "prod";
      chatBotParams.apiClient = process.env.NEXT_PUBLIC_APP_CLIENT;
      chatBotParams.uniqueId = "";
      chatBotParams.countryCode = countryCode || "";
    }
    if (sprinklrEnabled_msite === "ON") {
      if (chatBotParams.phoneNumber !== "") {
        // * phone number present in url / or user logged in
        if (window.sprChat) {
          // * sprinklr script loaded - msite
          updateChatBotParams(
            chatBotParams,
            deviceType || DeviceTypes.MOBILE,
            configData
          );
        } else {
          //* sprinklr script not loaded, load with params - webview
          initSprinklrChatBot(chatBotParams, true, true, configData);
        }
      } else {
        // * no phone number, initiate chat bot
        // ! not required
        // initSprinklrChatBot(chatBotParams, true, false, configData);
      }
    }
    showBot();
    if (!showBotWidgetTimer.current) {
      showBotWidgetTimer.current = window.setTimeout(() => {
        loadSprinklrBot(chatBotParams);

        return () => {
          window.clearTimeout(showBotWidgetTimer.current);
        };
      }, timeLimit);
    }
  }, [userInfo, chatBotParams, showBotWidgetTimer]);

  return (
    <div>
      <ChatBotBackground localeData={localeData} loader={false} />
    </div>
  );
};

export default SprinklrBot;
