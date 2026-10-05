import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideos } from "@/features/videos/hooks";
import { Button } from "@/components/ui/Button";
import { EmptyVideos } from "./components/EmptyVideos";
import { HomeListHeader } from "./components/HomeListHeader";
import { VideoRow } from "./components/VideoRow";

export default function Home() {
  const { data: videos = [], isPending, isError, refetch } = useVideos();
  const totalSeconds = videos.reduce((total, video) => total + video.duration_seconds, 0);
  const showEmptyState = !isPending && !isError && videos.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      {showEmptyState ? (
        <View className="flex-1 px-6">
          <HomeListHeader totalVideos={0} totalSeconds={0} />
          <EmptyVideos />
        </View>
      ) : (
        <>
          <FlatList
            data={videos}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <VideoRow video={item} />}
            ItemSeparatorComponent={() => <View className="h-px bg-line" />}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="flex-grow px-6 pb-24"
            ListHeaderComponent={<HomeListHeader totalVideos={videos.length} totalSeconds={totalSeconds} />}
            ListEmptyComponent={isPending ? <Text className="mt-12 text-center text-muted">Loading videos…</Text>
              : isError ? <Button label="Couldn’t load videos. Tap to retry." variant="ghost" onPress={() => refetch()} className="mt-12 self-center" />
              : null}
          />
          {videos.length > 0 && <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add a video"
            onPress={() => router.push("/crop")}
            className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-brand shadow-lg shadow-brand/25 active:opacity-80"
          >
            <Plus size={30} color="#FFFFFF" strokeWidth={2} />
          </Pressable>}
        </>
      )}
    </SafeAreaView>
  );
}
