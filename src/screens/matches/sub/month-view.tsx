import { Text, View, FlatList, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import { CalendarList } from "react-native-calendars";
import { List } from "react-native-paper";
import { CalendarTheme } from "../../../themes";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/match";

const CalendarMonthView = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const calendarTheme = CalendarTheme(theme);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshMatches = () => {
    console.log("... refreshing");
  };
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <FlatList
          style={styles.bodyScroll}
          data={[{ key: "calendarList" }]}
          refreshing={isRefreshing}
          onRefresh={() => refreshMatches}
          renderItem={({ item }) => (
            <CalendarList
              testID="calendarList"
              current={new Date()}
              pagingEnabled={true}
              horizontal={true}
              showScrollIndicator={false}
              onDayPress={(day) => {
                console.log("onDayPress:", day);
              }}
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
            <Text style={styles.todayViewTxt}>Days with Matches</Text>
          </View>
        </View>
        <View style={styles.currentMatchesBox}>
          <View style={styles.agendaTextWrap}>
            <Text style={styles.agendaText}>Matches:</Text>
          </View>
          <ScrollView>
            <List.Item
              title="First Item"
              description="Item Description"
              left={() => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Text>11:00 AM</Text>
                  <View
                    style={[styles.eventColor, { backgroundColor: "red" }]}
                  />
                </View>
              )}
            ></List.Item>
            <List.Item
              title="First Item"
              description="Item Description"
              left={() => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Text>11:00 AM</Text>
                  <View
                    style={[styles.eventColor, { backgroundColor: "blue" }]}
                  />
                </View>
              )}
            ></List.Item>
            <List.Item
              title="First Item"
              description="Item Description"
              left={() => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Text>11:00 AM</Text>
                  <View
                    style={[styles.eventColor, { backgroundColor: "green" }]}
                  />
                </View>
              )}
            ></List.Item>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export default CalendarMonthView;
