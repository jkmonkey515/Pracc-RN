
import React from "react";
import { View, ScrollView } from "react-native";
import { Checkbox, List, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { calendarOptions } from "../../../const/settings";
import { CHANGE_CALENDAR_OPTION } from "../reducers";
import { useContext } from "react";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/match";
import { PraccAppState } from "../../../reducers";

const CalendarViewSetting = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { options } = useSelector((state: PraccAppState) => state.screens.matches);
  const changeOption = (opt: string) => {
    dispatch({
      type: CHANGE_CALENDAR_OPTION,
      payload: opt,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <ScrollView style={[styles.bodyScroll, styles.paddedBodyScroll]}>
          <List.Section>
            {calendarOptions.map((item) => {
              return (
                <List.Item
                  style={[styles.listItem, styles.listItemLarge]}
                  key={item.type}
                  title={<Text style={styles.listItemText}>{item.label}</Text>}
                  onPress={() => changeOption(item.type)}
                  right={() => (
                    <Checkbox
                      status={options[item.type] ? "checked" : "unchecked"}
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