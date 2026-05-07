import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

export interface EditableRowProps {
  icon: LucideIcon
  label: string
  value?: string
  placeholder: string
  field: string
  isActive: boolean
  isLocked: boolean
  onEdit: (field: string) => void
  onSave: (field: string, value: string) => void
  onCancel: () => void
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
  onCancel
}: EditableRowProps) {
  const [localValue, setLocalValue] = React.useState(value || '')

  const handleSave = () => {
    onSave(field, localValue)
  }

  if (isActive) {
    return (
      <div className="flex flex-col gap-2 p-2 border rounded-md bg-muted/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Icon className="size-5" />
          <span className="font-medium">{label}</span>
        </div>
        <Input 
          value={localValue} 
          onChange={(e) => setLocalValue(e.target.value)} 
          placeholder={placeholder}
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>Hủy</Button>
          <Button size="sm" onClick={handleSave}>Lưu</Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`flex items-center gap-2 text-sm p-2 rounded-md transition-colors ${
        isLocked 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:bg-muted'
      }`}
      onClick={() => {
        if (!isLocked) {
          setLocalValue(value || '')
          onEdit(field)
        }
      }}
    >
      <Icon className="size-5 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold ml-1">{value || <span className="text-muted-foreground/60 font-normal">{placeholder}</span>}</span>
    </div>
  )
}
