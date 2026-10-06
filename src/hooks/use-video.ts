import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { getVideo } from "@/db/videos.repository";
import { videoKeys } from "@/hooks/keys";

export function useVideo(id: number) {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => getVideo(db, id),
    enabled: Number.isInteger(id) && id > 0,
  });
}
