import { router } from "expo-router";
import { Film } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { useCropStore } from "@/stores/crop.store";
import colors from "@/theme/colors.json";

export function EmptyVideos() {
  return (
    <View className="flex-1 items-center justify-center pb-[68px]">
      <View className="mb-6 h-[100px] w-[100px] items-center justify-center rounded-[30px] bg-brand-soft">
        <Film size={36} color={colors.brand.DEFAULT} strokeWidth={2.5} />
      </View>
      <Text className="font-sans-semibold text-section-title text-ink">No videos yet</Text>
      <Text className="mt-2 max-w-[290px] text-center font-sans text-lead text-muted">
        Pick a video, preview a moment, and save the full video here.
      </Text>
      <View className="mt-6 w-full flex-row justify-center">
        <Button label="Add your first video" size="hero" onPress={() => {
          useCropStore.getState().reset();
          router.push("/crop");
        }} />
      </View>
    </View>
  );
}
