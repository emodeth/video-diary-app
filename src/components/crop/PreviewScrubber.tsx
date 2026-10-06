import { useState } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { formatTime } from "@/lib/formatTime";

type Props = {
  currentTime: number;
  start: number;
  clipLength: number;
  progress: number;
  onScrub: (progress: number, phase: "begin" | "move" | "end" | "accessibility") => void;
};

export function PreviewScrubber({ currentTime, start, clipLength, progress, onScrub }: Props) {
  const [width, setWidth] = useState(0);
  const position = (x: number) => Math.max(0, Math.min(1, x / Math.max(width, 1)));
  const pan = Gesture.Pan().activeOffsetX([-5, 5]).failOffsetY([-12, 12]).runOnJS(true)
    .onStart((event) => onScrub(position(event.x), "begin"))
    .onUpdate((event) => onScrub(position(event.x), "move"))
    .onFinalize(() => onScrub(0, "end"));
  const tap = Gesture.Tap().runOnJS(true).onEnd((event, success) => {
    if (success) {
      onScrub(position(event.x), "begin");
      onScrub(0, "end");
    }
  });

  return (
    <View className="mx-3 mb-3 mt-1 flex-row items-center gap-[8px] rounded-full bg-[#223149] px-3 py-2">
      <Text className="min-w-[39px] font-sans-medium text-chip text-white tabular-nums">{formatTime(Math.max(0, currentTime - start))}</Text>
      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <View accessibilityRole="adjustable" accessibilityLabel="Position within selected five seconds"
          accessibilityValue={{ min: 0, max: clipLength, now: Math.round((currentTime - start) * 10) / 10 }}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          onAccessibilityAction={(event) => {
            const delta = event.nativeEvent.actionName === "increment" ? 0.1 : -0.1;
            onScrub(Math.max(0, Math.min(1, progress + delta / clipLength)), "accessibility");
          }}
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
          className="h-[20px] flex-1 justify-center">
          <View pointerEvents="none" className="h-[4px] overflow-hidden rounded-full bg-white/35">
            <View className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </View>
          <View pointerEvents="none" className="absolute h-[12px] w-[12px] rounded-full border-2 border-white bg-brand"
            style={{ left: Math.max(0, progress * (width - 12)) }} />
        </View>
      </GestureDetector>
      <Text className="font-sans-medium text-chip text-white tabular-nums">{formatTime(clipLength)}</Text>
    </View>
  );
}
