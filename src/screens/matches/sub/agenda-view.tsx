import React, { useContext, useEffect, useMemo, useRef } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Subheading, Text } from "react-native-paper";
import moment from "moment-timezone";
import { getTeamId } from "../../../utils/profile";
import { useNavigation } from "@react-navigation/native";
import {
  fetchMatches,
  filterMatchesByMonth,
  groupMatchesByDate,
  makeMarkedDates,
  sortMatches,
} from "../actions";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/match";
import { CustomBanner } from "../../../components/custom-banner";
import { eventColors } from "../../../const/colors";
import MonthPicker from "./month-picker";
import { PraccAppState } from "../../../reducers";

function MatchItem({ item }: { item: any }) {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const navigation = useNavigation();
  const profile = useSelector((state: PraccAppState) => state.profile);
  const games = useSelector((state: PraccAppState) => state.games);
  const otherTeam =
    profile?.Team.ID === item.TeamHigher.ID ? item.TeamLower : item.TeamHigher;

  const renderMatchDetails = (item: any) => {
    const game = games.find((game) => game.Id === profile?.Team.GameID);

    if (game && game.Maps?.length > 0) {
      return (
        <Text style={styles.matchInfoText}>
          {game.Maps.find((map: any) => map.Id === item.Map)?.Name}
        </Text>
      );
    }

    return (
      <Text style={styles.matchInfoText}>
        {item.GamesCount} {item.GamesCount === 1 ? "Game" : "Games"}
      </Text>
    );
  };

  const renderStatus = (item: any) => {
    if (item.Cancelled)
      return (
        <Text style={{ fontSize: 10, color: theme.colors.spot }}>
          CANCELLED
        </Text>
      );
    if (new Date(item.Time) < new Date())
      return (
        <Text style={{ fontSize: 10, color: theme.colors.text.disabled }}>
          PAST
        </Text>
      );

    return null;
  };

  if (!profile) {
    return null;
  }

  return (
    <View style={styles.itemDiv} key={item.ID}>
      <Text style={styles.itemTimeLabel}>
        {moment(item.Time)
          .tz(profile.Settings.LocalTimezone)
          .format(`${profile.Settings.TimeFormatString} zz`)}
      </Text>
      <TouchableOpacity
        style={[styles.item, { marginRight: 6 }]}
        onPress={() => {
          navigation.navigate("Matches", {
            screen: "CalendarDetails",
            params: { match: item },
          });
        }}
      >
        <View style={styles.matchInfoDiv}>
          <Avatar.Image size={40} source={{ uri: otherTeam.Logo }} />
          <View style={styles.profile}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.name]}>{otherTeam.Name}</Text>
              {renderStatus(item)}
            </View>
            {renderMatchDetails(item)}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function EventItem({ item }: { item: any }) {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const profile = useSelector((state: PraccAppState) => state.profile);
  const navigation = useNavigation();

  if (!profile) {
    return null;
  }

  return (
    <View style={styles.itemDiv} key={item.ID}>
      <Text style={styles.itemTimeLabel}>
        {moment(item.Time)
          .tz(profile.Settings.LocalTimezone)
          .format(`${profile.Settings.TimeFormatString} zz`)}
      </Text>
      <TouchableOpacity
        style={[styles.item, { marginRight: 6 }]}
        onPress={() => {
          navigation.navigate("Matches", {
            screen: "CalendarEventAddView",
            params: { eventID: item.ID },
          });
        }}
      >
        <View style={styles.matchInfoDiv}>
          <View style={styles.profile}>
            <Text
              style={[
                styles.name,
                {
                  color: (eventColors ?? []).find((color) => color.label === item.Color)
                    .value,
                },
              ]}
            >
              {item.Title}
            </Text>
            <Text style={styles.matchInfoText}>{item.Description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const CalendarAgendaView = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const monthPickerRef = useRef(null);
  const profile = useSelector((state: PraccAppState) => state.profile);
  const { currentDate, options, matches, isFetching } = useSelector(
    (state: PraccAppState) => state.screens.matches
  );

  useEffect(() => {
    fetchMatches(options)(dispatch);
  }, [options]);

  useEffect(() => {
    if (profile && profile.Team.ID !== getTeamId(profile)) {
      fetchMatches(options)(dispatch);
    }
  }, [profile]);

  const matchesByDate = useMemo(() => {
    const filteredMatches = filterMatchesByMonth(
      matches,
      currentDate ? currentDate : new Date(),
      profile?.Settings
    );
    const sortedMatches = sortMatches(filteredMatches);
    const groupedMatches = groupMatchesByDate(
      sortedMatches,
      profile?.Settings.LocalTimezone
    );
    return groupedMatches;
  }, [matches, currentDate, profile]);

  const markedDates = useMemo(() => {
    const markedDates = makeMarkedDates(
      matches,
      profile?.Settings.LocalTimezone
    );
    return markedDates;
  }, [matches, profile]);

  const getLoadingTitle = (matchesByDate: string | any[]) =>
    matchesByDate.length <= 0 ? "Loading" : "Refreshing";

  const onResponderCapture = () => {
    monthPickerRef.current?.toggleMonthPickerVisibility();
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <MonthPicker markedDates={markedDates} ref={monthPickerRef} />
        <ScrollView
          style={[styles.bodyScroll, styles.paddedBodyScroll]}
          contentContainerStyle={styles.scrollContent}
          onTouchStart={onResponderCapture}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={async () => {
                if (!isFetching) {
                  fetchMatches(options)(dispatch);
                }
              }}
              title={getLoadingTitle(matchesByDate)}
              colors={[styles.refreshColors]}
              tintColor={styles.refreshTintColor}
              titleColor={styles.refreshTitleColor}
            />
          }
        >
          <CustomBanner
            visible={!isFetching && matchesByDate.length <= 0}
            style={styles.bannerContainer}
            text="You do not have any upcoming matches or external events for the
            selected date."
          />

          {matchesByDate.map((entry: any) => (
            <React.Fragment key={entry.FormattedDate}>
              <Subheading style={styles.subHeading}>
                {entry.FormattedDate}
              </Subheading>
              {entry.Matches.map((match: any, index: number) =>
                match.type === "event" ? (
                  <EventItem key={index} item={match} />
                ) : (
                  <MatchItem key={index} item={match} />
                )
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default CalendarAgendaView;