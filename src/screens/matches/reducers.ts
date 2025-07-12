import moment from "moment-timezone";

export const SET_CURRENT_DATE = "calendar/SET_CURRENT_DATE";
export const CHANGE_CALENDAR_VIEW = "calendar/CHANGE_CALENDAR_VIEW";
export const CHANGE_CALENDAR_OPTION = "calendar/CHANGE_CALENDAR_OPTION";
export const ADD_EVENT = "calendar/ADD_EVENT";
export const UPDATE_EVENT = "calendar/UPDATE_EVENT";
export const DELETE_EVENT = "calendar/DELETE_EVENT";
export const FETCH_MATCHES = "calendar/FETCH_MATCHES";
export const FETCH_MATCHES_REQUEST = "calendar/FETCH_MATCHES_REQUEST";

const initialState = {
  viewType: "day", // day, month, week, agenda
  options: {
    show_cancelled_matches: false,
    show_past_matches: false,
  },
  events: [],
  currentDate: new Date(),
  matches: [],
  isFechting: false,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CURRENT_DATE:
      return { ...state, currentDate: action.payload };
    case CHANGE_CALENDAR_VIEW:
      return {
        ...state,
        viewType: action.payload,
      };
    case CHANGE_CALENDAR_OPTION:
      return {
        ...state,
        options: {
          ...state.options,
          [action.payload]: !state.options[action.payload],
        },
      };
    case FETCH_MATCHES_REQUEST:
      return {
        ...state,
        isFechting: true,
      };
    case FETCH_MATCHES:
      const events = action.payload.Events.map((event: any) => {
        return { ...event, type: "event" };
      });
      return {
        ...state,
        matches: [...action.payload.Matches, ...events],
        isFetching: false,
      };
    case ADD_EVENT:
      return {
        ...state,
        matches: [...state.matches, { ...action.payload, type: "event" }],
      };

    case UPDATE_EVENT:
      return {
        ...state,
        matches: state.matches.map((match: any) => {
          if (match.ID === action.payload.ID) {
            return { ...action.payload, type: "event" };
          }
          return match;
        }),
      };

    case DELETE_EVENT:
      return {
        ...state,
        matches: state.matches.filter((match: any) => match.ID !== action.payload),
      };
  }
  return state;
};

export default reducer;
