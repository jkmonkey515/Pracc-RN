import React from "react";
import { View, StyleSheet } from "react-native";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { Avatar, Text } from "react-native-paper";
import { useContext } from "react";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/match";
import { PraccAppState } from "../../../reducers";


const AVATAR_SIZE = 20;

const EventItem = ({ event }: { event: any }) => {
  const { theme, isDarkTheme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const { Settings } = useSelector((state: PraccAppState) => state.profile);
  const renderStatus = (event: any) => {
    if (event.isCancelled) {
      return (
        <Text style={[styles.status, styles.cancelledStatus]}>CANCELLED</Text>
      );
    }
    if (event.isPast && !event.isEvent) {
      return <Text style={styles.status}>PAST</Text>;
    }
    return null;
  };

  return (
    <View style={styles.eventItemContainer}>
      <View style={styles.row}>
        {event.avatar && (
          <Avatar.Image size={AVATAR_SIZE} source={{ uri: event.avatar }} />
        )}
        <Text
          style={[styles.title, event.textColor && { color: event.textColor }]}
        >
          {event.title}
        </Text>
      </View>
      <View style={event.avatar && { marginLeft: 25 }}>
        <Text style={[styles.summary, isDarkTheme && { color: 'white' }]}>{event.summary}</Text>
        {event.map && <Text style={[styles.map, isDarkTheme && { color: 'white' }]}>{event.map}</Text>}
        <Text style={styles.time}>
          {moment(event.start).format(Settings.TimeFormatString)} -{" "}
          {moment(event.end).format(Settings.TimeFormatString)}
        </Text>
        <View style={{ marginTop: 5 }}>{renderStatus(event)}</View>
      </View>
    </View>
  );
}

export default EventItem;
