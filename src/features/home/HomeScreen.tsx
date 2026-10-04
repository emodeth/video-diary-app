import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideos } from "@/features/videos/hooks";
import { EmptyVideos } from "./components/EmptyVideos";
import { HomeListHeader } from "./components/HomeListHeader";
import { VideoRow } from "./components/VideoRow";

export default function Home() {
  const { data: videos = [], isPending, isError, refetch } = useVideos();
  const totalSeconds = videos.reduce((total, video) => total + video.duration_seconds, 0);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <FlatList
        data={videos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <VideoRow video={item} />}
        ItemSeparatorComponent={() => <View className="h-px bg-line" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow px-6 pb-24"
        ListHeaderComponent={<HomeListHeader totalVideos={videos.length} totalSeconds={totalSeconds} />}
        ListEmptyComponent={isPending ? <Text className="mt-12 text-center text-muted">Loading videos…</Text>
          : isError ? <Pressable onPress={() => refetch()} className="mt-12 items-center"><Text className="text-brand">Couldn’t load videos. Tap to retry.</Text></Pressable>
          : <EmptyVideos />}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a video"
        onPress={() => router.push("/crop")}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-brand shadow-lg shadow-brand/25 active:opacity-80"
      >
        <Text className="-mt-[2px] font-sans text-[32px] leading-[38px] text-white">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
