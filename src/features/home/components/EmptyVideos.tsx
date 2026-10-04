import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

function FilmIcon() {
  return (
    <View className="h-[28px] w-[28px] flex-row overflow-hidden rounded-[4px] border-[2.5px] border-brand">
      <View className="w-[6px] items-center justify-around border-r-[2px] border-brand py-[2px]">
        <View className="h-[3px] w-[3px] bg-brand" />
        <View className="h-[3px] w-[3px] bg-brand" />
        <View className="h-[3px] w-[3px] bg-brand" />
      </View>
      <View className="flex-1 justify-center">
        <View className="h-[2px] bg-brand" />
      </View>
      <View className="w-[6px] items-center justify-around border-l-[2px] border-brand py-[2px]">
        <View className="h-[3px] w-[3px] bg-brand" />
        <View className="h-[3px] w-[3px] bg-brand" />
        <View className="h-[3px] w-[3px] bg-brand" />
      </View>
    </View>
  );
}

export function EmptyVideos() {
  return (
    <View className="flex-1 items-center justify-center pb-12">
      <View className="mb-[18px] h-20 w-20 items-center justify-center rounded-[24px] bg-brand-soft">
        <FilmIcon />
      </View>
      <Text className="font-semibold text-[20px] leading-[26px] text-ink">No clips yet</Text>
      <Text className="mt-[6px] max-w-[240px] text-center font-sans text-[16px] leading-[24px] text-muted">
        Pick a video, trim a 5-second moment, and it will show up here.
      </Text>
      <View className="mt-[18px] w-full flex-row justify-center">
        <Button label="Crop your first video" onPress={() => router.push("/crop")} />
      </View>
    </View>
  );
}
