import { Text, View, FlatList } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import React, { useContext, useState, useEffect } from "react";
import { CalendarList } from "react-native-calendars";
import moment from "moment-timezone";
import * as backend from "../../utils/backend";
import { displayErrorMessage } from "../../components/snackbar-container";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/requests";
import { CalendarTheme } from "../../themes";
import { PraccAppState } from "../../reducers";
import { updateRequests } from "./actions";
import { useNavigation } from '@react-navigation/native';

const RequestsIndex = () => {
  const { theme } = useContext(ThemeProvider);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const profile = useSelector((state: PraccAppState) => state.profile);
  const { requestsByDate } = useSelector((state: PraccAppState) => state.screens.requests);
  const [isRefreshing, setIsRefresing] = useState(false);
  const styles = useStyles(theme);
  const calendarTheme = CalendarTheme(theme);

  const refreshRequests = async () => {
    if (profile) {
      try {
        setIsRefresing(true);
        const startDate = moment
          .tz(profile.Settings.LocalTimezone)
          .startOf("day");
  
        const res = await backend.get(
          "requests?startDate=" +
            encodeURIComponent(startDate.format()) +
            "&endDate=" +
            encodeURIComponent(startDate.add(1, "month").format())
        );
  
        const requestsByDate: { [key: string]: any[] } = {};
        for (const request of res.data.Requests) {
          const localTime = moment(request.Time).tz(
            profile.Settings.LocalTimezone
          );
          const dateStr = localTime.format("YYYY-MM-DD");
          if (!requestsByDate.hasOwnProperty(dateStr)) {
            requestsByDate[dateStr] = [];
          }
          requestsByDate[dateStr].push(request);
        }
  
        updateRequests(requestsByDate)(dispatch);
      } catch (e) {
        displayErrorMessage(e)(dispatch);
      } finally {
        setIsRefresing(false);
      }
    }
  }

  useEffect(() => {
    refreshRequests();
  }, []);

  if (!profile) {
    return null;
  }

  const today = moment.tz(profile.Settings.LocalTimezone);
  const nextMonth = today.clone().add(1, "month");

  const minDate = new Date();
  minDate.setFullYear(today.year(), today.month(), today.date());

  const maxDate = new Date();
  maxDate.setFullYear(nextMonth.year(), nextMonth.month(), nextMonth.date());

  const todayStr = today.format("YYYY-MM-DD");
  const markedDates = {
    [todayStr]: {
      selected: true,
    },
  };
  for (const dateStr of Object.keys(requestsByDate)) {
    markedDates[dateStr] = {
      marked: true,
      dotColor: theme.colors.spot,
      selected: dateStr === todayStr,
    };
  }

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <FlatList
          style={styles.bodyScroll}
          data={[{ key: "calendarList" }]}
          refreshing={isRefreshing}
          onRefresh={() => refreshRequests()}
          renderItem={({ item }) => (
            <CalendarList
              pastScrollRange={0}
              futureScrollRange={1}
              scrollEnabled={true}
              showScrollIndicator={false}
              minDate={minDate?.toISOString().split("T")[0]}
              maxDate={maxDate?.toISOString().split("T")[0]}
              onDayPress={(day) => {
                navigation.navigate("RequestDetails", {
                  day,
                });
              }}
              markedDates={markedDates}
              theme={calendarTheme}
            />
          )}
          keyExtractor={(item) => item.key}
        />
        <View style={styles.todayView}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 40,
            }}
          >
            <View style={styles.todayCircle}>
              <Text style={styles.todayTxt}>1</Text>
            </View>
            <Text style={styles.todayViewTxt}>Today</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.requestCircle} />
            <Text style={styles.todayViewTxt}>Days with Requests</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default RequestsIndex;
