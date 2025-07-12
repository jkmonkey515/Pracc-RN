import React, { useMemo, useEffect, useRef, useContext } from "react";
import { CalendarProvider, TimelineList, Timeline } from "react-native-calendars";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMatches,
  setCurrentDate,
  makeMarkedDates,
  standarizeEventArray,
} from "../actions";
import DayPicker from "./day-picker";
import { getTeamId } from "../../../utils/profile";
import EventItem from "./event-item";
import { useNavigation } from "@react-navigation/native";
import ThemeProvider from "../../../components/theme-provider";
import { CalendarTheme } from "../../../themes";
import { useStyles } from "../../../styles/match";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PraccAppState } from "../../../reducers";

const CalendarDayView = () => {
  const { theme, isDarkTheme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const calendarTheme = CalendarTheme(theme);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profile = useSelector((state: PraccAppState) => state.profile);
  const games = useSelector((state: PraccAppState) => state.games);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const { currentDate, options, matches } = useSelector(
    (state: PraccAppState) => state.screens.matches
  );
  const dayPickerRef = useRef(null);

  useEffect(() => {
    fetchMatches(options)(dispatch);
  }, [options]);

  useEffect(() => {
    if (profile && profile.Team.ID !== getTeamId(profile)) {
      fetchMatches(options)(dispatch);
    }
  }, [profile]);

  const events = useMemo(() => {
    return standarizeEventArray(matches, games, profile, isDarkTheme);
  }, [matches, profile]);

  const markedDates = useMemo(() => {
    const markedDates = makeMarkedDates(
      matches,
      profile?.Settings.LocalTimezone
    );
    return markedDates;
  }, [matches, profile]);

  const pressEvent = (event: any) => {
    if (event.isEvent) {
      navigation.navigate("Matches", {
        screen: "CalendarEventAddView",
        params: { eventID: event.id },
      });
    } else {
      navigation.navigate("Matches", {
        screen: "CalendarDetails",
        params: { match: event.match },
      });
    }
    return null;
  };

  const dayViewHeight = 50;

  const timelineProps = {
    theme: {
      ...calendarTheme,
      timelineContainer: {
        marginBottom: headerHeight + insets.top + insets.bottom + dayViewHeight,
      },
    },
    format24h: true,
    scrollToFirst: true,
    start: 0,
    end: 24,
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
    onEventPress: (event: any) => pressEvent(event),
  };

  const changeCurrentDate = (date: string) => {
    setCurrentDate(date)(dispatch);
  };

  const onResponderCapture = (event: any) => {
    if (event.nativeEvent.target !== event.nativeEvent.currentTarget) {
      dayPickerRef.current?.toggleCalendarVisibility();
    }
    return false;
  };  

  const _renderTimeline = (timelineProps, info) => {
    return (
      <Timeline {...timelineProps} renderEvent={(event) => <EventItem event={event} />}  />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <DayPicker markedDates={markedDates} ref={dayPickerRef} />
        <CalendarProvider date={currentDate} onDateChanged={changeCurrentDate}>
          <View onStartShouldSetResponderCapture={onResponderCapture}>
            <TimelineList
              events={events}
              timelineProps={timelineProps}
              showNowIndicator
              scrollToFirst
              renderItem={_renderTimeline}
            />
          </View>
        </CalendarProvider>
      </View>
    </View>
  );
}

export default CalendarDayView;