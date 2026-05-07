import {
  AngryIcon,
  FrownIcon,
  HeartIcon,
  LaughIcon,
  SmilePlusIcon,
  ThumbsUpIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const emojis = [
  { icon: ThumbsUpIcon, label: "Thích", color: "text-blue-500" },
  { icon: HeartIcon, label: "Yêu thích", color: "text-red-500" },
  { icon: LaughIcon, label: "Haha", color: "text-amber-500" },
  { icon: SmilePlusIcon, label: "Wow", color: "text-amber-500" },
  { icon: FrownIcon, label: "Buồn", color: "text-amber-500" },
  { icon: AngryIcon, label: "Phẫn nộ", color: "text-orange-600" },
]

export default function EmojiPicker({
  open,
  onSelect,
}: {
  open: boolean
  onSelect: (label: string) => void
}) {
  return (
    <div
      data-open={open}
      className={cn(
        "absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full bg-popover px-2 py-1.5 shadow-lg ring-1 ring-foreground/10 transition-all duration-150",
        open
          ? "scale-100 opacity-100 visible"
          : "scale-90 opacity-0 invisible pointer-events-none",
      )}
    >
      {emojis.map((emoji) => {
        const Icon = emoji.icon
        return (
          <button
            key={emoji.label}
            type="button"
            title={emoji.label}
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-transform hover:scale-125",
              emoji.color,
            )}
            onClick={() => onSelect(emoji.label)}
          >
            <Icon className="size-5 fill-current" />
          </button>
        )
      })}
    </div>
  )
}
