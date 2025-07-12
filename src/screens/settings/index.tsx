import { View, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import { connect, useDispatch, useSelector } from "react-redux";
import React, { useContext, useState, useEffect } from "react";
import * as actions from "./actions";
import {
  Avatar,
  Button,
  Dialog,
  List,
  Menu,
  Paragraph,
  Portal,
  Switch,
  Text,
  Title,
} from "react-native-paper";
import { resetAccessToken } from "../../logout-action";
import {
  displayErrorMessage,
  queueMessage,
} from "../../components/snackbar-container";
import * as backend from "../../utils/backend";
import * as Sentry from "sentry-expo";
import { bindActionCreators } from "redux";
import { selectTeam } from "../../actions";
import { Ionicons } from "@expo/vector-icons";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/setting";
import { colors } from "../../styles/colors";
import { TeamType } from '../../types';
import { useNavigation } from "@react-navigation/native";
import { PraccAppState } from "../../reducers";

interface TeamSelectProps {
  teams: TeamType[];
  selectedTeam: TeamType;
  onSelect: (id: number) => void;
}

const TeamSelect = ({ teams, selectedTeam, onSelect }: TeamSelectProps) => {
  const { theme } = useContext(ThemeProvider);
  const [open, setOpen] = useState(false);
  const styles = useStyles(theme);

  const onPress = () => {
    setOpen(teams.length > 1);
  }

  const selectTeam = (teamId: number) => {
    onSelect(teamId);
    setOpen(false);
  }

  return (
    <Menu
      visible={open}
      onDismiss={() => setOpen(false)}
      contentStyle={styles.menuContainer}
      anchor={
        <Button
          icon="group"
          mode="outlined"
          onPress={onPress}
          style={{ borderColor: styles.btnChecked.borderColor }}
          textColor={styles.btnChecked.borderColor}
        >
          {selectedTeam.Name}
          {teams.length > 1 && (
            <React.Fragment>
              {" "}
              <Ionicons name="arrow-down" />
            </React.Fragment>
          )}
        </Button>
      }
    >
      {teams.map((team) => (
        <Menu.Item
          key={team.ID}
          titleStyle={styles.menuItem}
          onPress={() => selectTeam(team.ID)}
          title={team.Name}
        />
      ))}
    </Menu>
  );
}

const Settings = () => {
  const { theme, isDarkTheme, toggleTheme } = useContext(ThemeProvider);
  const profile = useSelector((state: PraccAppState) => state.profile);
  const dispatch = useDispatch();
  const styles = useStyles(theme);
  const navigation = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT,
            lightColor: '#3D1FFF7C',
          });
        }

        const token = (await Notifications.getExpoPushTokenAsync({
          'projectId': Constants.expoConfig?.extra?.eas.projectId,
        })).data;
        await backend.put("mobile-device/push-token", {
          json: {
            Token: token,
          },
        });
        return token;
      }
    } catch (e) {
      displayErrorMessage(e)(dispatch);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: string) => {
      setToken(token);
    })
  }, []);

  const handleLogout = async () => {
    try {
      await backend.deleteRequest("mobile-device");
      resetAccessToken()(dispatch);
    } catch (e) {
      Sentry.Native.captureException(e);
      dispatch(displayErrorMessage(e));
    }
  }

  const onSelectTeam = (teamId: number) => {
    selectTeam(teamId)(dispatch)
  }

  const checkForUpdates = async () => {
    if (isCheckingUpdates) {
      return;
    }

    setIsCheckingUpdates(true);

    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (!isAvailable) {
        dispatch(queueMessage("success", "Your app version is up-to-date."));
      } else {
        await Updates.fetchUpdateAsync();
      }
    } catch (e) {
      dispatch(displayErrorMessage(e));
    } finally {
      setIsCheckingUpdates(false);
    }
  }

  if (profile === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={[styles.body, styles.stretched]}>
          <View>
            <View style={styles.profileDiv}>
              <View style={styles.menuDiv}>
                <Title style={styles.listItemTitle}>
                  {profile.PersonaName}
                </Title>
                {profile.Teams.length > 0 && (
                  <TeamSelect
                    teams={profile.Teams}
                    selectedTeam={profile.Team}
                    onSelect={onSelectTeam}
                  />
                )}
              </View>

              <Avatar.Image size={80} source={{ uri: profile.Avatar }} />
            </View>

            <List.Section>
              <List.Item
                style={[
                  styles.listItem,
                  styles.listItemLarge,
                  styles.listItemBorderTop,
                ]}
                title="Notifications"
                titleStyle={styles.listItemTitle}
                onPress={() => {
                  navigation.navigate("SettingsNotifications");
                }}
                right={(props) => (
                  <View style={styles.centered}>
                    <Ionicons
                      name="notifications"
                      color={styles.listItemHelper.color}
                    />
                  </View>
                )}
              />

              <List.Item
                style={[styles.listItem, styles.listItemLarge]}
                title="Local Timezone"
                titleStyle={styles.listItemTitle}
                right={(props) => (
                  <View style={styles.centered}>
                    <Text style={styles.listItemHelper}>
                      {profile.Settings.LocalTimezone}
                    </Text>
                  </View>
                )}
              />

              <List.Item
                style={[styles.listItem, styles.listItemLarge]}
                title="App Version"
                titleStyle={styles.listItemTitle}
                right={(props) => (
                  <View style={[styles.centered]}>
                    <Text style={styles.listItemHelper}>
                      {Constants.expoConfig.version}
                    </Text>
                  </View>
                )}
              />
              <List.Item
                style={[styles.listItem, styles.listItemLarge]}
                title="Dark Mode"
                titleStyle={styles.listItemTitle}
                right={() => (
                  <Switch
                    color={styles.switchColor}
                    thumbColor={styles.switchThumbColor}
                    value={isDarkTheme}
                    onValueChange={toggleTheme}
                  />
                )}
              />
            </List.Section>
          </View>

          <View>
            <Button
              mode="outlined"
              contentStyle={[styles.largeBtn]}
              textColor={styles.btnChecked.borderColor}
              style={{
                borderColor: styles.btnChecked.borderColor,
                marginBottom: 10,
              }}
              loading={isCheckingUpdates}
              onPress={checkForUpdates}
            >
              Check for Updates
            </Button>

            <Button
              contentStyle={styles.largeBtn}
              textColor={colors.error.main}
              style={{ borderColor: colors.error.main }}
              onPress={() => setLogoutDialogVisible(true)}
              mode="outlined"
            >
              Logout
            </Button>

            <Portal>
              <Dialog
                visible={logoutDialogVisible}
                onDismiss={() => setLogoutDialogVisible(true)}
                style={styles.modalContainer}
              >
                <Dialog.Title style={styles.modalTitle}>
                  Danger Zone
                </Dialog.Title>
                <Dialog.Content>
                  <Paragraph style={styles.modalContent}>
                    This will remove your login credentials from this device
                    along with any preference data.
                  </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    contentStyle={{
                      color: styles.btnPrimary.color,
                    }}
                    onPress={() =>
                      setLogoutDialogVisible(false)
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    contentStyle={{
                      backgroundColor: styles.btnPrimary.color,
                    }}
                    onPress={handleLogout}
                    mode="contained"
                  >
                    Ok, log me out
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Settings;
