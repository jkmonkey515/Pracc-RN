import { Linking, SectionList, View, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import React, { useContext, useEffect, useState } from "react";
import { StackActions, useNavigation, useRoute } from "@react-navigation/native";
import { FlatGrid } from "react-native-super-grid/index";
import moment from "moment-timezone";
import * as backend from "../../utils/backend";
import {
  displayErrorMessage,
  queueMessage,
} from "../../components/snackbar-container";
import {
  Avatar,
  Button,
  Dialog,
  Headline,
  List,
  Paragraph,
  Portal,
  Text,
  Title,
} from "react-native-paper";
import ToggleButton from "../../components/toggle-button";
import { getTeamId } from "../../utils/profile";
import PlatformAvatar from "../../components/platform-avatar";
import LoadingContainer from "../../components/loading-container";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/search";
import VerifiedBadge from "./sub/verified-badge";
import { PraccAppState } from "../../reducers";

const Search_Offer = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const profile = useSelector((state: PraccAppState) => state.profile);
  const games = useSelector((state: PraccAppState) => state.games);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMaps, setSelectedMaps] = useState<any[]>([]);
  const [request, setRequest] = useState<any | null>(null);
  const [offer, setOffer] = useState<any | null>(null);
  const [offerId, setOfferId] = useState<number | null>(null);

  const updateNavigationOptions = () => {
    const { title = "Search Details" } = route.params;
    navigation.setOptions({
      title: title,
    });
  }

  const updateOffer = async () => {
    const offerId = route.params?.offerId;
    if (offerId) {
      setIsInitialLoading(true);
      try {
        const res = await backend.get("offers/" + offerId);
        setOffer(res.data);
        setIsInitialLoading(false);
      } catch (e) {
        displayErrorMessage(e)(dispatch);
        setIsInitialLoading(false);
      }
    } else {
      const request = route.params?.request;
      const offer = route.params?.offer;
      setOffer(offer);
      setRequest(request);
    }
  }

  const updateTitle = (request: any, offer: any) => {
    let title = "Search Details";
    if (request) {
      title = "Search Request";
    } else if (offer) {
      if (profile?.Team.ID === offer.FromTeam.ID) {
        title = "Sent Offer";
      } else {
        title = "Received Offer";
      }
    }

    navigation.setOptions({ title: title });
  }

  useEffect(() => {
    updateNavigationOptions();
    updateOffer();
  }, []);

  useEffect(() => {
    updateOffer();
  }, [route.params?.offerId])

  useEffect(() => {
    if (offer?.Match) {
      navigation.navigate("Matches", {
        screen: "CalendarDetails",
        params: { matchId: offer.Match.ID },
      });
    }
    updateTitle(request, offer);
  }, [offer, request]);

  const makeOffer = async (request: any) => {
    setIsLoading(true);
    try {
      const res = await backend.post("offers/make", {
        json: {
          SearchID: request.ID,
          Maps: selectedMaps,
        },
      });

      navigation.replace(route.name, {
        offer: res.data,
      });

      queueMessage("success", "Your offer was made!")(dispatch);
    } catch (e) {
      displayErrorMessage(e)(dispatch);
      setIsLoading(false);
    }
  }

  const doChat = async (request: any) => {
    setIsChatLoading(true);
    try {
      const res = await backend.post("chat", {
        json: {
          RequestID: request.ID,
          TeamID: request.Team.ID,
        },
      });

      navigation.navigate("Chats", {
        screen: "ChatRoom",
        params: {
          roomID: res.data.ID,
          Request: request,
          onBack: () =>
            navigation.navigate("SearchOffer", { request }),
        },
      });
    } catch (e) {
      displayErrorMessage(e)(dispatch);
    } finally {
      setIsChatLoading(false);
    }
  }

  const withdrawOffer = async (offer: any) => {
    setIsLoading(true);
    try {
      await backend.post("offers/withdraw", {
        json: {
          ID: offer.Request.ID,
        },
      });

      navigation.replace(route.name, {
        request: offer.Request,
      });

      queueMessage("success", "Your offer was withdrawn.")(dispatch);
    } catch (e) {
      displayErrorMessage(e)(dispatch);
    } finally {
      setIsLoading(false);
    }
  }

  const acceptOffer = async (offer: any) => {
    setIsLoading(true);
    try {
      const res = await backend.post("offers/accept", {
        body: JSON.stringify({
          OfferID: offer.ID,
          MapID:
            selectedMaps.length > 0 ? selectedMaps[0] : 0,
        }),
      });
      navigation.dispatch(StackActions.popToTop());
      navigation.navigate("Matches", {
        screen: "CalendarDetails",
        params: {
          match: res.data,
        },
      });

      queueMessage("success", "The offer was accepted!")(dispatch);
    } catch (e) {
      displayErrorMessage(e)(dispatch);
    } finally {
      setIsLoading(false);
    }
  }

  const removeRequest = async (request: any) => {
    setIsLoading(true);
    try {
      await backend.deleteRequest("requests/" + request.ID);
      navigation.goBack();
      queueMessage("success", "Your request was deleted!")(dispatch);
    } catch (e) {
      displayErrorMessage(e)(dispatch);
    } finally {
      setIsLoading(false);
      setIsDeleteOpen(false);
    }
  }

  if (!request && !offer) {
    return <LoadingContainer loading={isInitialLoading} />;
  }

  let team: { ID: number | null; Name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; Verified: number; Links: any[]; CommonGroupIds: any[]; Logo: any; } | null = null,
      time: null = null,
      availableMaps = [],
      gamesCount = 1,
      actions: string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element | null | undefined = null;
  
  if (request) {
    team = request.Team;
    time = request.Time;
    availableMaps = request.Maps || [];
    gamesCount = request.GamesCount;

    if (team?.ID === getTeamId(profile)) {
      actions = (
        <React.Fragment>
          <Button
            mode="contained"
            contentStyle={[
              styles.btnLargeContent,
              { backgroundColor: styles.btnSecondary.color },
            ]}
            onPress={() => setIsDeleteOpen(true)}
          >
            Delete Own Request
          </Button>

          <Portal>
            <Dialog
              visible={isDeleteOpen}
              onDismiss={() => setIsDeleteOpen(false)}
              style={styles.modalContainer}
            >
              <Dialog.Title style={styles.modalTitle}>
                Delete Your Own Request
              </Dialog.Title>
              <Dialog.Content>
                <Paragraph style={styles.modalContent}>
                  Please confirm that you want to delete your own request for
                  this time.
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setIsDeleteOpen(false)}
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
                  onPress={() => removeRequest(request)}
                  loading={isLoading}
                  mode="contained"
                >
                  Confirm Delete
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </React.Fragment>
      );
    } else {
      actions = (
        <React.Fragment>
          <Button
            mode="contained"
            style={{ marginHorizontal: 5 }}
            contentStyle={[
              styles.btnLargeContent,
              {
                backgroundColor: styles.btnPrimary.color,
              },
            ]}
            loading={isChatLoading}
            onPress={() => doChat(request)}
          >
            Message
          </Button>
          <Button
            mode="contained"
            style={{ marginHorizontal: 5 }}
            contentStyle={[
              styles.btnLargeContent,
              {
                backgroundColor: styles.btnPrimary.color,
              },
            ]}
            loading={isLoading}
            onPress={() => makeOffer(request)}
          >
            Make Offer
          </Button>
        </React.Fragment>
      );
    }
  } else if (offer) {
    time = offer.Request.Time;
    availableMaps = offer.Maps || [];
    gamesCount = offer.Request.GamesCount;

    if (profile?.Team.ID === offer.FromTeam.ID) {
      team = offer.ToTeam;

      actions = (
        <React.Fragment>
          <Button
            mode="contained"
            contentStyle={[
              styles.btnLargeContent,
              { backgroundColor: styles.btnSecondary.color },
            ]}
            loading={isLoading}
            onPress={() => withdrawOffer(offer)}
          >
            Withdraw Offer
          </Button>
        </React.Fragment>
      );
    } else {
      team = offer.FromTeam;
      actions = (
        <View style={{ flexDirection: "column" }}>
          {offer.HasLost ? (
            <Text>Already expired</Text>
          ) : (
            <Button
              mode="contained"
              contentStyle={[
                styles.btnLargeContent,
                { backgroundColor: styles.btnPrimary.color },
              ]}
              loading={isLoading}
              onPress={() => acceptOffer(offer)}
            >
              Accept Offer
            </Button>
          )}
        </View>
      );
    }
  }

  const maps: any[] = [];
  for (const mapID of availableMaps) {
    const game = games.find((game) => game.Id === profile?.Team.GameID);
    if (game) {
      const map = (game?.Maps ?? []).find((m: any) => m.Id === mapID);
      maps.push({
        ...map,
        checked: selectedMaps?.indexOf(mapID) >= 0,
      });
    }
  }

  const sectionData = [
    { data: [1], key: "profile" },
    { data: [2], key: "date" },
    { data: [3], key: "map" },
    { data: [4], key: "action" },
  ];

  const renderMapEntry = (item: any, isOwnOffer: boolean) => {
    return (
      <ToggleButton
        style={styles.mapBtn}
        contentStyle={styles.mapBtnContent}
        checked={item.checked}
        label={item.Name}
        disabled={offer?.HasLost || isOwnOffer}
        onPress={() => {
          const allowMultiple = route.params.request !== undefined;

          let newSelectedMaps = [];

          if (allowMultiple) {
            if (item.checked) {
              newSelectedMaps = selectedMaps.filter(
                (v) => v !== item.Id
              );
            } else {
              newSelectedMaps = [...selectedMaps];
              newSelectedMaps.push(item.Id);
            }
          } else {
            if (item.checked) {
              newSelectedMaps = [];
            } else {
              newSelectedMaps = [item.Id];
            }
          }

          setSelectedMaps(newSelectedMaps);
        }}
      />
    );
  };

  const _renderItem = ({ item, index, section }) => {
    if (section.key == "profile") {
      console.log(JSON.stringify(item), index, section)
      return (
        <View style={styles.profileDiv}>
          <View style={{ width: "70%" }}>
            <View
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Headline style={[styles.headline, { marginRight: 5 }]}>
                {team?.Name}
              </Headline>
              <VerifiedBadge
                verified={team?.Verified}
                color={theme.colors.mark}
              />
            </View>
            {team?.Links.length > 0 && (
              <View style={styles.platformLinks}>
                {team?.Links.map((link) => (
                  <TouchableOpacity
                    key={link.Type}
                    onPress={() => Linking.openURL(link.Url)}
                  >
                    <PlatformAvatar
                      style={styles.platformLinkAvatar}
                      platform={link.Type}
                      size={35}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.groupNames}>
              {team?.CommonGroupIds.map((groupId) => {
                const group = profile?.Team.Groups.find(
                  (g) => g.ID === groupId
                );
                if (!group) {
                  return null;
                }

                return (
                  <Text key={groupId} style={styles.textGroupLabel}>
                    {group.Name}
                  </Text>
                );
              })}
            </View>
          </View>

          <Avatar.Image size={90} source={{ uri: team?.Logo }} />
        </View>
      );
    }

    if (section.key == "date") {
      return (
        <React.Fragment>
          {availableMaps.length > 0 && (
            <Title style={[styles.center, styles.listItemTitle]}>
              Date & Time
            </Title>
          )}
          <List.Section>
            <List.Item
              style={[styles.listItem, styles.listItemLarge]}
              title="Date"
              titleStyle={styles.listItemTitle}
              right={() => (
                <View style={styles.centered}>
                  <Text style={styles.listItemSmallText}>
                    {moment(time ?? new Date())
                      .tz(profile?.Settings.LocalTimezone ?? "")
                      .format("MMMM Do")}
                  </Text>
                </View>
              )}
            />

            <List.Item
              style={[styles.listItem, styles.listItemLarge]}
              title="Time"
              titleStyle={styles.listItemTitle}
              right={() => (
                <View style={styles.centered}>
                  <Text style={styles.listItemSmallText}>
                    {moment(time ?? new Date())
                      .tz(profile?.Settings.LocalTimezone)
                      .format(
                        profile?.Settings.TimeFormatString + " zz"
                      )}
                  </Text>
                </View>
              )}
            />

            {availableMaps.length <= 0 && (
              <List.Item
                style={[styles.listItem, styles.listItemLarge]}
                title="Games Count"
                titleStyle={styles.listItemTitle}
                right={() => (
                  <View style={styles.centered}>
                    <Text
                      style={[
                        styles.centered,
                        styles.listItemSmallText,
                      ]}
                    >
                      {gamesCount}{" "}
                      {gamesCount === 1 ? "Game" : "Games"}
                    </Text>
                  </View>
                )}
              />
            )}
          </List.Section>
        </React.Fragment>
      );
    }
    if (section.key == "map") {
      if (availableMaps.length > 0) {
        return (
          <React.Fragment>
            <Title style={[styles.center, styles.listItemTitle]}>
              Map
            </Title>
            <FlatGrid
              itemDimension={80}
              data={maps}
              renderItem={({ item }) =>
                renderMapEntry(
                  item,
                  team?.ID === getTeamId(profile)
                )
              }
            />
          </React.Fragment>
        );
      }
      return null;
    }
    if (section.key == "action") {
      return <View style={styles.btnDiv}>{actions}</View>;
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <SectionList
          sections={sectionData}
          keyExtractor={(_item, index) => index}
          style={styles.bodyScroll}
          contentContainerStyle={{ paddingTop: 5 }}
          renderItem={_renderItem}
        />
      </View>
    </View>
  );
}

export default Search_Offer;
