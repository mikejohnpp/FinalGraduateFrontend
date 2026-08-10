import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SentimentFilters from "@/components/admin/SentimentFilters";
import SentimentIndicator from "@/components/home/SentimentIndicator";
import { useGroupOptions, useSentimentItems, useContentModeration } from "@/hooks/useAdminStats";
import {
  parseItemType,
  parseSentimentFilter,
  sentimentFilterToParams,
} from "@/utils/sentimentParams";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import type { SentimentFilter, SentimentItemType } from "@/types/interfaces/admin/ISentiment";
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

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "lock" | "unlock";
    ids: number[];
  }>({ open: false, action: "lock", ids: [] });

  const { groups } = useGroupOptions();
  const { items, totalPages, totalElements, loading, refetch } = useSentimentItems(
    filter,
    type,
    page,
    PAGE_SIZE,
  );
  const { lockItems, unlockItems, loading: moderationLoading } = useContentModeration();

  const handleClearSelection = () => setSelected(new Set());

  // Ghi filter/type/page xuống URL — URL là nguồn sự thật.
  const writeParams = (next: SentimentFilter, nextType: SentimentItemType, nextPage: number) => {
    handleClearSelection();
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

  const handleConfirm = async () => {
    const { action, ids } = confirmDialog;
    if (ids.length === 0) return;

    let success = false;
    if (action === "lock") {
      success = await lockItems(type, ids);
    } else {
      success = await unlockItems(type, ids);
    }

    if (success) {
      handleClearSelection();
      refetch();
    }
    setConfirmDialog({ ...confirmDialog, open: false });
  };

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

      {selected.size > 0 && (
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-md border bg-card p-3 shadow-sm">
          <span className="text-sm font-medium">Đã chọn {selected.size} mục</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClearSelection}>
              Bỏ chọn
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setConfirmDialog({ open: true, action: "unlock", ids: Array.from(selected) })}
            >
              <Unlock className="mr-2 h-4 w-4" /> Mở khóa
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDialog({ open: true, action: "lock", ids: Array.from(selected) })}
            >
              <Lock className="mr-2 h-4 w-4" /> Khóa
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                <input
                  type="checkbox"
                  checked={items.length > 0 && selected.size === items.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(new Set(items.map((i) => i.id)));
                    } else {
                      setSelected(new Set());
                    }
                  }}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Loại</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nội dung</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cảm xúc</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tác giả</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nhóm</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Thời gian</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Trạng thái</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={9} className="h-24 text-center text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="border-b hover:bg-muted/50">
                  <td className="p-4 align-middle">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={(e) => {
                        const newSet = new Set(selected);
                        if (e.target.checked) newSet.add(item.id);
                        else newSet.delete(item.id);
                        setSelected(newSet);
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
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
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {item.isActive ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={item.isActive ? "Khóa" : "Mở khóa"}
                      onClick={() =>
                        setConfirmDialog({
                          open: true,
                          action: item.isActive ? "lock" : "unlock",
                          ids: [item.id],
                        })
                      }
                    >
                      {item.isActive ? (
                        <Lock className="h-4 w-4 text-destructive" />
                      ) : (
                        <Unlock className="h-4 w-4 text-green-600 dark:text-green-500" />
                      )}
                    </Button>
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

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận {confirmDialog.action === "lock" ? "khóa" : "mở khóa"} {confirmDialog.ids.length}{" "}
              {type === "post" ? "bài viết" : "bình luận"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === "lock"
                ? type === "post"
                  ? "Bài viết bị khóa sẽ không còn hiển thị với người dùng."
                  : "Bình luận bị khóa sẽ bị ẩn. Nếu khóa bình luận gốc, tất cả phản hồi (replies) cũng sẽ bị ẩn theo."
                : type === "post"
                  ? "Bài viết sẽ được hiển thị lại bình thường."
                  : "Bình luận sẽ được hiển thị lại bình thường."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={moderationLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={moderationLoading}
              className={
                confirmDialog.action === "lock"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {moderationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
