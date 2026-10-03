import { Text, View } from "react-native";

type HomeListHeaderProps = {
  totalClips: number;
  totalSeconds: number;
};

export function HomeListHeader({ totalClips, totalSeconds }: HomeListHeaderProps) {
  return (
    <View className="pb-3 pt-8">
      <Text className="font-bold text-[30px] leading-[36px] tracking-[-0.8px] text-ink">Video Diary</Text>
      <Text className="mt-1 font-sans text-[14px] leading-[21px] text-muted">
        {totalClips} saved {totalClips === 1 ? "clip" : "clips"}, {totalSeconds} seconds in all
      </Text>
    </View>
  );
}
