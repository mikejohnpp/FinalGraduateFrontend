import GroupDiscoverSection from "@/components/groups/GroupDiscoverSection";
import GroupDiscoverGrid from "@/components/groups/GroupDiscoverGrid";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GroupsDiscover() {
  return (
    <div className="mx-auto max-w-300 space-y-8 p-4 md:p-6">
      <GroupDiscoverSection />

      <GroupDiscoverGrid />
    </div>
  );
}
