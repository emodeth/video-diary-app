import { Text, View } from "react-native";

type HomeListHeaderProps = {
  totalVideos: number;
  totalSeconds: number;
};

export function HomeListHeader({ totalVideos, totalSeconds }: HomeListHeaderProps) {
  return (
    <View className="pb-[10px] pt-[28px]">
      <Text className="font-sans-bold text-[35px] leading-[42px] tracking-[-0.8px] text-ink">Video Diary</Text>
      <Text className="mt-[3px] font-sans text-[16px] leading-[23px] text-muted">
        {totalVideos === 0
          ? "Your cropped clips will live here"
          : `${totalVideos} ${totalVideos === 1 ? "video" : "videos"}, ${totalSeconds} ${totalSeconds === 1 ? "second" : "seconds"} in all`}
      </Text>
    </View>
  );
}
