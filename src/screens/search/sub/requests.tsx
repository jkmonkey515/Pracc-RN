import React, { useContext } from "react";
import ThemeProvider from "../../../components/theme-provider";
import { useSelector } from "react-redux";
import { useStyles } from "../../../styles/search";
import { Subheading, Text } from "react-native-paper";
import moment from "moment-timezone";
import TeamInfo from "./team-info";
import { TouchableOpacity, View } from "react-native";
import TeamRequest from "./request";
import { useNavigation } from "@react-navigation/native";
import { PraccAppState } from "../../../reducers";

interface Props {
  item: any;
}

const RequestListInDay = ({ item }: Props) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const navigation = useNavigation();

  const profile = useSelector((state: PraccAppState) => state.profile);
  const timezone = profile?.Settings.LocalTimezone;
  const timeFormat = profile?.Settings.TimeFormatString;

  const TimeEntries = ({ item, styles }) => {
    const team = profile?.Team;
    if (item.Match !== null) {
      let otherTeam;
      if (item.Match?.TeamLower?.ID === team?.ID) {
        otherTeam = item.Match.TeamHigher;
      } else {
        otherTeam = item.Match.TeamLower;
      }

      return (
        <TouchableOpacity
          style={styles.touchableResultItem}
          onPress={() => {
            navigation.navigate("Matches", {
              screen: "CalendarDetails",
              params: {
                match: item.Match,
              },
            });
          }}
        >
          <TeamInfo
            team={otherTeam}
            maps={[item.Match.Map]}
            gamesCount={item.Match.GamesCount}
            label="Match"
            typeTextStyles={[styles.itemLabel, styles.itemLabelMatch]}
          />
        </TouchableOpacity>
      );
    }

    const ownRequest = item.Requests.find((req: any) => req.Team.ID === team?.ID);

    return (
      <React.Fragment>
        {ownRequest && <TeamRequest request={ownRequest} />}

        {item.Offers.map((offer: any) => {
          let otherTeam, title;
          if (offer.FromTeam.ID === team?.ID) {
            otherTeam = offer.ToTeam;
            title = "Sent Offer";
          } else {
            otherTeam = offer.FromTeam;
            title = "Received Offer";
          }
          return (
            <TouchableOpacity
              style={styles.touchableResultItem}
              key={offer.ID}
              onPress={() => navigation.navigate("SearchOffer", { offer })}
            >
              <TeamInfo
                team={otherTeam}
                maps={offer.Maps}
                gamesCount={offer.Request.GamesCount}
                label={title}
                typeTextStyles={[styles.itemLabel, styles.itemLabelOffer]}
              />
            </TouchableOpacity>
          );
        })}

        {item.Requests.map((request: any) => {
          if (request.Team.ID === team?.ID) {
            return null;
          }

          return <TeamRequest key={request.Team.ID} request={request} />;
        })} 
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Subheading style={styles.subHeading}>
        {moment(item.Time).tz(timezone ?? "").format(`dddd Do, ${timeFormat} zz`)}
      </Subheading>
      <TimeEntries item={item} styles={styles} />
    </React.Fragment>
  );
}

export default RequestListInDay;
