import { DataType } from "@/types/coreTypes";
import sessionStorageHelper from "helpers/sessionStorageHelper";

interface ReturnProductType {
    returnReasons: {
        type: string,
        primaryReasonId: number,
        secondaryReasonId: number,
        additionalComments?: string
    },
    returnProductId: string,
    refundMethod: string,
    returnAction: string,
    returnMode: string
}
interface PayloadDataType {
    items?: {
        id: string,
        reasons: {
            type: string,
            primaryReasonId?: number,
            secondaryReasonId?: number,
            additionalComments?: string,
        }[],
    }[],
    returnMethod?: string,
    refundMethodRequest?: string,
    facilityCode?: string,
    pickupAddress?: DataType

}
export function createItemReturnData(userAddress: DataType) {
    const data: PayloadDataType = {};
    const returnProductDetails = sessionStorageHelper.getItem<ReturnProductType>('returnProduct');
    const storeAddressCode = sessionStorageHelper.getItem<{ selectedStore?: { code?: string } }>('returnStore')?.selectedStore?.code || '';
    const returnUserAddress = userAddress || sessionStorageHelper.getItem('returnUserAddress') || {};
    if (returnProductDetails && typeof returnProductDetails === "object" && Object.keys(returnProductDetails).length > 0) {
        const { returnReasons, returnProductId, refundMethod, returnAction, returnMode } =
            returnProductDetails;
        let primaryReasonId;
        let secondaryReasonId;
        let additionalComments;
        if (returnReasons) {
            primaryReasonId = returnReasons.primaryReasonId;
            secondaryReasonId = returnReasons.secondaryReasonId;
            additionalComments = returnReasons.additionalComments;
        }
        let refundMethodRequest = '';
        if (returnAction === 'refund' && refundMethod) refundMethodRequest = refundMethod;
        else if (returnAction === 'exchange') refundMethodRequest = 'exchange';
        data.items = [
            {
                id: returnProductId,
                reasons: [
                    {
                        type: 'RETURN',
                        primaryReasonId,
                        secondaryReasonId,
                        additionalComments,
                    },
                ],
            },
        ];
        data.returnMethod = returnMode;
        data.refundMethodRequest = refundMethodRequest;
        if (returnProductDetails.returnMode === 'store_return' && storeAddressCode) {
            data.facilityCode = storeAddressCode;
        } else if (returnProductDetails.returnMode === 'schedule_pickup') {
            data.pickupAddress = returnUserAddress;
        }
    }
    return data;
}