import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CropScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-4">
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close" className="mb-8 h-11 w-11 justify-center active:opacity-60">
          <Text className="font-sans text-[28px] text-ink">×</Text>
        </Pressable>
        <Text className="font-bold text-[24px] tracking-[-0.5px] text-ink">Create a clip</Text>
        <Text className="mt-2 font-sans text-[16px] leading-[26px] text-muted">Pick a video to trim a 5-second moment.</Text>
      </View>
    </SafeAreaView>
  );
}
