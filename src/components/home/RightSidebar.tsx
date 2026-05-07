import { GiftIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { contacts } from "@/data/mock/home"
import ContactItem from "./ContactItem"

export default function RightSidebar() {
  return (
    <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-2 overflow-y-auto py-4 pr-4 pl-2">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-muted">
          <GiftIcon className="size-4 text-muted-foreground" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Sinh nhật</span>
          <span className="text-xs text-muted-foreground">
            Hôm nay: Lam Phong và 2 người khác
          </span>
        </div>
      </div>

      <Separator className="my-1" />

      <div className="flex flex-col gap-1 px-2">
        <span className="text-xs font-semibold text-muted-foreground">
          Liên hệ
        </span>
        {contacts.map((c) => (
          <ContactItem key={c.id} contact={c} />
        ))}
      </div>
    </aside>
  )
}
