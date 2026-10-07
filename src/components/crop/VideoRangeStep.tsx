import { Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
  VideoPlayer as ExpoVideoPlayer,
  VideoThumbnail,
} from "expo-video";
import { CLIP_LENGTH } from "@/constants";
import { useClipPreview } from "@/hooks/crop";
import { useCropStore } from "@/stores/crop.store";
import { getPreviewSize } from "@/lib/videoUtils";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoTimeline } from "@/components/crop/VideoTimeline";
import { Button } from "@/components/ui/Button";

type VideoRangeStepProps = {
  player: ExpoVideoPlayer;
  frames: (VideoThumbnail | null)[];
  framesFailed: boolean;
};

export function VideoRangeStep({ player, frames, framesFailed }: VideoRangeStepProps) {
  const selected = useCropStore((state) => state.selected);
  const start = useCropStore((state) => state.start);
  const setStart = useCropStore((state) => state.setStart);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { previewWidth, cardHeight } = getPreviewSize(
    width,
    height,
    insets.top,
    insets.bottom,
  );
  const maxStart = Math.max(
    0,
    (selected?.duration ?? CLIP_LENGTH) - CLIP_LENGTH,
  );
  const preview = useClipPreview({
    player,
    start,
    maxStart,
    clipLength: CLIP_LENGTH,
    onStartChange: setStart,
  });

  if (!selected) return null;

  return (
    <>
      <Text className="font-sans-bold text-title tracking-[-0.7px] text-ink">
        Choose 5 seconds
      </Text>
      <Text className="mt-[5px] font-sans text-lead text-muted">
        Drag the frame along the timeline to choose where your clip starts.
      </Text>
      <View className="mt-3">
        <VideoPlayer player={player} width={previewWidth} height={cardHeight} />
      </View>
      <VideoTimeline
        frames={frames}
        framesLoading={!frames.some(Boolean) && !framesFailed}
        duration={selected.duration}
        start={start}
        clipLength={CLIP_LENGTH}
        progress={preview.progress}
        onStartChange={preview.changeStart}
        onDragBegin={preview.beginTimelineDrag}
        onDragEnd={preview.endTimelineDrag}
        onPause={preview.pause}
      />
      <View className="mt-4 flex-row gap-3">
        <Button
          label="− 1 sec"
          variant="ghost"
          fullWidth
          accessibilityLabel="Move clip back one second"
          disabled={start <= 0}
          onPress={() => preview.nudgeStart(-1)}
          className="flex-1"
          contentClassName="rounded-[13px] border border-line-control"
        >
          <Text className="font-sans-semibold text-button text-ink">
            − 1 sec
          </Text>
        </Button>
        <Button
          label="+ 1 sec"
          variant="ghost"
          fullWidth
          accessibilityLabel="Move clip forward one second"
          disabled={start >= maxStart}
          onPress={() => preview.nudgeStart(1)}
          className="flex-1"
          contentClassName="rounded-[13px] border border-line-control"
        >
          <Text className="font-sans-semibold text-button text-ink">
            + 1 sec
          </Text>
        </Button>
      </View>
      <Text className="mt-3 font-sans text-hint text-muted">
        Drag the frame, tap the timeline, or nudge by a second.
      </Text>
      {framesFailed && (
        <Text className="mt-2 font-sans text-hint text-muted">
          Frames unavailable. Drag the blue frame to choose a start time.
        </Text>
      )}
    </>
  );
}
