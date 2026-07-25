import { useState } from "react";
import GroupCard from "./GroupCard";
import { useGroupsData, useGroupActions } from "@/hooks/useGroup";
import { useIsMobile } from "@/hooks/use-mobile";
import { Compass } from "lucide-react";

export default function GroupDiscoverGrid() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const { suggestedGroups, loading } = useGroupsData();
  const { joinGroup } = useGroupActions();
  const isMobile = useIsMobile();

  const handleDismiss = (id: number) => {
    setDismissed((prev) => [...prev, id]);
  };

  const visibleGroups = suggestedGroups.filter((g) => !dismissed.includes(g.id));

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Đang tải gợi ý...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-foreground">Gợi ý khác</h3>

      {visibleGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Compass className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">Không còn gợi ý nào</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Bạn đã xem qua tất cả các nhóm được gợi ý. Hãy quay lại sau để xem thêm.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleGroups.map((group) => (
            <GroupCard
              className={isMobile ? "w-100" : ""}
              key={group.id}
              group={group}
              onDismiss={() => handleDismiss(group.id)}
              onJoin={async () => {
                const success = await joinGroup(group);
                if (success) {
                  handleDismiss(group.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
