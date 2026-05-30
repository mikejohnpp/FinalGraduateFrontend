import type { IPost } from '@/types/interfaces/post/IPost'
import PostCard from '@/components/PostCard'

interface ProfilePostFeedProps {
  posts: IPost[]
  loading?: boolean
}

export default function ProfilePostFeed({ posts, loading }: ProfilePostFeedProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground bg-card rounded-xl border">
        <p className="font-semibold text-lg">Đang tải bài viết...</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground bg-card rounded-xl border">
        <p className="font-semibold text-lg">Không có bài viết nào</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
