import { useEffect, useRef } from "react";
import type { VideoPlayer } from "expo-video";
import { createVideoThumbnail } from "@/lib/videoThumbnail";
import { safeDeleteThumbnail } from "@/lib/fileSystem";
import { useCropStore } from "@/stores/crop.store";
import type { VideoSource } from "@/types/crop";

export function useCropThumbnail(player: VideoPlayer, selected: VideoSource | null, playerStatus: VideoPlayer["status"]) {
  const thumbnailStatus = useCropStore((state) => state.thumbnailStatus);
  const selectionVersion = useCropStore((state) => state.selectionVersion);
  const startedFor = useRef<number | null>(null);

  useEffect(() => {
    if (!selected || thumbnailStatus !== "loading") return;
    // useEvent can still hold the previous player's status after a source change.
    if (player.status === "error") {
      useCropStore.getState().setThumbnailError(selectionVersion);
      return;
    }
    if (player.status !== "readyToPlay" || startedFor.current === selectionVersion) return;
    startedFor.current = selectionVersion;

    void createVideoThumbnail(player)
      .then((fileName) => {
        if (!useCropStore.getState().setThumbnail(selectionVersion, fileName)) safeDeleteThumbnail(fileName);
      })
      .catch(() => useCropStore.getState().setThumbnailError(selectionVersion));
  }, [player, selected, selectionVersion, playerStatus, thumbnailStatus]);
}

// Owns the crop session while the native picker may outlive this screen.
