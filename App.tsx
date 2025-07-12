import React, { useState, useRef, useEffect, useCallback } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Updates from "expo-updates";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { Alert } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import * as Sentry from "sentry-expo";
import AppContainer from "./src/navigation";
import SnackbarContainer from "./src/components/snackbar-container";
import ErrorBoundary from "./src/components/error-boundary";
import { DarkTheme, LightTheme } from "./src/themes";
import { NavigationContainer } from "@react-navigation/native";
import ThemeProvider from "./src/components/theme-provider";
import createAppStore from "./src/utils/store";
import loadAssets from "./src/utils/loadAssets";
import { getThemeInfo, setThemeInfo } from "./src/utils/application";

Sentry.init({
  dsn: "https://8d48e15e21c5445fa93f28afed84bb01@sentry.nextlevelcsgo.com/6",
  enableInExpoDevelopment: false,
  debug: false,
});

const store = createAppStore();

const App = () => {
  const [orientation, setOrientation] = useState<ScreenOrientation.OrientationLock | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [theme, setTheme] = useState(LightTheme);
  const routeNameRef = useRef(null);
  const navigationRef = useRef(null);

  const requestOrientation = useCallback(() => {
    if (orientation === ScreenOrientation.OrientationLock.PORTRAIT) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }, [orientation]);

  useEffect(() => {
    requestOrientation();
  }, [])

  useEffect(() => {
    const getCurrentOrientation = async () => {
      const currentOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(currentOrientation);

      // Get theme info from secure storage
      const storedThemeInfo = await getThemeInfo();
      setTheme(storedThemeInfo === "light" ? LightTheme : DarkTheme);
      setIsDarkTheme(storedThemeInfo !== "light");
    }
    getCurrentOrientation();

    async function prepare() {
      // Load resources, etc.
      await SplashScreen.preventAutoHideAsync();
      // Show your app components
      await SplashScreen.hideAsync();
      // Load assets
      // await loadAssets();
    }

    const onFetchUpdateAsync = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
  
        if (update.isAvailable) {
          Alert.alert(
            "Update Available",
            "A new version is available. Do you want to update now?",
            [
              { text: "Update Now", onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              } },
              { text: "Later", onPress: () => console.log("Update postponed.") },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        // Alert.alert(`Error fetching latest Expo update: ${error}`);
      }
    }

    if (!__DEV__) {
      onFetchUpdateAsync();
    }

    prepare();

  }, []);

  const handleNavigationReady = () => {
    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
  }

  const handleStateChange = () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current.getCurrentRoute().name;

    routeNameRef.current = currentRouteName;
  }

  const toggleTheme = useCallback(async () => {
    setIsDarkTheme(!isDarkTheme);
    setTheme(isDarkTheme ? LightTheme : DarkTheme);

    await setThemeInfo();
  }, [isDarkTheme]);
  return (
    <ThemeProvider.Provider
      value={{
        isDarkTheme,
        theme,
        toggleTheme: toggleTheme,
      }}
    >
      <ReduxProvider store={store}>
        <PaperProvider theme={theme}>
          <ErrorBoundary>
            <NavigationContainer
              ref={navigationRef}
              onReady={handleNavigationReady}
              onStateChange={handleStateChange}
            >
              <StatusBar style="light" />
              <AppContainer />
            </NavigationContainer>
            <SnackbarContainer />
          </ErrorBoundary>
        </PaperProvider>
      </ReduxProvider>
    </ThemeProvider.Provider>
  );
}

export default App;
