import React, { useContext, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/auth";
import { colors } from "../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { PraccAppState } from "../../reducers";
import { loginViaSteam, loginWithPassword } from './actions';

const LoginScreen = () => {
  const { theme, isDarkTheme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoggedIn = useSelector((state: PraccAppState) => state.profile !== null);
  const showSpinner = useSelector((state: PraccAppState) => state.screens.login.showSpinner);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("App");
    }
  }, [isLoggedIn]);

  const login = () => {
    loginWithPassword(email, password)(dispatch);
  }

  const renderContent = () => {
    if (showPassword) {
      return (
        <React.Fragment>
          <TextInput
            label="Email"
            value={email}
            style={{ marginTop: 20 }}
            onChangeText={(email) => setEmail(email)}
            textContentType="emailAddress"
            theme={{
              colors: {
                primary: 'black'
              }
            }}
          />

          <TextInput
            label="Password"
            value={password}
            style={{ marginTop: 10 }}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry
            textContentType="password"
            theme={{
              colors: {
                primary: 'black'
              }
            }}
          />

          <Button
            style={{ marginTop: 10 }}
            contentStyle={{ paddingVertical: 8 }}
            mode="contained"
            onPress={login}
          >
            <Text style={{ color: isDarkTheme ? 'black' : 'white' }}>Login</Text>
          </Button>

          <View style={[styles.centered]}>
            <Button
              mode="text"
              style={{ marginTop: 10 }}
              textColor={colors.header.textInactive}
              onPress={() => setShowPassword(false)}
            >
              go back
            </Button>
          </View>
        </React.Fragment>
      );
    }

    return (
      <View style={{ flexDirection: "column", paddingHorizontal: 30 }}>
        <Button
          textColor={colors.header.text}
          style={styles.loginBtn}
          mode="outlined"
          onPress={() => setShowPassword(true)}
        >
          Login with Password
        </Button>

        <Button
          textColor={colors.header.text}
          style={styles.loginBtn}
          mode="outlined"
          onPress={() =>
            navigation.navigate("Auth", { screen: "ScanQrCode" })
          }
        >
          Login with QR Code
        </Button>
        <Button
          style={styles.loginBtn}
          mode="outlined"
          textColor={colors.header.text}
          onPress={() => loginViaSteam()(dispatch)}
        >
          Login with Steam
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={[styles.containerLoggedOut]}
      contentContainerStyle={{ flex: 1 }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 30,
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <View style={[styles.centered, { marginBottom: 30 }]}>
          <Image
            source={require("../../../assets/logo-white.png")}
            style={{ width: 227, height: 200 }}
          />
        </View>
        {renderContent()}
      </View>

      <Spinner
        textContent="Logging in..."
        style={{ color: "#fff" }}
        textStyle={{ color: "#fff" }}
        overlayColor="rgba(0, 0, 0, 0.75)"
        visible={showSpinner}
      />
    </KeyboardAwareScrollView>
  );
}

export default LoginScreen;