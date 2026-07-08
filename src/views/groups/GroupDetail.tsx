import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGroupDetail,
  useGroupMembers,
  useSingleGroupPosts,
  useGroupActions,
} from "@/hooks/useGroup";
import GroupDetailHeader from "@/components/groups/GroupDetailHeader";
import GroupMembersTab from "@/components/groups/GroupMembersTab";
import PostCard from "@/components/PostCard";
import CreatePostCard from "@/components/home/CreatePostCard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe, Lock, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveUploadUrl } from "@/utils/uploadHelper";

const MAX_AVATAR_PREVIEW = 10;

export default function GroupDetail() {
  const { groupId: groupIdStr } = useParams();
  const groupId = Number(groupIdStr);

  const [activeTab, setActiveTab] = useState<"about" | "members">("about");

  const { group, loading: groupLoading, refetch: refetchGroup, setGroup } = useGroupDetail(groupId);
  const { members } = useGroupMembers(groupId);
  const {
    posts,
    loading: postsLoading,
    hasMore,
    loadMore,
    prependPost,
  } = useSingleGroupPosts(groupId);
  const { joinGroup, leaveGroup } = useGroupActions();

  if (groupLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 p-8">
        <Skeleton className="h-[300px] w-full rounded-b-lg" />
        <Skeleton className="h-[200px] w-full max-w-[1096px] rounded-xl" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy nhóm</h2>
        <p className="text-muted-foreground">
          Nhóm này có thể đã bị xóa hoặc bạn không có quyền truy cập.
        </p>
      </div>
    );
  }

  const handleJoin = async () => {
    const ok = await joinGroup(group);
    if (ok) refetchGroup();
  };

  const handleLeave = async () => {
    const ok = await leaveGroup(group.id);
    if (ok) refetchGroup();
  };

  const previewMembers = members.slice(0, MAX_AVATAR_PREVIEW);
  const remainingCount = group.memberCount - previewMembers.length;

  return (
    <div className="min-h-full bg-[#f0f2f5] pb-8 dark:bg-black/20">
      <GroupDetailHeader
        group={group}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onGroupUpdated={setGroup}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "about" ? (
        <div className="mx-auto mt-4 grid max-w-[1096px] grid-cols-1 items-start gap-4 px-4 md:px-8 lg:grid-cols-[2fr_3fr]">
          {/* Left Column - About */}
          <div className="space-y-4">
            <Card className="border-0 p-4 shadow-sm">
              <h3 className="mb-3 text-[17px] font-bold">Giới thiệu về nhóm này</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {group.privacy === "public" ? (
                    <Globe className="mt-0.5 h-6 w-6 opacity-70" />
                  ) : (
                    <Lock className="mt-0.5 h-6 w-6 opacity-70" />
                  )}
                  <div>
                    <p className="text-[15px] font-semibold">
                      {group.privacy === "public" ? "Công khai" : "Riêng tư"}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">
                      {group.privacy === "public"
                        ? "Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng."
                        : "Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col border-0 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[17px] font-bold">Thành viên</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("members")}
                  className="text-[13px] font-semibold text-primary hover:underline"
                >
                  Xem tất cả
                </button>
              </div>
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{group.memberCount.toLocaleString("vi-VN")} người</span>
              </div>
              <div className="mb-0 flex items-center -space-x-1.5 p-1">
                {previewMembers.map((m) => (
                  <Avatar key={m.userId} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={resolveUploadUrl(m.avatar) ?? undefined} alt={m.name} />
                    <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {remainingCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("members")}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-accent"
                    aria-label={`Xem thêm ${remainingCount} thành viên`}
                  >
                    +{remainingCount.toLocaleString("vi-VN")}
                  </button>
                )}
              </div>
              <Separator className="my-3" />

              {members
                .filter((m) => m.role === "ADMIN")
                .slice(0, 1)
                .map((admin) => (
                  <div key={admin.userId} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={resolveUploadUrl(admin.avatar) ?? undefined} alt={admin.name} />
                      <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[15px] font-semibold">{admin.name}</p>
                      <p className="text-[13px] text-muted-foreground">Quản trị viên</p>
                    </div>
                  </div>
                ))}
            </Card>
          </div>

          {/* Right Column - Feed */}
          <div className="space-y-4">
            {group.isJoined && (
              <div className="mb-4">
                <CreatePostCard groupId={group.id} onPostCreated={prependPost} />
              </div>
            )}

            {posts.map((post) => (
              <div key={post.id} className="overflow-hidden rounded-xl shadow-sm">
                <PostCard
                  post={{
                    ...post,
                    group: post.group || { id: group.id, name: group.name, avatar: group.avatar },
                  }}
                />
              </div>
            ))}

            {postsLoading && (
              <div className="space-y-4 pt-4">
                <Skeleton className="h-[200px] w-full rounded-xl bg-muted/50" />
              </div>
            )}

            {!postsLoading && hasMore && (
              <Button variant="outline" className="mt-4 w-full" onClick={loadMore}>
                Tải thêm bài viết
              </Button>
            )}

            {!postsLoading && posts.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  {group.privacy === "private" && !group.isJoined
                    ? "Đây là nhóm kín. Bạn cần tham gia để xem bài viết."
                    : "Chưa có bài viết nào trong nhóm này."}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-4 max-w-[1096px] px-4 md:px-8">
          <GroupMembersTab members={members} memberCount={group.memberCount} />
        </div>
      )}
    </div>
  );
}
