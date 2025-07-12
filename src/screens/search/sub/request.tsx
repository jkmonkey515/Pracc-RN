import React, { useContext } from "react";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import TeamInfo from "./team-info";
import { PraccAppState } from "../../../reducers";

interface Props {
  request: any;
}

const TeamRequest = ({ request }: Props) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const navigation = useNavigation();

  const { profile } = useSelector((state: PraccAppState) => state);

  const isOwnRequest = request.Team.ID === profile?.Team.ID;
  const label = isOwnRequest ? "Own Request" : "Request";

  return (
    <TouchableOpacity
      style={styles.touchableResultItem}
      key={request.ID}
      onPress={() => {
        navigation.navigate("SearchOffer", { request });
      }}
    >
      <TeamInfo
        team={request.Team}
        maps={request.Maps}
        gamesCount={request.GamesCount}
        label={label}
        typeTextStyles={[
          styles.itemLabel,
          isOwnRequest ? styles.itemLabelOwnRequest : styles.itemLabelRequest,
        ]}
      />
    </TouchableOpacity>
  );
}

export default TeamRequest;
