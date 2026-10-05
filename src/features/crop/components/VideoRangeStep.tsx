import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
  VideoPlayer,
  VideoPlayerStatus,
  VideoThumbnail,
} from "expo-video";
import { CLIP_LENGTH } from "../constants";
import { useClipPreview } from "../hooks/useClipPreview";
import { useCropStore } from "../store";
import { VideoPreview } from "./VideoPreview";
import { VideoTimeline } from "./VideoTimeline";

type Props = {
  player: VideoPlayer;
  playerStatus: VideoPlayerStatus;
  frames: VideoThumbnail[];
  framesFailed: boolean;
};

export function VideoRangeStep({
  player,
  playerStatus,
  frames,
  framesFailed,
}: Props) {
  const selected = useCropStore((state) => state.selected);
  const start = useCropStore((state) => state.start);
  const setStart = useCropStore((state) => state.setStart);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const previewWidth = Math.min(width, 620) - 54;
  const sheetHeight = Math.min(height * 0.91, height - insets.top - 12);
  const previewHeight = Math.max(
    292,
    sheetHeight - 96 - (70 + Math.max(insets.bottom, 16)) - 292,
  );
  const mediaHeight = previewHeight - 52;
  const maxStart = Math.max(0, (selected?.duration ?? CLIP_LENGTH) - CLIP_LENGTH);
  const preview = useClipPreview({
    player,
    status: playerStatus,
    start,
    maxStart,
    clipLength: CLIP_LENGTH,
    onStartChange: setStart,
  });

  if (!selected) return null;

  return (
    <>
      <Text className="font-bold text-[26px] leading-[32px] tracking-[-0.7px] text-ink">
        Choose 5 seconds
      </Text>
      <Text className="mt-[5px] font-sans text-[16px] leading-[25px] text-muted">
        Drag the frame along the timeline to choose where your clip starts.
      </Text>
      <VideoPreview
        player={player}
        status={playerStatus}
        width={previewWidth}
        mediaHeight={mediaHeight}
        currentTime={preview.currentTime}
        start={start}
        clipLength={CLIP_LENGTH}
        progress={preview.progress}
        isPlaying={preview.isPlaying}
        hasRenderedFrame={preview.hasRenderedFrame}
        onTogglePlayback={preview.togglePlayback}
        onFirstFrameRender={preview.onFirstFrameRender}
        onScrub={preview.scrubTo}
      />
      <VideoTimeline
        frames={frames}
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Move clip back one second"
          disabled={start <= 0}
          onPress={() => preview.nudgeStart(-1)}
          className="h-[52px] flex-1 items-center justify-center rounded-[13px] border border-[#E5E9F0] active:bg-[#F4F6FA]"
          style={{ opacity: start <= 0 ? 0.45 : 1 }}
        >
          <Text className="font-semibold text-[16px] text-ink">− 1 sec</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Move clip forward one second"
          disabled={start >= maxStart}
          onPress={() => preview.nudgeStart(1)}
          className="h-[52px] flex-1 items-center justify-center rounded-[13px] border border-[#E5E9F0] active:bg-[#F4F6FA]"
          style={{ opacity: start >= maxStart ? 0.45 : 1 }}
        >
          <Text className="font-semibold text-[16px] text-ink">+ 1 sec</Text>
        </Pressable>
      </View>
      <Text className="mt-3 font-sans text-[14px] leading-[20px] text-muted">
        Drag the frame, tap the timeline, or nudge by a second.
      </Text>
      {framesFailed && (
        <Text className="mt-2 font-sans text-[13px] text-muted">
          Frames unavailable. Drag the blue frame to choose a start time.
        </Text>
      )}
    </>
  );
}
