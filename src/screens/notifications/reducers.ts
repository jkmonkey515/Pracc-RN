import { NotificationType } from '../../types';
export const FETCH_NOTIFICATIONS = "notifications/FETCH_NOTIFICATIONS";
export const UPDATE_NOTIFICATION = "notifications/UPDATE_NOTIFICATION";

const initialState: {
  notifications: NotificationType[];
} = {
  notifications: [],
};

const reducer = (state = initialState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload as NotificationType[],
      };

    case UPDATE_NOTIFICATION:
      return {
        ...state,
      };
  }

  return state;
};

export default reducer;
