import { groupPosts } from "@/data/mock/groupPostsMock";
import GroupPostCard from "@/components/groups/GroupPostCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function GroupsFeed() {
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      <h3 className="text-[17px] font-bold text-foreground">Hoạt động mới đây</h3>
      
      {groupPosts.map((post) => (
        <GroupPostCard key={post.id} post={post} />
      ))}
      
      {/* Loading state simulation at the bottom */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-[200px] w-full rounded-xl bg-muted/50" />
        <Skeleton className="h-[300px] w-full rounded-xl bg-muted/50" />
      </div>
    </div>
  );
}
