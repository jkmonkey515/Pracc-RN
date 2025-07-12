import { StyleSheet } from "react-native";

export const commonStyles = (theme) => {
  return StyleSheet.create({
    componentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.special,
      alignItems: "center",
      justifyContent: "center",
    },
    containerLoggedOut: {
      backgroundColor: theme.colors.header.background,
    },
    bodyContainer: {
      width: "100%",
      height: "100%",
    },
    body: {
      padding: 10,
      paddingBottom: 20,
    },
    bodyScroll: {
      paddingLeft: 10,
      paddingRight: 10,
    },
    paddedBodyScroll: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    stretched: {
      flex: 1,
      justifyContent: "space-between",
    },
    subHeading: {
      color: theme.colors.text.constrast,
    },
    mutedText: {
      color: theme.colors.text.disabled,
    },
    bannerContainer: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text.constrast,
    },
    bannerContent: {
      color: theme.colors.text.constrast,
    },
    menuContainer: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text.constrast,
    },
    menuItem: {
      color: theme.colors.text.constrast,
    },
    listItem: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.main,
    },
    listItemTitle: {
      color: theme.colors.text.constrast,
    },
    listItemText: {
      color: theme.colors.text.constrast,
      fontSize: 14,
    },
    listItemSmallText: {
      color: theme.colors.text.helper,
      fontSize: 14,
    },
    listItemHelper: {
      fontSize: 12,
      color: theme.colors.text.helper,
    },
    listItemLarge: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    listItemBorderTop: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.main,
    },
    center: {
      textAlign: "center",
    },

    centered: {
      justifyContent: "center",
      alignItems: "center",
    },

    overlay: {
      flex: 1,
      backgroundColor: theme.colors.action.disabledBackground,
      alignItems: "center",
      justifyContent: "center",
    },
    btnSelected: {
      borderColor: theme.colors.primary.main,
      color: theme.colors.primary.main,
    },
    btnUnselected: {
      borderColor: "#4b558c",
      color: "white",
    },
    btnChecked: {
      borderColor: theme.colors.mark,
    },
    btnDefault: {
      color: theme.colors.button.default,
    },
    btnPrimary: {
      color: theme.colors.button.primary,
    },
    btnSecondary: {
      color: theme.colors.button.secondary,
    },

    switchColor: theme.colors.mark,
    switchThumbColor: theme.colors.thumb,

    refreshColors: theme.colors.text.constrast,
    refreshTintColor: theme.colors.text.constrast,
    refreshTitleColor: theme.colors.text.constrast,

    activityIndicatorColor: theme.colors.text.constrast,
    activityIndicatorText: {
      color: theme.colors.text.constrast,
    },

    /** Logout Modal */
    modalContainer: {
      backgroundColor: theme.colors.surface,
    },
    modalTitle: {
      color: theme.colors.text.constrast,
    },
    modalContent: {
      color: theme.colors.text.constrast,
    },
  });
};
