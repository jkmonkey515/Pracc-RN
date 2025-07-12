import React from "react";
import { View, RefreshControl, TouchableOpacity, FlatList } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useContext, useEffect, useState } from "react";
import { resolveAvatar } from "../../utils/avatar";
import { fetchNotifications, updateNotification, getOffer } from "./actions";
import moment from "moment-timezone";
import { DECREASE_NEW_NOTIFCATIONS_ON_PROFILE, PraccAppState } from "../../reducers";
import { useNavigation } from "@react-navigation/native";
import { selectTeam } from "../../actions";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/notification";
import { NotificationType } from "@/src/types";

const NotificationsIndex = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const [isFetching, setIsFetching] = useState(true);
  const { notifications } = useSelector((state: PraccAppState) => state.screens.notifications);
  const profile = useSelector((state: PraccAppState) => state.profile);
  const { NewNotifications, Settings, Team } = profile;

  const getNotifications = useCallback(() => {
    fetchNotifications()(dispatch);
    setIsFetching(false);
  }, [dispatch]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const handleRefresh = useCallback(() => {
    setIsFetching(true);
    getNotifications();
  }, [getNotifications]);

  const renderNotificationItem = (item: NotificationType, index: number) => {
    const isUnRead = index < NewNotifications;

    const handlePress = async () => {
      updateNotification()(dispatch);
      dispatch({
        type: DECREASE_NEW_NOTIFCATIONS_ON_PROFILE,
      });

      // check if the Team ID is same
      if (Team.ID !== item.TeamID) {
        selectTeam(item.TeamID)(dispatch);
      }

      // if MatchID exists
      if (item.MatchID) {
        navigation.navigate("Matches", {
          screen: "CalendarDetails",
          params: { matchId: item.MatchID },
        });
      } else {
        // if OfferID exists
        if (item.OfferID) {
          const offer = await getOffer(item.OfferID);

          // if the offer has Match
          if (offer.Match) {
            navigation.navigate("Matches", {
              screen: "CalendarDetails",
              params: { matchId: offer.Match.ID },
            });
          } else {
            navigation.navigate("Search", {
              screen: "SearchOffer",
              params: { offerId: item.OfferID },
            });
          }
        }
      }
    };

    return (
      <TouchableOpacity
        key={index}
        style={styles.itemWrapper}
        onPress={handlePress}
      >
        <Avatar.Image
          size={30}
          source={{ uri: resolveAvatar(item.AvatarUrl) }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.heading}>
            <Text style={styles.whatText}>{`${item.What} by ${item.Who}`}</Text>
            <Text style={styles.timeText}>
              {moment(item.CreatedAt).tz(Settings.LocalTimezone).fromNow()}
            </Text>
          </View>
          <View style={styles.heading}>
            {isUnRead && <View style={styles.status}></View>}
          </View>
          <Text style={styles.descriptionText}>
            {item.MatchTime
              ? moment(item.MatchTime)
                  .tz(Settings.LocalTimezone)
                  .format(`MMMM Do YYYY, ${Settings.TimeFormatString} zz`)
              : moment(item.CreatedAt)
                  .tz(Settings.LocalTimezone)
                  .format(`MMMM Do YYYY, ${Settings.TimeFormatString} zz`)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={styles.listWrapper}>
          <FlatList
            data={notifications}
            renderItem={({ item, index }) =>
              renderNotificationItem(item, index)
            }
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={handleRefresh}
                title="Loading"
                colors={[styles.refreshColors]}
                tintColor={styles.refreshTintColor}
                titleColor={styles.refreshTitleColor}
              />
            }
          />
        </View>
      </View>
    </View>
  );
}

export default NotificationsIndex;