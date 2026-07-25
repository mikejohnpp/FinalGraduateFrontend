import { useEffect, useRef, useCallback } from "react";
import CreatePostCard from "./CreatePostCard";
import PostCard from "@/components/PostCard";
import StoriesBar from "./story/StoriesBar";
import PostSkeleton from "./PostSkeleton";
import { useSuggestedFeed } from "@/hooks/usePost";
import { Loader2, Newspaper, UserPlus } from "lucide-react";

export default function NewsFeed() {
  const { posts, loading, hasMore, loadMore } = useSuggestedFeed();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore],
  );

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-4">
      <CreatePostCard />
      <StoriesBar />

      {loading && posts.length === 0 ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.id}>
                {/* @ts-ignore */}
                <PostCard post={post} />
              </div>
            );
          } else {
            return (
              /* @ts-ignore */
              <PostCard key={post.id} post={post} />
            );
          }
        })
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Newspaper className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">Bảng tin của bạn đang trống</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Hãy kết bạn hoặc theo dõi thêm người dùng để xem các bài viết mới nhất ở đây.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <UserPlus className="h-4 w-4" />
            Tìm bạn bè để kết nối
          </div>
        </div>
      )}

      {/* Loading More State */}
      {loading && posts.length > 0 && (
        <div className="flex w-full justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Đang tải thêm...</span>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="mt-4 border-t py-6 text-center text-sm text-muted-foreground">
          Bạn đã xem hết bài viết.
        </div>
      )}
    </div>
  );
}
