import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import type { VideoSource } from "@/types/crop";

export async function pickVideo(): Promise<VideoSource | null> {
  // Android's system photo picker grants access to the chosen item itself.
  // iOS needs library permission to return the original video asset.
  if (Platform.OS === "ios") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) throw new Error("permission");
  }

  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["videos"] });
  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  const duration = (asset.duration ?? 0) / 1000;
  if (duration < 5) throw new Error("tooShort");

  return {
    id: asset.uri,
    duration,
    color: "#D5D1E9",
    title: asset.fileName || "Selected video",
    fileSize: asset.fileSize,
    width: asset.width,
    height: asset.height,
  };
}
