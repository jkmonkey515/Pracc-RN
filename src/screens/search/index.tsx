import { RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Banner, Button, Text } from "react-native-paper";
import * as backend from "../../utils/backend";
import { displayErrorMessage } from "../../components/snackbar-container";
import { Ionicons } from "@expo/vector-icons";
import { getTeamId } from "../../utils/profile";
import ThemeProvider from "../../components/theme-provider";
import { useStyles } from "../../styles/search";
import { colors } from "../../styles/colors";
import FilterBanner from "./sub/filter-banner";
import RequestListInDay from "./sub/requests";
import { useNavigation } from "@react-navigation/native";
import { convertSearchResults } from "./actions";
import LoadingContainer from "../../components/loading-container";
import { fetchGames } from "../../actions";
import { PraccAppState } from "../../reducers";

const SearchIndex = () => {
  const { theme } = useContext(ThemeProvider);
  const styles = useStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const profile = useSelector((state: PraccAppState) => state.profile);
  const filter = useSelector((state: PraccAppState) => state.filter);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const prevFilterRef = useRef(filter);

  const updateNavigationOptions = () => {
    navigation.setOptions({
      title: "Search",
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate("RequestsIndex")}
          compact
          style={[styles.centered, { marginRight: 5 }]}
        >
          <Text style={{ color: colors.header.text }}>
            <Ionicons name="add" size={25} />
          </Text>
        </Button>
      ),
    });
  };

  useEffect(() => {
    fetchGames()(dispatch);
    updateNavigationOptions();
    updateResults();
  }, []);

  useEffect(() => {
    if (profile && teamId !== getTeamId(profile) || prevFilterRef.current !== filter) {
      setResults([]);
      updateResults();
    }
  }, [profile, filter]);

  const updateResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const teamId = getTeamId(profile);
      const res = await backend.get(
        "search?filter=" + encodeURIComponent(JSON.stringify(filter))
      );
      const convertedResults = convertSearchResults(res.data, filter);
      setTeamId(teamId);
      setResults(convertedResults);
    } catch (e) {
      displayErrorMessage(e)(dispatch);
    } finally {
      setIsLoading(false);
    }
  }, [profile, filter]);

  const loadingTitle = results.length <= 0 ? "Loading" : "Refreshing";

  const isSearchWithSupporterBadgePossible = useMemo(() => {
    const isFilterEnabled = filter.Verified.Enabled;
    if (isFilterEnabled) {
      const currentTeam = profile?.Teams.find((team) => team.ID === teamId);
      if (currentTeam) {
        const isVerified = currentTeam.Boosts && currentTeam.Boosts.verified;
        return isVerified && isFilterEnabled;
      }
    }
    return true;
  }, [teamId, filter]);

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <FilterBanner />
        {isLoading ? (
          <LoadingContainer loading={isLoading} />
        ) : (
          <ScrollView
            style={[styles.bodyScroll, styles.paddedBodyScroll]}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={async () => {
                  if (!isLoading) {
                    updateResults();
                  }
                }}
                title={loadingTitle}
                colors={[styles.refreshColors]}
                tintColor={styles.refreshTintColor}
                titleColor={styles.refreshTitleColor}
              />
            }
          >
            <Banner
              visible={
                isSearchWithSupporterBadgePossible &&
                !isLoading &&
                results.length <= 0
              }
              style={styles.bannerContainer}
            >
              <Text style={styles.bannerContent}>
                No results found. Consider adjusting your search filter to
                broaden the search.
              </Text>
            </Banner>

            <Banner
              visible={!isSearchWithSupporterBadgePossible}
              style={styles.bannerContainer}
            >
              <Text style={styles.bannerContent}>
                You have not unlocked the Supporter Badge and therefore can not
                use this filter.
              </Text>
            </Banner>

            {isSearchWithSupporterBadgePossible &&
              results.map((item, index) => (
                <RequestListInDay key={index} item={item} />
              ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

export default SearchIndex;