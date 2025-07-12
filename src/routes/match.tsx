import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarIndexScreen from "../screens/matches";
import CalendarDetailsScreen from "../screens/matches/details";
import CalendarEventAddScreen from "../screens/matches/event";
import CalendarViewSettingScreen from "../screens/matches/settings/views";
import CalendarOptionSettingScreen from "../screens/matches/settings/options";
import { defaultStackOptions } from "../themes";
import ThemeProvider from "../components/theme-provider";

const Stack = createNativeStackNavigator();

function MatchStack() {
  const { theme } = useContext(ThemeProvider);
  const options = defaultStackOptions(theme);

  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="CalendarIndex"
        component={CalendarIndexScreen}
        options={{ title: "Matches" }}
      />
      <Stack.Screen
        name="CalendarViewSetting"
        component={CalendarViewSettingScreen}
        options={{ title: "Views" }}
      />
      <Stack.Screen
        name="CalendarOptionSetting"
        component={CalendarOptionSettingScreen}
        options={{ title: "Options" }}
      />
      <Stack.Screen
        name="CalendarEventAddView"
        component={CalendarEventAddScreen}
        options={{ title: "Add External Event" }}
      />
      <Stack.Screen name="CalendarDetails" component={CalendarDetailsScreen} />
    </Stack.Navigator>
  );
}

export default MatchStack;
