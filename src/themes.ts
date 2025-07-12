import { DefaultTheme, MD3Theme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { colors } from "./styles/colors";

export interface AppTheme extends MD3Theme {
  colors: MD3Colors & {
    bar: string;
    accent: string;
    text: {
      constrast: string;
      title: string;
      helper: string;
      description: string;
      badge: string;
      disabled: string;
    };
    placeholder: string;
    border: {
      main: string;
      special: string;
    };
    mark: string;
    thumb: string;
    spot: string;
    button: {
      default: string;
      primary: string;
      secondary: string;
    };
    header: {
      background: string;
      activeText: string;
      inactiveText: string;
    };
    footer: {
      background: string;
      activeText: string;
      inactiveText: string;
    };
    action: {
      disabledBackground: string;
    };
  }
}

export const LightTheme: AppTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary.main,
    background: colors.background.default,
    surface: "#EEE",
    bar: "#EEE",
    accent: colors.secondary.dark,
    error: colors.error.main,
    text: {
      constrast: colors.grey[900],
      title: colors.primary.dark,
      helper: colors.grey[600],
      description: colors.grey[500],
      badge: "#fff",
      disabled: colors.grey[200],
    },
    placeholder: colors.text.secondary,
    backdrop: colors.action.disabledBackground,
    border: {
      main: "rgba(0, 0, 0, 0.38)",
      special: "rgba(0, 0, 0, 0.38)",
    },
    mark: "#0D47A1",
    thumb: "#FFF",
    spot: "#f44336",
    button: {
      default: "",
      primary: "#0D47A1",
      secondary: "#f44336",
    },
    header: {
      background: "#0D47A1", // "#303f9f",
      activeText: "#fff",
      inactiveText: "#fff",
    },
    footer: {
      background: "#0D47A1",
      activeText: "#fff",
      inactiveText: colors.grey[500],
    },
    action: {
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
};

export const DarkTheme: AppTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#fff",
    background: "#181D31", // "#0c1938",
    surface: "#24283B", // "#172039",
    bar: "#172840",
    accent: colors.secondary.dark,
    error: colors.error.main,
    text: {
      constrast: colors.grey[0],
      title: colors.grey[0],
      helper: colors.grey[300],
      description: colors.grey[600],
      disabled: colors.grey[900],
      badge: "#fff",
    },
    placeholder: colors.text.secondary,
    backdrop: colors.action.disabledBackground,
    border: {
      main: "#fff",
      special: "#f44336",
    },
    mark: "#59A6FF",
    thumb: colors.grey["300"],
    spot: "#f44336",
    button: {
      default: "",
      primary: "#59A6FF",
      secondary: "#f44336",
    },
    header: {
      background: "#0C1C3F", // "#152647",
      activeText: "#fff",
      inactiveText: "#fff",
    },
    footer: {
      background: "#0C1C3F",
      activeText: "#fff",
      inactiveText: "rgba(255, 255, 255, 0.5)",
    },
    action: {
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
};

export const defaultStackOptions = (theme: AppTheme) => {
  return {
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: theme.colors.header.background,
    },
    headerTintColor: theme.colors.header.activeText,
    headerTitleStyle: {
      flex: 1,
      textAlign: "center",
      fontWeight: "bold",
    },
    headerBackTitle: "",
  };
};

export const CalendarTheme = (theme: AppTheme) => {
  return {
    backgroundColor: theme.colors.background,
    calendarBackground: theme.colors.background,
    dayTextColor: theme.colors.text.constrast,
    textDisabledColor: theme.colors.text.description,
    monthTextColor: theme.colors.text.constrast,
    todayTextColor: theme.colors.text.title,
    selectedDayBackgroundColor: theme.colors.mark,
    selectedDayTextColor: theme.colors.text.badge,
    selectedDotColor: theme.colors.secondary.dark,
    arrowColor: theme.colors.mark,
    textDayFontSize: 14,
  };
};
