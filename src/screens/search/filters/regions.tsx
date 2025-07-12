import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useMemo } from "react";
import { updateFilter } from "../../../actions";
import { getRegionsForProfile } from "../../../const/regions";
import { Checkbox, List, Text } from "react-native-paper";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { PraccAppState } from "../../../reducers";

const Settings_Regions = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { filter, profile, games } = useSelector((state: PraccAppState) => state);

  const regions = useMemo(() => {
    return profile ? getRegionsForProfile(profile, games) : [];
  }, [profile, games]);

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <ScrollView style={[styles.bodyScroll, styles.paddedBodyScroll]}>
          <List.Section>
            {regions.map((region) => {
              return (
                <List.Item
                  style={[styles.listItem, styles.listItemLarge]}
                  key={region.Id}
                  title={
                    <Text style={styles.listItemText}>{region.Label}</Text>
                  }
                  onPress={() => {
                      updateFilter({
                        Region: region.Id,
                      })(dispatch)
                  }}
                  right={(props) => {
                    return (
                      <Checkbox
                        status={
                          filter.Region === region.Id ? "checked" : "unchecked"
                        }
                        color={styles.btnChecked.borderColor}
                      />
                    );
                  }}
                />
              );
            })}
          </List.Section>
        </ScrollView>
      </View>
    </View>
  );
}

export default Settings_Regions;