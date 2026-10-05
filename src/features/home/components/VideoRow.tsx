import { Image } from "expo-image";
import { router } from "expo-router";
import { Play } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import type { Video } from "../../../types/videos";
import { thumbnailFile } from "@/features/videos/storage";
import colors from "@/theme/colors.json";

type VideoRowProps = {
  video: Video;
};

export function VideoRow({ video }: VideoRowProps) {
  const thumbnailUri = video.thumbnail_file_name ? thumbnailFile(video.thumbnail_file_name).uri : null;

  return (
    <Button
      label={`Open ${video.title}`}
      accessibilityLabel={`Open ${video.title}`}
      onPress={() => router.push({ pathname: "/videos/[id]", params: { id: String(video.id) } })}
      variant="ghost"
      size="row"
      fullWidth
    >
      <View className="h-[94px] w-[108px] overflow-hidden rounded-[13px] bg-brand-soft">
        {thumbnailUri && <Image source={{ uri: thumbnailUri }} contentFit="cover" style={{ width: "100%", height: "100%" }} />}
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-surface/95">
            <Play size={15} color={colors.brand.DEFAULT} fill={colors.brand.DEFAULT} strokeWidth={1.5} style={{ marginLeft: 2 }} />
          </View>
        </View>
      </View>
      <View className="min-w-0 flex-1 pl-[16px]">
        <Text className="font-sans-semibold text-row text-ink" numberOfLines={1}>{video.title}</Text>
        <Text className="mt-[3px] font-sans text-secondary text-muted" numberOfLines={2}>{video.description}</Text>
        <Text className="mt-[5px] font-sans-medium text-caption text-muted tabular-nums">{new Date(video.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</Text>
      </View>
    </Button>
  );
}
