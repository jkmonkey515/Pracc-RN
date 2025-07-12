import React, {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useContext,
} from "react";
import { Calendar } from "react-native-calendars";
import { View, TouchableOpacity, Animated, Easing } from "react-native";
import { Text } from "react-native-paper";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDate } from "../actions";
import { MaterialIcons } from "@expo/vector-icons";
import { CalendarTheme } from "../../../themes";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/match";
import { PraccAppState } from "../../../reducers";

const DayPicker = forwardRef((props, ref) => {
  const { theme } = useContext(ThemeProvider);
  const calendarTheme = CalendarTheme(theme);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { currentDate } = useSelector((state: PraccAppState) => state.screens.matches);
  const calendarHeight = useRef(new Animated.Value(0)).current;
  const [isCalendarVisibility, setIsCalendarVisibility] = useState(false);

  const toggleCalendarVisibility = useCallback(() => {
    setIsCalendarVisibility((prevIsCalendarVisibility) => {
      Animated.timing(calendarHeight, {
        toValue: !prevIsCalendarVisibility ? 310 : 0,
        duration: 30,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
      return !prevIsCalendarVisibility;
    });
  }, [calendarHeight]);

  useImperativeHandle(ref, () => ({
    toggleCalendarVisibility: () => {
      if (isCalendarVisibility) {
        toggleCalendarVisibility();
      }
    },
  }));

  const changeCurrentDateOnCalendar = (date: { dateString: string | number | Date; }) => {
    setCurrentDate(new Date(date.dateString))(dispatch);
    toggleCalendarVisibility();
  };

  return (
    <View style={styles.dateContainer}>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={toggleCalendarVisibility}
      >
        <Text style={styles.dateText}>
          {moment(currentDate).format("dddd, MMMM DD")}
        </Text>
        <MaterialIcons
          name={isCalendarVisibility ? "arrow-drop-up" : "arrow-drop-down"}
          size={20}
          color={styles.dateText.color}
        />
      </TouchableOpacity>
      <Animated.View
        style={{
          height: calendarHeight,
          overflow: "hidden",
        }}
      >
        <Calendar
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.main,
            height: 310,
          }}
          markedDates={props.markedDates}
          theme={calendarTheme}
          onDayPress={changeCurrentDateOnCalendar}
        />
      </Animated.View>
    </View>
  );
});

export default DayPicker;