import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { createVideo, type CreateVideoInput } from "@/lib/video-service";
import { videoKeys } from "@/hooks/keys";

export function useCreateVideo() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVideoInput) => createVideo(db, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: videoKeys.all }),
  });
}
