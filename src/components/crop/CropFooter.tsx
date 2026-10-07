import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { videoMetadataSchema } from "@/schemas/videoMetadata.schema";
import { useCropStore } from "@/stores/crop.store";

type CropFooterProps = {
  bottomInset: number;
  saving: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  onRetryThumbnail: () => void;
};

export function CropFooter({
  bottomInset,
  saving,
  onBack,
  onNext,
  onFinish,
  onRetryThumbnail,
}: CropFooterProps) {
  const step = useCropStore((state) => state.step);
  const hasSelection = useCropStore((state) => state.selected !== null);
  const name = useCropStore((state) => state.name);
  const description = useCropStore((state) => state.description);
  const validMetadata = videoMetadataSchema.safeParse({
    name,
    description,
  }).success;
  const thumbnailStatus = useCropStore((state) => state.thumbnailStatus);
  return (
    <View
      className="border-t border-line-subtle bg-surface px-[27px] pt-[12px]"
      style={{ paddingBottom: Math.max(bottomInset, 16) }}
    >
      {step === 1 && (
        <Button
          label="Continue"
          size="large"
          fullWidth
          disabled={!hasSelection}
          onPress={onNext}
        />
      )}
      {step === 2 && (
        <Button label="Next" size="large" fullWidth onPress={onNext} />
      )}
      {step === 3 && (
        <View className="flex-row gap-[11px]">
          <View className="w-[95px]">
            <Button
              label="Back"
              variant="outline"
              size="large"
              fullWidth
              disabled={saving}
              onPress={onBack}
            />
          </View>
          <View className="flex-1">
            <Button
              label={
                saving
                  ? "Saving…"
                  : thumbnailStatus === "loading"
                    ? "Preparing…"
                    : thumbnailStatus === "error"
                      ? "Retry thumbnail"
                      : "Crop video"
              }
              size="large"
              fullWidth
              disabled={
                saving ||
                (thumbnailStatus !== "error" &&
                  (!validMetadata || thumbnailStatus !== "ready"))
              }
              onPress={
                thumbnailStatus === "error" ? onRetryThumbnail : onFinish
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}
