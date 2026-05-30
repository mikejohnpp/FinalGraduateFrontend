import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePen } from "lucide-react";
import SearchBar from "./SearchBar";
import ConversationTabs from "./ConversationTabs";
import ConversationItem from "./ConversationItem";
import type { Conversation, TabFilter } from "@/types/messenger";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const filtered = conversations.filter((conv) => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "unread") return (conv.unreadCount ?? 0) > 0;
    if (activeTab === "groups") return conv.isGroup;
    return true;
  });

  return (
    <div className="flex h-full w-[320px] flex-shrink-0 flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Đoạn chat</h1>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <MoreHorizontal data-icon />
          </Button>
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <SquarePen data-icon />
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Tabs */}
      <ConversationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conversation List */}
      <ScrollArea className="flex-1 px-1">
        <div className="flex flex-col gap-0.5">
          {filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">Không tìm thấy đoạn chat</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
