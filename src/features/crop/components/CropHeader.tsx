import { Pressable, Text, View } from "react-native";
import { ChevronLeft, X } from "lucide-react-native";
import { useCropStore } from "../store";

type Props = { onBack: () => void; onClose: () => void };

export function CropHeader({ onBack, onClose }: Props) {
  const step = useCropStore((state) => state.step);
  return (
    <>
      <View className="items-center pt-[9px]"><View className="h-1 w-10 rounded-full bg-[#E6E9EF]" /></View>
      <View className="h-[67px] flex-row items-center justify-between px-5">
        <Pressable accessibilityRole="button" accessibilityLabel={step === 1 ? "Close" : "Previous step"}
          onPress={onBack} className="h-11 w-11 items-center justify-center">
          {step > 1 && <ChevronLeft size={28} color="#101828" strokeWidth={2} />}
        </Pressable>
        <View className="items-center">
          <Text className="font-sans-bold text-nav text-ink">New crop</Text>
          <Text className="mt-[2px] font-sans-medium text-meta text-muted">Step {step} of 3</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} className="h-11 w-11 items-center justify-center">
          <X size={25} color="#101828" strokeWidth={2} />
        </Pressable>
      </View>
      <View className="flex-row gap-[7px] px-[27px] pb-[13px]">
        {([1, 2, 3] as const).map((item) =>
          <View key={item} className={item <= step ? "h-[3px] flex-1 rounded-full bg-brand" : "h-[3px] flex-1 rounded-full bg-[#E8EBF0]"} />)}
      </View>
    </>
  );
}
