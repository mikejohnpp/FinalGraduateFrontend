import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import adminService, { type GroupAdminDTO } from "@/services/adminService";
import type {
  SentimentFilter,
  SentimentItemDTO,
  SentimentItemType,
  SentimentOverviewDTO,
} from "@/types/interfaces/admin/ISentiment";
import type { ReportOverviewDTO } from "@/types/interfaces/admin/IReport";

type ApiError = { response?: { status?: number; data?: { message?: string } } };

/** Thông báo lỗi chung dựa trên status code trả về. */
function notifyError(e: unknown, fallback: string) {
  const err = e as ApiError;
  const status = err?.response?.status;
  const message = err?.response?.data?.message;
  if (status === 400) {
    toast.error(message || "Bộ lọc không hợp lệ. Vui lòng kiểm tra lại.");
  } else if (status === 500) {
    toast.error("Lỗi máy chủ. Vui lòng thử lại sau.");
  } else {
    toast.error(message || fallback);
  }
}


/** Overview cảm xúc theo bộ lọc. */
export function useSentimentOverview(filter: SentimentFilter) {
  const [data, setData] = useState<SentimentOverviewDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const filterKey = JSON.stringify(filter);

  useEffect(() => {
    let isMounted = true;
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await adminService.getSentimentOverview(filter);
        if (isMounted && res?.success && res.data) {
          setData(res.data);
        }
      } catch (e: unknown) {
        if (isMounted) notifyError(e, "Không thể tải thống kê cảm xúc");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOverview();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  return { data, loading };
}

/** Danh sách chi tiết (drill-down) có phân trang. */
export function useSentimentItems(
  filter: SentimentFilter,
  type: SentimentItemType,
  page: number,
  size: number = 20,
) {
  const [items, setItems] = useState<SentimentItemDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  const filterKey = JSON.stringify(filter);

  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await adminService.getSentimentItems(filter, type, page, size);
        if (isMounted && res?.success && res.data) {
          setItems(res.data.data);
          setTotalPages(res.data.totalPages);
          setTotalElements(res.data.totalElements);
        }
      } catch (e: unknown) {
        if (isMounted) notifyError(e, "Không thể tải danh sách chi tiết");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchItems();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, type, page, size, refreshKey]);

  return { items, totalPages, totalElements, loading, refetch };
}

/** Số liệu tổng quan hệ thống cho dashboard báo cáo. */
export function useReportOverview() {
  const [data, setData] = useState<ReportOverviewDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await adminService.getReportOverview();
        if (isMounted && res?.success && res.data) {
          setData(res.data);
        }
      } catch (e: unknown) {
        if (isMounted) notifyError(e, "Không thể tải báo cáo hệ thống");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading };
}

/** Xuất báo cáo CSV: xử lý blob/download, kiểm tra Content-Type lỗi. */
export function useExportReport() {
  const [exporting, setExporting] = useState(false);

  const exportReport = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await adminService.exportReport();

      // Nếu server trả JSON lỗi thay vì CSV (Content-Type không phải text/csv)
      if (blob.type && blob.type.includes("application/json")) {
        const text = await blob.text();
        let message = "Không thể xuất báo cáo";
        try {
          const parsed = JSON.parse(text);
          message = parsed?.message || message;
        } catch {
          // giữ message mặc định
        }
        toast.error(message);
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `system-report-${today}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Đã tải báo cáo CSV");
    } catch (e: unknown) {
      notifyError(e, "Không thể xuất báo cáo");
    } finally {
      setExporting(false);
    }
  }, []);

  return { exportReport, exporting };
}

/** Danh sách nhóm cho dropdown lọc (lấy nhiều trang, gộp lại). */
export function useGroupOptions() {
  const [groups, setGroups] = useState<GroupAdminDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await adminService.getGroups(0, 200, "");
        if (isMounted && res?.success && res.data) {
          setGroups(res.data.data);
        }
      } catch {
        // dropdown lọc không bắt buộc, im lặng nếu lỗi
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchGroups();
    return () => {
      isMounted = false;
    };
  }, []);

  return { groups, loading };
}

/** Hook quản lý khóa/mở khóa nội dung. */
export function useContentModeration() {
  const [loading, setLoading] = useState(false);

  const lockItems = useCallback(async (type: SentimentItemType, ids: number[]) => {
    setLoading(true);
    try {
      const res = type === "post"
        ? await adminService.lockPosts(ids)
        : await adminService.lockComments(ids);
      if (res?.success) {
        toast.success(`Đã khóa ${ids.length} ${type === "post" ? "bài viết" : "bình luận"}`);
        return true;
      }
      toast.error(res?.message || "Khóa nội dung thất bại");
      return false;
    } catch (e) {
      notifyError(e, "Không thể khóa nội dung");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlockItems = useCallback(async (type: SentimentItemType, ids: number[]) => {
    setLoading(true);
    try {
      const res = type === "post"
        ? await adminService.unlockPosts(ids)
        : await adminService.unlockComments(ids);
      if (res?.success) {
        toast.success(`Đã mở khóa ${ids.length} ${type === "post" ? "bài viết" : "bình luận"}`);
        return true;
      }
      toast.error(res?.message || "Mở khóa nội dung thất bại");
      return false;
    } catch (e) {
      notifyError(e, "Không thể mở khóa nội dung");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lockItems, unlockItems, loading };
}
