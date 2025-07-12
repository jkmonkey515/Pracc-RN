import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, TouchableOpacity, Text } from "react-native";
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  RadioButton,
  TextInput,
} from "react-native-paper";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment-timezone";
import { saveEvent, deleteEvent, updateEvent } from "./actions";
import { queueMessage } from "../../components/snackbar-container";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/match";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { eventColors } from "../../const/colors";
import { useRoute, useNavigation } from '@react-navigation/native';
import { PraccAppState } from "../../reducers";

export default function CalendarEventAdd() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { Settings } = useSelector((state: PraccAppState) => state.profile);
  const { matches } = useSelector((state: PraccAppState) => state.screens.matches);
  const [eventID, setEventID] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [color, setColor] = useState("red");
  const [isDeletePortalOpen, setIsDeletePortalOpen] = useState(false);

  useEffect(() => {
    if (route.params?.eventID) {
      navigation.setOptions({ title: "Update External Event" });
      const event = matches.find((m) => m.ID === route.params?.eventID);
      setEventID(route.params?.eventID);
      setTitle(event.Title);
      setDescription(event.Description);
      setStartDate(new Date(event.Time));
      setEndDate(new Date(event.End));
      setColor(event.Color);
    }
  }, [route]);

  const handleStartDateConfirm = (date: any) => {
    setStartDatePickerVisibility(false);
    const newStartDate = moment(date, "UTC")
      .tz(Settings.LocalTimezone)
      .toDate();
    setStartDate(newStartDate);
  };

  const handleEndDateConfirm = (date) => {
    setEndDatePickerVisibility(false);
    const newEndDate = moment(date, "UTC").tz(Settings.LocalTimezone).toDate();
    setEndDate(newEndDate);
  };

  const onSaveEvent = () => {
    saveEvent({
      Title: title,
      Description: description,
      Time: startDate,
      End: endDate,
      Color: color,
    })(dispatch)
    queueMessage("success", "The event was saved!")(dispatch);
    navigation.goBack();
  };

  const onUpdateEvent = () => {
    updateEvent({
      ID: eventID,
      Title: title,
      Description: description,
      Time: startDate,
      End: endDate,
      Color: color,
    })(dispatch);
    queueMessage("success", "The event was updated!")(dispatch);
    navigation.goBack();
  };

  const onDeleteEvent = () => {
    deleteEvent(eventID)(dispatch);
    queueMessage("success", "The event was deleted!")(dispatch)
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.containerLoggedOut, styles.eventContainer]}
      contentContainerStyle={{ flex: 1 }}
    >
      <TextInput
        type="outlined"
        label="Title"
        style={styles.eventTextInput}
        textColor={styles.eventTextInput.color}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        type="flat"
        label="Description"
        style={styles.eventTextInput}
        textColor={styles.eventTextInput.color}
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity
        style={styles.datetime}
        onPress={() => setStartDatePickerVisibility(true)}
      >
        <Text style={styles.datetimeLabel}>Start:</Text>
        <Text style={styles.datetimeText}>
          {moment(startDate).format(
            `dddd, MMMM DD, ${Settings.TimeFormatString}`
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.datetime}
        onPress={() => setEndDatePickerVisibility(true)}
      >
        <Text style={styles.datetimeLabel}>End:</Text>
        <Text style={styles.datetimeText}>
          {moment(endDate).format(
            `dddd, MMMM DD, ${Settings.TimeFormatString}`
          )}
        </Text>
      </TouchableOpacity>
      <DateTimePicker
        display="inline"
        mode="datetime"
        isVisible={isStartDatePickerVisible}
        minimumDate={new Date()}
        date={startDate}
        onConfirm={handleStartDateConfirm}
        onCancel={() => {
          setStartDatePickerVisibility(false);
        }}
        style={{ height: 370 }}
      />
      <DateTimePicker
        display="inline"
        mode="datetime"
        isVisible={isEndDatePickerVisible}
        minimumDate={startDate}
        date={endDate}
        onConfirm={handleEndDateConfirm}
        onCancel={() => {
          setEndDatePickerVisibility(false);
        }}
        style={{ height: 370 }}
      />
      <View style={styles.colorBox}>
        <Text style={styles.colorLabel}>Color:</Text>
        <View style={styles.radioGroup}>
          {eventColors.map((colorOption) => (
            <View
              key={colorOption.label}
              style={[styles.radioWrapper, { borderColor: colorOption.value }]}
            >
              <RadioButton
                status={color === colorOption.label ? "checked" : "unchecked"}
                color={colorOption.value}
                onPress={() => setColor(colorOption.label)}
              />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.actionBox}>
        {eventID && [
          <Button
            mode="contained"
            contentStyle={[
              styles.deleteBtn,
              { backgroundColor: styles.btnSecondary.color },
            ]}
            onPress={() => setIsDeletePortalOpen(true)}
          >
            Delete
          </Button>,
          <Portal>
            <Dialog
              visible={isDeletePortalOpen}
              onDismiss={() => setIsDeletePortalOpen(false)}
              style={styles.modalContainer}
            >
              <Dialog.Title style={styles.modalTitle}>
                Delete Event
              </Dialog.Title>
              <Dialog.Content>
                <Paragraph style={styles.modalContent}>
                  Please confirm that you want to delete this event for this
                  time.
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setIsDeletePortalOpen(false)}
                  contentStyle={{
                    color: styles.btnPrimary.color,
                  }}
                >
                  Keep
                </Button>
                <Button
                  contentStyle={{
                    backgroundColor: styles.btnPrimary.color,
                  }}
                  onPress={onDeleteEvent}
                  mode="contained"
                >
                  Confirm Delete
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>,
        ]}
        <Button
          mode="contained"
          contentStyle={[
            styles.saveBtn,
            { backgroundColor: styles.btnPrimary.color },
          ]}
          onPress={eventID ? onUpdateEvent : onSaveEvent}
        >
          Save
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
