export const videoKeys = {
  all: ["videos"] as const,
  detail: (id: number) => ["video", id] as const,
};
