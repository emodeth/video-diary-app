import { Pressable, Text, View } from "react-native";
import type { CropStep } from "@/types/crop";

type Props = { step: CropStep; onBack: () => void; onClose: () => void };

export function CropHeader({ step, onBack, onClose }: Props) {
  return (
    <>
      <View className="items-center pt-[9px]"><View className="h-1 w-10 rounded-full bg-[#E6E9EF]" /></View>
      <View className="h-[67px] flex-row items-center justify-between px-5">
        <Pressable accessibilityRole="button" accessibilityLabel={step === 1 ? "Close" : "Previous step"}
          onPress={onBack} className="h-11 w-11 items-center justify-center">
          {step > 1 && <Text className="font-sans text-[30px] leading-[34px] text-ink">‹</Text>}
        </Pressable>
        <View className="items-center">
          <Text className="font-bold text-[18px] leading-[23px] text-ink">New crop</Text>
          <Text className="mt-[2px] font-medium text-[13px] text-muted">Step {step} of 3</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} className="h-11 w-11 items-center justify-center">
          <Text className="font-sans text-[29px] leading-[34px] text-ink">×</Text>
        </Pressable>
      </View>
      <View className="flex-row gap-[7px] px-[27px] pb-[13px]">
        {([1, 2, 3] as const).map((item) =>
          <View key={item} className={item <= step ? "h-[3px] flex-1 rounded-full bg-brand" : "h-[3px] flex-1 rounded-full bg-[#E8EBF0]"} />)}
      </View>
    </>
  );
}
