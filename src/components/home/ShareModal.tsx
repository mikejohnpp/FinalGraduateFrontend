import { GlobeIcon, MessageCircleIcon, SendHorizonalIcon, UsersIcon } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/data/mock/home";

export default function ShareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogTitle>Chia sẻ</DialogTitle>

        <div className="flex items-center gap-3 rounded-lg bg-muted p-2">
          <Avatar>
            <AvatarImage src={currentUser.avatarUrl} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{currentUser.name}</span>
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <GlobeIcon className="size-4" />
            </span>
            <span>Chia sẻ lên trang cá nhân (Công khai)</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
              <UsersIcon className="size-4" />
            </span>
            <span>Chia sẻ với bạn bè</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-white">
              <MessageCircleIcon className="size-4" />
            </span>
            <span>Gửi qua tin nhắn</span>
          </button>
        </div>

        <Separator />

        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-muted">
            <SendHorizonalIcon className="size-4" />
          </span>
          <span>Chia sẻ qua liên kết</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
