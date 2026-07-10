import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon, MessageCircleIcon, ThumbsUpIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { IPost } from "@/types/interfaces/post/IPost";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { useLikePost } from "@/hooks/usePost";
import CommentModal from "./home/CommentModal";
import ShareModal from "./home/ShareModal";
import SentimentIndicator from "./home/SentimentIndicator";
import MediaGallery from "./media/MediaGallery";
import MediaLightbox from "./media/MediaLightbox";

export default function PostCard({ post }: { post: IPost }) {
  const [liked, setLiked] = useState(post.hasLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likeCount ?? 0);

  useEffect(() => {
    setLiked(post.hasLiked ?? false);

    setLikesCount(post.likeCount ?? 0);
  }, [post.hasLiked, post.likeCount]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  const { userId } = useSelector((state: RootState) => state.user);
  const { like, unlike, loadingId } = useLikePost();
  const navigate = useNavigate();

  const handleLikeClick = async () => {
    if (!userId || loadingId === post.id) return;

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

    const success = wasLiked ? await unlike(post.id, userId) : await like(post.id, userId);

    if (!success) {
      // Revert if API fails
      setLiked(wasLiked);
      setLikesCount((prev) => prev + (wasLiked ? 1 : -1));
    }
  };

  const groupName = post.group?.name;
  const authorName = post.author?.name || "Người dùng";

  const authorId = post.author?.id;
  const authorAvatar = post.author?.avatar || undefined;

  const handleNavigateToProfile = () => {
    if (authorId) navigate(`/profile/${authorId}`);
  };

  const handleNavigateToGroup = () => {
    if (post.group?.id) navigate(`/groups/${post.group.id}`);
  };

  // Nếu bài viết có ảnh/video xem được thì mở trang xem ảnh + bình luận (lightbox),
  // ngược lại thì mở modal bình luận thông thường.
  const hasViewableMedia =
    post.media?.some((m) => m.mediaType === "IMAGE" || m.mediaType === "VIDEO") ?? false;

  const handleOpenComments = () => {
    if (hasViewableMedia) {
      setLightbox({ open: true, index: 0 });
    } else {
      setCommentModalOpen(true);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-start justify-between px-4 pt-0 pb-2">
          <div className="flex gap-2">
            {post.group ? (
              <Avatar
                className="relative size-10 cursor-pointer overflow-visible border"
                onClick={handleNavigateToGroup}
              >
                <AvatarImage src={post.group.avatar || undefined} />
                <AvatarFallback>{groupName?.charAt(0) || "G"}</AvatarFallback>
                <Avatar
                  className="absolute -right-1 -bottom-1 size-5 cursor-pointer border-2 border-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToProfile();
                  }}
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
                  <p
                    className="cursor-pointer font-semibold hover:underline"
                    onClick={handleNavigateToGroup}
                  >
                    {groupName}
                  </p>
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
                    <span
                      className="cursor-pointer font-medium text-foreground hover:underline"
                      onClick={handleNavigateToProfile}
                    >
                      {authorName}
                    </span>
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

                <SentimentIndicator data={post} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 pb-0">
          {post.content && <p className="mb-3 px-4 whitespace-pre-wrap">{post.content}</p>}

          {post.media?.length > 0 && (
            <MediaGallery
              media={post.media}
              className="mb-3 px-4"
              onOpenLightbox={(index) => setLightbox({ open: true, index })}
            />
          )}

          {/* Reaction Bar */}

          <div className="mt-2 flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ThumbsUpIcon className="size-2.5 fill-current" />
              </div>
              <span>{likesCount}</span>
            </div>
            <div className="flex gap-3">
              <span className="cursor-pointer hover:underline" onClick={handleOpenComments}>
                {post.commentCount} bình luận
              </span>

              {/*
              <span
                className="cursor-pointer hover:underline"
                onClick={() => setShareModalOpen(true)}
              >
                0 chia sẻ
              </span>
              */}
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
              onClick={handleOpenComments}
            >
              <MessageCircleIcon data-icon="inline-start" /> Bình luận
            </Button>

            {/*
            <Button
              variant="ghost"
              className="flex-1 rounded-sm text-muted-foreground"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2Icon data-icon="inline-start" /> Chia sẻ
            </Button>
            */}
          </div>
        </CardContent>
      </Card>

      <CommentModal
        post={post}
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
      />

      <ShareModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} />

      {lightbox.open && (
        <MediaLightbox
          post={post}
          media={post.media}
          startIndex={lightbox.index}
          open={lightbox.open}
          onClose={() => setLightbox((s) => ({ ...s, open: false }))}
        />
      )}
    </>
  );
}
