export const FETCH_CHAT_CONTACTS = "chats/FETCH_CHAT_CONTACTS";
export const FETCH_CHAT_ROOM = "chats/FETCH_CHAT_ROOM";
export const FETCH_OFFER = "chats/FETCH_OFFER";
export const HIDE_CHAT = "chats/HIDE_CHAT";
export const SET_ROOM_NULL = "chats/SET_ROOM_NULL";

const initialState = {
  contacts: [],
  room: null,
  offer: undefined,
};

const reducer = (state = initialState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case FETCH_CHAT_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        offer: undefined,
        room: null,
      };
    case SET_ROOM_NULL:
      return {
        ...state,
        room: null,
      };
    case FETCH_CHAT_ROOM:
      return {
        ...state,
        room: action.payload,
      };
    case FETCH_OFFER:
      return {
        ...state,
        offer: action.payload,
      };
    case HIDE_CHAT:
      return {
        ...state,
        offer: undefined,
        room: null,
        contacts: state.contacts.filter(
          (contact) => contact.ID !== action.payload
        ),
      };
  }

  return state;
};

export default reducer;
