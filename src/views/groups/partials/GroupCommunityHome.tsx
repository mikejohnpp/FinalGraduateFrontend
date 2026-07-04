import { useParams } from "react-router-dom";
import { useGroupInfo } from "@/hooks/useGroupAdmin";
import CreatePostCard from "@/components/home/CreatePostCard";
import PostCard from "@/components/PostCard";
import type { IPost } from "@/types/interfaces/post/IPost";

const mockFeedPosts: IPost[] = [
  {
    id: 1001,
    author: {
      id: 1,
      name: "Nguyễn Văn An",
      avatar: null,
      nickName: null,
    },
    isGroupPosted: true,
    createdAt: "2025-06-15T06:20:00.000Z",
    commentCount: 5,
    content:
      "Chào cả nhóm! Mình vừa tìm được một bài viết rất hay về game localization, chia sẻ để mọi người cùng đọc nhé.",
    likeCount: 42,
    hasLiked: true,
    authorRole: "Quản trị viên",
    media: [],
    group: {
      id: 1,
      name: "Nhóm test",
      avatar: null,
    },
    sentiment: "POSITIVE",
    confidence: 0.85,
    cancelReason: null,
  },
  {
    id: 1002,
    author: {
      id: 2,
      name: "Trần Thị Bích",
      avatar: null,
      nickName: null,
    },
    isGroupPosted: true,
    createdAt: "2025-06-15T09:05:00.000Z",
    commentCount: 12,
    content:
      "Hỏi mọi người một chút: có ai biết tool nào để quản lý bản dịch game hiệu quả không? Mình đang tìm cái gì đó có thể handle được context và glossary cùng lúc.",
    likeCount: 15,
    hasLiked: false,
    media: [],
    group: {
      id: 1,
      name: "Nhóm test",
      avatar: null,
    },
    sentiment: "NEUTRAL",
    confidence: 0.6,
    cancelReason: null,
  },
];

export default function GroupCommunityHome() {
  const { groupId } = useParams<{ groupId: string }>();
  const { group, loading } = useGroupInfo(groupId || "");

  if (loading || !group) return null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 xl:flex-row">
      {/* Cột trái (Main content) */}
      <div className="flex max-w-3xl flex-1 flex-col gap-4">
        {/* Post Composer Card */}
        <CreatePostCard groupId={Number(groupId)} />

        {/* Post Feed */}
        <div className="space-y-4">
          {mockFeedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
