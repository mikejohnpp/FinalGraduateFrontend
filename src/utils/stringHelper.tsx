export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Đếm số từ trong chuỗi (tách theo khoảng trắng, bỏ qua chuỗi rỗng). */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Giới hạn chuỗi tối đa `maxWords` từ.
 * Giữ lại khoảng trắng đang gõ dở ở cuối để người dùng vẫn gõ tiếp được.
 */
export function limitWords(text: string, maxWords: number): string {
  const words = text.split(/(\s+)/); // giữ lại delimiter khoảng trắng
  let wordCount = 0;
  let result = "";
  for (const token of words) {
    if (token.trim()) {
      if (wordCount >= maxWords) break;
      wordCount++;
    }
    result += token;
  }
  return result;
}


export const safeDecodeURIComponent = (str: string) => {
  try {
    if (!str || str.trim().length === 0) return "";
    if (str.includes(" ")) return str;

    return decodeURIComponent(escape(window.atob(str)));
  } catch (e) {
    return str;
  }
};

export function formatShortTime(input: string): string {
  let date = new Date(input.replace(" ", "T"));
  if (isNaN(date.getTime())) return "";
  let now = new Date();

  let sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    let hh = String(date.getHours()).padStart(2, "0");
    let mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  } else {
    let d = String(date.getDate()).padStart(2, "0");
    let m = String(date.getMonth() + 1).padStart(2, "0");
    let y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }
}

export function timeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " năm trước";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " tháng trước";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    if (interval < 7) return interval + " ngày trước";
    return formatShortTime(isoString);
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " giờ trước";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " phút trước";
  return "Vừa xong";
}

export function formatYear(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `Tháng ${m}, ${y}`;
}
