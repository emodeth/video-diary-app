import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { useCropStore } from "@/stores/crop.store";

type Props = {
  bottomInset: number;
  saving: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function CropFooter({ bottomInset, saving, onBack, onNext, onFinish }: Props) {
  const step = useCropStore((state) => state.step);
  const hasSelection = useCropStore((state) => state.selected !== null);
  const hasName = useCropStore((state) => !!state.name.trim());
  const thumbnailStatus = useCropStore((state) => state.thumbnailStatus);
  return (
    <View className="border-t border-[#F2F3F6] bg-white px-[27px] pt-[12px]" style={{ paddingBottom: Math.max(bottomInset, 16) }}>
      {step === 1 && <Button label="Continue" size="large" fullWidth disabled={!hasSelection} onPress={onNext} />}
      {step === 2 && <Button label="Next" size="large" fullWidth onPress={onNext} />}
      {step === 3 && <View className="flex-row gap-[11px]">
        <View className="w-[95px]"><Button label="Back" variant="outline" size="large" fullWidth disabled={saving} onPress={onBack} /></View>
        <View className="flex-1"><Button label={saving ? "Saving…" : thumbnailStatus === "loading" ? "Preparing…" : "✂  Crop video"} size="large" fullWidth disabled={!hasName || saving || thumbnailStatus !== "ready"} onPress={onFinish} /></View>
      </View>}
    </View>
  );
}
