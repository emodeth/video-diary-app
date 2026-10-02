import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyClips } from "./components/EmptyClips";
import { HomeListHeader } from "./components/HomeListHeader";
import { VideoRow } from "./components/VideoRow";
import { mockVideos } from "../../mocks/videos";
import { calculateTotalDuration } from "../../utils/calculateTotalDuration";

const totalSeconds = calculateTotalDuration(mockVideos);

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <FlatList
        data={mockVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoRow video={item} />}
        ItemSeparatorComponent={() => <View className="h-px bg-line" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow px-6 pb-24"
        ListHeaderComponent={<HomeListHeader totalClips={mockVideos.length} totalSeconds={totalSeconds} />}
        ListEmptyComponent={<EmptyClips />}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a clip"
        onPress={() => router.push("/crop")}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-brand shadow-lg shadow-brand/25 active:opacity-80"
      >
        <Text className="-mt-[2px] font-sans text-[32px] leading-[38px] text-white">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
