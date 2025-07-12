import React, { useContext } from "react";
import ThemeProvider from "../../../components/theme-provider";
import { useStyles } from "../../../styles/search";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface Props {
  maps: any[];
  gamesCount: number;
}

const RequestInfo = ({ maps, gamesCount }: Props) => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);

  if (maps.length > 0) {
    const visibleMaps = maps.length > 6 ? maps.slice(0, 5) : maps;
    return (
      <View style={styles.itemInfoContainer}>
        {visibleMaps.map((map, index) => (
          <Text key={index} style={styles.itemInfo}>
            {map.Name}
            {index !== visibleMaps.length - 1 ? "," : null}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <Text style={styles.itemInfo}>
      {gamesCount} {gamesCount === 1 ? "Game" : "Games"}
    </Text>
  );
}

export default RequestInfo;
