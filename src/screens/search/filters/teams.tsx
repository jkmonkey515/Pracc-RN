import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext } from "react";
import { updateFilter } from "../../../actions";
import { Checkbox, List, Text } from "react-native-paper";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { PraccAppState } from "../../../reducers";

const Settings_Teams = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { filter } = useSelector((state: PraccAppState) => state);
  const types = [
    { key: "Verified", value: "Only Supporter" },
    { key: "Favorites", value: "Only Favorites" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <ScrollView style={[styles.bodyScroll, styles.paddedBodyScroll]}>
          <List.Section>
            {types.map((type, index) => {
              return (
                <List.Item
                  style={[styles.listItem, styles.listItemLarge]}
                  key={index}
                  title={<Text style={styles.listItemText}>{type.value}</Text>}
                  onPress={() => {
                    updateFilter({
                      [type.key]: {
                        ...filter[type.key],
                        Enabled: !filter[type.key].Enabled,
                      },
                    })(dispatch)
                  }}
                  right={() => (
                    <Checkbox
                      status={
                        filter[type.key].Enabled ? "checked" : "unchecked"
                      }
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

export default Settings_Teams;