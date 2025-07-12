import React from "react";
import { Avatar } from "react-native-paper";
import {
  GAME_ID_CSGO,
  GAME_ID_DOTA2,
  GAME_ID_LOL,
  GAME_ID_RB6,
  getGameForProfile,
} from "../const/games";
import { Profile } from "../types";

const platformImages = {
  image_99damage: require("../../assets/platforms/99damage.png"),
  cevo: require("../../assets/platforms/cevo.png"),
  esea: require("../../assets/platforms/esea.png"),
  esl: require("../../assets/platforms/esl.png"),
  faceit: require("../../assets/platforms/faceit.png"),
  hltv: require("../../assets/platforms/hltv.png"),
  liquipedia: require("../../assets/platforms/liquipedia.png"),
  dotabuff: require("../../assets/platforms/dotabuff.jpg"),
  opendota: require("../../assets/platforms/opendota.jpg"),
  opgg: require("../../assets/platforms/opgg.jpg"),
  gamersclub: require("../../assets/platforms/gamersclub.jpg"),
  eslmeisterschaft: require("../../assets/platforms/eslmeisterschaft.png"),
};

export function getPlatformNamesForProfile(profile: Profile) {
  return getPlatformNamesForGameId(getGameForProfile(profile).id);
}

export function getPlatformNamesForGameId(gameId: number) {
  switch (gameId) {
    case GAME_ID_CSGO:
      return [
        "esea",
        "esl",
        "faceit",
        "cevo",
        "hltv",
        "liquipedia",
        "99damage",
      ];

    case GAME_ID_DOTA2:
      return ["dotabuff", "opendota", "liquipedia"];

    case GAME_ID_LOL:
      return ["opgg", "liquipedia"];

    case GAME_ID_RB6:
      return ["liquipedia"];

    default:
      return [];
  }
}

const PlatformAvatar = ({ platform = "none", ...otherProps }: { platform: string; size: number; style: any }) => {
  let platformName: string = platform;
  if (platformName === "99damage") {
    platformName = "image_99damage";
  }

  if (!platformImages.hasOwnProperty(platformName)) {
    return <Avatar.Text {...otherProps} label="P" />;
  }

  const src = platformImages[platformName];

  return <Avatar.Image {...otherProps} source={src} />;
}

export default PlatformAvatar;