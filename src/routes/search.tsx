import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchIndexScreen from "../screens/search";
import Search_Offer from "../screens/search/offer";
import Search_Date from "../screens/search/filters/date";
import Settings_Groups from "../screens/search/filters/groups";
import Settings_Regions from "../screens/search/filters/regions";
import Settings_Maps from "../screens/search/filters/maps";
import Settings_Types from "../screens/search/filters/types";
import Settings_Teams from "../screens/search/filters/teams";
import RequestsIndexScreen from "../screens/requests/index";
import Request_Detail from "../screens/requests/details";
import { defaultStackOptions } from "../themes";
import ThemeProvider from "../components/theme-provider";

const Stack = createNativeStackNavigator();

function SearchStack() {
  const { theme } = useContext(ThemeProvider);
  const options = defaultStackOptions(theme);

  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="SearchIndex" component={SearchIndexScreen} />
      <Stack.Screen name="SearchOffer" component={Search_Offer} />
      <Stack.Screen
        name="SearchDate"
        component={Search_Date}
        options={{ title: "Date & Time" }}
      />
      <Stack.Screen
        name="SettingsGroup"
        component={Settings_Groups}
        options={{ title: "Groups" }}
      />
      <Stack.Screen
        name="SettingsRegion"
        component={Settings_Regions}
        options={{ title: "Regions" }}
      />
      <Stack.Screen
        name="SettingsMap"
        component={Settings_Maps}
        options={{ title: "Maps" }}
      />
      <Stack.Screen
        name="SettingsTypes"
        component={Settings_Types}
        options={{ title: "Types" }}
      />
      <Stack.Screen
        name="SettingsTeams"
        component={Settings_Teams}
        options={{ title: "Teams" }}
      />
      <Stack.Screen
        name="RequestsIndex"
        component={RequestsIndexScreen}
        options={{ title: "Requests" }}
      />
      <Stack.Screen name="RequestDetails" component={Request_Detail} />
    </Stack.Navigator>
  );
}

export default SearchStack;
