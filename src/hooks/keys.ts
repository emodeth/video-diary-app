export const videoKeys = {
  all: ["videos"] as const,
  list: ["videos", "list"] as const,
  stats: ["videos", "stats"] as const,
  detail: (id: number) => ["video", id] as const,
};
