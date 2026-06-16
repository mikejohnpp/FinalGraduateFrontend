import { useState } from "react";
import type { GroupAdminDTO } from "@/services/adminService";
import type { SentimentFilter, SentimentLabel } from "@/types/interfaces/admin/ISentiment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  /** Bộ lọc đang được áp dụng (nguồn từ URL). */
  filter: SentimentFilter;
  groups: GroupAdminDTO[];
  /** Gọi khi nhấn "Áp dụng". */
  onApply: (next: SentimentFilter) => void;
  onReset: () => void;
}

const SENTIMENT_OPTIONS: { value: SentimentLabel | ""; label: string }[] = [
  { value: "", label: "Tất cả cảm xúc" },
  { value: "positive", label: "Tích cực" },
  { value: "neutral", label: "Trung lập" },
  { value: "negative", label: "Tiêu cực" },
];

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

/** Chuyển ISO string (có Z) sang giá trị cho input datetime-local và ngược lại. */
function toLocalInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export default function SentimentFilters({ filter, groups, onApply, onReset }: Props) {
  // Bản nháp cục bộ — chỉ áp dụng khi nhấn nút.
  // Component được remount qua key khi bộ lọc áp dụng (URL) đổi, nên khởi tạo trực tiếp từ filter.
  const [draft, setDraft] = useState<SentimentFilter>(filter);

  const set = (patch: Partial<SentimentFilter>) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleApply = () => onApply(draft);

  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Cảm xúc</label>
          <select
            className={selectClass}
            value={draft.sentiment ?? ""}
            onChange={(e) =>
              set({ sentiment: e.target.value ? (e.target.value as SentimentLabel) : undefined })
            }
          >
            {SENTIMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Nhóm</label>
          <select
            className={selectClass}
            value={draft.groupId ?? ""}
            onChange={(e) => set({ groupId: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">Toàn hệ thống</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Từ ngày</label>
          <Input
            type="datetime-local"
            value={toLocalInput(draft.fromDate)}
            onChange={(e) => set({ fromDate: fromLocalInput(e.target.value) })}
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Đến ngày</label>
          <Input
            type="datetime-local"
            value={toLocalInput(draft.toDate)}
            onChange={(e) => set({ toDate: fromLocalInput(e.target.value) })}
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Độ tin cậy tối thiểu</label>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.01}
            placeholder="0.0"
            value={draft.minConfidence ?? ""}
            onChange={(e) =>
              set({ minConfidence: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Độ tin cậy tối đa</label>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.01}
            placeholder="1.0"
            value={draft.maxConfidence ?? ""}
            onChange={(e) =>
              set({ maxConfidence: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>

        <div className="grid gap-1.5 md:col-span-2">
          <label className="text-sm font-medium">Từ khóa</label>
          <Input
            type="search"
            placeholder="Tìm trong nội dung..."
            value={draft.keyword ?? ""}
            onChange={(e) => set({ keyword: e.target.value || undefined })}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReset}>
          Xóa bộ lọc
        </Button>
        <Button onClick={handleApply}>Áp dụng</Button>
      </div>
    </div>
  );
}
