import React, { useContext } from "react";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { useSelector } from "react-redux";
import { Text } from "react-native-paper";
import { View } from "react-native";
import { PraccAppState } from "../../../reducers";

interface Props {
  team: any;
}

const CommonGroups = ({ team }: Props) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const { Team } = useSelector((state: PraccAppState) => state.profile);

  const GroupIds =
    team.CommonGroupIds.length > 3
      ? team.CommonGroupIds.slice(0, 3)
      : team.CommonGroupIds;

  return (
    <View style={styles.groupNames}>
      {GroupIds.map((groupId: number, index: number) => {
        const group = Team.Groups.find((g: any) => g.ID === groupId);
        if (!group) {
          return null;
        }

        return (
          <Text
            key={index}
            style={styles.textGroupName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {group.Name}
          </Text>
        );
      })}
    </View>
  );
}

export default CommonGroups;
