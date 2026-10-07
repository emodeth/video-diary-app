import type { VideoThumbnail } from "expo-video";
import { MetadataForm } from "@/components/MetadataForm";
import { useCropStore } from "@/stores/crop.store";
import { thumbnailFile } from "@/lib/fileSystem";
import { formatTime } from "@/lib/videoUtils";

type VideoDetailsStepProps = {
  frames: (VideoThumbnail | null)[];
};

export function VideoDetailsStep({ frames }: VideoDetailsStepProps) {
  const selected = useCropStore((state) => state.selected);
  const start = useCropStore((state) => state.start);
  const name = useCropStore((state) => state.name);
  const description = useCropStore((state) => state.description);
  const thumbnailFileName = useCropStore((state) => state.thumbnailFileName);
  const thumbnailStatus = useCropStore((state) => state.thumbnailStatus);
  const setName = useCropStore((state) => state.setName);
  const setDescription = useCropStore((state) => state.setDescription);

  if (!selected) return null;
  const poster =
    frames[
      Math.min(
        frames.length - 1,
        Math.floor((start / selected.duration) * frames.length),
      )
    ] ?? null;
  return (
    <MetadataForm
      heading="Add details"
      helperText="Give your video a name so you can find it later."
      thumbnailSource={
        thumbnailFileName
          ? { uri: thumbnailFile(thumbnailFileName).uri }
          : poster
      }
      timeRange={`0:00 – ${formatTime(selected.duration)}`}
      clipDescription={`Full video saved · previewed ${formatTime(start)} – ${formatTime(start + 5)}`}
      name={name}
      onChangeName={setName}
      description={description}
      onChangeDescription={setDescription}
      thumbnailFeedback={
        thumbnailStatus === "loading"
          ? { message: "Preparing thumbnail…" }
          : thumbnailStatus === "error"
            ? {
                message:
                  "Couldn’t prepare the thumbnail. Tap Retry thumbnail to try again.",
                isError: true,
              }
            : undefined
      }
    />
  );
}
