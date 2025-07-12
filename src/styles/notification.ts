import { StyleSheet } from "react-native";
import { AppTheme } from "../themes";
import { commonStyles } from "./common";

export const useStyles = (theme: AppTheme) => {
  return {
    ...commonStyles(theme),
    ...StyleSheet.create({
      listWrapper: {
        marginTop: 10,
      },
      itemWrapper: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: theme.colors.surface,
        marginHorizontal: 10,
        marginBottom: 10,
      },
      avatar: {
        marginRight: 10,
      },
      heading: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      whatText: {
        flex: 3,
        fontWeight: "bold",
        color: theme.colors.text.title,
      },
      timeText: {
        flex: 1,
        fontSize: 12,
        color: theme.colors.text.helper,
        textAlign: "right",
      },
      whoText: {
        marginRight: 5,
        color: theme.colors.text.helper,
      },
      status: {
        width: 15,
        height: 15,
        borderRadius: 50,
        backgroundColor: theme.colors.text.helper,
      },
      descriptionText: {
        color: theme.colors.text.description,
        fontSize: 12,
      },
    }),
  };
};
