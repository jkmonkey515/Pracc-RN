import { Profile } from "../types";

export const GAME_ID_CSGO = 1;
export const GAME_ID_LOL = 2;
export const GAME_ID_DOTA2 = 3;
export const GAME_ID_RB6 = 4;
export const GAME_ID_VALORANT = 5;

const games = [
  { id: GAME_ID_CSGO, key: "csgo", label: "Counter-Strike: Global Offensive" },
  { id: GAME_ID_LOL, key: "lol", label: "League of Legends" },
  { id: GAME_ID_DOTA2, key: "dota2", label: "Dota 2" },
  { id: GAME_ID_RB6, key: "rb6", label: "Rainbow Six" },
  { id: GAME_ID_VALORANT, key: "valorant", label: "Valorant" },
];

export function getGameForProfile(profile: Profile) {
  const gameId = profile && profile.Team ? profile.Team.GameID : 0;

  return getGameForId(gameId);
}

export function getGameForId(gameId: number) {
  for (const game of games) {
    if (game.id === gameId) {
      return game;
    }
  }

  return { id: gameId, key: "unknown", label: "Game #" + gameId };
}

export default games;
