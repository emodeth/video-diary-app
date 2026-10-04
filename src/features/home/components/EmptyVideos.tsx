import { Text, View } from "react-native";

export function EmptyVideos() {
  return (
    <View className="flex-1 items-center justify-center px-6 pb-24">
      <View className="mb-5 h-20 w-20 items-center justify-center rounded-[20px] bg-brand-soft">
        <View className="h-8 w-10 items-center justify-center rounded-[5px] border-2 border-brand">
          <Text className="pl-[2px] font-bold text-[16px] text-brand">▶</Text>
        </View>
      </View>
      <Text className="font-bold text-[22px] text-ink">No videos yet</Text>
      <Text className="mt-2 text-center font-sans text-[14px] leading-[22px] text-muted">
        Pick a video, trim a 5-second moment, and it will show up here.
      </Text>
    </View>
  );
}
