import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideos } from "@/hooks";
import { useCropStore } from "@/stores/crop.store";
import { Button } from "@/components/ui/Button";
import colors from "@/theme/colors.json";
import { EmptyVideos } from "@/components/home/EmptyVideos";
import { HomeListHeader } from "@/components/home/HomeListHeader";
import { ItemSeparator } from "@/components/home/ItemSeparator";
import { HomeState } from "@/components/home/HomeState";
import { VideoListSkeleton } from "@/components/home/VideoListSkeleton";
import { VideoRow } from "@/components/home/VideoRow";
import { getTotalSeconds } from "@/lib/video-stats";

export default function Home() {
  const { data: videos = [], isPending, isError, refetch } = useVideos();

  if (isPending) {
    return (
      <HomeState>
        <VideoListSkeleton />
      </HomeState>
    );
  }

  if (isError && videos.length === 0) {
    return (
      <HomeState>
        <Button
          label="Couldn’t load videos. Tap to retry."
          variant="ghost"
          onPress={() => refetch()}
          className="mt-12 self-center"
        />
      </HomeState>
    );
  }

  if (videos.length === 0) {
    return (
      <HomeState>
        <EmptyVideos />
      </HomeState>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <FlatList
        data={videos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <VideoRow video={item} />}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow px-7 pb-24"
        ListHeaderComponent={
          <HomeListHeader
            totalVideos={videos.length}
            totalSeconds={getTotalSeconds(videos)}
          />
        }
      />
      <Button
        label="Add a video"
        accessibilityLabel="Add a video"
        onPress={() => {
          useCropStore.getState().reset();
          router.push("/crop");
        }}
        className="absolute bottom-7 right-7 shadow-lg shadow-brand/25"
        size="icon"
        iconOnly
        icon={<Plus size={30} color={colors.onBrand} strokeWidth={2} />}
      />
    </SafeAreaView>
  );
}
