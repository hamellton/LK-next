export const returnConfig = {
  returnExchange: "ON",
  returnDetails: "ON",
  enableNewFlow: true,
  enableCancelApiFlow: true,
  negativeStatuses: ["cancelled"],
  showSubStatus: true,
  showItemMoreActions: true,
  returnSelection: {
    viewPolicyText: "View Policy",
    viewPolicyLink: "https://www.lenskart.com/cancellation.html",
    infoBanner: {
      title: "Process of Exchange/Refund",
      data: [
        {
          img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
          label: "Raise request for Exchange/Refund",
        },
        {
          img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
          label: "Get option to choose type of exchange right away",
        },
        {
          img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
          label:
            "Or opt for Refund once Lenskart receives product as per policy",
        },
      ],
    },
    itemReturnState: {
      data_refundable_exchangeable: {
        title: "Return or Exchange your product",
        subText: "Until %date",
        returnCTA: "Return/Exchange",
        innerBoxTitle: "",
        innerBoxSubText: "",
      },
      data_nonrefundable_exchangeable: {
        title: "Exchange your product",
        subText: "Until %date",
        returnCTA: "Exchange Now",
        innerBoxTitle: "Refund not allowed",
        innerBoxSubText:
          "Refund cannot be taken for this product as per our policy",
      },
      data_refundable_nonexchangeable: {
        title: "Return your product",
        subText: "Until %date",
        returnCTA: "Return Now",
        innerBoxTitle: "Exchange not allowed",
        innerBoxSubText: "This product cannot be exchanged as per our policy",
      },
      data_nonrefundable_nonexchangeable: {
        title: "",
        subText: "",
        returnCTA: "",
        innerBoxTitleDateExpired: "Return window closed on %date",
        innerBoxTitle: "Return not allowed",
        innerBoxSubText:
          "Return is not allowed for this product as per our return policy",
      },
      data_returned_refundable_exchangeable: {
        title: "Take Refund or Exchange your product",
        subText: "Until %date",
        returnCTA: "Refund/Exchange",
        innerBoxTitle: "",
        innerBoxSubText: "",
      },
      data_returned_nonrefundable_exchangeable: {
        title: "Exchange your product",
        subText: "Until %date",
        returnCTA: "Exchange Now",
        innerBoxTitle: "Refund not allowed",
        innerBoxSubText:
          "Refund cannot be taken for this product as per our policy",
      },
      data_returned_refundable_nonexchangeable: {
        title: "Take Refund for your product",
        subText: "Until %date",
        returnCTA: "Take Refund Now",
        innerBoxTitle: "Exchange not allowed",
        innerBoxSubText: "This product cannot be exchanged as per our policy",
      },
      data_returned_nonrefundable_nonexchangeable: {
        title: "",
        subText: "",
        returnCTA: "",
        innerBoxTitleDateExpired: "Return window closed on %date",
        innerBoxTitle: "Refund/Exchange not allowed",
        innerBoxSubText:
          "Refund/Exchange is not allowed for this product as per our return policy",
      },
    },
  },
  headerTimeline: {
    data: [
      {
        label: "Initiate",
        showBar: "yes",
      },
      {
        label: "Return",
        showBar: "yes",
      },
      {
        label: "Exchange/Refund",
      },
    ],
  },
  refundHeaderTimeline: {
    data: [
      {
        label: "Initiate",
        showBar: "yes",
      },
      {
        label: "Return",
        showBar: "yes",
      },
      {
        label: "Refund",
      },
    ],
  },
  exchangeHeaderTimeline: {
    data: [
      {
        label: "Initiate",
        showBar: "yes",
      },
      {
        label: "Return",
        showBar: "yes",
      },
      {
        label: "Exchange",
      },
    ],
  },
  returnMethodsPlaceholder:
    "https://static.lenskart.com/media/mobile/universal/images/returnExchange/ReturnMethods.png",
  chooseModeOfReturn: {
    store_return: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Store.svg",
      title: "Visit a Nearby Store",
      badge: "MOST POPULAR",
      subText: {
        type: "disc",
        contents: [
          "<span class='text-color_grey_black fw700'>46%</span> customers visit store for instant resolution",
          "You can get your glasses <span class='text-color_grey_black fw700'>adjusted or exchanged</span> with a new one",
          "If you wish to return, you can get <span class='text-color_grey_black fw700'>immediate refund</span>",
          "Nearest store a few km away",
        ],
      },
      error: {
        status: true,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "Due to COVID 19 all stores are temporarily closed.",
      },
    },
    schedule_pickup: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/SchedulePickup.svg",
      title: "Schedule a Pickup",
      badge: "",
      subText: {
        type: "disc",
        contents: [
          "Your product will be picked up by our team in 2-3 days",
          "Refund/Exchange would be processed in 5-7 days",
        ],
      },
      error: {
        status: true,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "Pickup not available at your location. Select a new address to get this option",
      },
    },
    warehouse_return: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
      title: "Ship product to Lenskart",
      badge: "",
      subText: {
        type: "none",
        contents: ["Send your product to us"],
      },
      error: {
        status: true,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "This option is not available right now",
      },
    },
  },
  confirmReturn: {
    store_return: {
      text: "Via Nearby Store",
      ctaText: "CONFIRM DETAILS",
    },
    schedule_pickup: {
      text: "Pickup from Your Address",
      ctaText: "CONFIRM DETAILS",
    },
    warehouse_return: {
      text: "Ship Product to Lenskart",
      ctaText: "CONFIRM DETAILS",
      warehouseAddress:
        "Lenskart Warehouse, Sector 74A, Gurugram, Haryana - 122004",
    },
  },
  returnSuccess: {
    store_return: {
      msg: "Store Visit Scheduled",
      desc: [
        "Please visit the store to get glasses adjusted or if required exchange them or take a refund as per policy",
      ],
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Take your product with all its accessories to the selected store",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Store.svg",
            label:
              "Lenskart store will inspect the product. You can get your glasses adjusted",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "If required, you may exchange the product or get refund as per our Return policy",
          },
        ],
      },
    },
    schedule_pickup: {
      msg: "Pickup Scheduled from Your Address",
      desc: [],
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done within 48 hours.",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label:
              "Or Refund will be processed once Lenskart receives the product",
          },
        ],
        data_refundable_exchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done as soon as possible within 48 hours.",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "You can choose a product for exchange now or opt for refund",
          },
        ],
        data_nonrefundable_nonexchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done as soon as possible within 48 hours.",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "When the product is received by Lenskart, you will receive a communication from us to choose Exchange or Refund",
          },
          {
            img: "http://static.lenskart.com/media/mobile/universal/images/returnExchange/mail-support.png",
            label:
              "Once you submit your choice, we will process the Exchange or Refund immediately",
          },
        ],
        data_refundable_nonexchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label: "Select Refund method as per your convenience now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done as soon as possible within 48 hours.",
          },
        ],
        data_nonrefundable_exchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done as soon as possible within 48 hours.",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label: "Or refund can be taken once Lenskart receives product",
          },
        ],
      },
    },
    warehouse_return: {
      msg: "Ship to Warehouse Selected",
      desc: [],
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEl & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label:
              "Or Refund will be processed once Lenskart receives the product",
          },
        ],
        data_refundable_exchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEL & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label:
              "You can choose a product for exchange now or opt for refund",
          },
        ],
        data_nonrefundable_nonexchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEL & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "Exchange / Refund can be taken as per policy once Lenskart receives product",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/mail-support.png",
            label:
              "To get help on this contact our customer care by sending an email at support@lenskart.com",
          },
        ],
        data_refundable_nonexchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEL & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label: "You can opt for refund now",
          },
        ],
        data_nonrefundable_exchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEL & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label: "Or refund can be taken once Lenskart receives product",
          },
        ],
      },
    },
    Old_Return: {
      infoBanner: {
        title: "Next Steps",
        data_refundable_exchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/CrossOrange.svg",
            label:
              "Your product couldn't be delivered to you by the courier partner",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label: "OR take a refund of your product",
          },
        ],
        data_nonrefundable_nonexchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "This product is not eligible for exchange or refund online as it was not accepted at the time of delivery",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/mail-support.png",
            label:
              "To get help on this contact our customer care by sending an email at support@lenskart.com",
          },
        ],
        data_refundable_nonexchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/CrossOrange.svg",
            label:
              "Your product couldn't be delivered to you by the courier partner",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label: "You can take a refund of your product.",
          },
        ],
        data_nonrefundable_exchangeable: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/CrossOrange.svg",
            label:
              "Your product couldn't be delivered to you by the courier partner",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
        ],
      },
    },
  },
  returnLabel: {
    info: [
      {
        text: "The shipping label has 2 parts. One is to be kept inside the box with your product being returned. The other has to be stuck to the outside of the box so that the product is shipped correctly to Lenskart.",
      },
      {
        text: "We will also email you the same shipping labels.",
      },
    ],
    buttonText: "SHARE OR DOWNLOAD LABEL",
    sampleImg:
      "https://static.lenskart.com/media/mobile/universal/images/returnExchange/returnlabel.jpg",
    downloadLink: "https://s3.ap-southeast-1.amazonaws.com/fus-lenskart-docs",
  },
  returnNextSteps: {
    new_reverse_pickup: {
      nextStatus: "Courier Pickup Pending",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done within 48 hours.",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label:
              "Or Refund will be processed once Lenskart receives the product",
          },
        ],
      },
    },
    reference_id_issued: {
      nextStatus: "Courier Pickup Done",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done within 48 hours.",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label:
              "Or Refund will be processed once Lenskart receives the product",
          },
        ],
      },
    },
    awb_assigned: {
      nextStatus: "Product Received by Lenskart",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
            label:
              "Or Refund will be processed once Lenskart receives the product",
          },
        ],
      },
    },
    return_received: {
      nextStatus: "Exchange or Refund",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "You can choose a product for exchange now or get refund as per policy",
          },
        ],
      },
    },
    return_under_followup: {
      nextStatus: "Finished",
    },
    return_followed_up: {
      nextStatus: "Finished",
    },
    return_pending_approval: {
      nextStatus: "Refund Done",
    },
    initiated_reverse: {
      nextStatus: "Product Sent Back to Customer",
    },
    return_reship: {
      nextStatus: "Finished",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "We have shipped the product back to you and you should receive it within 3-5 days.",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "This product is not eligible for exchange or refund online as it was not accepted at the time of delivery",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/mail-support.png",
            label:
              "To get help on this contact our customer care by sending an email at support@lenskart.com",
          },
        ],
      },
    },
    easy_refund_given_pickup_cancelled: {
      nextStatus: "Finished",
    },
    partial_easy_refund_given_pickup_cancelled: {
      nextStatus: "Finished",
    },
    return_expected_wh: {
      nextStatus: "Product Received by Lenskart",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEL & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Print.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label: "You can choose a product for exchange now",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "Or Refund will be processed once Lenskart receives the product",
          },
        ],
      },
    },
    return_expected_pos: {
      nextStatus: "Product Received by Lenskart",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Take your product with all its accessories to the selected store",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Print.svg",
            label:
              "Lenskart store will inspect the product. You can get your glasses adjusted",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "If required, you may exchange the product or get refund as per our Return policy",
          },
        ],
      },
    },
    return_need_approval: {
      nextStatus: "Exchange/Refund Request Approved",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "You can choose a product for exchange now or get refund after your request is reviewed",
          },
        ],
      },
    },
    return_accepted: {
      nextStatus: "Exchange or Refund",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "You can choose a product for exchange now or get refund as per policy",
          },
        ],
      },
    },
    return_rejected_handover_pending: {
      nextStatus: "Product Handed Back to Customer",
    },
    return_rejected_handover_done: {
      nextStatus: "Finished",
    },
    refund_pending: {
      nextStatus: "Refund Done",
    },
    refund_cancelled: {
      nextStatus: "Finished",
    },
    awaiting_neft_info: {
      nextStatus: "Refund Complete",
    },
    imps_unknown: {
      nextStatus: "Finished",
    },
    refund_pending_pg: {
      nextStatus: "Refund Done",
    },
  },
  returnCancelled: {
    msg: "Your Exchange/Refund request was closed",
    desc: ["You can raise a request again if needed"],
  },
  returnCall: {
    mainText:
      "To initiate refund/exchange, call our Customer care at 99998-99998 between 9 AM to 8 PM on any day",
    customerCareNumber: "9999899998",
  },
  exchangeCall: {
    mainText:
      "To get help with this, call our Customer care at 99998-99998 between 9 AM to 8 PM on any day",
    customerCareNumber: "9999899998",
  },
  refundCall: {
    mainText:
      "To get help with this, call our Customer care at 99998-99998 between 9 AM to 8 PM on any day",
    customerCareNumber: "9999899998",
  },
  cancelCall: {
    mainText:
      "To cancel this request, call our Customer care at 99998-99998 between 9 AM to 8 PM on any day",
    customerCareNumber: "9999899998",
  },
  storeDirectionIcon:
    "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Direction.svg",
  choosePostReturnMode: {
    exchange: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Exchange_Old.svg",
      title: "Exchange Your Product",
      badge: "MOST POPULAR",
      subText: {
        type: "disc",
        contents: [
          "Your exchange order will be shipped to you once the original product is (pickedupStatus)",
          "Choose against the same or a different product",
          "Your new product is a few steps away",
        ],
      },
      error: {
        status: false,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "<div>Exchange not available as per policy. For any queries <a href='https://www.lenskart.com/cms-exchange-program'><span class='inline-block text-topaz fw500'>View Policy</span></a></div>",
      },
    },
    refund: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund.svg",
      title: "Get a Refund",
      badge: "",
      subText: {
        type: "disc",
        contents: [
          "Refund would be processed within 5-7 days after the product is (pickedupStatus)",
        ],
      },
      error: {
        status: false,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "<div>This product is not eligible for refund at this time as per our return policy. For more details <a href='https://www.lenskart.com/cms-exchange-program'><span class='inline-block text-topaz fw500'>View Policy</span></a></div>",
      },
    },
  },
  chooseExchangeMode: {
    power: {
      SAMEPRODUCT: {
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Exchange_Old_SPSL.svg",
        alt: "Same Frame Style and Same Type of Lens",
        error: {
          status: false,
          src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
          text: "This product is not in stock right now",
        },
      },
      CHANGELENS: {
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Exchange_Old_SPDL.svg",
        alt: "Same Frame Style and Different Type of Lens",
        error: {
          status: false,
          src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
          text: "This option is not available right now",
        },
      },
      NEWPRODUCT: {
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Exchange_New_Product.svg",
        alt: "Different Frame Style with Same or Different Type of Lens",
        error: {
          status: false,
          src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
          text: "This option is not available right now",
        },
      },
    },
    nonpower: {
      SAMEPRODUCT: {
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Exchange_Old_SPSL.svg",
        alt: "Same Frame Style & Same Type of Lens",
        error: {
          status: false,
          src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
          text: "This product is not in stock right now",
        },
      },
      CHANGELENS: {
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange//Exchange_Old_SPDL.svg",
        alt: "Same Frame Style & Different Type of Lens ",
        error: {
          status: false,
          src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
          text: "This option is not available right now",
        },
      },
      NEWPRODUCT: {
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Exchange_New_Product.svg",
        alt: "Different Frame Style with Same or Different Type of Lens",
        error: {
          status: false,
          src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
          text: "This option is not available right now",
        },
      },
    },
  },
  chooseRefundMode: {
    storecredit: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund_StoreCredit.svg",
      title: "Store Credit",
      badge: "FASTEST METHOD",
      order: 1,
      subText: {
        type: "disc",
        contents: [
          "Instant credit in Lenskart wallet",
          "Use against any product",
          "Use Online and in Stores",
          "Lifetime Validity",
        ],
      },
      error: {
        status: false,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "Not eligible on this order as per policy, For any queries <a href='https://www.lenskart.com/cms-exchange-program'><span class='inline-block text-topaz fw500'>View Policy</span></a></div>",
      },
    },
    cashfree: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund_BankTransfer.svg",
      title: "Transfer to Bank/Wallets",
      badge: "",
      order: 4,
      subText: {
        type: "none",
        contents: ["You will get refund within 2 business days"],
      },
      error: {
        status: false,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "<div>Not eligible on this order as per policy, For any queries <a href='https://www.lenskart.com/cms-exchange-program'><span class='inline-block text-topaz fw500'>View Policy</span></a></div>",
      },
    },
    neft: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund_BankTransfer.svg",
      title: "Transfer to Bank",
      order: 2,
      badge: "",
      subText: {
        type: "none",
        contents: ["You will get refund within 2 business days"],
      },
      error: {
        status: false,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "<div>Not eligible on this order as per policy, For any queries <a href='https://www.lenskart.com/cms-exchange-program'><span class='inline-block text-topaz fw500'>View Policy</span></a></div>",
      },
    },
    source: {
      src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Refund_Source.svg",
      title: "Refund to Source",
      order: 3,
      badge: "",
      subText: {
        type: "none",
        contents: ["You will get refund back to the source payment method"],
      },
      error: {
        status: false,
        src: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Warning.svg",
        text: "<div>Not eligible on this order as per policy, For any queries <a href='https://www.lenskart.com/cms-exchange-program'><span class='inline-block text-topaz fw500'>View Policy</span></a></div>",
      },
    },
  },
  confirmRefund: {
    storecredit: {
      text: "Store Credit",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Money.svg",
            label: "You will get Store Credit code on confirmation",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Print.svg",
            label: "Use it to purchase any product Online or from our Stores",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Validity.svg",
            label: "Lifetime Validity, never expires",
          },
        ],
      },
    },
    cashfree: {
      text: "Transfer to Bank/Wallets",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Redirect.svg",
            label: "We will redirect you to our refund page",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Form.svg",
            label: "Enter your bank/wallet details to get the refund",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Money.svg",
            label: "Refund will be processed within 2 working days",
          },
        ],
      },
    },
    neft: {
      text: "Transfer to Bank",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Redirect.svg",
            label: "We will redirect you to our refund page",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Form.svg",
            label: "Enter your bank details to get the refund",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Money.svg",
            label: "Refund will be processed within 2 working days",
          },
        ],
      },
    },
    source: {
      text: "Refund To Source",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Validity.svg",
            label:
              "Lenskart will process refund to your original source of payment after confirmation",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Money.svg",
            label: "Get refund latest within 7-10 working days",
          },
        ],
      },
    },
    customer_wallet: {
      text: "Refund to LKCash+/ LKCash wallet",
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Wallet_Refund.svg",
            label: "Your used LKCash / LKCash+ will be refunded to your wallet",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Future_Orders.svg",
            label: "You can use it for your future orders",
          },
        ],
      },
    },
  },
  refundProcessed: {
    storecredit: {
      creditTitle: "Store Credit Amount",
      msg: "Refund Completed",
      desc: [
        "Your refund has been successfully done via Store Credit.",
        "You can instantly redeem these against any purchase.",
      ],
      additionalInfo: {
        label: "Store Credit Code",
        desc: [
          "Apply Store Credit at payment step during your next purchase.",
          "We will also be sending this code to you via E-mail and SMS.",
        ],
        link: {
          text: "How to use Store Credit",
          url: "https://www.lenskart.com/how-to-use-your-store-credit",
        },
      },
      pending: {
        msg: "Refund Pending",
        desc: [
          "Once you enter your refund details successfully, refund will be done within 3-5 working days",
        ],
      },
      newRefund: {
        msg: "Refund Details Received",
        desc: [],
      },
      failure: {
        msg: "Refund Failed",
        desc: ["Your refund couldn't be processed. Please try again."],
      },
    },
    cashfree: {
      creditTitle: "Bank Transfer Amount",
      msg: "Refund Completed",
      desc: ["Your refund has been successfully done via Bank Transfer."],
      pending: {
        msg: "Refund Pending",
        desc: [
          "Click on the button below to enter your refund details.",
          "Once the refund details are entered successfully, the refund will be done within 2 days.",
        ],
      },
      newRefund: {
        msg: "",
        desc: [],
      },
      failure: {
        msg: "Refund Failed",
        desc: ["Your refund couldn't be processed. Please try again."],
      },
    },
    neft: {
      creditTitle: "Bank Transfer Amount",
      msg: "Refund Completed",
      desc: ["Your refund has been successfully done via Bank Transfer."],
      pending: {
        msg: "Refund Initiated",
        desc: ["You will get refund within 2 working days"],
      },
      newRefund: {
        msg: "Refund Details Received",
        desc: [],
      },
      failure: {
        msg: "Refund Failed",
        desc: ["Your refund couldn't be processed. Please try again."],
      },
    },
    source: {
      creditTitle: "Refund To Source Amount",
      msg: "Refund Completed",
      desc: [
        "Your refund has been processed by Lenskart. It will be credited in your original source of payment latest within 5-7 working days.",
      ],
      pending: {
        msg: "Refund Pending",
        desc: [
          "Your refund has been initiated successfully. It will be credited in your original source of payment latest within 7-10 working days.",
        ],
      },
      newRefund: {
        msg: "Refund Details Received",
        desc: [],
      },
      failure: {
        msg: "Refund Failed",
        desc: ["Your refund couldn't be processed. Please try again."],
      },
    },
    multipleRefund: {
      creditTitle: "Amount Refunded",
      msg: "Refund Completed",
      desc: [
        "A total of ₹<refundedAmount> has been refunded for this item. If refund has been taken to bank or source, it will be credited latest within 7-10 working days",
      ],
      additionalInfo: {
        label: "Store Credit Code",
        desc: [
          "Apply Store Credit at payment step during your next purchase.",
          "We will also be sending this code to you via E-mail and SMS.",
        ],
        link: {
          text: "How to use Store Credit",
          url: "https://www.lenskart.com/how-to-use-your-store-credit",
        },
      },
      pending: {
        msg: "Refund Pending",
        desc: [
          "A total of ₹<refundedAmount> has been refunded for this item. If refund has been taken to bank or source, it will be credited latest within 7-10 working days",
        ],
      },
      newRefund: {
        msg: "Refund Details Received",
        desc: [],
      },
      failure: {
        msg: "Refund Failed",
        desc: ["Your refund couldn't be processed. Please try again."],
      },
    },
    customer_wallet: {
      creditTitle: "LKCash Amount",
      msg: "Refund Completed",
      desc: [
        "LKCash/ LKCash+ has been successfully credited back to your account. You can instantly redeem it against any future purchase.",
      ],
      newRefund: {
        msg: "Refund Details Received",
        desc: ["LKCash/ LKCash+ will be credited back to your account"],
      },
      failure: {
        msg: "Refund Failed",
        desc: ["Your refund couldn't be processed. Please try again."],
      },
    },
  },
  exchangeSuccess: {
    SAMEPRODUCT: {
      msg: "Exchange Order Created",
      desc: [],
      info: "Please find your exchange information below",
      powerRequiredInfo:
        "Please fill your power details to complete the exchange process",
    },
    CHANGELENS: {
      msg: "Exchange Order Created",
      desc: [],
      info: "Please find your exchange information below",
      powerRequiredInfo:
        "Please fill your power details to complete the exchange process",
    },
    NEWPRODUCT: {
      msg: "Exchange Order Created",
      desc: [],
      info: "Please find your exchange information below",
      powerRequiredInfo:
        "Please fill your power details to complete the exchange process",
    },
  },
  exchangeInfo: {
    msg: "Exchange Order Created",
    desc: [],
    info: "",
  },
  exchangeInitiated: {
    store_return: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Take your product with all its accessories to the selected store",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Store.svg",
            label:
              "Your exchanged product will be dispatched once the product is received and inspected by Lenskart",
          },
        ],
      },
    },
    schedule_pickup: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done within 48 hours",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "Your exchanged product will be dispatched once the product is received and inspected by Lenskart",
          },
        ],
      },
    },
    warehouse_return: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEl & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Exchange.svg",
            label:
              "Your exchanged product will be dispatched once the product is received and inspected by Lenskart",
          },
        ],
      },
    },
  },
  refundInitiated: {
    store_return: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Take your product with all its accessories to the selected store",
          },
        ],
      },
    },
    schedule_pickup: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done within 48 hours",
          },
        ],
      },
    },
    warehouse_return: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEl & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
        ],
      },
    },
  },
  newRefundInitiated: {
    store_return: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Take your product with all its accessories to the selected store",
          },
        ],
      },
    },
    schedule_pickup: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Keep the products with all accessories ready for pickup. Pickup will be done within 48 hours",
          },
        ],
      },
    },
    warehouse_return: {
      infoBanner: {
        title: "Next Steps",
        data: [
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Pack.svg",
            label:
              "Pack the products and stick the return label on the box. We will email you the label too",
            buttonText: "VIEW RETURN LABEl & INSTRUCTIONS",
            buttonHandler: "redirectToReturnLabel",
          },
          {
            img: "https://static.lenskart.com/media/mobile/universal/images/returnExchange/Steps_Ship.svg",
            label:
              "Ship the product to Lenskart at the given address. (We will reimburse you upto Rs100 once the product is received)",
          },
        ],
      },
    },
  },
  schedulePickupMessage:
    "Due to COVID-19, our courier services have been disrupted. We will try to get the pickup done as soon as possible",
  exchangeCatalog: {
    eyeglasses: {
      economy: [
        "Fallon Colby",
        "Vincent Chase VC",
        "Mask",
        "Parim",
        "Superman",
        "Lenses Only",
        "Lenskart TOI Special",
        "Vincent Chase Online",
        "John Jacobs JJ",
        "Chhota Bheem",
        "John Jacobs Online",
        "OJOS",
        "OJOS21",
      ],
      classic: [
        "Vincent Chase",
        "Vincent Chase Polarized",
        "Lenskart",
        "Baoliya",
        "Lenskart I Factor",
        "Lenskart Gelaishi",
        "Lenskart Titanium",
        "Lenskart Air Online",
        "Lenskart Air",
        "Lenskart Air LA",
        "Eye Player",
        "Vincent Chase Kids",
        "Club Master",
        "Vincent Chase Computer Glasses",
        "ICE CUBE",
        "Vincent Chase TI",
        "Lenskart Kids",
        "Lenskart Safety Goggles",
        "Vincent Chase Kids Computer Glasses",
        "Matt Eyewear",
        "Solid",
        "Red",
        "Bolt",
        "Hammer",
        "Vincent Chase CE",
        "Vintage",
        "Vincent Chase Premium",
        "Lenskart Junior",
        "ThinOptics",
        "Reading Eyeglasses",
        "Lenskart Air Computer Glasses",
        "LENSKART BLU",
        "Lenskart Blu",
        "Lenskart Junior Computer Glasses",
        "Vincent Chase Kids Online",
        "Lenskart READERS",
        "Junior",
        "Vincent Chase Essentials",
        "Vincent Chase Kids CE",
      ],
      premium: [
        "John Jacobs",
        "Ray-Ban",
        "Ray Ban",
        "Oakley",
        "Vogue",
        "Carrera",
        "John Jacobs Staff Pick",
        "John Jacobs Computer Glasses",
        "John Jacobs TI",
        "Kid Zania",
        "Yoohee Computer Glasses",
        "Kidzania Computer Glasses",
        "Yoohee",
        "Boss Orange",
        "Marc by Marc Jacobs",
        "Fastrack",
        "Lee Cooper",
        "Lewis Hamilton",
        "Polaroid",
        "Calvin Klein",
        "Tommy Hilfiger",
        "Linda Farrow",
        "Prada",
        "Emporio Armani",
        "Fossil",
        "Tom Ford",
        "Sunpocket",
        "Reanson",
        "Carrera Kids",
        "Hugo Boss",
        "French Connection",
        "Feillis",
        "Velocity",
        "Tom and Jerry",
        "Colour Perfection",
        "Mont Blanc",
        "Farenheit",
        "Marc Jacobs",
        "Hugo",
        "Vision Player",
        "Tommy Sports",
        "Polo Sports",
        "Jialedi",
        "Fiezai",
        "Titan",
        "Tag Style",
        "MTV",
        "Bloom",
        "Proof",
        "Polo Style",
        "Cartier",
        "Silhouette",
        "Porsche Style",
        "Tough",
        "Gucci",
        "Mercedes Benz",
        "Police",
        "Sprint Polarized",
        "Constantine France",
        "Fond",
        "Fibran",
        "Wet Da",
        "Lancer",
        "A To Z",
        "Solano",
        "Braveheart",
        "Bodart",
        "Galina",
        "Heiser",
        "Corin",
        "Aopidi",
        "Silk Lens",
        "Beverly Hills",
        "Speedo",
        "Caterpillar",
        "Fommy Bahama",
        "Mindi",
        "Zijinghua",
        "Givo",
        "Esprit",
        "N-Star",
        "T-39",
        "Marco Ricci",
        "Red Cherry",
        "Posh",
        "Puma",
        "Oliver",
        "Barbie",
        "Austin Reed",
        "Hotwheels",
        "CAT",
        "Tommy Fashion",
        "Polo Fashion",
        "Junlu Prince",
        "Hidesign",
        "Test",
        "Odysey",
        "Woodpecker",
        "Binli Wood",
        "Senorita",
        "Pitt & Mitt",
        "Corola",
        "Nidun Optima",
        "Numero Uno",
        "Dolver",
        "Joseph Abboud",
        "Hummer",
        "Titum",
        "Feelgood",
        "Cute",
        "Chrome",
        "Benson",
        "Kool Blue",
        "Jerry Maguire",
        "Biotrue",
        "Elegance",
        "United Colors of Benetton",
        "Roberto",
        "Chris Cross",
        "Idears",
        "LVKE",
        "LUKE",
        "Madison",
        "YTM",
        "Celebration",
        "Glamour",
        "Vivid",
        "Vinage",
        "Termintor-II",
        "Marc & Jack",
        "Pinellii",
        "Siddhi",
        "Vision & Fashion",
        "Red Wolf",
        "Black Wolf",
        "Fabia",
        "Bultaco",
        "Arnette",
        "Killer Loop",
        "Maui Jim",
        "Sentral",
        "Panache",
        "Paradox",
        "Animal",
        "Mayhem",
        "Flying Machine",
        "Down Town",
        "Da Vinci",
        "Aryca",
        "Vision Pro",
        "Cambridgeshire",
        "Mara Boss",
        "OTO",
        "Gunnar",
        "Louis Philippe",
        "Allen Solly",
        "Van Heusen",
        "Trends",
        "Accu Reader",
        "Longines",
        "Bench",
        "Bench Kids",
        "Carousel",
        "Henleys",
        "Playboy",
        "Top Secret",
        "Hello Kitty",
        "Doraemon",
        "Celine Dion",
        "Boinkers",
        "Synergy",
        "Varg",
        "1-2-C",
        "Killer",
        "Nick",
        "Mikli",
        "Kagawa",
        "S Oliver",
        "Hackett",
        "Igear",
        "Dakota Smith",
        "Suunto",
        "Hang Ten",
        "Tifosi",
        "IDEE",
        "I Zarra",
        "Shuitaojin",
        "Kamnomoc",
        "Turtle",
        "Dolkar",
        "Mexican Readers",
        "Ready",
        "Red Gear",
        "Zesprt",
        "Meima",
        "OXYDO",
        "E",
        "Youngstun",
        "Feike Sports",
        "Soul 9",
        "Invogue",
        "Retain",
        "Tommy Style",
        "ART",
        "Ashton",
        "Ifconj",
        "Sport",
        "Cyprus",
        "TBYB",
        "Rivanchy",
        "Polar Man",
        "Accessories",
        "HUVITZ",
        "Cholamandalam",
        "Tag Heuer",
        "Hydrasoft",
        "Chloe",
        "Larke",
        "Atoz",
        "All Clean",
        "British Optics",
        "Porsche Design",
        "Swarovski",
        "Nike",
        "Oakley Youth",
      ],
    },
    sunglasses: {
      classic: [
        "Fallon Colby",
        "Vincent Chase VC",
        "Mask",
        "Parim",
        "Superman",
        "Vincent Chase",
        "Vincent Chase Polarized",
        "Fallon Colby",
        "Lenses Only",
        "Lenskart TOI Special",
        "Vincent Chase Online",
        "John Jacobs JJ",
        "Chhota Bheem",
        "John Jacobs Online",
        "Lenskart",
        "Baoliya",
        "Lenskart I Factor",
        "Lenskart Gelaishi",
        "Lenskart Titanium",
        "Lenskart Air Online",
        "Lenskart Air",
        "Eye Player",
        "Vincent Chase Kids",
        "Club Master",
        "ICE CUBE",
        "Vincent Chase TI",
        "Lenskart Kids",
        "Lenskart Safety Goggles",
        "Matt Eyewear",
        "Solid",
        "Red",
        "Bolt",
        "Hammer",
        "Vintage",
        "Vincent Chase Premium",
        "Lenskart Junior",
      ],
      premium: [
        "Ray-Ban",
        "Ray Ban",
        "Oakley",
        "Vogue",
        "Carrera",
        "Sentral",
        "OTO",
        "John Jacobs",
        "John Jacobs Staff Pick",
        "John Jacobs Computer Glasses",
        "John Jacobs TI",
        "Kid Zania",
        "Yoohee Computer Glasses",
        "Kidzania Computer Glasses",
        "Yoohee",
        "Boss Orange",
        "Marc by Marc Jacobs",
        "Fastrack",
        "Lee Cooper",
        "Lewis Hamilton",
        "Polaroid",
        "Calvin Klein",
        "Tommy Hilfiger",
        "Linda Farrow",
        "Prada",
        "Emporio Armani",
        "Fossil",
        "Tom Ford",
        "Sunpocket",
        "Reanson",
        "Carrera Kids",
        "Hugo Boss",
        "French Connection",
        "Feillis",
        "Velocity",
        "Tom and Jerry",
        "Colour Perfection",
        "Mont Blanc",
        "Farenheit",
        "Marc Jacobs",
        "Hugo",
        "Vision Player",
        "Tommy Sports",
        "Polo Sports",
        "Jialedi",
        "Fiezai",
        "Titan",
        "Tag Style",
        "MTV",
        "Bloom",
        "Proof",
        "Polo Style",
        "Cartier",
        "Silhouette",
        "Porsche Style",
        "Tough",
        "Gucci",
        "Mercedes Benz",
        "Police",
        "Sprint Polarized",
        "Constantine France",
        "Fond",
        "Fibran",
        "Wet Da",
        "Lancer",
        "A To Z",
        "Solano",
        "Braveheart",
        "Bodart",
        "Galina",
        "Heiser",
        "Corin",
        "Aopidi",
        "Silk Lens",
        "Beverly Hills",
        "Speedo",
        "Caterpillar",
        "Fommy Bahama",
        "Mindi",
        "Zijinghua",
        "Givo",
        "Esprit",
        "N-Star",
        "T-39",
        "Marco Ricci",
        "Red Cherry",
        "Posh",
        "Puma",
        "Oliver",
        "Barbie",
        "Austin Reed",
        "Hotwheels",
        "CAT",
        "Tommy Fashion",
        "Polo Fashion",
        "Junlu Prince",
        "Hidesign",
        "Test",
        "Odysey",
        "Woodpecker",
        "Binli Wood",
        "Senorita",
        "Pitt & Mitt",
        "Corola",
        "Nidun Optima",
        "Numero Uno",
        "Dolver",
        "Joseph Abboud",
        "Hummer",
        "Titum",
        "Feelgood",
        "Cute",
        "Chrome",
        "Benson",
        "Kool Blue",
        "Jerry Maguire",
        "Biotrue",
        "Elegance",
        "United Colors of Benetton",
        "Roberto",
        "Chris Cross",
        "Idears",
        "LVKE",
        "LUKE",
        "Madison",
        "YTM",
        "Celebration",
        "Glamour",
        "Vivid",
        "Vinage",
        "Termintor-II",
        "Marc & Jack",
        "Pinellii",
        "Siddhi",
        "Vision & Fashion",
        "Red Wolf",
        "Black Wolf",
        "Fabia",
        "Bultaco",
        "Arnette",
        "Killer Loop",
        "Maui Jim",
        "Sentral",
        "Panache",
        "Paradox",
        "Animal",
        "Mayhem",
        "Flying Machine",
        "Down Town",
        "Da Vinci",
        "Aryca",
        "Vision Pro",
        "Cambridgeshire",
        "Mara Boss",
        "OTO",
        "Gunnar",
        "Louis Philippe",
        "Allen Solly",
        "Van Heusen",
        "Trends",
        "Accu Reader",
        "Longines",
        "Bench",
        "Bench Kids",
        "Carousel",
        "Henleys",
        "Playboy",
        "Top Secret",
        "Hello Kitty",
        "Doraemon",
        "Celine Dion",
        "Boinkers",
        "Synergy",
        "Varg",
        "1-2-C",
        "Killer",
        "Nick",
        "Mikli",
        "Kagawa",
        "S Oliver",
        "Hackett",
        "Igear",
        "Dakota Smith",
        "Suunto",
        "Hang Ten",
        "Tifosi",
        "IDEE",
        "I Zarra",
        "Shuitaojin",
        "Kamnomoc",
        "Turtle",
        "Dolkar",
        "Mexican Readers",
        "Ready",
        "Red Gear",
        "Zesprt",
        "Meima",
        "OXYDO",
        "E",
        "Youngstun",
        "Feike Sports",
        "Soul 9",
        "Invogue",
        "Retain",
        "Tommy Style",
        "ART",
        "Ashton",
        "Ifconj",
        "Sport",
        "Cyprus",
        "TBYB",
        "Rivanchy",
        "Polar Man",
        "Accessories",
        "HUVITZ",
        "Cholamandalam",
        "Tag Heuer",
        "Hydrasoft",
        "Chloe",
        "Larke",
        "Atoz",
        "All Clean",
        "British Optics",
        "Porsche Design",
        "Swarovski",
        "Nike",
        "Oakley Youth",
      ],
    },
  },
};
