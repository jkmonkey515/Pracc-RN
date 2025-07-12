import React, { useContext } from "react";
import { ScrollView, View } from "react-native";
import { Checkbox, List, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { updateFilter } from "../../../actions";
import { PraccAppState } from "../../../reducers";
import { GroupType } from "../../../types";

const SettingsGroups = () => {
  const dispatch = useDispatch();
  const { filter, profile } = useSelector((state: PraccAppState) => state);
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);

  const toggleSelectedGroup = (groupId: number) => {
    const newSelectedGroups = [...filter.Groups.Selected];
    const index = newSelectedGroups.indexOf(groupId);

    if (index < 0) {
      newSelectedGroups.push(groupId);
    } else {
      newSelectedGroups.splice(index, 1);
    }

    const newFilter = {
      ...filter,
      Groups: {
        ...filter.Groups,
        All: profile?.Team.Groups.length === newSelectedGroups.length,
        Selected: newSelectedGroups,
      },
    };

    updateFilter(newFilter)(dispatch)
  };

  const renderGroupItem = (group: GroupType) => {
    const index = filter.Groups.Selected.indexOf(group.ID);
    const isChecked = index >= 0;

    return (
      <List.Item
        style={[styles.listItem, styles.listItemLarge]}
        key={group.ID}
        title={<Text style={styles.listItemText}>{group.Name}</Text>}
        onPress={() => toggleSelectedGroup(group.ID)}
        right={(props) => (
          <Checkbox
            {...props}
            status={isChecked ? "checked" : "unchecked"}
            color={styles.btnChecked.borderColor}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={[styles.centered, styles.hint]}>
          <Text style={styles.hintText}>
            If no group is selected, all are searched.
          </Text>
        </View>
        <ScrollView style={[styles.bodyScroll, styles.paddedBodyScroll]}>
          <List.Section>
            {profile?.Team.Groups.map(renderGroupItem)}
          </List.Section>
        </ScrollView>
      </View>
    </View>
  );
}

export default SettingsGroups;