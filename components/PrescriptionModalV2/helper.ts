import { DataType } from "@/types/coreTypes";

export const options = [
  {
    icon: "pfu-saved-power",
    header: "Use Saved Power",
    info: "Saved Powers are available",
    name: "SAVED_POWER",
    event: "SavedPrescription",
  },
  {
    icon: "pfu-enter-manual",
    header: "Enter Manually",
    info: "Enter your details yourself",
    name: "ENTER_MANUAL",
    event: "EnterManually",
  },
  {
    icon: "pfu-upload-photo",
    header: "Upload Photo",
    info: "Upload prescription from your phone",
    name: "UPLOAD_PHOTO",
    event: "UploadPhoto",
  },
  { name: "OR" },
  {
    icon: "pfu-upload-photo",
    header: "Upload Photo",
    info: "Upload prescription from your phone",
    name: "UPLOAD_PHOTO",
    event: "UploadPhoto",
  },
  {
    icon: "pfu-dont-know-power",
    header: "Get a callback",
    info: "We will call you to take your power after the order is placed",
    name: "DONT_KNOW_POWER",
    event: "DontKnow",
  },
  {
    icon: "pfu-dont-know-power",
    header: "Whatsapp Customer Support",
    info: "Dont worry, our support team will call and assist you to submit power",
    name: "WHATSAPP_SUPPORT",
    event: "DontKnow",
  },
];

export const orderPlacedOption = [
  {
    icon: "pfu-saved-power",
    header: "Use Saved Power",
    info: "Saved Powers are available",
    name: "SAVED_POWER",
    event: "SavedPrescription",
  },
  {
    icon: "pfu-enter-manual",
    header: "Enter Manually",
    info: "Enter your details yourself",
    name: "ENTER_MANUAL",
    event: "EnterManually",
  },
  {
    icon: "pfu-upload-photo",
    header: "Upload Photo",
    info: "Upload prescription from your phone",
    name: "UPLOAD_PHOTO",
    event: "UploadPhoto",
  },
  // { name: "OR" },
  {
    icon: "pfu-upload-photo",
    header: "Upload Photo",
    info: "Upload prescription from your phone",
    name: "UPLOAD_PHOTO",
    event: "UploadPhoto",
  },
  {
    icon: "visit-store",
    header: "Store eye power test",
    info: "Free Eye checkup will be done",
    name: "STORE_VISIT",
    event: "VisitStoreForPower",
  },
  {
    icon: "pfu-dont-know-power",
    header: "Get a callback",
    info: "We will call you to take your power after the order is placed",
    name: "GET_A_CALLBACK",
    event: "DontKnow",
  },
  {
    icon: "pfu-dont-know-power",
    header: "Whatsapp Customer Support",
    info: "Dont worry, our support team will call and assist you to submit power",
    name: "WHATSAPP_SUPPORT",
    event: "DontKnow",
  },
];

// Contact Lens : enter manual, saved power
// Eyeglasses : saved power, upload prescription
// Sunglasses : saved power, upload prescription
// Others : enter manual, saved power, upload prescription

// const powerOptions = {
//   "Eyeglasses": {"KNOW_POWER": ["SAVED_POWER", "ENTER_MANUAL", "UPLOAD_PHOTO"], "DONT_KNOW_POWER": ["UPLOAD_PHOTO", "WHATSAPP_SUPPORT", "GET_A_CALLBACK"]},
//   "Sunglasses": {"KNOW_POWER": ["SAVED_POWER", "ENTER_MANUAL", "UPLOAD_PHOTO"], "DONT_KNOW_POWER": ["UPLOAD_PHOTO", "WHATSAPP_SUPPORT", "GET_A_CALLBACK"]},
//   "Contact Lens": {"KNOW_POWER": ["SAVED_POWER", "ENTER_MANUAL", "UPLOAD_PHOTO"], "DONT_KNOW_POWER": ["UPLOAD_PHOTO", "WHATSAPP_SUPPORT", "GET_A_CALLBACK"]},
//   "Other": {"KNOW_POWER": ["SAVED_POWER", "ENTER_MANUAL", "UPLOAD_PHOTO"], "DONT_KNOW_POWER": ["UPLOAD_PHOTO", "WHATSAPP_SUPPORT", "GET_A_CALLBACK"]}
// }

export const getPowerOptions = (type: string) => {
  switch (type) {
    case "Eyeglasses":
      return "Eyeglasses";
    case "Sunglasses":
      return "Sunglasses";
    case "Contact Lens":
      return "ContactLens";
    default:
      return "Other";
  }
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getDate = (time: string) => {
  var dateFormat = new Date(time);
  var month = MONTHS[dateFormat.getMonth()].substring(0, 3);
  var year = dateFormat.getFullYear();
  var date: string = dateFormat.getDate().toString();
  date = ("0" + date).slice(-2);
  var fullDate = date + " " + month + " " + year;
  return fullDate;
};

export const POWER_NAME_CONFIG: DataType = {
  sph: "SPH",
  cyl: "CYL",
  axis: "AXIS",
  ap: "AP",
  pd: "PD",
  lensHeight: "LENS_HEIGHT",
  lensWidth: "LENS_WIDTH",
};

export enum Pages {
  SUBMIT_PRESCRIPTION = "SUBMIT_PRESCRIPTION",
  ENTER_MANUAL = "ENTER_MANUAL",
  ENTER_PD = "ENTER_PD",
  SAVED_POWER = "SAVED_POWER",
  UPLOAD_PHOTO = "UPLOAD_PHOTO",
  GET_A_CALLBACK = "GET_A_CALLBACK",
  STORE_VISIT = "STORE_VISIT",
  WHATSAPP_SUPPORT = "WHATSAPP_SUPPORT",
  CL_BUYING_OPTION = "CL_BUYING_OPTION",
  CL_ADDONS = "CL_ADDONS",
}

export const getTime = (time: string) => {
  if (!time) return "";
  const a = time.split(":");
  const min = a[1].split(" ");
  return `${a[0]}:${min[0]}`;
};

export const tConv24 = (time24: string) => {
  let ts = time24;
  const H = +ts.substr(0, 2);
  let h: number | string = H % 12 || 12;
  h = h < 10 ? "0" + h : h;
  const ampm = H < 12 ? " AM" : " PM";
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
};

export function loadScriptWithCallback(
  url: string,
  callback: () => void,
  attrs: any = {}
) {
  if (!document) return;
  const script: any = document.createElement("script");
  script.type = "text/javascript";
  Object.keys(attrs).forEach((attr) => {
    script[attr] = attrs[attr];
  });
  if (script.readyState) {
    script.onreadystatechange = () => {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => {
      callback();
    };
  }
  script.src = url;
  document.body.appendChild(script);
}

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

export function getLocation(
  successCB: (location: GeolocationPosition) => void,
  errorCB: (error: GeolocationPositionError) => void,
  retryTimes = 0
) {
  if (window && window.navigator && window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
      (location) => successCB(location),
      (error) => errorCB(error)
    );
  } else if (retryTimes < 3) {
    getLocation(successCB, errorCB, ++retryTimes);
  }
}

export const openMaps = (
  event: { preventDefault: () => void },
  props: {
    triggerDtmOnClick?: any;
    desktopFlow?: any;
    pfuStoreAddress?: any;
    ispfuStoreAddress?: any;
  },
  googleUrl: string | undefined,
  lat: any,
  lng: any,
  setShowMap: (arg0: boolean) => void
) => {
  const {
    triggerDtmOnClick = false,
    desktopFlow = false,
    pfuStoreAddress = true,
    ispfuStoreAddress = false,
  } = props;
  let windowContainer: any = window;
  if (triggerDtmOnClick && typeof triggerDtmOnClick === "function") {
    triggerDtmOnClick("store directions");
  }
  if (googleUrl && window) {
    if (desktopFlow) {
      windowContainer.open(googleUrl, "_blank").focus();
    } else if (pfuStoreAddress || ispfuStoreAddress) {
      setShowMap(true);
    } else {
      window.location.href = googleUrl;
    }
  } else if (lat && lng) {
    if (desktopFlow) {
      windowContainer
        .open(`https://maps.google.com/?q=${lat},${lng}`, "_blank")
        .focus();
    } else if (pfuStoreAddress || ispfuStoreAddress) {
      setShowMap(true);
    } else {
      window.location.href = `https://maps.google.com/?q=${lat},${lng}`;
    }
  }
  event.preventDefault();
};

export const downloadUploadedPrescription = `${process.env.NEXT_PUBLIC_API_URL}/v2/utility/customer/prescriptions/download/`;

export const sixOversix = {
  options: {
    fullPage: true,
    // width: '100vw',
    themeColor: "#5FB8E3",
    profileName: "web",
    flow: "pd",
  },
  clientId: "6b8c7fe4-dc57-4160-8c31-326041a50b59",
};

export function resetOrientation(
  srcBase64: any,
  srcOrientation: any,
  callback: any
) {
  const img = new Image();

  img.onload = function () {
    const width = img.width;
    const height = img.height;
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");

    // set proper canvas dimensions before transform & export
    if (srcOrientation > 4 && srcOrientation < 9) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    // transform context before drawing image
    switch (srcOrientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
      default:
        break;
    }

    // draw image
    ctx.drawImage(img, 0, 0);

    // export base64
    callback(canvas.toDataURL("image/jpeg"));
  };

  img.src = srcBase64;
}
