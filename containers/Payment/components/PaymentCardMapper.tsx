import { RootState } from "@/redux/store";
import { DataType } from "@/types/coreTypes";
import { NewPayment } from "@lk/ui-library";
import React, { Fragment, useRef, useState } from "react";
// import { useSelector } from 'react-redux';
import { CardTypeENUM, getCardEligibility, getCardTypes } from "./helpers";
// import useCaptcha from './hooks/useCaptcha';
// import usePaymentSubmitActions from './hooks/usePaymentSubmitActions';
// import useProcessOrder from './hooks/useProcessOrder';
import QRCodeHandler from "./QRCodeHandler";
import StoreCreditHandler from "./StoreCreditHandler";

const PaymentCardMapper = ({
  index,
  methodData,
  groupData,
  sessionId,
  savedCards,
  localeData,
  qrCode,
  qrAmount,
  disableAllExceptQr,
  openPaymentHandler,
  selectedKey,
  selectedGroupId,
  selectedSavedCard,
  setSelectedSavedCard,
  getSubmitFunction,
  savedCardsHandler,
  removeStoreCredit,
  captchaValue,
  captchaImageUrl,
  loadCaptcha,
  appliedSc,
  fullScCheckout,
  storeCreditOpen,
  setStoreCreditOpen,
  hideAllExceptSc,
  isRTL,
  isContactLensConsentEnabled,
  payLaterAllowed,
  isContactLensCheckboxChecked,
  setIsContactLensCheckboxChecked,
  setRedirect,
  orderCreatedSuccess,
  setSectedPrimerCreditCard,
  configData,
  abandonedLeadsFunction,
}: any) => {
  switch (methodData.key) {
    case "cod":
      return hideAllExceptSc || disableAllExceptQr ? null : (
        <NewPayment.PaymentCardNew
          isRTL={isRTL}
          key={methodData.key}
          data={{
            img: methodData.logoImageUrl,
            code: methodData.code,
            key: methodData.key,
            head: methodData.label,
            text:
              methodData.key === "nb" &&
              groupData.groupId === selectedGroupId &&
              methodData.key === selectedKey &&
              methodData.banks.length
                ? `${methodData.banks.length}+ supported banks`
                : "",
            onSelect: () => {
              openPaymentHandler(groupData.groupId, methodData.key);
              abandonedLeadsFunction(groupData.groupId);
            },
            isChildrenVisible:
              groupData.groupId === selectedGroupId &&
              methodData.key === selectedKey,
            children: <div>Hello world</div>,
            cardType: getCardTypes(methodData.key, groupData.groupId),
            onSubmit: getSubmitFunction(methodData.key),
            paymentMethod: methodData.code,
            gatewayId: methodData.gatewayId,
            banks: methodData.banks,
            dottedTopBorder: index !== 0,
            dottedBtmBorder:
              index !==
              groupData.methods.filter((m: DataType) =>
                getCardEligibility(m.code)
              ).length -
                1,
            isCaptchaEnabled: !!methodData?.showCaptcha,
            captchaImageUrl: captchaImageUrl,
            captchaValue: captchaValue,
            loadCaptcha: loadCaptcha,
          }}
          cardType={getCardTypes(methodData.key, groupData.groupId)}
          disabled={disableAllExceptQr}
          localeData={localeData}
          aeDesigns
          configData={configData}
        />
      );
    case "qrcode_payu":
      return hideAllExceptSc ? null : (
        <QRCodeHandler
          sessionId={sessionId}
          isOpen={
            groupData.groupId === selectedGroupId &&
            methodData.key === selectedKey
          }
          onSubmit={getSubmitFunction(methodData.key)}
          qrAmount={qrAmount}
          qrCode={qrCode}
          data={{
            img: methodData.logoImageUrl,
            code: methodData.code,
            key: methodData.key,
            head: methodData.label,
            text:
              methodData.key === "nb" &&
              groupData.groupId === selectedGroupId &&
              methodData.key === selectedKey &&
              methodData.banks.length
                ? `${methodData.banks.length}+ supported banks`
                : "",
            onSelect: () => {
              openPaymentHandler(groupData.groupId, methodData.key);
              abandonedLeadsFunction(groupData.groupId);
            },
            isChildrenVisible:
              groupData.groupId === selectedGroupId &&
              methodData.key === selectedKey,
            children: <div>Hello world</div>,
            cardType: getCardTypes(methodData.key, groupData.groupId),
            onSubmit: getSubmitFunction(methodData.key),
            paymentMethod: methodData.code,
            gatewayId: methodData.gatewayId,
            banks: methodData.banks,
            dottedTopBorder: index !== 0,
            dottedBtmBorder:
              index !==
              groupData.methods.filter((m: DataType) =>
                getCardEligibility(m.code)
              ).length -
                1,
          }}
          localeData={localeData}
          cardType={getCardTypes(methodData.key, groupData.groupId)}
          configData={configData}
        />
      );
    case "sc":
      return disableAllExceptQr ? null : (
        <StoreCreditHandler
          data={{
            img: methodData.logoImageUrl,
            code: methodData.code,
            key: methodData.key,
            head: methodData.label,
            text:
              methodData.key === "nb" &&
              groupData.groupId === selectedGroupId &&
              methodData.key === selectedKey &&
              methodData.banks.length
                ? `${methodData.banks.length}+ supported banks`
                : "",
            onSelect: () => {
              setStoreCreditOpen((op) => !op);
              abandonedLeadsFunction(groupData.groupId);
            },
            isChildrenVisible: storeCreditOpen,
            children: <div>Hello world</div>,
            cardType: getCardTypes(methodData.key, groupData.groupId),
            onSubmit: getSubmitFunction(methodData.key),
            paymentMethod: methodData.code,
            gatewayId: methodData.gatewayId,
            banks: methodData.banks,
            dottedTopBorder: index !== 0,
            dottedBtmBorder:
              index !==
              groupData.methods.filter((m: DataType) =>
                getCardEligibility(m.code)
              ).length -
                1,
          }}
          cardType={getCardTypes(methodData.key, groupData.groupId)}
          disabled={disableAllExceptQr}
          isOpen={
            groupData.groupId === selectedGroupId &&
            methodData.key === selectedKey
          }
          onSubmit={getSubmitFunction(methodData.key)}
          onCheckout={fullScCheckout}
          loaderImage={localeData.LOADER_IMAGE_LINK}
          appliedCredits={appliedSc}
          removeStoreCredit={removeStoreCredit}
        />
      );
    case "cc":
      return hideAllExceptSc || disableAllExceptQr ? null : (
        <Fragment>
          <NewPayment.PaymentCardNew
            isRTL={isRTL}
            key={methodData.key}
            data={{
              img: methodData.logoImageUrl,
              code: methodData.code,
              key: methodData.key,
              head: methodData.label,
              text:
                methodData.key === "nb" &&
                groupData.groupId === selectedGroupId &&
                methodData.key === selectedKey &&
                methodData.banks.length
                  ? `${methodData.banks.length}+ supported banks`
                  : "",
              onSelect: () => {
                openPaymentHandler(groupData.groupId, methodData.key, true);
                abandonedLeadsFunction(groupData.groupId);
              },
              isChildrenVisible:
                groupData.groupId === selectedGroupId &&
                methodData.key === selectedKey,
              children: <div>Hello world</div>,
              cardType: getCardTypes(methodData.key, groupData.groupId),
              onSubmit: getSubmitFunction(methodData.key),
              paymentMethod: methodData.code,
              gatewayId: methodData.gatewayId,
              banks: methodData.banks,
              dottedTopBorder: index !== 0,
              dottedBtmBorder:
                index !==
                  groupData.methods.filter((m: DataType) =>
                    getCardEligibility(m.code)
                  ).length -
                    1 || savedCards?.length,
              isContactLensCheckboxChecked: isContactLensCheckboxChecked,
              setIsContactLensCheckboxChecked: setIsContactLensCheckboxChecked,
            }}
            cardType={getCardTypes(methodData.key, groupData.groupId)}
            disabled={disableAllExceptQr}
            localeData={localeData}
            setSectedPrimerCreditCard={setSectedPrimerCreditCard}
            configData={configData}
          />{" "}
          {/** savedCards, CardTypeENUM.SAVED_CARD, savedCardsHandler, setSelectedSavedCard, selectedSavedCard */}
          {savedCards?.map((s: DataType, k: number) => (
            <NewPayment.PaymentCardNew
              isRTL={isRTL}
              key={s.cardToken}
              data={{
                ...s,
                onSelect: () => {
                  openPaymentHandler(groupData.groupId, "");
                  setSelectedSavedCard(s.cardToken);
                  abandonedLeadsFunction(groupData.groupId);
                },
                img: `https://static.lenskart.com/media/desktop/img/BinSeries/${s.cardBrand.toLowerCase()}.png`,
                isChildrenVisible:
                  disableAllExceptQr || hideAllExceptSc
                    ? false
                    : groupData.groupId === selectedGroupId &&
                      !(methodData.key === selectedKey) &&
                      s.cardToken === selectedSavedCard,
                head: s.number,
                text: "",
                onSubmit: (cvv: string, cardToken: string) =>
                  savedCardsHandler(cvv, cardToken),
                dottedTopBorder: true,
                dottedBtmBorder: k !== savedCards.length - 1,
              }}
              cardType={CardTypeENUM.SAVED_CARD}
              disabled={disableAllExceptQr}
              localeData={localeData}
              configData={configData}
            />
          ))}
        </Fragment>
      );
    // case "gv":
    //     return null;
    default:
      return hideAllExceptSc || disableAllExceptQr ? null : (
        <NewPayment.PaymentCardNew
          isRTL={isRTL}
          key={methodData.key}
          data={{
            img: methodData.logoImageUrl,
            code: methodData.code,
            key: methodData.key,
            head: methodData.label,
            text:
              methodData.key === "nb" &&
              groupData.groupId === selectedGroupId &&
              methodData.key === selectedKey &&
              methodData.banks.length
                ? `${methodData.banks.length}+ supported banks`
                : "",
            onSelect: (willRenderPrimerUI?: boolean) => {
              openPaymentHandler(
                groupData.groupId,
                methodData.key,
                willRenderPrimerUI
              );
              abandonedLeadsFunction(groupData.groupId);
            },
            isChildrenVisible:
              groupData.groupId === selectedGroupId &&
              methodData.key === selectedKey,
            children: <div>Hello world</div>,
            cardType: getCardTypes(methodData.key, groupData.groupId),
            onSubmit: getSubmitFunction(methodData.key),
            paymentMethod: methodData.code,
            gatewayId: methodData.gatewayId,
            banks: methodData.banks,
            isContactLensConsentEnabled: isContactLensConsentEnabled,
            dottedTopBorder: index !== 0,
            dottedBtmBorder:
              index !==
              groupData.methods.filter((m: DataType) =>
                getCardEligibility(m.code)
              ).length -
                1,
            offers: methodData?.offers || [],
            offerText: methodData?.offerText,
            payLaterAllowed: payLaterAllowed || null,
          }}
          cardType={getCardTypes(methodData.key, groupData.groupId)}
          disabled={disableAllExceptQr}
          localeData={localeData}
          isContactLensCheckboxChecked={isContactLensCheckboxChecked}
          setIsContactLensCheckboxChecked={setIsContactLensCheckboxChecked}
          setRedirect={setRedirect}
          orderCreatedSuccess={orderCreatedSuccess}
          setSectedPrimerCreditCard={setSectedPrimerCreditCard}
          configData={configData}
        />
      );
  }
};

export default PaymentCardMapper;
