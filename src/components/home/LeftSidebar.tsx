import { Users, UsersRound, Video, Bookmark, Calendar, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { currentUser, shortcuts } from "@/data/mock/home"

const iconMap: Record<string, React.ElementType> = {
  Users,
  UsersRound,
  Video,
  Bookmark,
  Calendar,
  Clock,
}

export default function LeftSidebar() {
  const navigate = useNavigate()

  return (
    <aside className="hidden xl:flex w-[280px] shrink-0 flex-col gap-2 overflow-y-auto py-4 pl-4 pr-2">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        onClick={() => navigate("/")}
      >
        <Avatar size="lg">
          <AvatarImage src={currentUser.avatarUrl} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="truncate">{currentUser.name}</span>
      </button>

      <Separator className="my-1" />

      <div className="flex flex-col gap-1">
        <span className="px-3 text-xs font-semibold text-muted-foreground">
          Lối tắt
        </span>
        {shortcuts.map((s) => {
          const Icon = iconMap[s.icon]
          return (
            <button
              key={s.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {Icon && <Icon className="size-4" />}
              </span>
              <span className="truncate">{s.label}</span>
            </button>
          )
        })}
      </div>

      <Separator className="my-1" />

      <div className="flex flex-wrap gap-x-2 gap-y-1 px-3 text-xs text-muted-foreground">
        <span>Quyền riêng tư</span>
        <span>·</span>
        <span>Điều khoản</span>
        <span>·</span>
        <span>Quảng cáo</span>
        <span>·</span>
        <span>Cookie</span>
        <span>·</span>
        <span>Xem thêm</span>
      </div>
    </aside>
  )
}
