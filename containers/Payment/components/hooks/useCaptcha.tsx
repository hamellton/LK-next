import { APIMethods } from "@/types/apiTypes";
import { paymentFunctions } from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { useCallback, useState } from "react";

const useCaptcha = (sessionId: string) => {
    const [captchaValue, setCaptchaValue] = useState("");
    const [captchaImageUrl, setCaptchaImageUrl] = useState("")
    const loadCaptcha = useCallback(async() => {
      const api = new APIService(
        `${process.env.NEXT_PUBLIC_API_URL}`
      ).setMethod(APIMethods.GET);
      // api.sessionToken = sessionId;
      api.setHeaders(headerArr);
      const { data, error } = await paymentFunctions.getCaptcha(api);
      // console.log({ data, error }, "captcha");
      if (error?.isError) {
        setCaptchaImageUrl("");
        setCaptchaValue("");
      } else {
        setCaptchaImageUrl(data?.url);
        setCaptchaValue(data?.answer);
      }
    }, [sessionId]);
    return {captchaValue, captchaImageUrl, loadCaptcha};
}

export default useCaptcha;