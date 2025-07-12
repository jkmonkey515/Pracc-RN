import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/login";
import ScanQrCodeScreen from "../screens/scan-qr-code";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ScanQrCode" component={ScanQrCodeScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;
