import React, { useContext, useEffect, useRef } from "react";
import { Text, View, Vibration } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from 'react-redux';
import * as actions from "./actions";
import { requestCameraPermission } from "../../actions";
import { loginViaBarCode } from "../login/actions";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/auth";
import { PraccAppState } from "../../reducers";
import { useNavigation } from '@react-navigation/native';
import { processBarcode, resetBarCodeStatus } from "./actions";

const ScanQrCodeScreen = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { statusText, barCodeFound } = useSelector((state: PraccAppState) => state.screens.scanQrCode);
  const hasCameraPermission = useSelector((state: PraccAppState) => state.hasCameraPermission);
  const resetBarCodeTimer = useRef(0);
  const lastScannedBarCode = useRef<string | null>(null);

  useEffect(() => {
    requestCameraPermission()(dispatch);

    return () => {
      clearTimeout(resetBarCodeTimer.current);
    }
  }, []);

  const onBarCodeScanned = (barCode: string) => {
    if (lastScannedBarCode.current === barCode) {
      return;
    }
    lastScannedBarCode.current = barCode;

    if (!barCodeFound) {
      Vibration.vibrate(500);

      resetBarCodeTimer.current = setTimeout(() => {
        resetBarCodeStatus()(dispatch);
        lastScannedBarCode.current = null;
      }, 2000);
    }

    processBarcode(barCode)(dispatch);

    if (actions.isValidBarcode(barCode)) {
      navigation.navigate("AuthLoading");
      loginViaBarCode(barCode)(dispatch);
    }
  }

  if (hasCameraPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Accessing camera...</Text>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera, check your security settings.</Text>
      </View>
    );
  } else {
    return (
      <View style={{ ...styles.container, flexDirection: "column" }}>
        <View
          style={{
            padding: 15,
            marginTop: 25,
            backgroundColor: "#ffffff",
            color: "#333333",
            width: "100%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Text style={{ fontSize: 18 }}>
            Scan the code on{" "}
            <Text style={{ fontWeight: "bold" }}>pracc.com/qr</Text>
          </Text>
        </View>
        <BarCodeScanner
          onBarCodeScanned={(e) => onBarCodeScanned(e.data)}
          style={{
            flexGrow: 1,
            width: "100%",
            flex: 1,
            flexDirection: "column-reverse",
          }}
        >
          <View
            style={{
              padding: 10,
              backgroundColor: "#ffffff",
              color: "#333333",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {statusText}
          </View>
        </BarCodeScanner>
      </View>
    );
  }
}

export default ScanQrCodeScreen;