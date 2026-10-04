import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { useVideo } from "@/features/videos/hooks";
import { videoFile } from "@/features/videos/storage";
import { formatTime } from "@/features/crop/utils/formatTime";

function VideoPlayer({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri);
  return <View className="h-[220px] overflow-hidden rounded-[16px] bg-black">
    <VideoView player={player} nativeControls contentFit="contain" style={{ width: "100%", height: "100%" }} />
  </View>;
}

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const videoId = Number(id);
  const { data: video, isPending, isError, refetch } = useVideo(videoId);
  const file = video ? videoFile(video.file_name) : null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-4">
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" className="mb-8 h-11 w-11 justify-center active:opacity-60">
          <Text className="font-sans text-[28px] text-ink">‹</Text>
        </Pressable>
        {video ? (
          <>
            {file?.exists ? <VideoPlayer uri={file.uri} /> :
              <View className="h-[220px] items-center justify-center rounded-[16px] bg-brand-soft px-6">
                <Text className="text-center font-semibold text-[16px] text-ink">Video file unavailable</Text>
                <Text className="mt-2 text-center font-sans text-[14px] text-muted">This video’s saved file could not be found.</Text>
              </View>}
            <Text className="mt-7 font-bold text-[26px] tracking-[-0.5px] text-ink">{video.title}</Text>
            <Text className="mt-2 font-medium text-[12.5px] text-muted tabular-nums">
              {new Date(video.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {formatTime(video.duration_seconds)}
            </Text>
            {!!video.description && <Text className="mt-6 font-sans text-[16px] leading-[26px] text-ink">{video.description}</Text>}
          </>
        ) : isPending && Number.isInteger(videoId) && videoId > 0 ? (
          <Text className="font-semibold text-[16px] text-ink">Loading video…</Text>
        ) : isError ? (
          <Pressable onPress={() => refetch()}><Text className="font-semibold text-[16px] text-brand">Couldn’t load video. Tap to retry.</Text></Pressable>
        ) : (
          <Text className="font-semibold text-[16px] text-ink">Video not found</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
