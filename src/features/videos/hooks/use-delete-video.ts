import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Alert } from "react-native";
import type { Video } from "@/types/videos";
import { deleteVideo } from "../repository";
import { deleteThumbnailFile, deleteVideoFile } from "../storage";
import { videoKeys } from "./keys";

export function useDeleteVideo() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

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
      router.back();
    } catch {
      Alert.alert("Couldn’t delete video", "Please try again.");
      setDeleting(false);
    }
  }

  function confirmDelete(video: Video) {
    Alert.alert("Delete video?", `“${video.title}” will be permanently deleted.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete video", style: "destructive", onPress: () => { void removeVideo(video); } },
    ]);
  }

  return { deleting, confirmDelete };
}
