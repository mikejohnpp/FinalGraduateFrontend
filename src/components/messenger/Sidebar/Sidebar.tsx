import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePen, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchBar from "./SearchBar";
import ConversationItem from "./ConversationItem";
import type { Conversation } from "../interface/Conversation";
import CreateGroupDialog from "./CreateGroupDialog";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: any;
  onSelectConversation: (id: any) => void;
  userId: number;
  onConversationCreated?: () => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  userId,
  onConversationCreated,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // conversations filter by isGroup (API returns isGroup, UI might use group)
  const privateConversations = conversations.filter(c => !c.group && (c as any).isGroup !== true);
  const groupConversations = conversations.filter(c => c.group || (c as any).isGroup === true);

  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Đoạn chat</h1>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-9 rounded-full" onClick={() => setIsCreateGroupOpen(true)} title="Tạo nhóm mới">
            <Users data-icon />
          </Button>
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

      <Tabs defaultValue="private" className="flex-1 flex flex-col mt-2 h-0">
        <div className="px-4 mb-2 shrink-0">
          <TabsList className="w-full">
            <TabsTrigger value="private" className="flex-1">Cá nhân</TabsTrigger>
            <TabsTrigger value="group" className="flex-1">Nhóm</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="private" className="flex-1 m-0 flex flex-col min-h-0 data-[state=inactive]:hidden">
          <ScrollArea className="flex-1 px-1 h-full">
            <div className="flex flex-col gap-0.5">
              {privateConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId || false}
                  onClick={() => onSelectConversation(conv.id)}
                  userId={userId}
                />
              ))}
              {privateConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">Không tìm thấy đoạn chat cá nhân</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="group" className="flex-1 m-0 flex flex-col min-h-0 data-[state=inactive]:hidden">
          <ScrollArea className="flex-1 px-1 h-full">
            <div className="flex flex-col gap-0.5">
              {groupConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId || false}
                  onClick={() => onSelectConversation(conv.id)}
                  userId={userId}
                />
              ))}
              {groupConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">Không tìm thấy nhóm</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <CreateGroupDialog 
        isOpen={isCreateGroupOpen} 
        onClose={() => setIsCreateGroupOpen(false)} 
        userId={userId}
        onSuccess={onConversationCreated}
      />
    </div>
  );
}
