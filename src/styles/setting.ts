import { StyleSheet } from "react-native";
import { AppTheme } from "../themes";
import { commonStyles } from "./common";

export const useStyles = (theme: AppTheme) => {
  return {
    ...commonStyles(theme),
    ...StyleSheet.create({
      profileDiv: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 25,
        paddingBottom: 25,
        gap: 20
      },
      largeBtn: {
        paddingVertical: 6,
        alignItems: "center",
        justifyContent: "center",
      },
      menuDiv: {
        flex: 1,
        alignItems: 'flex-start'
      }
    }),
  };
};
