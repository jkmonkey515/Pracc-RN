import { FETCH_NOTIFICATIONS, UPDATE_NOTIFICATION } from "./reducers";
import * as backend from "../../utils/backend";
import * as Sentry from "sentry-expo";
import { REFRESH_NEW_NOTIFCATIONS_ON_PROFILE } from "../../reducers";

export const fetchNotifications = () => async (dispatch: any) => {
  try {
    const res = await backend.get("notifications");
    const notifications = res.data.Notifications;
    dispatch({ type: FETCH_NOTIFICATIONS, payload: notifications });
    dispatch({
      type: REFRESH_NEW_NOTIFCATIONS_ON_PROFILE,
      data: res.data.UnreadCount,
    });
  } catch (error) {
    Sentry.Native.captureException(e);
  }
};

export const updateNotification = () => async (dispatch: any) => {
  try {
    await backend.put("notifications/read");
    dispatch({ type: UPDATE_NOTIFICATION });
  } catch (error) {
    Sentry.Native.captureException(e);
  }
};

export async function getOffer(offerID: string) {
  try {
    const res = await backend.get(`offers/${offerID}`);
    return res.data;
  } catch (error) {
    return null;
  }
}
