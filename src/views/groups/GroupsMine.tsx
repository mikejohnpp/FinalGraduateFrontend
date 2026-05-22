import GroupMineGrid from "@/components/groups/GroupMineGrid";
import { joinedGroups } from "@/data/mock/groupsMock";

export default function GroupsMine() {
  return (
    <div className="w-full">
      <GroupMineGrid groups={joinedGroups} />
    </div>
  );
}
