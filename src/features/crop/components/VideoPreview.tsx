import { Pressable, Text, View } from "react-native";
import { VideoView, type VideoPlayer, type VideoPlayerStatus } from "expo-video";
import { PreviewScrubber } from "./PreviewScrubber";

type Props = {
  player: VideoPlayer;
  status: VideoPlayerStatus;
  width: number;
  mediaHeight: number;
  currentTime: number;
  start: number;
  clipLength: number;
  progress: number;
  isPlaying: boolean;
  hasRenderedFrame: boolean;
  onTogglePlayback: () => void;
  onFirstFrameRender: () => void;
  onScrub: (progress: number, phase: "begin" | "move" | "end" | "accessibility") => void;
};

export function VideoPreview({ player, status, width, mediaHeight, currentTime, start, clipLength,
  progress, isPlaying, hasRenderedFrame, onTogglePlayback, onFirstFrameRender, onScrub }: Props) {
  return (
    <View className="mt-3">
      <View style={{ width }} className="relative self-center overflow-hidden rounded-[12px] bg-black">
        <View style={{ height: mediaHeight }}>
          <VideoView player={player} nativeControls={false} contentFit="contain" surfaceType="textureView"
            onFirstFrameRender={onFirstFrameRender} style={{ width: "100%", height: "100%" }} />
          <Pressable onPress={onTogglePlayback} accessibilityRole="button"
            accessibilityLabel={isPlaying ? "Pause preview" : "Play selected five seconds"}
            className="absolute inset-0" />
          <View pointerEvents="none" className="absolute left-3 top-3 rounded-full bg-white/90 px-[11px] py-[5px]">
            <Text className="font-semibold text-[13px] text-ink">Preview</Text>
          </View>
          <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
            {status === "error" ? (
              <View className="rounded-xl bg-white/90 px-4 py-3"><Text className="font-semibold text-[14px] text-ink">Couldn’t preview this video</Text></View>
            ) : !hasRenderedFrame ? (
              <View className="rounded-xl bg-white/90 px-4 py-3"><Text className="font-semibold text-[14px] text-ink">Loading preview…</Text></View>
            ) : !isPlaying ? (
              <View className="h-[58px] w-[58px] items-center justify-center rounded-full bg-white/85">
                <Text className="ml-1 font-bold text-[25px] text-brand">▶</Text>
              </View>
            ) : null}
          </View>
        </View>
        <PreviewScrubber currentTime={currentTime} start={start} clipLength={clipLength}
          progress={progress} onScrub={onScrub} />
      </View>
    </View>
  );
}
