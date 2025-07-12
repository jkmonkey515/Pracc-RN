import React, { useContext } from "react";
import { View } from "react-native";
import { ActivityIndicator, Banner, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import ThemeProvider from "./theme-provider";
import { useStyles } from "../styles/setting";

const LoadingContainer = ({ loading }: { loading: boolean }) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  return (
    <View style={styles.componentContainer}>
      <View style={styles.bodyContainer}>
        <View style={[styles.body]}>
          {loading ? (
            <View style={[styles.centered, styles.loadingContainer]}>
              <ActivityIndicator
                style={{ marginBottom: 10 }}
                color={styles.activityIndicatorColor}
              />
              <Text style={styles.activityIndicatorText}>Loading</Text>
            </View>
          ) : (
            <Banner
              visible={true}
              actions={[]}
              image={({ size }) => <Ionicons name="alert" size={size} />}
            >
              Loading details failed. Please check your Internet connection
              and try again.
            </Banner>
          )}
        </View>
      </View>
    </View>
  );
}

export default LoadingContainer;
