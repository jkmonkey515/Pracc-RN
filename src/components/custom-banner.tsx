import { Text } from "react-native-paper";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export function CustomBanner({ visible, text, style } : { visible: boolean; text: string; style: any; }) {
  if (!visible) {
    return null;
  }
  return (
    <View
      style={{
        backgroundColor: style.backgroundColor,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Ionicons
        name="alert-circle-outline"
        size={20}
        color={style.color}
        style={{ alignSelf: "flex-start" }}
      />
      <Text style={{ color: style.color, marginLeft: 10 }}>{text}</Text>
    </View>
  );
}
