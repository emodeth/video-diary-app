/* eslint-disable react-hooks/immutability -- Expo Video exposes imperative playback and seek controls. */
import { useCallback, useEffect, useRef, useState } from "react";
import { useEventListener } from "expo";
import type { VideoPlayer } from "expo-video";

const SEEK_INTERVAL_MS = 40;
const DRAG_SEEK_TOLERANCE_SECONDS = 0.35;

type Options = {
  player: VideoPlayer;
  start: number;
  maxStart: number;
  clipLength: number;
  onStartChange: (start: number) => void;
};

export function useClipPreview({ player, start, maxStart, clipLength, onStartChange }: Options) {
  const [currentTime, setCurrentTime] = useState(start);
  const startRef = useRef(start);
  const lastSeekAt = useRef(0);
  const loopPending = useRef(false);
  const timelineDragging = useRef(false);
  const progress = Math.max(0, Math.min(1, (currentTime - start) / clipLength));

  useEffect(() => {
    startRef.current = start;
  }, [start]);

  useEffect(() => {
    player.pause();
    player.currentTime = start;
    // The range step remounts for each selected video; its controls handle start changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(() => {
    player.timeUpdateEventInterval = 0.05;
  }, [player]);

  useEventListener(player, "timeUpdate", ({ currentTime: time }) => {
    if (timelineDragging.current) return;
    const clipStart = startRef.current;
    if (time < clipStart + clipLength - 0.1) loopPending.current = false;
    if ((time < clipStart || time >= clipStart + clipLength - 0.05) && !loopPending.current) {
      loopPending.current = true;
      player.currentTime = clipStart;
      setCurrentTime(clipStart);
      if (player.playing) player.play();
    } else if (time >= clipStart && time <= clipStart + clipLength) {
      setCurrentTime(time);
    }
  });

  useEventListener(player, "playToEnd", () => {
    if (timelineDragging.current || loopPending.current) return;
    loopPending.current = true;
    const clipStart = startRef.current;
    player.currentTime = clipStart;
    setCurrentTime(clipStart);
    player.play();
  });

  useEventListener(player, "sourceChange", () => {
    setCurrentTime(startRef.current);
  });

  const seek = useCallback((time: number, exact = false) => {
    const now = Date.now();
    if (!exact && now - lastSeekAt.current < SEEK_INTERVAL_MS) return;
    lastSeekAt.current = now;
    player.currentTime = time;
  }, [player]);

  function beginScrubbing() {
    player.pause();
    player.seekTolerance = {
      toleranceBefore: DRAG_SEEK_TOLERANCE_SECONDS,
      toleranceAfter: DRAG_SEEK_TOLERANCE_SECONDS,
    };
    player.scrubbingModeOptions = { scrubbingModeEnabled: true };
    lastSeekAt.current = 0;
  }

  function endScrubbing() {
    player.scrubbingModeOptions = { scrubbingModeEnabled: false };
    player.seekTolerance = { toleranceBefore: 0, toleranceAfter: 0 };
  }

  const showTime = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  function changeStart(next: number, exact = false) {
    const clamped = Math.max(0, Math.min(maxStart, next));
    if (!exact && clamped === startRef.current) return;
    startRef.current = clamped;
    loopPending.current = false;
    onStartChange(clamped);
    showTime(clamped);
    seek(clamped, exact);
  }

  function beginTimelineDrag() {
    beginScrubbing();
    timelineDragging.current = true;
  }

  function endTimelineDrag(finalStart: number) {
    endScrubbing();
    changeStart(finalStart, true);
    timelineDragging.current = false;
  }

  function pause() { player.pause(); }
  function nudgeStart(seconds: number) {
    player.pause();
    changeStart(Math.round((startRef.current + seconds) * 100) / 100, true);
  }
  return { progress, changeStart, beginTimelineDrag, endTimelineDrag, pause, nudgeStart };
}
