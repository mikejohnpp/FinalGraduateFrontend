import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SentimentFilters from "@/components/admin/SentimentFilters";
import SentimentIndicator from "@/components/home/SentimentIndicator";
import { useGroupOptions, useSentimentItems } from "@/hooks/useAdminStats";
import {
  parseItemType,
  parseSentimentFilter,
  sentimentFilterToParams,
} from "@/utils/sentimentParams";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import type { SentimentFilter, SentimentItemType } from "@/types/interfaces/admin/ISentiment";

const PAGE_SIZE = 20;

export default function SentimentItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const filter = useMemo(() => parseSentimentFilter(searchParams), [searchParams]);
  const type = useMemo(() => parseItemType(searchParams), [searchParams]);
  const page = useMemo(() => {
    const raw = Number(searchParams.get("page"));
    return Number.isNaN(raw) || raw < 0 ? 0 : raw;
  }, [searchParams]);

  const { groups } = useGroupOptions();
  const { items, totalPages, totalElements, loading } = useSentimentItems(
    filter,
    type,
    page,
    PAGE_SIZE,
  );

  // Ghi filter/type/page xuống URL — URL là nguồn sự thật.
  const writeParams = (next: SentimentFilter, nextType: SentimentItemType, nextPage: number) => {
    const params = sentimentFilterToParams(next);
    params.type = nextType;
    if (nextPage > 0) params.page = String(nextPage);
    setSearchParams(params);
  };

  // Đổi filter hoặc type thì về trang đầu.
  const applyFilter = (next: SentimentFilter) => writeParams(next, type, 0);
  const resetFilter = () => writeParams({}, type, 0);
  const switchType = (nextType: SentimentItemType) => writeParams(filter, nextType, 0);
  const goToPage = (nextPage: number) => writeParams(filter, type, nextPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/sentiment")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chi tiết cảm xúc</h2>
          <p className="text-sm text-muted-foreground">
            {totalElements} kết quả {type === "post" ? "bài viết" : "bình luận"}
          </p>
        </div>
      </div>

      <SentimentFilters
        key={JSON.stringify(filter)}
        filter={filter}
        groups={groups}
        onApply={applyFilter}
        onReset={resetFilter}
      />

      <div className="flex gap-2">
        <Button
          variant={type === "post" ? "default" : "outline"}
          size="sm"
          onClick={() => switchType("post")}
        >
          Bài viết
        </Button>
        <Button
          variant={type === "comment" ? "default" : "outline"}
          size="sm"
          onClick={() => switchType("comment")}
        >
          Bình luận
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Loại
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Nội dung
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Cảm xúc
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Tác giả
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Nhóm
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-24 text-center text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="border-b hover:bg-muted/50">
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {item.type === "POST" ? "Bài viết" : "Bình luận"}
                    </span>
                  </td>
                  <td className="max-w-xs p-4 align-middle">
                    <p className="line-clamp-2 text-muted-foreground">{item.content}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <SentimentIndicator
                      data={{
                        sentiment: item.sentiment,
                        confidence: item.confidence,
                        cancelReason: null,
                      }}
                    />
                  </td>
                  <td className="p-4 align-middle">{item.authorName}</td>
                  <td className="p-4 align-middle">{item.groupName ?? "—"}</td>
                  <td className="p-4 align-middle whitespace-nowrap text-muted-foreground">
                    {dinhDangThoiGian(item.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Trước
        </Button>
        <div className="text-sm text-muted-foreground">
          Trang {page + 1} / {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
