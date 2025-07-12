import * as SecureStore from "expo-secure-store";
import uuid from "react-native-uuid";

export async function getDeviceId() {
  let deviceId = uuid.v4();

  let fetchDeviceId = await SecureStore.getItemAsync("secure_device_id");

  //if user has already signed up prior
  if (fetchDeviceId) {
    deviceId = fetchDeviceId;
  }
  await SecureStore.setItemAsync("secure_device_id", deviceId as string);
  return deviceId;
}

export async function getThemeInfo() {
  let themeInfo = await SecureStore.getItemAsync("secure_theme_info");
  if (themeInfo) {
    return themeInfo;
  }
  await SecureStore.setItemAsync("secure_theme_info", "light");
  return "light";
}

export async function setThemeInfo() {
  let themeInfo = await SecureStore.getItemAsync("secure_theme_info");
  if (themeInfo === "light") {
    await SecureStore.setItemAsync("secure_theme_info", "dark");
  } else {
    await SecureStore.setItemAsync("secure_theme_info", "light");
  }
}
