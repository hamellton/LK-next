import { DataType } from "@/types/coreTypes";
import { deleteCookie, getCookie, setCookie } from "@/helpers/defaultHeaders";

export const temporaryStoreAddressData = {
    delete(country: string) {
        deleteCookie(`tempStoreCheckoutAddressData_${country}`);
    },
    add(data: DataType, sessionId: string, country: string) {
        // console.log(data, "user provided data");
        const newData = {
            firstName: data?.firstName || "" || "",
            lastName: data?.lastName || "",
            mobile: data?.mobile || "",
            email: data?.email || "",
            addressLine1: data?.addressLine1 || "",
            addressLine2: data?.addressLine2 || "",
            zipCode: data?.zipCode || "",
            cityDistrict: data?.cityDistrict || "",
            state: data?.state || "",
            country: data?.country || "",
            addressLabel: data?.addressLabel || "",
            landmark: data?.landmark || "",
            phoneCode: data?.phoneCode || "",
            gender: data?.gender,
        };
        const oldData = temporaryStoreAddressData.get(sessionId, country);
        // console.log("Adding data", newData, oldData);
        if (
            !oldData ||
            (newData && temporaryStoreAddressData.isChangedV2(newData, oldData))
        ) {
            // console.log("Inside if for add address");
            const date = new Date();
            date.setTime(date.getTime() + 5 * 60 * 1000); // here cookie duration = 5 mins
            setCookie(
                `tempStoreCheckoutAddressData_${country}`,
                JSON.stringify({
                    data: { ...oldData, ...newData },
                    sessionId: sessionId,
                }),
                { expires: date }
            );
        }
    },
    get(sessionId: string, country: string) {
        const cookieData = JSON.parse(
            getCookie(`tempStoreCheckoutAddressData_${country}`)?.toString() || "{}"
        );
        let addressData;
        if (cookieData && typeof cookieData === "object") {
            const finalData = cookieData;
            // if(finalData.guestEmail === userInfo.guestEmail && finalData.guestNumber === userInfo.guestNumber) {
            if (finalData.sessionId === sessionId && finalData.data) {
                // console.log("Final condition matching");
                addressData = finalData.data;
            }
        }
        // console.log(addressData, cookieData, "getTempAddress");
        return !addressData
            ? null
            : {
                firstName: addressData?.firstName || "" || "",
                lastName: addressData?.lastName || "",
                mobile: addressData?.mobile || "",
                email: addressData?.email || "",
                addressLine1: addressData?.addressLine1 || "",
                addressLine2: addressData?.addressLine2 || "",
                zipCode: addressData?.zipCode || "",
                cityDistrict: addressData?.cityDistrict || "",
                state: addressData?.state || "",
                country: addressData?.country || "",
                addressLabel: addressData?.addressLabel || "",
                landmark: addressData?.landmark || "",
                phoneCode: addressData?.phoneCode || "",
                gender: addressData?.gender || "",
            };
    },
    isChanged(newData: DataType, oldData: DataType) {
        Object.keys(newData).map((d) => {
            if (!(d in oldData) || oldData[d] !== newData[d]) return true;
        });
        return false;
    },
    isChangedV2(newData: DataType, oldData: DataType) {
        const keys = Object.keys(newData).filter(
            (d) => newData[d] !== oldData[d]
        );
        return keys.length ? true : false;
    },
};