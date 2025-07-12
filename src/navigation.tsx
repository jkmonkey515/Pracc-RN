import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AuthLoadingScreen from "./screens/auth-loading";
import { createAppStackContainer } from "./components/app-container";
import { useSelector } from "react-redux";
import ThemeProvider from "./components/theme-provider";
import AuthStack from "./routes/auth";
import SettingStack from "./routes/settting";
import NotificationStack from "./routes/notification";
import ChatStack from "./routes/chat";
import MatchStack from "./routes/match";
import SearchStack from "./routes/search";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { PraccAppState } from "./reducers";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function tabBarIcon(route: RouteProp<ParamListBase, string>, focused: boolean, color: string, size: number) {
  let iconName: string = "settings";
  switch (route.name) {
    case "Settings":
      iconName = focused ? "settings" : "settings-outline";
      break;
    case "Matches":
      iconName = focused ? "calendar" : "calendar-outline";
      break;
    case "Chats":
      iconName = focused ? "chatbubbles" : "chatbubbles-outline";
      break;
    case "Search":
      iconName = focused ? "search" : "search-outline";
      break;
    case "Notifications":
      iconName = focused ? "notifications" : "notifications-outline";
      break;
    default:
      break;
  }

  return <Ionicons name={iconName} size={size} color={color} />;
}

const AppStack = () => {
  const { NewNotifications, NewMessages } = useSelector(
    (state: PraccAppState) => state.profile
  );
  const { theme } = useContext(ThemeProvider);
  return (
    <Tab.Navigator
      initialRouteName="Settings"
      screenOptions={({ route }) => ({
        lazy: false,
        tabBarActiveTintColor: theme.colors.footer.activeText,
        tabBarInactiveTintColor: theme.colors.footer.inactiveText,
        style: {
          backgroundColor: theme.colors.footer.background,
        },
        tabBarStyle: { backgroundColor: theme.colors.footer.background },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) =>
          tabBarIcon(route, focused, color, size),
      })}
    >
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Matches" component={MatchStack} />
      <Tab.Screen
        name="Chats"
        component={ChatStack}
        options={NewMessages && { tabBarBadge: NewMessages }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationStack}
        options={NewNotifications && { tabBarBadge: NewNotifications }}
      />
      <Tab.Screen name="Settings" component={SettingStack} />
    </Tab.Navigator>
  );
}

export default function AppContainer() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="App" component={createAppStackContainer(AppStack)} />
    </Stack.Navigator>
  );
}
