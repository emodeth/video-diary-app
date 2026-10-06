import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { listVideos } from "@/db/videos.repository";
import { videoKeys } from "@/hooks/keys";

export function useVideos() {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: videoKeys.all,
    queryFn: () => listVideos(db),
  });
}
