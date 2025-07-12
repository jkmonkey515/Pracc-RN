import { StyleSheet } from "react-native";
import { commonStyles } from "./common";
import { colors } from "./colors";
import { AppTheme } from "../themes";

export const useStyles = (theme: AppTheme) => {
  return {
    ...commonStyles(theme),
    ...StyleSheet.create({
      touchableResultItem: {
        backgroundColor: theme.colors.surface, //colors.grey["200"],
        marginTop: 5,
        marginBottom: 5,
      },
      teamInfoRow: {
        alignItems: "center",
        flexDirection: "row",
        overflow: "hidden",
        height: 70,
        position: "relative",
      },
      avatarTeam: {
        marginHorizontal: 5,
      },
      textTeamNameWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: "75%",
        marginTop: 3,
      },
      textTeamName: {
        marginRight: 5,
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text.title,
      },
      groupNames: {
        flexDirection: "column",
      },
      textGroupName: {
        fontSize: 12,
        color: theme.colors.text.helper,
      },
      itemLabel: {
        position: "absolute",
        top: 1,
        right: 1,
        padding: 3,
        fontSize: 10,
        zIndex: 100,
        textTransform: "uppercase",
        borderWidth: 1,
        alignSelf: "baseline",
      },
      itemInfoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
      },
      itemInfo: {
        fontSize: 12,
        color: theme.colors.text.description,
      },
      itemLabelRequest: {
        color: theme.colors.mark,
        borderColor: theme.colors.mark,
      },
      itemLabelOwnRequest: {
        color: colors.grey["700"],
        borderColor: colors.grey["700"],
      },
      itemLabelOffer: {
        color: colors.primary.contractText,
        backgroundColor: theme.colors.mark,
        borderWidth: 0,
      },
      itemLabelMatch: {
        color: colors.secondary.main,
        borderColor: colors.secondary.main,
      },
      filterContainer: {
        backgroundColor: theme.colors.bar,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.main,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
      },
      filterItem: {
        flexDirection: "column",
        alignItems: "center",
      },
      separator: {
        height: "80%",
        width: 1,
        backgroundColor: theme.colors.border.main,
      },
      noBorder: {
        borderRightWidth: 0,
      },
      filterOptionName: {
        fontWeight: "bold",
        color: theme.colors.text.constrast,
      },
      filterOptionValue: {
        color: theme.colors.text.helper,
        fontSize: 12,
      },
      hint: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 20,
      },
      hintText: {
        color: theme.colors.text.constrast,
        fontSize: 14,
      },
      profileDiv: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      headline: {
        color: theme.colors.text.title,
      },
      platformLinks: {
        marginBottom: 5,
        flexDirection: "row",
      },
      platformLinkAvatar: {
        marginRight: 8,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#ccc",
      },
      //   groupNames: {
      //     flexDirection: "column",
      //   },
      textGroupLabel: {
        fontSize: 12,
        color: theme.colors.text.helper,
        width: "80%",
        overflow: "hidden",
      },
      btnDiv: {
        flexDirection: "row",
        margin: 24,
        alignItems: "center",
        justifyContent: "center",
      },
      btnLargeContent: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
      },
      mapBtn: {
        height: 30,
        borderColor: theme.colors.text.helper,
      },
      mapBtnContent: {
        color: theme.colors.text.helper,
      },
      loadingContainer: {
        flexDirection: "row",
      },
    }),
  };
};
