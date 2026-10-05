import { useEffect, useState } from "react";
import { useEvent } from "expo";
import { Image } from "expo-image";
import { useVideoPlayer, type VideoThumbnail } from "expo-video";
import { router } from "expo-router";
import { Play } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";
import type { Video } from "../../../types/videos";
import { videoFile } from "@/features/videos/storage";

type VideoRowProps = {
  video: Video;
};

export function VideoRow({ video }: VideoRowProps) {
  const player = useVideoPlayer(videoFile(video.file_name).uri);
  const { status } = useEvent(player, "statusChange", { status: player.status });
  const [thumbnail, setThumbnail] = useState<VideoThumbnail | null>(null);

  useEffect(() => {
    if (Platform.OS === "web" || status !== "readyToPlay") return;
    let cancelled = false;

    player.generateThumbnailsAsync(1, { maxWidth: 200, maxHeight: 176 })
      .then(([frame]) => {
        if (!cancelled && frame) setThumbnail(frame);
      })
      .catch(() => {
        // Keep the colored thumbnail surface if this video cannot be decoded.
      });

    return () => { cancelled = true; };
  }, [player, status]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${video.title}`}
      onPress={() => router.push({ pathname: "/videos/[id]", params: { id: String(video.id) } })}
      className="min-h-[126px] flex-row items-center py-[16px] active:opacity-70"
    >
      <View className="h-[94px] w-[108px] overflow-hidden rounded-[13px] bg-brand-soft">
        {thumbnail && <Image source={thumbnail} contentFit="cover" style={{ width: "100%", height: "100%" }} />}
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white/95">
            <Play size={15} color="#2563EB" fill="#2563EB" strokeWidth={1.5} style={{ marginLeft: 2 }} />
          </View>
        </View>
      </View>
      <View className="min-w-0 flex-1 pl-[16px]">
        <Text className="font-sans-semibold text-row text-ink" numberOfLines={1}>{video.title}</Text>
        <Text className="mt-[3px] font-sans text-secondary text-muted" numberOfLines={2}>{video.description}</Text>
        <Text className="mt-[5px] font-sans-medium text-caption text-muted tabular-nums">{new Date(video.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Text>
      </View>
    </Pressable>
  );
}
