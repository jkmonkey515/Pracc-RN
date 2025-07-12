import React from "react";
import scanQrCode from "./screens/scan-qr-code/reducers";
import login from "./screens/login/reducers";
import settings from "./screens/settings/reducers";
import requests from "./screens/requests/reducers";
import matches from "./screens/matches/reducers";
import search from "./screens/search/reducers";
import notifications from "./screens/notifications/reducers";
import chats from "./screens/chats/reducers";
import { reduce as snackbarContainerReducer } from "./components/snackbar-container";
import { combineReducers } from "@reduxjs/toolkit";
import moment from "moment-timezone";
import { GameType, Profile, MapType } from './types';

export const UPDATE_CAMERA_PERMISSION = "global/UPDATE_CAMERA_PERMISSION";
export const SET_ACCESS_TOKEN = "global/SET_ACCESS_TOKEN";
export const AUTH_LOADED = "global/AUTH_LOADED";
export const UPDATE_PROFILE = "global/UPDATE_PROFILE";
export const DECREASE_NEW_NOTIFCATIONS_ON_PROFILE =
  "global/DECREASE_NEW_NOTIFCATIONS_ON_PROFILE";
export const REFRESH_NEW_NOTIFCATIONS_ON_PROFILE =
  "global/REFRESH_NEW_NOTIFCATIONS_ON_PROFILE";

export const SUBSCRIBE_CHAT_CHANNEL = "global/SUBSCRIBE_CHAT_CHANNEL";
export const READ_MESSAGES = "global/READ_MESSAGES";
export const INCREASE_NEW_MESSAGE = "global/INCREASE_NEW_MESSAGE";

export const RESET = "global/RESET";
export const SELECT_TEAM = "global/SELECT_TEAM";
export const UPDATE_FILTER = "global/UPDATE_FILTER";
export const LOAD_FILTER = "global/LOAD_FILTER";

export const FETCH_GAME_DATA = "global/FETCH_GAME_DATA";

const defaultGroupFilter = {
  All: true,
  Selected: [],
};

export interface FilterStateType {
  Groups: {
    All: boolean;
    Selected: number[];
  };
  Region: string;
  DateTime: {
    MatchRequests: boolean;
    Start: string;
    StartTime: string | null;
    End: string;
    EndTime: string | null;
  };
  Maps: {
    All: boolean;
    Selected: number[];
  };
  Requests: {
    Enabled: boolean;
    Type: string;
  };
  Offers: {
    Enabled: boolean;
    Type: string;
  };
  Matches: {
    Enabled: boolean;
  };
  Verified: {
    Enabled: boolean;
  };
  Favorites: {
    Enabled: boolean;
  };
}

const initialFilterState: FilterStateType = {
  Groups: defaultGroupFilter,
  Region: "",
  DateTime: {
    MatchRequests: false,
    Start: "",
    StartTime: null,
    End: "",
    EndTime: null,
  },
  Maps: {
    All: true,
    Selected: [],
  },
  Requests: {
    Enabled: true,
    Type: "not-hidden",
  },
  Offers: {
    Enabled: true,
    Type: "all",
  },
  Matches: {
    Enabled: true,
  },
  Verified: {
    Enabled: false,
  },
  Favorites: {
    Enabled: false,
  },
};

const screenReducer = combineReducers({
  scanQrCode,
  login,
  settings,
  requests,
  matches,
  search,
  notifications,
  chats,
});

export type RootState = ReturnType<typeof screenReducer>;

export type PraccAppState = {
  isAuthLoaded: boolean;
  hasCameraPermission: boolean | null;
  accessToken: string | null;
  profile: Profile | null;
  games: GameType[];
  screens: RootState;
  filter: FilterStateType;
  subscribedChatChannel: null | any;
  lastMessage: null | any;
}

const initialState: PraccAppState = {
  isAuthLoaded: false,
  hasCameraPermission: null,
  accessToken: null,
  profile: null,
  games: [],
  screens: {},
  filter: initialFilterState,
  subscribedChatChannel: null,
  lastMessage: null,
};

function selectActiveTeam(newProfile: Profile, prevProfile: Profile | null, storedTeamId: number) {
  if (newProfile.Teams.length <= 0) {
    return null;
  }

  if (prevProfile && prevProfile.Team) {
    const team = newProfile.Teams.find(
      (team) => team.ID === prevProfile.Team.ID
    );
    if (team) {
      return team;
    }
  }

  if (storedTeamId) {
    const storedTeamIdNumber = Number(storedTeamId);
    const team = newProfile.Teams.find(
      (team) => team.ID === storedTeamIdNumber
    );
    if (team) {
      return team;
    }
  }

  return newProfile.Teams[0];
}


function app(oldState = initialState, action: any) {
  const newState = { ...oldState };
  newState.screens = screenReducer(oldState.screens, action);
  newState.snackbarContainer = snackbarContainerReducer(
    oldState.snackbarContainer,
    action
  );

  switch (action.type) {
    case UPDATE_CAMERA_PERMISSION:
      return {
        ...newState,
        hasCameraPermission: action.granted,
      };

    case RESET:
      return app(initialState, { type: "none" });

    case SET_ACCESS_TOKEN:
      return {
        ...newState,
        accessToken: action.accessToken,
      };

    case AUTH_LOADED:
      return {
        ...newState,
        isAuthLoaded: true,
      };

    case UPDATE_PROFILE:
      if (action.data) {
        if (action.data.Settings && !action.data.Settings.LocalTimezone) {
          action.data.Settings.LocalTimezone = moment.tz.guess();
        }

        // add format string for time format
        action.data.Settings.TimeFormatString =
          action.data.Settings.TimeFormat === "eu" ? "HH:mm" : "h:mm A";

        action.data.Team = selectActiveTeam(
          action.data,
          oldState.profile,
          action.selectedTeamId
        );
      }

      // Consider NumberOfUnreadMessages
      if (action.NumberOfUnreadMessages) {
        action.data.NewMessages = action.NumberOfUnreadMessages;
      }

      return {
        ...newState,
        profile: action.data,
      };

    case READ_MESSAGES:
      return {
        ...newState,
        profile: {
          ...newState.profile,
          NewMessages:
            !newState.profile || newState.profile?.NewMessages === 0
              ? 0
              : newState.profile.NewMessages - action.payload,
        },
        screens: {
          ...newState.screens,
          chats: {
            ...newState.screens.chats,
            contacts: newState.screens.chats.contacts.map((contact) => {
              if (contact.ID === action.chatID) {
                return {
                  ...contact,
                  ActingUser: {
                    ...contact.ActingUser,
                    NumberOfUnreadMessages: 0,
                  },
                };
              }
              return contact;
            }),
          },
        },
      };

    case SUBSCRIBE_CHAT_CHANNEL:
      if (action.isConnected) {
        return {
          ...newState,
          subscribedChatChannel: action.chatID,
        };
      } else {
        return {
          ...newState,
          subscribedChatChannel: null,
        };
      }

    case INCREASE_NEW_MESSAGE:
      if (
        (newState.lastMessage &&
          newState.lastMessage.ID === action.data.Message.ID) ||
        newState.subscribedChatChannel === action.data.ChatID
      ) {
        return { ...newState };
      }

      return {
        ...newState,
        lastMessage: action.data.Message,
        profile: {
          ...newState.profile,
          NewMessages: newState.profile && newState.profile.NewMessages
            ? newState.profile.NewMessages + 1
            : 1,
        },
        screens: {
          ...newState.screens,
          chats: {
            ...newState.screens.chats,
            contacts: newState.screens.chats.contacts.map((contact) => {
              if (contact.ID === action.data.ChatID) {
                return {
                  ...contact,
                  ActingUser: {
                    ...contact.ActingUser,
                    NumberOfUnreadMessages:
                      contact.ActingUser.NumberOfUnreadMessages + 1,
                  },
                };
              }
              return contact;
            }),
          },
        },
      };

    case DECREASE_NEW_NOTIFCATIONS_ON_PROFILE:
      return {
        ...newState,
        profile: {
          ...newState.profile,
          NewNotifications: 0,
        },
      };

    case REFRESH_NEW_NOTIFCATIONS_ON_PROFILE:
      return {
        ...newState,
        profile: {
          ...newState.profile,
          NewNotifications: action.data,
        },
      };

    case SELECT_TEAM:
      if (newState.profile && newState.profile.Teams) {
        const team = newState.profile.Teams.find(
          (team) => team.ID === action.teamId
        );
        if (team) {
          return {
            ...newState,
            profile: {
              ...newState.profile,
              Team: team,
            },
          };
        }
      }

      return newState;

    case UPDATE_FILTER:
      return {
        ...newState,
        filter: {
          ...newState.filter,
          ...action.newFilterOptions,
        },
      };

    case LOAD_FILTER:
      return {
        ...newState,
        filter: {
          ...newState.filter,
          Groups: {
            ...newState.filter.Groups,
            ...action.cachedFilter,
          },
          Region: action.selectedRegion,
        },
      };

    case FETCH_GAME_DATA:
      return {
        ...newState,
        games: action.data,
      };
  }

  return newState;
}

export default app;
