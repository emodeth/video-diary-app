import { useState } from "react";
import { Text, View } from "react-native";
import type { ClipSource } from "@/types/crop";
import { formatTime } from "../utils/formatTime";
import { getStartFromPosition } from "../utils/getStartFromPosition";

type Props = { selected: ClipSource; start: number; onStartChange: (start: number) => void };

export function ClipRangeStep({ selected, start, onStartChange }: Props) {
  const [timelineWidth, setTimelineWidth] = useState(0);
  const maxStart = Math.max(0, selected.duration - 5);
  const frameWidth = Math.max(19, timelineWidth * 5 / selected.duration);
  const range = `${formatTime(start)} – ${formatTime(start + 5)}`;
  const updateStart = (locationX: number) =>
    onStartChange(getStartFromPosition(locationX, timelineWidth, maxStart));

  return (
    <>
      <Text className="font-bold text-[26px] leading-[32px] tracking-[-0.7px] text-ink">Choose 5 seconds</Text>
      <Text className="mt-[5px] font-sans text-[16px] leading-[25px] text-muted">Drag the frame along the timeline to set where your clip starts.</Text>
      <View style={{ backgroundColor: selected.color }} className="mt-[23px] h-[215px] justify-between overflow-hidden rounded-[18px] p-[13px]">
        <View className="self-start rounded-full bg-white/90 px-[11px] py-[5px]"><Text className="font-semibold text-[13px] text-ink tabular-nums">{range}</Text></View>
        <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
          <View className="h-[67px] w-[67px] items-center justify-center rounded-full bg-white/85"><Text className="ml-[3px] font-bold text-[27px] text-brand">▶</Text></View>
        </View>
        <View className="flex-row items-center gap-[10px]">
          <Text className="font-medium text-[12px] text-ink tabular-nums">0:00</Text>
          <View className="h-[5px] flex-1 rounded-full bg-[#99A0B4]/60" />
          <Text className="font-medium text-[12px] text-ink tabular-nums">{formatTime(selected.duration)}</Text>
        </View>
      </View>
      <View className="mt-[25px] flex-row items-end justify-between">
        <Text className="font-bold text-[24px] tracking-[-0.6px] text-ink tabular-nums">{range}</Text>
        <Text className="pb-[3px] font-medium text-[13px] text-muted">5 sec · fixed length</Text>
      </View>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel="Clip start time"
        accessibilityValue={{ text: formatTime(start), min: 0, max: maxStart, now: start }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event) =>
          onStartChange(Math.max(0, Math.min(maxStart, start + (event.nativeEvent.actionName === "increment" ? 1 : -1))))}
        onLayout={(event) => setTimelineWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event) => updateStart(event.nativeEvent.locationX)}
        onResponderMove={(event) => updateStart(event.nativeEvent.locationX)}
        className="mt-[12px] h-[74px] flex-row overflow-hidden rounded-[12px] bg-[#E7E4EF]"
      >
        {Array.from({ length: 14 }, (_, index) =>
          <View key={index} pointerEvents="none" className="flex-1 border-r border-white/70"
            style={{ backgroundColor: ["#DEDBEA", "#E8E6F0", "#F0EEF5"][index % 3] }} />)}
        <View pointerEvents="none"
          style={{ width: frameWidth, left: maxStart ? (start / maxStart) * Math.max(0, timelineWidth - frameWidth) : 0 }}
          className="absolute inset-y-0 items-center justify-center rounded-[10px] border-2 border-brand bg-[#AAB9ED]">
          <View className="h-7 w-[3px] rounded-full bg-brand" />
        </View>
      </View>
      <Text className="mt-3 font-sans text-[13px] text-muted">Move the blue frame to choose a different start time.</Text>
    </>
  );
}
