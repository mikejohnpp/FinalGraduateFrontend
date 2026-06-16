import { Download, Loader2, Users, UsersRound, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExportReport, useReportOverview } from "@/hooks/useAdminStats";
import type { ReportOverviewDTO } from "@/types/interfaces/admin/IReport";

interface StatCard {
  label: string;
  value: number;
  sub?: string;
  Icon: typeof Users;
  color: string;
}

function buildCards(data: ReportOverviewDTO): StatCard[] {
  return [
    {
      label: "Người dùng",
      value: data.totalUsers,
      sub: `${data.activeUsers} hoạt động · ${data.inactiveUsers} bị khóa`,
      Icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Nhóm",
      value: data.totalGroups,
      sub: `${data.activeGroups} hoạt động`,
      Icon: UsersRound,
      color: "text-emerald-600",
    },
    {
      label: "Bài viết",
      value: data.totalPosts,
      Icon: FileText,
      color: "text-violet-600",
    },
    {
      label: "Bình luận",
      value: data.totalComments,
      Icon: MessageSquare,
      color: "text-amber-600",
    },
  ];
}

export default function SystemReport() {
  const { data, loading } = useReportOverview();
  const { exportReport, exporting } = useExportReport();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Báo cáo hệ thống</h2>
          <p className="text-sm text-muted-foreground">
            Số liệu tổng quan toàn hệ thống và xuất báo cáo CSV.
          </p>
        </div>
        <Button onClick={exportReport} disabled={exporting}>
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Xuất CSV
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !data ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Không có dữ liệu
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {buildCards(data).map((card) => (
            <div key={card.label} className="flex flex-col gap-2 rounded-md border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                <card.Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <span className="text-3xl font-bold">{card.value.toLocaleString("vi-VN")}</span>
              {card.sub && <span className="text-xs text-muted-foreground">{card.sub}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
