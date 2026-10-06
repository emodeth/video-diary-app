import { Pressable, Text, View, useWindowDimensions } from "react-native";
import type { VideoPlayer as ExpoVideoPlayer } from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { VideoSource } from "@/types/crop";
import { formatTime } from "@/lib/formatTime";
import { getPreviewSize } from "@/lib/getPreviewSize";
import { VideoPlayer } from "@/components/VideoPlayer";

type Props = {
  selected: VideoSource;
  player: ExpoVideoPlayer;
  onBrowse: () => void;
};

export function SelectedVideoSelection({ selected, player, onBrowse }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { previewWidth, cardHeight } = getPreviewSize(
    width,
    height,
    insets.top,
    insets.bottom,
  );

  return (
    <>
      <View className="mt-3">
        <VideoPlayer player={player} width={previewWidth} height={cardHeight} />
      </View>
      <View className="mt-6 flex-row items-center justify-between gap-3">
        <Text className="flex-1 font-sans-bold text-title tracking-[-0.7px] text-ink" numberOfLines={1}>
          {selected.title}
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Change video" onPress={onBrowse}
          className="min-h-10 justify-center px-1">
          <Text className="font-sans-semibold text-body text-brand">Change</Text>
        </Pressable>
      </View>
      <Text className="font-sans text-secondary text-muted tabular-nums">
        {formatTime(selected.duration)}
        {selected.fileSize != null
          ? ` · ${(selected.fileSize / (1024 * 1024)).toFixed(1)} MB`
          : ""}
      </Text>
    </>
  );
}
