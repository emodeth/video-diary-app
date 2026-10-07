import { useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData, type QueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useToast } from "@/components/ui/Toast";
import { createVideo, type CreateVideoInput } from "@/lib/videoService";
import { deleteThumbnailFile, deleteVideoFile } from "@/lib/fileSystem";
import { deleteVideo, getVideo, getVideoStats, listVideos, type VideoCursor } from "@/db/videos.repository";
import { videoKeys } from "@/hooks/keys";
import type { Video } from "@/types/videos";

function refreshVideoQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.resetQueries({ queryKey: videoKeys.list }),
    queryClient.invalidateQueries({ queryKey: videoKeys.stats }),
  ]);
}

function reportRefreshFailure(error: unknown) {
  console.warn("Could not refresh video queries", error);
}

function refreshVideoQueriesInBackground(queryClient: QueryClient) {
  void Promise.resolve().then(() => refreshVideoQueries(queryClient)).catch(reportRefreshFailure);
}

function removeStoredFiles(video: Pick<Video, "fileName" | "thumbnailFileName">) {
  try {
    deleteVideoFile(video.fileName);
  } catch (error) {
    console.warn("Could not delete stored video file", error);
  }
  if (video.thumbnailFileName) {
    try {
      deleteThumbnailFile(video.thumbnailFileName);
    } catch (error) {
      console.warn("Could not delete stored thumbnail file", error);
    }
  }
}

export function useVideos() {
  const db = useSQLiteContext();
  return useInfiniteQuery({
    queryKey: videoKeys.list,
    queryFn: ({ pageParam }) => listVideos(db, pageParam),
    initialPageParam: null as VideoCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useVideoStats() {
  const db = useSQLiteContext();
  return useQuery({ queryKey: videoKeys.stats, queryFn: () => getVideoStats(db) });
}

export function useVideo(id: number) {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => getVideo(db, id),
    enabled: Number.isInteger(id) && id > 0,
    placeholderData: () => queryClient.getQueryData<InfiniteData<Awaited<ReturnType<typeof listVideos>>>>(videoKeys.list)
      ?.pages.flatMap((page) => page.videos).find((video) => video.id === id),
  });
}

export function useCreateVideo() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVideoInput) => createVideo(db, input),
    onSuccess: () => {
      refreshVideoQueriesInBackground(queryClient);
    },
  });
}

export function useDeleteVideo() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  const showToast = useToast();
  const deleteInFlight = useRef(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const { mutate: removeVideo, isPending: deleting } = useMutation({
    mutationFn: (video: Video) => deleteVideo(db, video.id),
    onSuccess: (deletedFiles) => {
      router.back();
      setVideoToDelete(null);
      showToast("Video deleted from your diary");
      refreshVideoQueriesInBackground(queryClient);
      if (deletedFiles) removeStoredFiles(deletedFiles);
    },
    onError: () => {
      showToast("Couldn’t delete video. Please try again", "error");
    },
    onSettled: () => { deleteInFlight.current = false; },
  });

  function confirmDelete(video: Video) {
    setVideoToDelete(video);
  }

  return {
    deleting,
    videoToDelete,
    confirmDelete,
    cancelDelete: () => setVideoToDelete(null),
    deleteConfirmed: () => {
      if (!videoToDelete || deleteInFlight.current) return;
      deleteInFlight.current = true;
      removeVideo(videoToDelete);
    },
  };
}
