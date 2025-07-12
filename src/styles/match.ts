import { StyleSheet } from "react-native";
import { commonStyles } from "./common";
import { colors } from "./colors";
import { AppTheme } from "../themes";

export const useStyles = (theme: AppTheme) => {
  return {
    ...commonStyles(theme),
    ...StyleSheet.create({
      dateContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.main,
      },
      dateBox: {
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.surface,
      },
      dateText: {
        color: theme.colors.text.title,
      },
      eventContainer: {
        backgroundColor: theme.colors.background,
        padding: 10,
      },
      eventTextInput: {
        backgroundColor: "transparent",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.main,
        color: theme.colors.text.constrast,
      },
      datetime: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.main,
      },
      datetimeLabel: {
        width: 50,
        color: theme.colors.text.helper,
      },
      datetimeText: {
        fontSize: 16,
        paddingVertical: 10,
        color: theme.colors.text.constrast,
      },
      colorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 15,
        paddingVertical: 25,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.main,
      },
      colorLabel: {
        color: theme.colors.text.constrast,
        fontSize: 16,
      },
      radioGroup: {
        flexDirection: "row",
        gap: 10,
      },
      radioWrapper: {
        borderWidth: 1,
        borderRadius: 50,
      },
      actionBox: {
        flexDirection: "row",
        padding: 15,
        justifyContent: "center",
        gap: 10,
      },
      deleteBtn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: theme.colors.secondary.main,
      },
      saveBtn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
      },
      cancelBtn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: colors.grey["600"],
      },
      /** Event Item */
      eventItemContainer: {
        width: '100%',
        height: '100%',
        padding: 5,
      },
      row: {
        flexDirection: "row",
        gap: 3,
        alignItems: "center",
      },
      title: {
        fontSize: 14,
        fontWeight: "bold",
      },
      summary: {
        fontSize: 12,
        color: colors.grey["700"],
      },
      map: {
        fontSize: 12,
        color: colors.grey["700"],
      },
      time: {
        fontSize: 12,
        color: colors.grey["500"],
      },
      status: {
        fontSize: 12,
      },
      cancelledStatus: {
        color: colors.secondary.main,
      },
      /** Agenda View */
      name: {
        fontSize: 17,
        color: theme.colors.text.title,
      },
      item: {
        flexDirection: "row",
        backgroundColor: theme.colors.surface,
        width: "75%",
        height: "100%",
        borderRadius: 5,
        padding: 12,
        alignItems: "center",
        justifyContent: "space-between",
      },
      itemDiv: {
        flexDirection: "row",
        width: "100%",
        marginTop: 4,
        marginBottom: 4,
        padding: 4,
        alignItems: "center",
        justifyContent: "space-between",
      },
      itemTimeLabel: {
        marginLeft: 6,
        marginRight: 6,
        color: theme.colors.text.constrast,
      },
      matchInfoDiv: {
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        width: "100%",
      },
      profile: {
        flexDirection: "column",
        marginLeft: 10,
        flex: 1,
      },
      /** Monthly View */
      todayView: {
        flexDirection: "row",
        width: "100%",
        height: 50,
        backgroundColor: colors.grey.A100,
        alignItems: "center",
        justifyContent: "center",
      },
      todayCircle: {
        backgroundColor: colors.primary.dark,
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 6,
        alignItems: "center",
        justifyContent: "center",
      },
      requestCircle: {
        backgroundColor: colors.secondary.dark,
        width: 4,
        height: 4,
        borderRadius: 2,
        marginRight: 4,
        alignItems: "center",
        justifyContent: "center",
      },
      todayTxt: {
        fontSize: 12,
        color: colors.primary.contractText,
      },
      todayViewTxt: {
        color: colors.grey.A400,
      },
      currentMatchesBox: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        minHeight: 300,
      },
      agendaTextWrap: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey["400"],
        paddingVertical: 5,
      },
      agendaText: {
        fontSize: 20,
      },
      eventColor: {
        width: 15,
        height: 15,
        borderRadius: 50,
      },
      /** Match Detail */
      teamName: {
        fontSize: 17,
        color: theme.colors.text.title,
      },
      matchInfo: {
        backgroundColor: theme.colors.surface,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey["500"],
      },
      matchInfoText: {
        color: theme.colors.text.description,
      },
      vsDiv: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      vsInfo: {
        alignItems: "center",
        justifyContent: "center",
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
      personName: {
        color: theme.colors.text.title,
      },
      textMessageDate: {
        color: theme.colors.text.helper,
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
      yearPicker: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
      },
      yearText: {
        color: theme.colors.text.constrast,
        fontSize: 20,
      },
      monthText: {
        textAlign: "center",
        color: theme.colors.text.constrast,
      },
      monthTextActive: {
        color: theme.colors.mark,
      },
    }),
  };
};
