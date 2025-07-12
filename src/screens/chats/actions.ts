import {
  FETCH_CHAT_CONTACTS,
  FETCH_CHAT_ROOM,
  FETCH_OFFER,
  HIDE_CHAT,
  SET_ROOM_NULL,
} from "./reducers";
import * as backend from "../../utils/backend";
import * as Sentry from "sentry-expo";
import { READ_MESSAGES } from "../../reducers";

export const fetchChatContacts = () => async (dispatch: any) => {
  try {
    const res = await backend.get("profile/chats");
    dispatch({ type: FETCH_CHAT_CONTACTS, payload: res.data });
  } catch (e) {
    Sentry.Native.captureException(e);
  }
};

export const fetchChatRoom =
  (roomID: string, numOfUnreadMessages: number) => async (dispatch: any) => {
    try {
      await backend.put(`profile/chats/${roomID}/read`);
      if (numOfUnreadMessages && numOfUnreadMessages > 0) {
        dispatch({
          type: READ_MESSAGES,
          payload: numOfUnreadMessages,
          chatID: roomID,
        });
      }
      const res = await backend.get(`chat/${roomID}`);
      dispatch({ type: FETCH_CHAT_ROOM, payload: res.data });
    } catch (e) {
      Sentry.Native.captureException(e);
    }
  };

export const readMessages = (roomID: string) => async () => {
  try {
    await backend.put(`profile/chats/${roomID}/read`);
  } catch (e) {
    Sentry.Native.captureException(e);
  }
};

export const hideChat = (chatID: string) => async (dispatch: any) => {
  try {
    await backend.post("chat/hide", {
      json: {
        ChatID: chatID,
      },
    });
    dispatch({ type: HIDE_CHAT, payload: chatID });
  } catch (e) {
    Sentry.Native.captureException(e);
  }
};

export const fetchOffer = (requestID: string) => async (dispatch: any) => {
  try {
    if (!requestID) {
      dispatch({ type: FETCH_OFFER, payload: null });
    } else {
      const res = await backend.get(`requests/${requestID}`);
      dispatch({ type: FETCH_OFFER, payload: res.data });
    }
  } catch (e) {
    dispatch({ type: FETCH_OFFER, payload: null });
    Sentry.Native.captureException(e);
  }
};

export const setRoomNull = () => async (dispatch: any) => {
  dispatch({ type: SET_ROOM_NULL });
};
