import { router } from "expo-router";
import { Film } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

export function EmptyVideos() {
  return (
    <View className="flex-1 items-center justify-center pb-12">
      <View className="mb-[18px] h-20 w-20 items-center justify-center rounded-[24px] bg-brand-soft">
        <Film size={28} color="#2563EB" strokeWidth={2.5} />
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
