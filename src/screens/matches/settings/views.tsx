import React from "react";
import { View, ScrollView } from "react-native";
import { Checkbox, List, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { calendarViewTypes } from "../../../const/settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CHANGE_CALENDAR_VIEW } from "../reducers";
import { useContext } from "react";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/match";
import { PraccAppState } from "../../../reducers";

const CalendarViewSetting = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();

  const { viewType } = useSelector((state: PraccAppState) => state.screens.matches);

  const ItemLabel = ({ item }: { item: any }) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <MaterialCommunityIcons
          name={item.icon}
          size={18}
          color={styles.listItemText.color}
        />
        <Text style={styles.listItemText}>{item.label}</Text>
      </View>
    );
  };
  const changeView = (vt: string) => {
    dispatch({
      type: CHANGE_CALENDAR_VIEW,
      payload: vt,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <ScrollView style={[styles.bodyScroll, styles.paddedBodyScroll]}>
          <List.Section>
            {calendarViewTypes.map((item) => {
              return (
                <List.Item
                  style={[styles.listItem, styles.listItemLarge]}
                  key={item.type}
                  title={<ItemLabel item={item} />}
                  onPress={() => changeView(item.type)}
                  right={() => (
                    <Checkbox
                      status={viewType === item.type ? "checked" : "unchecked"}
                      color={styles.btnChecked.borderColor}
                    />
                  )}
                />
              );
            })}
          </List.Section>
        </ScrollView>
      </View>
    </View>
  );
}

export default CalendarViewSetting;