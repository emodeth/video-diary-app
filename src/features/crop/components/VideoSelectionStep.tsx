import { Text, View } from "react-native";
import type { VideoSource } from "@/types/crop";
import { Button } from "@/components/ui/Button";
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
      <Button label="Choose video" variant="outline" size="large" fullWidth onPress={onBrowse}
        className="mt-[23px]" icon={<View className="h-[13px] w-[18px] rounded-[2px] border-2 border-ink" />} />
      {selected && <View className="mt-5 rounded-[14px] bg-brand-soft px-4 py-4">
        <Text className="font-semibold text-[15px] text-ink" numberOfLines={1}>{selected.title}</Text>
        <Text className="mt-1 font-sans text-[13px] text-muted">{formatTime(selected.duration)} video selected</Text>
      </View>}
    </>
  );
}
