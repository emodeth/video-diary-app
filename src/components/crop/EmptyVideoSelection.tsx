import { Text, View } from "react-native";
import { Film } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import colors from "@/theme/colors.json";

type EmptyVideoSelectionProps = { onBrowse: () => void };

export function EmptyVideoSelection({ onBrowse }: EmptyVideoSelectionProps) {
  return (
    <Button
      label="Select video"
      variant="ghost"
      size="selection"
      fullWidth
      accessibilityLabel="Choose a video from your device"
      accessibilityHint="Opens your photo library"
      onPress={onBrowse}
      className="mt-5 flex-1 rounded-[18px] border border-dashed border-line-selection"
      contentClassName="flex-1 rounded-[18px] px-5 py-6"
    >
      <View className="flex-1 items-center justify-center">
        <View className="h-20 w-20 items-center justify-center rounded-[24px] bg-brand-soft">
          <Film size={28} color={colors.brand.DEFAULT} strokeWidth={2.5} />
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
      </View>
    </Button>
  );
}
