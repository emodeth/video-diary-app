import { Text, View } from "react-native";

type HomeListHeaderProps = {
  totalVideos: number;
  totalSeconds: number;
};

export function HomeListHeader({ totalVideos, totalSeconds }: HomeListHeaderProps) {
  return (
    <View className="pb-3 pt-8">
      <Text className="font-sans-bold text-display tracking-[-0.8px] text-ink">Video Diary</Text>
      <Text className="mt-1 font-sans text-lead text-muted">
        {totalVideos === 0
          ? "Your cropped clips will live here"
          : `${totalVideos} saved ${totalVideos === 1 ? "video" : "videos"}, ${totalSeconds} seconds in all`}
      </Text>
    </View>
  );
}
