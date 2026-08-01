import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import SentimentFilters from "@/components/admin/SentimentFilters";
import { useGroupOptions, useSentimentOverview } from "@/hooks/useAdminStats";
import {
  parseSentimentFilter,
  sentimentFilterToParams,
} from "@/utils/sentimentParams";
import type {
  SentimentFilter,
  SentimentItemType,
  SentimentLabel,
  SentimentOverviewDTO,
} from "@/types/interfaces/admin/ISentiment";

const SENTIMENT_META: Record<SentimentLabel, { label: string; color: string }> = {
  positive: { label: "Tích cực", color: "#22c55e" },
  neutral: { label: "Trung lập", color: "#9ca3af" },
  negative: { label: "Tiêu cực", color: "#ef4444" },
};

interface Slice {
  key: SentimentLabel;
  name: string;
  value: number;
  color: string;
}

function buildSlices(
  overview: SentimentOverviewDTO,
  type: SentimentItemType,
): Slice[] {
  const map: Record<SentimentLabel, number> =
    type === "post"
      ? {
          positive: overview.positivePosts,
          neutral: overview.neutralPosts,
          negative: overview.negativePosts,
        }
      : {
          positive: overview.positiveComments,
          neutral: overview.neutralComments,
          negative: overview.negativeComments,
        };

  return (Object.keys(SENTIMENT_META) as SentimentLabel[]).map((key) => ({
    key,
    name: SENTIMENT_META[key].label,
    value: map[key],
    color: SENTIMENT_META[key].color,
  }));
}

export default function SentimentStats() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const filter = useMemo(() => parseSentimentFilter(searchParams), [searchParams]);
  const { data, loading } = useSentimentOverview(filter);
  const { groups } = useGroupOptions();

  const applyFilter = (next: SentimentFilter) => {
    setSearchParams(sentimentFilterToParams(next));
  };

  const resetFilter = () => setSearchParams({});

  const drillDown = (type: SentimentItemType, sentiment?: SentimentLabel) => {
    const params = sentimentFilterToParams({ ...filter, sentiment });
    params.type = type;
    navigate(`/admin/sentiment/items?${new URLSearchParams(params).toString()}`);
  };

  const postSlices = data ? buildSlices(data, "post") : [];
  const commentSlices = data ? buildSlices(data, "comment") : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Thống kê cảm xúc</h2>
        <p className="text-sm text-muted-foreground">
          Nhấn vào một phần của biểu đồ để xem chi tiết bài viết hoặc bình luận.
        </p>
      </div>

      <SentimentFilters
        key={JSON.stringify(filter)}
        filter={filter}
        groups={groups}
        onApply={applyFilter}
        onReset={resetFilter}
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !data ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Không có dữ liệu
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <SentimentPieCard
            title="Bài viết"
            total={data.totalPosts}
            slices={postSlices}
            onSliceClick={(s) => drillDown("post", s.key)}
            onViewAll={() => drillDown("post")}
          />
          <SentimentPieCard
            title="Bình luận"
            total={data.totalComments}
            slices={commentSlices}
            onSliceClick={(s) => drillDown("comment", s.key)}
            onViewAll={() => drillDown("comment")}
          />
        </div>
      )}
    </div>
  );
}

interface PieCardProps {
  title: string;
  total: number;
  slices: Slice[];
  onSliceClick: (slice: Slice) => void;
  onViewAll: () => void;
}

function SentimentPieCard({ title, total, slices, onSliceClick, onViewAll }: PieCardProps) {
  const hasData = total > 0;

  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={onViewAll}
        >
          Xem tất cả ({total})
        </button>
      </div>

      {!hasData ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Chưa có dữ liệu đã gán nhãn
        </div>
      ) : (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  onClick={(_, index) => onSliceClick(slices[index])}
                  className="cursor-pointer"
                >
                  {slices.map((s) => (
                    <Cell key={s.key} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {slices.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => onSliceClick(s)}
                className="flex flex-col items-center rounded-md border p-2 transition-colors hover:bg-muted/50"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="text-lg font-semibold">{s.value}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
