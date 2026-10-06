import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { getPreviewSize } from "@/lib/getPreviewSize";
import colors from "@/theme/colors.json";
import { DeleteVideoDialog } from "@/components/videos/DeleteVideoDialog";
import { EditVideoModal } from "@/components/videos/EditVideoModal";
import { VideoDetailsActions } from "@/components/videos/VideoDetailsActions";
import { VideoDetailsBody } from "@/components/videos/VideoDetailsBody";
import { VideoDetailsSkeleton } from "@/components/videos/VideoDetailsSkeleton";
import { useDeleteVideo } from "@/hooks/use-delete-video";
import { useVideo } from "@/hooks/use-video";

export default function VideoRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const videoId = Number(id);
  const { data: video, isPending, isError, refetch } = useVideo(videoId);
  const [editing, setEditing] = useState(false);
  const { deleting, videoToDelete, confirmDelete, cancelDelete, deleteConfirmed } = useDeleteVideo();
  const loading = isPending && Number.isInteger(videoId) && videoId > 0;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { previewWidth, cardHeight } = getPreviewSize(width, height, insets.top, insets.bottom);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <View className="h-[56px] flex-row items-center justify-center px-6">
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back"
          className="absolute left-5 h-11 w-11 items-center justify-center">
          <ChevronLeft size={24} color={colors.ink} strokeWidth={2} />
        </Pressable>
        <Text className="font-sans-semibold text-body text-ink">Details</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="flex-grow px-6 pt-2" showsVerticalScrollIndicator={false}>
        {video ? (
          <VideoDetailsBody video={video} previewWidth={previewWidth} cardHeight={cardHeight} />
        ) : loading ? (
          <VideoDetailsSkeleton previewWidth={previewWidth} cardHeight={cardHeight} />
        ) : isError ? (
          <Button label="Couldn’t load video. Tap to retry." variant="ghost" onPress={() => refetch()} className="mt-10 self-center" />
        ) : (
          <Text className="mt-10 text-center font-sans-semibold text-body text-ink">Video not found</Text>
        )}
      </ScrollView>

      {(video || loading) && (
        <VideoDetailsActions disabled={loading || deleting} onEdit={() => setEditing(true)}
          onDelete={() => { if (video) confirmDelete(video); }} />
      )}
      {editing && video && <EditVideoModal video={video} onClose={() => setEditing(false)} />}
      {videoToDelete && (
        <DeleteVideoDialog title={videoToDelete.title} deleting={deleting}
          onCancel={cancelDelete} onDelete={deleteConfirmed} />
      )}
    </SafeAreaView>
  );
}
