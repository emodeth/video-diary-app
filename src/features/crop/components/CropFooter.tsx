import { View } from "react-native";
import type { CropStep } from "@/types/crop";
import { ActionButton } from "./ActionButton";

type Props = {
  step: CropStep;
  bottomInset: number;
  hasSelection: boolean;
  hasName: boolean;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
};

export function CropFooter({ step, bottomInset, hasSelection, hasName, onNext, onBack, onFinish }: Props) {
  return (
    <View className="border-t border-[#F2F3F6] bg-white px-[27px] pt-[12px]" style={{ paddingBottom: Math.max(bottomInset, 16) }}>
      {step === 1 && <ActionButton label="Continue" disabled={!hasSelection} onPress={onNext} />}
      {step === 2 && <ActionButton label="Next" onPress={onNext} />}
      {step === 3 && <View className="flex-row gap-[11px]">
        <View className="w-[95px]"><ActionButton label="Back" secondary onPress={onBack} /></View>
        <View className="flex-1"><ActionButton label="✂  Crop video" disabled={!hasName} onPress={onFinish} /></View>
      </View>}
    </View>
  );
}
