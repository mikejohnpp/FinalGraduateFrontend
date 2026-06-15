import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
  ThumbsUpIcon,
  MoreHorizontal,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { IPost } from "@/types/interfaces/post/IPost";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { useLikePost } from "@/hooks/usePost";
import CommentModal from "./home/CommentModal";
import ShareModal from "./home/ShareModal";
import PostSentimentIndicator from "./home/PostSentimentIndicator";

export default function PostCard({ post }: { post: IPost }) {
  const liked = post.hasLiked ?? false;
  const likesCount = post.likeCount;
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { userId } = useSelector((state: RootState) => state.user);
  const { like, unlike, loadingId } = useLikePost();
  const navigate = useNavigate();

  const handleLikeClick = async () => {
    if (!userId || loadingId === post.id) return;
    if (liked) {
      await unlike(post.id, userId);
    } else {
      await like(post.id, userId);
    }
  };

  const groupName = post.group?.name;
  const groupId = post.group?.id;
  const authorName = post.author?.name || "Người dùng";
  const authorId = post.author?.id;
  const authorAvatar =
    post.author?.avatar || `https://i.pravatar.cc/100?u=${authorId || "fallback"}`;

  const handleNavigateToProfile = () => {
    if (authorId) navigate(`/profile/${authorId}`);
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-start justify-between px-4 pt-4 pb-2">
          <div className="flex gap-2">
            {post.group ? (
              <Avatar className="relative size-10 overflow-visible border">
                <AvatarImage
                  src={post.group.avatar || `https://picsum.photos/seed/${groupId}/100/100`}
                />
                <AvatarFallback>{groupName?.charAt(0) || "G"}</AvatarFallback>
                <Avatar
                  className="absolute -right-1 -bottom-1 size-5 cursor-pointer border-2 border-background"
                  onClick={handleNavigateToProfile}
                >
                  <AvatarImage src={authorAvatar} />
                  <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Avatar>
            ) : (
              <Avatar className="size-10 cursor-pointer" onClick={handleNavigateToProfile}>
                <AvatarImage src={authorAvatar} />
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-1">
                {post.group ? (
                  <p className="font-semibold">{groupName}</p>
                ) : (
                  <p
                    className="cursor-pointer font-semibold hover:underline"
                    onClick={handleNavigateToProfile}
                  >
                    {authorName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {post.group && (
                  <>
                    <span className="font-medium text-foreground">{authorName}</span>
                    {post.authorRole && (
                      <>
                        <span>·</span>
                        <span>{post.authorRole}</span>
                      </>
                    )}
                    <span>·</span>
                  </>
                )}
                <span>{new Date(post.createdAt).toLocaleString("vi-VN")}</span>
                <span>·</span>
                <PostSentimentIndicator post={post} />
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                  <MoreHorizontal data-icon="inline" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Lưu bài viết</DropdownMenuItem>
              <DropdownMenuItem>Ẩn bài viết</DropdownMenuItem>
              <DropdownMenuItem>Báo cáo bài viết</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-0 pb-2">
          <p className="mb-3 px-4 whitespace-pre-wrap">{post.content}</p>

          {/* Reaction Bar */}
          <div className="mt-2 flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ThumbsUpIcon className="size-2.5 fill-current" />
              </div>
              <span>{likesCount}</span>
            </div>
            <div className="flex gap-3">
              <span
                className="cursor-pointer hover:underline"
                onClick={() => setCommentModalOpen(true)}
              >
                {post.commentCount} bình luận
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => setShareModalOpen(true)}
              >
                0 chia sẻ
              </span>
            </div>
          </div>

          <div className="px-4">
            <Separator />
          </div>

          {/* Action Buttons */}
          <div className="mt-1 flex justify-between px-2 py-1">
            <Button
              variant="ghost"
              className={cn("flex-1 rounded-sm text-muted-foreground", liked && "text-blue-500")}
              onClick={handleLikeClick}
              disabled={loadingId === post.id}
            >
              {liked ? (
                <ThumbsUpIcon data-icon="inline-start" className="fill-current" />
              ) : (
                <HeartIcon data-icon="inline-start" />
              )}
              Thích
            </Button>
            <Button
              variant="ghost"
              className="flex-1 rounded-sm text-muted-foreground"
              onClick={() => setCommentModalOpen(true)}
            >
              <MessageCircleIcon data-icon="inline-start" /> Bình luận
            </Button>
            <Button
              variant="ghost"
              className="flex-1 rounded-sm text-muted-foreground"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2Icon data-icon="inline-start" /> Chia sẻ
            </Button>
          </div>
        </CardContent>
      </Card>

      <CommentModal
        post={post}
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
      />

      <ShareModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </>
  );
}
