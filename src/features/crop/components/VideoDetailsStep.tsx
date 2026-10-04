import { Text, TextInput, View } from "react-native";
import type { VideoSource } from "@/types/crop";
import { formatTime } from "../utils/formatTime";

type Props = {
  selected: VideoSource;
  start: number;
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
};

export function VideoDetailsStep({ selected, start, name, description, onNameChange, onDescriptionChange }: Props) {
  return (
    <>
      <Text className="font-bold text-[26px] leading-[32px] tracking-[-0.7px] text-ink">Add details</Text>
      <Text className="mt-[5px] font-sans text-[16px] leading-[25px] text-muted">Give your video a name so you can find it later.</Text>
      <View className="mt-[23px] flex-row items-center gap-[15px] border-b border-[#E7EAF0] pb-[22px]">
        <View style={{ backgroundColor: selected.color }} className="h-[61px] w-[81px] rounded-[12px]" />
        <View className="flex-1">
          <Text className="font-semibold text-[17px] text-ink tabular-nums">{formatTime(start)} – {formatTime(start + 5)}</Text>
          <Text className="mt-[3px] font-sans text-[13px] text-muted">5-second moment from a {formatTime(selected.duration)} video</Text>
        </View>
      </View>
      <View className="mt-[23px] flex-row justify-between">
        <Text className="font-semibold text-[14px] text-ink">Name</Text>
        <Text className="font-medium text-[14px] text-muted tabular-nums">{name.length}/40</Text>
      </View>
      <TextInput value={name} onChangeText={onNameChange} maxLength={40}
        placeholder="e.g. Ferry ride at sunrise" placeholderTextColor="#98A2B3"
        className="mt-[8px] h-[55px] rounded-[14px] border border-[#E5E9F0] px-[16px] font-sans text-[16px] text-ink"
        accessibilityLabel="Video name" />
      <View className="mt-[48px] flex-row justify-between">
        <Text className="font-semibold text-[14px] text-ink">Description</Text>
        <Text className="font-medium text-[14px] text-muted tabular-nums">{description.length}/200</Text>
      </View>
      <TextInput value={description} onChangeText={onDescriptionChange} maxLength={200}
        multiline textAlignVertical="top" placeholder="What makes this moment worth keeping?"
        placeholderTextColor="#98A2B3"
        className="mt-[8px] min-h-[130px] rounded-[14px] border border-[#E5E9F0] px-[16px] py-[15px] font-sans text-[16px] leading-[22px] text-ink"
        accessibilityLabel="Video description" />
    </>
  );
}
