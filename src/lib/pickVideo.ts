import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import type { VideoSource } from "@/types/crop";

export type PickResult =
  | { kind: "picked"; source: VideoSource }
  | { kind: "cancelled" }
  | { kind: "denied" }
  | { kind: "tooShort" };

let pickerLaunching = false;
// getPendingResultAsync consumes the native result, so keep it across layout remounts.
let pendingRecovery: Promise<PickResult | null> | null = null;
let unclaimedRecovery: PickResult | null = null;

const RECOVERY_RETRIES = 25;
const RECOVERY_RETRY_MS = 200;

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
  if (unclaimedRecovery) return unclaimedRecovery;
  if (pickerLaunching) return null;
  if (!pendingRecovery) {
    pendingRecovery = (async () => {
      for (let attempt = 0; attempt < RECOVERY_RETRIES && !pickerLaunching; attempt++) {
        const result = await ImagePicker.getPendingResultAsync();
        if (result) {
          if (!("canceled" in result)) throw new Error(result.message);
          unclaimedRecovery = readPickerResult(result);
          return unclaimedRecovery;
        }
        await new Promise<void>((resolve) => setTimeout(resolve, RECOVERY_RETRY_MS));
      }
      return null;
    })().finally(() => { pendingRecovery = null; });
  }
  return pendingRecovery;
}

export function acknowledgeRecoveredVideo() {
  unclaimedRecovery = null;
}

export async function pickVideo(): Promise<PickResult> {
  pickerLaunching = true;
  try {
    // Android's system photo picker grants access to the chosen item itself.
    // iOS needs library permission to return the original video asset.
    if (Platform.OS === "ios") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return { kind: "denied" };
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["videos"] });
    return readPickerResult(result);
  } finally {
    pickerLaunching = false;
  }
}
