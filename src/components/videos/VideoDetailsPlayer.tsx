import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Platform, Text, View } from "react-native";
import { CLIP_LENGTH } from "@/constants";
import { formatTime } from "@/lib/videoUtils";
import colors from "@/theme/colors.json";

type VideoDetailsPlayerProps = {
  uri: string;
  startSeconds: number;
  durationSeconds: number;
  width: number;
  height: number;
};

function playbackStart(duration: number, selectedStart: number, isLegacyClip: boolean) {
  // Older Android clips can retain their source timestamps.
  return isLegacyClip && Platform.OS === "android" && duration > CLIP_LENGTH
    ? Math.min(selectedStart, Math.max(0, duration - CLIP_LENGTH))
    : 0;
}

export function VideoDetailsPlayer({ uri, startSeconds, durationSeconds, width, height }: VideoDetailsPlayerProps) {
  const isLegacyClip = startSeconds > 0 && durationSeconds <= CLIP_LENGTH;
  const player = useVideoPlayer(uri, (createdPlayer) => {
    createdPlayer.timeUpdateEventInterval = 0.1;
  });

  useEventListener(player, "sourceLoad", ({ duration }) => {
    if (isLegacyClip) player.currentTime = playbackStart(duration, startSeconds, true);
  });

  useEventListener(player, "timeUpdate", ({ currentTime }) => {
    if (!isLegacyClip) return;
    const clipStart = playbackStart(player.duration, startSeconds, true);
    if (currentTime < clipStart - 0.05) {
      player.currentTime = clipStart;
    } else if (currentTime >= clipStart + CLIP_LENGTH - 0.05) {
      player.pause();
      player.currentTime = clipStart;
    }
  });

  useEventListener(player, "playingChange", ({ isPlaying }) => {
    if (!isLegacyClip || !isPlaying) return;
    const clipStart = playbackStart(player.duration, startSeconds, true);
    if (player.currentTime < clipStart || player.currentTime >= clipStart + CLIP_LENGTH - 0.05) {
      player.currentTime = clipStart;
    }
  });

  useEventListener(player, "playToEnd", () => {
    if (isLegacyClip) {
      player.pause();
      player.currentTime = playbackStart(player.duration, startSeconds, true);
    }
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
          {formatTime(durationSeconds)} {isLegacyClip ? "clip" : "video"}
        </Text>
      </View>
    </View>
  );
}
