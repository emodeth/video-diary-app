import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getPreviewSize } from "@/lib/getPreviewSize";
import colors from "@/theme/colors.json";
import { DeleteVideoDialog } from "@/components/videos/DeleteVideoDialog";
import { EditVideoModal } from "@/components/videos/EditVideoModal";
import {
  VideoDetailsActions,
  VideoDetailsActionsSkeleton,
} from "@/components/videos/VideoDetailsActions";
import { VideoDetailsContent } from "@/components/videos/VideoDetailsContent";
import { VideoDetailsUnavailable } from "@/components/videos/VideoDetailsUnavailable";
import { useDeleteVideo, useVideo } from "@/hooks/useVideos";

export default function VideoRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const videoId = Number(id);
  const {
    data: video,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useVideo(videoId);
  const [editing, setEditing] = useState(false);
  const {
    deleting,
    videoToDelete,
    confirmDelete,
    cancelDelete,
    deleteConfirmed,
  } = useDeleteVideo();
  const loading = isPending && Number.isInteger(videoId) && videoId > 0;
  const hasDetails = !!video || loading;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topInset =
    Platform.OS === "android"
      ? Math.max(insets.top, StatusBar.currentHeight ?? 0)
      : insets.top;
  const { previewWidth, cardHeight } = getPreviewSize(
    width,
    height,
    topInset,
    insets.bottom,
  );

  return (
    <View
      className="flex-1 bg-surface"
      style={{ paddingTop: topInset, paddingBottom: insets.bottom }}
    >
      <View className="h-[56px] flex-row items-center justify-center px-6">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          className="absolute left-5 h-11 w-11 items-center justify-center"
        >
          <ChevronLeft size={24} color={colors.ink} strokeWidth={2} />
        </Pressable>
        <Text className="font-sans-semibold text-body text-ink">Details</Text>
      </View>

      {hasDetails ? (
        <VideoDetailsContent
          video={video}
          previewWidth={previewWidth}
          cardHeight={cardHeight}
        />
      ) : (
        <VideoDetailsUnavailable
          isError={isError}
          isFetching={isFetching}
          onRetry={() => refetch()}
        />
      )}

      {video ? (
        <VideoDetailsActions
          disabled={deleting}
          onEdit={() => setEditing(true)}
          onDelete={() => {
            if (video) confirmDelete(video);
          }}
        />
      ) : loading ? (
        <VideoDetailsActionsSkeleton />
      ) : null}
      {editing && video && (
        <EditVideoModal video={video} onClose={() => setEditing(false)} />
      )}
      {videoToDelete && (
        <DeleteVideoDialog
          title={videoToDelete.title}
          deleting={deleting}
          onCancel={cancelDelete}
          onDelete={deleteConfirmed}
        />
      )}
    </View>
  );
}
