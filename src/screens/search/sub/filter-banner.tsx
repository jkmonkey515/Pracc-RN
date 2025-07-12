import React, { useContext, useEffect, useMemo, useState } from "react";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getRegionsForProfile } from "../../../const/regions";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import moment from "moment-timezone";
import { PraccAppState } from "../../../reducers";

const FilterBanner = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const navigation = useNavigation();

  const { profile, filter, games } = useSelector((state: PraccAppState) => state);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const hasMaps = useMemo(() => {
    const game = games.find((game) => game.Id === profile?.Team.GameID);
    if (game) {
      return game.Maps?.length > 0;
    }
    return false;
  }, [profile]);

  const regions = useMemo(() => {
    return profile ? getRegionsForProfile(profile, games) : [];
  }, [profile, games]);

  useEffect(() => {
    if (filter.DateTime.Start) {
      setDate(
        moment(filter.DateTime.Start)
          .tz(profile.Settings.LocalTimezone)
          .format("dddd Do")
      );
      if (filter.DateTime.Start === filter.DateTime.End) {
        setTime(
          moment(filter.DateTime.Start)
            .tz(profile.Settings.LocalTimezone)
            .format(profile.Settings.TimeFormatString)
        );
      }
    }
  }, [filter]);

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => navigation.navigate("SettingsGroup")}
      >
        <Text style={styles.filterOptionName}>Groups</Text>
        <Text style={styles.filterOptionValue}>
          {filter.Groups.All || filter.Groups.Selected.length === 0
            ? "All"
            : "Some"}
        </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => navigation.navigate("SettingsRegion")}
      >
        <Text style={styles.filterOptionName}>Region</Text>
        <Text style={styles.filterOptionValue}>
          {regions.find((region: any) => region.Id === filter.Region)?.Label}
        </Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => navigation.navigate("SearchDate")}
      >
        <Text style={styles.filterOptionName}>Date & Time</Text>
        <Text style={styles.filterOptionValue}>
          {filter.DateTime.MatchRequests
            ? "Mine"
            : filter.DateTime.Start == ""
            ? "All"
            : date}
        </Text>
        {!filter.DateTime.MatchRequests &&
          filter.DateTime.Start !== "" &&
          filter.DateTime.Start === filter.DateTime.End &&
          time && <Text style={styles.filterOptionValue}>{time}</Text>}
      </TouchableOpacity>
      {hasMaps && (
        <>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => navigation.navigate("SettingsMap")}
          >
            <Text style={styles.filterOptionName}>Maps</Text>
            <Text style={styles.filterOptionValue}>
              {filter.Maps.All ? "All" : "Some"}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.separator} />
      {/* <TouchableOpacity
        style={[styles.filterItem, styles.noBorder]}
        onPress={() => navigation.navigate("SettingsTypes")}
      >
        <Text style={styles.filterOptionName}>Types</Text>
        <Text style={styles.filterOptionValue}>
          {!(
            filter.Matches.Enabled &&
            filter.Requests.Enabled &&
            filter.Offers.Enabled
          )
            ? "Some"
            : "All"}
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={[styles.filterItem, styles.noBorder]}
        onPress={() => navigation.navigate("SettingsTeams")}
      >
        <Text style={styles.filterOptionName}>Teams</Text>
        <Text style={styles.filterOptionValue}>
          {!filter.Verified.Enabled && !filter.Favorites.Enabled
            ? "All"
            : "Some"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default FilterBanner;