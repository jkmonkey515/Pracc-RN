import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatContactsScreen from "../screens/chats/contacts";
import ChatRoomScreen from "../screens/chats/room";
import { defaultStackOptions } from "../themes";
import ThemeProvider from "../components/theme-provider";

const Stack = createNativeStackNavigator();

function ChatStack() {
  const { theme } = useContext(ThemeProvider);
  const options = defaultStackOptions(theme);

  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="ChatContacts"
        component={ChatContactsScreen}
        options={{ title: "Chats" }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
}

export default ChatStack;
