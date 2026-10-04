import { Pressable, Text, View } from "react-native";
import type { VideoSource } from "@/types/crop";
import { formatTime } from "../utils/formatTime";

type Props = {
  selected: VideoSource | null;
  onBrowse: () => void;
};

export function VideoSelectionStep({ selected, onBrowse }: Props) {
  return (
    <>
      <Text className="font-bold text-[26px] leading-[32px] tracking-[-0.7px] text-ink">Select a video</Text>
      <Text className="mt-[5px] font-sans text-[16px] leading-[25px] text-muted">Choose a video from your library. You’ll pick a 5-second moment next.</Text>
      <Pressable accessibilityRole="button" onPress={onBrowse} className="mt-[23px] h-[59px] flex-row items-center justify-center gap-3 rounded-[16px] border border-[#E5E9F0]">
        <View className="h-[13px] w-[18px] rounded-[2px] border-2 border-ink" />
        <Text className="font-semibold text-[17px] text-ink">Choose video</Text>
      </Pressable>
      {selected && <View className="mt-5 rounded-[14px] bg-brand-soft px-4 py-4">
        <Text className="font-semibold text-[15px] text-ink" numberOfLines={1}>{selected.title}</Text>
        <Text className="mt-1 font-sans text-[13px] text-muted">{formatTime(selected.duration)} video selected</Text>
      </View>}
    </>
  );
}
