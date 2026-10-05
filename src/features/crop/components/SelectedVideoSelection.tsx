import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { Play } from "lucide-react-native";
import { Image } from "expo-image";
import type { VideoThumbnail } from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { VideoSource } from "@/types/crop";
import { formatTime } from "../utils/formatTime";
import { getPreviewSize } from "../utils/getPreviewSize";

type Props = {
  selected: VideoSource;
  poster: VideoThumbnail | null;
  onBrowse: () => void;
};

export function SelectedVideoSelection({ selected, poster, onBrowse }: Props) {
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
      <View
        style={{ width: previewWidth, height: cardHeight }}
        className="mt-3 self-center items-center justify-center overflow-hidden rounded-[12px] bg-black"
      >
        {poster && <Image source={poster} contentFit="contain" style={{ width: "100%", height: "100%", position: "absolute" }} />}
        <View className="h-[58px] w-[58px] items-center justify-center rounded-full bg-white/85">
          <Play size={28} color="#2563EB" fill="#2563EB" strokeWidth={1.5} style={{ marginLeft: 4 }} />
        </View>
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
