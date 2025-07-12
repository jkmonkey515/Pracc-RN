import { Image } from "react-native";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

async function cacheImages(images) {
  const prefetchTasks = images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });

  await Promise.all(prefetchTasks);
}

async function cacheFonts(fonts) {
  const loadFontTasks = fonts.map((font) => Font.loadAsync(font));
  await Promise.all(loadFontTasks);
}

const loadAssets = async () => {
  const imageAssets = cacheImages([
    require("../../assets/logo-white.png"),
    require("../../assets/platforms/99damage.png"),
    require("../../assets/platforms/cevo.png"),
    require("../../assets/platforms/esea.png"),
    require("../../assets/platforms/esl.png"),
    require("../../assets/platforms/faceit.png"),
    require("../../assets/platforms/hltv.png"),
    require("../../assets/platforms/liquipedia.png"),
    require("../../assets/platforms/dotabuff.jpg"),
    require("../../assets/platforms/opendota.jpg"),
    require("../../assets/platforms/opgg.jpg"),
    "https://s3-eu-west-1.amazonaws.com/pracc-static/images/unknown_team_full.jpg",
  ]);

  const fontAssets = cacheFonts([Ionicons.font]);

  await Promise.all([...imageAssets, ...fontAssets]);
};

export default loadAssets;
