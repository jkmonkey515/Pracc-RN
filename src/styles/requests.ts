import { StyleSheet } from "react-native";
import { commonStyles } from "./common";
import { AppTheme } from "../themes";

export const useStyles = (theme: AppTheme) => {
  return {
    ...commonStyles(theme),
    ...StyleSheet.create({
      /** Calendar Selector */
      todayView: {
        position: "absolute",
        flexDirection: "row",
        width: "100%",
        height: 50,
        bottom: 0,
        backgroundColor: theme.colors.surface,
        alignItems: "center",
        justifyContent: "center",
      },
      todayCircle: {
        backgroundColor: theme.colors.mark,
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 6,
        alignItems: "center",
        justifyContent: "center",
      },
      requestCircle: {
        backgroundColor: theme.colors.spot,
        width: 4,
        height: 4,
        borderRadius: 2,
        marginRight: 4,
        alignItems: "center",
        justifyContent: "center",
      },
      todayTxt: {
        fontSize: 12,
        color: theme.colors.text.badge,
      },
      todayViewTxt: {
        color: theme.colors.text.constrast,
      },
      /** Request detail */
      sectionTitle: {
        color: theme.colors.text.constrast,
      },
      btnSmall: {
        height: 30,
      },
      btnLarge: {
        height: 45,
        width: 60,
      },
      toggleBtn: {
        borderColor: theme.colors.text.helper,
      },
      toggleBtnContent: {
        color: theme.colors.text.helper,
      },
      saveBtn: { margin: 8 },
      saveBtnContent: {
        paddingTop: 10,
        paddingBottom: 10,
      },
    }),
  };
};
