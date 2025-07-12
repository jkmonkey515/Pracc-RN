import { StyleSheet } from "react-native";
import { AppTheme } from "../themes";
import { commonStyles } from "./common";

export const useStyles = (theme: AppTheme) => {
  return {
    ...commonStyles(theme),
    ...StyleSheet.create({
      loginBtn: {
        marginTop: 15,
        borderColor: "white",
      },
    }),
  };
};
