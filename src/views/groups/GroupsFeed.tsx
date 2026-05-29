import { useGroupFeed } from "@/hooks/useGroup";
import GroupPostCard from "@/components/groups/GroupPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function GroupsFeed() {
  const { feed, loading, loadMore } = useGroupFeed();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      <h3 className="text-[17px] font-bold text-foreground">Hoạt động mới đây</h3>
      
      {feed.items.map((post) => (
        <GroupPostCard 
          key={post.id} 
          post={{
            ...post, 
            groupName: post.group?.name, 
            groupId: post.group?.id ? post.group.id.toString() : undefined
          } as any} 
        />
      ))}
      
      {loading && (
        <div className="space-y-4 pt-4">
          <Skeleton className="h-[200px] w-full rounded-xl bg-muted/50" />
          <Skeleton className="h-[300px] w-full rounded-xl bg-muted/50" />
        </div>
      )}

      {!loading && feed.hasMore && (
        <Button variant="outline" className="w-full mt-4" onClick={loadMore}>
          Tải thêm bài viết
        </Button>
      )}
      
      {!loading && !feed.hasMore && feed.items.length > 0 && (
        <p className="text-center text-muted-foreground pt-4">Bạn đã xem hết bài viết.</p>
      )}

      {!loading && feed.items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Chưa có bài viết nào từ các nhóm của bạn.</p>
        </div>
      )}
    </div>
  );
}
