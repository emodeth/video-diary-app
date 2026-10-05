import { Pressable, Text, View } from "react-native";
import { Film, Play } from "lucide-react-native";
import { Image } from "expo-image";
import type { VideoThumbnail } from "expo-video";
import { Button } from "@/components/ui/Button";
import { useCropStore } from "../store";
import { formatTime } from "../utils/formatTime";

type Props = {
  poster: VideoThumbnail | null;
  onBrowse: () => void;
};

export function VideoSelectionStep({ poster, onBrowse }: Props) {
  const selected = useCropStore((state) => state.selected);
  return (
    <>
      <Text className="font-sans-bold text-title tracking-[-0.7px] text-ink">Select a video</Text>
      <Text className="mt-[5px] font-sans text-lead text-muted">
        Choose a clip from your device. You’ll pick a 5-second moment next.
      </Text>

      {selected ? (
        <>
          <View className="mt-[19px] h-[200px] items-center justify-center overflow-hidden rounded-[17px] bg-black">
            {poster && <Image source={poster} contentFit="contain" style={{ width: "100%", height: "100%", position: "absolute" }} />}
            <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-white/90">
              <Play size={28} color="#2563EB" strokeWidth={2.25} style={{ marginLeft: 2 }} />
            </View>
            <View className="absolute bottom-[11px] right-[11px] rounded-full bg-white px-[10px] py-[4px]">
              <Text className="font-sans-semibold text-chip text-ink tabular-nums">
                {formatTime(selected.duration)}
              </Text>
            </View>
          </View>
          <View className="mt-[14px] flex-row items-center justify-between gap-3">
            <Text className="flex-1 font-sans-semibold text-row text-ink" numberOfLines={1}>
              {selected.title}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Change video" onPress={onBrowse}
              className="min-h-10 justify-center px-1">
              <Text className="font-sans-semibold text-secondary text-brand">Change</Text>
            </Pressable>
          </View>
          <Text className="-mt-[4px] font-sans text-meta text-muted tabular-nums">
            {formatTime(selected.duration)}{selected.fileSize != null ? ` · ${(selected.fileSize / (1024 * 1024)).toFixed(1)} MB` : ""}
          </Text>
        </>
      ) : (
        <View className="mt-[19px] items-center rounded-[18px] border border-dashed border-[#BCC9DF] px-5 py-[14px]">
          <View className="h-[59px] w-[59px] items-center justify-center rounded-[17px] bg-[#EDF2FF]">
            <Film size={24} color="#2563EB" strokeWidth={2} />
          </View>
          <Text className="mt-[13px] font-sans-semibold text-heading text-ink">Choose from device</Text>
          <Text className="mt-[3px] max-w-[230px] text-center font-sans text-hint text-muted">
            Pick a video from your photo library
          </Text>
          <View className="mt-[16px] w-full flex-row justify-center">
            <Button label="Select video" size="compact" onPress={onBrowse} />
          </View>
        </View>
      )}
    </>
  );
}
