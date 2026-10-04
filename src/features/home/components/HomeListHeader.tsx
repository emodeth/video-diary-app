import { Text, View } from "react-native";

type HomeListHeaderProps = {
  totalVideos: number;
  totalSeconds: number;
};

export function HomeListHeader({ totalVideos, totalSeconds }: HomeListHeaderProps) {
  return (
    <View className="pb-3 pt-8">
      <Text className="font-bold text-[30px] leading-[36px] tracking-[-0.8px] text-ink">Video Diary</Text>
      <Text className="mt-1 font-sans text-[14px] leading-[21px] text-muted">
        {totalVideos} saved {totalVideos === 1 ? "video" : "videos"}, {totalSeconds} seconds in all
      </Text>
    </View>
  );
}
