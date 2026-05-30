import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TabFilter } from "@/types/messenger";

interface ConversationTabsProps {
  activeTab: TabFilter;
  onTabChange: (tab: TabFilter) => void;
}

export default function ConversationTabs({ activeTab, onTabChange }: ConversationTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as TabFilter)}
      className="px-3 pb-2"
    >
      <TabsList className="w-full justify-start gap-1 bg-transparent">
        <TabsTrigger
          value="all"
          className="rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
        >
          Hộp thư
        </TabsTrigger>
        <TabsTrigger
          value="unread"
          className="rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
        >
          Chưa đọc
        </TabsTrigger>
        <TabsTrigger
          value="groups"
          className="rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
        >
          Nhóm
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
