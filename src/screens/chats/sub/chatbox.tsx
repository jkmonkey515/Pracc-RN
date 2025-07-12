import {
  Animated,
  View,
  TextInput,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import { Avatar, Text, Banner } from "react-native-paper";
import { useState, useRef, useEffect, useContext, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { resolveAvatar } from "../../../utils/avatar";
import { queueMessage } from "../../../components/snackbar-container";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/chat";
import { PraccAppState } from "../../../reducers";
import React from "react";

interface Props {
  messages: any[];
  isConnected: boolean;
  sendMessage: (message: string) => void;
}

const ChatBox = ({ messages, isConnected, sendMessage }: Props) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { Settings } = useSelector((state: PraccAppState) => state.profile);
  const { room } = useSelector((state: PraccAppState) => state.screens.chats);
  const [height, setHeight] = useState(new Animated.Value(0));
  const [bottom, setBottom] = useState(new Animated.Value(70));
  const scrollViewRef = useRef(null);
  const [messageText, setMessageText] = useState("");

  const doAnimated = (newBottom: number, newHeight: number, duration: number | undefined) => {
    Animated.timing(bottom, {
    toValue: newBottom,
    duration: duration,
    useNativeDriver: false
}).start();
    Animated.timing(height, {
    toValue: newHeight,
    duration: duration,
    useNativeDriver: false
}).start();
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd();
    }, duration);
  };
  const willShowKeyboard = (e) => {
    if (Platform.OS === "android") {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd();
      }, 250);
    } else {
      doAnimated(e.endCoordinates.height + 40, e.endCoordinates.height, 250);
    }
  };

  const willHideKeyboard = () => {
    doAnimated(70, 0, 250);
  };

  useEffect(() => {
    const keyboardShowSubscription = Keyboard.addListener(
      "keyboardWillShow",
      willShowKeyboard
    );
    const keyboardHideSubscription = Keyboard.addListener(
      "keyboardWillHide",
      willHideKeyboard
    );
    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  }, [messages]);

  const renderMessages = (item: { Participant: { ID: number; Avatar: string; Nickname: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; Time: moment.MomentInput; Text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined, prevItem: { Participant: { ID: any; }; } | null) => {
    const ownTeamMemberIDs = room.Teams[0].Members.map((mb: { ID: number; }) => mb.ID);

    let marginTop = 20;
    if (
      prevItem &&
      ownTeamMemberIDs.includes(item.Participant.ID) ===
        ownTeamMemberIDs.includes(prevItem.Participant.ID)
    ) {
      marginTop = 5;
    }

    return (
      <View
        style={[
          styles.messageContainer,
          {
            marginTop,
            left: ownTeamMemberIDs.includes(item.Participant.ID)
              ? 0
              : Dimensions.get("window").width / 5,
          },
        ]}
        key={index}
      >
        <View style={styles.messageHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar.Image
              style={{ marginRight: 5 }}
              source={{ uri: resolveAvatar(item.Participant.Avatar) }}
              size={24}
            />
            <Text style={styles.personName}>{item.Participant.Nickname}</Text>
          </View>
          <Text style={styles.textMessageDate}>
            {moment(item.Time)
              .tz(Settings.LocalTimezone)
              .format(`${Settings.TimeFormatString} zz`)}
          </Text>
        </View>
        <Text style={styles.messageContent}>{item.Text}</Text>
      </View>
    );
  };

  const sendChatMessage = () => {
    if (!isConnected) {
      queueMessage("error", "You are currently not connected.")(dispatch);
      return;
    }

    const message = messageText;
    if (message !== "") {
      sendMessage(message);
      setMessageText("");
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      {!isConnected && (
        <View style={{ padding: 10 }}>
          <Banner
            visible={true}
            actions={[]}
            style={styles.bannerContainer}
            image={({ size }) => <Ionicons name="alert" size={size} />}
          >
            <Text style={styles.bannerContent}>
              Connection to the chat server could not be established. Please
              check if you have an Internet connection.
            </Text>
          </Banner>
        </View>
      )}
      <Animated.ScrollView
        style={[styles.chatHistory, { marginBottom: bottom }]}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        onContentSizeChange={(contentWidth, contentHeight) => {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }}
        ref={scrollViewRef}
      >
        {messages.map((item, index) => {
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
          onChangeText={(text) => setMessageText(text)}
          value={messageText}
        />

        <Ionicons
          name="send"
          size={35}
          color={theme.colors.mark}
          onPress={sendChatMessage}
        />

        <View />
      </Animated.View>
    </View>
  );
}

export default ChatBox;