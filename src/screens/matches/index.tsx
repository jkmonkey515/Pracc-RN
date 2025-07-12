import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarDayView from "./sub/day-view";
import CalendarWeekView from "./sub/week-view";
import CalendarAgendaView from "./sub/agenda-view";
import CalendarMonthView from "./sub/month-view";
import { HeaderLeftButtons, HeaderRightButtons } from "./sub/header";
import { fetchGames } from "../../actions";
import { PraccAppState } from "../../reducers";
import { useNavigation } from '@react-navigation/native';

const CalendarIndex = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { viewType } = useSelector((state: PraccAppState) => state.screens.matches);

  useEffect(() => {
    fetchGames()(dispatch);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftButtons navigation={navigation} dispatch={dispatch} />
      ),
      headerRight: () => <HeaderRightButtons navigation={navigation} />,
    });
  }, [navigation, dispatch]);

  switch (viewType) {
    case "agenda":
      return <CalendarAgendaView />;
    case "week":
      return <CalendarWeekView />;
    case "month":
      return <CalendarMonthView />;
    default:
      return <CalendarDayView />;
  }
}

export default CalendarIndex;