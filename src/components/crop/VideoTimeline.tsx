/* eslint-disable react-hooks/refs -- Gesture callbacks keep the active drag position outside React render. */
import { useRef, useState } from "react";
import { Image } from "expo-image";
import type { VideoThumbnail } from "expo-video";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { formatTime } from "@/lib/formatTime";
import { getStartFromPosition } from "@/lib/getStartFromPosition";
import { PreviewSkeleton } from "@/components/PreviewSkeleton";

type VideoTimelineProps = {
  frames: (VideoThumbnail | null)[];
  framesLoading: boolean;
  duration: number;
  start: number;
  clipLength: number;
  progress: number;
  onStartChange: (start: number, exact?: boolean) => void;
  onDragBegin: () => void;
  onDragEnd: (start: number) => void;
  onPause: () => void;
};

export function VideoTimeline({
  frames,
  framesLoading,
  duration,
  start,
  clipLength,
  progress,
  onStartChange,
  onDragBegin,
  onDragEnd,
  onPause,
}: VideoTimelineProps) {
  const [width, setWidth] = useState(0);
  const drag = useRef<{ initialStart: number; nextStart: number } | null>(null);
  const maxStart = Math.max(0, duration - clipLength);
  const frameWidth = duration > 0 ? (width * clipLength) / duration : 0;
  const travel = Math.max(0, width - frameWidth);
  const left = duration > 0 ? (start / duration) * width : 0;

  function beginDrag() {
    onDragBegin();
    drag.current = { initialStart: start, nextStart: start };
  }

  function moveDrag(translationX: number) {
    const active = drag.current;
    if (!active) return;
    const next = getStartFromPosition(
      (maxStart > 0 ? active.initialStart / maxStart : 0) * travel +
        translationX,
      travel,
      maxStart,
    );
    active.nextStart = next;
    onStartChange(next);
  }

  function endDrag() {
    const active = drag.current;
    if (!active) return;
    drag.current = null;
    onDragEnd(active.nextStart);
  }

  function jump(x: number) {
    onPause();
    onStartChange(
      getStartFromPosition(x - frameWidth / 2, travel, maxStart),
      true,
    );
  }

  const pan = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .failOffsetY([-12, 12])
    .runOnJS(true)
    .onStart(beginDrag)
    .onUpdate((event) => moveDrag(event.translationX))
    .onFinalize(endDrag);
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event, success) => {
      if (success) jump(event.x);
    });

  return (
    <>
      <View className="mt-6 flex-row flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <Text className="font-sans-bold text-title tracking-[-0.7px] text-ink tabular-nums">
          {`${formatTime(start)} – ${formatTime(start + clipLength)}`}
        </Text>
        <Text className="font-sans-medium text-chip text-muted">
          {clipLength} sec · fixed length
        </Text>
      </View>
      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel="Video start time"
          accessibilityValue={{
            text: formatTime(start),
            min: 0,
            max: maxStart,
            now: start,
          }}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          onAccessibilityAction={(event) => {
            const delta =
              event.nativeEvent.actionName === "increment" ? 0.1 : -0.1;
            onPause();
            onStartChange(Math.round((start + delta) * 10) / 10, true);
          }}
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
          className="mt-[12px] h-[62px] flex-row overflow-hidden rounded-[12px] bg-track"
        >
          {frames.some(Boolean) ? (
            frames.map((frame, index) =>
              frame ? (
                <Image
                  key={index}
                  source={frame}
                  contentFit="cover"
                  pointerEvents="none"
                  style={{ width: `${100 / frames.length}%`, height: "100%" }}
                />
              ) : (
                <View
                  key={index}
                  style={{ width: `${100 / frames.length}%`, height: "100%" }}
                />
              ),
            )
          ) : (
            <PreviewSkeleton
              width={width}
              shimmer={framesLoading}
              label={
                framesLoading
                  ? "Timeline frames loading"
                  : "Timeline frames unavailable"
              }
            />
          )}
          <View
            pointerEvents="none"
            style={{ width: frameWidth, left }}
            className="absolute inset-y-0 items-center justify-center rounded-[10px] border-2 border-brand bg-track-selection/35"
          >
            <View className="h-7 w-[3px] rounded-full bg-brand" />
            <View
              className="absolute inset-y-0 w-[2px] bg-white"
              style={{
                left: Math.max(
                  0,
                  Math.min(frameWidth - 2, progress * frameWidth - 1),
                ),
              }}
            />
          </View>
        </View>
      </GestureDetector>
      <View className="mt-2 flex-row justify-between">
        <Text className="font-sans text-chip text-muted tabular-nums">
          0:00
        </Text>
        <Text className="font-sans text-chip text-muted tabular-nums">
          {formatTime(Math.round(duration / 2))}
        </Text>
        <Text className="font-sans text-chip text-muted tabular-nums">
          {formatTime(duration)}
        </Text>
      </View>
    </>
  );
}
