import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import type { VideoPlayer, VideoThumbnail } from "expo-video";
import type { VideoSource } from "@/types/crop";

type TimelineFrames = { player: VideoPlayer; uri: string; items: (VideoThumbnail | null)[]; failed: boolean };

function frameCount(duration: number) {
  if (duration <= 10) return 4;
  if (duration <= 30) return 5;
  if (duration <= 60) return 8;
  if (duration <= 180) return 10;
  return 12;
}

function frameOrder(count: number) {
  const order: number[] = [];
  const visit = (left: number, right: number) => {
    if (left > right) return;
    const middle = Math.floor((left + right) / 2);
    order.push(middle);
    visit(left, middle - 1);
    visit(middle + 1, right);
  };
  order.push(0);
  if (count > 1) order.push(count - 1);
  visit(1, count - 2);
  return order;
}

export function useTimelineFrames(player: VideoPlayer, selected: VideoSource | null, ready: boolean) {
  const [result, setResult] = useState<TimelineFrames | null>(null);
  const startedPlayer = useRef<VideoPlayer | null>(null);
  const runId = useRef(0);
  const uri = selected?.id ?? null;
  const duration = selected?.duration ?? 0;

  useEffect(() => {
    runId.current += 1;
    startedPlayer.current = null;
    return () => {
      runId.current += 1;
      startedPlayer.current = null;
    };
  }, [player, uri]);

  useEffect(() => {
    if (!uri || !ready || player.status !== "readyToPlay" || Platform.OS === "web") return;
    if (startedPlayer.current === player) return;
    startedPlayer.current = player;
    const run = ++runId.current;
    const isCurrent = () => runId.current === run;
    const count = frameCount(duration);
    const times = Array.from({ length: count }, (_, index) =>
      Math.min(duration - 0.01, (duration * (index + 0.5)) / count));
    const items: (VideoThumbnail | null)[] = Array(count).fill(null);

    void (async () => {
      for (const index of frameOrder(count)) {
        if (!isCurrent()) return;
        try {
          items[index] = (await player.generateThumbnailsAsync([times[index]], {
            maxWidth: 64,
            maxHeight: 112,
          }))[0] ?? null;
        } catch {
          items[index] = null;
        }
        if (isCurrent()) setResult({ player, uri, items: [...items], failed: false });
      }

      if (!isCurrent()) return;
      const available = items.flatMap((item, index) => item ? [index] : []);
      if (available.length === 0) {
        setResult({ player, uri, items: [...items], failed: true });
        return;
      }
      setResult({
        player, uri, failed: false,
        items: items.map((item, index) => item ?? items[available.reduce((closest, candidate) =>
          Math.abs(candidate - index) < Math.abs(closest - index) ? candidate : closest)]),
      });
    })();
  }, [player, uri, duration, ready]);

  const current = result?.player === player && result.uri === uri ? result : null;
  return {
    frames: current ? { uri: current.uri, items: current.items } : null,
    failed: current?.failed ?? false,
  };
}
