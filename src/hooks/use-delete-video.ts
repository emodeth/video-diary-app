import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useToast } from "@/components/ui/Toast";
import type { Video } from "@/types/videos";
import { deleteVideo } from "@/db/videos.repository";
import { deleteThumbnailFile, deleteVideoFile } from "@/lib/file-system";
import { videoKeys } from "@/hooks/keys";

export function useDeleteVideo() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  const showToast = useToast();
  const [deleting, setDeleting] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  async function removeVideo(video: Video) {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteVideo(db, video.id);
      queryClient.removeQueries({ queryKey: videoKeys.detail(video.id) });
      await queryClient.invalidateQueries({ queryKey: videoKeys.all });
      try {
        deleteVideoFile(video.file_name);
        if (video.thumbnail_file_name) deleteThumbnailFile(video.thumbnail_file_name);
      } catch {
        // The library entry is removed even if a stored file cannot be cleaned up.
      }
      setVideoToDelete(null);
      router.back();
      showToast("Video deleted from your diary");
    } catch {
      showToast("Couldn’t delete video. Please try again", "error");
      setDeleting(false);
    }
  }

  function confirmDelete(video: Video) {
    setVideoToDelete(video);
  }

  return {
    deleting,
    videoToDelete,
    confirmDelete,
    cancelDelete: () => setVideoToDelete(null),
    deleteConfirmed: () => { if (videoToDelete) void removeVideo(videoToDelete); },
  };
}
