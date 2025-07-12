import {ActivityIndicator, Text, View} from "react-native";
import React from "react";

export const SET_STATUS_TEXT = 'scanQrCode/SET_STATUS_TEXT';
export const SET_BARCODE_STATUS = 'scanQrCode/SET_BARCODE_STATUS';

const initialState = {
    statusText: <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="small"/>
        <Text style={{marginLeft: 5}}>Scanning...</Text>
    </View>,
    barCodeFound: false,
}

function reducer(state = initialState, action: any) {
    switch (action.type) {
        case SET_STATUS_TEXT:
            return {
                ...state,
                statusText: action.text,
            }

        case SET_BARCODE_STATUS:
            return {
                ...state,
                barCodeFound: action.status,
            }
    }

    return state
}

export default reducer
