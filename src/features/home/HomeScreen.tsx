import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideos } from "@/features/videos/hooks";
import { useCropStore } from "@/features/crop/store";
import { Button } from "@/components/ui/Button";
import colors from "@/theme/colors.json";
import { EmptyVideos } from "./components/EmptyVideos";
import { HomeListHeader } from "./components/HomeListHeader";
import { ItemSeparator } from "./components/ItemSeparator";
import { HomeState } from "./components/HomeState";
import { VideoListSkeleton } from "./components/VideoListSkeleton";
import { VideoRow } from "./components/VideoRow";
import { getTotalSeconds } from "./utils";

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
