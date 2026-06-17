import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGroupPendingPosts } from "@/hooks/useGroupAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, FileText, Check, X } from "lucide-react";
import { timeAgo } from "@/utils/stringHelper";
import type { IGroupAdminPost } from "@/types/interfaces/group/IGroupAdminPost";

function PendingPostCard({
  post,
  onApprove,
  onReject,
}: {
  post: IGroupAdminPost;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);

  const renderContent = () => {
    if (post.content.length > 200 && !expanded) {
      return (
        <p className="text-sm whitespace-pre-wrap">
          {post.content.substring(0, 200)}...{" "}
          <span
            className="cursor-pointer font-semibold text-muted-foreground hover:underline"
            onClick={() => setExpanded(true)}
          >
            Xem thêm
          </span>
        </p>
      );
    }
    return (
      <p className="text-sm whitespace-pre-wrap">
        {post.content}
        {expanded && (
          <span
            className="ml-2 cursor-pointer font-semibold text-muted-foreground hover:underline"
            onClick={() => setExpanded(false)}
          >
            Thu gọn
          </span>
        )}
      </p>
    );
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                <AvatarFallback>{post.authorName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{post.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  Đang chờ duyệt · {timeAgo(post.createdAt)}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mr-2 h-8 w-8 text-muted-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Bỏ qua bài viết này</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>{renderContent()}</div>

          <Separator className="my-3" />

          <div className="flex gap-2">
            <Button onClick={() => onApprove(post.id)} className="flex-1 gap-2">
              <Check className="size-4" /> Phê duyệt
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmRejectOpen(true)}
              className="flex-1 gap-2"
            >
              <X className="size-4" /> Từ chối
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmRejectOpen} onOpenChange={setConfirmRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Từ chối bài viết?</AlertDialogTitle>
            <AlertDialogDescription>
              Bài viết này sẽ không được đăng lên nhóm. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onReject(post.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function GroupPendingPosts() {
  const { groupId } = useParams<{ groupId: string }>();
  const { posts, loading, approvePost, rejectPost, loadMore, hasNext } = useGroupPendingPosts(
    groupId || "",
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold">Bài viết đang chờ</h1>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PendingPostCard
              key={post.id}
              post={post}
              onApprove={approvePost}
              onReject={rejectPost}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="rounded-full bg-muted p-4">
              <FileText className="size-12 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">Chưa có bài viết nào để xem xét</p>
            </div>
          </div>
        )}

        {hasNext && posts.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? "Đang tải..." : "Tải thêm"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
