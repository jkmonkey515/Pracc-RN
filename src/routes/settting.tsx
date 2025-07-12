import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsIndexScreen from "../screens/settings";
import SettingsNotificationsScreen from "../screens/settings/notifications";
import { defaultStackOptions } from "../themes";
import ThemeProvider from "../components/theme-provider";

const Stack = createNativeStackNavigator();

function SettingStack() {
  const { theme } = useContext(ThemeProvider);
  const options = defaultStackOptions(theme);

  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="SettingsIndex"
        component={SettingsIndexScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="SettingsNotifications"
        component={SettingsNotificationsScreen}
        options={{ title: "Notification Settings" }}
      />
    </Stack.Navigator>
  );
}

export default SettingStack;
