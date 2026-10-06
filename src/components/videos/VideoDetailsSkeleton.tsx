import { View } from "react-native";

export function VideoDetailsSkeleton({ previewWidth, cardHeight }: { previewWidth: number; cardHeight: number }) {
  return (
    <View accessibilityLabel="Loading video details" className="flex-1">
      <View style={{ width: previewWidth, height: cardHeight }} className="self-center rounded-[12px] bg-line" />
      <View className="mt-6 h-[25px] w-2/5 rounded-md bg-line" />
      <View className="mt-4 flex-row gap-2">
        <View className="h-[30px] w-[116px] rounded-full bg-line" />
        <View className="h-[30px] w-[77px] rounded-full bg-line" />
      </View>
      <View className="mt-5 h-[12px] w-full rounded-md bg-line" />
      <View className="mt-2 h-[12px] w-[95%] rounded-md bg-line" />
      <View className="mt-2 h-[12px] w-1/2 rounded-md bg-line" />
    </View>
  );
}
