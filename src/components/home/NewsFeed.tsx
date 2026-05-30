import { useEffect, useRef, useCallback } from "react"
import CreatePostCard from "./CreatePostCard"
import PostCard from "@/components/PostCard"
import StoriesBar from "./StoriesBar"
import PostSkeleton from "./PostSkeleton"
import { useSuggestedFeed } from "@/hooks/usePost"
import { Loader2 } from "lucide-react"

export default function NewsFeed() {
  const { posts, loading, hasMore, loadMore } = useSuggestedFeed()
  const observer = useRef<IntersectionObserver | null>(null)
  
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore()
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading, hasMore, loadMore])

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 py-4 px-4">
      <CreatePostCard />
      <StoriesBar />
      
      {/* Initial Loading State */}
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
            )
          } else {
            return (
              /* @ts-ignore */
              <PostCard key={post.id} post={post} />
            )
          }
        })
      )}

      {/* Loading More State */}
      {loading && posts.length > 0 && (
        <div className="flex w-full justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Đang tải thêm...</span>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground border-t mt-4">
          Bạn đã xem hết bài viết.
        </div>
      )}
    </div>
  )
}
