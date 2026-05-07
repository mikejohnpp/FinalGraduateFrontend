import type { Post } from '@/types/Post'
import PostCard from '@/components/profile/PostCard'

interface ProfilePostFeedProps {
  posts: Post[]
}

export default function ProfilePostFeed({ posts }: ProfilePostFeedProps) {
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
