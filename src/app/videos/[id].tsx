import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { useVideo } from "@/features/videos/hooks";
import { videoFile } from "@/features/videos/storage";

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
          <ChevronLeft size={28} color="#101828" strokeWidth={2} />
        </Pressable>
        {video ? (
          <>
            {file?.exists ? <VideoPlayer uri={file.uri} /> :
              <View className="h-[220px] items-center justify-center rounded-[16px] bg-brand-soft px-6">
                <Text className="text-center font-sans-semibold text-heading text-ink">Video file unavailable</Text>
                <Text className="mt-2 text-center font-sans text-hint text-muted">This video’s saved file could not be found.</Text>
              </View>}
            <Text className="mt-7 font-sans-bold text-title-lg tracking-[-0.5px] text-ink">{video.title}</Text>
            <Text className="mt-2 font-sans-medium text-meta text-muted tabular-nums">
              {new Date(video.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </Text>
            {!!video.description && <Text className="mt-6 font-sans text-body text-ink">{video.description}</Text>}
          </>
        ) : isPending && Number.isInteger(videoId) && videoId > 0 ? (
          <Text className="font-sans-semibold text-body text-ink">Loading video…</Text>
        ) : isError ? (
          <Button label="Couldn’t load video. Tap to retry." variant="ghost" onPress={() => refetch()} />
        ) : (
          <Text className="font-sans-semibold text-body text-ink">Video not found</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
