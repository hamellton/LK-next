import { triggerDataLayerOnPageViewPropsType } from "@/types/googleAnalytics";
import { pushDataLayer } from "./utils";

export const triggerDataLayerOnPageView = ({
  ecommerce,
  event = "view_item_list",
  isPlano,
  clPowerSubmission,
  login_status,
  country_code,
  currency_code,
}: triggerDataLayerOnPageViewPropsType) => {
  if (ecommerce) {
    const data: any = {
      event,
      ecommerce,
      login_status,
      arch_type: "new-arch",
      country_code,
      currency_code,
    };
    if (typeof isPlano !== "undefined") {
      data.isPlano = isPlano;
    }
    if (clPowerSubmission) {
      data.cl_power_submission = clPowerSubmission;
    }
    if (country_code) {
      data.country_code = country_code;
    }
    if (currency_code) {
      data.currency_code = currency_code;
    }
    pushDataLayer(data);
  }
};
