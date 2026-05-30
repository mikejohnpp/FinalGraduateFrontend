import { useParams } from "react-router-dom";
import { useGroupDetail, useGroupMembers, useSingleGroupPosts, useGroupActions } from "@/hooks/useGroup";
import GroupDetailHeader from "@/components/groups/GroupDetailHeader";
import PostCard from "@/components/PostCard";
import CreatePostCard from "@/components/home/CreatePostCard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe, Lock, History, Eye, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function GroupDetail() {
  const { groupId: groupIdStr } = useParams();
  const groupId = Number(groupIdStr);

  const { group, loading: groupLoading, refetch: refetchGroup } = useGroupDetail(groupId);
  const { members } = useGroupMembers(groupId);
  const { posts, loading: postsLoading, hasMore, loadMore, prependPost } = useSingleGroupPosts(groupId);
  const { joinGroup, leaveGroup } = useGroupActions();

  if (groupLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
        <Skeleton className="h-[300px] w-full rounded-b-lg" />
        <Skeleton className="h-[200px] w-full max-w-[1096px] rounded-xl" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy nhóm</h2>
        <p className="text-muted-foreground">Nhóm này có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
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

  return (
    <div className="min-h-full bg-[#f0f2f5] dark:bg-black/20 pb-8">
      <GroupDetailHeader group={group} onJoin={handleJoin} onLeave={handleLeave} />

      <div className="max-w-[1096px] mx-auto px-4 md:px-8 mt-4 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 items-start">
        {/* Left Column - About */}
        <div className="space-y-4">
          <Card className="p-4 border-0 shadow-sm">
            <h3 className="font-bold text-[17px] mb-3">Giới thiệu về nhóm này</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                {group.privacy === 'public' ? <Globe className="w-6 h-6 mt-0.5 opacity-70" /> : <Lock className="w-6 h-6 mt-0.5 opacity-70" />}
                <div>
                  <p className="font-semibold text-[15px]">{group.privacy === 'public' ? 'Công khai' : 'Riêng tư'}</p>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    {group.privacy === 'public' 
                      ? 'Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.' 
                      : 'Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Eye className="w-6 h-6 mt-0.5 opacity-70" />
                <div>
                  <p className="font-semibold text-[15px]">Hiển thị</p>
                  <p className="text-[13px] text-muted-foreground mt-0.5">Ai cũng có thể tìm nhóm này.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <History className="w-6 h-6 mt-0.5 opacity-70" />
                <div>
                  <p className="font-semibold text-[15px]">Lịch sử</p>
                  <p className="text-[13px] text-muted-foreground mt-0.5">Nhóm được tạo gần đây.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[17px]">Thành viên</h3>
              <p className="text-muted-foreground text-sm cursor-pointer hover:bg-muted p-1.5 rounded">Xem tất cả</p>
            </div>
            <div className="flex items-center gap-2 text-sm mb-4">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span>{group.memberCount.toLocaleString('vi-VN')} người</span>
            </div>
            <div className="flex -space-x-1.5 p-1 mb-2">
              {members.slice(0, 12).map((m, i) => (
                <Avatar key={m.userId} className="w-8 h-8 border-2 border-background">
                  <AvatarImage src={m.avatar || `https://i.pravatar.cc/100?img=${i + 30}`} />
                  <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Separator className="my-3" />
            
            {members.filter(m => m.role === 'ADMIN').slice(0, 1).map(admin => (
              <div key={admin.userId} className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={admin.avatar || `https://i.pravatar.cc/100?img=12`} />
                </Avatar>
                <div>
                  <p className="font-semibold text-[15px]">{admin.name}</p>
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

          {posts.map(post => (
            <div key={post.id} className="shadow-sm rounded-xl overflow-hidden">
              <PostCard 
                post={{
                  ...post, 
                  group: post.group || { id: group.id, name: group.name, avatar: group.avatar }
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
            <Button variant="outline" className="w-full mt-4" onClick={loadMore}>
              Tải thêm bài viết
            </Button>
          )}

          {!postsLoading && posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có bài viết nào trong nhóm này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
