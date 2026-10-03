import * as ImagePicker from "expo-image-picker";
import type { ClipSource } from "@/types/crop";

export async function pickVideo(): Promise<ClipSource | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error("permission");

  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["videos"] });
  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  if ((asset.duration ?? 0) < 5) throw new Error("tooShort");

  return {
    id: asset.uri,
    duration: asset.duration ?? 5,
    color: "#D5D1E9",
    title: asset.fileName || "Selected video",
  };
}
