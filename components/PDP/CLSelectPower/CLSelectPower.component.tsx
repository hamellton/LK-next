//> Defaults
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

//> Types
import { DataType } from "@/types/coreTypes";
import { CLSelectPowerType } from "./CLSelectPower.types";
import {
  ComponentSizeENUM,
  ThemeENUM,
  TypographyENUM,
} from "@/types/baseTypes";

//> Styles
import {
  CustomGrid,
  ErrorField,
  MainText,
  SelectPowerHead,
} from "./CLSelectPower.styles";

//> Packages
import { PrimaryButton, PlaceholderDropdown } from "@lk/ui-library";

//> Redux
import { reqSaveToCLObjType, saveToCartCL } from "@/redux/slices/cartInfo";
import Router from "next/router";

const ContactLensSelectPower = ({
  font,
  productId,
  powerTypeList,
  isJitProduct,
  isPlano,
  sessionId,
  localeData,
}: CLSelectPowerType) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartIsError, cartIsLoading, cartErrorMessage } = useSelector(
    (state: RootState) => state.cartInfo
  );
  const { subdirectoryPath } = useSelector(
    (state: RootState) => state.pageInfo
  );
  //> Local States
  const [showError, setShowError] = useState(false);
  const [cartActive, setcartActive] = useState(false);
  const [leftBox, setLeftBox] = useState<DataType>({
    boxes: "0",
    sph: "",
    cyl: "",
    axis: "",
  });
  const [rightBox, setRightBox] = useState<DataType>({
    boxes: "0",
    sph: "",
    cyl: "",
    axis: "",
  });
  const resetCLBoxes = () => {
    setLeftBox({
      boxes: "0",
      sph: "",
      cyl: "",
      axis: "",
    });
    setRightBox({
      boxes: "0",
      sph: "",
      cyl: "",
      axis: "",
    });
  };

  //> Reset CL Box Dropdown's
  useEffect(() => {
    if (!cartIsError) {
      resetCLBoxes();
    }
  }, [cartIsError]);

  //> Add to Cart CL with Zero Power
  const addToCartZeroCl = () => {
    const reqObj: reqSaveToCLObjType = {
      sessionId,
      pid: isJitProduct ? productId : null,
      cartData: {
        productId: productId,
        quantity: "1",
        prescription: {
          dob: "",
          gender: "",
          notes: "",
          userName: "lenskart user",
          powerType: "CONTACT_LENS",
          left: {
            boxes: "1",
            sph: "0.00",
          },
        },
      },
      validationData: { powerOptionList: [] },
    };
    const existingPowerTypes = powerTypeList.map((pt) => pt.type);
    existingPowerTypes.forEach((key) =>
      reqObj.validationData.powerOptionList.push({
        type: `Right ${key.toString().toUpperCase()}`,
        value: rightBox[key],
        price: 0,
      })
    );
    existingPowerTypes.forEach((key) =>
      reqObj.validationData.powerOptionList.push({
        type: `Left ${key.toString().toUpperCase()}`,
        value: leftBox[key],
        price: 0,
      })
    );
    // jit => powerData -> verify + cartData -> add + pid
    // non jit => cartData -> verify + cartData -> add
    dispatch(saveToCartCL(reqObj));
    setcartActive(true);
    // Router.push("/cart");
    // closePackageScreenHandler();
  };

  //> Add to Cart CL with power
  const addToCart = () => {
    const reqObj: reqSaveToCLObjType = {
      sessionId,
      pid: isJitProduct ? productId : null,
      cartData: {
        productId: productId,
        quantity: "0",
        prescription: {
          dob: "",
          gender: "",
          notes: "",
          userName: "lenskart user",
          powerType: "CONTACT_LENS",
        },
      },
      validationData: { powerOptionList: [] },
    };
    const existingPowerTypes = powerTypeList.map((pt) => pt.type);
    if (rightBox.boxes && rightBox.boxes !== "0") {
      reqObj.cartData.quantity = (
        parseInt(rightBox.boxes) + parseInt(reqObj.cartData?.quantity)
      ).toString();
      existingPowerTypes.forEach((key) => {
        if (reqObj.cartData.prescription.right)
          reqObj.cartData.prescription.right = {
            ...reqObj.cartData?.prescription.right,
            [key]: rightBox[key],
          };
        else reqObj.cartData.prescription.right = { [key]: rightBox[key] };
      });
    }
    if (leftBox.boxes && leftBox.boxes !== "0") {
      reqObj.cartData.quantity = (
        parseInt(leftBox.boxes) + parseInt(reqObj.cartData?.quantity)
      ).toString();
      existingPowerTypes.forEach((key) => {
        if (reqObj.cartData?.prescription.left)
          reqObj.cartData.prescription.left = {
            ...reqObj.cartData?.prescription.left,
            [key]: leftBox[key],
          };
        else reqObj.cartData.prescription.left = { [key]: leftBox[key] };
      });
    }
    existingPowerTypes.forEach((key) =>
      reqObj.validationData.powerOptionList.push({
        type: `Right ${key.toString().toUpperCase()}`,
        value: rightBox[key],
        price: 0,
      })
    );
    existingPowerTypes.forEach((key) =>
      reqObj.validationData.powerOptionList.push({
        type: `Left ${key.toString().toUpperCase()}`,
        value: leftBox[key],
        price: 0,
      })
    );
    // let leftCheck = true;
    // let rightCheck = true;
    // if(reqObj.cartData?.prescription.left) {
    //   Object.keys(reqObj.cartData?.prescription?.left).map((val: string) => {
    //     if(val !== 'boxes' && !reqObj.cartData?.prescription.left?.[val]) {
    //       leftCheck = false;
    //     }
    //   });
    // }
    // if(reqObj.cartData?.prescription.right) {
    //   Object.keys(reqObj.cartData?.prescription?.right).map((val: string) => {
    //     if(val !== 'boxes' && !reqObj.cartData?.prescription.right?.[val]) {
    //       rightCheck = false;
    //     }
    //   });
    // }
    // console.log(reqObj.cartData?.quantity)
    // if(reqObj.cartData?.quantity === "0" && (!leftCheck && !rightCheck)){
    //   setShowError(true);
    // } else {
    dispatch(saveToCartCL(reqObj));
    setcartActive(true);
    // Router.push("/cart");
    // }
  };

  useEffect(() => {
    if (cartActive && !cartIsLoading && !cartIsError) {
      setcartActive(false);
      Router.push(`/cart`);
    }
  }, [cartIsLoading, cartIsError, cartActive, subdirectoryPath]);

  const updateData = (type: string, value: string, isLeftBox: boolean) => {
    if (isLeftBox) {
      setLeftBox((l: any) => ({ ...l, [type]: value }));
    } else {
      setRightBox((r: any) => ({ ...r, [type]: value }));
    }
  };
  return powerTypeList?.length ? (
    <div>
      <SelectPowerHead>{localeData.SELECT_POWER}</SelectPowerHead>
      <CustomGrid columns={3} font={font}>
        <MainText />
        <MainText font={font}>OS (LEFT EYE)</MainText>
        <MainText font={font}>OD (RIGHT EYE)</MainText>
        {powerTypeList?.map((pl, i) => (
          <Fragment key={i}>
            <MainText font={font}>{pl.type}</MainText>
            {pl.type === "boxes"
              ? [...Array(2)].map((und, i) => (
                  <Fragment key={i}>
                    <PlaceholderDropdown
                      options={pl.powerDataList
                        ?.reduce(
                          (acc, mydata) => [
                            ...acc,
                            ...mydata.value.map((val) => ({
                              key: `${val} Box`,
                              value: val,
                            })),
                          ],
                          [{ key: "", value: "" }]
                        )
                        .filter((dat) => dat.key)}
                      componentSize={ComponentSizeENUM.medium}
                      font={TypographyENUM.serif}
                      handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        updateData(pl.type, e.target.value, i === 0)
                      }
                      value={i === 0 ? leftBox[pl.type] : rightBox[pl.type]}
                    />
                  </Fragment>
                ))
              : [...Array(2)].map((und, i) => (
                  <Fragment key={i}>
                    <PlaceholderDropdown
                      options={pl.powerDataList
                        .reduce(
                          (acc, mydata) => [
                            ...acc,
                            ...mydata.value.map((val) => ({
                              key: val,
                              value: val,
                            })),
                          ],
                          [{ key: "", value: "" }]
                        )
                        .filter((dat) => dat.key)}
                      componentSize={ComponentSizeENUM.medium}
                      font={TypographyENUM.serif}
                      placeholder={localeData.PLEASE_SELECT}
                      handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        updateData(pl.type, e.target.value, i === 0)
                      }
                      value={i === 0 ? leftBox[pl.type] : rightBox[pl.type]}
                    />
                  </Fragment>
                ))}
          </Fragment>
        ))}
      </CustomGrid>
      {cartIsError && <ErrorField>{cartErrorMessage}</ErrorField>}
      {showError && !cartIsError && (
        <ErrorField>{localeData.POWER_FIELDS_MANDATORY}</ErrorField>
      )}
      {(powerTypeList?.length || isPlano) && (
        <PrimaryButton
          primaryText={localeData.BUY_NOW}
          font={TypographyENUM.serif}
          componentSize={ComponentSizeENUM.medium}
          onBtnClick={() => (isPlano ? addToCartZeroCl() : addToCart())}
          id="btn-primary-cl"
          width={"100%"}
          disabled={!parseInt(leftBox.boxes) && !parseInt(rightBox.boxes)}
          height="55px"
          theme={ThemeENUM.primary}
        />
      )}
    </div>
  ) : null;
};

export default ContactLensSelectPower;
