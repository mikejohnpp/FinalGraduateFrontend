import GroupCard from "./GroupCard";
import { suggestedGroups } from "@/data/mock/groupsMock";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PATH_CONSTRAINT } from "@/plugins/routers";

export default function GroupDiscoverSection() {
  const navigate = useNavigate();
  // Lấy 6 nhóm đầu tiên cho phần cuộn ngang
  const topSuggested = suggestedGroups.slice(0, 6);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Gợi ý cho bạn</h3>
          <p className="text-sm text-muted-foreground">Nhóm bạn có thể quan tâm.</p>
        </div>
        <Button variant="link" onClick={() => navigate(PATH_CONSTRAINT.GROUPS_DISCOVER)}>
          Xem tất cả
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
        {topSuggested.map(group => (
          <GroupCard 
            key={group.id} 
            group={group} 
            className="w-[240px] shrink-0 snap-start" 
          />
        ))}
      </div>
    </div>
  );
}
