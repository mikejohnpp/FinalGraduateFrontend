import { useState } from "react"
import {
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
  ThumbsUpIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Post } from "@/types/HomeFeed"
import CommentModal from "./CommentModal"
import EmojiPicker from "./EmojiPicker"
import ShareModal from "./ShareModal"

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const handleLikeClick = () => {
    if (liked) {
      setLiked(false)
      setLikesCount((c) => c - 1)
    } else {
      setLiked(true)
      setLikesCount((c) => c + 1)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={post.author.avatarUrl} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{post.author.name}</span>
            <span className="text-xs text-muted-foreground">{post.time}</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post image"
              className="w-full rounded-lg object-cover"
            />
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              {liked ? (
                <ThumbsUpIcon className="size-3 text-blue-500" />
              ) : (
                <HeartIcon className="size-3" />
              )}
              {likesCount}
            </span>
            <button
              type="button"
              className="hover:underline"
              onClick={() => setCommentModalOpen(true)}
            >
              {post.comments} bình luận
            </button>
          </div>

          <div className="flex w-full items-center justify-around border-t pt-2">
            <div
              className="relative"
              onMouseEnter={() => setShowEmojiPicker(true)}
              onMouseLeave={() => setShowEmojiPicker(false)}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeClick}
                className={cn(liked && "text-blue-500")}
              >
                {liked ? (
                  <ThumbsUpIcon data-icon="inline-start" className="fill-current" />
                ) : (
                  <HeartIcon data-icon="inline-start" />
                )}
                Thích
              </Button>
              <EmojiPicker
                open={showEmojiPicker}
                onSelect={() => {
                  if (!liked) {
                    setLiked(true)
                    setLikesCount((c) => c + 1)
                  }
                  setShowEmojiPicker(false)
                }}
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCommentModalOpen(true)}
            >
              <MessageCircleIcon data-icon="inline-start" />
              Bình luận
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2Icon data-icon="inline-start" />
              Chia sẻ
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommentModal
        post={post}
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
      />

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  )
}
