import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService, RequestBody } from "@lk/utils";
import { headerArr } from "helpers/defaultHeaders";
import { APIMethods } from "@/types/apiTypes";
import { userFunctions } from "@lk/core-utils";
import { getCookie, setCookie, setCookies } from "@/helpers/defaultHeaders";
import { DataType } from "@/types/coreTypes";
import { action } from "@storybook/addon-actions";
import { cygnusAPI } from "@/constants/index";

interface frameSizeType {
  errorMessage: string;
  message: string;
  isLoading: boolean;
  result: DataType | null;
}

interface cygnusType {
  isError: boolean;
  errorMessage: string;
  cygnusIdLoaded: boolean;
  cygnusId: string;
  imageUrl: string;
  isLoading: boolean;
  cygnusImageData: DataType | null;
}

interface cygnusImage {
  imageInfo: { id: string; image_url: string }[] | [];
  isLoading: boolean;
  isError: boolean;
}

interface DittoType {
  isDittoAuthSet: any;
  setDittoImage: any;
  dittoImageLoading: boolean;
  isImageLoaded: boolean;
  testTryOn: boolean;
  dittoProfiles: any;
  thumbnailImage: DataType;
  dittoSignatures: any;
  getetDittoProfilesAuthData: any;
  isGetetDittoProfilesAuthData: boolean;
  isSetDittoIdLoading: boolean;
  cygnus: cygnusType;
  frameSize: frameSizeType;
  cygnusImageInfo: cygnusImage;
}

const initialState: DittoType = {
  isDittoAuthSet: false,
  setDittoImage: {},
  dittoImageLoading: true,
  isImageLoaded: false,
  testTryOn: false,
  thumbnailImage: {},
  dittoSignatures: {},
  cygnus: {
    isError: false,
    errorMessage: "",
    cygnusIdLoaded: false,
    cygnusId: "",
    imageUrl: "",
    isLoading: false,
    cygnusImageData: {},
  },
  dittoProfiles: {
    isdittoProfile: false,
    isLoading: false,
    dittoProfileData: {},
    thumbnailLoading: false,
  },
  getetDittoProfilesAuthData: [],
  isGetetDittoProfilesAuthData: false,
  isSetDittoIdLoading: true,
  cygnusImageInfo: {
    imageInfo: [],
    isLoading: false,
    isError: false,
  },
  frameSize: {
    errorMessage: "",
    message: "",
    isLoading: false,
    result: null,
  },
};

const vtoUrl = "https://vto.lenskart.api.ditto.com/api/1.3/dittos/";

export function dataURItoBlob(dataURI: any) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export const CalculateImage = createAsyncThunk(
  "CalculateImage",
  async (
    reqObj: {
      // sessionId: string;
      image: any;
      authToken: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(setFrameSizeCalLoading(true));
    const binaryImage = dataURItoBlob(reqObj.image);
    const formData = new FormData();
    formData.append("image_file", binaryImage);

    return fetch(
      "https://lenskart-prod.firebaseapp.com/api/v1/frame-size/calculate",
      {
        method: "POST",
        headers: {
          "x-api-client": `${process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase()}`,
          "x-client-auth-token": reqObj.authToken,
          accept: "application/json, text/plain, */*",
        },
        body: formData,
      }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.errorMessage || data?.status === 400) {
          return { data, error: true };
        } else return { data, error: false };
      });
  }
);

export const getCygnusImage = createAsyncThunk(
  "getCygnusImage",
  async (
    reqObj: {
      sessionId: string;
      image: any;
      phNumber: string;
      countryCode: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(setCygnusIdLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;

    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const binaryImage = dataURItoBlob(reqObj.image);
    const formData = new FormData();
    formData.append("file", binaryImage);
    // console.log("jdhbrfjcjdcrjj",body);

    return fetch(
      "https://api-gateway-in.juno.lenskart.com/v1/cygnus/customers/images",
      {
        method: "POST",
        headers: !reqObj.phNumber
          ? {
              "x-api-client": `${process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase()}`,
              "x-accept-language": `${process.env.NEXT_PUBLIC_APP_LANG?.toLowerCase()}`,
            }
          : {
              "X-Customer-Phone-Code": `${reqObj.countryCode}`,
              "x-api-client": `${process.env.NEXT_PUBLIC_APP_CLIENT?.toLowerCase()}`,
              "x-accept-language": `${process.env.NEXT_PUBLIC_APP_LANG?.toLowerCase()}`,
              "X-Customer-Phone": reqObj.phNumber,
            },
        body: formData,
      }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.errorCode || data?.status === 404 || data?.errorMessage) {
          return { data, error: true };
        } else return { data, error: false };
      });
  }
);
export const setDittoAuth = createAsyncThunk(
  "setDittoAuth",
  async (
    reqObj: { sessionId: string; dittoId: string; set: boolean },
    thunkAPI
  ) => {
    // thunkAPI.dispatch(updateUserLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);

    api.setMethod(APIMethods.GET);
    const { data, error } = await userFunctions.dittoAuth(reqObj.dittoId, api);

    const accessCode = data.result.accessCode;
    const signature = data.result.signature;

    setCookie("dittoAccessID", accessCode);
    window.sessionStorage.setItem("createDittoSignature", signature);
    setCookie("dittoSignature", signature);
    setCookie("isDittoID", reqObj.dittoId);
    if (reqObj.dittoId !== "lenskart") {
      setCookie("showMeDitto", true);
    }
    thunkAPI.dispatch(
      setDittoSignatures({
        id: reqObj.dittoId,
        result: { accessCode, signature },
      })
    );
    // console.log(reqObj.dittoId);

    try {
      if (!error.isError) {
        return reqObj.set;
      } else {
        console.log("Ditto Error");
      }
    } catch (err) {
      return err;
    }
  }
);

const getSingleDittoImage = async (
  pid: number,
  dittoAccessID: any,
  dittoSignature: any,
  dittoId: any
) => {
  if (dittoId && dittoSignature) {
    return await fetch(
      `${vtoUrl}${dittoId}/frontal-frame/?product_id=${pid}&size=300x240`,
      {
        headers: {
          "X-Ditto-Access-Key-Id": dittoAccessID,
          "X-Ditto-Signature": dittoSignature,
        },
      }
    )
      .then((res) => res.blob())
      .then((url) => {
        const image = URL.createObjectURL(url);
        return image;
      });
  }
};

const getDittoImageUrl = async (
  id: string,
  dittoAccessID: string,
  dittoSignature: string
) => {
  // console.log(id, dittoAccessID, dittoSignature);

  if (id) {
    return await fetch(`${vtoUrl}${id}/frontal-frame/?size=300x240`, {
      headers: {
        // "Cache-Control": "no-cache, no-store",
        // "X-Session-Token": getCookie(`clientV1_${country}`)?.toString() || "",
        "X-Ditto-Access-Key-Id": dittoAccessID,
        "X-Ditto-Signature": dittoSignature,
      },
    })
      .then((res) => res.blob())
      .then((url) => {
        const image = URL.createObjectURL(url);
        return image;
      });
  }
};

export const getCygnusOverlayImage = createAsyncThunk(
  "getCygnusOverlayImage",
  async (
    reqObj: {
      pid: number;
      sessionId: string;
      guestId: string;
      phoneNumber?: string;
      phoneCode?: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(setCygnusIdLoading(true));
    const api = new APIService(`${cygnusAPI}`);
    api.sessionToken = reqObj.sessionId;
    if (reqObj.phoneNumber && reqObj.phoneCode) {
      api.setHeaders([
        ...headerArr,
        { key: "X-Customer-Phone", value: reqObj.phoneNumber },
        { key: "X-Customer-Phone-Code", value: reqObj.phoneCode },
      ]);
    } else {
      api.setHeaders(headerArr);
    }

    api.setMethod(APIMethods.GET);
    const { data: reqData, error } = await userFunctions.cygnusOverlayImage(
      api,
      reqObj.pid,
      reqObj.guestId
    );

    try {
      return { reqData, error, reqObj };
    } catch (err) {
      console.log(err);
    }
    console.log(reqData, error);
  }
);

export const updateCustomerCygnusData = createAsyncThunk(
  "updateCustomerCygnusData",
  async (
    reqObj: {
      sessionId: string;
      cygnusId: string;
    },
    thunkAPI
  ) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;

    api.setHeaders(headerArr);

    api.setMethod(APIMethods.PUT);
    const body = new RequestBody<{
      cygnusId: string;
    }>({
      cygnusId: reqObj.cygnusId,
    });
    const { data: reqData, error } = await userFunctions.updateCustomerCygnus(
      api,
      body
    );
    console.log(reqData, error);

    try {
      return { reqData, error, reqObj };
    } catch (err) {
      console.log(err);
    }
  }
);

export const deleteCustomerCygnusData = createAsyncThunk(
  "deleteCustomerCygnusData",
  async (reqObj: { sessionId: string }) => {
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;

    api.setHeaders(headerArr);

    api.setMethod(APIMethods.DELETE);
    const { data: reqData, error } = await userFunctions.updateCustomerCygnus(
      api,
      true
    );
    try {
      return { reqData, error };
    } catch (err) {
      console.log(err);
    }
  }
);

export const getCygnusImageData = createAsyncThunk(
  "getCygnusImageData",
  async (
    reqObj: {
      sessionId: string;
      phoneNumber: string;
      phoneCode: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(updateCygnusImageLoading(true));
    const api = new APIService(`${cygnusAPI}`);
    api.sessionToken = reqObj.sessionId;

    api.setHeaders([
      ...headerArr,
      { key: "X-Customer-Phone", value: reqObj.phoneNumber },
      { key: "X-Customer-Phone-Code", value: reqObj.phoneCode },
    ]);

    api.setMethod(APIMethods.GET);

    const { data: reqData, error } = await userFunctions.cygnusImage(api);
    console.log(reqData, error);

    try {
      return { reqData, error };
    } catch (err) {
      console.log(err);
    }
  }
);

export const getDittoProfileImage = createAsyncThunk(
  "getDittoProfileImage",
  async (reqObj: { dittoProfiles: any; dittoSignatues: any }, thunkAPI) => {
    thunkAPI.dispatch(setDittoImageLoading(true));
    // console.log(reqObj.dittoSignatues, "in");

    const tempDittoImage = await (async () => {
      let arr: DataType = {};
      let breakLoop: number = 0;
      let continueBreakLoop: number = 0;
      thunkAPI.dispatch(setDittoImageLoading(true));
      // for (let i = 0; i < Object.keys(reqObj.dittoSignatues).length; i++) {
      // console.log(
      //   reqObj.dittoProfiles[i].id,
      //   i,
      //   reqObj.dittoSignatues,
      //   "---------------"
      // );
      //   getDittoImageUrl(
      //     Object.keys(reqObj.dittoSignatues)[i],
      //     reqObj.dittoSignatues[Object.keys(reqObj.dittoSignatues)[i]]
      //       .accessCode,
      //     reqObj.dittoSignatues[Object.keys(reqObj.dittoSignatues)[i]].signature
      //   ).then((val) => {
      //     arr[Object.keys(reqObj.dittoSignatues)[i]] = val;
      //     thunkAPI.dispatch(setDittoThumbnailImage(arr));
      //     breakLoop++;
      //     if (breakLoop === Object.keys(reqObj.dittoSignatues).length) {
      //       thunkAPI.dispatch(setDittoImageLoading(false));
      //     }
      //   });
      // }

      if (continueBreakLoop === Object.keys(reqObj.dittoSignatues).length) {
        thunkAPI.dispatch(setDittoImageLoading(false));
      }
      return arr;
    })();

    try {
      return tempDittoImage;
    } catch (err) {
      console.log(err);
    }
  }
);

export const getDittoImage = createAsyncThunk(
  "getDittoImage",
  async (reqObj: { productData: any; setDitto: any }, thunkAPI) => {
    thunkAPI.dispatch(setDittoImageLoading(true));
    const dittoAccessID = getCookie("dittoAccessID");
    const dittoSignature = getCookie("dittoSignature");
    const dittoId = getCookie("isDittoID");

    const tempDittoImage = await (async () => {
      let arr: DataType = {};
      let breakLoop: number = 0;
      let continueBreakLoop: number = 0;
      for (let i = 0; i < reqObj.productData.length; i++) {
        if (reqObj.setDitto[reqObj.productData[i].id]) {
          breakLoop++;
          continueBreakLoop++;
          continue;
        }
        getSingleDittoImage(
          reqObj.productData[i].id,
          dittoAccessID,
          dittoSignature,
          dittoId
        ).then((val) => {
          arr[reqObj.productData[i].id] = val;
          thunkAPI.dispatch(setDittoImage(arr));
          breakLoop++;
          if (breakLoop === reqObj.productData.length) {
            thunkAPI.dispatch(setDittoImageLoading(false));
            thunkAPI.dispatch(setIsImageLoaded(true));
          }
        });
      }

      if (continueBreakLoop === reqObj.productData.length) {
        thunkAPI.dispatch(setDittoImageLoading(false));
        thunkAPI.dispatch(setIsImageLoaded(true));
      }
      return arr;
    })();

    try {
      return tempDittoImage;
    } catch (err) {
      console.log(err);
    }
  }
);

export const deleteDitto = createAsyncThunk(
  "deleteDitto",
  async (reqObj: { dittoId: string; sessionId: string }, thunkAPI) => {
    // thunkAPI.dispatch(updateUserLoading(true));

    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.DELETE);
    const { data: reqData, error } = await userFunctions.dittoProfileDelete(
      reqObj.dittoId,
      api
    );
    // console.log(reqData, "reqData");
    try {
      if (!error.isError) {
        // console.log(reqData.result);
        thunkAPI.dispatch(
          getDittoProfilesAuth({
            sessionId: reqObj.sessionId,
            dittoIdList: reqData.result.dittoId,
          })
        );
      } else {
        // thunkAPI.dispatch(updateUserError(error.message));
        console.log("Ditto Error");
      }
    } catch (err) {
      return err;
    }
  }
);

export const dittoProfilePost = createAsyncThunk(
  "dittoProfilePost",
  async (reqObj: { sessionId: string; dittoId: string }, thunkAPI) => {
    thunkAPI.dispatch(setDittoProfileLoader());
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      dittoId: string;
    }>({
      dittoId: reqObj.dittoId,
    });
    const { data: reqData, error } = await userFunctions.dittoProfilePost(
      api,
      reqObj.dittoId
    );

    // debugger;

    try {
      if (!error.isError) {
        console.log(reqData.result);

        return reqData.result;
      } else {
        // thunkAPI.dispatch(updateUserError(error.message));
        console.log("Ditto Error");
      }
    } catch (err) {
      return err;
    }
  }
);

export const getDittoProfiles = createAsyncThunk(
  "getDittoProfiles",
  async (reqObj: { sessionId: string }, thunkAPI) => {
    // thunkAPI.dispatch(setDittoProfileLoader());
    // const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    // api.sessionToken = reqObj.sessionId;
    // api.setHeaders(headerArr);
    // api.setMethod(APIMethods.GET);
    // const { data: reqData, error } = await userFunctions.dittoProfileGet(api);
    // try {
    //   if (!error.isError) {
    //     return reqData.result;
    //   } else {
    //     // thunkAPI.dispatch(updateUserError(error.message));
    //     console.log("Ditto Error");
    //   }
    // } catch (err) {
    //   return err;
    // }
  }
);

export const saveDittoName = createAsyncThunk(
  "saveDittoName",
  async (
    reqObj: { sessionId: string; dittoId: string; nickName: string },
    thunkAPI
  ) => {
    thunkAPI.dispatch(setDittoProfileLoader());
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.POST);
    const body = new RequestBody<{
      dittoId: string;
      nickName: string;
    }>({
      dittoId: reqObj.dittoId,
      nickName: reqObj.nickName,
    });
    const { data: reqData, error } = await userFunctions.dittoProfilePost(
      api,
      body
    );
    try {
      if (!error.isError) {
        return reqData.result;
      } else {
        console.log("Ditto Error");
      }
    } catch (err) {
      return err;
    }
  }
);

export const saveDefaultDittoId = createAsyncThunk(
  "saveDefaultDittoId",
  async (reqObj: { sessionId: string; id: string }, thunkAPI) => {
    thunkAPI.dispatch(setDittoIdLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.PUT);
    const { data: reqData, error } = await userFunctions.setDitto(
      reqObj.id,
      api
    );
    try {
      if (!error.isError) {
        thunkAPI.dispatch(setDittoIdLoading(false));
        //thunkAPI.dispatch(setDittoAuth({sessionId: reqObj.sessionId, dittoId: reqObj.id, set:true }))
        return reqData.result;
      } else {
        console.log("Ditto Error");
      }
    } catch (err) {
      return err;
    }
  }
);

export const getDittoProfilesAuth = createAsyncThunk(
  "getDittoProfilesAuth",
  async (reqObj: { sessionId: string; dittoIdList: any }, thunkAPI) => {
    thunkAPI.dispatch(setgetDittoProfilesAuthLoading(true));
    const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`);
    api.sessionToken = reqObj.sessionId;
    api.setHeaders(headerArr);
    api.setMethod(APIMethods.GET);
    try {
      if (Array.isArray(reqObj.dittoIdList)) {
        const signaturePromise = reqObj.dittoIdList.map(async (ditto: any) => {
          return await userFunctions.dittoAuth(ditto.id, api);
        });
        const getSignatures: any = await Promise.all(
          signaturePromise.map((p) => p.catch(() => undefined))
        );
        const promises = reqObj.dittoIdList.map(
          async (ditto: any, index: number) => {
            const image = await fetch(
              `${vtoUrl}${ditto.id}/frontal-frame/?size=300x240`,
              {
                headers: {
                  "X-Ditto-Access-Key-Id":
                    getSignatures[index].data.result.accessCode,
                  "X-Ditto-Signature":
                    getSignatures[index].data.result.signature,
                },
              }
            )
              .then((res) => res.blob())
              .then((url) => {
                const image = URL.createObjectURL(url);
                return image;
              });
            return {
              dittoID: ditto.id,
              image: image,
              created: ditto.created,
            };
          }
        );
        let getImagesCall = await Promise.all(
          promises.map((p) => p.catch(() => undefined))
        );
        thunkAPI.dispatch(setgetDittoProfilesAuthLoading(false));
        return getImagesCall;
      }
    } catch (er) {
      console.log(er);
    }
  }
);
export const dittoSlice = createSlice({
  name: "dittoSlice",
  initialState,
  reducers: {
    setDittoImage: (state, action: PayloadAction<any>) => {
      state.setDittoImage = { ...state.setDittoImage, ...action.payload };
    },
    setDittoImageLoading: (state, action: PayloadAction<boolean>) => {
      state.dittoImageLoading = action.payload;
    },
    setIsImageLoaded: (state, action: PayloadAction<boolean>) => {
      state.isImageLoaded = action.payload;
    },
    setTryOnActive: (state, action: PayloadAction<boolean>) => {
      state.testTryOn = action.payload;
    },
    setDittoProfileLoader: (state) => {
      state.dittoProfiles.isLoading = true;
    },
    setDittoThumbnailLoading: (state, action: PayloadAction<boolean>) => {
      state.dittoProfiles.thumbnailLoading = action.payload;
    },
    setDittoSignatures: (state, action: PayloadAction<any>) => {
      state.dittoSignatures = {
        ...state.dittoSignatures,
        [action.payload.id]: action.payload.result,
      };
    },
    setDittoThumbnailImage: (state, action: PayloadAction<any>) => {
      // console.log(action.payload);

      state.thumbnailImage = {
        ...state.thumbnailImage,
        ...action.payload,
      };
    },
    setgetDittoProfilesAuthLoading: (state, action: PayloadAction<any>) => {
      state.isGetetDittoProfilesAuthData = action.payload;
    },
    setDittoIdLoading: (state, action: PayloadAction<any>) => {
      state.isSetDittoIdLoading = action.payload;
    },
    resetcygnus: (state) => {
      state.cygnus = { ...initialState.cygnus };
    },
    setCygnusIdLoading: (state, action: PayloadAction<boolean>) => {
      state.cygnus.isLoading = action.payload;
    },
    setFrameSizeCalLoading: (state, action: PayloadAction<boolean>) => {
      state.frameSize.isLoading = action.payload;
    },
    resetFrameSize: (state) => {
      state.frameSize = { ...initialState.frameSize };
    },
    resetCygnusIdLoad: (state) => {
      state.cygnus.cygnusIdLoaded = false;
    },
    resetCygnusImages: (state) => {
      state.cygnus.cygnusImageData = initialState.cygnus.cygnusImageData;
    },
    updateCygnusImageLoading: (state, action: PayloadAction<boolean>) => {
      state.cygnusImageInfo.isLoading = action.payload;
    },
    setNonCygnusImageInfo: (state, action: PayloadAction<number>) => {
      state.cygnus.cygnusImageData = {
        ...state.cygnus.cygnusImageData,
        [action.payload]: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setDittoAuth.fulfilled, (state, action) => {
      state.isDittoAuthSet = action.payload;
    });
    builder.addCase(deleteCustomerCygnusData.fulfilled, (state, action) => {
      if (!action.payload?.error.isError) {
        state.cygnusImageInfo.imageInfo = [];
      }
    });
    builder.addCase(CalculateImage.fulfilled, (state, action) => {
      if (action.payload?.error) {
        state.frameSize.errorMessage =
          action.payload.data?.errorMessage || action.payload.data.message;
        // state.frameSize.message = action.payload.data.message;
      } else {
        state.frameSize.result = { ...action.payload.data };
      }
      state.frameSize.isLoading = false;
    });
    builder.addCase(getCygnusImageData.fulfilled, (state, action) => {
      if (action.payload?.error?.isError) {
        state.cygnusImageInfo.isError = true;
      } else {
        state.cygnusImageInfo.imageInfo = [action.payload?.reqData];
      }
      state.cygnusImageInfo.isLoading = false;
    });
    builder.addCase(getCygnusOverlayImage.fulfilled, (state, action) => {
      state.cygnus.imageUrl = action.payload?.reqData.overlayed_image_url;

      if (action.payload?.reqObj.pid && !action.payload.error.isError) {
        // console.log("in", state.cygnus.cygnusImageData, {
        //   ...state.cygnus.cygnusImageData,
        // });
        state.cygnus.cygnusImageData = {
          ...state.cygnus.cygnusImageData,
          [action.payload.reqObj.pid]:
            action.payload?.reqData.overlayed_image_url,
        };
      } else if (action.payload?.error.isError) {
        state.cygnus.cygnusImageData = {
          ...state.cygnus.cygnusImageData,
          [action.payload.reqObj.pid]: "",
        };
      }
      state.cygnus.isLoading = false;
    });
    builder.addCase(getCygnusImage.fulfilled, (state, action) => {
      //   console.log(action.payload);
      if (action.payload.error) {
        state.cygnus.isError = true;
        state.cygnus.errorMessage = action.payload.data.message;
      } else {
        state.cygnus.cygnusId = action.payload.data.id;
        state.cygnus.cygnusIdLoaded = true;
        state.cygnus.imageUrl = action.payload.data.image_url;
      }
      state.cygnus.isLoading = false;
    });
    builder.addCase(getDittoProfiles.fulfilled, (state, action) => {
      state.dittoProfiles.isLoading = false;
      state.dittoProfiles.isdittoProfile = true;
      state.dittoProfiles.dittoProfileData = action.payload;
    });
    builder.addCase(getDittoProfiles.rejected, (state, action) => {
      state.dittoProfiles = initialState.dittoProfiles;
    });
    builder.addCase(getDittoProfilesAuth.fulfilled, (state, action) => {
      state.getetDittoProfilesAuthData = action?.payload;
    });
    // builder.addCase(getDittoProfileImage.fulfilled, (state, action) => {
    // console.log(action.payload);
    // state.setDittoImage = { ...state.setDittoImage, ...action.payload };
    // state.dittoImageLoading = false;
    // state.isImageLoaded = true;
    // });
    // builder.addCase(getDittoImage.rejected, (state) => {
    //   state.dittoImageLoading = false;
    //   state.isImageLoaded = false;
    // });
  },
});

export const {
  setDittoImage,
  setDittoImageLoading,
  setIsImageLoaded,
  setDittoProfileLoader,
  setDittoThumbnailLoading,
  setDittoThumbnailImage,
  setDittoSignatures,
  setTryOnActive,
  setgetDittoProfilesAuthLoading,
  setDittoIdLoading,
  setCygnusIdLoading,
  resetcygnus,
  resetFrameSize,
  setFrameSizeCalLoading,
  resetCygnusIdLoad,
  resetCygnusImages,
  setNonCygnusImageInfo,
  updateCygnusImageLoading,
} = dittoSlice.actions;

export default dittoSlice.reducer;
