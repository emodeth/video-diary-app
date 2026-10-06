import { z } from "zod";
import { DESCRIPTION_MAX, NAME_MAX } from "@/constants";

export const videoMetadataSchema = z.object({
  name: z.string().trim().min(1, "Enter a name for this video")
    .max(NAME_MAX, `Name must be ${NAME_MAX} characters or fewer`),
  description: z.string().trim()
    .max(DESCRIPTION_MAX, `Description must be ${DESCRIPTION_MAX} characters or fewer`),
});

export type VideoMetadata = z.infer<typeof videoMetadataSchema>;
