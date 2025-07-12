import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotificationsIndex from "../screens/notifications";
import { defaultStackOptions } from "../themes";
import ThemeProvider from "../components/theme-provider";

const Stack = createNativeStackNavigator();

function NotificationStack() {
  const { theme } = useContext(ThemeProvider);
  const options = defaultStackOptions(theme);

  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="NotificationIndex"
        component={NotificationsIndex}
        options={{ title: "Notifications" }}
      />
    </Stack.Navigator>
  );
}

export default NotificationStack;
