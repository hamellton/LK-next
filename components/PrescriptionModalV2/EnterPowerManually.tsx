import { getOrderData, updateOrderListingData } from "@/redux/slices/myorder";
import {
  getCLSubscriptions,
  getSubscriptionDiscount,
  updateCLPrescription,
  updatePrescriptionData,
  updatePrescriptionPage,
  updatePrevPrescriptionPage,
  updateUserPrescriptionData,
  validateCLPrescription,
  validateCLSuccessful,
} from "@/redux/slices/prescription";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes, ThemeENUM } from "@/types/baseTypes";
import { DataType, TypographyENUM } from "@/types/coreTypes";
import { Button, PrescriptionModal, Toast } from "@lk/ui-library";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomSheet from "./BottomSheet";
import { Pages } from "./helper";

export default function EnterPowerManually({
  closeSlider,
  orderId,
  item,
  deviceType,
  postNeedHelpWhatsappFun,
  localeData,
  configData,
  powerType,
  productData,
  preCheckout = false,
  skipPowerOptions,
  powerOptions,
}: {
  closeSlider: (props: boolean) => void;
  orderId?: number;
  item: any;
  deviceType: string;
  postNeedHelpWhatsappFun: () => void;
  localeData: DataType;
  configData: DataType;
  powerType?: string;
  productData?: DataType;
  preCheckout?: boolean;
  skipPowerOptions?: string[];
  powerOptions: string[];
}) {
  const [samePower, setSamePower] = useState(false);
  const [cyPower, setCyPower] = useState(false);
  const [userName, setUserName] = useState(" ");
  const [phoneNumber, setPhoneNumber] = useState(" ");
  const [jitFlow, setJitFlow] = useState(false);

  const { eye, clValidateSuccessful, validateCLError } = useSelector(
    (state: RootState) => state.prescriptionInfo.clPrescriptionData
  );

  const [power, setPower] = useState<any>({
    sph: {
      left: "",
      right: "",
    },
    cyl: {
      left: "",
      right: "",
    },
    axis: {
      left: "",
      right: "",
    },
    ap: {
      left: "",
      right: "",
    },
    pd: {
      left: "",
      right: "",
    },
  });

  const { fetchPowerData, updatePrescriptionDataInfo } = useSelector(
    (state: RootState) => state.prescriptionInfo
  );
  const { orderListingData } = useSelector(
    (state: RootState) => state.myOrderInfo
  );

  const { sessionId, email } = useSelector(
    (state: RootState) => state.userInfo
  );

  const dispatch = useDispatch<AppDispatch>();

  const checkboxHandler = (choice: string) => {
    if (choice === "sp") setSamePower((prevState) => !prevState);
    else if (choice === "cp") setCyPower((prevState) => !prevState);
  };

  const [clValidateError, setClValidateError] = useState({
    error: false,
    msg: "",
  });
  const [preCheckoutPrescriptionObj, setPrecheckoutPrescriptionObj] = useState(
    {}
  );

  const isPreFlowPd = false;

  const { isRTL, countryCode } = useSelector(
    (state: RootState) => state.pageInfo
  );

  useEffect(() => {
    if (validateCLError.error) {
      setClValidateError({ ...validateCLError });
    }

    window.setTimeout(() => {
      setClValidateError({ error: false, msg: "" });
    }, 2000);
  }, [validateCLError]);

  useEffect(() => {
    if (updatePrescriptionDataInfo.prescriptionSavedManual) {
      let orderIndex = orderListingData.findIndex(
        (order: { id: string }) =>
          order.id === updatePrescriptionDataInfo.prescriptionSavedManual.id
      );
      let orders = [...orderListingData];
      orders[orderIndex] = {
        ...updatePrescriptionDataInfo.prescriptionSavedManual,
      };
      dispatch(updateOrderListingData(orders));
    }
  }, [updatePrescriptionDataInfo.prescriptionSavedManual]);

  const submitPower = () => {
    let temp = {
      left: {},
      right: {},
    };
    let tempName = item?.prescription?.powerType || powerType;
    Object.keys(power).forEach((index) => {
      if (index === "sph" || index === "cyl") {
        temp = {
          left: {
            ...temp.left,
            sph: power.sph.left
              ? power.sph.left
              : localeData.CALL_EMAIL_ME_FOR_POWER,
            cyl: power.cyl.left
              ? power.cyl.left
              : localeData.CALL_EMAIL_ME_FOR_POWER,
          },
          right: {
            ...temp.right,
            sph: power.sph.right
              ? power.sph.right
              : localeData.CALL_EMAIL_ME_FOR_POWER,
            cyl: power.cyl.right
              ? power.cyl.right
              : localeData.CALL_EMAIL_ME_FOR_POWER,
          },
        };
      } else if (power[index].left || power[index].right) {
        temp = {
          left: {
            ...temp.left,
            [index]: power[index].left
              ? power[index].left
              : localeData.CALL_EMAIL_ME_FOR_POWER,
          },
          right: {
            ...temp.right,
            [index]: power[index].right
              ? power[index].right
              : localeData.CALL_EMAIL_ME_FOR_POWER,
          },
        };
      }
    });

    const prescription = {
      left: temp.left,
      right: temp.right,
      powerType: tempName,
      userName: userName,
      recordedAt: Date.now(),
      source: "WEB",
      power_updated_by: email,
    };
    let tempObjForCL: {
      left: {
        boxes?: number;
        sph?: string;
        cyl?: string;
      };
      right: {
        boxes?: number;
        sph?: string;
        cyl?: string;
      };
    } = {
      left: {},
      right: {},
    };

    if (eye === "both") {
      tempObjForCL.left.boxes = 1;
      tempObjForCL.right.boxes = 1;
    } else {
      if (eye === "left") {
        tempObjForCL.left.boxes = 1;
      } else {
        tempObjForCL.left.boxes = 1;
      }
    }

    Object.keys(power).forEach((index) => {
      if (index === "sph" || index === "cyl") {
        tempObjForCL = {
          left: {
            ...tempObjForCL.left,
            sph: power.sph.left,
            cyl: power.cyl.left,
          },
          right: {
            ...tempObjForCL.right,
            sph: power.sph.right,
            cyl: power.cyl.right,
          },
        };
      } else if (power[index].left || power[index].right) {
        temp = {
          left: {
            ...temp.left,
            [index]: power[index].left,
          },
          right: {
            ...temp.right,
            [index]: power[index].right,
          },
        };
      }
    });
    if (!tempObjForCL.left.cyl) delete tempObjForCL.left.cyl;
    if (!tempObjForCL.right.cyl) delete tempObjForCL.right.cyl;

    const preCheckoutPrescriptionObject: Partial<{
      left: any;
      right: any;
      boxes: number;
    }> = {
      left: { ...tempObjForCL.left, boxes: 1 },
      right: { ...tempObjForCL.right, boxes: 1 },
    };

    if (eye === "right") {
      delete preCheckoutPrescriptionObject.left;
    } else if (eye === "left") {
      delete preCheckoutPrescriptionObject.right;
    }

    if (preCheckout) {
      if (!productData?.jit) {
        dispatch(
          validateCLPrescription({
            sessionId: sessionId,
            prescription: preCheckoutPrescriptionObject,
            productId: productData?.id.toString(),
            quantity: 2,
            userName: "test",
          })
        );
      } else {
        setJitFlow(true);
      }

      setPrecheckoutPrescriptionObj({
        ...prescription,
        left:
          preCheckoutPrescriptionObject?.left &&
          preCheckoutPrescriptionObject?.left,
        right:
          preCheckoutPrescriptionObject?.right &&
          preCheckoutPrescriptionObject?.right,
      });
    }

    if (!preCheckout) {
      dispatch(
        updatePrescriptionData({
          sessionId: sessionId,
          orderID: orderId,
          itemID: item?.id,
          prescription: prescription,
          emailID: email,
        })
      );
      if (configData?.SHOW_PD && item?.prescription?.powerType === "BIFOCAL") {
        dispatch(updatePrescriptionPage(Pages.ENTER_PD));
        dispatch(updatePrevPrescriptionPage(Pages.ENTER_PD));
      } else {
        closeSlider(true);
        // window.location.reload();
      }
    }
  };

  // //> dispatch after successful validate

  useEffect(() => {
    if ((clValidateSuccessful || jitFlow) && preCheckout) {
      dispatch(updateCLPrescription(preCheckoutPrescriptionObj));
      dispatch(
        getCLSubscriptions({
          sessionId: sessionId,
          productId: productData?.id.toString(),
          isBothEye: eye === "both",
        })
      );

      dispatch(
        getSubscriptionDiscount({
          sessionId: sessionId,
          productId: productData?.id.toString(),
          subscriptionsType: "LENS",
        })
      );
      // dispatch(updatePrevPrescriptionPage(prescriptionPage));
      dispatch(updatePrescriptionPage(Pages.CL_BUYING_OPTION));
      setJitFlow(false);
      dispatch(validateCLSuccessful(false));
    }
  }, [clValidateSuccessful, jitFlow]);

  const PowerSet = (
    name: string,
    side: string,
    number: string,
    both?: boolean
  ) => {
    if (both) {
      setPower({
        ...power,
        [name]: {
          ...power[name],
          left: number,
          right: number,
        },
      });
    } else {
      setPower({
        ...power,
        [name]: {
          ...power[name],
          [side]: number,
        },
      });
    }
  };
  return (
    <div>
      {deviceType === DeviceTypes.MOBILE &&
        preCheckout &&
        clValidateError?.error && (
          <Toast text={clValidateError.msg ?? "Invalid Power"} />
        )}
      {((!preCheckout && Object.keys(item).length > 0) ||
        (preCheckout && productData)) && (
        <PrescriptionModal.EnterPowerManually
          deviceType={deviceType}
          localeData={localeData}
          orderId={orderId}
          checkboxHandler={checkboxHandler}
          samePower={samePower}
          fetchPowerData={fetchPowerData}
          power={power}
          PowerSet={PowerSet}
          cyPower={cyPower}
          itemList={item}
          phoneNumber={phoneNumber}
          setUserName={setUserName}
          setPhoneNumber={setPhoneNumber}
          userName={userName}
          postNeedHelpWhatsappFun={postNeedHelpWhatsappFun}
          configData={configData}
          powerType={powerType}
          productData={productData}
          preCheckout={preCheckout}
          isRTL={isRTL}
          countryCode={countryCode}
          eye={eye}
          phoneNumberText={localeData.CANT_FIND_YOUR_POWER}
          powerOptions={powerOptions}
          phoneCodeConfigData={
            configData?.AVAILABLE_NEIGHBOUR_COUNTRIES &&
            JSON.parse(configData?.AVAILABLE_NEIGHBOUR_COUNTRIES)
          }
          supportMultipleCountries={configData?.SUPPORT_MULTIPLE_COUNTRIES}
        />
      )}
      {
        <BottomSheet higherZIndex isMobile={deviceType === DeviceTypes.MOBILE}>
          <Button
            onClick={submitPower}
            disabled={!userName.trim() || !phoneNumber.trim()}
            theme={ThemeENUM.secondary}
            text={
              !preCheckout && item.prescription.powerType === "BIFOCAL"
                ? localeData.CONTINUE_CAPITALIZE
                : localeData.SAVE_AND_PROCEED_NEW
            }
            width={deviceType === DeviceTypes.MOBILE ? 100 : 50}
          />
        </BottomSheet>
      }
    </div>
  );
}
