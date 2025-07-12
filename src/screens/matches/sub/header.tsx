import React, { useCallback } from "react";
import { View } from "react-native";
import IconButton from "../../../components/icon-button";
import { setCurrentDate } from "../actions";
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export const HeaderLeftButtons = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handleTodayPress = useCallback(() =>
  setCurrentDate(new Date())(dispatch), []);

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <IconButton
        key="view-setting"
        name="menu"
        color="white"
        size={24}
        onPress={() => navigation.navigate("CalendarViewSetting")}
      />
      <IconButton
        key="today-setting"
        name="today"
        color="white"
        size={20}
        onPress={handleTodayPress}
      />
    </View>
  );
};

export const HeaderRightButtons = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <IconButton
        name="options"
        color="white"
        size={20}
        onPress={() => navigation.navigate("CalendarOptionSetting")}
      />
      <IconButton
        name="add-outline"
        color="white"
        size={24}
        onPress={() => navigation.navigate("CalendarEventAddView")}
      />
    </View>
  );
};
