import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockVideos } from "@/mocks/videos";
import { PlayMark } from "@/features/home/components/PlayMark";

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = mockVideos.find((item) => item.id === id);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-4">
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" className="mb-8 h-11 w-11 justify-center active:opacity-60">
          <Text className="font-sans text-[28px] text-ink">‹</Text>
        </Pressable>
        {video ? (
          <>
            <View className="h-[220px] overflow-hidden rounded-[16px]">
              <Image
                source={video.thumbnailUrl ? { uri: video.thumbnailUrl } : video.thumbnailPlaceholder}
                className="h-full w-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 items-center justify-center"><PlayMark /></View>
            </View>
            <Text className="mt-7 font-bold text-[26px] tracking-[-0.5px] text-ink">{video.title}</Text>
            <Text className="mt-2 font-medium text-[12.5px] text-muted tabular-nums">{video.date} · {video.duration}</Text>
            <Text className="mt-6 font-sans text-[16px] leading-[26px] text-ink">{video.description}</Text>
          </>
        ) : (
          <Text className="font-semibold text-[16px] text-ink">Clip not found</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
