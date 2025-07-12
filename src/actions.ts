import React from "react";
import * as SecureStore from "expo-secure-store";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  AUTH_LOADED,
  LOAD_FILTER,
  SELECT_TEAM,
  SET_ACCESS_TOKEN,
  UPDATE_CAMERA_PERMISSION,
  UPDATE_FILTER,
  UPDATE_PROFILE,
  INCREASE_NEW_MESSAGE,
  SUBSCRIBE_CHAT_CHANNEL,
  FETCH_GAME_DATA,
} from "./reducers";
import { get } from "./utils/backend";
import * as Sentry from "sentry-expo";
import { displayErrorMessage } from "./components/snackbar-container";
import {
  getDefaultRegionForProfile,
  getRegionsForProfile,
} from "./const/regions";
import { GameType } from "./types";

const KEY_ACCESS_TOKEN = "access_token";
const KEY_SELECTED_TEAM = "selected_team_id";
const KEY_FILTER_GROUPS = "filter.groups";
const KEY_FILTER_REGION = "filter.region";

export const loadProfile = () => {
  return async (dispatch: any) => {
    try {
      const res = await get("profile");

      /** Check if profile has Team, if no, then it should be logged out. */
      if (!res.data.Teams) {
        const message =
          "You need to create a team on the website before logging into the mobile app to search.";
        await displayErrorMessage({ message })(dispatch);
        return;
      }

      /** Calculate the amount of the unread chat messages */
      const chatRes = await get("profile/chats");
      let NumberOfUnreadMessages = 0;
      chatRes.data.map((chat) => {
        NumberOfUnreadMessages += chat.ActingUser.NumberOfUnreadMessages;
      });

      let selectedTeamId = null;
      try {
        selectedTeamId = await SecureStore.getItemAsync(KEY_SELECTED_TEAM);
        if (selectedTeamId) {
          selectedTeamId = Number(selectedTeamId);
        }
      } catch (e) {
        Sentry.Native.captureException(e);
      }

      dispatch({
        type: UPDATE_PROFILE,
        data: res.data,
        selectedTeamId: selectedTeamId,
        NumberOfUnreadMessages: NumberOfUnreadMessages,
      });
      await dispatch(fetchGames());
      await dispatch(loadFilter());
    } catch (e) {
      dispatch(displayErrorMessage(e));
    }
  };
};

export const fetchGames = () => {
  return async (dispatch: any) => {
    try {
      const res = await get("game-data");

      const games = (res.data) as GameType[];

      dispatch({
        type: FETCH_GAME_DATA,
        data: games,
      });
    } catch (e) {
      dispatch(displayErrorMessage(e));
    }
  };
};

export const loadFilter = () => {
  return async (dispatch: any, getState: any) => {
    const { profile, games } = getState();

    let cachedFilter = {
      Selected: []
    };
    try {
      const groupStr = await SecureStore.getItemAsync(KEY_FILTER_GROUPS);
      if (groupStr) {
        cachedFilter = JSON.parse(groupStr);

        if (
          profile &&
          profile.Team &&
          cachedFilter.hasOwnProperty("Selected")
        ) {
          cachedFilter.Selected = cachedFilter.Selected.filter((groupId: number) => {
            return profile.Team.Groups.findIndex((g: { ID: number; }) => g.ID === groupId) >= 0;
          });
        }
      }
    } catch (e) {
      Sentry.Native.captureException(e);
    }

    let selectedRegion: string | null = "";
    try {
      selectedRegion = await SecureStore.getItemAsync(KEY_FILTER_REGION);

      if (
        profile &&
        profile.Team &&
        getRegionsForProfile(profile, games).findIndex(
          (r) => r.Id === selectedRegion
        ) < 0
      ) {
        selectedRegion = "";
      }
    } catch (e) {
      Sentry.Native.captureException(e);
    }

    if (!selectedRegion) {
      selectedRegion = getDefaultRegionForProfile(profile, games);
    }

    dispatch({
      type: LOAD_FILTER,
      cachedFilter,
      selectedRegion,
    });
  };
};

export const updateFilter = (newFilterOptions: any) => {
  return async (dispatch: any) => {
    dispatch({
      type: UPDATE_FILTER,
      newFilterOptions,
    });

    setTimeout(async () => {
      if (newFilterOptions.hasOwnProperty("Groups")) {
        try {
          await SecureStore.setItemAsync(
            KEY_FILTER_GROUPS,
            JSON.stringify(newFilterOptions.Groups)
          );
        } catch (e) {
          Sentry.Native.captureException(e);
        }
      }
      if (newFilterOptions.hasOwnProperty("Region")) {
        try {
          await SecureStore.setItemAsync(
            KEY_FILTER_REGION,
            newFilterOptions.Region
          );
        } catch (e) {
          Sentry.Native.captureException(e);
        }
      }
    }, 1);
  };
};

export const selectTeam = (teamId: number) => {
  return async (dispatch: any) => {
    dispatch({
      type: SELECT_TEAM,
      teamId,
    });
    await dispatch(loadFilter());

    setTimeout(async () => {
      try {
        const value = "" + teamId;
        await SecureStore.setItemAsync(KEY_SELECTED_TEAM, value);
      } catch (e) {
        Sentry.Native.captureException(e);
      }
    }, 1);
  };
};

export const increaseNewMessage = (message: string) => {
  return async (dispatch: any) => {
    dispatch({
      type: INCREASE_NEW_MESSAGE,
      data: message,
    });
  };
};

export const subscribeChatChannel = (isConnected: boolean, chatID: string) => {
  return async (dispatch: any) => {
    dispatch({
      type: SUBSCRIBE_CHAT_CHANNEL,
      isConnected,
      chatID,
    });
  };
};

export const requestCameraPermission = () => {
  return async (dispatch: any) => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    dispatch({
      type: UPDATE_CAMERA_PERMISSION,
      granted: status === "granted",
    });
  };
};

export const setAccessToken = (accessToken: string) => {
  return async (dispatch: any) => {
    await SecureStore.setItemAsync(KEY_ACCESS_TOKEN, accessToken);
    await updateAccessToken(dispatch, accessToken);
  };
};

export const loadAccessToken = () => {
  return async (dispatch: any) => {
    try {
      const accessToken = await SecureStore.getItemAsync(KEY_ACCESS_TOKEN);
      console.log(
        "Access token retrieved from storage (" +
          (accessToken !== null ? "token available" : "no token") +
          ")."
      );
      await updateAccessToken(dispatch, accessToken);
    } catch (e) {
      SecureStore.deleteItemAsync(KEY_ACCESS_TOKEN);
    }
  };
};

async function updateAccessToken(dispatch: any, accessToken: string | null) {
  await dispatch({
    type: SET_ACCESS_TOKEN,
    accessToken,
  });

  if (accessToken !== null) {
    await dispatch(loadProfile());
  }

  await dispatch({
    type: AUTH_LOADED,
  });
}
