/* eslint-disable react-hooks/immutability -- Expo Video exposes imperative playback and seek controls. */
/* eslint-disable react-hooks/refs -- Gesture callbacks access refs only after user interaction. */
import { useCallback, useRef, useState } from "react";
import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pause, Play, RotateCcw } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { CLIP_LENGTH } from "@/constants";
import { formatTime } from "@/lib/videoUtils";
import colors from "@/theme/colors.json";

type VideoDetailsPlayerProps = {
  uri: string;
  startSeconds: number;
  width: number;
  height: number;
};

function playbackStart(duration: number, selectedStart: number) {
  // Android's expo-trim-video output retains source timestamps. iOS exports a new
  // timeline beginning at zero. Clamp for older files with shorter media timelines.
  return Platform.OS === "android" && duration > CLIP_LENGTH
    ? Math.min(selectedStart, Math.max(0, duration - CLIP_LENGTH))
    : 0;
}

export function VideoDetailsPlayer({ uri, startSeconds, width, height }: VideoDetailsPlayerProps) {
  const player = useVideoPlayer(uri, (createdPlayer) => {
    createdPlayer.timeUpdateEventInterval = 0.1;
  });
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const scrubbing = useRef(false);
  const resumeAfterScrub = useRef(false);
  const scrubbedTime = useRef(0);
  const lastSeekAt = useRef(0);

  function clipStart() {
    return playbackStart(player.duration, startSeconds);
  }

  const seekToPosition = useCallback((x: number) => {
    if (trackWidth <= 0) return;
    const next = Math.max(0, Math.min(CLIP_LENGTH, (x / trackWidth) * CLIP_LENGTH));
    scrubbedTime.current = next;
    setElapsed(next);
    const now = Date.now();
    if (!scrubbing.current || now - lastSeekAt.current >= 40) {
      player.currentTime = playbackStart(player.duration, startSeconds) + next;
      lastSeekAt.current = now;
    }
    if (next >= CLIP_LENGTH - 0.05) player.pause();
  }, [player, startSeconds, trackWidth]);

  useEventListener(player, "sourceLoad", ({ duration }) => {
    player.currentTime = playbackStart(duration, startSeconds);
    setElapsed(0);
  });

  useEventListener(player, "timeUpdate", ({ currentTime }) => {
    if (scrubbing.current) return;
    const start = clipStart();
    if (currentTime < start - 0.05) {
      player.currentTime = start;
      setElapsed(0);
    } else if (currentTime >= start + CLIP_LENGTH - 0.05) {
      player.pause();
      setElapsed(CLIP_LENGTH);
    } else {
      setElapsed(Math.max(0, currentTime - start));
    }
  });

  useEventListener(player, "playingChange", ({ isPlaying: playing }) => {
    setIsPlaying(playing);
  });

  useEventListener(player, "playToEnd", () => {
    player.pause();
    setElapsed(CLIP_LENGTH);
  });

  function togglePlayback() {
    if (player.playing) {
      player.pause();
      return;
    }
    const start = clipStart();
    if (elapsed >= CLIP_LENGTH - 0.05 || player.currentTime < start || player.currentTime >= start + CLIP_LENGTH - 0.05) {
      player.currentTime = start;
      setElapsed(0);
    }
    player.play();
  }

  const pan = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .failOffsetY([-12, 12])
    .runOnJS(true)
    .onStart((event) => {
      scrubbing.current = true;
      setIsScrubbing(true);
      resumeAfterScrub.current = player.playing;
      lastSeekAt.current = 0;
      player.pause();
      seekToPosition(event.x);
    })
    .onUpdate((event) => seekToPosition(event.x))
    .onFinalize(() => {
      if (!scrubbing.current) return;
      scrubbing.current = false;
      setIsScrubbing(false);
      player.currentTime = clipStart() + scrubbedTime.current;
      if (resumeAfterScrub.current && scrubbedTime.current < CLIP_LENGTH - 0.05) player.play();
      resumeAfterScrub.current = false;
    });
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event, success) => {
      if (success) seekToPosition(event.x);
    });
  const isComplete = !isPlaying && elapsed >= CLIP_LENGTH - 0.05;

  return (
    <View style={{ width, height, alignSelf: "center", overflow: "hidden", borderRadius: 12, backgroundColor: colors.videoBackground }}>
      <VideoView
        player={player}
        nativeControls={false}
        surfaceType={Platform.OS === "android" ? "textureView" : undefined}
        style={{ width, height }}
      />
      <View className="absolute inset-x-0 bottom-0 bg-black/80 px-4 pb-3 pt-1">
        <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
          <View
            accessibilityRole="adjustable"
            accessibilityLabel="Clip playback position"
            accessibilityValue={{ min: 0, max: CLIP_LENGTH, now: Math.round(elapsed * 10) / 10, text: `${formatTime(elapsed)} of ${formatTime(CLIP_LENGTH)}` }}
            accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
            onAccessibilityAction={(event) => {
              const delta = event.nativeEvent.actionName === "increment" ? 1 : -1;
              seekToPosition(((elapsed + delta) / CLIP_LENGTH) * trackWidth);
            }}
            onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
            className="h-11 justify-center"
          >
            <View className="h-1.5 rounded-full bg-white/35">
              <View className="h-1.5 rounded-full bg-white" style={{ width: `${Math.min(100, (elapsed / CLIP_LENGTH) * 100)}%` }} />
            </View>
            <View
              className={`absolute rounded-full bg-white ${isScrubbing ? "h-4 w-4" : "h-3 w-3"}`}
              style={{ left: Math.max(0, Math.min(trackWidth - (isScrubbing ? 16 : 12), (elapsed / CLIP_LENGTH) * trackWidth - (isScrubbing ? 8 : 6))), top: isScrubbing ? 14 : 16 }}
            />
          </View>
        </GestureDetector>
        <View className="h-11 flex-row items-center justify-between">
          <Text className="w-12 font-sans-medium text-sm text-white tabular-nums">{formatTime(elapsed)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? "Pause clip" : isComplete ? "Replay clip" : "Play clip"}
            onPress={togglePlayback}
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.96 : 1 }] })}
          >
            {isPlaying ? (
              <Pause size={20} color={colors.ink} fill={colors.ink} />
            ) : isComplete ? (
              <RotateCcw size={20} color={colors.ink} strokeWidth={2.5} />
            ) : (
              <View className="ml-[2px]"><Play size={20} color={colors.ink} fill={colors.ink} /></View>
            )}
          </Pressable>
          <Text className="w-12 text-right font-sans-medium text-sm text-white/75 tabular-nums">{formatTime(CLIP_LENGTH)}</Text>
        </View>
      </View>
    </View>
  );
}
