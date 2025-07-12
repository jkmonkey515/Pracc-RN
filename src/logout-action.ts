import * as SecureStore from "expo-secure-store";
import { RESET } from "./reducers";

// We need to keep the logout action separate to avoid a circular dependency between backend.js and actions.js

export const resetAccessToken = () => {
  return async (dispatch: (arg0: { type: string; }) => void) => {
    await SecureStore.deleteItemAsync("access_token");

    dispatch({
      type: RESET,
    });
  };
};
