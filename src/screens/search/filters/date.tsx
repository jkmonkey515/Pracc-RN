import { View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useMemo, useState } from "react";
import { updateFilter } from "../../../actions";
import { List, Switch, Text } from "react-native-paper";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment-timezone";
import { SERVER_TIMEZONE } from "../../../const/timezone";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { PraccAppState } from "../../../reducers";

const Search_Date = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { filter, profile } = useSelector((state: PraccAppState) => state);

  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);

  const timezone = profile?.Settings.LocalTimezone;
  const timeFormat = profile?.Settings.TimeFormatString;

  const date = useMemo(() => {
    if (!filter.DateTime.Start) {
      return "";
    }
    return moment(filter.DateTime.Start).tz(timezone ?? "").format("YYYY-MM-DD");
  }, [filter]);

  const time = useMemo(() => {
    if (
      !filter.DateTime.StartTime ||
      filter.DateTime.Start !== filter.DateTime.End
    ) {
      return "";
    }
    return moment(filter.DateTime.Start).tz(timezone ?? "").format(timeFormat);
  }, [filter]);

  const initialDate = filter.DateTime.Start
    ? moment(filter.DateTime.Start).tz(timezone ?? "").toDate()
    : moment.tz(timezone ?? "").toDate();

  const updateDatetime = (selectedDate: string, selectedTime: string) => {
    const timezone = profile?.Settings.LocalTimezone;

    if (selectedDate === "") {
      
        updateFilter({
          DateTime: {
            ...filter.DateTime,
            Start: "",
            End: "",
            StartTime: null,
            EndTime: null,
          },
        })(dispatch);

      return;
    }

    const secondOffsetDate = moment()
      .tz(SERVER_TIMEZONE)
      .minutes(0)
      .seconds(0)
      .tz(timezone ?? "");

    let start = moment
      .tz(selectedDate, timezone ?? "")
      .hour(0)
      .minutes(secondOffsetDate.minutes())
      .seconds(secondOffsetDate.seconds());
    let end = start.clone().add(1, "days");

    if (selectedTime !== "") {
      const [hour, minute] = selectedTime.split(":", 2);
      start = start.hour(parseInt(hour)).minute(parseInt(minute));
      end = start;
    }

    updateFilter({
      DateTime: {
        ...filter.DateTime,
        Start: start.format(),
        StartTime: start.format(),
        End: end.format(),
        EndTime: end.format(),
      },
    })(dispatch);
  };

  const onDatePickerConfirm = (date: Date) => {
    setShowDateSelector(false);
    const selectedDate = moment(date, "UTC")
      .tz(profile?.Settings.LocalTimezone ?? "")
      .format("YYYY-MM-DD");
    updateDatetime(selectedDate, time);
  };

  const onTimePickerConfirm = (date: Date) => {
    setShowTimeSelector(false);
    const userDate = moment(date, "UTC")
      .tz(profile?.Settings.LocalTimezone ?? "")
      .format(timeFormat);
    updateDatetime(date.toISOString(), userDate);
  };

  const dateDescriptionSummary = (date: string) => {
    if (!filter.DateTime.StartTime) {
      return <Text style={styles.listItemSmallText}>All Dates</Text>;
    }

    return <Text style={styles.listItemSmallText}>{date}</Text>;
  };

  const timeDescriptionSummary = (time: string) => {
    if (
      !filter.DateTime.StartTime ||
      filter.DateTime.Start !== filter.DateTime.End
    ) {
      return <Text style={styles.listItemSmallText}>All Times</Text>;
    }

    return <Text style={styles.listItemSmallText}>{time}</Text>;
  };

  const toggleMatchRequests = () => {
    updateFilter({
      DateTime: {
        ...filter.DateTime,
        MatchRequests: !filter.DateTime.MatchRequests,
      },
    })(dispatch)
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <ScrollView style={[styles.bodyScroll, styles.paddedBodyScroll]}>
          <List.Section>
            <List.Item
              style={[styles.listItem, styles.listItemLarge]}
              title="Match my requested dates & times"
              titleStyle={styles.listItemTitle}
              onPress={toggleMatchRequests}
              right={() => (
                <Switch
                  value={filter.DateTime.MatchRequests}
                  onValueChange={toggleMatchRequests}
                  color={styles.switchColor}
                  thumbColor={styles.switchThumbColor}
                />
              )}
            />

            {!filter.DateTime.MatchRequests && (
              <React.Fragment>
                <List.Item
                  style={[styles.listItem, styles.listItemLarge]}
                  title={<Text style={styles.listItemText}>Date</Text>}
                  onPress={() => setShowDateSelector(true)}
                  right={(props) => (
                    <View style={styles.centered}>
                      {dateDescriptionSummary(date)}
                    </View>
                  )}
                />

                <List.Item
                  style={[styles.listItem, styles.listItemLarge]}
                  title={<Text style={styles.listItemText}>Time</Text>}
                  onPress={() => setShowTimeSelector(true)}
                  right={() => (
                    <View style={styles.centered}>
                      {timeDescriptionSummary(time)}
                    </View>
                  )}
                />
              </React.Fragment>
            )}
          </List.Section>
        </ScrollView>
      </View>

      <DateTimePicker
        isVisible={showDateSelector}
        mode="date"
        minimumDate={new Date()}
        date={initialDate}
        onConfirm={(date) => onDatePickerConfirm(date)}
        onCancel={() => {
          setShowDateSelector(false);
          updateDatetime("", time);
        }}
      />

      <DateTimePicker
        isVisible={showTimeSelector}
        mode="time"
        minuteInterval={15}
        date={initialDate}
        onConfirm={(date) => onTimePickerConfirm(date)}
        onCancel={() => {
          setShowTimeSelector(false);
          updateDatetime(date, "");
        }}
      />
    </View>
  );
}

export default Search_Date;