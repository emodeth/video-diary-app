import { Pressable, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

type DeleteVideoDialogProps = {
  title: string;
  deleting: boolean;
  onCancel: () => void;
  onDelete: () => void;
};

export function DeleteVideoDialog({ title, deleting, onCancel, onDelete }: DeleteVideoDialogProps) {
  return (
    <View className="absolute inset-0 items-center justify-center px-6">
      <Pressable className="absolute inset-0 bg-ink/40" onPress={onCancel}
        disabled={deleting} accessibilityLabel="Cancel delete" />
      <View className="w-full max-w-[420px] rounded-[24px] bg-surface p-6 shadow-lg">
        <Text className="font-sans-bold text-heading text-ink">Delete video?</Text>
        <Text className="mt-2 font-sans text-body text-muted">
          “{title}” will be permanently deleted.
        </Text>
        <View className="mt-7 flex-row gap-3">
          <View className="flex-1">
            <Button label="Cancel" variant="outline" size="dialog" fullWidth
              disabled={deleting} onPress={onCancel} />
          </View>
          <View className="flex-1">
            <Button label={deleting ? "Deleting…" : "Delete"} variant="delete"
              size="dialog" fullWidth disabled={deleting} onPress={onDelete} />
          </View>
        </View>
      </View>
    </View>
  );
}
