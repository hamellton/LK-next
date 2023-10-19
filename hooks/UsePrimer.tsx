import {
  configureCardFormType,
  onCheckoutCompleteType,
  onCheckoutFailType,
  PrimerPaymentMethodType,
  showPaymentMethodsUIType,
} from "@/types/hooks/usePrimer.types";
import { appendScriptToDOM } from "containers/Base/helper";
import { debounce } from "helpers/utils";
import { useCallback } from "react";

export default function usePrimer() {
  const cardHolderInputId = "checkout-card-holder-input";
  const cardNumberInputId = "checkout-card-number-input";
  const cardExpiryInputId = "checkout-card-expiry-input";
  const cardCvvInputId = "checkout-card-cvv-input";
  const buttonId = "submit-button";
  const validateButtonId = "validate-button-primer";
  const primer3dsWrapperId = "primer-checkout-scene-3ds";

  function addPrimerScript(
    primerVersion: string,
    isRetry: boolean | null,
    orderId: string | null,
    getClientToken: (orderId?: string) => void
  ) {
    if (primerVersion) {
      appendScriptToDOM(
        `https://sdk.primer.io/web/v${primerVersion}/Primer.min.js`,
        "",
        true,
        () => {
          // this.setState({ isLoadingState: false });
          // Juno API call to get client token from primer
          if (isRetry && orderId) getClientToken(orderId);
          else getClientToken();
        }
      );
    }
  }

  const initPrimer = async ({
    token,
    onBeforePaymentCreate,
    onAvailablePaymentMethodsLoad,
    onCheckoutComplete,
    onCheckoutFail,
  }: {
    token: string;
    onBeforePaymentCreate: (data: any, handler: any) => void;
    onAvailablePaymentMethodsLoad: (
      paymentMethods: PrimerPaymentMethodType[]
    ) => void;
    onCheckoutComplete: (param: onCheckoutCompleteType) => void;
    onCheckoutFail: (param: onCheckoutFailType) => void;
  }) => {
    const { Primer } = window || {};
    const headless = await Primer.createHeadless(token);

    // Configure headless
    headless.configure({
      card: {
        cardholderName: { required: false },
        cardNumber: { required: true },
        expiryDate: { required: true },
        cvv: { required: true },
      },
      onBeforePaymentCreate(data: any, handler: any) {
        if (onBeforePaymentCreate) onBeforePaymentCreate(data, handler);
        return handler.continuePaymentCreation();
      },
      onAvailablePaymentMethodsLoad(paymentMethods: PrimerPaymentMethodType[]) {
        if (onAvailablePaymentMethodsLoad)
          onAvailablePaymentMethodsLoad(paymentMethods);
      },
      onCheckoutComplete(param: onCheckoutCompleteType) {
        // Notifies you that a payment was created
        // Move on to next step in your checkout flow:
        // e.g. Show a success message, giving access to the service, fulfilling the order, ...
        if (onCheckoutComplete) onCheckoutComplete(param);
      },
      onCheckoutFail(param: onCheckoutFailType) {
        // Notifies you that the checkout flow has failed and a payment could not be created
        // This callback can also be used to display an error state within your own UI.
        if (onCheckoutFail) onCheckoutFail(param);
      },
    });
    return headless;
  };

  const createCardFormUI = useCallback(() => {
    const container = document.getElementById("my-container");
    // const container = document.createElement('div');

    // const cardHolderInputId = 'checkout-card-holder-input';
    const cardHolderInputEl = document.getElementById(cardHolderInputId);
    // const cardHolderInputEl = document.createElement('input');
    // cardHolderInputEl.setAttribute('id', cardHolderInputId);
    // cardHolderInputEl.setAttribute('placeholder', 'Cardholder Name');

    // Create containers for your hosted inputs
    // const cardNumberInputId = 'checkout-card-number-input';
    const cardNumberInputEl = document.getElementById(cardNumberInputId);
    // const cardNumberInputEl = document.createElement('div');
    // cardNumberInputEl.setAttribute('id', cardNumberInputId);

    // const cardExpiryInputId = 'checkout-card-expiry-input';
    const cardExpiryInputEl = document.getElementById(cardExpiryInputId);
    // const cardExpiryInputEl = document.createElement('div');
    // cardExpiryInputEl.setAttribute('id', cardExpiryInputId);

    // const cardCvvInputId = 'checkout-card-cvv-input';
    const cardCvvInputEl = document.getElementById(cardCvvInputId);
    // const cardCvvInputEl = document.createElement('div');
    // cardCvvInputEl.setAttribute('id', cardCvvInputId);

    // submitButton = document.createElement('input');
    const submitButton = document.getElementById(buttonId);
    // submitButton.setAttribute('type', 'button');
    // submitButton.setAttribute('id', buttonId);
    // submitButton.value = 'Submit';
    // Add them to your container
    if (container)
      container.append(
        cardNumberInputEl as HTMLElement,
        cardExpiryInputEl as HTMLElement,
        cardCvvInputEl as HTMLElement,
        cardHolderInputEl as HTMLElement,
        submitButton as HTMLElement
      );
  }, []);

  const showPaymentMethodsUI = useCallback((params: any) => {
    const { methodToShow } = params || {};
    // `type` is a unique ID representing the payment method
    switch (
      methodToShow // key
    ) {
      case "PAYMENT_CARD": {
        // Configure your card form (see Step 4.a)
        createCardFormUI();
        configureCardForm(params);
        break;
      }
      case "NATIVE": {
        configureNativeButton(params);
        break;
      }
      case "REDIRECT":
      default: {
        configureRedirectPaymentMethod({ ...params, type: methodToShow });
        break;
      }
      // More payment methods to follow
    }
  }, []);

  const configureCardForm = useCallback(async (params: any) => {
    const { headless, orderPayment, primerToken, device, orderId, consent } =
      params || {};
    // Create the payment method manager
    const cardManager = await headless?.createPaymentMethodManager(
      "PAYMENT_CARD"
    );
    // Create the hosted inputs
    const { cardNumberInput, expiryInput, cvvInput } =
      cardManager.createHostedInputs();
    await Promise.all([
      cardNumberInput.render(cardNumberInputId, {
        placeholder: "Card Number",
        ariaLabel: "Card number",
      }),
      expiryInput.render(cardExpiryInputId, {
        placeholder: "MM/YY",
        ariaLabel: "Expiry date",
      }),
      cvvInput.render(cardCvvInputId, {
        placeholder: "123",
        ariaLabel: "CVV",
      }),
    ]);

    function validationError(args: any, type: any) {
      switch (type) {
        case "cardNumber": {
          let cardNumberRequiredField =
            document.getElementById("cardNumberRequired");
          if (cardNumberRequiredField)
            cardNumberRequiredField.innerText = args.error;
          break;
        }
        case "expiry": {
          let expiryRequiredField = document.getElementById("expiryRequired");
          if (expiryRequiredField) expiryRequiredField.innerText = args.error;
          break;
        }
        case "cvv": {
          let cvvRequiredField = document.getElementById("cvvRequired");
          if (cvvRequiredField) cvvRequiredField.innerText = args.error;
          break;
        }
      }
    }
    function validationCardName(val = "") {
      let isValid = true;
      let cardnameRequiredField = document.getElementById("cardnameRequired");
      if (cardnameRequiredField && val.trim().length === 0) {
        cardnameRequiredField.innerText = "Card Name is Required";
        isValid = false;
      } else if (cardnameRequiredField && val.trim().length > 0) {
        if (/[^a-zA-Z\ \/]/.test(val.trim())) {
          cardnameRequiredField.innerText = "Card Name is Invalid";
          isValid = false;
        } else {
          cardnameRequiredField.innerText = "";
          isValid = true;
        }
      }
      return isValid;
    }

    // Set the cardholder name if it changes
    (
      document.getElementById(cardHolderInputId) as HTMLElement
    ).addEventListener("input", (e: any) => {
      cardManager.setCardholderName(e.target.value);
      validationCardName(e.target.value);
    });
    validationCardName("");
    // Configure event listeners for supported events
    cardNumberInput.addEventListener("change", (args: any) =>
      validationError(args, "cardNumber")
    );
    expiryInput.addEventListener("change", (args: any) =>
      validationError(args, "expiry")
    );
    cvvInput.addEventListener("change", (args: any) =>
      validationError(args, "cvv")
    );

    // cardNumberInput.addEventListener('change', args => {
    //   console.log('CardNumber onchange : ', args)
    // });
    // expiryInput.addEventListener('change', args => {
    //   console.log('Expiry onchange : ', args)
    // });
    // cvvInput.addEventListener('change', args => {
    //   console.log('CVV onchange : ', args)
    // });

    cardNumberInput.focus();

    const validateButton = document.getElementById(validateButtonId);
    // validate button event listener callback
    async function validateButtonCallback() {
      // Validate your card input data
      const { valid, validationErrors } = await cardManager.validate();
      // console.log("validateButton: ", { valid, validationErrors });
      const cardNameInputEle: any = document.getElementById(cardHolderInputId);
      if (
        valid &&
        Boolean(cardNameInputEle) &&
        validationCardName(cardNameInputEle?.value)
      ) {
        // JUNO order creation call
        let reqData: any = {
          device: device,
          paymentInfo: {
            primerClientSessionToken: primerToken,
            gatewayId: "PRIMER",
            paymentMethod: "primer",
            saveCard: false,
          },
        };
        if (orderId) reqData.orderId = orderId;
        if (consent) reqData.consent = consent;
        if (orderPayment && primerToken) orderPayment(reqData);
      }
    }
    if (Boolean(validateButton)) {
      (validateButton as HTMLElement).removeEventListener(
        "click",
        validateButtonCallback
      );
      (validateButton as HTMLElement).addEventListener(
        "click",
        validateButtonCallback
      );
    }

    const submitButton = document.getElementById(buttonId);

    // submit button callback to give payment start request to primer
    async function submitButtonCallback() {
      // Validate your card input data
      const { valid, validationErrors } = await cardManager.validate();
      // console.log("submitButton: ", { valid, validationErrors });
      if (valid) {
        // Submit the card input data to Primer for tokenization
        await cardManager.submit();

        // To make 3ds screen on top
        setTimeout(() => {
          let countSec = 0;
          var interval = setInterval(MoveToTop3ds, 1000); // 1000 ms = start after 1sec
          function MoveToTop3ds() {
            countSec++;
            if (document.getElementById(primer3dsWrapperId)) {
              (
                document.getElementById(primer3dsWrapperId) as HTMLElement
              ).style.zIndex = "99999999999999";
              clearInterval(interval);
            }
            if (countSec === 10) {
              clearInterval(interval);
            }
          }
        }, 2000);
      }
    }
    if (Boolean(submitButton)) {
      (submitButton as HTMLElement).removeEventListener(
        "click",
        submitButtonCallback
      );
      (submitButton as HTMLElement).addEventListener(
        "click",
        submitButtonCallback
      );
    }
  }, []);

  // Handle redirect payment methods (see Step 4.c)
  // configureRedirectPaymentMethod(paymentMethod);
  async function configureRedirectPaymentMethod(params: any) {
    const {
      type,
      headless,
      orderPayment,
      primerToken,
      device,
      orderId,
      consent,
    } = params || {};
    const manager = await headless?.createPaymentMethodManager(type);
    // const submitButton = document.createElement('input');
    // const buttonId = 'submit-button';
    // const submitButton = document.getElementById(buttonId);
    // submitButton.setAttribute('type', 'button');
    // submitButton.setAttribute('id', buttonId);
    // submitButton.value = 'Submit Rdirect';

    const validateButton: any = document.getElementById(
      validateButtonId + "-" + type
    );

    // validate button event listener callback
    function validateButtonCallback() {
      // JUNO order creation call
      let reqData: any = {
        device: device,
        paymentInfo: {
          primerClientSessionToken: primerToken,
          gatewayId: "PRIMER",
          paymentMethod: "primer",
          saveCard: false,
        },
      };
      if (orderId) reqData.orderId = orderId;
      if (consent) reqData.consent = consent;
      if (orderPayment && primerToken) orderPayment(reqData);
    }

    if (
      Boolean(validateButton) &&
      validateButton.getAttribute("listener") !== "true"
    ) {
      validateButton.removeEventListener("click", validateButtonCallback);
      validateButton.addEventListener("click", validateButtonCallback);
      validateButton.setAttribute("listener", "true");
    }

    const submitButton: any = document.getElementById(buttonId + "-" + type);

    // submit button callback to give payment start request to primer
    async function submitButtonCallback() {
      await manager.start();
    }

    if (
      Boolean(submitButton) &&
      submitButton.getAttribute("listener") !== "true"
    ) {
      submitButton.removeEventListener("click", submitButtonCallback);
      submitButton.addEventListener("click", submitButtonCallback);
      submitButton.setAttribute("listener", "true");
    }
  }

  // Render the native payment method button (see Step 4.b)
  // Relevant for PayPal, Apple Pay and Google Pay
  async function configureNativeButton(params: any) {
    const { headless } = params || {};
    const paymentMethodManager = await headless?.createPaymentMethodManager(
      "PAYPAL"
    ); // or APPLE_PAY / GOOGLE_PAY
    const payPalButton = document.createElement("div");
    const payPalButtonId = "paypal-button";
    payPalButton.setAttribute("type", "button");
    payPalButton.setAttribute("id", payPalButtonId);

    // Create the payment method manager
    const button = paymentMethodManager.createButton();
    // Render the button
    button.render(payPalButtonId, {
      buttonColor: "silver",
    });
  }

  return {
    addPrimerScript,
    initPrimer,
    showPaymentMethodsUI,
  };
}
