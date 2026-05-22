import GroupDiscoverSection from "@/components/groups/GroupDiscoverSection";
import GroupDiscoverGrid from "@/components/groups/GroupDiscoverGrid";

export default function GroupsDiscover() {
  return (
    <div className="p-4 md:p-6 space-y-8 max-w-[1200px] mx-auto">
      <GroupDiscoverSection />
      <GroupDiscoverGrid />
    </div>
  );
}
