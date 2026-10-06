import { VideoView, type VideoPlayer as ExpoVideoPlayer } from "expo-video";
import { Platform, View } from "react-native";

type Props = {
  player: ExpoVideoPlayer;
  width: number;
  height: number;
};

export function VideoPlayer({ player, width, height }: Props) {
  return (
    <View style={{ width, height, alignSelf: "center", overflow: "hidden", borderRadius: 12, backgroundColor: "black" }}>
      <VideoView
        player={player}
        nativeControls
        surfaceType={Platform.OS === "android" ? "textureView" : undefined}
        style={{ width, height }}
      />
    </View>
  );
}
