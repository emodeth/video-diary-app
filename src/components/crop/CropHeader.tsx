import { Text, View } from "react-native";
import { ChevronLeft, X } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { useCropStore } from "@/stores/crop.store";
import colors from "@/theme/colors.json";

type CropHeaderProps = { onBack: () => void; onClose: () => void };

export function CropHeader({ onBack, onClose }: CropHeaderProps) {
  const step = useCropStore((state) => state.step);
  return (
    <>
      <View className="items-center pt-[9px]"><View className="h-1 w-10 rounded-full bg-handle" /></View>
      <View className="h-[67px] flex-row items-center justify-between px-5">
        <Button
          label={step === 1 ? "Close" : "Previous step"}
          accessibilityLabel={step === 1 ? "Close" : "Previous step"}
          variant="ghost"
          size="headerIcon"
          iconOnly
          icon={step > 1 ? <ChevronLeft size={28} color={colors.ink} strokeWidth={2} /> : undefined}
          onPress={onBack}
        />
        <View className="items-center">
          <Text className="font-sans-bold text-nav text-ink">New video</Text>
          <Text className="mt-[2px] font-sans-medium text-meta text-muted">Step {step} of 3</Text>
        </View>
        <Button
          label="Close"
          accessibilityLabel="Close"
          variant="ghost"
          size="headerIcon"
          iconOnly
          icon={<X size={25} color={colors.ink} strokeWidth={2} />}
          onPress={onClose}
        />
      </View>
      <View className="flex-row gap-[7px] px-[27px] pb-[13px]">
        {([1, 2, 3] as const).map((item) =>
          <View key={item} className={item <= step ? "h-[3px] flex-1 rounded-full bg-brand" : "h-[3px] flex-1 rounded-full bg-step-inactive"} />)}
      </View>
    </>
  );
}
