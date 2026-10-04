import { View } from "react-native";
import type { CropStep } from "@/types/crop";
import { Button } from "@/components/ui/Button";

type Props = {
  step: CropStep;
  bottomInset: number;
  hasSelection: boolean;
  hasName: boolean;
  saving: boolean;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
};

export function CropFooter({ step, bottomInset, hasSelection, hasName, saving, onNext, onBack, onFinish }: Props) {
  return (
    <View className="border-t border-[#F2F3F6] bg-white px-[27px] pt-[12px]" style={{ paddingBottom: Math.max(bottomInset, 16) }}>
      {step === 1 && <Button label="Continue" size="large" fullWidth disabled={!hasSelection} onPress={onNext} />}
      {step === 2 && <Button label="Next" size="large" fullWidth onPress={onNext} />}
      {step === 3 && <View className="flex-row gap-[11px]">
        <View className="w-[95px]"><Button label="Back" variant="outline" size="large" fullWidth disabled={saving} onPress={onBack} /></View>
        <View className="flex-1"><Button label={saving ? "Saving…" : "✂  Crop video"} size="large" fullWidth disabled={!hasName || saving} onPress={onFinish} /></View>
      </View>}
    </View>
  );
}
