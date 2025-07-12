import {
  ADD_EVENT,
  DELETE_EVENT,
  UPDATE_EVENT,
  SET_CURRENT_DATE,
  FETCH_MATCHES,
  FETCH_MATCHES_REQUEST,
} from "./reducers";
import * as backend from "../../utils/backend";
import * as Sentry from "sentry-expo";
import moment from "moment-timezone";
import { colors } from "../../styles/colors";
import { eventColors } from "../../const/colors";
import { Profile } from "@/src/types";

export const setCurrentDate = (date: string | Date) => (dispatch: any) => {
  dispatch({ type: SET_CURRENT_DATE, payload: date });
};

export const saveEvent = (data: any) => async (dispatch: any) => {
  try {
    const res = await backend.post("matches/create", {
      json: data,
    });
    const match = res.data;
    dispatch({ type: ADD_EVENT, payload: match });
  } catch (error) {
    Sentry.Native.captureException(error);
  }
};

export const updateEvent = (data: any) => async (dispatch: any) => {
  try {
    const res = await backend.post("matches/update", {
      json: data,
    });
    const event = res.data;
    dispatch({ type: UPDATE_EVENT, payload: event });
  } catch (error) {
    Sentry.Native.captureException(error);
  }
};

export const deleteEvent = (eventID: string) => async (dispatch: any) => {
  try {
    await backend.get(`matches/deleteItem/${eventID}`);
    dispatch({ type: DELETE_EVENT, payload: eventID });
  } catch (error) {
    Sentry.Native.captureException(error);
  }
};

export const fetchMatches =
  (options = {}) =>
  async (dispatch: any) => {
    const cancelled = options ? options.show_cancelled_matches : false;
    const past = options ? options.show_past_matches : false;
    try {
      dispatch({ type: FETCH_MATCHES_REQUEST });
      const res = await backend.get(
        `matches?cancelled=${cancelled}&past=${past}`
      );
      const matches = res.data;
      dispatch({ type: FETCH_MATCHES, payload: matches });
    } catch (error) {
      Sentry.Native.captureException(error);
    }
  };

export const filterMatches = (matches: any[], date: Date) => {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  return matches.filter((match) => {
    const matchDate = new Date(match.Time);
    return matchDate >= startOfDay && matchDate < endOfDay;
  });
};

export const filterMatchesByMonth = (matches: any[], date: Date | string, settings: any) => {
  const startOfMonth = moment(date).tz(settings.LocalTimezone).startOf("month");
  const endOfMonth = moment(date).tz(settings.LocalTimezone).endOf("month");
  return matches.filter((match) => {
    const matchDate = moment(match.Time).tz(settings.LocalTimezone);
    return (
      matchDate.isSameOrAfter(startOfMonth) &&
      matchDate.isSameOrBefore(endOfMonth)
    );
  });
};

export const sortMatches = (matches: any[]) => {
  return matches.sort((a, b) =>
    moment(a.Time).isBefore(moment(b.Time)) ? -1 : 1
  );
};

const formatDateTime = (dateTime: Date | string, timeZone: string) => {
  return moment(dateTime).tz(timeZone).format("YYYY-MM-DD HH:mm:ss");
};

export const groupMatchesByDate = (matches: any[], tz: string) => {
  const matchesByDate = {};
  for (const match of matches) {
    const date = moment(match.Time).tz(tz);
    const dateStr = date.format("dddd, MMMM Do");
    if (!matchesByDate.hasOwnProperty(dateStr)) {
      matchesByDate[dateStr] = {
        FormattedDate: dateStr,
        Matches: [],
      };
    }
    matchesByDate[dateStr].Matches.push(match);
  }
  return Object.values(matchesByDate);
};

export const makeMarkedDates = (matches: any[], tz: string) => {
  const today = moment.tz(tz).format("YYYY-MM-DD");
  const markedDates = {
    [today]: {
      selected: true,
    },
  };
  matches.map((match) => {
    const matchTime = moment(match.Time).tz(tz).format("YYYY-MM-DD");
    markedDates[matchTime] = {
      marked: true,
      dotColor: colors.secondary.dark,
      selected: matchTime === today,
    };
  });
  return markedDates;
};

export const standarizeEventArray = (matches: any[], games: any[], profile: Profile | null, isDark?: boolean) => {
  const eventsByDate = {};

  matches.forEach((event) => {
    const dateString = moment(event.Time)
      .tz(profile.Settings.LocalTimezone)
      .format("YYYY-MM-DD");

    if (!eventsByDate[dateString]) {
      eventsByDate[dateString] = [];
    }

    const isEvent = event.type === "event";
    const isCancelled = event.Cancelled;
    const isPast = moment(event.Time).isBefore();

    const start = formatDateTime(event.Time, profile.Settings.LocalTimezone);
    const end = isEvent
      ? formatDateTime(event.End, profile.Settings.LocalTimezone)
      : formatDateTime(
          moment(event.Time).add(1, "hour"),
          profile.Settings.LocalTimezone
        );

    const title = isEvent
      ? event.Title
      : profile?.Team.ID === event.TeamHigher.ID
      ? event.TeamLower.Name
      : event.TeamHigher.Name;

    const avatar = isEvent
      ? null
      : profile?.Team.ID === event.TeamHigher.ID
      ? event.TeamLower.Logo
      : event.TeamHigher.Logo;

    const game = games.find((game) => game.Id === profile?.Team.GameID);
    const map =
      !isEvent && game.Maps.length > 0
        ? game.Maps.find((map) => map.Id === event.Map)?.Name
        : null;

    eventsByDate[dateString].push({
      id: event.ID,
      start,
      end,
      title,
      summary: isEvent
        ? event.Description
        : `${event.GamesCount} Game${event.GamesCount === 1 ? "" : "s"}`,
      color: isDark ? '#3e4254' : colors.grey["300"],
      textColor: isEvent
        ? eventColors.find((color) => color.label === event.Color).value
        : colors.primary.main,
      avatar,
      match: event,
      map,
      isEvent,
      isCancelled,
      isPast,
    });
  });

  return eventsByDate;
};
