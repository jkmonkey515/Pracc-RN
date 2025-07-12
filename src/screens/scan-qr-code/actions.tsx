import {Text} from "react-native";
import React from "react";
import {SET_BARCODE_STATUS, SET_STATUS_TEXT} from "./reducers";

export const isValidBarcode = (barCode: string) => {
    return barCode.indexOf('pracc-mobile-auth:') === 0;
}

export const processBarcode = (barCode: string) => {
    return async (dispatch: any) => {
        if ( ! isValidBarcode(barCode)) {
            dispatch({
                type: SET_STATUS_TEXT,
                text: (<Text style={{color: '#c70000'}}>
                    Please scan the code from pracc.com/qr
                </Text>)
            })
        } else {
            dispatch({
                type: SET_STATUS_TEXT,
                text: <Text>Bar code found, logging in...</Text>,
            })
            dispatch({
                type: SET_BARCODE_STATUS,
                status: true,
            })
        }
    }
}

export const resetBarCodeStatus = () => {
    return (dispatch: any) => {
        dispatch({
            type: SET_BARCODE_STATUS,
            status: false,
        })
    }
}
