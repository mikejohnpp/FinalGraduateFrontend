import { useParams, useNavigate } from "react-router-dom";
import { useGroupStats } from "@/hooks/useGroupAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Flag,
  Bell,
  FileText,
  Users,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";

export default function GroupOverview() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { stats, loading } = useGroupStats(groupId || "");

  if (loading || !stats) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-[250px] flex-1 rounded-xl" />
          <Skeleton className="h-[250px] flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  const reviewItems = [
    {
      label: "Bài viết đang chờ",
      icon: FileText,
      value: stats.pendingPosts,
      path: "pending-posts",
      color: "text-muted-foreground",
      isStatus: false,
    },
    {
      label: "Yêu cầu làm thành viên",
      icon: Users,
      value: stats.memberRequests,
      path: "member-requests",
      color: "text-muted-foreground",
      isStatus: false,
    },
  ];

  const totalReviews = reviewItems.reduce(
    (acc, item) => (item.isStatus ? acc : acc + item.value),
    0,
  );

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="size-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="size-4 text-red-500" />;
    return <Minus className="size-4 text-muted-foreground" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold">Tổng quan</h1>

      {/* Cần xem xét */}
      <Card className="shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div>
            <h2 className="text-lg font-semibold">Cần xem xét</h2>
            <p className="text-sm text-muted-foreground">
              {totalReviews === 0
                ? "0 thông tin mới cần xem xét"
                : `${totalReviews} thông tin cần xem xét`}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {reviewItems.map((item, idx) => (
              <Card
                key={idx}
                className="cursor-pointer border shadow-sm transition-colors hover:bg-accent/50"
                onClick={() => navigate(`/groups/${groupId}/admin/${item.path}`)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2">
                      <item.icon className={`size-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.isStatus
                          ? `${item.value} trường hợp vi phạm`
                          : `${item.value} mục mới hôm nay`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isStatus && <div className="size-2 rounded-full bg-blue-500"></div>}
                    <span className="font-semibold">{item.value}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Tóm tắt */}
        <Card className="flex-1 shadow-sm">
          <CardContent className="flex h-full flex-col space-y-4 p-5">
            <div>
              <h2 className="text-lg font-semibold">Tóm tắt thông tin chi tiết</h2>
              <p className="text-sm text-muted-foreground">Trong 7 ngày qua</p>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground" />
                  <span className="font-medium">Bài viết</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{stats.weeklyPosts}</span>
                  <div
                    className={`flex items-center text-xs font-medium ${getChangeColor(stats.weeklyPostsChange)}`}
                  >
                    {getChangeIcon(stats.weeklyPostsChange)}
                    <span>{Math.abs(stats.weeklyPostsChange)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <MessageSquare className="size-5 text-muted-foreground" />
                  <span className="font-medium">Bình luận</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{stats.weeklyComments}</span>
                  <div
                    className={`flex items-center text-xs font-medium ${getChangeColor(stats.weeklyCommentsChange)}`}
                  >
                    {getChangeIcon(stats.weeklyCommentsChange)}
                    <span>{Math.abs(stats.weeklyCommentsChange)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <ThumbsUp className="size-5 text-muted-foreground" />
                  <span className="font-medium">Cảm xúc</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{stats.weeklyReactions}</span>
                  <div
                    className={`flex items-center text-xs font-medium ${getChangeColor(stats.weeklyReactionsChange)}`}
                  >
                    {getChangeIcon(stats.weeklyReactionsChange)}
                    <span>{Math.abs(stats.weeklyReactionsChange)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thành viên hoạt động */}
        <Card className="flex-1 shadow-sm">
          <CardContent className="flex h-full flex-col space-y-4 p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Thành viên hoạt động hàng tuần</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Số lượng thành viên đã xem, đăng bài, bình luận hoặc bày tỏ cảm xúc trong
                        nhóm.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{stats.activeMembers} trong 7 ngày qua</span>
                <div
                  className={`flex items-center font-medium ${getChangeColor(stats.activeMembersChange)}`}
                >
                  {getChangeIcon(stats.activeMembersChange)}
                  <span>{Math.abs(stats.activeMembersChange)}%</span>
                </div>
              </div>
            </div>

            <div className="h-[200px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.weeklyActivity}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    dy={10}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
