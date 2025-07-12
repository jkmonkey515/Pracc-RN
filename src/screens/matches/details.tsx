import {
  Animated,
  Dimensions,
  EmitterSubscription,
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { connect, useDispatch, useSelector } from 'react-redux';
import { StackActions, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState, useRef } from "react";
import * as actions from "./actions";
import { bindActionCreators } from "redux";
import moment from "moment-timezone";
import * as backend from "../../utils/backend";
import { createWebsocket } from "../../utils/backend";
import {
  Avatar,
  Banner,
  Button,
  Dialog,
  Menu,
  Portal,
  Text,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import {
  displayErrorMessage,
  queueMessage,
} from "../../components/snackbar-container";
import { resolveAvatar } from "../../utils/avatar";
import { getTeamId } from "../../utils/profile";
import { GAME_ID_CSGO } from "../../const/games";
import LoadingContainer from "../../components/loading-container";
import { colors } from "../../styles/colors";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/match";
import { PraccAppState } from "../../reducers";
import WebsocketManager from "@/src/utils/websocket-manager";
import { MatchMessage } from "@/src/types";

interface DeleteMatchButtonProps {
  matchId: number;
}

const ConnectedDeleteButton = ({ matchId }: DeleteMatchButtonProps) => {
  const { theme, isDarkTheme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reasonMenuOpen, setReasonMenuOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const selectReason = (reason: string) => {
    setReason(reason);
    setReasonMenuOpen(false);
  }

  const reasonBtnText = () => {
    if (reason === "no_show") {
      return "Opponent no show";
    } else if (reason === "plan_changed") {
      return "Plans Changed";
    } else if (reason === "other") {
      return "Other reason";
    }

    return "Select Reason";
  }

  const handleCancel = async () => {
    setIsLoading(true);

    try {
      await backend.post("matches/delete", {
        body: JSON.stringify({
          ID: matchId,
          Reason: reason,
          Message: otherReason,
        }),
      });
      setIsLoading(false);
      setIsOpen(false);
      queueMessage("success", "The match was cancelled.")(dispatch);
      navigation.dispatch(
        StackActions.pop(1)
      );
    } catch (e) {
      setIsLoading(false);
      setIsOpen(false);
      displayErrorMessage(e)(dispatch);
    }
  }

  return (
    <React.Fragment>
      <Button
        onPress={() => setIsOpen(true)}
        compact
        style={[styles.centered, { marginRight: 5 }]}
      >
        <Text style={{ color: colors.header.textInactive }}>
          <Ionicons name="trash" size={25} color="white" />
        </Text>
      </Button>

      <Portal>
        <Dialog
          style={styles.modalContainer}
          visible={isOpen}
          onDismiss={() => setIsOpen(false)}
        >
          <Dialog.Title style={styles.modalTitle}>Cancel Match</Dialog.Title>
          <Dialog.Content>
            <Menu
              contentStyle={styles.menuContainer}
              visible={reasonMenuOpen}
              onDismiss={() => setReasonMenuOpen(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setReasonMenuOpen(true)}
                >
                  {reasonBtnText()} <Ionicons name="arrow-down" />
                </Button>
              }
            >
              <Menu.Item
                onPress={() => selectReason("no_show")}
                title="Opponent did not show up"
                titleStyle={styles.menuItem}
              />
              <Menu.Item
                onPress={() => selectReason("plan_changed")}
                title="Our plans have changed"
                titleStyle={styles.menuItem}
              />
              <Menu.Item
                onPress={() => selectReason("other")}
                title="Other reason"
                titleStyle={styles.menuItem}
              />
            </Menu>

            {reason === "other" && (
              <View>
                <TextInput
                  style={styles.reasonTextInput}
                  mode="outlined"
                  label="Other reason"
                  placeholder="Your reason for cancelling"
                  placeholderTextColor={isDarkTheme && '#FFFFFF55'}
                  value={otherReason}
                  onChangeText={(otherReason) =>
                    setOtherReason(otherReason)
                  }
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              contentStyle={{
                color: styles.btnPrimary.color,
              }}
              onPress={() => setIsOpen(false)}
            >
              back
            </Button>
            <Button
              contentStyle={{
                backgroundColor: styles.btnPrimary.color,
              }}
              onPress={handleCancel}
              loading={isLoading}
              mode="contained"
            >
              Ok, cancel match
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </React.Fragment>
  );
}

const CalendarDetails = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const profile = useSelector((state: PraccAppState) => state.profile);
  const games = useSelector((state: PraccAppState) => state.games);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const websocketRef = useRef<WebsocketManager | null>(null);
  const subscriptionsRef = useRef<any[]>([]);
  const listenersRef = useRef<EmitterSubscription[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const height = useRef(new Animated.Value(0)).current;
  const bottom = useRef(new Animated.Value(0)).current;

  const updateNavigationOptions = () => {
    const match = route.params?.match;
    const matchId = route.params?.matchId;

    navigation.setOptions({
      title: "Match Details",
      headerRight: () => (
        <ConnectedDeleteButton
          matchId={matchId || match.ID}
        />
      ),
    });
  }

  const updateMatch = async () => {
    let match = route.params?.match;
    if (!match) {
      setIsInitialLoading(true);
      try {
        const res = await backend.get("matches/" + route.params?.matchId);
        match = res.data;
      } catch (e) {
        displayErrorMessage(e)(dispatch);
        return;
      } finally {
        setIsInitialLoading(false);
      }
    }

    if (!match || !profile) {
      return;
    }

    setMatch(match);
    try {
      const teamId = getTeamId(profile);
      if (teamId) {
        websocketRef.current = await createWebsocket(
          "match/" + match.ID + "?selectedTeamID=" + encodeURIComponent(teamId)
        );
  
        subscriptionsRef.current.push(
          websocketRef.current?.subscribe((data: MatchMessage[]) => {
            if (Array.isArray(data)) {
              setMessages((prev) => ([...prev, ...data]));
            } else {
              setMessages((prev) => ([...prev, data]));
            }
          }),
          websocketRef.current?.connectionStatus.subscribe((connected: boolean) => {
            setIsConnected(connected);
            if (connected) {
              setMessages([]);
            }
  
          })
        );
        websocketRef.current?.connect();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    updateNavigationOptions();
    if (Platform.OS === "android") {
      listenersRef.current.push(
        Keyboard.addListener("keyboardDidShow", (e) => {
          _keyboardDidShow(e);
        }),
        Keyboard.addListener("keyboardDidHide", () => _keyboardDidHide())
      )
    } else {
      listenersRef.current.push(
        Keyboard.addListener("keyboardWillShow", (e) => {
          _keyboardWillShow(e);
        }),
        Keyboard.addListener("keyboardWillHide", () => _keyboardWillHide())
      )
    }
  }, []);

  useEffect(() => {
    if (profile) {
      const teamId = getTeamId(profile);
      setTeamId(teamId);
    }
  }, [profile]);

  useEffect(() => {
    updateMatch();
  }, [route?.params?.matchId]);

  useEffect(() => {
    if (isFocused && profile) {
      if (teamId && teamId !== getTeamId(profile)) {
        navigation.dispatch(StackActions.popToTop());
      }
    }
  }, [isFocused, teamId, profile]);

  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current?.disconnect();
      }

      for (const sub of subscriptionsRef.current) {
        sub.unsubscribe();
      }
      for (const lis of listenersRef.current) {
        lis.remove();
      }
    }
  }, []);

  const _keyboardWillShow = (e: any) => {
    Animated.timing(bottom, {
      toValue: e.endCoordinates.height + 40,
      duration: 250,
      useNativeDriver: false,
    }).start();
    Animated.timing(height, {
      toValue: e.endCoordinates.height,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd();
    }, 250);
  }

  const _keyboardWillHide = () => {
    Animated.timing(bottom, {
      toValue: 70,
      duration: 250,
      useNativeDriver: false,
    }).start();
    Animated.timing(height, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd();
    }, 250);
  }

  const _keyboardDidShow = (e: any) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd();
    }, 0);
  }

  const _keyboardDidHide = () => {
    Animated.timing(bottom, {
      toValue: 70,
      duration: 0,
      useNativeDriver: false,
    }).start();
    Animated.timing(height, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd();
    }, 0);
  }

  const sendChatMessage = () => {
    if (!isConnected) {
      queueMessage("error", "You are currently not connected.")(dispatch);
      return;
    }

    if (messageText !== "") {
      websocketRef.current?.sendRaw(messageText);
      setMessageText("");
    }
  }

  const renderMyTeamsMessage = (item: any, index: number, m: number) => {
    return (
      <View
        style={[
          styles.messageContainer,
          {
            marginTop: m,
            left: Dimensions.get("window").width / 5,
          },
        ]}
        key={index}
      >
        <View style={styles.messageHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar.Image
              style={{ marginRight: 5 }}
              source={{ uri: resolveAvatar(item.AvatarURL) }}
              size={24}
            />
            <Text style={styles.personName}>{item.PersonaName}</Text>
          </View>
          <Text style={styles.textMessageDate}>
            {moment(item.Time)
              .tz(profile.Settings.LocalTimezone)
              .format(`${profile.Settings.TimeFormatString} zz`)}
          </Text>
        </View>
        <Text style={styles.messageContent}>{item.Message}</Text>
      </View>
    );
  }

  const renderOtherTeamsMessage = (item: any, index: number, m: number) => {
    return (
      <View style={[styles.messageContainer, { marginTop: m }]} key={index}>
        <View style={styles.messageHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar.Image
              source={{ uri: resolveAvatar(item.AvatarURL) }}
              style={{ marginRight: 5 }}
              size={24}
            />

            <Text style={styles.personName}>{item.PersonaName}</Text>
          </View>
          <Text style={[styles.textMessageDate, styles.listItemSmallText]}>
            {moment(item.Time)
              .tz(profile?.Settings.LocalTimezone)
              .format(`${profile?.Settings.TimeFormatString} zz`)}
          </Text>
        </View>
        <Text style={styles.messageContent}>{item.Message}</Text>
      </View>
    );
  }

  const renderMessages = (item: any, index: number, prev: any) => {
    let marginTop = 20;
    if (prev && item.TeamID === prev.TeamID) {
      marginTop = 5;
    }

    if (profile?.Team.ID !== item.TeamID) {
      return renderMyTeamsMessage(item, index, marginTop);
    } else {
      return renderOtherTeamsMessage(item, index, marginTop);
    }
  };

  const renderGameServer = (match: any) => {
    if (match.GameServer) {
      return (
        <View>
          <Text style={styles.matchInfoText}>
            IP: {match.GameServer.IP} - Password: {match.GameServer.Password}
          </Text>
        </View>
      );
    }

    return (
      <Text style={styles.matchInfoText}>
        No GameServer decided, use the chat below.
      </Text>
    );
  }

  const renderMatchInfo = (match: any) => {
    const game = games.find((game: any) => game.Id === profile?.Team.GameID);

    if (game && (game.Maps ?? []).length > 0) {
      return (
        <Text style={styles.matchInfoText}>
          {game.Maps?.find((map: any) => map.Id === match.Map)?.Name}
        </Text>
      );
    }

    return (
      <Text style={styles.matchInfoText}>
        {match.GamesCount} {match.GamesCount === 1 ? "Game" : "Games"}
      </Text>
    );
  }

  if (!match || !profile) {
    return <LoadingContainer loading={isInitialLoading} />;
  }

  const date = moment(match.Time).tz(profile.Settings.LocalTimezone);
  let otherTeam;
  if (profile.Team.ID === match.TeamHigher?.ID) {
    otherTeam = match.TeamLower;
  } else {
    otherTeam = match.TeamHigher;
  }

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={styles.matchInfo}>
            <View style={styles.vsDiv}>
              <View style={[styles.vsInfo, { flexDirection: "row" }]}>
                <Avatar.Image source={{ uri: otherTeam.Logo }} size={30} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.teamName}>{otherTeam.Name}</Text>
                  {renderMatchInfo(match)}
                </View>
              </View>
              <View style={[styles.vsInfo]}>
                <Text style={styles.listItemSmallText}>
                  {date.format("MMMM Do")}
                </Text>
                <Text style={styles.listItemSmallText}>
                  {date.format(`${profile.Settings.TimeFormatString} zz`)}
                </Text>
              </View>
            </View>
            {profile.Team.GameID === GAME_ID_CSGO && (
              <View style={[{ marginTop: 10 }, styles.centered]}>
                {renderGameServer(match)}
              </View>
            )}
          </View>
          {!isConnected && (
            <View style={{ padding: 10 }}>
              <Banner
                visible={true}
                style={styles.bannerContainer}
                image={({ size }) => (
                  <Ionicons name="alert" size={size} />
                )}
              >
                <Text style={styles.bannerContent}>
                  Connection to the chat server could not be established.
                  Please check if you have an Internet connection.
                </Text>
              </Banner>
            </View>
          )}
          <Animated.ScrollView
            style={[styles.chatHistory, { marginBottom: bottom }]}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
            ref={scrollViewRef}
          >
            {messages?.map((item, index) => {
              if (index !== 0) {
                return renderMessages(item, index, messages[index - 1]);
              } else {
                return renderMessages(item, index, null);
              }
            })}
          </Animated.ScrollView>
          <Animated.View style={[styles.sendDiv, { marginBottom: height }]}>
            <TextInput
              style={styles.textInput}
              placeholder="Write your message"
              placeholderTextColor="#626787"
              onChangeText={(messageText) => setMessageText(messageText)}
              value={messageText}
            />

            <Ionicons
              name="send"
              size={35}
              color={theme.colors.mark}
              onPress={() => sendChatMessage()}
            />

            {/* Allows to center the button on the remaining space */}
            <View />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

export default CalendarDetails;
