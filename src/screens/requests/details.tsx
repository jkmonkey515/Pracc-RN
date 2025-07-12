import { Text, TouchableOpacity, View, SectionList } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { FlatGrid } from "react-native-super-grid";
import moment from "moment-timezone";
import {
  getDefaultRegionForProfile,
  getRegionsForProfile,
} from "../../const/regions";
import { SERVER_TIMEZONE } from "../../const/timezone";
import { Button, Subheading, Switch, Title } from "react-native-paper";
import {
  displayErrorMessage,
  queueMessage,
} from "../../components/snackbar-container";
import * as backend from "../../utils/backend";
import ToggleButton from "../../components/toggle-button";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/requests";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PraccAppState } from "../../reducers";
import { updateRequestsForDate } from "./actions";
import { MapType } from "@/src/types";

const RequestDetail = () => {
  const {theme} = useContext(ThemeProvider);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { profile, games } = useSelector((state: PraccAppState) => state);
  const { requestsByDate, region } = useSelector((state: PraccAppState) => state.screens.requests);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedMaps, setSelectedMaps] = useState<number[]>([]);
  const [selectedMapsPerTime, setSelectedMapsPerTime] = useState<{ [key: string]: [] }>({});
  const [numberOfGamesPerTime, setNumberOfGamesPerTime] = useState<{ [key: string]: number }>({});
  const [sameMapsForAllTimes, setSameMapsForAllTime] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const updateNavigationOptions = ({ day }: { day: any }) => {
    const selectedDay = new Date();
    selectedDay.setFullYear(day.year, day.month - 1, day.day);
    navigation.setOptions({
      title: `Requests for ${moment(selectedDay).format("MMMM Do")}`,
    });
  }

  const maps = useMemo(() => {
    if (games.length > 0) {
      const game = games.find((game) => game.Id === profile?.Team.GameID);
      if (game) {
        return game.Maps?.filter((m) => !m.Inactive) ?? [];
      }
      return [];
    }
    return [];
  }, [profile]);

  useEffect(() => {
      setSelectedMaps(maps.map((m) => m.Id));
  }, [maps]);

  useEffect(() => {
    if (profile) {
      const { day } = route.params;
      const timezone = profile?.Settings.LocalTimezone;
      updateNavigationOptions({ day });

      const requests = requestsByDate.hasOwnProperty(day.dateString)
        ? requestsByDate[day.dateString]
        : [];

      let selectedRegion =
        region || getDefaultRegionForProfile(profile, games);
      if (requests.length > 0) {
        selectedRegion = requests[0].Region;
      }

      const selectedTimes = [];
      let sameMapsForAllTimes = true;
      let prevMaps = null;
      let selectedMapsPerTime: { [key: string]: string } = {};
      const numberOfGamesPerTime: { [key: string]: number } = {};
      for (const req of requests) {
        const timeStr = moment(req.Time).tz(timezone).format();
        selectedTimes.push(timeStr);
        selectedMapsPerTime[timeStr] = req.Maps;

        numberOfGamesPerTime[timeStr] = req.GamesCount;

        if (sameMapsForAllTimes) {
          if (prevMaps === null) {
            prevMaps = req.Maps;
          } else {
            if (prevMaps.length !== req.Maps.length) {
              sameMapsForAllTimes = false;
            } else {
              for (const mapIndex of prevMaps) {
                if (req.Maps.indexOf(mapIndex) < 0) {
                  sameMapsForAllTimes = false;
                  break;
                }
              }
            }
          }
        }
      }

      let selectedMaps = maps.map((m) => m.Id);
      if (sameMapsForAllTimes) {
        selectedMapsPerTime = {};

        if (prevMaps !== null) {
          selectedMaps = prevMaps;
        }
      }
      setSelectedRegion(selectedRegion);
      setSelectedMaps(selectedMaps);
      setSelectedMapsPerTime(selectedMapsPerTime);
      setSelectedTimes(selectedTimes);
      setSameMapsForAllTime(sameMapsForAllTimes);
      setNumberOfGamesPerTime(numberOfGamesPerTime);
    }

  }, [profile, route]);

  const saveRequests = async () => {
    if (isSaving) {
      return;
    }

    const day = route.params?.day;

    const localTimeReference = moment()
      .tz(SERVER_TIMEZONE)
      .minute(0)
      .seconds(0)
      .tz(profile?.Settings.LocalTimezone ?? "")
      .year(day.year)
      .month(day.month - 1)
      .date(day.day);

    const startTime = localTimeReference.clone().hour(0).format();
    const endTime = localTimeReference.clone().hour(0).add(1, "days").format();

    const requests = [];
    for (const requestedTime of selectedTimes) {
      let maps: number[] = selectedMaps;
      if (
        !sameMapsForAllTimes &&
        selectedMapsPerTime.hasOwnProperty(requestedTime)
      ) {
        maps = selectedMapsPerTime[requestedTime];
      }

      let gamesCount = 1;
      if (numberOfGamesPerTime.hasOwnProperty(requestedTime)) {
        gamesCount = numberOfGamesPerTime[requestedTime];
      }

      requests.push({
        Time: requestedTime,
        Maps: maps,
        GamesCount: gamesCount,
      });
    }
    try {
      setIsSaving(true);
      const res = await backend.put("requests", {
        json: {
          Region: selectedRegion,
          StartTime: startTime,
          EndTime: endTime,
          Requests: requests,
        },
      });
      updateRequestsForDate(day.dateString, res.data)(dispatch);
      queueMessage("success", "Your requests were updated.")(dispatch);
      navigation.navigate("RequestsIndex");
    } catch (e) {
      displayErrorMessage(e)(dispatch);
      setIsSaving(false);
    } finally {
      setIsSaving(false);
    }
  }

  const handleMapSwitch = useCallback(() => {
    setSameMapsForAllTime(!sameMapsForAllTimes)
  }, [sameMapsForAllTimes]);

  const styles = useStyles(theme);

  if (!profile) {
    return null;
  }

  const renderMapItem = (selected: number[] = [], mapsUpdater: any, item: MapType & { checked: boolean }) => {
    return (
      <ToggleButton
        key={item.Id}
        contentStyle={styles.toggleBtnContent}
        style={[styles.btnSmall, styles.toggleBtn]}
        checked={item.checked}
        onPress={() => {
          const newSelectedMaps: number[] = [...selected];

          if (item.checked) {
            const index = newSelectedMaps.indexOf(item.Id);
            if (index >= 0) {
              newSelectedMaps.splice(index, 1);
            }
          } else {
            newSelectedMaps.push(item.Id);
          }

          mapsUpdater(newSelectedMaps);
        }}
        label={item.Name}
      />
    );
  };

  const renderGameCount = (selectedTime: any, { item }: any) => {
    return (
      <ToggleButton
        contentStyle={styles.toggleBtnContent}
        style={[styles.btnSmall, styles.toggleBtn]}
        key={item.count}
        checked={item.checked}
        onPress={() => {
          setNumberOfGamesPerTime((prev) => ({
            ...prev,
            [selectedTime]: item.count
          }))
        }}
        label={"" + item.count}
      />
    );
  };

  const renderTimes = () => {
    const day = route.params?.day;

    const selectedDay = new Date();
    selectedDay.setFullYear(day.year, day.month - 1, day.day);

    const localTimeReference = moment()
      .tz(SERVER_TIMEZONE)
      .minute(0)
      .seconds(0)
      .tz(profile?.Settings.LocalTimezone)
      .year(day.year)
      .month(day.month - 1)
      .date(day.day);

    const localTimeToday = moment.tz(profile?.Settings.LocalTimezone);

    const today = new Date();
    today.setFullYear(
      localTimeToday.year(),
      localTimeToday.month(),
      localTimeToday.date()
    );

    return (
      <React.Fragment>
        <Title style={[styles.center, styles.sectionTitle]}>Times</Title>
        <Subheading style={[styles.center, styles.subHeading]}>
          (in your local timezone{" "}
          {moment.tz(profile?.Settings.LocalTimezone).format("ZZ zz")})
        </Subheading>

        <View>
          <FlatGrid
            itemDimension={55}
            listKey={(item, index) => index}
            data={[...Array(24).keys()].map((hour) => {
              const time = localTimeReference.clone().hour(hour);

              return {
                hour,
                time,
                checked: selectedTimes.indexOf(time.format()) >= 0,
              };
            })}
            renderItem={({ item }) => {
              return (
                <ToggleButton
                  key={item.hour}
                  checked={item.checked}
                  contentStyle={styles.toggleBtnContent}
                  style={[styles.btnSmall, styles.toggleBtn]}
                  label={item.time.format(profile?.Settings.TimeFormatString)}
                  onPress={() => {
                    const newTimes = [...selectedTimes];
                    if (!item.checked) {
                      newTimes.push(item.time.format());
                    } else {
                      const index = newTimes.indexOf(item.time.format());
                      if (index >= 0) {
                        newTimes.splice(index, 1);
                      }
                    }

                    newTimes.sort((a, b) => {
                      if (moment(a).isBefore(moment(b))) {
                        return -1;
                      } else {
                        return 1;
                      }
                    });
                    setSelectedTimes(newTimes);
                  }}
                />
              );
            }}
          />
        </View>
      </React.Fragment>
    );
  }

  const renderRegion = () => {
    const regions = getRegionsForProfile(profile, games);
    return (
      <React.Fragment>
        <Title style={[styles.center, styles.sectionTitle]}>Region</Title>
        <FlatGrid
          itemDimension={50}
          listKey={(item) => item.Id}
          data={regions.map((region) => ({
            ...region,
            checked: selectedRegion === region.Id,
          }))}
          renderItem={({ item }) => (
            <ToggleButton
              key={item.Id}
              contentStyle={styles.toggleBtnContent}
              style={[styles.btnLarge, styles.toggleBtn]}
              label={item.Label}
              checked={item.checked}
              onPress={() => {
                setSelectedRegion(item.Id);
              }}
            />
          )}
        />
      </React.Fragment>
    );
  }

  const renderGamesCount = () => {
    if (maps.length > 0 || selectedTimes.length <= 0) {
      return null;
    }

    return (
      <React.Fragment>
        <Title style={[styles.center, styles.sectionTitle]}>
          Number of Games
        </Title>

        <View style={{ flexDirection: "column", alignItems: "center" }}>
          {selectedTimes.map((selectedTime) => {
            const currentValue =
              numberOfGamesPerTime[selectedTime] || 1;

            return (
              <View
                key={selectedTime}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 60,
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: 8,
                  }}
                >
                  <Text style={styles.listItemSmallText}>
                    {moment(selectedTime)
                      .tz(profile.Settings.LocalTimezone)
                      .format(profile.Settings.TimeFormatString)}
                  </Text>
                </View>

                <View>
                  <FlatGrid
                    itemDimension={40}
                    data={[1, 2, 3, 5].map((count) => {
                      return {
                        count,
                        checked: currentValue === count,
                      };
                    })}
                    renderItem={(item) =>
                      renderGameCount(selectedTime, item)
                    }
                  />
                </View>
              </View>
            );
          })}
        </View>
      </React.Fragment>
    );
  }

  const renderMaps = () => {

    if (maps.length <= 0 || selectedTimes.length <= 0) {
      return null;
    }

    return (
      <React.Fragment>
        <Title style={[styles.center, styles.sectionTitle]}>Maps</Title>
        <View
          style={[{ display: "flex", flexDirection: "row" }, styles.centered]}
        >
          <Switch
            color={styles.switchColor}
            thumbColor={styles.switchThumbColor}
            value={sameMapsForAllTimes}
            onValueChange={handleMapSwitch}
            style={{ marginRight: 10 }}
          />
          <TouchableOpacity
            onPress={handleMapSwitch}
          >
            <Text style={styles.subHeading}>same maps for all times</Text>
          </TouchableOpacity>
        </View>

        {sameMapsForAllTimes ? (
          renderMapList(maps, selectedMaps, (selectedMaps: React.SetStateAction<any[]>) =>
            setSelectedMaps(selectedMaps)
          )
        ) : (
          <React.Fragment>
            {selectedTimes.map((selectedTime) => {
              const selectedMaps =
                selectedMapsPerTime[selectedTime] ||
                selectedMaps;

              return (
                <View
                  style={{ display: "flex", flexDirection: "row" }}
                  key={selectedTime}
                >
                  <View
                    style={[{ width: 60, paddingBottom: 10 }, styles.centered]}
                  >
                    <Text style={styles.subHeading}>
                      {moment(selectedTime)
                        .tz(profile.Settings.LocalTimezone)
                        .format(profile.Settings.TimeFormatString)}
                    </Text>
                  </View>
                  <View style={{ flexGrow: 1 }}>
                    {renderMapList(maps, selectedMaps, (newMaps: any) =>
                      setSelectedMapsPerTime((prev) => ({
                        ...prev,
                        [selectedTime]: newMaps
                      }))
                    )}
                  </View>
                </View>
              );
            })}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  const renderMapList = (maps: MapType[], selected: number[] = [], mapsUpdater: any) => {
    return (
      <View>
        <FlatGrid
          itemDimension={80}
          staticDimension={sameMapsForAllTimes ? undefined : 300}
          data={maps.map((map) => {
            return {
              ...map,
              checked: selected.indexOf(map.Id) >= 0,
            };
          })}
          renderItem={(item) =>
            renderMapItem(selected, mapsUpdater, item.item)
          }
        />
      </View>
    );
  }

  const sectionData = [
    { data: [1], key: "region" },
    { data: [2], key: "times" },
    { data: [3], key: "maps" },
    { data: [4], key: "gamecount" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <SectionList
          sections={sectionData}
          keyExtractor={(item, index) => item + index}
          style={styles.bodyScroll}
          renderItem={({ item, index, section }) => {
            if (section.key == "region") {
              return renderRegion();
            }
            if (section.key == "times") {
              return renderTimes();
            }
            if (section.key == "maps") {
              return renderMaps();
            }
            return renderGamesCount();
          }}
          renderSectionFooter={({ section }) => {
            if (section.key == "gamecount") {
              return (
                <Button
                  mode="contained"
                  icon="content-save"
                  loading={isSaving}
                  onPress={saveRequests}
                  contentStyle={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: styles.btnPrimary.color,
                  }}
                  style={{ margin: 8 }}
                >
                  Save Requests
                </Button>
              );
            }
            return null;
          }}
        />
      </View>
    </View>
  );
}

export default RequestDetail;
