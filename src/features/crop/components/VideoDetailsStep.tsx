import { Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import type { VideoThumbnail } from "expo-video";
import { useCropStore } from "../store";
import { thumbnailFile } from "@/features/videos/storage";
import { formatTime } from "../utils/formatTime";

type Props = {
  frames: VideoThumbnail[];
};

export function VideoDetailsStep({ frames }: Props) {
  const selected = useCropStore((state) => state.selected);
  const start = useCropStore((state) => state.start);
  const name = useCropStore((state) => state.name);
  const description = useCropStore((state) => state.description);
  const thumbnailFileName = useCropStore((state) => state.thumbnailFileName);
  const thumbnailStatus = useCropStore((state) => state.thumbnailStatus);
  const setName = useCropStore((state) => state.setName);
  const setDescription = useCropStore((state) => state.setDescription);

  if (!selected) return null;
  const poster = frames[Math.min(frames.length - 1, Math.floor((start / selected.duration) * frames.length))] ?? null;
  return (
    <>
      <Text className="font-sans-bold text-title tracking-[-0.7px] text-ink">Add details</Text>
      <Text className="mt-[5px] font-sans text-lead text-muted">Give your video a name so you can find it later.</Text>
      <View className="mt-[23px] flex-row items-center gap-[15px] border-b border-[#E7EAF0] pb-[22px]">
        <View className="h-[61px] w-[81px] overflow-hidden rounded-[12px] bg-black">
          {thumbnailFileName
            ? <Image source={{ uri: thumbnailFile(thumbnailFileName).uri }} contentFit="contain" style={{ width: "100%", height: "100%" }} />
            : poster && <Image source={poster} contentFit="contain" style={{ width: "100%", height: "100%" }} />}
        </View>
        <View className="flex-1">
          <Text className="font-sans-semibold text-row text-ink tabular-nums">{formatTime(start)} – {formatTime(start + 5)}</Text>
          <Text className="mt-[3px] font-sans text-meta text-muted">5-second moment from a {formatTime(selected.duration)} video</Text>
        </View>
      </View>
      {thumbnailStatus === "loading" && <Text className="mt-3 font-sans text-hint text-muted">Preparing thumbnail…</Text>}
      {thumbnailStatus === "error" && <Text className="mt-3 font-sans text-hint text-danger">Couldn’t prepare the thumbnail. Go back and choose the video again.</Text>}
      <View className="mt-[23px] flex-row justify-between">
        <Text className="font-sans-semibold text-body text-ink">Name</Text>
        <Text className="font-sans-medium text-meta text-muted tabular-nums">{name.length}/40</Text>
      </View>
      <TextInput value={name} onChangeText={setName} maxLength={40}
        placeholder="e.g. Ferry ride at sunrise" placeholderTextColor="#98A2B3"
        className="mt-[8px] h-[55px] rounded-[14px] border border-[#E5E9F0] px-[16px] font-sans text-body text-ink"
        accessibilityLabel="Video name" />
      <View className="mt-[48px] flex-row justify-between">
        <Text className="font-sans-semibold text-body text-ink">Description</Text>
        <Text className="font-sans-medium text-meta text-muted tabular-nums">{description.length}/200</Text>
      </View>
      <TextInput value={description} onChangeText={setDescription} maxLength={200}
        multiline textAlignVertical="top" placeholder="What makes this moment worth keeping?"
        placeholderTextColor="#98A2B3"
        className="mt-[8px] min-h-[130px] rounded-[14px] border border-[#E5E9F0] px-[16px] py-[15px] font-sans text-body text-ink"
        accessibilityLabel="Video description" />
    </>
  );
}
