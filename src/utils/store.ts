import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import appReducers from "../reducers";
import { setStore } from "./backend";
import { getGameForProfile } from "../const/games";

const createAppStore = (analytics: any) => {
  const store = configureStore({
    reducer: appReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
  });
  setStore(store);

  const highTierGroups = [6, 33, 41];
  const dimensionTier = 1;
  const dimensionGame = 2;
  let prevProfileId: number;

  store.subscribe(async () => {
    const state = store.getState();
    if (state.profile && state.profile.ID !== prevProfileId) {
      prevProfileId = state.profile.ID;
      // analytics.addParameter("uid", state.profile.ID);

      if (state.profile.Team && state.profile.Team.Groups) {
        const isInHighTierGroup =
          state.profile.Team.Groups.findIndex(
            (g) => highTierGroups.indexOf(g.ID) >= 0
          ) >= 0;

        // if (isInHighTierGroup) {
        //   analytics.addCustomDimension(dimensionTier, "high");
        // }
      }

      const game = getGameForProfile(state.profile);
      // analytics.addCustomDimension(dimensionGame, game.key);
    }
  });

  return store;
};

export default createAppStore;
