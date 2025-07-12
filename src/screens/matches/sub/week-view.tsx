import React, { useMemo, useState, useEffect, useContext } from "react";
import {
  CalendarProvider,
  TimelineList,
  WeekCalendar,
} from "react-native-calendars";
import { View } from "react-native";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/match";
import { PraccAppState } from "../../../reducers";

const CalendarWeekView = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const { matches } = useSelector((state: PraccAppState) => state.screens.matches);
  const [date, setDate] = useState(new Date());
  const [eventsByWeek, setEventsByWeek] = useState([]);
  useEffect(() => {
    const eventsByWeek = [];
    matches.forEach((event) => {
      const weekNumber = moment(event.start).isoWeek();
      if (!eventsByWeek[weekNumber]) {
        eventsByWeek[weekNumber] = [];
      }
      eventsByWeek[weekNumber].push(event);
    });
    setEventsByWeek(eventsByWeek);
  }, [matches]);

  const timelineProps = {
    format24h: true,
    scrollToFirst: true,
    start: 0,
    end: 24,
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
  };
  const changeDate = (d) => {
    setDate(d);
  };
  return (
    <View style={{ flex: 1 }}>
      <CalendarProvider weekStartsOn={1} date={date} onDateChanged={changeDate}>
        <WeekCalendar firstDay={1} />
        {eventsByWeek.map((weekEvents, index) => (
          <TimelineList
            key={index}
            events={weekEvents}
            timelineProps={timelineProps}
            showNowIndicator
            scrollToFirst
            // add any other TimelineList props as needed
          />
        ))}
      </CalendarProvider>
    </View>
  );
}

export default CalendarWeekView;