import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useMemo } from "react";
import { Checkbox, List, Text } from "react-native-paper";
import { updateFilter } from "../../../actions";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { PraccAppState } from "../../../reducers";
import { MapType } from "../../../types";

const Settings_Maps = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { profile, filter, games } = useSelector((state: PraccAppState) => state);

  const maps = useMemo(() => {
    if (games.length > 0) {
      const game = games.find((game) => game.Id === profile?.Team.GameID);
      if (game) {
        return game.Maps?.filter((m) => !m.Inactive) ?? [];
      }
      return [];
    }
    return [];
  }, [profile]);

  const renderMapItem = (map: MapType) => {
    const index = filter.Maps.Selected.indexOf(map.Id);

    return (
      <List.Item
        style={[styles.listItem, styles.listItemLarge]}
        key={map.Id}
        title={map.Name}
        titleStyle={styles.listItemText}
        onPress={() => {
          const newMaps: number[] = [...filter.Maps.Selected];
          if (index >= 0) {
            newMaps.splice(index, 1);
          } else {
            newMaps.push(map.Id);
          }

          updateFilter({
            Maps: {
              ...filter.Maps,
              All: newMaps.length <= 0,
              Selected: newMaps,
            },
          })(dispatch)
        }}
        right={(props) => (
          <Checkbox
            color={styles.btnChecked.borderColor}
            status={index >= 0 ? "checked" : "unchecked"}
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
            If no map is selected, all are searched.
          </Text>
        </View>
        <ScrollView style={[styles.bodyScroll, styles.paddedBodyScroll]}>
          <List.Section>{maps.map((map: any) => renderMapItem(map))}</List.Section>
        </ScrollView>
      </View>
    </View>
  );
}

export default Settings_Maps;