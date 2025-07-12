import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useEffect, useState, useRef } from "react";
import { loadAccessToken } from "../../actions";
import { bindActionCreators } from "redux";
import IntroScreen from "../../components/intro-screen";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import * as Sentry from "sentry-expo";
import ThemeProvider from "../../components/theme-provider";
import { colors } from "../../styles/colors";
import { useStyles } from "../../styles/auth";
import { PraccAppState } from '../../reducers';
import { useNavigation } from "@react-navigation/native";

const AuthLoading = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isAuthLoaded = useSelector((state: PraccAppState) => state.isAuthLoaded);
  const hasProfile = useSelector((state: PraccAppState) => state.profile !== null);
  const { theme } = useContext(ThemeProvider);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const didMountRef = useRef(false);

  const checkIfReady = () => {
    if (isAuthLoaded) {
      navigation.navigate(hasProfile ? "App" : "Auth");
    }
  }

  useEffect(() => {
		if (didMountRef.current) {
		     checkIfReady();
		} else didMountRef.current = true;
	});


  const loadData = async () => {
    try {
      setLoadingError(null);
      loadAccessToken()(dispatch);
    } catch (e: any) {
      if (e.message && e.message.indexOf("Network request failed") >= 0) {
        setLoadingError("A network error occurred. Do you have Internet access?");
      } else {
        let message =
          "An error occurred while trying to load your profile data.";

        Sentry.Native.captureException(e);
        const eventId = Sentry.Native.lastEventId();
        if (eventId) {
          message += " Event-ID: " + eventId;
        }

        setLoadingError(message);
      }
    }
  }

  useEffect(() => {
    loadData();
  }, []);
  
  const styles = useStyles(theme);
  return (
    <IntroScreen>
      {loadingError === null ? (
        <View style={[{ flexDirection: "row" }, styles.centered]}>
          <ActivityIndicator
            color={colors.header.text}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: colors.header.text }}>Loading...</Text>
        </View>
      ) : (
        <View>
          <Text style={{ color: colors.header.text }}>
            {loadingError}
          </Text>
          <View>
            <Button onPress={() => loadData()}>Retry</Button>
          </View>
        </View>
      )}
    </IntroScreen>
  );
}

export default AuthLoading;
