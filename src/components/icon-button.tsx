import { GestureResponderEvent, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface Props {
  name: string;
  color: string;
  size: number;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}

export default function IconButton({ name, color, size, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name={name} color={color} size={size} />
    </TouchableOpacity>
  );
}
