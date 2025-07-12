import React from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Avatar, Text } from "react-native-paper";
import { resolveAvatar } from "../../utils/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRoom,
  fetchOffer,
  hideChat,
  readMessages,
  setRoomNull,
} from "./actions";
import ChatBox from "./sub/chatbox";
import ChatInfo from "./sub/chatInfo";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/chat";
import { getWebsocketInstance } from "../../utils/websocket-instance";
import { fetchGames, subscribeChatChannel } from "../../actions";
import { CustomBanner } from "../../components/custom-banner";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PraccAppState } from "../../reducers";

const ChatRoom = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFetching, setIsFetching] = useState(true);
  const [requestID, setRequestID] = useState(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [websocket, setWebsocket] = useState<any | null>(null);
  const { room, offer } = useSelector((state: PraccAppState) => state.screens.chats);

  const getChatRoom = useCallback(
    (roomID: string, numOfUnreadMessages: number) => {
      fetchChatRoom(roomID, numOfUnreadMessages)(dispatch);
      setIsFetching(false);
    },
    [dispatch]
  );

  useEffect(() => {
    let socket: any;
    async function initSocket() {
      socket = await getWebsocketInstance();
      setWebsocket(socket);
    }
    initSocket();
    fetchGames()(dispatch);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!websocket) return;
    const subscription = websocket.subscribe((data) => {
      if (data.Payload.ChatID === route?.params.roomID) {
        if (data.Payload.Messages) {
          data.Payload.Messages.map((msg: any) => {
            setRequestID(msg.RequestID);
          });
          setMessages([...messages, ...data.Payload.Messages]);
        }
        if (data.Payload.Message) {
          readMessages(route?.params.roomID);
          setMessages((prevMessages) => [
            ...prevMessages,
            data.Payload.Message,
          ]);
        }
      }
    });
    websocket.subscribeConnectionStatus((connected: boolean) => {
      setIsConnected(connected);
      subscribeChatChannel(connected, route?.params.roomID)(dispatch);
    });
    websocket.connect();

    return () => {
      subscription.unsubscribe();
    };
  }, [websocket, route]);

  useEffect(() => {
    if (!websocket) return;
    websocket.send("chat.Subscribe", { ChatID: route?.params.roomID });
  }, [websocket, route]);

  useEffect(() => {
    if (route) {
      if (route.params.Request) {
        setRequestID(route.params.Request.ID);
      }
      setIsFetching(true);
      getChatRoom(route.params.roomID, route.params.numOfUnreadMessages);
    }
  }, [route]);

  useEffect(() => {
    if (requestID !== undefined) {
      fetchOffer(requestID)(dispatch);
    }
  }, [requestID]);

  useLayoutEffect(() => {
    if (room) {
      navigation.setOptions({
        headerBackVisible: false,
        headerLeft: () => <HeaderLeft />,
        headerTitle: () => <HeaderTitle />,
        headerRight: () => <HeaderRight />,
      });
    }
  }, [room, navigation]);

  const HeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setRoomNull()(dispatch);
          navigation.pop();
          route.params?.onBack();
        }}
      >
        <Ionicons
          name={
            Platform.OS === "ios" ? "chevron-back" : "arrow-back-sharp"
          }
          size={28}
          color="white"
        />
      </TouchableOpacity>
    );
  };

  const HeaderTitle = () => {
    const Team = room.Teams[1];
    return (
      <View style={styles.teamInfo}>
        <Avatar.Image
          size={30}
          source={{ uri: resolveAvatar(Team.Logo) }}
          style={styles.avatar}
        />
        <Text style={styles.teamNameTextOnHeader}>{Team.Name}</Text>
      </View>
    );
  };

  const HeaderRight = () => {
    const deleteRoom = () => {
      hideChat(room.ID)(dispatch);
      navigation.goBack();
    };
    return (
      <TouchableOpacity onPress={deleteRoom}>
        <Ionicons name="trash" size={25} color="white" />
      </TouchableOpacity>
    );
  };

  const sendMessage = (msg) => {
    websocket.send("chat.SendMessage", {
      ChatID: route?.params.roomID,
      Message: msg,
      ReferencedObjects: {},
    });
  };

  if (isFetching || offer === undefined || !room) {
    return (
      <View style={styles.container}>
        <View style={[styles.bodyContainer, { marginTop: 30 }]}>
          <ActivityIndicator color={styles.activityIndicatorColor} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        {offer === null && requestID ? (
          <View style={{ padding: 10 }}>
            <CustomBanner
              visible={true}
              style={styles.bannerContainer}
              text={`The referenced request (#${requestID}) was deleted.`}
            />
          </View>
        ) : null}
        <ChatInfo offer={offer} room={room} />
        <ChatBox
          messages={messages}
          isConnected={isConnected}
          sendMessage={sendMessage}
        />
      </View>
    </View>
  );
}

export default ChatRoom;