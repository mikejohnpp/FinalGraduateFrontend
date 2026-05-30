import * as React from "react";
import {
  Bell,
  BellOff,
  Edit,
  Maximize2,
  MessageCircle,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Conversation {
  id: number;
  name: string;
  preview: string;
  time: string;
  online?: boolean;
  unread?: boolean;
  muted?: boolean;
  group?: boolean;
  avatar: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "Quynh Ta",
    preview: "Cuộc gọi video đã kết thúc.",
    time: "2 ngày",
    online: true,
    unread: true,
    avatar: "QT",
  },
  {
    id: 2,
    name: "Hermit Jason",
    preview: "Tin nhắn và cuộc gọi được bảo mật...",
    time: "2 tuần",
    muted: true,
    avatar: "HJ",
  },
  {
    id: 3,
    name: "Trần Nguyễn Thu Ngân",
    preview: "Tin nhắn và cuộc gọi được bảo mật...",
    time: "4 tuần",
    avatar: "TN",
  },
  {
    id: 4,
    name: "IT_K48",
    preview: "Phuc Tran Trong đã rời khỏi nhóm...",
    time: "7 tuần",
    muted: true,
    group: true,
    avatar: "IT",
  },
  {
    id: 5,
    name: "Khánh Nguyễn",
    preview: "Tin nhắn và cuộc gọi được bảo mật...",
    time: "7 tuần",
    avatar: "KN",
  },
  {
    id: 6,
    name: "Lâm Gia Bảo",
    preview: "Tin nhắn và cuộc gọi được bảo mật...",
    time: "7 tuần",
    avatar: "LB",
  },
  {
    id: 7,
    name: "Vicente Ngô Nghĩa",
    preview: "Tin nhắn và cuộc gọi được bảo mật...",
    time: "7 tuần",
    avatar: "VN",
  },
  {
    id: 8,
    name: "Najung Translation dệ Tứ",
    preview: "Chào Hoàng Phúc! Chúng tôi c...",
    time: "10 tuần",
    avatar: "NJ",
  },
  {
    id: 9,
    name: "Đức Trọng",
    preview: "Tin nhắn và cuộc gọi được bảo mật...",
    time: "10 tuần",
    avatar: "ĐT",
  },
];

interface ConversationItemProps {
  conversation: Conversation;
  onClick?: (conversation: Conversation) => void;
}

function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  const { name, preview, time, online, unread, muted, avatar } = conversation;

  return (
    <button
      onClick={() => onClick?.(conversation)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left",
        "transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        unread && "font-medium",
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-11 w-11">
          <AvatarFallback className="text-xs font-semibold">{avatar}</AvatarFallback>
        </Avatar>
        {online && (
          <span className="absolute right-0 bottom-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm",
            unread ? "font-semibold text-foreground" : "font-medium text-foreground",
          )}
        >
          {name}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className={cn("truncate", unread && !muted && "font-medium text-foreground")}>
            {preview}
          </span>
          <span className="flex-shrink-0">· {time}</span>
        </div>
      </div>

      {/* Trailing indicators */}
      <div className="flex flex-shrink-0 items-center gap-1">
        {muted && <BellOff className="h-3.5 w-3.5 text-muted-foreground" />}
        {unread && !muted && <span className="h-2 w-2 rounded-full bg-foreground" />}
      </div>
    </button>
  );
}

interface MessengerPopoverProps {
  unreadCount?: number;
  onViewAll?: () => void;
  onConversationClick?: (conversation: Conversation) => void;
}

export function MessagesInnerPopover({
  unreadCount = 1,
  onConversationClick,
}: MessengerPopoverProps) {
  const [search, setSearch] = React.useState("");
  const [tab, setTab] = React.useState("all");

  const filtered = React.useMemo(() => {
    return CONVERSATIONS.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (tab === "unread" && !c.unread) return false;
      if (tab === "groups" && !c.group) return false;
      return true;
    });
  }, [search, tab]);

  return (
    <div>
      <div className="px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Đoạn chat</h2>
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Tuỳ chọn">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Mở rộng">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Tin nhắn mới">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm trên Messenger"
            className="h-9 pl-8 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mb-1">
          <TabsList className="h-8 w-auto gap-0.5 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="h-7 rounded-md px-3 text-xs data-[state=active]:bg-secondary data-[state=active]:shadow-none"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="h-7 rounded-md px-3 text-xs data-[state=active]:bg-secondary data-[state=active]:shadow-none"
            >
              Chưa đọc
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="h-7 rounded-md px-3 text-xs data-[state=active]:bg-secondary data-[state=active]:shadow-none"
            >
              Nhóm
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mx-4 mb-2 flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">
        <Bell className="h-3.5 w-3.5 flex-shrink-0" />
        <span>
          Thiếu lịch sử chat.{" "}
          <button className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
            Khôi phục ngay
          </button>
        </span>
      </div>

      <Separator />

      <ScrollArea className="h-[340px]">
        <div className="p-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <MessageCircle className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Không tìm thấy cuộc trò chuyện</p>
            </div>
          ) : (
            filtered.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} onClick={onConversationClick} />
            ))
          )}
        </div>
      </ScrollArea>

      <Separator />

      <div className="flex items-center justify-center p-2">
        <Button variant="ghost" size="sm" className="text-xs font-medium" onClick={() => {}}>
          Xem tất cả trong Messenger
        </Button>
      </div>
    </div>
  );
}

export default MessagesInnerPopover;
