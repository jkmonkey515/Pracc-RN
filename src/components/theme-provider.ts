import { createContext } from "react";
import { LightTheme } from "../themes";

const ThemeProvider = createContext({
  isDarkTheme: false,
  theme: LightTheme,
  toggleTheme: () => {},
});

export default ThemeProvider;
