import { VideoView, type VideoPlayer as ExpoVideoPlayer } from "expo-video";
import { Platform, View } from "react-native";
import colors from "@/theme/colors.json";

type VideoPlayerProps = {
  player: ExpoVideoPlayer;
  width: number;
  height: number;
};

export function VideoPlayer({ player, width, height }: VideoPlayerProps) {
  return (
    <View style={{ width, height, alignSelf: "center", overflow: "hidden", borderRadius: 12, backgroundColor: colors.videoBackground }}>
      <VideoView
        player={player}
        nativeControls
        surfaceType={Platform.OS === "android" ? "textureView" : undefined}
        style={{ width, height }}
      />
    </View>
  );
}
