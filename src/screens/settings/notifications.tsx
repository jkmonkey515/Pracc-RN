import React, { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import * as backend from "../../utils/backend";
import { List, Checkbox } from "react-native-paper";
import { displayErrorMessage } from "../../components/snackbar-container";
import { useDispatch } from "react-redux";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/setting";

const NotificationScreen = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const [notificationTypes, setNotificationTypes] = useState<{ [key: string]: boolean }>({});
  const [notificationTypeKeys, setNotificationTypeKeys] = useState<string[]>([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await backend.get("mobile-device/notifications");
        setNotificationTypes(res.data);
        setNotificationTypeKeys(Object.keys(res.data));
      } catch (e) {
        dispatch(displayErrorMessage(e));
      }
    }
    getNotifications();
  }, []);

  useEffect(() => {
    const sendNotifications = async () => {
      if (
        Object.keys(notificationTypes).length > 0
      ) {
        try {
          await backend.put("mobile-device/notifications", {
            json: {
              NotificationTypes: notificationTypes,
            },
          });
        } catch (e) {
          dispatch(displayErrorMessage(e));
        }
      }
    }
    sendNotifications();
  }, [notificationTypes]);

  const getNotificationName = (typeName: string) => {
    let label = typeName.replace(/[A-Z]/g, (match) => {
      return " " + match.toLowerCase();
    });
    label = label.slice(0, 1).toUpperCase() + label.slice(1);

    return label;
  }

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <ScrollView style={styles.bodyScroll}>
          <List.Section>
            {notificationTypeKeys.map((typeName) => {
              return (
                <List.Item
                  key={typeName}
                  style={[styles.listItem, styles.listItemLarge]}
                  title={<Text>{getNotificationName(typeName)}</Text>}
                  titleStyle={styles.listItemTitle}
                  onPress={() => {
                    setNotificationTypes((types) => ({
                      ...types,
                      [typeName]: !notificationTypes[typeName],
                    }))
                  }}
                  right={(props) => (
                    <Checkbox
                      {...props}
                      color={styles.btnChecked.borderColor}
                      status={
                        notificationTypes[typeName]
                          ? "checked"
                          : "unchecked"
                      }
                    />
                  )}
                />
              );
            })}
          </List.Section>
        </ScrollView>
      </View>
    </View>
  );
}

export default NotificationScreen;
