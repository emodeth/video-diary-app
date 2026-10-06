import { View } from "react-native";

export function VideoDetailsSkeleton({ previewWidth, cardHeight }: { previewWidth: number; cardHeight: number }) {
  return (
    <View accessibilityLabel="Loading video details">
      <View style={{ width: previewWidth, height: cardHeight }} className="self-center rounded-[12px] bg-line" />
      <View className="mt-5 h-[34px] w-2/5 rounded-md bg-line" />
      <View className="mt-3 flex-row gap-2">
        <View className="h-[32px] w-[116px] rounded-full bg-line" />
        <View className="h-[32px] w-[77px] rounded-full bg-line" />
      </View>
      <View className="mt-5 h-[18px] w-3/4 rounded-md bg-line" />
      <View className="mt-2 h-[18px] w-1/2 rounded-md bg-line" />
    </View>
  );
}
