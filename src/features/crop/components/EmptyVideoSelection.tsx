import { Pressable, Text, View } from "react-native";
import { Film } from "lucide-react-native";

type Props = { onBrowse: () => void };

export function EmptyVideoSelection({ onBrowse }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Choose a video from your device"
      accessibilityHint="Opens your photo library"
      onPress={onBrowse}
      className="mt-5 flex-1 items-center justify-center rounded-[18px] border border-dashed border-[#BCC9DF] px-5 py-6 active:opacity-80"
    >
      <View className="h-20 w-20 items-center justify-center rounded-[24px] bg-brand-soft">
        <Film size={28} color="#2563EB" strokeWidth={2.5} />
      </View>
      <Text className="mt-4 text-center font-sans-semibold text-heading text-ink">
        Choose from device
      </Text>
      <Text className="mt-1 max-w-[260px] text-center font-sans text-secondary text-muted">
        Pick a video from your photo library
      </Text>
      <View className="mt-[18px] h-[52px] items-center justify-center rounded-[16px] bg-brand px-6">
        <Text className="font-sans-bold text-button text-white">
          Select video
        </Text>
      </View>
    </Pressable>
  );
}
