import { CalendarDays, Scissors } from "lucide-react-native";
import { useVideoPlayer } from "expo-video";
import { Text, View } from "react-native";
import { formatTime } from "@/lib/formatTime";
import colors from "@/theme/colors.json";
import type { Video } from "@/types/videos";
import { videoFile } from "@/lib/fileSystem";
import { VideoPlayer } from "@/components/VideoPlayer";

export function VideoDetailsBody({ video, previewWidth, cardHeight }: { video: Video; previewWidth: number; cardHeight: number }) {
  const file = videoFile(video.fileName);
  const fileExists = file.exists;
  const player = useVideoPlayer(fileExists ? file.uri : null);

  return (
    <>
      {fileExists ? (
        <VideoPlayer player={player} width={previewWidth} height={cardHeight} />
      ) : (
        <View style={{ width: previewWidth, height: cardHeight }} className="self-center items-center justify-center rounded-[12px] bg-brand-soft px-6">
          <Text className="text-center font-sans-semibold text-heading text-ink">Video file unavailable</Text>
          <Text className="mt-2 text-center font-sans text-hint text-muted">This video’s saved file could not be found.</Text>
        </View>
      )}
      <Text className="mt-5 font-sans-bold text-title tracking-[-0.7px] text-ink">{video.title}</Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        <View className="h-[32px] flex-row items-center gap-[5px] rounded-full border border-line px-3">
          <Scissors size={13} color={colors.muted} strokeWidth={1.8} />
          <Text className="font-sans-medium text-meta text-muted tabular-nums">
            {formatTime(video.startSeconds)} – {formatTime(video.startSeconds + video.durationSeconds)}
          </Text>
        </View>
        <View className="h-[32px] flex-row items-center gap-[5px] rounded-full border border-line px-3">
          <CalendarDays size={13} color={colors.muted} strokeWidth={1.8} />
          <Text className="font-sans-medium text-meta text-muted tabular-nums">
            {new Date(video.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </Text>
        </View>
      </View>
      {!!video.description && <Text className="mt-5 font-sans text-body text-ink">{video.description}</Text>}
    </>
  );
}
