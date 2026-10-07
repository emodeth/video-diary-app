/* eslint-disable react-hooks/immutability -- Expo Video exposes imperative playback and seek controls. */
import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Platform, Text, View } from "react-native";
import { CLIP_LENGTH } from "@/constants";
import { formatTime } from "@/lib/videoUtils";
import colors from "@/theme/colors.json";

type VideoDetailsPlayerProps = {
  uri: string;
  startSeconds: number;
  width: number;
  height: number;
};

function playbackStart(duration: number, selectedStart: number) {
  // Android's expo-trim-video output retains source timestamps. iOS exports a new
  // timeline beginning at zero. Clamp for older files with shorter media timelines.
  return Platform.OS === "android" && duration > CLIP_LENGTH
    ? Math.min(selectedStart, Math.max(0, duration - CLIP_LENGTH))
    : 0;
}

export function VideoDetailsPlayer({ uri, startSeconds, width, height }: VideoDetailsPlayerProps) {
  const player = useVideoPlayer(uri, (createdPlayer) => {
    createdPlayer.timeUpdateEventInterval = 0.1;
  });

  useEventListener(player, "sourceLoad", ({ duration }) => {
    player.currentTime = playbackStart(duration, startSeconds);
  });

  useEventListener(player, "timeUpdate", ({ currentTime }) => {
    const clipStart = playbackStart(player.duration, startSeconds);
    if (currentTime < clipStart - 0.05) {
      player.currentTime = clipStart;
    } else if (currentTime >= clipStart + CLIP_LENGTH - 0.05) {
      player.pause();
      player.currentTime = clipStart;
    }
  });

  useEventListener(player, "playingChange", ({ isPlaying }) => {
    if (!isPlaying) return;
    const clipStart = playbackStart(player.duration, startSeconds);
    if (player.currentTime < clipStart || player.currentTime >= clipStart + CLIP_LENGTH - 0.05) {
      player.currentTime = clipStart;
    }
  });

  useEventListener(player, "playToEnd", () => {
    player.pause();
    player.currentTime = playbackStart(player.duration, startSeconds);
  });

  return (
    <View style={{ width, height, alignSelf: "center", overflow: "hidden", borderRadius: 12, backgroundColor: colors.videoBackground }}>
      <VideoView
        player={player}
        nativeControls
        surfaceType={Platform.OS === "android" ? "textureView" : undefined}
        style={{ width, height }}
      />
      <View pointerEvents="none" className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1">
        <Text className="font-sans-semibold text-xs text-white tabular-nums">
          {formatTime(CLIP_LENGTH)} clip
        </Text>
      </View>
    </View>
  );
}
