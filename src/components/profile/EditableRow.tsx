import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export interface EditableRowProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  placeholder: string;
  field: string;
  isActive: boolean;
  isLocked: boolean;
  onEdit: (field: string) => void;
  onSave: (field: string, value: string) => void;
  onCancel: () => void;
}

export default function EditableRow({
  icon: Icon,
  label,
  value,
  placeholder,
  field,
  isActive,
  isLocked,
  onEdit,
  onSave,
  onCancel,
}: EditableRowProps) {
  const [localValue, setLocalValue] = React.useState(value ?? "");
  const [wasActive, setWasActive] = React.useState(isActive);

  // Reset localValue từ value mỗi khi row chuyển sang chế độ chỉnh sửa.
  // Đây là pattern "điều chỉnh state khi render" của React, tránh lệch
  // giá trị do timing/stale state mà không cần useEffect.
  if (isActive !== wasActive) {
    setWasActive(isActive);
    if (isActive) {
      setLocalValue(value ?? "");
    }
  }

  const handleSave = () => {
    onSave(field, localValue);
  };

  if (isActive) {
    return (
      <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-2">
        <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-5" />
          <span className="font-medium">{label}</span>
        </div>
        <Input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Hủy
          </Button>
          <Button size="sm" onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-md p-2 text-sm transition-colors ${
        isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted"
      }`}
      onClick={() => {
        if (!isLocked) {
          setLocalValue(value || "");
          onEdit(field);
        }
      }}
    >
      <Icon className="size-5 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-1 font-semibold">
        {value || <span className="font-normal text-muted-foreground/60">{placeholder}</span>}
      </span>
    </div>
  );
}
