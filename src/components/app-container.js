import * as Notifications from "expo-notifications";
import React from "react";
import { View, Text } from "react-native";
import { queueMessage } from "./snackbar-container";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectTeam, increaseNewMessage } from "../actions";
import { getActiveRoute } from "../utils/navigation";
import { getWebsocketInstance } from "../utils/websocket-instance";

export function createAppStackContainer(AppStack) {
  class AppStackContainer extends React.Component {
    static router = AppStack.router;

    subscription = null;
    websocket = null;

    async componentDidMount() {
      this.websocket = await getWebsocketInstance();
      if (this.websocket) {
        this.websocket.connect();
        this.websocket.subscribe((data) => {
          if (
            data.MessageType === "chat.NewMessage" &&
            data.Payload.Message.Participant.Nickname !==
              this.props.profile.PersonaName
          ) {
            this.props.increaseNewMessage(data.Payload);
          }
        });
        this.websocket.subscribeConnectionStatus((connected) => {});
      }

      this.subscription = Notifications.addNotificationReceivedListener(
        this.handleNotification.bind(this)
      );
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.profile === null) {
        this.props.navigation.navigate("Auth");
      }
    }

    async componentWillUnmount() {
      if (this.websocket) {
        await this.websocket.disconnect();
      }
      if (this.subscription) {
        this.subscription.remove();
      }
    }

    handleNotification(notification) {
      if (notification.origin === "received") {
        if (
          notification.data.hasOwnProperty("Message") &&
          notification.data.Message !== ""
        ) {
          let message = notification.data.Message;
          let label;
          if (notification.data.Type === "my-requests") {
            label = "Requests";
          } else if (notification.data.Type === "match") {
            label = "Match";
          } else if (notification.data.Type === "search-for-own-requests") {
            label = "Potential Opponents";
          } else if (notification.data.Type === "offer") {
            label = "Offer";
          } else if (notification.data.Type === "match-chat") {
            label = "Match";
            message = "New message in chat";

            // If the user is already in the given match chat, ignore notification.
            const activeRoute = getActiveRoute(this.props.navigation.state);
            if (activeRoute && activeRoute.routeName === "CalendarDetails") {
              let matchId;
              if (activeRoute.params.hasOwnProperty("match")) {
                matchId = activeRoute.params.match.ID;
              } else if (activeRoute.params.hasOwnProperty("matchId")) {
                matchId = activeRoute.params.matchId;
              }

              if (matchId === notification.data.Payload.ID) {
                return;
              }
            }
          }

          let action;
          if (label) {
            action = {
              label,
              onPress: () => this.runAction(notification.data),
            };
          }

          this.props.queueMessage("default", message, action);
        }
      } else if (notification.origin === "selected") {
        this.runAction(notification.data);
      }
    }

    runAction(data) {
      if (
        data.hasOwnProperty("Payload") &&
        data.Payload &&
        data.Payload.hasOwnProperty("TeamID")
      ) {
        this.props.selectTeam(data.Payload.TeamID);
      }

      if (data.Type === "my-requests") {
        this.props.navigation.navigate("RequestsIndex");
      } else if (data.Type === "match" || data.Type === "match-chat") {
        this.props.navigation.navigate("CalendarDetails", {
          matchId: data.Payload.ID,
        });
      } else if (data.Type === "search-for-own-requests") {
        this.props.navigation.navigate("SearchIndex");
      } else if (data.Type === "offer") {
        this.props.navigation.navigate("SearchOffer", {
          offerId: data.Payload.ID,
        });
      }
    }

    render() {
      const { navigation, profile } = this.props;

      if (!profile) {
        return (
          <View>
            <Text>Logging out...</Text>
          </View>
        );
      }

      return (
        <React.Fragment>
          <AppStack navigation={navigation} />
        </React.Fragment>
      );
    }
  }

  return connect(
    (state) => ({
      profile: state.profile,
    }),
    (dispatch) =>
      bindActionCreators(
        {
          queueMessage,
          selectTeam,
          increaseNewMessage,
        },
        dispatch
      )
  )(AppStackContainer);
}
