import GroupMineGrid from "@/components/groups/GroupMineGrid";
import { useGroupsData } from "@/hooks/useGroup";

export default function GroupsMine() {
  const { joinedGroups, loading } = useGroupsData();

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Đang tải danh sách nhóm...</div>;
  }

  return (
    <div className="w-full">
      <GroupMineGrid groups={joinedGroups} />
    </div>
  );
}
