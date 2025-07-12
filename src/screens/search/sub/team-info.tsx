import React, { useContext, useMemo } from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import RequestInfo from "./request-info";
import CommonGroups from "./group";
import { useSelector } from "react-redux";
import VerifiedBadge from "./verified-badge";
import { PraccAppState } from "../../../reducers";

interface Props {
  team: any;
  maps: any[];
  gamesCount: number;
  label: string;
  typeTextStyles: any;
}

const TeamInfo = ({
  team,
  maps,
  gamesCount,
  label,
  typeTextStyles,
}: Props) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const { profile, games } = useSelector((state: PraccAppState) => state);

  const activeMaps = useMemo(() => {
    const game = games.find((game) => game.Id === profile?.Team.GameID);

    if (game && game.Maps) {
      return game.Maps.filter((mapObj: any) => maps.includes(mapObj.Id));
    }

    return [];
  }, [profile, games, maps]);

  return (
    <View style={styles.teamInfoRow}>
      <View style={{ justifyContent: "center" }}>
        <Avatar.Image
          size={50}
          source={{ uri: team.Logo }}
          style={styles.avatarTeam}
        />
      </View>

      <View style={{ flexDirection: "column", flex: 1, paddingBottom: 5 }}>
        <View style={styles.textTeamNameWrapper}>
          <Text
            style={styles.textTeamName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {team.Name}
          </Text>
          <VerifiedBadge verified={team.Verified} color={theme.colors.mark} />
        </View>

        <View style={{ flexDirection: "row", marginRight: 5 }}>
          <View style={{ flex: 1 }}>
            <CommonGroups team={team} />
          </View>
          <View style={{ maxWidth: "50%" }}>
            <RequestInfo maps={activeMaps} gamesCount={gamesCount} />
          </View>
        </View>
      </View>
      <Text style={typeTextStyles}>{label}</Text>
    </View>
  );
}

export default TeamInfo;
