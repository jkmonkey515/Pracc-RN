import React, { useContext, useMemo } from "react";
import { View, TouchableOpacity, Linking } from "react-native";
import { Text } from "react-native-paper";
import PlatformAvatar from "../../../components/platform-avatar";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/chat";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { PraccAppState } from "../../../reducers";

interface Props {
  offer: any;
  room: any;
}

const ChatInfo = ({ offer, room }: Props) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const { Settings } = useSelector((state: PraccAppState) => state.profile);
  const { games } = useSelector((state: PraccAppState) => state);
  const OtherTeam = room.Teams[1];
  const maps = useMemo(() => {
    if (!offer) return [];

    const {
      Maps,
      Team: { GameID },
    } = offer;
    return Maps
      ? Maps.map((mapID: number) => {
          const game = games.find((game) => game.Id === GameID);
          return (game?.Maps ?? []).find((map: { Id: number; }) => map.Id === mapID);
        })
      : [];
  }, [offer]);

  const groups = useMemo(() => {
    if (!OtherTeam) return [];

    const { Groups } = OtherTeam;
    return Groups.slice(0, 3);
  }, [OtherTeam]);

  const links = useMemo(() => {
    if (!OtherTeam) return [];

    const { Links } = OtherTeam;
    return Links.slice(0, 6);
  }, [OtherTeam]);

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const hasLinks = links.length > 0;

  return (
    <View style={styles.chatInfoContainer}>
      <View style={styles.gameInfoBox}>
        <View style={styles.mapBox}>
          {maps.map((map: any, index: number) => (
            <React.Fragment key={index}>
              <Text style={styles.mapText}>{map.Name}</Text>
              {index < maps.length - 1 && (
                <Text style={styles.separatorCommaLetter}>, </Text>
              )}
            </React.Fragment>
          ))}
        </View>
        {offer && (
          <View style={styles.timeInfo}>
            <Text style={styles.requestDate}>
              {moment(offer.Time).tz(Settings.LocalTimezone).format("MMMM Do")}
            </Text>
            <Text style={styles.requestDate}>
              {moment(offer.Time)
                .tz(Settings.LocalTimezone)
                .format(`${Settings.TimeFormatString} zz`)}
            </Text>
          </View>
        )}
      </View>
      {hasLinks && (
        <View style={{ flexDirection: "row", marginVertical: 3 }}>
          {links.map((link: { Type: React.Key | null | undefined; Url: string; }) => (
            <TouchableOpacity
              key={link.Type}
              onPress={() => handleLinkPress(link.Url)}
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
      <View style={styles.groupInfoBox}>
        {groups.map((group: any, index: number) => (
          <View key={index} style={styles.groupTextWrapper}>
            <Text style={styles.groupText}>
              {group.Name.length <= 10
                ? group.Name
                : `${group.Name.slice(0, 10)}...`}
            </Text>
            {index < groups.length - 1 && (
              <Text style={styles.separatorLetter}>|</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

export default ChatInfo;