import type { Video } from "../types/videos";

// Sample entries until saved clips are connected to the library.
export const mockVideos: Video[] = [
  { id: "rooftop-sunset", title: "Rooftop sunset", description: "The whole skyline turned orange for about two minutes.", date: "Sep 30", duration: "0:05", thumbnailPlaceholder: require("../../assets/thumbnail-gradients/rooftop-sunset.png") },
  { id: "grandmas-kitchen", title: "Grandma’s kitchen", description: "Stirring the pot while she hums. Don’t forget to ask for her recipe.", date: "Sep 24", duration: "0:05", thumbnailPlaceholder: require("../../assets/thumbnail-gradients/grandmas-kitchen.png") },
  { id: "bosphorus-ferry-ride", title: "Bosphorus ferry ride", description: "Gulls following the ferry from Kadıköy to Eminönü. Wind was everywhere.", date: "Sep 18", duration: "0:05", thumbnailPlaceholder: require("../../assets/thumbnail-gradients/bosphorus-ferry-ride.png") },
  { id: "birthday-candles", title: "Birthday candles", description: "Everyone off-key, nobody cared.", date: "Sep 03", duration: "0:05", thumbnailPlaceholder: require("../../assets/thumbnail-gradients/birthday-candles.png") },
];
