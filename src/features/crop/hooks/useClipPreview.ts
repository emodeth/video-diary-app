/* eslint-disable react-hooks/immutability -- Expo Video exposes imperative playback and seek controls. */
import { useEffect, useRef, useState } from "react";
import { useEvent, useEventListener } from "expo";
import type { VideoPlayer, VideoPlayerStatus } from "expo-video";

const SEEK_INTERVAL_MS = 40;
const DRAG_SEEK_TOLERANCE_SECONDS = 0.35;

type Options = {
  player: VideoPlayer;
  status: VideoPlayerStatus;
  start: number;
  maxStart: number;
  clipLength: number;
  onStartChange: (start: number) => void;
};

export function useClipPreview({ player, status, start, maxStart, clipLength, onStartChange }: Options) {
  const [currentTime, setCurrentTime] = useState(start);
  const [hasRenderedFrame, setHasRenderedFrame] = useState(false);
  const startRef = useRef(start);
  const currentTimeRef = useRef(start);
  const lastSeekAt = useRef(0);
  const loopPending = useRef(false);
  const timelineDragging = useRef(false);
  const previewDrag = useRef<{ wasPlaying: boolean; nextTime: number } | null>(null);
  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });
  const progress = Math.max(0, Math.min(1, (currentTime - start) / clipLength));

  useEffect(() => {
    startRef.current = start;
  }, [start]);

  useEffect(() => {
    player.pause();
    player.currentTime = start;
    currentTimeRef.current = start;
    return () => {
      player.pause();
      player.scrubbingModeOptions = { scrubbingModeEnabled: false };
      player.seekTolerance = { toleranceBefore: 0, toleranceAfter: 0 };
    };
    // The range step remounts for each selected video; its controls handle start changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(() => {
    player.timeUpdateEventInterval = 0.05;
    return () => { player.timeUpdateEventInterval = 0; };
  }, [player]);

  useEventListener(player, "timeUpdate", ({ currentTime: time }) => {
    if (previewDrag.current || timelineDragging.current) return;
    const clipStart = startRef.current;
    if (time < clipStart + clipLength - 0.1) loopPending.current = false;
    if (time >= clipStart + clipLength - 0.05 && player.playing && !loopPending.current) {
      loopPending.current = true;
      player.currentTime = clipStart;
      currentTimeRef.current = clipStart;
      setCurrentTime(clipStart);
      player.play();
    } else if (time >= clipStart && time <= clipStart + clipLength) {
      currentTimeRef.current = time;
      setCurrentTime(time);
    }
  });

  useEventListener(player, "playToEnd", () => {
    if (previewDrag.current || timelineDragging.current || loopPending.current) return;
    loopPending.current = true;
    const clipStart = startRef.current;
    player.currentTime = clipStart;
    currentTimeRef.current = clipStart;
    setCurrentTime(clipStart);
    player.play();
  });

  function seek(time: number, exact = false) {
    const now = Date.now();
    if (!exact && now - lastSeekAt.current < SEEK_INTERVAL_MS) return;
    lastSeekAt.current = now;
    player.currentTime = time;
  }

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

  function showTime(time: number) {
    currentTimeRef.current = time;
    setCurrentTime(time);
  }

  function changeStart(next: number, exact = false) {
    const clamped = Math.max(0, Math.min(maxStart, next));
    if (!exact && clamped === startRef.current) return;
    startRef.current = clamped;
    loopPending.current = false;
    onStartChange(clamped);
    showTime(clamped);
    seek(clamped, exact);
  }

  function togglePlayback() {
    if (!hasRenderedFrame || status === "error") return;
    if (isPlaying) player.pause();
    else {
      const clipStart = startRef.current;
      if (currentTimeRef.current < clipStart || currentTimeRef.current >= clipStart + clipLength - 0.05) {
        seek(clipStart, true);
        showTime(clipStart);
      }
      player.play();
    }
  }

  function scrubTo(progress: number, phase: "begin" | "move" | "end" | "accessibility") {
    if (phase === "begin") {
      previewDrag.current = { wasPlaying: player.playing, nextTime: currentTimeRef.current };
      beginScrubbing();
    }
    if (phase === "end") {
      const drag = previewDrag.current;
      if (!drag) return;
      endScrubbing();
      seek(drag.nextTime, true);
      previewDrag.current = null;
      if (drag.wasPlaying) player.play();
      return;
    }
    if (phase === "move" && !previewDrag.current) return;
    const time = startRef.current + Math.max(0, Math.min(1, progress)) * clipLength;
    if (phase === "accessibility") player.pause();
    if (previewDrag.current) previewDrag.current.nextTime = time;
    showTime(time);
    seek(time, phase === "accessibility");
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
  function onFirstFrameRender() { setHasRenderedFrame(true); }

  return { currentTime, progress, isPlaying, hasRenderedFrame, togglePlayback, scrubTo,
    changeStart, beginTimelineDrag, endTimelineDrag, pause, nudgeStart, onFirstFrameRender };
}
