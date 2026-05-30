/**
 * Ghép đường dẫn relative từ BE thành URL đầy đủ qua gateway.
 * VD: "/uploads/avatars/abc.jpg" → "http://localhost:8080/users/uploads/avatars/abc.jpg"
 *
 * Nếu path đã là URL đầy đủ (http/https) thì trả về nguyên.
 * Nếu path là null/undefined thì trả về null.
 */
export function resolveUploadUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = (import.meta.env.VITE_SERVER_API as string) || "http://localhost:8080";
  // Gateway strip /users prefix khi forward → ta dùng /users prefix
  return `${base}/users${path}`;
}
