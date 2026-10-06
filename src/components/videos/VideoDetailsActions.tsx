import { Pencil, Trash2 } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import colors from "@/theme/colors.json";

type Props = {
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function VideoDetailsActions({ disabled, onEdit, onDelete }: Props) {
  return (
    <View className="px-6 pb-2 pt-4">
      <Button
        label="Edit details"
        variant="outline"
        fullWidth
        disabled={disabled}
        onPress={onEdit}
        icon={<Pencil size={17} color={colors.ink} strokeWidth={2} />}
      />
      <Button
        label="Delete video"
        variant="delete"
        fullWidth
        disabled={disabled}
        onPress={onDelete}
        className="mt-2"
        icon={<Trash2 size={17} color={colors.onBrand} strokeWidth={2} />}
      />
    </View>
  );
}

export function VideoDetailsActionsSkeleton() {
  return (
    <View accessibilityLabel="Loading video actions" className="px-6 pb-2 pt-4">
      <View className="h-[52px] rounded-[16px] bg-line" />
      <View className="mt-2 h-[52px] rounded-[16px] bg-line" />
    </View>
  );
}
