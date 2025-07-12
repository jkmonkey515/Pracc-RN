import React from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Avatar, Text } from "react-native-paper";
import { resolveAvatar } from "../../utils/avatar";
import { useEffect, useState, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatContacts } from "./actions";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/chat";
import { CustomBanner } from "../../components/custom-banner";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LoadingContainer from "../../components/loading-container";
import { PraccAppState } from "../../reducers";

const ChatContacts = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(true);
  const { contacts } = useSelector((state: PraccAppState) => state.screens.chats);

  useFocusEffect(
    useCallback(() => {
      setIsFetching(true);
      getChatContacts();
    }, [])
  );

  const getChatContacts = useCallback(() => {
    fetchChatContacts()(dispatch);
    setIsFetching(false);
  }, []);

  useEffect(() => {
    getChatContacts();
  }, []);

  const handleRefresh = useCallback(() => {
    setIsFetching(true);
    getChatContacts();
  }, [getChatContacts]);

  const renderContact = (item: any, index: number) => {
    const OtherTeam = item.Teams[1];
    const handlePress = () => {
      navigation.navigate("Chats", {
        screen: "ChatRoom",
        params: {
          roomID: item.ID,
          numOfUnreadMessages: item.ActingUser.NumberOfUnreadMessages,
          onBack: () => navigation.navigate("Chats"),
        },
      });
    };
    if (!OtherTeam) return null;
    return (
      <TouchableOpacity
        key={index}
        style={styles.wrapper}
        onPress={handlePress}
      >
        <View style={styles.teamInfo}>
          <Avatar.Image
            size={30}
            source={{ uri: resolveAvatar(OtherTeam.Logo) }}
            style={styles.avatar}
          />
          <Text style={styles.teamNameText}>{OtherTeam.Name}</Text>
        </View>
        {item.ActingUser.NumberOfUnreadMessages > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.ActingUser.NumberOfUnreadMessages}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        {isFetching ? (
          <LoadingContainer loading={isFetching} />
        ) : (
          <ScrollView
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
          >
            {contacts.length <= 0 && (
              <View style={{ padding: 10 }}>
                <CustomBanner
                  visible={!isFetching && contacts.length <= 0}
                  style={styles.bannerContainer}
                  text="You do not have any open chats right now."
                />
              </View>
            )}
            <View style={{ marginTop: 5 }}>
              {contacts.map((contact: any, index: number) => renderContact(contact, index))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

export default ChatContacts;