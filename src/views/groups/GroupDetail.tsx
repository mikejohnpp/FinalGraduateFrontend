import { useParams } from "react-router-dom";
import { joinedGroups, suggestedGroups } from "@/data/mock/groupsMock";
import { groupPosts } from "@/data/mock/groupPostsMock";
import GroupDetailHeader from "@/components/groups/GroupDetailHeader";
import GroupPostCard from "@/components/groups/GroupPostCard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe, Lock, History, Eye, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function GroupDetail() {
  const { groupId } = useParams();

  // Find the group in mock data
  const group = joinedGroups.find(g => g.id === groupId) || suggestedGroups.find(g => g.id === groupId);

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy nhóm</h2>
        <p className="text-muted-foreground">Nhóm này có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
      </div>
    );
  }

  // Filter posts for this group (mock)
  const posts = groupPosts.filter(p => p.groupId === groupId);
  // If no posts specifically for this group, show some generic posts
  const displayPosts = posts.length > 0 ? posts : groupPosts.slice(0, 3);

  return (
    <div className="min-h-full bg-[#f0f2f5] dark:bg-black/20 pb-8">
      <GroupDetailHeader group={group} />

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
                  <p className="text-[13px] text-muted-foreground mt-0.5">Nhóm được tạo vào ngày 15 tháng 1, 2020.</p>
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
              {[...Array(12)].map((_, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-background">
                  <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 30}`} />
                  <AvatarFallback />
                </Avatar>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`https://i.pravatar.cc/100?img=12`} />
              </Avatar>
              <div>
                <p className="font-semibold text-[15px]">Nguyễn Văn Admin</p>
                <p className="text-[13px] text-muted-foreground">Quản trị viên</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Feed */}
        <div className="space-y-4">
          {group.isJoined && (
            <Card className="p-3 flex gap-2 border-0 shadow-sm mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://i.pravatar.cc/100?u=me" />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted/70 hover:bg-muted/90 rounded-full px-4 flex items-center text-muted-foreground text-[15px] cursor-pointer transition-colors">
                Bạn đang nghĩ gì?
              </div>
            </Card>
          )}

          {displayPosts.map(post => (
            <div key={post.id} className="shadow-sm rounded-xl overflow-hidden">
              <GroupPostCard post={{...post, groupName: group.name, groupId: group.id}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
