import { StyleSheet } from "react-native";
import { commonStyles } from "./common";
import { colors } from "./colors";
import { AppTheme } from "../themes";

export const useStyles = (theme: AppTheme) => {
  return {
    ...commonStyles(theme),
    ...StyleSheet.create({
      // container: {
      //   backgroundColor: theme.colors.background,
      //   paddingVertical: 5,
      // },
      wrapper: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: theme.colors.surface,
        marginHorizontal: 5,
        marginBottom: 5,
      },
      teamInfo: { flexDirection: "row", alignItems: "center" },
      avatar: {
        marginRight: 5,
      },
      teamNameText: {
        fontWeight: "bold",
        color: theme.colors.text.title,
      },
      badge: {
        backgroundColor: theme.colors.spot,
        borderRadius: 50,
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
      },
      badgeText: {
        color: theme.colors.text.badge,
        fontSize: 12,
      },
      chatHistory: {
        flex: 1,
        flexGrow: 1,
        paddingBottom: 15,
        paddingLeft: 6,
        paddingRight: 6,
      },
      sendDiv: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 70,
        backgroundColor: theme.colors.surface,
        bottom: 0,
      },
      textInput: {
        width: "75%",
        height: 45,
        marginLeft: 10,
        borderRadius: 4,
        backgroundColor: colors.background.paper,
        borderColor: colors.text.hint,
        borderWidth: 1,
        color: colors.text.primary,
        padding: 6,
      },
      messageContainer: {
        width: "80%",
        backgroundColor: theme.colors.surface,
        borderRadius: 6,
        padding: 9,
      },
      textMessageDate: {
        color: theme.colors.text.helper,
      },
      personName: {
        color: theme.colors.text.title,
      },
      messageContent: {
        color: theme.colors.text.constrast,
      },
      messageHeader: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "space-between",
      },
      reasonTextInput: {
        padding: 6,
        borderRadius: 4,
        height: 45,
        marginTop: 5,
        borderColor: colors.grey["600"],
        borderWidth: 1,
      },
      chatInfoContainer: {
        padding: 10,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey["500"],
      },
      gameInfoBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 3,
      },
      platformLinkAvatar: {
        marginRight: 5,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: theme.colors.mark,
      },
      mapBox: {
        flex: 1,
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
      },
      mapText: {
        fontSize: 12,
        color: theme.colors.text.constrast,
      },
      groupInfoBox: {
        flexDirection: "row",
        marginVertical: 3,
      },
      groupTextWrapper: {
        flexDirection: "row",
        alignItems: "center",
      },
      separatorCommaLetter: {
        color: theme.colors.text.constrast,
      },
      separatorLetter: {
        color: theme.colors.text.helper,
        marginRight: 5,
      },
      groupText: {
        color: theme.colors.text.helper,
        marginRight: 5,
        fontSize: 13,
      },
      avatar: {
        marginRight: 5,
      },
      teamNameTextOnHeader: {
        fontWeight: "bold",
        color: theme.colors.header.activeText,
      },
      timeInfo: {
        justifyContent: "center",
        alignItems: "center",
      },
      requestDate: {
        color: theme.colors.text.constrast,
        fontSize: 13,
      },
    }),
  };
};
