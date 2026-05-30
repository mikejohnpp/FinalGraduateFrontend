import GroupDiscoverSection from "@/components/groups/GroupDiscoverSection";
import GroupDiscoverGrid from "@/components/groups/GroupDiscoverGrid";

export default function GroupsDiscover() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-8 p-4 md:p-6">
      <GroupDiscoverSection />
      <GroupDiscoverGrid />
    </div>
  );
}
