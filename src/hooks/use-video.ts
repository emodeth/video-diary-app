import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { getVideo } from "@/db/videos.repository";
import { videoKeys } from "@/hooks/keys";
import type { Video } from "@/types/videos";

export function useVideo(id: number) {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => getVideo(db, id),
    enabled: Number.isInteger(id) && id > 0,
    placeholderData: () => queryClient.getQueryData<Video[]>(videoKeys.all)?.find((video) => video.id === id),
  });
}
