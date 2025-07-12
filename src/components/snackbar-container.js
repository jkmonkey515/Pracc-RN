import React from "react";
import { connect } from "react-redux";
import { Button, DefaultTheme, Snackbar } from "react-native-paper";
import { bindActionCreators } from "redux";
import * as Sentry from "sentry-expo";
import { colors } from "../styles/colors";

const whiteButtonTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    accent: "white",
  },
};

const primaryButtonTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    accent: colors.primary.main,
  },
};

class SnackbarContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.messages.map((message) => {
          let action = message.action;
          if (!action) {
            action = {
              label: "OK",
              onPress: () => {
                // This will just dismiss the action.
              },
            };
          }

          const { style = {}, ...otherProps } = this.getStylesForVariant(
            message.variant
          );

          return (
            <Snackbar
              {...otherProps}
              key={message.id}
              visible={true}
              onDismiss={() => this.props.deleteMessage(message.id)}
              style={style}
              action={action}
            >
              {message.message}
            </Snackbar>
          );
        })}
      </React.Fragment>
    );
  }

  getStylesForVariant(variant) {
    if (variant === "error") {
      return {
        style: {
          backgroundColor: colors.error.main,
          color: colors.error.contrastText,
        },
        theme: whiteButtonTheme,
      };
    } else if (variant === "success") {
      return {
        style: {
          backgroundColor: "#27b75c",
        },
        theme: whiteButtonTheme,
      };
    } else if (variant === "default") {
      return {
        style: {
          backgroundColor: colors.grey.A400,
        },
        theme: primaryButtonTheme,
      };
    }

    return {};
  }
}

const Connected = connect(
  (state) => ({
    ...state.snackbarContainer,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        deleteMessage,
      },
      dispatch
    )
)(SnackbarContainer);
export default Connected;

export const QUEUE_MESSAGE = "snackbar-container/QUEUE_MESSAGE";
const DELETE_MESSAGE = "snackbar-container/DELETE_MESSAGE";

export const initialState = {
  messages: [],
};

let messageCounter = 0;

export function reduce(state = initialState, action) {
  switch (action.type) {
    case QUEUE_MESSAGE:
      const message = action.message;
      if (!message.hasOwnProperty("id")) {
        message.id = messageCounter++;
      }

      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case DELETE_MESSAGE:
      const newMessages = state.messages.filter((m) => m.id !== action.id);

      return {
        ...state,
        messages: newMessages,
      };
  }

  return state;
}

export function queueMessage(variant, message, action) {
  return (dispatch) => {
    dispatch({
      type: QUEUE_MESSAGE,
      message: {
        variant,
        message,
        action,
      },
    });
  };
}

export function displayErrorMessage(error) {
  return async (dispatch) => {
    let message = "";
    if (error.status) {
      if (error.status === 400) {
        const resData = await error.json();

        if (resData.hasOwnProperty("Message")) {
          message = resData.Message;
        }
      } else if (error.status === 404) {
        message = "Object not found. Did you already delete it?";
      } else if (error.status >= 500) {
        Sentry.Native.captureException(error);
        message = "A server error occurred, please try again.";
      }
    }

    if (!message && error.message) {
      message = error.message;
    }

    if (!message) {
      const eventId = Sentry.Native.captureException(error);
      message = "An error occurred (Event: " + eventId + ").";
    }

    dispatch({
      type: QUEUE_MESSAGE,
      message: {
        variant: "error",
        message: message,
      },
    });
  };
}

function deleteMessage(id) {
  return (dispatch) => {
    dispatch({
      type: DELETE_MESSAGE,
      id,
    });
  };
}
