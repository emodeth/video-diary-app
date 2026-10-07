import { useCallback, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import { useCreateVideo } from "@/hooks/useVideos";
import { videoMetadataSchema } from "@/schemas/videoMetadata.schema";
import { useCropStore } from "@/stores/crop.store";

export function useSaveVideo({ onSaved, isDismissing }: { onSaved: () => void; isDismissing: () => boolean }) {
  const showToast = useToast();
  const { mutateAsync: createVideo, isPending: saving } = useCreateVideo();
  const finishInFlight = useRef(false);
  const mounted = useRef(true);
  const isBusy = useCallback(() => finishInFlight.current, []);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function finish() {
    if (isDismissing()) return;
    const { selected: source, start, name, description, thumbnailFileName, thumbnailStatus: currentThumbnailStatus } = useCropStore.getState();
    const metadata = videoMetadataSchema.safeParse({ name, description });
    if (isBusy() || !source || !metadata.success) return;
    if (!thumbnailFileName || currentThumbnailStatus !== "ready") {
      showToast(currentThumbnailStatus === "loading"
        ? "Thumbnail is still preparing"
        : "Thumbnail isn’t ready. Please retry", "error");
      return;
    }
    finishInFlight.current = true;
    try {
      await createVideo({
        sourceUri: source.id,
        thumbnailFileName,
        startSeconds: start,
        title: metadata.data.name,
        description: metadata.data.description,
      });
      useCropStore.getState().markThumbnailSaved();
      if (mounted.current) {
        onSaved();
        showToast("Video saved to your diary");
      } else {
        useCropStore.getState().reset();
      }
    } catch {
      if (mounted.current) showToast("Couldn’t save video. Please try again", "error");
      else useCropStore.getState().reset();
    } finally {
      finishInFlight.current = false;
    }
  }

  return { finish, saving, isBusy };
}
