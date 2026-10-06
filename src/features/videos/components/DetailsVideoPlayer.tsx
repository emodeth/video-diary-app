import { useEvent } from "expo";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pause, Play } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { formatTime } from "@/features/crop/utils/formatTime";
import { thumbnailFile } from "@/features/videos/storage";
import colors from "@/theme/colors.json";

type Props = {
  uri: string;
  thumbnailFileName: string | null;
  duration: number;
  width: number;
  height: number;
};

export function DetailsVideoPlayer({ uri, thumbnailFileName, duration, width, height }: Props) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.timeUpdateEventInterval = 0.25;
  });
  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });
  const { currentTime } = useEvent(player, "timeUpdate", { currentTime: 0, bufferedPosition: 0, currentLiveTimestamp: null, currentOffsetFromLive: null });
  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  return (
    <View style={{ width, height }} className="self-center overflow-hidden rounded-[12px] bg-black">
      {thumbnailFileName && (
        <Image source={{ uri: thumbnailFile(thumbnailFileName).uri }} contentFit="cover" style={{ width: "100%", height: "100%", position: "absolute" }} />
      )}
      <VideoView player={player} nativeControls={false} contentFit="contain" surfaceType="textureView" style={{ width: "100%", height: "100%" }} />
      <Pressable
        onPress={() => isPlaying ? player.pause() : player.play()}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause video" : "Play video"}
        className="absolute inset-0 items-center justify-center"
      >
        <View className="h-[60px] w-[60px] items-center justify-center rounded-full bg-white/95">
          {isPlaying
            ? <Pause size={22} color={colors.brand.DEFAULT} fill={colors.brand.DEFAULT} strokeWidth={1.5} />
            : <Play size={23} color={colors.brand.DEFAULT} fill={colors.brand.DEFAULT} strokeWidth={1.5} style={{ marginLeft: 3 }} />}
        </View>
      </Pressable>
      <View pointerEvents="none" className="absolute bottom-3 left-3 right-3 flex-row items-center gap-[9px] rounded-full bg-[#223149] px-3 py-2">
        <Text className="font-sans-medium text-chip text-white tabular-nums">{formatTime(currentTime)}</Text>
        <View className="h-1 flex-1 overflow-hidden rounded-full bg-white/35">
          <View style={{ width: `${progress * 100}%` }} className="h-full rounded-full bg-brand" />
        </View>
        <Text className="font-sans-medium text-chip text-white tabular-nums">{formatTime(duration)}</Text>
      </View>
    </View>
  );
}
