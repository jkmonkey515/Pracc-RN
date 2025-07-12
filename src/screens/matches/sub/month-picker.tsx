import React, {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import { View, TouchableOpacity, Animated, Easing } from "react-native";
import { Text } from "react-native-paper";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDate } from "../actions";
import { MaterialIcons } from "@expo/vector-icons";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/match";
import { FlatGrid } from "react-native-super-grid";
import { PraccAppState } from "../../../reducers";

//Separate Change Date types as constants
const DATE_CHANGE_TYPES = {
  PREVIOUS_YEAR: "prevYear",
  NEXT_YEAR: "nextYear",
  CHANGE_MONTH: "changeMonth",
};

// A list of all the months
const MONTHS = moment.monthsShort();

const MonthPicker = forwardRef((props, ref) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const { currentDate } = useSelector((state: PraccAppState) => state.screens.matches);
  const { Settings } = useSelector((state: PraccAppState) => state.profile);

  const monthPickerHeight = useRef(new Animated.Value(0)).current;
  const [isMonthPickerVisibility, setIsMonthPickerVisibility] = useState(false);

  const handleDateChange = useCallback(
    (changeType, monthIndex = null) => {
      let changedDate = moment(currentDate);
      switch (changeType) {
        case DATE_CHANGE_TYPES.PREVIOUS_YEAR:
          changedDate = changedDate.subtract(1, "year");
          break;
        case DATE_CHANGE_TYPES.NEXT_YEAR:
          changedDate = changedDate.add(1, "year");
          break;
        case DATE_CHANGE_TYPES.CHANGE_MONTH:
          changedDate = changedDate.month(monthIndex);
          toggleMonthPickerVisibility();
          break;
      }
      setCurrentDate(new Date(changedDate))(dispatch);
    },
    [currentDate, dispatch]
  );

  const toggleMonthPickerVisibility = useCallback(() => {
    setIsMonthPickerVisibility((prevIsMonthPickerVisibility) => {
      Animated.timing(monthPickerHeight, {
        toValue: !prevIsMonthPickerVisibility ? 120 : 0,
        duration: 30,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
      return !prevIsMonthPickerVisibility;
    });
  }, [monthPickerHeight]);

  useImperativeHandle(ref, () => ({
    toggleMonthPickerVisibility: () => {
      if (isMonthPickerVisibility) {
        toggleMonthPickerVisibility();
      }
    },
  }));

  const renderGridItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const currentItemFormat = `${item} ${moment(currentDate).year()}`;
      return (
        <TouchableOpacity
          onPress={() =>
            handleDateChange(DATE_CHANGE_TYPES.CHANGE_MONTH, index)
          }
        >
          <Text
            style={
              moment(currentDate).format("MMM YYYY") === currentItemFormat
                ? [styles.monthText, styles.monthTextActive]
                : styles.monthText
            }
          >
            {item}
          </Text>
        </TouchableOpacity>
      );
    },
    [currentDate, handleDateChange]
  );

  return (
    <View style={styles.dateContainer}>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={toggleMonthPickerVisibility}
      >
        <Text style={styles.dateText}>
          {moment(currentDate).tz(Settings.LocalTimezone).format("MMM YYYY")}
        </Text>
        <MaterialIcons
          name={isMonthPickerVisibility ? "arrow-drop-up" : "arrow-drop-down"}
          size={20}
          color={styles.dateText.color}
        />
      </TouchableOpacity>
      <Animated.View
        style={{
          height: monthPickerHeight,
          overflow: "hidden",
        }}
      >
        <View style={styles.yearPicker}>
          <TouchableOpacity
            onPress={() => handleDateChange(DATE_CHANGE_TYPES.PREVIOUS_YEAR)}
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={styles.dateText.color}
            />
          </TouchableOpacity>

          <Text style={styles.yearText}>{moment(currentDate).year()}</Text>
          <TouchableOpacity
            onPress={() => handleDateChange(DATE_CHANGE_TYPES.NEXT_YEAR)}
          >
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={styles.dateText.color}
            />
          </TouchableOpacity>
        </View>
        <View>
          <FlatGrid
            itemDimension={50}
            listKey={(item) => item}
            data={MONTHS}
            renderItem={renderGridItem}
          />
        </View>
      </Animated.View>
    </View>
  );
});

export default MonthPicker;
