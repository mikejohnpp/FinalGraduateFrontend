import { useState } from "react";
import GroupCard from "./GroupCard";
import { useGroupsData, useGroupActions } from "@/hooks/useGroup";

export default function GroupDiscoverGrid() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const { suggestedGroups, loading } = useGroupsData();
  const { joinGroup } = useGroupActions();

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleGroups.map((group) => (
          <GroupCard 
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
        {visibleGroups.length === 0 && (
          <p className="col-span-full py-8 text-center text-muted-foreground">
            Không còn gợi ý nào.
          </p>
        )}
      </div>
    </div>
  );
}
