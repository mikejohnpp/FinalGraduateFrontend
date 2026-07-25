import { useGroupFeed } from "@/hooks/useGroup";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function GroupsFeed() {
  const { feed, loading, loadMore } = useGroupFeed();

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h3 className="text-[17px] font-bold text-foreground">Hoạt động mới đây</h3>

      {feed.items.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {loading && (
        <div className="space-y-4 pt-4">
          <Skeleton className="h-[200px] w-full rounded-xl bg-muted/50" />
          <Skeleton className="h-[300px] w-full rounded-xl bg-muted/50" />
        </div>
      )}

      {!loading && feed.hasMore && (
        <Button variant="outline" className="mt-4 w-full" onClick={loadMore}>
          Tải thêm bài viết
        </Button>
      )}

      {!loading && !feed.hasMore && feed.items.length > 0 && (
        <p className="pt-4 text-center text-muted-foreground">Bạn đã xem hết bài viết.</p>
      )}

      {!loading && feed.items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">Chưa có bài viết nào</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Hãy tham gia thêm nhóm để xem các bài viết mới nhất từ cộng đồng của bạn ở đây.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
