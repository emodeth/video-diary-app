import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { PlayMark } from "./PlayMark";
import type { Video } from "../../../types/videos";
import { formatTime } from "@/features/crop/utils/formatTime";

type VideoRowProps = {
  video: Video;
};

export function VideoRow({ video }: VideoRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${video.title}`}
      onPress={() => router.push({ pathname: "/videos/[id]", params: { id: String(video.id) } })}
      className="min-h-[135px] flex-row items-center py-[18px] active:opacity-70"
    >
      <View className="h-[76px] w-[96px] overflow-hidden rounded-[12px] bg-brand-soft">
        <View className="absolute inset-0 items-center justify-center"><PlayMark /></View>
        <View className="absolute bottom-[6px] right-[6px] rounded-full bg-white/90 px-[7px] py-[2px]">
          <Text className="font-semibold text-[11.5px] leading-[14px] text-ink tabular-nums">{formatTime(video.duration_seconds)}</Text>
        </View>
      </View>
      <View className="min-w-0 flex-1 pl-[18px]">
        <Text className="font-semibold text-[16px] leading-[21px] text-ink" numberOfLines={1}>{video.title}</Text>
        <Text className="mt-[4px] font-sans text-[14px] leading-[21px] text-muted" numberOfLines={2}>{video.description}</Text>
        <Text className="mt-[6px] font-medium text-[12.5px] leading-[17px] text-muted tabular-nums">{new Date(video.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Text>
      </View>
    </Pressable>
  );
}
