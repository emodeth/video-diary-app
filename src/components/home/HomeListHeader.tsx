import { Text, View } from "react-native";

type HomeListHeaderProps = {
  totalVideos?: number;
  totalSeconds?: number;
  statsError?: boolean;
};

export function HomeListHeader({ totalVideos, totalSeconds, statsError }: HomeListHeaderProps) {
  return (
    <View className="pb-[10px] pt-[28px]">
      <Text className="font-sans-bold text-display tracking-[-0.8px] text-ink">Video Diary</Text>
      <Text className="mt-[3px] font-sans text-secondary text-muted">
        {totalVideos === undefined || totalSeconds === undefined
          ? statsError ? "Library totals unavailable" : "Loading library totals…"
          : totalVideos === 0
            ? "Your moments, all in one place"
            : `${totalVideos} ${totalVideos === 1 ? "video" : "videos"}, ${totalSeconds} ${totalSeconds === 1 ? "second" : "seconds"} in all`}
      </Text>
    </View>
  );
}
