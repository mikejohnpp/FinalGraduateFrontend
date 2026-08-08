import type { IPost } from "@/types/interfaces/post/IPost";
import PostCardProfile2 from "@/components/PostCardProfile2";

interface ProfilePostFeedProps {
  posts: IPost[];
  loading?: boolean;
}

export default function ProfilePostFeed({ posts, loading }: ProfilePostFeedProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-8 text-muted-foreground">
        <p className="text-lg font-semibold">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-8 text-muted-foreground">
        <p className="text-lg font-semibold">Không có bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostCardProfile2 key={post.id} post={post} />
      ))}
    </div>
  );
}
