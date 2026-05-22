import { useState } from "react";
import GroupCard from "./GroupCard";
import { suggestedGroups } from "@/data/mock/groupsMock";

export default function GroupDiscoverGrid() {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissed(prev => [...prev, id]);
  };

  const visibleGroups = suggestedGroups.filter(g => !dismissed.includes(g.id));

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-foreground">Gợi ý khác</h3>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleGroups.map(group => (
          <GroupCard 
            key={group.id} 
            group={group} 
            onDismiss={() => handleDismiss(group.id)} 
          />
        ))}
        {visibleGroups.length === 0 && (
          <p className="text-muted-foreground col-span-full py-8 text-center">Không còn gợi ý nào.</p>
        )}
      </div>
    </div>
  );
}
