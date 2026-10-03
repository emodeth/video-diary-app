import { Pressable, Text, View } from "react-native";
import { sampleVideos } from "@/mocks/cropVideos";
import type { ClipSource } from "@/types/crop";
import { formatTime } from "../utils/formatTime";

type Props = {
  selected: ClipSource | null;
  onSelect: (source: ClipSource) => void;
  onBrowse: () => void;
};

export function VideoSelectionStep({ selected, onSelect, onBrowse }: Props) {
  return (
    <>
      <Text className="font-bold text-[26px] leading-[32px] tracking-[-0.7px] text-ink">Select a video</Text>
      <Text className="mt-[5px] font-sans text-[16px] leading-[25px] text-muted">Choose a clip from your library. You’ll pick a 5-second moment next.</Text>
      <Pressable accessibilityRole="button" onPress={onBrowse} className="mt-[23px] h-[59px] flex-row items-center justify-center gap-3 rounded-[16px] border border-[#E5E9F0]">
        <View className="h-[13px] w-[18px] rounded-[2px] border-2 border-ink" />
        <Text className="font-semibold text-[17px] text-ink">Browse files</Text>
      </Pressable>
      <View className="mt-[18px] flex-row flex-wrap justify-between gap-y-[9px]">
        {sampleVideos.map((video) => (
          <Pressable key={video.id} accessibilityRole="button"
            accessibilityLabel={`${video.title}, ${formatTime(video.duration)}`}
            accessibilityState={{ selected: selected?.id === video.id }}
            onPress={() => onSelect(video)}
            style={{
              width: "31.5%", aspectRatio: 0.74, backgroundColor: video.color,
              borderColor: selected?.id === video.id ? "#2861ED" : "transparent",
              borderWidth: selected?.id === video.id ? 3 : 0,
            }}
            className="items-end justify-end rounded-[13px] p-[7px]">
            <View className="rounded-full bg-white/90 px-[8px] py-[4px]">
              <Text className="font-semibold text-[12px] leading-[15px] text-ink tabular-nums">{formatTime(video.duration)}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      {selected && !sampleVideos.some((video) => video.id === selected.id) &&
        <Text className="mt-4 font-semibold text-[14px] text-brand" numberOfLines={1}>Selected: {selected.title}</Text>}
    </>
  );
}
