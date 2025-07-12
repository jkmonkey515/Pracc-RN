import { Profile, GameType } from '../types';

export function getRegionsForProfile(profile: Profile, games: GameType[]) {
  if (!profile || !profile.Team || !games) {
    return [];
  }

  const game = games.find((game) => game.Id === profile.Team.GameID);
  return game ? game.Regions ?? [] : [];
}

export function getDefaultRegionForProfile(profile: Profile, games: GameType[]) {
  const regions = getRegionsForProfile(profile, games);
  return regions.length > 0 ? regions[0]?.Id : "";
}
