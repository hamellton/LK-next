import {
  deleteCookie as deleteDefaultCookie,
  getCookie as getDefaultCookie,
  hasCookie as hasDefaultCookie,
  setCookie as setDefaultCookie,
} from "cookies-next";

export const headerArr = [
  {
    key: "x-country-code",
    value: `${process.env.NEXT_PUBLIC_APP_COUNTRY?.toUpperCase()}`,
  },
  {
    key: "x-api-client",
    value: `${process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase()}`,
  },
  {
    key: "x-accept-language",
    value: `${process.env.NEXT_PUBLIC_APP_LANG?.toLowerCase()}`,
  },
  {
    key: "Content-Type",
    value: "application/json",
  },
  {
    key: "x-b3-traceid",
    value: `99${Date.now()}`,
  },
  {
    key: "x-country-code-override",
    value: `${process.env.NEXT_PUBLIC_APP_COUNTRY?.toUpperCase()}`,
  },
];

export function deleteCookie(name: string, options?: any) {
  if ((options?.req && options?.res) || typeof window === "undefined") {
    deleteDefaultCookie(name, {
      req: options?.req,
      res: options?.res,
      domain: `.ab.lenskart.com`,
    });
    deleteDefaultCookie(name, {
      req: options?.req,
      res: options?.res,
      domain: `.lenskart.com`,
    });
    return deleteDefaultCookie(name, {
      req: options?.req,
      res: options?.res,
      domain: `.${process.env.NEXT_PUBLIC_HOSTNAME}`,
    });
  } else {
    deleteDefaultCookie(name, {
      domain: `.ab.lenskart.com`,
    });
    deleteDefaultCookie(name, {
      domain: `.lenskart.com`,
    });
    return deleteDefaultCookie(name, {
      domain: `.${window.location.hostname}`,
    });
  }
}

function checkCookieInSpecificDomain({
  name,
  domain,
  options,
}: {
  name: string;
  domain: string;
  options?: any;
}) {
  // Check if cookie exists in custom domain which is passed in props
  let value: any;
  if ((options?.req && options?.res) || typeof window === "undefined") {
    value = getDefaultCookie(name, {
      req: options?.req,
      res: options?.res,
      domain: domain,
    });
  } else {
    value = getDefaultCookie(name, {
      domain: domain,
    });
  }
  // get the cookie in the env domain
  const envValue = getCookie(name, options, true);
  // if env cookie and custom domain cookie both exists, give precedence to env cookie
  // and set it and delete custom domain cookie
  if (value && envValue) {
    deleteCookie(name, options);
    setCookie(name, envValue, options);
    // if env cookie doesn't exist delete cookie in custom domain,
    // and set the custom domain cookie to env cookie
  } else if (value && !envValue) {
    deleteCookie(name, options);
    setCookie(name, value, options);
  }
}

export function getCookie(name: string, options?: any, dontCheck?: boolean) {
  // added check to avoid infinite recursion
  if (!dontCheck)
    checkCookieInSpecificDomain({ name, domain: ".lenskart.com", options });
  let value: any;
  if ((options?.req && options?.res) || typeof window === "undefined") {
    value =
      getDefaultCookie(name, {
        req: options?.req,
        res: options?.res,
        domain: `${process.env.NEXT_PUBLIC_HOSTNAME}`,
      }) ||
      getDefaultCookie(name, {
        req: options?.req,
        res: options?.res,
        domain: `.ab.lenskart.com`,
      });
  } else {
    value =
      getDefaultCookie(name, { domain: `.${window.location.hostname}` }) ||
      getDefaultCookie(name, { domain: `.ab.lenskart.com` });
  }
  return value;
}

export function setCookie(
  name: string,
  value: string | boolean,
  options?: any
) {
  if (
    (typeof value === "string" && !value.trim()) ||
    typeof value === "undefined"
  )
    return;
  if ((options?.req && options?.res) || typeof window === "undefined") {
    setDefaultCookie(name, value, {
      req: options?.req,
      res: options?.res,
      path: "/",
      domain: `.ab.lenskart.com`,
    });
    setDefaultCookie(name, value, {
      req: options?.req,
      res: options?.res,
      path: "/",
      // expires: getCookieExpireTime(),
      domain: `.${process.env.NEXT_PUBLIC_HOSTNAME}`,
    });
  } else {
    setDefaultCookie(name, value, {
      domain: `.ab.lenskart.com`,
    });
    setDefaultCookie(name, value, {
      // expires: getCookieExpireTime(),
      domain: `.${window.location.hostname}`,
    });
  }
}

export function hasCookie(name: string, options?: any) {
  if ((options?.req && options?.res) || typeof window === "undefined") {
    return (
      hasDefaultCookie(name, {
        req: options?.req,
        res: options?.res,
        domain: `.${process.env.NEXT_PUBLIC_HOSTNAME}`,
      }) ||
      hasDefaultCookie(name, {
        req: options?.req,
        res: options?.res,
        domain: `.ab.lenskart.com`,
      })
    );
  } else {
    return (
      hasDefaultCookie(name, { domain: `.${window.location.hostname}` }) ||
      hasDefaultCookie(name, { domain: `.ab.lenskart.com` })
    );
  }
}

export const defaultCookieInfo = (req: any) => {
  return `.${window?.location?.hostname}`;
};

export const getCookieExpireTime = () => {
  const date = new Date();
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
  return date;
};

export const exchangeHeaders = [
  {
    key: "x-service-type",
    value: "exchange",
  },
  // {
  //   key: "x-customer-type",
  //   value: "REPEAT",
  // },
];
