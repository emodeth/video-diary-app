import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import type { VideoSource } from "@/types/crop";

export type PickResult =
  | { kind: "picked"; source: VideoSource }
  | { kind: "cancelled" }
  | { kind: "denied" }
  | { kind: "tooShort" };

function readPickerResult(result: ImagePicker.ImagePickerResult): PickResult {
  if (result.canceled || !result.assets[0]) return { kind: "cancelled" };
  const asset = result.assets[0];
  const duration = (asset.duration ?? 0) / 1000;
  if (duration < 5) return { kind: "tooShort" };

  return { kind: "picked", source: {
    id: asset.uri,
    duration,
    color: "#D5D1E9",
    title: asset.fileName || "Selected video",
    fileSize: asset.fileSize,
    width: asset.width,
    height: asset.height,
  } };
}

export async function recoverPendingVideo(): Promise<PickResult | null> {
  if (Platform.OS !== "android") return null;
  const result = await ImagePicker.getPendingResultAsync();
  return result && "canceled" in result ? readPickerResult(result) : null;
}

export async function pickVideo(): Promise<PickResult> {
  // Android's system photo picker grants access to the chosen item itself.
  // iOS needs library permission to return the original video asset.
  if (Platform.OS === "ios") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return { kind: "denied" };
  }

  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["videos"] });
  return readPickerResult(result);
}
