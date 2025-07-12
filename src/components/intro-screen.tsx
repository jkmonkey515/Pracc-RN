import React from "react";
import { Image, View } from "react-native";
import ThemeProvider from "./theme-provider";
import { useStyles } from "../styles/auth";
import { ReactElement } from "react";
import { useContext } from "react";

const IntroScreen = ({ children }: { children: ReactElement }) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  return (
    <View style={[styles.componentContainer, styles.containerLoggedOut]}>
      <View>
        <Image
          source={require("./../../assets/logo-white.png")}
          style={{ width: 227, height: 200 }}
        />
      </View>
      <View style={{ marginTop: 20 }}>{children}</View>
    </View>
  )
}

export default IntroScreen;
